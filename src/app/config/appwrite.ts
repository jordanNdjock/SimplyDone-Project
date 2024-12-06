import { Client, Account } from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('67486d9e00049ba7349b');

export const account = new Account(client);
export { ID } from 'appwrite';
