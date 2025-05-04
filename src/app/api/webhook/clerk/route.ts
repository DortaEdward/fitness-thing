import {type WebhookEvent } from '@clerk/nextjs/server'

import { clerkClient } from '@clerk/nextjs/server';

import { NextResponse } from 'next/server'
import QUERIES from '../../../../server/queries';


import { verifyWebhook } from '@clerk/nextjs/webhooks'


export async function POST(req: Request) {
  console.log("Creating User? v1")
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const evt = await verifyWebhook(req)
    const eventType = evt.type
   
    if (eventType === 'user.created') {
      console.log("Create user event called")
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
        console.log("Creating user? v2")
        const newUserId = await QUERIES.createUser(user)
        if (newUserId) {
          const client = await clerkClient();
        
          await client.users.updateUserMetadata(id, {
            publicMetadata: {
              userId: newUserId
            }
          })
        }
        console.log("(Server) - User was created:", newUserId);
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

