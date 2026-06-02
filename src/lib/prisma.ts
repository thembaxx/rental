// eslint-disable-next-line @typescript-eslint/no-explicit-any
let prisma: any

// If this module is evaluated in a browser bundle, avoid loading server-only
// Prisma code (which would cause the bundler to include node-specific
// modules). Provide a proxy that throws if used from the client.
if (typeof window !== 'undefined') {
  const errorMessage = 'Prisma client is server-only. Do not import it from client code.'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handler: ProxyHandler<any> = {
    get() {
      return () => {
        throw new Error(errorMessage)
      }
    },
    apply() {
      throw new Error(errorMessage)
    },
  }
  prisma = new Proxy(() => {}, handler)
} else {
  try {
    // Use require so that a missing or ungenerated client doesn't throw at module evaluation time.
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
    const { PrismaClient } = require('@prisma/client') as any
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
    const { PrismaPg } = require('@prisma/adapter-pg') as any

    const globalForPrisma = globalThis as unknown as {
      prisma: InstanceType<typeof PrismaClient> | undefined
    }

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL must be set to initialize Prisma')
    }

    const adapter = new PrismaPg(process.env.DATABASE_URL)
    prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    const errorMessage = '@prisma/client did not initialize yet. Run "prisma generate" and try again.'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handler: ProxyHandler<any> = {
      get() {
        return () => {
          throw new Error(errorMessage)
        }
      },
      apply() {
        throw new Error(errorMessage)
      },
    }
    prisma = new Proxy(() => {}, handler)
  }
}

export { prisma }
