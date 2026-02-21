---
sidebar_position: 2
title: Deploy with Docker
description: Deploy your Noxion blog to any server using Docker.
---

# Deploy with Docker

Docker deployment is ideal for:
- Self-hosted servers (VPS, dedicated server)
- Kubernetes / container orchestration
- Environments where you want full control over the infrastructure
- Teams with existing Docker-based deployment pipelines

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) 20.10+
- [Docker Compose](https://docs.docker.com/compose/install/) 2.0+ (included in Docker Desktop)

---

## Docker Compose (quickest)

The generated project includes a ready-to-use `docker-compose.yml`:

```bash
cd my-blog
cp .env.example .env   # fill in your values
docker compose up -d
```

Access your blog at `http://localhost:3000`.

### docker-compose.yml

```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NOTION_PAGE_ID=${NOTION_PAGE_ID}
      - SITE_NAME=${SITE_NAME}
      - SITE_DOMAIN=${SITE_DOMAIN}
      - SITE_AUTHOR=${SITE_AUTHOR}
      - SITE_DESCRIPTION=${SITE_DESCRIPTION}
      - REVALIDATE_SECRET=${REVALIDATE_SECRET}
    restart: unless-stopped
```

---

## Dockerfile explained

The included Dockerfile uses a **3-stage build** to minimize the final image size:

```dockerfile
# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN npm install --frozen-lockfile

# Stage 2: Build Next.js
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Minimal production runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Next.js standalone output (includes only required files)
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
```

The `standalone` output mode (configured in `next.config.ts` with `output: "standalone"`) produces a `server.js` that bundles all required Node.js modules, reducing the final image to ~100–150 MB.

### Enabling standalone output

If your `next.config.ts` doesn't already have `output: "standalone"`, add it:

```ts
// next.config.ts
const nextConfig: NextConfig = {
  output: "standalone",
  // ...
};
```

---

## Manual Docker commands

```bash
# Build the image
docker build -t my-blog .

# Run with environment variables
docker run -d \
  --name my-blog \
  -p 3000:3000 \
  -e NOTION_PAGE_ID=abc123def456 \
  -e SITE_NAME="My Blog" \
  -e SITE_DOMAIN=myblog.com \
  -e SITE_AUTHOR="Jane Doe" \
  --restart unless-stopped \
  my-blog

# Or use an env file
docker run -d \
  --name my-blog \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  my-blog
```

---

## Production setup with nginx reverse proxy

For production, you'll typically want a reverse proxy in front of Next.js to:
- Handle TLS/HTTPS (SSL certificates)
- Serve static files directly (faster)
- Handle compression
- Rate limiting

### nginx configuration

```nginx
# /etc/nginx/sites-available/myblog.com
server {
    listen 80;
    server_name myblog.com www.myblog.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name myblog.com www.myblog.com;

    ssl_certificate /etc/letsencrypt/live/myblog.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/myblog.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Serve Next.js static files directly
    location /_next/static/ {
        alias /app/.next/static/;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location /static/ {
        alias /app/public/;
        expires 365d;
    }

    # Proxy everything else to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL with Certbot (Let's Encrypt)

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d myblog.com -d www.myblog.com
```

---

## Docker Compose with nginx

For a complete self-hosted setup:

```yaml
# docker-compose.yml
services:
  web:
    build: .
    expose:
      - "3000"
    env_file: .env
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - web
    restart: unless-stopped
```

---

## Image builds for different platforms

If you're building on an Apple Silicon Mac but deploying to a Linux AMD64 server:

```bash
docker buildx build \
  --platform linux/amd64 \
  -t my-blog:latest \
  --push \
  .
```

Or use Docker Buildx with multi-platform support for images that run on both architectures.

---

## Resource requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| RAM | 256 MB | 512 MB |
| CPU | 1 vCPU | 1–2 vCPU |
| Disk | 2 GB | 10 GB (if downloading images) |

Next.js in standalone mode is quite lean. A $4–6/month VPS (e.g., Hetzner CX11, DigitalOcean Droplet) is sufficient for a personal blog.

---

## Updating

```bash
# Pull latest code
git pull

# Rebuild and restart
docker compose down
docker compose build --no-cache
docker compose up -d
```

Or use a CI/CD pipeline (GitHub Actions → SSH deploy) to automate this on every push to main.
