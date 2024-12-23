import { User } from '../models/user';
/* eslint-disable @typescript-eslint/no-explicit-any */
export const mapUserInformation = (user: any): User => {
    return {
      $id: user.$id ?? "",
      name: user.name ?? null,
      email: user.email ?? null,
      registeredAt: user.registration ?? null,
    };
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */