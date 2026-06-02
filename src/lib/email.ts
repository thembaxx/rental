import { Resend } from "resend"
import { NewMessageEmail } from "@/emails/new-message"
import { ListingExpiryEmail } from "@/emails/listing-expiry"
import { WelcomeEmail } from "@/emails/welcome"

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.FROM_EMAIL || "RentSpace <notifications@rentspace.com>"

export async function sendNewMessageEmail({
  to,
  senderName,
  listingTitle,
  messagePreview,
  conversationUrl,
}: {
  to: string
  senderName: string
  listingTitle: string
  messagePreview: string
  conversationUrl: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `New message from ${senderName} about ${listingTitle}`,
      react: NewMessageEmail({
        senderName,
        listingTitle,
        messagePreview,
        conversationUrl,
        unsubscribeUrl: `${process.env.AUTH_URL}/settings`,
      }),
    })

    if (error) {
      console.error("Email send error:", error)
      return { success: false, error }
    }

    return { success: true, id: data?.id }
  } catch (err) {
    console.error("Email service error:", err)
    return { success: false, error: err }
  }
}

export async function sendListingExpiryEmail({
  to,
  listingTitle,
  daysRemaining,
  refreshUrl,
}: {
  to: string
  listingTitle: string
  daysRemaining: number
  refreshUrl: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `Your listing "${listingTitle}" expires in ${daysRemaining} days`,
      react: ListingExpiryEmail({
        listingTitle,
        daysRemaining,
        refreshUrl,
      }),
    })

    if (error) {
      console.error("Email send error:", error)
      return { success: false, error }
    }

    return { success: true, id: data?.id }
  } catch (err) {
    console.error("Email service error:", err)
    return { success: false, error: err }
  }
}

export async function sendWelcomeEmail({
  to,
  userName,
  dashboardUrl,
}: {
  to: string
  userName: string
  dashboardUrl: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: "Welcome to RentSpace!",
      react: WelcomeEmail({
        userName,
        dashboardUrl,
      }),
    })

    if (error) {
      console.error("Email send error:", error)
      return { success: false, error }
    }

    return { success: true, id: data?.id }
  } catch (err) {
    console.error("Email service error:", err)
    return { success: false, error: err }
  }
}
