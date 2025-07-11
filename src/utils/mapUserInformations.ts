import { User } from '../models/user';
import { toBoolean } from './utils';
/* eslint-disable @typescript-eslint/no-explicit-any */
export const mapUserInformation = (user: any): User => {
    return {
      $id: user.$id ?? "",
      name: user.name ?? null,
      email: user.email ?? null,
      registeredAt: user.registration ?? null,
      avatarUrl: user.prefs.avatar ?? null,
      avatarId: user.prefs.avatarId ?? null,
      role: user.labels[0] ?? null,
      hasSeenIntro: toBoolean(user.prefs.hasSeenIntro) ?? false,
    };
  };
  /* eslint-enable @typescript-eslint/no-explicit-any */