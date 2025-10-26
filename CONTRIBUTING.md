# 🤝 Contributing to SnowBrain v4

Thank you for your interest in contributing to SnowBrain v4! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Docker** (for local Supabase)
- **Git**

### Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DimitriTedom/snow-Brain-v3.git
   cd snow-Brain-v3
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development environment**:
   ```bash
   ./dev-helper.sh start
   ```

This will:
- Start local Supabase services
- Switch to local environment
- Install dependencies
- Start the Next.js development server

## 🏗️ Project Structure

```
├── app/                    # Next.js 13+ App Router pages
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   └── ...               # Feature components
├── lib/                   # Utility functions and configurations
│   ├── actions/          # Server actions
│   ├── supabase.ts       # Supabase client
│   └── utils.ts          # Utility functions
├── types/                 # TypeScript type definitions
├── constants/             # Application constants
├── hooks/                 # Custom React hooks
├── public/                # Static assets
├── supabase/             # Supabase configuration
└── complete-supabase-schema.sql  # Database schema
```

## 🔧 Development Workflow

### Local Development

1. **Start development environment**:
   ```bash
   ./dev-helper.sh start
   ```

2. **Make your changes**

3. **Test your changes**:
   ```bash
   ./dev-helper.sh test
   ```

4. **Switch environments** (if needed):
   ```bash
   ./switch-env.sh local   # Use local Supabase
   ./switch-env.sh remote  # Use remote Supabase
   ```

### Database Changes

1. **Make changes to** `complete-supabase-schema.sql`

2. **Apply changes locally**:
   ```bash
   ./dev-helper.sh reset-db
   ```

3. **Test thoroughly** before pushing

### Code Style

- Use **TypeScript** for all new code
- Follow **ESLint** and **Prettier** configurations
- Use **Tailwind CSS** for styling
- Follow **Next.js 13+ App Router** patterns

## 🧪 Testing

### Running Tests

```bash
# Run all tests
./dev-helper.sh test

# Individual commands
npm run lint          # ESLint
npm run type-check    # TypeScript
npm test             # Jest tests (if configured)
```

### Manual Testing

1. **Test with local Supabase**:
   ```bash
   ./switch-env.sh local
   npm run dev
   ```

2. **Test with remote Supabase**:
   ```bash
   ./switch-env.sh remote
   npm run dev
   ```

3. **Test production build**:
   ```bash
   ./dev-helper.sh build
   ```

## 📦 Features & Components

### Core Features

- **Voice AI Integration** (Vapi)
- **User Authentication** (Clerk)
- **Database Management** (Supabase)
- **Real-time AI Teaching**
- **Bookmark System**
- **Session History**

### Technology Stack

- **Frontend**: Next.js 13+, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Clerk
- **Voice AI**: Vapi.ai
- **UI Components**: shadcn/ui
- **Deployment**: Vercel

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to reproduce**: Detailed steps
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Environment**: Browser, OS, Node.js version
6. **Screenshots/Videos**: If applicable

## 💡 Feature Requests

For new features:

1. **Check existing issues** first
2. **Describe the problem** the feature solves
3. **Propose a solution** with implementation details
4. **Consider alternatives** and trade-offs

## 🔀 Pull Request Process

1. **Fork the repository**

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** following the guidelines

4. **Test thoroughly**:
   ```bash
   ./dev-helper.sh test
   ```

5. **Commit with clear messages**:
   ```bash
   git commit -m "feat: add new voice interaction feature"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request** with:
   - Clear title and description
   - Link to related issues
   - Screenshots/videos if applicable
   - Test results

### Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Maintenance tasks

## 🔒 Security

- **Never commit** sensitive data (API keys, passwords)
- Use environment variables for configuration
- Follow security best practices
- Report security vulnerabilities privately

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Vapi.ai Documentation](https://docs.vapi.ai)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 💬 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and community support
- **Documentation**: Check the README and this guide

## 📜 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to SnowBrain v4! 🧠✨