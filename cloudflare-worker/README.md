# Cloudflare Worker + D1 Backend for Windows XP Portfolio

This directory contains the production-ready serverless backend powered by **Cloudflare Workers** and **Cloudflare D1 (Serverless SQLite)**.

## 🚀 2-Minute Setup

### 1. Install Wrangler (if not already installed)
```bash
npm install -g wrangler
# or use with npx
```

### 2. Log in to Cloudflare
```bash
npx wrangler login
```

### 3. Create your Cloudflare D1 Database
```bash
npx wrangler d1 create portfolio-db
```
This command outputs your `database_id`. Copy it into `wrangler.toml`:
```toml
[[d1_databases]]
binding = "DB"
database_name = "portfolio-db"
database_id = "<YOUR_DATABASE_ID_HERE>"
```

### 4. Execute the Schema to Initialize Tables
```bash
# For local development:
npx wrangler d1 execute portfolio-db --local --file=./schema.sql

# For production Cloudflare:
npx wrangler d1 execute portfolio-db --remote --file=./schema.sql
```

### 5. Set Your Admin Password
```bash
npx wrangler secret put ADMIN_PASSWORD
# Enter your desired administrator password (e.g. your private master password)
```

### 6. Deploy
```bash
npx wrangler deploy
```

Once deployed, copy your worker URL (e.g., `https://portfolio-api.<your-subdomain>.workers.dev`) and paste it into the **Admin Panel -> Cloudflare Settings** tab inside Windows XP!
