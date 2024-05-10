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

/**
 * Creates a user account with the provided details.
 *
 * @param {INewUser} user - The details of the user to create the account for.
 *                           Requires a valid object with the following properties:
 *                           - 'username': The username for the new account.
 *                           - 'name': The full name for the new account.
 *                           - 'email': The email address for the user.
 *                           - 'password': The password for the new account.
 * @returns {Promise<Object>} A Promise resolving to the new user saved to the database.
 *                            The returned object contains the following properties:
 *                            - 'accountId': The unique identifier of the created account.
 *                            - 'name': The name associated with the account.
 *                            - 'email': The email address for the user.
 *                            - 'profilePic': The initials avatar for the user's profile picture.
 *                            - 'username': The username associated with the account.
 * @throws {Error} If the account creation fails due to any reason.
 */

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


/**
 * Retrieves the details of the currently logged-in user.
 *
 * @returns {Promise<Object|null>} A Promise resolving to the user details associated with the current account,
 *                                 or `undefined` if the user is not found.
 *                                 The returned object contains the following properties:
 *                                 - 'accountId': The unique identifier of the user's account.
 *                                 - 'name': The name of the associated user.
 *                                 - 'email': The email address of the associated user.
 *                                 - 'username': The username of the associated user.
 * @throws {Error} If there is an issue retrieving the current account or user details.
 *                 Possible error conditions include:
 *                 - Failed to retrieve the current account details.
 *                 - The current account does not exist or could not be found.
 *                 - An unexpected error occurred during data retrieval.
 */

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


/**
 * Signs in the current user using the provided email and password.
 *
 * @param {Object} user An object containing the user's email and password for authentication.
 *                      Requires the following parameters:
 *                      - 'email' {string} - The email address associated with the user account.
 *                      - 'password' {string} - The password associated with the user account.
 * @returns {Promise<Object>} A Promise resolving to the session details after successful sign-in.
 *                            The returned object contains information about the user session.
 * @throws {Error} If any of the following conditions are met:
 *                 - Failed to create the session using the provided user parameters.
 *                 - The sign-in process did not return valid session details.
 *                 - An unexpected error occurred during the sign-in process.
 */
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

export const deleteAccount = async (userId: string) => {
  try{
    const account =  databases.deleteDocument(appwriteConfig.DATABASE_ID, appwriteConfig.USERS_COLLECTION_ID, userId)

    if(!account) {
      new Error("Could not delete account");
    }
  }catch (err) {
    console.log(err)
  }
}

/**
 * Logs out the current user by removing the active session.
 *
 * @returns {Promise<void>} A Promise resolving after successfully logging out the user.
 *                          The function removes the active session associated with the current user.
 * @throws {Error} If any error occurs during the logging out process.
 *                 Possible error conditions include session deletion failures.
 */

export const logoutUser = async ()=> {
  return await account.deleteSession("current");
};

/**
 * Updates the name of the current active user identified by the provided profile ID.
 *
 * @param {string} profileId The unique identifier of the user profile to update.
 *                           This ID is used to locate the specific user profile in the database for updating.
 * @param {string} name The new name to assign to the current user profile.
 *                      This value will replace the current name associated with the profile.
 * @returns {Promise<object>} A Promise resolving to the updated user profile document after a successful update.
 *                            The returned object contains the updated details of the user profile, including the updated 'name' field.
 * @throws {Error} If any of the following conditions are met:
 *                 - Failed to retrieve or update the user profile due to database or network errors.
 */
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

/**
 * Updates the username of the current active user identified by the provided profile ID.
 *
 * @param {string} profileId The unique identifier of the user profile to update.
 *                            This ID is used to locate the specific user profile in the database for updating.
 * @param {string} username The new username to assign to the user profile.
 *                           This value will replace the current username of the associated profile.
 * @returns {Promise<boolean>} A Promise resolving to a boolean value indicating the success status of the username update.
 *                             Returns 'true' if the username update was successful, otherwise 'false'.
 * @throws {Error} If any of the following conditions are met:
 *                 - The specified username already exists for another user in the database.
 *                 - Failed to retrieve or update the user profile due to database or network errors.
 */

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

/**
 * Updates the bio of the current user identified via the provided profile ID.
 * @param profileId The identifier of the user profile to update.
 *        This ID is used to locate the specific user in the database.
 * @param bio The new bio to be assigned to the user profile.
 *        This value will be used to replace the existing user bio associated with the profile.
 * @returns Promise resolving in the updated profile after a successful update.
 *          The returned object contains the updated details of the user profile,
 *          including the updated 'bio' field.
 */
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

/**
 * Updates the bio of the current user identified by the provided profile ID.
 *
 * @param {string} profileId  The unique identifier of the user profile to update.
 *                            This ID is used to locate the specific user profile in the database for updating.
 * @param profilePicFile      This value will replace the existing user bio associated with the profile.
 * @returns {Promise<object>} A Promise resolving to the updated user profile document after a successful update.
 *                            The returned object contains the updated details of the user profile, including the updated 'bio' field.
 * @throws {Error} If any of the following conditions are met:
 *                 - Failed to retrieve or update the user profile due to database or network errors.
 */
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



/**
 * Creates a new post from the current user with the specified post data.
 *
 * @param {INewPost} post The details of the post to create.
 *                        Requires a valid 'INewPost' object containing the following properties:
 *                        - 'userId': The ID of the current user.
 *                        - 'title': The title of the post.
 *                        - 'content': The content of the post.
 *                        - 'imageURL' (optional): The URL of the image associated with the post.
 *                        - 'imageId' (optional): The ID of the image associated with the post.
 * @returns {Promise<object>} A Promise resolving to the new post document created and attached to a specific user in the database.
 *                            The returned object contains the following properties:
 *                            - 'creator': The ID of the creator associated with the post.
 *                            - 'title': The title of the post.
 *                            - 'content': The content of the post.
 *                            - 'imageId': The ID of the image associated with the post.
 *                            - 'imageURL': The URL of the image associated with the post (if provided).
 *                            - 'likes': An array of user IDs associated with users who have liked the post (initially empty).
 *                            - 'comments': An array of comments associated with the post (initially empty).
 * @throws {Error} If there is an error while creating a new post (e.g., database or network error).
 */
export const createNewPost = async (post: INewPost)=> {
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

/**
 * Fetches all posts that have been created and sorts them in order of creation time,
 * limiting to 10 posts per page and only returning posts with an associated 'creator' property.
 *
 * @returns {Promise<object[]>} A Promise resolving to an array of post documents that have been created.
 *                              Each post document contains the following properties:
 *                              - 'creator': The data of the creator associated with the post.
 *                              - 'title': The title of the post.
 *                              - 'content': The content of the post.
 *                              - 'imageId': The ID of the image associated with the post.
 *                              - 'imageURL': The URL of the image associated with the post.
 *                              - 'likes': An array of user data associated with the users who have liked the post.
 *                              - 'comments': An array of comments associated with the post from users.
 * @throws {Error} If any of the following conditions are met:
 *                 - No posts have been created.
 *                 - No post documents were found in the database.
 *                 - There is an issue with retrieving posts from the database (e.g., network or database error).
 */

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

/**
 * Retrieves a post by its unique identifier (post ID) from the database.
 *
 * @param {string} postId The unique identifier (ID) of the post to retrieve.
 * @returns {Promise<object>} A Promise resolving to the post document retrieved from the database.
 *                            The returned object contains the details of the post, including:
 *                            - 'creator': The data of the creator associated with the post.
 *                            - 'title': The title of the post.
 *                            - 'content': The content of the post.
 *                            - 'imageId': The ID of the image associated with the post.
 *                            - 'imageURL': The URL of the image associated with the post.
 *                            - 'likes': An array of user data associated with users who have liked the post.
 *                            - 'comments': An array of comments associated with the post from users.
 * @throws {Error} If the specified post ID does not exist or there is an issue retrieving the post from the database.
 */
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

/**
 * Deletes a post from the database based on its unique identifier (post ID).
 *
 * @param {string} postId The unique identifier (ID) of the post to delete.
 * @returns {Promise<object>} A Promise resolving to the deleted post document from the database upon successful deletion.
 * @throws {Error} If the specified post ID does not exist or there is an issue deleting the post from the database.
 */
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

/**
 * Adds or updates the 'likes' array of a post in the database to include the specified user IDs.
 *
 * @param {string} postId The unique identifier (ID) of the post to like.
 * @param {string[]} likesArray An array of user IDs to add to or update the 'likes' array of the post.
 * @returns {Promise<object>} A Promise resolving to the updated post document with the updated 'likes' array.
 * @throws {Error} If there is an issue updating the post's 'likes' array in the database.
 */

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

/**
 * Retrieves the latest comments from the database, sorted by creation time,
 * with a limit of 10 comments per page, and only returning comments with an associated 'commenter' property.
 *
 * @returns {Promise<object[]>} A Promise resolving to an array of comment documents that have been retrieved.
 *                              Each comment document contains the following properties:
 *                              - 'commenter': The data of the commenter associated with the comment.
 *                              - 'content': The content of the comment.
 *                              - 'createdAt': The timestamp indicating when the comment was created.
 * @throws {Error} If there is an issue retrieving comments from the database (e.g., network or database error).
 */
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

/**
 * Creates a new comment for a post in the database.
 *
 * @param {string} postId The unique identifier (ID) of the post to which the comment belongs.
 * @param {string} comment The content of the comment to be created.
 * @param {string} commenter The unique identifier (ID) of the user who is creating the comment.
 * @returns {Promise<object>} A Promise resolving to the newly created comment document.
 * @throws {Error} If there is an issue creating the new comment in the database (e.g., network or database error).
 */

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


/**
 * Deletes a comment from the database based on its unique identifier (comment ID).
 *
 * @param {string} commentId The unique identifier (ID) of the comment to delete.
 * @returns {Promise<object>} A Promise resolving to the deleted comment document upon successful deletion.
 * @throws {Error} If there is an issue deleting the comment from the database (e.g., network or database error).
 */
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

/**
 * Retrieves all replies from the database.
 *
 * @returns {Promise<object[]>} A Promise resolving to an array of reply documents retrieved from the database.
 *                              Each reply document contains the relevant reply information.
 * @throws {Error} If there is an issue retrieving replies from the database (e.g., network or database error).
 */
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

/**
 * Creates a new reply to a comment in the database.
 *
 * @param {string} commentId The unique identifier (ID) of the comment to which the reply belongs.
 * @param {string} replyValue The content of the reply to be created.
 * @param {string} replier The unique identifier (ID) of the user creating the reply.
 * @param {string} repliedComment The unique identifier (ID) of the comment being replied to.
 * @returns {Promise<object>} A Promise resolving to the newly created reply document.
 * @throws {Error} If there is an issue creating the new reply in the database (e.g., network or database error).
 */
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

/**
 * Deletes a reply from the database based on its unique identifier (reply ID).
 *
 * @param {string} replyId The unique identifier (ID) of the reply to delete.
 * @returns {Promise<object>} A Promise resolving to the deleted reply document upon successful deletion.
 * @throws {Error} If there is an issue deleting the reply from the database (e.g., network or database error).
 */
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

/**
 * Retrieves all user profiles from the database.
 *
 * @returns {Promise<object[]>} A Promise resolving to an array of user profile documents retrieved from the database.
 *                              Each profile document contains the relevant user profile information.
 * @throws {Error} If there is an issue retrieving user profiles from the database (e.g., network or database error).
 */
export const getProfiles = async () => {
  try{
    const profiles = await databases.listDocuments(appwriteConfig.DATABASE_ID, appwriteConfig.USERS_COLLECTION_ID)

    return profiles.documents
  }catch (err) {
    throw Error
  }
}


/**
 * Retrieves a user profile from the database based on its unique identifier (profile ID).
 *
 * @param {string} profileId The unique identifier (ID) of the user profile to retrieve.
 * @returns {Promise<object>} A Promise resolving to the retrieved user profile document.
 * @throws {Error} If there is an issue retrieving the user profile from the database (e.g., network or database error).
 */

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


/**
 * Searches for user profiles in the database based on a search query.
 *
 * @param {string} searchQuery The search query used to find matching user profiles (e.g., name).
 * @returns {Promise<object[]>} A Promise resolving to an array of user profile documents that match the search query.
 * @throws {Error} If there is an issue searching for user profiles in the database (e.g., network or database error).
 */

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
