# RentSpace - Rental Marketplace Platform

A full-stack rental marketplace built with Next.js 15, inspired by Airbnb and Craigslist. Users can discover, list, and message about rental properties with an interactive map interface.

## Features

- **Interactive Map Search** - Browse listings on a map with price markers and real-time viewport filtering
- **Advanced Filters** - Filter by price, property type, bedrooms, bathrooms, amenities
- **Direct Messaging** - In-app messaging between seekers and listers
- **Rating System** - Triple rating: listings, listers, and seekers
- **Favorites** - Save listings to your personal collection
- **Listing Management** - Multi-step wizard for creating listings with photos, amenities, and pricing
- **Auto-Expiry** - Listings expire after 30 days with refresh capability
- **Trust & Safety** - Report listings, verification badges, safety tips

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL + Prisma ORM |
| Auth | Auth.js (NextAuth) v5 - Google OAuth |
| Maps | Mapbox GL JS (via react-map-gl) |
| Images | Cloudinary |
| Realtime | Pusher Channels |
| Email | Resend |

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd rental-marketplace
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - Random 32+ character string for JWT signing
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` - Google OAuth credentials
- `NEXT_PUBLIC_MAPBOX_TOKEN` - Mapbox public token
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `PUSHER_*` - Pusher app credentials
- `RESEND_API_KEY` - Resend API key for emails

### 3. Database Setup

```bash
# Run migrations
npx prisma migrate dev

# Enable PostGIS extension (run in your PostgreSQL console)
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

# Seed sample data
npm run db:seed

# Open Prisma Studio to inspect data
npm run db:studio
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Sample data
├── src/
│   ├── app/
│   │   ├── (marketing)/    # Public pages (home, safety tips)
│   │   ├── (search)/       # Search & listing detail
│   │   ├── (dashboard)/    # Authenticated pages (inbox, listings, favorites)
│   │   ├── api/            # API routes (auth, search)
│   │   └── layout.tsx      # Root layout
│   ├── components/
│   │   ├── ui/             # shadcn/ui components
│   │   ├── map/            # Map components (markers, search box)
│   │   ├── listings/       # Listing cards, filters, gallery
│   │   ├── messages/       # Chat components
│   │   └── layout/         # Navbar, footer, hero
│   ├── actions/            # Server Actions (mutations)
│   ├── lib/
│   │   ├── prisma.ts       # Database client
│   │   ├── auth.ts         # Auth.js config
│   │   ├── utils.ts        # Helpers (formatPrice, formatDate)
│   │   └── validations/    # Zod schemas
│   ├── hooks/              # Custom React hooks
│   └── types/              # TypeScript types
```

## Key Features Implementation

### Map Search
The search page uses Mapbox GL JS with viewport-based fetching. As the user pans/zooms, the map bounds are sent to the API which queries PostgreSQL's PostGIS extension for listings within the viewport.

### Server Actions
All mutations (create listing, send message, toggle favorite) use Next.js Server Actions with automatic revalidation. No REST API needed.

### Authentication
Auth.js v5 with Google OAuth. Role-based access via `isLister` and `isAdmin` flags on the User model. Middleware handles route protection.

### Image Upload
Cloudinary handles image uploads, resizing, and CDN delivery. The upload widget is integrated in the listing creation wizard.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Add build command: `prisma generate && next build`
5. Deploy

### Database
Use Supabase PostgreSQL or any managed PostgreSQL provider. Ensure PostGIS extension is enabled.

## Next Steps / TODO

- [ ] Integrate Mapbox Geocoding API for address autocomplete
- [ ] Add Cloudinary upload widget to listing creation
- [ ] Implement Pusher for real-time messaging
- [ ] Add email notifications via Resend
- [ ] Build admin moderation panel
- [ ] Add Superlister badge calculation
- [ ] Implement listing report system
- [ ] Add safety tips page content
- [ ] Mobile app (Expo/React Native) - optional

## License

MIT
