# AI Calling CRM — Production Deployment Guide
## Architecture, Hosting Options, CI/CD, and Scaling Roadmap

This guide details how to deploy the AI Calling CRM platform to production. It covers infrastructure setup, containerization, security policies, and performance scaling.

---

## 1. Hosting Architecture Overview

For a reliable production setup, the frontend and backend should be decoupled and hosted separately to optimize resource allocation:

```text
               +-----------------------------------------+
               |            Client Browser               |
               +-----------------------------------------+
                                    |
                                    | HTTPS / WSS
                                    v
                       +-------------------------+
                       |    Cloudflare CDN       |
                       +-------------------------+
                        /                       \
                       /                         \
                      v                           v
     +-------------------------+         +-------------------------+
     |   Frontend Hosting      |         |     Backend Server      |
     |   (Vercel / Netlify)    |         |  (AWS ECS / Render)     |
     +-------------------------+         +-------------------------+
                                                      |
                                                      | MongoDB Protocol
                                                      v
                                         +-------------------------+
                                         |    MongoDB Atlas        |
                                         |    (Replica Set)        |
                                         +-------------------------+
```

---

## 2. Containerization (Dockerization)

Containerizing the application ensures consistency across local, staging, and production environments.

### 2.1 Backend Dockerfile (`/backend/Dockerfile`)
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app ./
ENV NODE_ENV=production
EXPOSE 5001
CMD ["npm", "start"]
```

### 2.2 Frontend Dockerfile (`/frontend/Dockerfile`)
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Nginx web server stage to serve static client build files
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 3. Production Deployment Options

### Option A: Cloud SaaS Platforms (Fastest Deploy)
*   **Frontend**: Host on **Vercel** or **Netlify**. Connect the GitHub repository for automatic CD.
*   **Backend**: Host on **Render** (Web Service tier) or **Railway**.
*   **Database**: **MongoDB Atlas** shared cluster (M0 or M10 tier) with auto-scaling storage.

### Option B: Cloud VPS / IaaS (Cost-Effective & Scalable)
*   **Infrastructure**: **AWS EC2** or **DigitalOcean Droplets**.
*   **Nginx Reverse Proxy**: Setup Nginx on the VM to route traffic, handle SSL encryption, and serve static assets:
    *   Forward `http://yourdomain.com` to Frontend (Nginx internal port 80).
    *   Forward `http://yourdomain.com/api` to Backend Server (port 5001).
    *   Forward `http://yourdomain.com/socket.io` to WebSocket handler.
*   **SSL Certificates**: Obtain free SSL certificates using **Certbot & Let's Encrypt**.

---

## 4. Continuous Integration & Deployment (CI/CD)

Configure GitHub Actions to automate code checks and deployments:

### CI/CD Workflow (`.github/workflows/deploy.yml`)
```yaml
name: Deploy Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-size: 20
      - name: Backend Tests
        run: |
          cd backend
          npm ci
          npm test
      - name: Frontend Build
        run: |
          cd frontend
          npm ci
          npm run build

  deploy-backend:
    needs: build-and-test
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Webhook Deploy
        run: curl -X POST ${{ secrets.RENDER_DEPLOY_WEBHOOK }}
```

---

## 5. Security & Scaling Best Practices

1.  **CORS & Helmet Policies**:
    *   Explicitly restrict `CORS` origins in backend `app.js` to your exact frontend domain.
    *   Utilize `helmet` middleware to set secure HTTP headers (preventing clickjacking and cross-site scripting).
2.  **API Rate Limiting**:
    *   Activate `express-rate-limit` on public routes (such as `/api/auth/login`) to prevent brute-force attacks.
3.  **Background Message Queues (BullMQ / Redis)**:
    *   In production, audio recording callbacks from Twilio and LLM analysis pipelines can be time-consuming. Offload these tasks to background workers using **Redis & BullMQ** to prevent blocking HTTP server processes.
4.  **Database Connection Pooling**:
    *   Configure the Mongoose connection pool size (e.g. `maxPoolSize: 50`) in backend `db.js` to handle simultaneous database queries efficiently.
5.  **Monitoring & Error Audits**:
    *   Configure **Sentry** inside both frontend and backend for real-time error tracking and dashboard alerts.
    *   Use **Winston Logger** to output logs to cloud aggregators (like Datadog or Papertrail).
