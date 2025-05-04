import { type WebhookEvent } from '@clerk/nextjs/server'

import { clerkClient } from '@clerk/nextjs/server';

import { NextResponse } from 'next/server'
import QUERIES from '../../../../server/queries';


import { verifyWebhook } from '@clerk/nextjs/webhooks'


export async function POST(req: Request) {

  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const evt = await verifyWebhook(req)
    const eventType = evt.type

    if (eventType === 'user.created') {
      console.log("Creating User?")

      const { id, email_addresses, image_url, username, first_name, last_name } = evt.data;
      const user = {
        clerk_id: id,
        email: email_addresses[0]!.email_address,
        username: username ?? "",
        profile_image: image_url,
        first_name: first_name ?? "",
        last_name: last_name ?? "",
      }

      try {
        const newUserId = await QUERIES.createUser(user)
        if (newUserId) {
          const client = await clerkClient();

          await client.users.updateUserMetadata(id, {
            publicMetadata: {
              userId: newUserId
            }
          })
        }

        return NextResponse.json({ message: "OK" })
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    }
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error verifying webhook', { status: 400 })
  }
}

/*

⨯ 
[Error: No response is returned from route handler '/vercel/path0/src/app/api/webhook/clerk/route.ts'. Ensure you return a `Response` or a `NextResponse` in all branches of your handler.]




*/