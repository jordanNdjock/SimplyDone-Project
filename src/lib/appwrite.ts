import { Client, Account, Storage, Databases } from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67486d9e00049ba7349b')
    .setEndpointRealtime('wss://cloud.appwrite.io/v1/realtime');
    

export const account = new Account(client);
export const storage = new Storage(client);
export const db = new Databases(client);
export const databaseId = "6749ac2b00277519a67a";
export const TaskCollectionId = "6749b55b0002e1dabe00";
export const AvatarsBucketId = "6749c72e000f88566561";
export const TasksImgBucketId = "677bb291002c221e65fe";
export { ID, Query, Permission, Role } from 'appwrite';
