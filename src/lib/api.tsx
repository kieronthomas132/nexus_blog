import {account, appwriteConfig, avatars, databases, storage,} from "./config.tsx";
import {ID, Query} from "appwrite";

export interface INewUser {
  username: string;
  name: string;
  email: string;
  password: string;
}

export type INewPost = {
  userId: string;
  title: string;
  imageURL?: string;
  imageId?: string;
  content: string;
};

export const createUserAccount = async (user: INewUser) => {
  const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name,
  );

  if (!newAccount) {
    throw new Error("Failed to create a new account");
  }

  const avatar = avatars.getInitials(user.name);

  return saveUserToDB({
    accountId: newAccount.$id,
    name: newAccount.name,
    email: newAccount.email,
    profilePic: avatar,
    username: user.username,
  });
};

export const saveUserToDB = async (user: {
  accountId: string;
  name: string;
  username: string;
  profilePic: URL;
  email: string;
}) => {
    return await databases.createDocument(
      appwriteConfig.DATABASE_ID,
      appwriteConfig.USERS_COLLECTION_ID,
      ID.unique(),
      user,
    );
};

export const getCurrentAccount = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) {
      new Error("Failed to create new account");
    }

    const currentUser = await databases.listDocuments(
      appwriteConfig.DATABASE_ID,
      appwriteConfig.USERS_COLLECTION_ID,
      [Query.equal("accountId", currentAccount.$id)],
    );

    if (!currentUser) {
      new Error("Could not find current user");
    }

    return currentUser.documents[0];
  } catch (err) {
    new Error("Could not find current user");
  }
};

export const signInAccount = async (user: {
  email: string;
  password: string;
}) => {
  try {
    const signInAccount = await account.createEmailSession(
      user.email,
      user.password,
    );

    if (!signInAccount) {
      new Error("Could not sign into account");
    }

    return signInAccount;
  } catch (err) {
    new Error("Could not sign into account");
  }
};

export const logoutUser = async () => {
  return await account.deleteSession("current");
};

export const updateName = async (profileId: string, name: string) => {
  try {
    const profile = await databases.updateDocument(
      appwriteConfig.DATABASE_ID,
      appwriteConfig.USERS_COLLECTION_ID,
      profileId,
      { name: name },
    );

    if (!profile) {
      new Error("Could not update name");
    }

    return profile;
  } catch (err) {
    new Error("Could not update name");
  }
};

export const updateUsername = async (profileId: string, username: string) => {
  try {
    const profiles = await databases.listDocuments(
        appwriteConfig.DATABASE_ID,
        appwriteConfig.USERS_COLLECTION_ID
    );

    const exists = profiles.documents.find((user) => user.username === username);

    if (exists) {
       new Error("Username already exists");
    }

    const profile = await databases.updateDocument(
        appwriteConfig.DATABASE_ID,
        appwriteConfig.USERS_COLLECTION_ID,
        profileId,
        { username: username }
    );

    if (!profile) {
       new Error("Could not update username");
    }

    return true;
  } catch (error) {
    return false;
  }
};

export const updateBio = async (profileId: string, bio: string) => {
  try {
    const profile = await databases.updateDocument(
      appwriteConfig.DATABASE_ID,
      appwriteConfig.USERS_COLLECTION_ID,
      profileId,
      {
        bio,
      },
    );

    if (!profile) {
      new Error("Could not update bio");
    }

    return profile;
  } catch (err) {
    new Error("Could not update bio");
  }
};

export const updateProfilePic = async (
  profileId: string | undefined,
  profilePicFile: File | null,
) => {
    const storedProfilePic = await storage.createFile(
      appwriteConfig.STORAGE_COLLECTION_ID,
      ID.unique(),
      profilePicFile as File,
    );

    const getProfilePic = storage.getFileView(
      appwriteConfig.STORAGE_COLLECTION_ID,
      storedProfilePic.$id,
    );

    return await databases.updateDocument(
      appwriteConfig.DATABASE_ID,
      appwriteConfig.USERS_COLLECTION_ID,
      profileId || "",
      { profilePic: getProfilePic },
    );
};

export const createNewPost = async (post: INewPost) => {
  try {
    const newPost = await databases.createDocument(
      appwriteConfig.DATABASE_ID,
      appwriteConfig.POSTS_COLLECTION_ID,
      ID.unique(),
      {
        creator: post.userId,
        title: post.title,
        content: post.content,
        imageId: post.imageId,
        imageURL: post.imageURL,
      },
    );

    if (!newPost) {
      new Error("Could not create new post");
    }

    return newPost;
  } catch (err) {
    new Error("Could not create new post");
  }
};

export const getPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.DATABASE_ID,
      appwriteConfig.POSTS_COLLECTION_ID,
      [
        Query.orderDesc("$createdAt"),
        Query.limit(10),
        Query.isNotNull("creator"),
      ],
    );

    if (!posts || !posts.documents) {
      new Error("Could not find posts");
    }

    return posts.documents;
  } catch (err) {
    new Error("Could not find posts");
  }
};

export const getPostById = async (postId: string) => {
  try {
    const post = await databases.getDocument(
      appwriteConfig.DATABASE_ID,
      appwriteConfig.POSTS_COLLECTION_ID,
      postId,
    );

    if (!post) {
      new Error("Could not get post");
    }

    return post;
  } catch (err) {
    new Error("Could not get post");
  }
};

export const deletePost = async (postId: string) => {
  try {
    const deletedPost = await databases.deleteDocument(
      appwriteConfig.DATABASE_ID,
      appwriteConfig.POSTS_COLLECTION_ID,
      postId,
    );

    if (!deletedPost) {
      new Error("Failed to delete post");
    }

    return deletedPost;
  } catch (err) {
    new Error("Failed to delete post");
  }
};

export const likePost = async (postId: string, likesArray: string[]) => {
  try {
    const likedPost = await databases.updateDocument(
      appwriteConfig.DATABASE_ID,
      appwriteConfig.POSTS_COLLECTION_ID,
      postId,
      {
        likes: likesArray,
      },
    );

    if (!likedPost) {
      new Error("Failed to like post");
    }

    return likedPost;
  } catch (err) {
    new Error("Failed to like post");
  }
};

export const getComments = async () => {
  try {
    const comments = await databases.listDocuments(
      appwriteConfig.DATABASE_ID,
      appwriteConfig.COMMENTS_COLLECTION_ID,
      [
        Query.orderDesc("$createdAt"),
        Query.limit(10),
        Query.isNotNull("commenter"),
      ],
    );

    if (!comments) {
      new Error("Could not get comments");
    }

    return comments.documents;
  } catch (err) {
    new Error("Could not get comments");
  }
};

export const createComment = async (
  postId: string,
  comment: string,
  commenter: string,
) => {
  try {
    const newComment = await databases.createDocument(
      appwriteConfig.DATABASE_ID,
      appwriteConfig.COMMENTS_COLLECTION_ID,
      ID.unique(),
      {
        post: postId,
        comment,
        commenter,
      },
    );

    if (!newComment) {
      new Error("Could not create new comment");
    }

    return newComment;
  } catch (err) {
    new Error("Could not create new comment");
  }
};

export const deleteComment = async (commentId: string) => {
  try {
    const comment = await databases.deleteDocument(
      appwriteConfig.DATABASE_ID,
      appwriteConfig.COMMENTS_COLLECTION_ID,
      commentId,
    );

    if (!comment) {
      new Error("Could not delete comment");
    }

    return comment;
  } catch (err) {
    new Error("Could not delete comment");
  }
};

export const getReplies = async () => {
  try {
    const replies = await databases.listDocuments(
      appwriteConfig.DATABASE_ID,
      appwriteConfig.REPLIES_COLLECTION_ID,
    );

    if (!replies) {
      new Error("Could not get replies");
    }

    return replies.documents;
  } catch (err) {
    throw new Error("Could not get replies");
  }
};

export const createReply = async (
  commentId: string,
  replyValue: string,
  replier: string,
  repliedComment: string,
) => {
  try {
    const newReply = await databases.createDocument(
      appwriteConfig.DATABASE_ID,
      appwriteConfig.REPLIES_COLLECTION_ID,
      ID.unique(),
      {
        commentId: commentId,
        reply: replyValue,
        replier: replier,
        repliedComment: repliedComment,
      },
    );

    if (!newReply) {
      new Error("Could not create new reply");
    }

    return newReply;
  } catch (err) {
    new Error("Could not create new reply");
  }
};

export const deleteReply = async (replyId: string) => {
  try {
    const deletedReply = await databases.deleteDocument(
      appwriteConfig.DATABASE_ID,
      appwriteConfig.REPLIES_COLLECTION_ID,
      replyId,
    );

    if (!deletedReply) {
      new Error("Could not create new reply");
    }

    return deletedReply;
  } catch (err) {
    new Error("Could not create new reply");
  }
};

export const getProfiles = async () => {
  try{
    const profiles = await databases.listDocuments(appwriteConfig.DATABASE_ID, appwriteConfig.USERS_COLLECTION_ID)

    return profiles.documents
  }catch (err) {
    throw Error
  }
}


export const getProfileById = async (profileId: string) => {
  try {
    const profile = await databases.getDocument(
      appwriteConfig.DATABASE_ID,
      appwriteConfig.USERS_COLLECTION_ID,
      profileId,
    );

    if (!profile) {
      new Error("Could not get profile");
    }

    return profile;
  } catch (err) {
    new Error("Could not get profile");
  }
};

export const searchProfiles = async (searchQuery: string) => {
  try {
    const profiles = await databases.listDocuments(
      appwriteConfig.DATABASE_ID,
      appwriteConfig.USERS_COLLECTION_ID,
      [Query.search("name", searchQuery)],
    );

    if (!profiles) {
      new Error("Could not get profiles");
    }
    return profiles.documents;
  } catch (err) {
    new Error("Could not get profiles");
  }
};
