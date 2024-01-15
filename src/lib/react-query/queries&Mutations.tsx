import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  createNewPost,
  createReply,
  createUserAccount,
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

export const useCreateNewAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  });
};

export const useLogoutUser = () => {
  return useMutation({
    mutationFn: logoutUser,
  });
};

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

export const useGetPosts = () => {
  return useQuery({
    queryFn: getPosts,
    queryKey: [QUERY_KEYS.GET_POSTS],
  });
};

export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID],
    queryFn: () => getPostById(postId),
  });
};
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

export const useGetComments = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COMMENTS],
    queryFn: getComments,
  });
};
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
      // queryClient.invalidateQueries({
      //   queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      // });
      // queryClient.invalidateQueries({
      //   queryKey: [QUERY_KEYS.GET_POSTS],
      // });
    },
  });
};

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

export const useGetReplies = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_REPLIES],
    queryFn: getReplies,
  });
};

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

export const useGetProfiles = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PROFILES],
    queryFn: getProfiles
  })
}

export const useGetProfileById = (profileId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PROFILE_BY_ID],
    queryFn: () => getProfileById(profileId),
  });
};

export const useSearchProfiles = (searchQuery: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_PROFILES, searchQuery],
    queryFn: () => searchProfiles(searchQuery),
  });
};
