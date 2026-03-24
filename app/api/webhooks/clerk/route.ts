import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/config/db";
import { Users } from "@/config/schema";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env",
    );
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const eventType = evt.type;

  // Handle User Created or Updated
  if (eventType === "user.created" || eventType === "user.updated") {
    const { id, email_addresses, image_url, first_name, last_name } = evt.data;

    // Clerk users can have multiple emails, we take the primary one
    const email =
      email_addresses && email_addresses.length > 0
        ? email_addresses[0].email_address
        : `no-email-${id}@clerk.user`;

    const fullName = `${first_name ?? ""} ${last_name ?? ""}`.trim();

    try {
      // We use .onConflictDoUpdate to handle both 'created' and 'updated' events in one go
      await db
        .insert(Users)
        .values({
          userId: id,
          name: fullName || "Lendable User",
          email: email,
          image: image_url,
        })
        .onConflictDoUpdate({
          target: Users.userId,
          set: {
            name: fullName || "Lendable User",
            email: email,
            image: image_url,
            updatedAt: new Date(),
          },
        });

      console.log(`✅ User ${id} successfully synced to Neon.`);
    } catch (dbError) {
      console.error("❌ Database Sync Error:", dbError);
      return new Response("Database Error", { status: 500 });
    }
  }

  return new Response("Successfully processed", { status: 200 });
}
