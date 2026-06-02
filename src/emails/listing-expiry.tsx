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

interface ListingExpiryEmailProps {
  listingTitle: string
  daysRemaining: number
  refreshUrl: string
}

export function ListingExpiryEmail({
  listingTitle,
  daysRemaining,
  refreshUrl,
}: ListingExpiryEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{`Your listing "${listingTitle}" expires in ${daysRemaining} days`}</Preview>
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
            Listing Expiring Soon
          </Heading>
          <Text style={{ fontSize: "16px", lineHeight: "26px", color: "#374151" }}>
            Your listing <strong>{listingTitle}</strong> will expire in{" "}
            <strong>{daysRemaining} days</strong>.
          </Text>
          <Text style={{ fontSize: "14px", lineHeight: "22px", color: "#6b7280" }}>
            Expired listings are no longer visible in search results. Refresh your listing to keep it active and reach more potential renters.
          </Text>
          <Section style={{ margin: "24px 0" }}>
            <Button
              href={refreshUrl}
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
              Refresh Listing
            </Button>
          </Section>
          <Text
            style={{
              fontSize: "12px",
              color: "#9ca3af",
              marginTop: "24px",
            }}
          >
            You're receiving this because you have a listing on RentSpace.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

ListingExpiryEmail.PreviewProps = {
  listingTitle: "Modern Downtown Apartment",
  daysRemaining: 3,
  refreshUrl: "https://rentspace.com/my-listings",
} as ListingExpiryEmailProps

export default ListingExpiryEmail
