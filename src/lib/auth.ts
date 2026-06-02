const errorMessage = "NextAuth failed to initialize. Ensure Prisma client is generated and environment variables are set."

let nextAuthClient: any = null
let authInitialized = false

async function loadNextAuth() {
  if (authInitialized) return nextAuthClient
  authInitialized = true

  try {
    const { default: NextAuth } = await import("next-auth")
    const { PrismaAdapter } = await import("@auth/prisma-adapter")
    const { default: Google } = await import("next-auth/providers/google")
    const { prisma } = await import("./prisma")

    const googleClientId = process.env.AUTH_GOOGLE_ID
    const googleClientSecret = process.env.AUTH_GOOGLE_SECRET
    const authSecret = process.env.AUTH_SECRET

    if (!googleClientId || !googleClientSecret) {
      throw new Error(
        "NextAuth Google provider is not configured. Set AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET."
      )
    }

    nextAuthClient = NextAuth({
      adapter: PrismaAdapter(prisma),
      providers: [
        Google({
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        }),
      ],
      callbacks: {
        async session({ session, user }: { session: any; user: any }) {
          if (session.user) {
            ;(session.user as any).id = user.id
            ;(session.user as any).isLister = (user as any).isLister
            ;(session.user as any).isAdmin = (user as any).isAdmin
          }
          return session
        },
      },
      pages: {
        signIn: "/",
        error: "/auth/error",
      },
      secret: authSecret || undefined,
    })
  } catch (error) {
    console.error("NextAuth initialization failed:", error)
    nextAuthClient = null
  }

  return nextAuthClient
}

function throwAuthError(): never {
  throw new Error(errorMessage)
}

export const handlers = new Proxy(
  {},
  {
    get(_target, prop) {
      return async (...args: any[]) => {
        const authClient = await loadNextAuth()
        if (!authClient?.handlers?.[prop]) throwAuthError()
        return authClient.handlers[prop](...args)
      }
    },
  }
)

export async function auth(...args: any[]) {
  const authClient = await loadNextAuth()
  if (!authClient?.auth) return null
  return authClient.auth(...args)
}

export async function signIn(...args: any[]) {
  const authClient = await loadNextAuth()
  if (!authClient?.signIn) throwAuthError()
  return authClient.signIn(...args)
}

export async function signOut(...args: any[]) {
  const authClient = await loadNextAuth()
  if (!authClient?.signOut) throwAuthError()
  return authClient.signOut(...args)
}
