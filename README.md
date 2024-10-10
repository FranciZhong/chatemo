# Chatemo

## 🚀 Introduction

[Chatemo](http://www.chatemo.chat/) is a cutting-edge team communication platform that seamlessly integrates Large Language Models (LLMs) to revolutionize collaborative workflows. In today's AI-driven world, Chatemo stands out by offering a unique blend of human interaction and artificial intelligence, designed to boost productivity, creativity, and problem-solving capabilities within teams.

### 🌟 What Makes Chatemo Special

1. **AI-Enhanced Team Discussions:**
   Chatemo provides rich chat contexts where teams can effortlessly summon AI assistance at any point in their conversations. This seamless integration ensures that valuable insights and information are always at your fingertips.

2. **Multi-Model Flexibility:**
   Unlike traditional platforms, Chatemo supports multiple LLM models within the same communication context. Users have the freedom to manage their own API keys, ensuring security and allowing for flexible use of preferred models based on specific needs.

3. **Customizable AI Agents:**
   Easily configure and deploy AI agents tailored to your team's unique requirements. These versatile agents can be utilized across all communications and channels, with the flexibility to choose the most suitable models for each agent's function.

4. **Collaborative AI Ecosystem:**
   Chatemo enables various AI agents to work together, each specializing in different tasks. This collaborative approach allows teams to tackle complex, multi-faceted problems by leveraging the unique strengths of different AI models in concert.

5. **Context-Aware AI Interactions:**
   Experience two distinct types of AI behaviors: direct communication for focused, immediate responses, and channel mode where AI agents consider message history for more nuanced, context-aware assistance.

6. **Preview and Fine-Tune:**
   With Chatemo's preview mode, users can fine-tune AI responses for both agent configurations and chat contexts before deployment, ensuring optimal alignment with team expectations and communication styles.

By addressing the challenges of modern team collaboration and harnessing the power of AI, Chatemo empowers teams to work smarter, faster, and more creatively. Whether you're a startup disrupting an industry or an established enterprise seeking to innovate, Chatemo provides the collaborative edge you need in today's fast-paced, AI-enhanced work environment.

## 🛠️ Tech Stack

### 🖥️ Frontend

- ⚛️ React
- 🔼 Next.js
- 🎨 Tailwind CSS
  - 🌓 Tailwind Themes
  - 🔀 Tailwind Merge
- 🧱 Shadcn UI
- 📝 react-hook-form
- 🗃️ Zustand (State Management)

### 🗄️ Backend

- 🔼 Next.js API Routes
- 🔌 Socket.io (Real-time Communication)
- 🔐 NextAuth.js (Authentication)
  - 🔑 Google OAuth

### 💾 Database & ORM

- 🐘 PostgreSQL
- 🔗 Prisma ORM

### ☁️ Cloud Services

- 🪣 AWS S3 (File Storage)
- 🌐 GCP: GKE (Kubernetes Engine)

### 🤖 AI Integration

- 🧠 OpenAI SDK
- 🤯 Anthropic SDK

### 🛠️ Utilities

- ✅ Zod: Schema Validation
- 🔄 Axios: HTTP Client
- 📅 date-fns: Date Manipulation
- 🆔 uuid: Unique Identifiers
- ⏳ use-debounce

### 📝 Markdown Processing

- 📘 React Markdown
- 🔧 remark & rehype plugins

### 🧰 Development Tools

- 📘 TypeScript
- 🧹 ESLint
- 📦 Prisma CLI
- 🔐 dotenv-cli

## 🚀 DevOps

### 🔄 CI/CD

- 🐙 GitHub Actions: CI/CD pipelines

### 🐳 Containerization

- 📄 Dockerfile
- 🐙 Docker Compose: for Local Development

### ☸️ Orchestration

- 🚢 Kubernetes (K8s): for Production Deployments

### ☁️ Cloud Platforms

- 🌐 Google Cloud Platform (GCP)
  - 🛳️ Google Kubernetes Engine (GKE)
- ☁️ Amazon Web Services (AWS)
  - 🪣 S3 Buckets

## Getting Started

To get started with Chatemo, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/chatemo.git
   cd chatemo
   Install dependencies:
   ```

npm install
Set up environment variables:
Create a .env.local file in the root directory and add the necessary environment variables. Refer to .env.example for the required variables.

Set up the database:

npm run prisma:push
Run the development server:

npm run dev
The application should now be running on http://localhost:3000.

Scripts
Chatemo comes with several useful scripts:

npm run dev: Starts the development server
npm run build: Builds the application for production
npm run start: Starts the production server
npm run lint: Runs the linter to check for code quality issues
npm run prisma:push: Pushes the Prisma schema to the database
npm run prisma:studio: Opens Prisma Studio for database management
Deployment
To deploy Chatemo to production:

Build the application:

npm run build
Start the production server:

npm run start
Ensure that all environment variables are properly set in your production environment.

Contributing
We welcome contributions to Chatemo! If you'd like to contribute, please follow these steps:

Fork the repository
Create a new branch (git checkout -b feature/amazing-feature)
Make your changes
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
Please make sure to update tests as appropriate and adhere to the existing coding style.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Support
If you encounter any issues or have questions, please file an issue on the GitHub repository or contact our support team at support@chatemo.com.

Acknowledgements
Thanks to all the open-source projects that made Chatemo possible
Special thanks to our contributors and early adopters for their valuable feedback and support
Chatemo - Empowering teams with AI-enhanced communication and collaboration.

This comprehensive README provides a thorough overview of the Chatemo project, including its purpose, features, tech stack, setup instructions, contribution guidelines, and more. It offers potential users and contributors all the information they need to understand, use, and potentially contribute to the project.
