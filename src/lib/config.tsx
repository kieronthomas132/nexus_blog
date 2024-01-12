import { Account, Databases, Avatars, Storage, Client } from "appwrite";

export const appwriteConfig = {
  PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  ENDPOINT_URL: import.meta.env.VITE_APPWRITE_ENDPOINT_URL,
  DATABASE_ID: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  USERS_COLLECTION_ID: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
  POSTS_COLLECTION_ID: import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
  COMMENTS_COLLECTION_ID: import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID,
  REPLIES_COLLECTION_ID: import.meta.env.VITE_APPWRITE_REPLIES_COLLECTION_ID,
  STORAGE_COLLECTION_ID: import.meta.env.VITE_APPWRITE_STORAGE_COLLECTION_ID,
};

const client = new Client()
  .setProject(appwriteConfig.PROJECT_ID)
  .setEndpoint(appwriteConfig.ENDPOINT_URL);

export const databases = new Databases(client);
export const storage = new Storage(client);
export const account = new Account(client);
export const avatars = new Avatars(client);
