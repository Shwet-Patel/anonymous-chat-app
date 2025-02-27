import NextAuth, { DefaultSession } from "next-auth"

/* here we are expanding the interface provided by the nextauth for user, session and jwt 
  so that we can load our custom fields to them. */

declare module "next-auth" {
  interface User {
    _id?: string,
    isVerified?: boolean,
    acceptingMessages?: boolean,
    username?:string,
          
  }

  interface Session {
    User: {
      _id ?: string,
      isVerified ?: boolean,
      acceptingMessages ?: boolean,
      username ?: string,
    } & DefaultSession['user']
  }
}

declare module "next-auth/jwt" {
 
  interface JWT {
    _id ?: string,
    isVerified ?: boolean,
    acceptingMessages ?: boolean,
    username ?: string,
  }
}