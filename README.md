# 🧠 SnowBrain v4

**Real-time AI Teaching Platform with Voice Interaction**

SnowBrain v4 is an innovative educational platform that combines AI-powered voice conversations with personalized learning experiences. Students can have natural voice conversations with AI tutors on any subject and topic.

![SnowBrain v4](https://img.shields.io/badge/SnowBrain-v4-blue)
![Next.js](https://img.shields.io/badge/Next.js-13+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)
![Vapi.ai](https://img.shields.io/badge/Vapi.ai-Voice%20AI-purple)

## ✨ Features

### 🎯 Core Features
- **Voice AI Conversations**: Natural voice interactions with AI tutors using Vapi.ai
- **Multi-Subject Learning**: Support for any subject and topic
- **Personalized Teaching Styles**: Adaptive teaching approaches (friendly, professional, casual)
- **Real-time Conversations**: Live voice chat with AI tutors
- **Session History**: Track learning progress and conversation history
- **Bookmark System**: Save favorite learning sessions

### 🔧 Technical Features
- **User Authentication**: Secure auth with Clerk (3-tier pricing)
- **Database Management**: PostgreSQL with Supabase and RLS policies
- **Voice Integration**: Deepgram transcription + ElevenLabs text-to-speech
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Type Safety**: Full TypeScript implementation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- Docker (for local Supabase)

### One-Command Setup

```bash
# Clone and start development environment
git clone https://github.com/DimitriTedom/snow-Brain-v3.git
cd snow-Brain-v3
./dev-helper.sh start
```

This command will:
- Install all dependencies
- Start local Supabase services
- Configure environment variables
- Launch the development server

### Manual Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/DimitriTedom/snow-Brain-v3.git
   cd snow-Brain-v3
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment** (copy your `.env` configuration)

4. **Start Supabase locally**:
   ```bash
   supabase start
   ```

5. **Switch to local environment**:
   ```bash
   ./switch-env.sh local
   ```

6. **Start development server**:
   ```bash
   npm run dev
   ```

## 🛠️ Development Commands

### Helper Scripts

```bash
# Start full development environment
./dev-helper.sh start

# Stop all services
./dev-helper.sh stop

# Reset local database
./dev-helper.sh reset-db

# Run tests and type checking
./dev-helper.sh test

# Build for production
./dev-helper.sh build

# Show project status
./dev-helper.sh status
```

### Environment Switching

```bash
# Use local Supabase (for development)
./switch-env.sh local

# Use remote Supabase (for production testing)
./switch-env.sh remote
```

### Database Management

```bash
# Start Supabase services
supabase start

# Access Supabase Studio
open http://localhost:54323

# Apply schema changes
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -f complete-supabase-schema.sql

# Reset database
supabase db reset
```

## 🏗️ Architecture

### Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | Next.js 13+ App Router | React framework with server components |
| **Language** | TypeScript | Type-safe development |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **UI Components** | shadcn/ui | Beautiful, accessible components |
| **Database** | Supabase (PostgreSQL) | Database with real-time capabilities |
| **Authentication** | Clerk | User authentication and management |
| **Voice AI** | Vapi.ai | Voice conversation platform |
| **Transcription** | Deepgram | Speech-to-text |
| **Text-to-Speech** | ElevenLabs | Natural voice synthesis |
| **LLM** | OpenAI/DeepSeek | Language model for conversations |

### Project Structure

```
├── app/                    # Next.js 13+ App Router
│   ├── brains/            # Brain management pages
│   ├── my-profile/        # User profile
│   └── api/               # API routes
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── BrainComponent.tsx # Voice interaction component
│   └── ...               # Feature components
├── lib/                   # Utilities and configurations
│   ├── actions/          # Server actions
│   ├── supabase.ts       # Database client
│   └── vapi.sdk.ts       # Voice AI client
├── types/                 # TypeScript definitions
├── hooks/                 # Custom React hooks
├── constants/             # Application constants
└── supabase/             # Database configuration
```

### Database Schema

- **users**: User profiles and authentication
- **brains**: Learning session definitions
- **user_bookmarks**: User's saved sessions
- **session_history**: Conversation history

Full schema in [`complete-supabase-schema.sql`](complete-supabase-schema.sql)

## 🔒 Authentication & Pricing

### Clerk Integration

3-tier subscription model:

| Plan | Price | Brains Limit | Conversations |
|------|-------|--------------|---------------|
| **Fast** | Free | 3 brains | 10 conversations |
| **Expert** | $20/month | 10 brains | Unlimited |
| **Heavy** | $40/month | Unlimited | Unlimited |

### Row Level Security

All database tables are protected with RLS policies:
- Users can only access their own data
- Public content (brains) is viewable by all
- Bookmarks and history are user-scoped

## 🎙️ Voice AI Features

### Conversation Flow

1. **User selects** subject, topic, and teaching style
2. **AI tutor introduces** the session
3. **Natural conversation** with real-time voice interaction
4. **Session history** is automatically saved
5. **Transcript** is stored for review

### Voice Configuration

- **Multiple voices** available through ElevenLabs
- **Teaching styles**: Friendly, professional, casual, enthusiastic
- **Real-time processing** with minimal latency
- **Smart interruption** handling

## 🌍 Deployment

### Environment Configuration

The project supports both local and remote Supabase:

```bash
# Local development
./switch-env.sh local

# Production/staging
./switch-env.sh remote
```

### Production Build

```bash
# Build for production
./dev-helper.sh build

# Or manually
npm run build
npm start
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly: `./dev-helper.sh test`
5. Submit a pull request

### Code Standards

- TypeScript for all new code
- ESLint + Prettier for formatting
- Conventional commits
- Comprehensive testing

## 📚 Documentation

- [Contributing Guide](CONTRIBUTING.md)
- [API Documentation](docs/api.md) (if available)
- [Deployment Guide](docs/deployment.md) (if available)

## 🔧 Troubleshooting

### Common Issues

**Supabase won't start:**
```bash
supabase stop
docker system prune -f
supabase start
```

**Environment variables not working:**
```bash
./switch-env.sh local  # or remote
# Restart your dev server
```

**Database connection issues:**
```bash
./dev-helper.sh reset-db
```

### Getting Help

- 📖 Check this README and [Contributing Guide](CONTRIBUTING.md)
- 🐛 [Open an issue](https://github.com/DimitriTedom/snow-Brain-v3/issues) for bugs
- 💡 [Start a discussion](https://github.com/DimitriTedom/snow-Brain-v3/discussions) for questions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the amazing backend platform
- [Clerk](https://clerk.com) for seamless authentication
- [Vapi.ai](https://vapi.ai) for voice AI capabilities
- [Vercel](https://vercel.com) for hosting and deployment
- [shadcn/ui](https://ui.shadcn.com) for beautiful components

---

<div align="center">

**Built with ❤️ by the SnowBrain Team**

[Website](https://your-website.com) • [Twitter](https://twitter.com/yourhandle) • [Discord](https://discord.gg/yourinvite)

</div>
  
  ```sh
  brew install supabase/tap/supabase-beta
  brew link --overwrite supabase-beta
  ```
  
  To upgrade:

  ```sh
  brew upgrade supabase
  ```
</details>

<details>
  <summary><b>Windows</b></summary>

  Available via [Scoop](https://scoop.sh). To install:

  ```powershell
  scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
  scoop install supabase
  ```

  To upgrade:

  ```powershell
  scoop update supabase
  ```
</details>

<details>
  <summary><b>Linux</b></summary>

  Available via [Homebrew](https://brew.sh) and Linux packages.

  #### via Homebrew

  To install:

  ```sh
  brew install supabase/tap/supabase
  ```

  To upgrade:

  ```sh
  brew upgrade supabase
  ```

  #### via Linux packages

  Linux packages are provided in [Releases](https://github.com/supabase/cli/releases). To install, download the `.apk`/`.deb`/`.rpm`/`.pkg.tar.zst` file depending on your package manager and run the respective commands.

  ```sh
  sudo apk add --allow-untrusted <...>.apk
  ```

  ```sh
  sudo dpkg -i <...>.deb
  ```

  ```sh
  sudo rpm -i <...>.rpm
  ```

  ```sh
  sudo pacman -U <...>.pkg.tar.zst
  ```
</details>

<details>
  <summary><b>Other Platforms</b></summary>

  You can also install the CLI via [go modules](https://go.dev/ref/mod#go-install) without the help of package managers.

  ```sh
  go install github.com/supabase/cli@latest
  ```

  Add a symlink to the binary in `$PATH` for easier access:

  ```sh
  ln -s "$(go env GOPATH)/bin/cli" /usr/bin/supabase
  ```

  This works on other non-standard Linux distros.
</details>

<details>
  <summary><b>Community Maintained Packages</b></summary>

  Available via [pkgx](https://pkgx.sh/). Package script [here](https://github.com/pkgxdev/pantry/blob/main/projects/supabase.com/cli/package.yml).
  To install in your working directory:

  ```bash
  pkgx install supabase
  ```

  Available via [Nixpkgs](https://nixos.org/). Package script [here](https://github.com/NixOS/nixpkgs/blob/master/pkgs/development/tools/supabase-cli/default.nix).
</details>

### Run the CLI

```bash
supabase bootstrap
```

Or using npx:

```bash
npx supabase bootstrap
```

The bootstrap command will guide you through the process of setting up a Supabase project using one of the [starter](https://github.com/supabase-community/supabase-samples/blob/main/samples.json) templates.

## Docs

Command & config reference can be found [here](https://supabase.com/docs/reference/cli/about).

## Breaking changes

We follow semantic versioning for changes that directly impact CLI commands, flags, and configurations.

However, due to dependencies on other service images, we cannot guarantee that schema migrations, seed.sql, and generated types will always work for the same CLI major version. If you need such guarantees, we encourage you to pin a specific version of CLI in package.json.

## Developing

To run from source:

```sh
# Go >= 1.22
go run . help
```
