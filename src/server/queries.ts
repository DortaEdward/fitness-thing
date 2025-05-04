import type { User } from "@prisma/client";
import { db } from "./db";
import { auth } from "@clerk/nextjs/server";

type CreateUserPayload = Omit<User, 'id' | "subscribed">

function ErrorHandler(error: Error) {
  return new Error(error.message)
}

// async function isAuthed() {
//   try {
//     const clerkAuthed = await auth();
//     if (!clerkAuthed.userId) {
//       return null;
//     }

//     const serverAuthed = await db.user.findUnique({
//       where: {
//         clerk_id: clerkAuthed.userId
//       }
//     })
//     if (!serverAuthed) {
//       return null;
//     }
//     return serverAuthed
//   } catch (error) {
//     if (error instanceof (Error)) {
//       ErrorHandler(error)
//     }
//   }
// }

type CreateTripPayload = {
  name: string
  image_url: string | null
  location: string | null
}

const QUERIES = {
  async createUser(user: CreateUserPayload) {
    try {
      const newUser = await db.user.create({
        data: {
          username: user.username,
          email: user.email,
          clerk_id: user.clerk_id,
          first_name: user.first_name,
          last_name: user.last_name,
          profile_image: user.profile_image,
        }
      })

      if (!newUser) return;
      return newUser.id;

    } catch (error) {
      if (error instanceof (Error)) {
        ErrorHandler(error)
      }
    }
  },

}

export default QUERIES;