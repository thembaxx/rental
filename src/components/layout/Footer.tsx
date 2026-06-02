export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">RentSpace</h3>
            <p className="text-sm text-muted-foreground">
              The modern way to find your next home. No fees, no middlemen, just honest rentals.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Discover</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/search" className="hover:text-primary">Search Listings</a></li>
              <li><a href="/search?propertyType=APARTMENT" className="hover:text-primary">Apartments</a></li>
              <li><a href="/search?propertyType=HOUSE" className="hover:text-primary">Houses</a></li>
              <li><a href="/search?propertyType=ROOM" className="hover:text-primary">Rooms</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Listers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/my-listings/new" className="hover:text-primary">Post a Listing</a></li>
              <li><a href="/safety-tips" className="hover:text-primary">Safety Tips</a></li>
              <li><a href="/pricing" className="hover:text-primary">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/help" className="hover:text-primary">Help Center</a></li>
              <li><a href="/terms" className="hover:text-primary">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-primary">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} RentSpace. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
