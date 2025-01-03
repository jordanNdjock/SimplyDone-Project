import { Client, Account, Storage } from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67486d9e00049ba7349b')
    .setEndpointRealtime('wss://cloud.appwrite.io/v1/realtime');
    

export const account = new Account(client);
export const storage = new Storage(client);
export const Bucket_Id = "6749c72e000f88566561";
export { ID } from 'appwrite';
