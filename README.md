# Chatemo

## 🚀 Introduction

Welcome to [Chatemo](http://www.chatemo.chat/), the cutting-edge team communication app that integrates Large Language Models (LLMs) to provide real-time problem-solving capabilities. With Chatemo, there's no need to switch contexts to ask questions—various models. Instead, agents with tailored prompts are accessible directly within the conversation window. Simply input your preferred providers' API keys to get started.

[Quick Start](https://www.chatemo.chat/docs/quick-start).

## 🌟 Core Features

1. **AI-Enhanced Team Discussions**  
   Seamlessly integrate AI assistance into your conversations, ensuring insights and information are always at hand.

2. **Multi-Model Flexibility**  
   Utilize multiple LLMs within a single communication context, allowing users to manage their own API keys and select models based on specific needs.

3. **Customizable AI Agents**  
   Configure and manage AI agents tailored to your requirements, usable across all communications and channels.

4. **Collaborative AI Ecosystem**  
   Leverage a network of specialized AI agents working together to tackle complex, multi-faceted problems effectively.

5. **Context-Aware AI Interactions**  
   Experience direct communication for immediate responses or channel mode for nuanced, context-aware assistance using message history.

6. **Preview and Fine-Tune**  
   Use Chatemo's preview mode to fine-tune AI responses before deployment, ensuring alignment with team expectations.

## 🛠️ Tech Stack

### 🖥️ Frontend

- ⚛️ **React**: A JavaScript library for building user interfaces.
- 🔼 **Next.js**: Framework for server-side rendering and static site generation.
- 🎨 **Tailwind CSS**: Utility-first CSS framework.
  - 🌓 **Tailwind Themes & Merge**: Customizable themes and utility merging.
- 🧱 **Shadcn UI**: Accessible component library.
- 📝 **react-hook-form**: Form state management library.
- 🗃️ **Zustand**: Lightweight state management solution.

### 🗄️ Backend

- 🔼 **Next.js API Routes**: For creating API endpoints.
- 🔌 **Socket.io**: Real-time communication tool.
- 🔐 **NextAuth.js & Google OAuth**: Authentication solutions.
- 🐘 **PostgreSQL & Prisma ORM**: Advanced relational database management.

### 🤖 AI Integration

- 🤖 OpenAI SDK
- 🤯 Anthropic SDK
- 🧠 Google AI SDK

### 🛠️ Utilities

- ✅ Zod
- 🔄 Axios
- 📅 date-fns
- 🆔 uuid
- ⏳ use-debounce

### 📝 Markdown Fully Support

Utilize React Markdown along with remark & rehype plugins for markdown processing in React applications.

### 🧰 Development Tools

Includes TypeScript, ESLint, Prisma CLI, dotenv-cli among others for robust development practices.

## 🚀 DevOps

### 🔄 CI/CD with GitHub Actions

Ensures seamless integration and deployment pipelines.

### 🐳 Containerization with Docker

Use Dockerfile and Docker Compose for environment setup and local development ease.

### ☸️ Orchestration via Kubernetes

Manage containerized applications in production efficiently using Kubernetes (K8s).

### ☁️ Cloud Platforms

Deploy on Google Cloud Platform (GCP) using Google Kubernetes Engine (GKE) or Amazon Web Services (AWS) utilizing S3 Buckets for storage needs.

## Deployment Guide

Visit our online platform at [Chatemo](http://www.chatemo.chat/).

### Local Deployment Instructions:

1. Ensure Docker and Docker Compose are installed on your machine.
2. Set up Google OAuth credentials; configure callback URI as `http://localhost:3000/api/auth/callback/google`.
3. Prepare AWS S3 bucket if utilizing image upload features.

#### Install Packages:

```bash
npm install
```

#### Configure Environment Variables:

Rename `.env.example` to `.env.local` and set local variables accordingly:

```plaintext
# essential for socket.io
NEXT_PUBLIC_SOCKET_HOST=http://localhost:3000

# db
DATABASE_URL=postgres://user:password@localhost:5432/chatemo

# redis
# can skip redis configuration if use single instance
REDIS_PORT=6379
REDIS_HOST=localhost
REDIS_PASSWORD=password
REDIS_DB=0

# next-auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET= # openssl rand -base64 32

# providers
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AWS S3 bucket
# used for image/file uploaded
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET_NAME=

```

#### Set Up Databases Locally:

Use Docker Compose commands:

```bash
docker compose up -d
```

Synchronize Postgres database using Prisma:

```bash
npm run prisma:generate && npm run prisma:migrate
```

#### Start the Service:

For development:

```bash
npm run dev
```

For production:

```bash
npm run build && npm run start
```
