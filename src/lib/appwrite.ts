import { Client, Account } from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67486d9e00049ba7349b')
    .setEndpointRealtime('wss://cloud.appwrite.io/v1/realtime');
    

export const account = new Account(client);
export { ID } from 'appwrite';
