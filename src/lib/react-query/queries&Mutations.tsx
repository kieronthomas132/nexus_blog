import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  createNewPost,
  createReply,
  createUserAccount, deleteAccount,
  deleteComment,
  deletePost,
  deleteReply,
  getComments,
  getPostById,
  getPosts,
  getProfileById, getProfiles,
  getReplies,
  INewPost,
  INewUser,
  likePost,
  logoutUser,
  searchProfiles,
  signInAccount,
  updateBio,
  updateName,
  updateProfilePic, updateUsername,
} from "../api.tsx";
import { QUERY_KEYS } from "./queryKeys.tsx";


/**
 * Custom hook for creating a new user account.
 * Uses react-query's useMutation hook to handle asynchronous createUserAccount operation.
 * @returns {Object} An object containing the useMutation hook result for creating a new account.
 */
export const useCreateNewAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

/**
 * Custom hook for signing in to a user account.
 * Uses react-query's useMutation hook to handle asynchronous signInAccount operation.
 * @returns {Object} An object containing the useMutation hook result for signing in to an account.
 */
export const useSignInAccount = ()  => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

/**
 * Custom hook for logging out the current user.
 * Uses react-query's useMutation hook to handle asynchronous logoutUser operation.
 * @returns {Object} An object containing the useMutation hook result for logging out the user.
 */
export const useLogoutUser = () => {
  return useMutation({
    mutationFn: logoutUser,
  });
};


export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: (userId: string) => deleteAccount(userId)
  })
}

/**
 * Custom hook for updating the name of a user profile.
 * Uses react-query's useMutation hook to handle asynchronous updateName operation.
 * @returns {Object} An object containing the useMutation hook result for updating the user profile name.
 */
export const useUpdateName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ profileId, name }: { profileId: string; name: string }) =>
        updateName(profileId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PROFILE_BY_ID],
      });
    },
  });
};

/**
 * Custom hook for updating the username of a user profile.
 * Uses react-query's useMutation hook to handle asynchronous updateUsername operation.
 * @returns {Object} An object containing the useMutation hook result for updating the user profile username.
 */
export const useUpdateUsername = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ profileId, username }: { profileId: string; username: string }) => {
      const success = await updateUsername(profileId, username);

      if (!success) {
        throw new Error("Username already exists");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PROFILE_BY_ID],
      });
    },
  });
};

/**
 * Custom hook for updating the bio of a user profile.
 * Uses react-query's useMutation hook to handle asynchronous updateBio operation.
 * @returns {Object} An object containing the useMutation hook result for updating the user profile bio.
 */

export const useUpdateBio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ profileId, bio }: { profileId: string; bio: string }) =>
      updateBio(profileId, bio),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PROFILE_BY_ID],
      });
    },
  });
};

/**
 * Custom hook for updating the profile picture of a user profile.
 * Uses react-query's useMutation hook to handle asynchronous updateProfilePic operation.
 * @returns {Object} An object containing the useMutation hook result for updating the user profile picture.
 */

export const useUpdateProfilePic = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      profileId,
      profilePicFile,
    }: {
      profileId: string | undefined;
      profilePicFile: File | null;
    }) => updateProfilePic(profileId, profilePicFile),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PROFILE_BY_ID]
      })
    }
  });
};

/**
 * Custom hook for creating a new post.
 * Uses react-query's useMutation hook to handle asynchronous createNewPost operation.
 * @returns {Object} An object containing the useMutation hook result for creating a new post.
 */

export const useCreateNewPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => createNewPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PROFILE_BY_ID],
      });
    },
  });
};


/**
 * Custom hook for deleting a post.
 * Uses react-query's useMutation hook to handle asynchronous deletePost operation.
 * @returns {Object} An object containing the useMutation hook result for deleting a post.
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PROFILE_BY_ID],
      });
    },
  });
};

/**
 * Custom hook for fetching all posts.
 * Uses react-query's useQuery hook to handle asynchronous getPosts operation.
 * @returns {Object} An object containing the useQuery hook result for fetching all posts.
 */

export const useGetPosts = () => {
  return useQuery({
    queryFn: getPosts,
    queryKey: [QUERY_KEYS.GET_POSTS],
  });
};

/**
 * Custom hook for fetching a post by its ID.
 * Uses react-query's useQuery hook to handle asynchronous getPostById operation.
 * @param {string} postId The ID of the post to fetch.
 * @returns {Object} An object containing the useQuery hook result for fetching a post by its ID.
 */

export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID],
    queryFn: () => getPostById(postId),
  });
};

/**
 * Custom hook for liking a post.
 * Uses react-query's useMutation hook to handle asynchronous likePost operation.
 * @returns {Object} An object containing the useMutation hook result for liking a post.
 */
export const useLikePost = () => {
  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string;
      likesArray: string[];
    }) => likePost(postId, likesArray),
  });
};

/**
 * Custom hook for fetching comments.
 * Uses react-query's useQuery hook to handle asynchronous getComments operation.
 * @returns {Object} An object containing the useQuery hook result for fetching comments.
 */
export const useGetComments = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COMMENTS],
    queryFn: getComments,
  });
};

/**
 * Custom hook for creating a new comment on a post.
 * Uses react-query's useMutation hook to handle asynchronous createComment operation.
 * @returns {Object} An object containing the useMutation hook result for creating a comment.
 */
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      comment,
      commenter,
    }: {
      postId: string;
      comment: string;
      commenter: string;
    }) => createComment(postId, comment, commenter),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COMMENTS],
      });
    },
  });
};

/**
 * Custom hook for deleting a comment.
 * Uses react-query's useMutation hook to handle asynchronous deleteComment operation.
 * @returns {Object} An object containing the useMutation hook result for deleting a comment.
 */
export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COMMENTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID],
      });
    },
  });
};

/**
 * Custom hook for fetching replies.
 * Uses react-query's useQuery hook to handle asynchronous getReplies operation.
 * @returns {Object} An object containing the useQuery hook result for fetching replies.
 */
export const useGetReplies = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_REPLIES],
    queryFn: getReplies,
  });
};

/**
 * Custom hook for creating a new reply to a comment.
 * Uses react-query's useMutation hook to handle asynchronous createReply operation.
 * @returns {Object} An object containing the useMutation hook result for creating a reply.
 */
export const useCreateReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      commentId,
      replyValue,
      replier,
      repliedComment,
    }: {
      commentId: string;
      replyValue: string;
      replier: string;
      repliedComment: string;
    }) => createReply(commentId, replyValue, replier, repliedComment),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_REPLIES],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COMMENTS],
      });
    },
  });
};

/**
 * Custom hook for deleting a reply.
 * Uses react-query's useMutation hook to handle asynchronous deleteReply operation.
 * @returns {Object} An object containing the useMutation hook result for deleting a reply.
 */
export const useDeleteReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (replyId: string) => deleteReply(replyId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_REPLIES],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COMMENTS],
      });
    },
  });
};

/**
 * Custom hook for fetching profiles.
 * Uses react-query's useQuery hook to handle asynchronous getProfiles operation.
 * @returns {Object} An object containing the useQuery hook result for fetching profiles.
 */
export const useGetProfiles = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PROFILES],
    queryFn: getProfiles
  })
}
/**
 * Custom hook for fetching a user profile by ID.
 * Uses react-query's useQuery hook to handle asynchronous profile retrieval.
 * @param {string} profileId The ID of the profile to fetch.
 * @returns {Object} An object containing the useQuery hook result for fetching a profile by ID.
 *                   The object includes properties such as `data`, `isLoading`, `isError`, etc.
 */
export const useGetProfileById = (profileId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PROFILE_BY_ID],
    queryFn: () => getProfileById(profileId),
  });
};

/**
 * Custom hook for searching user profiles based on a search query.
 * Uses react-query's useQuery hook to handle asynchronous profile search.
 * @param {string} searchQuery The search query used to filter profiles.
 * @returns {Object} An object containing the useQuery hook result for searching profiles.
 *                   The object includes properties such as `data`, `isLoading`, `isError`, etc.
 */
export const useSearchProfiles = (searchQuery: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_PROFILES, searchQuery],
    queryFn: () => searchProfiles(searchQuery),
  });
};
