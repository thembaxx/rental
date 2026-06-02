import { defineConfig } from "@prisma/config"
import { existsSync, readFileSync } from "node:fs"
import { join } from "node:path"

const envPath = join(process.cwd(), ".env.local")
if (existsSync(envPath)) {
  const envFile = readFileSync(envPath, "utf8")
  for (const line of envFile.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue

    const [key, ...rest] = trimmed.split("=")
    const value = rest.join("=").trim().replace(/^"(.*)"$/, "$1")
    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

const databaseUrl = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
const shadowDatabaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL_UNPOOLED or DATABASE_URL in the environment.")
}

export default defineConfig({
  datasource: {
    url: databaseUrl,
    shadowDatabaseUrl,
  },
})
