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

interface WelcomeEmailProps {
  userName: string
  dashboardUrl: string
}

export function WelcomeEmail({ userName, dashboardUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to RentSpace - Find your perfect place</Preview>
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
            Welcome to RentSpace, {userName}!
          </Heading>
          <Text style={{ fontSize: "16px", lineHeight: "26px", color: "#374151" }}>
            Thanks for joining RentSpace. You're now part of a community that makes finding and renting places simple, transparent, and fee-free.
          </Text>
          <Section style={{ margin: "24px 0" }}>
            <Text style={{ fontSize: "14px", fontWeight: "600", color: "#111827", marginBottom: "8px" }}>
              Here's what you can do:
            </Text>
            <ul style={{ paddingLeft: "20px", margin: 0 }}>
              <li style={{ fontSize: "14px", lineHeight: "22px", color: "#4b5563", marginBottom: "4px" }}>
                Search rentals on an interactive map
              </li>
              <li style={{ fontSize: "14px", lineHeight: "22px", color: "#4b5563", marginBottom: "4px" }}>
                Message landlords directly
              </li>
              <li style={{ fontSize: "14px", lineHeight: "22px", color: "#4b5563", marginBottom: "4px" }}>
                Save your favorite listings
              </li>
              <li style={{ fontSize: "14px", lineHeight: "22px", color: "#4b5563" }}>
                List your own property for free
              </li>
            </ul>
          </Section>
          <Button
            href={dashboardUrl}
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
            Start Exploring
          </Button>
          <Text
            style={{
              fontSize: "12px",
              color: "#9ca3af",
              marginTop: "24px",
            }}
          >
            If you have any questions, just reply to this email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

WelcomeEmail.PreviewProps = {
  userName: "Alex",
  dashboardUrl: "https://rentspace.com/search",
} as WelcomeEmailProps

export default WelcomeEmail
