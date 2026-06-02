import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-xl rounded-3xl border border-slate-200 bg-white/90 p-10 shadow-lg shadow-slate-200/40">
        <h1 className="text-3xl font-semibold">Authentication Error</h1>
        <p className="mt-4 text-sm text-slate-600">
          NextAuth could not complete sign-in. This usually means the OAuth provider is not configured correctly or the app URL is not set.
        </p>
        <div className="mt-6 space-y-3 text-left text-sm text-slate-700">
          <p>
            Check that <code className="rounded bg-slate-100 px-1 py-0.5">AUTH_GOOGLE_ID</code> and <code className="rounded bg-slate-100 px-1 py-0.5">AUTH_GOOGLE_SECRET</code> are set in your environment.
          </p>
          <p>
            Also verify <code className="rounded bg-slate-100 px-1 py-0.5">NEXTAUTH_URL</code> or <code className="rounded bg-slate-100 px-1 py-0.5">AUTH_URL</code> points to your local app.
          </p>
        </div>
        <Link href="/" className="mt-8 inline-flex rounded-full bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-700">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
