import { defineConfig, env } from "@prisma/config"

const databaseUrl = env("DATABASE_URL_UNPOOLED") || env("DATABASE_URL")
const shadowDatabaseUrl = env("DIRECT_URL") || env("DATABASE_URL")

export default defineConfig({
  datasource: {
    url: databaseUrl,
    shadowDatabaseUrl,
  },
})
