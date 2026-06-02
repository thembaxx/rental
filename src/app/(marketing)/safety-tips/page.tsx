export default function SafetyTipsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Safety Tips</h1>
      <p className="text-muted-foreground mb-8">
        Your safety is our priority. Follow these guidelines when renting or listing a property.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">For Renters (Seekers)</h2>
          <div className="space-y-3 text-muted-foreground">
            <p><strong className="text-foreground">Never send money before viewing.</strong> Scammers often ask for deposits or rent before you've seen the property. Legitimate landlords will let you view first.</p>
            <p><strong className="text-foreground">Meet in person when possible.</strong> Always try to view the property and meet the landlord before signing anything or transferring money.</p>
            <p><strong className="text-foreground">Verify the listing.</strong> Check that the address exists, the photos match the description, and the price is reasonable for the area.</p>
            <p><strong className="text-foreground">Use in-app messaging.</strong> Keep all communication on RentSpace so there's a record. Be wary of landlords who immediately ask to move to WhatsApp or email.</p>
            <p><strong className="text-foreground">Trust your instincts.</strong> If something feels off—too good to be true, rushed timeline, vague answers—walk away.</p>
            <p><strong className="text-foreground">Check reviews.</strong> Look at the landlord's rating and read reviews from previous renters before committing.</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">For Landlords (Listers)</h2>
          <div className="space-y-3 text-muted-foreground">
            <p><strong className="text-foreground">Verify renter identity.</strong> Ask for a valid ID and proof of income before handing over keys or signing a lease.</p>
            <p><strong className="text-foreground">Meet in a safe location.</strong> For first meetings, consider a public place or have someone with you if showing the property alone.</p>
            <p><strong className="text-foreground">Use a proper lease agreement.</strong> Always use a written lease that covers rent, deposit, utilities, and house rules. Verbal agreements are hard to enforce.</p>
            <p><strong className="text-foreground">Be transparent.</strong> Accurate photos, honest descriptions, and clear pricing build trust and reduce disputes.</p>
            <p><strong className="text-foreground">Report suspicious behavior.</strong> If a renter asks unusual questions, offers to overpay, or pressures you to skip steps, report them.</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Red Flags to Watch For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              "Requests payment via wire transfer or crypto",
              "Landlord is 'out of the country' or unavailable to meet",
              "Price significantly below market rate",
              "Pressure to decide immediately",
              "Refuses to provide a written lease",
              "Asks for personal info (SSN, bank passwords) upfront",
              "Photos look professionally staged but description is vague",
              "Duplicate listings with different contact info",
            ].map((flag, i) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-100 dark:border-red-900">
                <span className="text-red-500 font-bold mt-0.5">!</span>
                <span className="text-sm">{flag}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">What to Do If You're Scammed</h2>
          <div className="space-y-3 text-muted-foreground">
            <p><strong className="text-foreground">Report it immediately.</strong> Use the report button on the listing or contact our support team.</p>
            <p><strong className="text-foreground">Contact your bank.</strong> If you sent money, contact your bank or payment provider immediately to see if the transaction can be reversed.</p>
            <p><strong className="text-foreground">File a police report.</strong> For significant losses, file a report with your local law enforcement.</p>
            <p><strong className="text-foreground">Warn others.</strong> Leave a review on the landlord's profile to help other renters avoid the same situation.</p>
          </div>
        </section>
      </div>
    </div>
  )
}
