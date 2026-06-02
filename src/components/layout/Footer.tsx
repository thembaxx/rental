export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:flex sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">RentSpace</p>
          <p className="max-w-xl text-sm text-muted-foreground">
            Minimal rental search, frictionless booking, and clearer host connections.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground sm:mt-0">
          <a href="/search" className="transition hover:text-foreground">Search</a>
          <a href="/my-listings/new" className="transition hover:text-foreground">List a property</a>
          <a href="/safety-tips" className="transition hover:text-foreground">Safety</a>
          <a href="/privacy" className="transition hover:text-foreground">Privacy</a>
        </div>
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} RentSpace. All rights reserved.
      </div>
    </footer>
  )
}
