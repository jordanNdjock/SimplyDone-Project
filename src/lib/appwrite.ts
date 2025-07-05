import { Client, Account, Storage, Databases } from 'appwrite';

export const client = new Client();

client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_CLOUD_URL || '')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
    .setEndpointRealtime(process.env.NEXT_PUBLIC_APPWRITE_REALTIME_URL || '');
    
export const account = new Account(client);
export const storage = new Storage(client);
export const db = new Databases(client);

export const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
export const TaskCollectionId = process.env.NEXT_PUBLIC_APPWRITE_TASK_COLLECTION_ID || '';
export const AvatarsBucketId = process.env.NEXT_PUBLIC_APPWRITE_AVATARS_BUCKET_ID || '';
export const TasksImgBucketId = process.env.NEXT_PUBLIC_APPWRITE_TASKS_IMG_BUCKET_ID || '';
export const SessionCollectionId = process.env.NEXT_PUBLIC_APPWRITE_SESSION_COLLECTION_ID || '';
export const MethodCollectionId = process.env.NEXT_PUBLIC_APPWRITE_METHOD_COLLECTION_ID || '';
export const SuggestionCollectionId = process.env.NEXT_PUBLIC_APPWRITE_SUGGESTION_COLLECTION_ID || ''; 
export { ID, Query, Permission, Role } from 'appwrite';
