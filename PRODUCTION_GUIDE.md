# MedAssist Global - Production Deployment Guide

Complete guide to deploy MedAssist Global for Website, Google Play Store, and Apple App Store.

## Table of Contents

1. [Domain & SSL Setup](#1-domain--ssl-setup)
2. [Cloud Infrastructure](#2-cloud-infrastructure)
3. [Database Setup](#3-database-production-setup)
4. [Backend Deployment](#4-backend-deployment)
5. [Web App Deployment](#5-web-app-deployment)
6. [Play Store Submission](#6-play-store-submission)
7. [App Store Submission](#7-app-store-submission)
8. [API Keys & Services](#8-api-keys--third-party-services)
9. [Monitoring & Logging](#9-monitoring--logging)
10. [CI/CD Pipeline](#10-cicd-pipeline)
11. [Security Checklist](#11-security-checklist)
12. [Performance Optimization](#12-performance-optimization)
13. [Legal & Compliance](#13-legal--compliance)
14. [Cost Estimation](#14-cost-estimation)

---

## 1. Domain & SSL Setup

### Buy a Domain
```
Recommended registrars: Namecheap, Cloudflare, Google Domains
Suggested: medassistglobal.com or medassist.app
Cost: ~$12/year
```

### SSL with Cloudflare (Free)
1. Create account at cloudflare.com
2. Add your domain → update nameservers at registrar
3. Enable "Full (strict)" SSL mode
4. Enable "Always Use HTTPS"

### SSL with Let's Encrypt (Self-managed)
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d medassistglobal.com -d www.medassistglobal.com

# Auto-renewal (add to cron)
0 0 1 * * certbot renew --quiet
```

---

## 2. Cloud Infrastructure

### Option A: DigitalOcean (Recommended for startups - $40/month)

```bash
# 1. Create Droplet: Ubuntu 22.04, 4GB RAM, 2 vCPUs ($24/mo)
# 2. SSH into server
ssh root@your-server-ip

# 3. Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 4. Install Docker Compose
sudo apt install docker-compose-plugin

# 5. Clone and deploy
git clone https://github.com/vishesh2305/MedAssist.git /opt/medassist
cd /opt/medassist
cp backend/.env.example backend/.env  # Edit with production values
docker compose -f docker-compose.prod.yml up -d
```

### Option B: AWS (Most Scalable)
```
Services needed:
- ECS Fargate: Backend + Web + AI (3 services)
- RDS PostgreSQL: db.t3.micro ($15/mo)
- ElastiCache Redis: cache.t3.micro ($12/mo)
- S3: File storage for documents
- CloudFront: CDN for web app
- Route 53: DNS management
- ACM: Free SSL certificates
Estimated cost: $100-200/month
```

### Option C: Vercel + Railway (Easiest)
```
- Vercel: Next.js web app (free tier)
- Railway: Backend + PostgreSQL + Redis ($5/mo starter)
- Render: AI services (free tier)
Estimated cost: $5-20/month
```

---

## 3. Database Production Setup

### Create Production Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create production database and user
CREATE USER medassist_prod WITH PASSWORD 'GENERATE_STRONG_PASSWORD';
CREATE DATABASE medassist_production OWNER medassist_prod;
GRANT ALL PRIVILEGES ON DATABASE medassist_production TO medassist_prod;
```

### Run Migrations
```bash
DATABASE_URL="postgresql://medassist_prod:PASSWORD@host:5432/medassist_production?sslmode=require" \
  npx prisma migrate deploy
```

### Automated Backups
```bash
# Add to crontab: daily backup at 2 AM
0 2 * * * pg_dump -U medassist_prod medassist_production | gzip > /backups/medassist_$(date +\%Y\%m\%d).sql.gz

# Keep only last 30 days
find /backups -name "medassist_*.sql.gz" -mtime +30 -delete
```

---

## 4. Backend Deployment

### Required Environment Variables
```env
# CRITICAL - Generate unique values for production
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
REDIS_URL=redis://:password@host:6379
JWT_ACCESS_SECRET=$(openssl rand -base64 64)
JWT_REFRESH_SECRET=$(openssl rand -base64 64)

# Application
PORT=4000
API_PREFIX=/api/v1
CORS_ORIGINS=https://medassistglobal.com
FRONTEND_URL=https://medassistglobal.com

# Email (SendGrid recommended)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
SMS_MOCK=false

# Payments (Stripe)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Optional enrichments
GOOGLE_PLACES_API_KEY=your_key
```

### Generate Secure Secrets
```bash
# Generate JWT secrets (run twice, use different values)
openssl rand -base64 64
```

---

## 5. Web App Deployment

### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd web
vercel --prod

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_API_URL = https://api.medassistglobal.com/api/v1
# NEXT_PUBLIC_WS_URL = https://api.medassistglobal.com
```

### Option B: Docker (Self-hosted)
Already configured in `docker-compose.prod.yml`.

---

## 6. Play Store Submission

### Prerequisites
- Google Play Developer Account ($25 one-time fee)
- App signing key
- Privacy policy URL (e.g., https://medassistglobal.com/privacy)

### Build for Android
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
cd mobile
eas init

# Create production build
eas build --platform android --profile production
# This generates an .aab file
```

### Upload to Play Console
1. Go to [play.google.com/console](https://play.google.com/console)
2. Create new app → "MedAssist Global"
3. Fill in store listing:
   - **App name**: MedAssist Global
   - **Short description**: Find trusted hospitals & get emergency help while traveling
   - **Category**: Medical
   - **Content rating**: Complete questionnaire → Everyone
4. Upload .aab file to Production track
5. Add screenshots (minimum 2 phone screenshots)
6. Set pricing: Free
7. Submit for review (1-7 days)

### Required app.json for production
```json
{
  "expo": {
    "name": "MedAssist Global",
    "slug": "medassist-global",
    "version": "1.0.0",
    "android": {
      "package": "com.medassist.global",
      "versionCode": 1,
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "CAMERA"
      ]
    }
  }
}
```

---

## 7. App Store Submission

### Prerequisites
- Apple Developer Account ($99/year)
- Mac with Xcode installed
- App Store Connect account

### Build for iOS
```bash
# Build
eas build --platform ios --profile production

# Submit
eas submit --platform ios
```

### App Store Connect
1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Create new app
3. Fill in app information:
   - **Name**: MedAssist Global
   - **Bundle ID**: com.medassist.global
   - **SKU**: medassist-global-001
4. Upload screenshots for:
   - 6.7" iPhone (1290 x 2796)
   - 6.5" iPhone (1284 x 2778)
   - iPad Pro 12.9" (2048 x 2732)
5. Fill in privacy practices questionnaire
6. Submit for review (1-3 days typically)

### Required iOS permissions (Info.plist)
```
NSLocationWhenInUseUsageDescription: Find nearby hospitals and emergency services
NSCameraUsageDescription: Scan insurance cards and medical documents
NSMicrophoneUsageDescription: Telemedicine video and audio consultations
```

---

## 8. API Keys & Third-Party Services

| Service | Purpose | Free Tier | Setup URL |
|---------|---------|-----------|-----------|
| **Google Places API** | Hospital details, reviews, photos | $200/mo credit | console.cloud.google.com |
| **Stripe** | Payments | 2.9% + $0.30/txn | dashboard.stripe.com |
| **Twilio** | SMS OTP | $15 free credit | twilio.com/console |
| **SendGrid** | Emails | 100/day free | sendgrid.com |
| **OpenAI** | AI translation, health companion | $5 free credit | platform.openai.com |
| **Firebase** | Push notifications | Free | console.firebase.google.com |
| **Sentry** | Error tracking | 5K events/mo free | sentry.io |
| **Cloudflare** | CDN, DDoS protection | Free | cloudflare.com |
| **UptimeRobot** | Uptime monitoring | 50 monitors free | uptimerobot.com |

---

## 9. Monitoring & Logging

### Error Tracking (Sentry)
```bash
# Backend
npm install @sentry/node
# Add to index.ts: Sentry.init({ dsn: process.env.SENTRY_DSN })

# Web
npm install @sentry/nextjs
# Run: npx @sentry/wizard@latest -i nextjs
```

### Uptime Monitoring
Set up UptimeRobot to monitor:
- `https://api.medassistglobal.com/api/v1/health` (every 5 min)
- `https://medassistglobal.com` (every 5 min)
- Alert via email + SMS if down

### Log Management
```bash
# View logs in production
docker compose -f docker-compose.prod.yml logs -f --tail=100

# Or use Papertrail/Logtail for cloud log aggregation
```

---

## 10. CI/CD Pipeline

GitHub Actions workflow is already configured at `.github/workflows/deploy.yml`.

### Setup Steps
1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Add these secrets:
   - `SERVER_HOST`: Your production server IP
   - `SERVER_USER`: SSH username (e.g., `deploy`)
   - `SSH_KEY`: Private SSH key content
3. Every push to `main` will: test → build → deploy automatically

---

## 11. Security Checklist

Before going live:

- [ ] Generate unique JWT_ACCESS_SECRET and JWT_REFRESH_SECRET
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS everywhere (Cloudflare or Let's Encrypt)
- [ ] Set CORS_ORIGINS to production domain only
- [ ] Set SMS_MOCK=false for real OTP
- [ ] Configure Stripe webhook verification
- [ ] Set up daily database backups
- [ ] Enable Cloudflare DDoS protection
- [ ] Set up Sentry error tracking
- [ ] Create privacy policy and terms of service pages
- [ ] Remove all development/test credentials
- [ ] Set up rate limiting (already configured in code)
- [ ] Test all authentication flows
- [ ] Test emergency features end-to-end

---

## 12. Performance Optimization

- **CDN**: Use Cloudflare (free) for static assets
- **Database**: Enable connection pooling with PgBouncer
- **Caching**: Redis already configured for session/rate limiting
- **Images**: Use Next.js Image component with CDN
- **Gzip**: Already enabled in Nginx config
- **Lazy Loading**: Already implemented in web app
- **Code Splitting**: Next.js handles this automatically

---

## 13. Legal & Compliance

### Required Pages
Create these pages on your website:
1. **Privacy Policy** - What data you collect, how you use it, GDPR rights
2. **Terms of Service** - Usage terms, liability limitations
3. **Medical Disclaimer** - "Not a substitute for professional medical advice"
4. **Cookie Policy** - If using analytics/tracking cookies

### GDPR Compliance (for EU users)
- Right to data export (user can download their data)
- Right to deletion (user can delete their account)
- Cookie consent banner
- Data processing transparency

### App Store Requirements
- Both stores require a privacy policy URL
- Declare all data collection practices
- Health category may require additional review documentation

---

## 14. Cost Estimation

### Minimum Launch ($40/month)
| Item | Cost |
|------|------|
| DigitalOcean Droplet (4GB) | $24/mo |
| Domain name | $1/mo |
| SendGrid (100 emails/day) | Free |
| Cloudflare CDN | Free |
| Google Places API | Free ($200 credit) |
| **Total** | **~$25/mo** |

### Growth Stage ($150/month)
| Item | Cost |
|------|------|
| DigitalOcean Droplet (8GB) | $48/mo |
| Managed PostgreSQL | $15/mo |
| Managed Redis | $10/mo |
| Twilio SMS | ~$20/mo |
| SendGrid Pro | $15/mo |
| Sentry | Free tier |
| Monitoring | Free tier |
| **Total** | **~$108/mo** |

### Scale Stage ($500/month)
Add: Load balancer, auto-scaling, dedicated Redis, S3 storage, CloudFront CDN.

---

## Quick Deploy Commands

```bash
# Clone
git clone https://github.com/vishesh2305/MedAssist.git
cd MedAssist

# Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with production values

# Deploy with Docker
docker compose -f docker-compose.prod.yml up -d

# Run database migrations
docker compose exec backend npx prisma migrate deploy

# Seed initial data
docker compose exec backend npx prisma db seed

# Check status
docker compose -f docker-compose.prod.yml ps

# View logs
docker compose -f docker-compose.prod.yml logs -f
```

---

**Your app is now ready for production deployment across Web, Play Store, and App Store.**
