// @flow
import type { AuthRules } from './types/auth';
import type { Role } from './types/user';

const rules: AuthRules = {
  contributor: {
    static: [
      "post:read",
      "profile:read",
      "artist:read",
      "artist:create"
    ],
    dynamic: {
      "userEmail:read": ({ authUserId, emailOwnerId }) => {
        if (!authUserId || !emailOwnerId) return false;
        return authUserId === emailOwnerId;
      },
      "post:update": ({ authUserId, postOwnerId }) => {
        if (!authUserId || !postOwnerId) return false;
        return authUserId === postOwnerId;
      },
      "post:delete": ({ authUserId, postOwnerId }) => {
        if (!authUserId || !postOwnerId) return false;
        return authUserId === postOwnerId;
      },
      "profile:delete": ({ authUserId, postOwnerId }) => {
        if (!authUserId || !postOwnerId) return false;
        return authUserId === postOwnerId;
      },
      "profile:update": ({ authUserId, profileOwnerId }) => {
        if (!authUserId || !profileOwnerId) return false;
        return authUserId === profileOwnerId;
      },
    }
  },
  admin: {
    static: [],
    dynamic: {}
  },
  artist: {
    static: [],
    dynamic: {}
  },
  anonymous: {
    static: ["welcomePage:read", "loginPage:read"],
    dynamic: {}
  },
};

export default rules;
