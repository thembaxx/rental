import * as React from "react"
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Button,
  Section,
} from "@react-email/components"

interface NewMessageEmailProps {
  senderName: string
  listingTitle: string
  messagePreview: string
  conversationUrl: string
  unsubscribeUrl: string
}

export function NewMessageEmail({
  senderName,
  listingTitle,
  messagePreview,
  conversationUrl,
}: NewMessageEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New message from {senderName} about {listingTitle}</Preview>
      <Body style={{ backgroundColor: "#f4f4f5", fontFamily: "sans-serif" }}>
        <Container
          style={{
            margin: "0 auto",
            padding: "40px 20px",
            maxWidth: "560px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
          }}
        >
          <Heading style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
            New Message
          </Heading>
          <Text style={{ fontSize: "16px", lineHeight: "26px", color: "#374151" }}>
            <strong>{senderName}</strong> sent you a message about{" "}
            <strong>{listingTitle}</strong>:
          </Text>
          <Section
            style={{
              backgroundColor: "#f3f4f6",
              padding: "16px",
              borderRadius: "8px",
              margin: "16px 0",
            }}
          >
            <Text
              style={{
                fontSize: "14px",
                lineHeight: "22px",
                color: "#4b5563",
                margin: 0,
                fontStyle: "italic",
              }}
            >
              "{messagePreview.length > 150 ? messagePreview.slice(0, 150) + "..." : messagePreview}"
            </Text>
          </Section>
          <Button
            href={conversationUrl}
            style={{
              backgroundColor: "#000000",
              color: "#ffffff",
              padding: "12px 24px",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "16px",
              display: "inline-block",
            }}
          >
            Reply on RentSpace
          </Button>
          <Text
            style={{
              fontSize: "12px",
              color: "#9ca3af",
              marginTop: "24px",
            }}
          >
            You're receiving this because you have message notifications enabled on RentSpace.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

NewMessageEmail.PreviewProps = {
  senderName: "John Doe",
  listingTitle: "Modern Downtown Apartment",
  messagePreview: "Hi, is this apartment still available? I'd like to schedule a viewing for this weekend if possible.",
  conversationUrl: "https://rentspace.com/inbox/123",
  unsubscribeUrl: "https://rentspace.com/settings/notifications",
} as NewMessageEmailProps

export default NewMessageEmail
