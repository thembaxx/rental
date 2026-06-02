import Pusher from "pusher"

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
})

export async function triggerMessage(conversationId: string, message: any) {
  await pusherServer.trigger(
    `conversation-${conversationId}`,
    "new-message",
    message
  )
}

export async function triggerNotification(userId: string, notification: any) {
  await pusherServer.trigger(
    `user-${userId}`,
    "notification",
    notification
  )
}
