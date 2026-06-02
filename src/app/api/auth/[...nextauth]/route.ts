export async function GET(req: Request) {
  const { handlers } = (await import("@/lib/auth")) as any
  return handlers.GET(req)
}

export async function POST(req: Request) {
  const { handlers } = (await import("@/lib/auth")) as any
  return handlers.POST(req)
}
