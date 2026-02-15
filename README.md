# 🔬 SyncScript - Collaborative Research & Citation Engine

<div align="center">

![SyncScript Banner](https://img.shields.io/badge/SyncScript-Research%20Platform-blue?style=for-the-badge)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

**A next-generation collaborative platform for researchers to build, share, and manage Knowledge Vaults with verified sources, annotated PDFs, and cross-referenced citations**

[Features](#-key-features) • [Architecture](#-system-architecture) • [Quick Start](#-quick-start) • [API Reference](#-api-surface) • [Demo](#-live-demo)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Data Model](#-data-model)
- [Quick Start](#-quick-start)
- [API Surface](#-api-surface)
- [Design Decisions](#-design-decisions)
- [Security](#-security)
- [Performance & Optimization](#-performance--optimization)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Assumptions & Limitations](#-assumptions--limitations)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

SyncScript is a high-performance, collaborative research platform designed to address the critical challenge of information silos in academic and professional research. It enables researchers to create **Knowledge Vaults**—shared repositories of verified sources, annotated PDFs, and cross-referenced citations—with real-time collaboration capabilities.

### Business Context

In academia and professional research, valuable information often remains isolated. While numerous tools exist for individual writing and note-taking, there's a significant gap in collaborative, real-time verification and source sharing. SyncScript bridges this gap by providing:

- **Centralized Knowledge Management**: Unified repositories for research materials
- **Real-Time Collaboration**: Instant synchronization across all collaborators
- **Access Control**: Granular permission management for secure sharing
- **Data Integrity**: Immutable audit trails and version control

---

## 🔍 Problem Statement

### The Challenge

Traditional research workflows suffer from:

1. **Information Silos**: Research scattered across emails, local files, and personal bookmarks
2. **Collaboration Friction**: Difficulty in sharing and co-editing research materials
3. **Version Conflicts**: Multiple versions of documents without clear lineage
4. **Access Management**: Inadequate control over who can view or edit sensitive research
5. **Source Verification**: Lack of centralized, verified citation management

### Our Solution

SyncScript transforms research collaboration by:

- Creating a **single source of truth** for research teams
- Enabling **real-time synchronization** across distributed teams
- Implementing **role-based access control** for secure collaboration
- Providing **immutable audit logs** for research integrity
- Offering **cloud-based file management** for scalability and security

---

## ✨ Key Features

### Core Functionality

#### 🗄️ Knowledge Vaults
- Create and manage shared research repositories
- Organize sources, annotations, and citations hierarchically
- Support for public and private vaults
- Customizable vault metadata and tags

#### 📚 Resource Management
- **Full CRUD Operations** for sources (URLs, titles, authors)
- **Annotation System** for notes, highlights, and comments
- **Smart Tagging** for categorization and discovery
- **Advanced Search** across all vault contents

#### 👥 Collaboration & Sharing
- **Real-Time Co-Editing**: See changes as they happen
- **Role-Based Access Control (RBAC)**:
  - **Owner**: Full control over vault settings and permissions
  - **Contributor**: Add, edit, and delete research materials
  - **Viewer**: Read-only access to vault contents
- **Invite System**: Share vaults via email or shareable links

### Advanced Features

#### ⚡ Real-Time Synchronization
- **WebSocket Integration**: Instant updates across all connected clients
- **Presence Indicators**: See who's currently active in a vault
- **Conflict Resolution**: Smart merging of concurrent edits

#### 🔒 Security & Access Control
- **JWT Authentication**: Secure, stateless authentication
- **OAuth 2.0 Support**: Integration with Google, GitHub, and institutional logins
- **Rate Limiting**: Protection against API abuse (100 requests/minute per user)
- **Request Throttling**: Adaptive throttling based on server load
- **Audit Logging**: Comprehensive activity tracking for compliance

#### ☁️ Cloud Integration
- **AWS S3 Integration**: Scalable, durable file storage
- **Signed URLs**: Secure, time-limited access to uploaded files
- **Multipart Uploads**: Efficient handling of large PDF files
- **CDN Acceleration**: Fast global content delivery

#### 🚀 Performance Optimization
- **Redis Caching**: Sub-millisecond response times for frequent queries
- **Database Indexing**: Optimized queries for complex relationships
- **Lazy Loading**: Progressive content loading for improved UX
- **Connection Pooling**: Efficient database resource utilization

#### 🔔 Notifications
- **Real-Time Alerts**: Browser notifications for vault updates
- **Email Notifications**: Digest emails for vault activity
- **SMS Integration**: Critical updates via Twilio
- **Webhook Support**: Integrate with third-party tools

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Next.js 14 App (SSR/CSR)                   │   │
│  │  • Server Components (data fetching)                 │   │
│  │  • Client Components (interactivity)                 │   │
│  │  • React Server Actions (mutations)                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Edge Network                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Edge         │  │ Serverless   │  │ Static       │      │
│  │ Functions    │  │ Functions    │  │ Assets       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │         Upstash Redis (Rate Limiting)              │     │
│  └────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ REST + WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Platform                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ PostgreSQL   │  │ Auth         │  │ Storage      │      │
│  │ (RLS)        │  │ (JWT)        │  │ (S3-like)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │ Realtime     │  │ Edge         │                        │
│  │ (WebSocket)  │  │ Functions    │                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Application                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              app/ (App Router)                       │   │
│  │  ┌────────────────────────────────────────────────┐  │   │
│  │  │  • (auth)/         - Auth pages                │  │   │
│  │  │  • dashboard/      - Main app                  │  │   │
│  │  │  • vaults/[id]/    - Vault pages               │  │   │
│  │  │  • api/            - API routes (health, etc.) │  │   │
│  │  │  • actions/        - Server Actions            │  │   │
│  │  └────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              components/                             │   │
│  │  • ui/          - shadcn/ui components               │   │
│  │  • vaults/      - Vault-specific components          │   │
│  │  • sources/     - Source management components       │   │
│  │  • shared/      - Reusable components                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              lib/                                    │   │
│  │  • supabase/    - Supabase clients (client, server) │   │
│  │  • db/          - Schema, migrations                │   │
│  │  • redis.ts     - Upstash Redis client              │   │
│  │  • utils.ts     - Utility functions                 │   │
│  │  • validations/ - Zod schemas                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

#### Read Flow (Server Components)
```
User Request
    ↓
Next.js Server Component
    ↓
Supabase Client (server-side)
    ↓
PostgreSQL (with RLS)
    ↓
Data returned to component
    ↓
HTML streamed to client
```

#### Write Flow (Server Actions)
```
User Action (form submit, button click)
    ↓
Server Action invoked
    ↓
Rate limit check (Upstash Redis)
    ↓
Supabase mutation
    ↓
PostgreSQL write (RLS enforced)
    ↓
Audit log created
    ↓
Realtime broadcast (if subscribed)
    ↓
Success/error returned to client
```

#### Real-time Flow (Supabase Realtime)
```
Client subscribes to table/channel
    ↓
Supabase Realtime WebSocket
    ↓
Database change (INSERT/UPDATE/DELETE)
    ↓
Trigger fires (PostgreSQL)
    ↓
Realtime broadcasts to subscribers
    ↓
Client receives update
    ↓
UI re-renders automatically
```

---

## 🗃️ Data Model

### Entity-Relationship Diagram

```
┌─────────────────┐         ┌─────────────────┐
│   auth.users    │         │     vaults      │
│  (Supabase)     │         ├─────────────────┤
├─────────────────┤         │ id (PK)         │
│ id (PK)         │◄────────│ owner_id (FK)   │
│ email           │         │ name            │
│ created_at      │         │ description     │
└─────────────────┘         │ created_at      │
        │                   │ updated_at      │
        │                   └─────────────────┘
        │                           │
        │                           │
        │    ┌──────────────────────┴────────────────────┐
        │    │                                            │
        │    ▼                                            ▼
        │  ┌─────────────────────┐          ┌─────────────────────┐
        │  │   vault_members     │          │      sources        │
        │  ├─────────────────────┤          ├─────────────────────┤
        └─►│ vault_id (FK)       │          │ id (PK)             │
           │ user_id (FK)        │          │ vault_id (FK)       │
           │ role (ENUM)         │          │ title               │
           │ created_at          │          │ url                 │
           └─────────────────────┘          │ file_path           │
                                            │ created_at          │
           ┌─────────────────────┐          │ updated_at          │
           │  vault_invites      │          └─────────────────────┘
           ├─────────────────────┤                    │
           │ vault_id (FK)       │                    │
           │ email               │                    ▼
           │ role (ENUM)         │          ┌─────────────────────┐
           │ created_at          │          │    annotations      │
           └─────────────────────┘          ├─────────────────────┤
                                            │ id (PK)             │
┌─────────────────────┐                    │ source_id (FK)      │
│    audit_logs       │                    │ user_id (FK)        │
├─────────────────────┤                    │ note                │
│ id (PK)             │                    │ page_number         │
│ vault_id (FK)       │                    │ rect (JSONB)        │
│ user_id (FK)        │                    │ created_at          │
│ action              │                    └─────────────────────┘
│ metadata (JSONB)    │
│ created_at          │
└─────────────────────┘
```

### Database Schema (Supabase/PostgreSQL)

#### Vaults Table
```sql
CREATE TABLE vaults (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_vaults_owner ON vaults(owner_id);

-- Row Level Security (RLS)
ALTER TABLE vaults ENABLE ROW LEVEL SECURITY;

-- Owner can do anything
CREATE POLICY "Owners have full access to their vaults"
    ON vaults FOR ALL
    USING (owner_id = auth.uid());

-- Members can view vaults they belong to
CREATE POLICY "Members can view vaults"
    ON vaults FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM vault_members
            WHERE vault_id = vaults.id AND user_id = auth.uid()
        )
    );
```

#### Vault Members Table (Many-to-Many with Roles)
```sql
CREATE TYPE vault_role AS ENUM ('owner', 'contributor', 'viewer');

CREATE TABLE vault_members (
    vault_id UUID NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role vault_role NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (vault_id, user_id)
);

-- Indexes
CREATE INDEX idx_vault_members_vault ON vault_members(vault_id);
CREATE INDEX idx_vault_members_user ON vault_members(user_id);
CREATE INDEX idx_vault_members_role ON vault_members(role);

-- RLS
ALTER TABLE vault_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view vault memberships"
    ON vault_members FOR SELECT
    USING (
        vault_id IN (
            SELECT id FROM vaults WHERE owner_id = auth.uid()
            UNION
            SELECT vault_id FROM vault_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Owners can manage members"
    ON vault_members FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM vaults
            WHERE id = vault_id AND owner_id = auth.uid()
        )
    );
```

#### Sources Table
```sql
CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    url TEXT,
    file_path TEXT,  -- Path in Supabase Storage (e.g., 'pdfs/uuid.pdf')
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sources_vault ON sources(vault_id);
CREATE INDEX idx_sources_title ON sources USING gin(to_tsvector('english', title));

-- RLS
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vault members can view sources"
    ON sources FOR SELECT
    USING (
        vault_id IN (
            SELECT id FROM vaults WHERE owner_id = auth.uid()
            UNION
            SELECT vault_id FROM vault_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Contributors can add sources"
    ON sources FOR INSERT
    WITH CHECK (
        vault_id IN (
            SELECT vault_id FROM vault_members
            WHERE user_id = auth.uid() AND role IN ('owner', 'contributor')
        )
    );

CREATE POLICY "Contributors can update/delete sources"
    ON sources FOR UPDATE, DELETE
    USING (
        vault_id IN (
            SELECT vault_id FROM vault_members
            WHERE user_id = auth.uid() AND role IN ('owner', 'contributor')
        )
    );
```

#### Annotations Table
```sql
CREATE TABLE annotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    page_number INTEGER,
    rect JSONB,  -- {x, y, width, height} for highlight position
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_annotations_source ON annotations(source_id);
CREATE INDEX idx_annotations_user ON annotations(user_id);

-- RLS
ALTER TABLE annotations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vault members can view annotations"
    ON annotations FOR SELECT
    USING (
        source_id IN (
            SELECT id FROM sources
            WHERE vault_id IN (
                SELECT id FROM vaults WHERE owner_id = auth.uid()
                UNION
                SELECT vault_id FROM vault_members WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Contributors can add annotations"
    ON annotations FOR INSERT
    WITH CHECK (
        source_id IN (
            SELECT id FROM sources
            WHERE vault_id IN (
                SELECT vault_id FROM vault_members
                WHERE user_id = auth.uid() AND role IN ('owner', 'contributor')
            )
        )
    );

CREATE POLICY "Users can update/delete their own annotations"
    ON annotations FOR UPDATE, DELETE
    USING (user_id = auth.uid());
```

#### Vault Invites Table
```sql
CREATE TABLE vault_invites (
    vault_id UUID NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role vault_role NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (vault_id, email)
);

-- Indexes
CREATE INDEX idx_vault_invites_email ON vault_invites(email);

-- RLS
ALTER TABLE vault_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage invites"
    ON vault_invites FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM vaults
            WHERE id = vault_id AND owner_id = auth.uid()
        )
    );
```

#### Audit Logs Table (Append-Only)
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id UUID REFERENCES vaults(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_logs_vault ON audit_logs(vault_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- RLS (read-only for owners)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view audit logs"
    ON audit_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM vaults
            WHERE id = vault_id AND owner_id = auth.uid()
        )
    );
```

### Realtime Configuration

Enable Realtime for live updates:

```sql
-- Enable Realtime on tables
ALTER PUBLICATION supabase_realtime ADD TABLE sources;
ALTER PUBLICATION supabase_realtime ADD TABLE vault_members;
ALTER PUBLICATION supabase_realtime ADD TABLE annotations;
```

### Storage Buckets

**PDFs Bucket** (Private)
- Bucket name: `pdfs`
- Public: `false`
- File size limit: 10MB
- Allowed MIME types: `application/pdf`

Storage Policies:
```sql
-- Users can upload to their vault folders
CREATE POLICY "Users can upload PDFs"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'pdfs' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Vault members can read PDFs
CREATE POLICY "Vault members can download PDFs"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'pdfs' AND
        EXISTS (
            SELECT 1 FROM sources s
            JOIN vault_members vm ON s.vault_id = vm.vault_id
            WHERE s.file_path = name AND vm.user_id = auth.uid()
        )
    );

-- Contributors can delete PDFs
CREATE POLICY "Contributors can delete PDFs"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'pdfs' AND
        EXISTS (
            SELECT 1 FROM sources s
            JOIN vault_members vm ON s.vault_id = vm.vault_id
            WHERE s.file_path = name
              AND vm.user_id = auth.uid()
              AND vm.role IN ('owner', 'contributor')
        )
    );
```

---

## 🛠️ Tech Stack

### Core Framework
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 14 (App Router) | Full-stack React framework with server components |
| **TypeScript** | 5.0+ | Type safety across frontend and backend |
| **React** | 18.2+ | UI library (server & client components) |

### Database & Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Supabase** | Latest | PostgreSQL database, Auth, Storage, Realtime |
| **PostgreSQL** | 15.x | Relational database (via Supabase) |
| **Supabase Auth** | - | JWT-based authentication with session management |
| **Supabase Realtime** | - | WebSocket subscriptions for live updates |
| **Supabase Storage** | - | File storage with signed URLs |
| **Row Level Security (RLS)** | - | Database-level access control |

### State & Caching
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Upstash Redis** | Latest | Distributed rate limiting & optional caching |
| **TanStack Query** | 4.29+ | Server state management (optional) |
| **React Server Components** | - | Native Next.js data fetching |

### UI & Styling
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Tailwind CSS** | 3.3+ | Utility-first CSS framework |
| **shadcn/ui** | Latest | Accessible React component library |
| **Radix UI** | Latest | Unstyled accessible primitives |
| **Lucide React** | 0.263+ | Icon library |

### Developer Experience
| Technology | Version | Purpose |
|-----------|---------|---------|
| **ESLint** | 8.x | Code linting |
| **Prettier** | 3.x | Code formatting |
| **@supabase/ssr** | Latest | Server-side rendering helpers |

### Deployment & Infrastructure
| Technology | Purpose |
|-----------|---------|
| **Vercel** | Hosting & serverless functions |
| **Supabase Cloud** | Managed database, auth, storage |
| **Upstash** | Serverless Redis |
| **GitHub Actions** | CI/CD pipeline (optional) |

### Why This Stack?

**Next.js 14 (App Router)**
- Server Components reduce client bundle size
- Built-in API routes via Server Actions
- Excellent performance with automatic code splitting
- Seamless integration with Vercel deployment

**Supabase**
- All-in-one backend (database, auth, storage, realtime)
- PostgreSQL with full SQL capabilities
- Row Level Security for granular permissions
- Real-time subscriptions without additional setup
- Generous free tier

**Upstash Redis**
- Serverless-native (no connection limits)
- Pay-per-request pricing
- Global edge caching
- Perfect for Vercel/serverless deployments

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **Supabase Account** ([Sign up for free](https://supabase.com))
- **Upstash Account** ([Sign up for free](https://upstash.com)) - Optional, for rate limiting
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/syncscript.git
cd syncscript
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned
3. Note your **Project URL** and **anon public** key from Settings → API

#### Run Database Schema

1. Open Supabase SQL Editor
2. Copy and paste the contents of `lib/db/schema.sql`
3. Execute the SQL to create tables
4. Run migrations from `supabase/migrations/*.sql`
5. Enable Realtime: Run `supabase/realtime-enable.sql`

```sql
-- Enable Realtime subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE sources;
ALTER PUBLICATION supabase_realtime ADD TABLE vault_members;
ALTER PUBLICATION supabase_realtime ADD TABLE annotations;
```

#### Create Storage Bucket

1. Navigate to Storage in Supabase Dashboard
2. Create a new bucket named `pdfs`
3. Set it to **Private**
4. Configure bucket policies (see schema comments or `lib/db/storage-policies.sql`)

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Update `.env.local` with your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Upstash Redis (Optional - for rate limiting)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important Notes:**
- The `SUPABASE_SERVICE_ROLE_KEY` should NEVER be exposed to the client
- Rate limiting is automatically disabled if Upstash credentials are missing
- For production, update `NEXT_PUBLIC_APP_URL` to your deployed domain

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 6. Create Your First Vault

1. Navigate to `http://localhost:3000`
2. Click **Sign Up** and create an account
3. Verify your email (check Supabase email settings)
4. Click **Create Vault**
5. Add sources, upload PDFs, and invite collaborators!

---

## ⚙️ Configuration Details

### Environment Variables Explained

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Public anon key (safe for client) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Service role key (server-side only) |
| `UPSTASH_REDIS_REST_URL` | ⚠️ | Upstash Redis REST endpoint (optional) |
| `UPSTASH_REDIS_REST_TOKEN` | ⚠️ | Upstash auth token (optional) |
| `NEXT_PUBLIC_APP_URL` | ✅ | Application base URL |

### Supabase Auth Configuration

For production, configure email templates and OAuth providers in Supabase Dashboard:

1. **Email Templates**: Settings → Auth → Email Templates
2. **OAuth Providers**: Settings → Auth → Providers
   - Google OAuth
   - GitHub OAuth
   - Microsoft OAuth (optional)

### Rate Limiting Configuration

Edit `lib/redis.ts` to customize rate limits:

```typescript
// Default: 60 requests per minute per IP
const RATE_LIMIT_WINDOW = 60; // seconds
const RATE_LIMIT_MAX_REQUESTS = 60;
```

### File Upload Configuration

Edit `app/actions/upload.ts` to modify upload limits:

```typescript
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['application/pdf'];
```

---

## 🚀 Usage

### Creating a Knowledge Vault

1. **Sign Up / Log In**
   - Navigate to the homepage
   - Click "Sign Up" or "Log In"
   - Complete authentication

2. **Create a New Vault**
   - Click "Create Vault" from the dashboard
   - Enter vault name and description
   - Set visibility (Public/Private)
   - Click "Create"

3. **Add Sources**
   - Open your vault
   - Click "Add Source"
   - Enter URL, title, and author
   - Or upload a PDF file
   - Click "Save"

4. **Annotate Research**
   - Click on any source
   - Highlight text to create annotations
   - Add notes and comments
   - Organize with tags

### Collaborating with Team Members

1. **Invite Collaborators**
   - Open vault settings
   - Click "Invite Members"
   - Enter email addresses
   - Assign roles (Owner/Contributor/Viewer)
   - Send invitations

2. **Real-Time Editing**
   - All changes appear instantly for active users
   - See who's currently viewing the vault
   - Collaborate without conflicts

3. **Manage Permissions**
   - Change member roles anytime
   - Remove members when needed
   - Transfer ownership if required

### Advanced Features

#### Searching Across Vaults
```javascript
// Global search
GET /api/search?q=machine+learning&type=sources

// Vault-specific search
GET /api/vaults/:vaultId/search?q=deep+learning
```

#### Exporting Citations
```javascript
// Export in various formats
GET /api/vaults/:vaultId/export?format=bibtex
GET /api/vaults/:vaultId/export?format=ris
GET /api/vaults/:vaultId/export?format=json
```

---

## 📡 API Surface

SyncScript uses **Next.js Server Actions** for mutations and **Supabase client-side queries** (protected by RLS) for reads. This approach provides type-safe, server-side execution with minimal boilerplate.

### Server Actions (Mutations)

All Server Actions are located in `app/actions/` and are automatically rate-limited.

#### Authentication

```typescript
// Location: app/actions/auth.ts

// Sign Up
async function signUpAction(formData: FormData)
// Returns: { error?: string; success?: boolean }

// Sign In
async function signInAction(formData: FormData)
// Returns: { error?: string }

// Sign Out
async function signOutAction()
// Returns: void
```

**Usage Example:**
```typescript
'use client';

import { signInAction } from '@/app/actions/auth';

export function LoginForm() {
  return (
    <form action={signInAction}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Sign In</button>
    </form>
  );
}
```

---

#### Vaults

```typescript
// Location: app/actions/vaults.ts

// Create Vault
async function createVault(name: string, description?: string)
// Returns: { id: string; name: string } | { error: string }

// Update Vault
async function updateVault(vaultId: string, data: {
  name?: string;
  description?: string;
})
// Returns: { success: true } | { error: string }

// Delete Vault
async function deleteVault(vaultId: string)
// Returns: { success: true } | { error: string }
```

**Usage Example:**
```typescript
'use client';

import { createVault } from '@/app/actions/vaults';
import { useState } from 'react';

export function CreateVaultButton() {
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    const result = await createVault('My Research Vault', 'Description...');
    if ('error' in result) {
      toast.error(result.error);
    } else {
      toast.success('Vault created!');
      router.push(`/vaults/${result.id}`);
    }
    setLoading(false);
  };

  return (
    <button onClick={handleCreate} disabled={loading}>
      Create Vault
    </button>
  );
}
```

---

#### Vault Members

```typescript
// Location: app/actions/members.ts

// Invite Member
async function inviteMember(
  vaultId: string,
  email: string,
  role: 'owner' | 'contributor' | 'viewer'
)
// Returns: { success: true } | { error: string }

// Update Member Role
async function updateMemberRole(
  vaultId: string,
  userId: string,
  role: 'owner' | 'contributor' | 'viewer'
)
// Returns: { success: true } | { error: string }

// Remove Member
async function removeMember(vaultId: string, userId: string)
// Returns: { success: true } | { error: string }
```

---

#### Sources

```typescript
// Location: app/actions/sources.ts

// Add Source
async function addSource(vaultId: string, data: {
  title: string;
  url?: string;
  filePath?: string;
})
// Returns: { id: string; title: string } | { error: string }

// Update Source
async function updateSource(sourceId: string, data: {
  title?: string;
  url?: string;
})
// Returns: { success: true } | { error: string }

// Delete Source
async function deleteSource(sourceId: string)
// Returns: { success: true } | { error: string }

// Bulk Delete Sources
async function deleteSourcesBulk(sourceIds: string[])
// Returns: { deleted: number } | { error: string }
```

---

#### File Upload

```typescript
// Location: app/actions/upload.ts

// Upload PDF
async function uploadPdf(formData: FormData)
// FormData fields:
//   - file: File (max 10MB, PDF only)
//   - vaultId: string
//   - title?: string
// Returns: { sourceId: string; filePath: string } | { error: string }
```

**Usage Example:**
```typescript
'use client';

import { uploadPdf } from '@/app/actions/upload';

export function UploadForm({ vaultId }: { vaultId: string }) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('vaultId', vaultId);
    
    const result = await uploadPdf(formData);
    if ('error' in result) {
      toast.error(result.error);
    } else {
      toast.success('PDF uploaded successfully!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="file" type="file" accept="application/pdf" required />
      <input name="title" type="text" placeholder="Title (optional)" />
      <button type="submit">Upload</button>
    </form>
  );
}
```

---

#### Annotations

```typescript
// Location: app/actions/annotations.ts

// Add Annotation
async function addAnnotation(sourceId: string, data: {
  note: string;
  pageNumber?: number;
  rect?: { x: number; y: number; width: number; height: number };
})
// Returns: { id: string } | { error: string }

// Update Annotation
async function updateAnnotation(annotationId: string, note: string)
// Returns: { success: true } | { error: string }

// Delete Annotation
async function deleteAnnotation(annotationId: string)
// Returns: { success: true } | { error: string }
```

---

### API Routes (REST Endpoints)

#### Health Check
```http
GET /api/health

Response: 200 OK
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "database": "connected",
  "redis": "connected"
}
```

#### Audit Logs
```http
GET /api/vaults/[vaultId]/audit-logs
Authorization: Required (session cookie)

Query Parameters:
  - limit: number (default: 50, max: 1000)
  - offset: number (default: 0)
  - format: 'json' | 'csv' (default: 'json')

Response: 200 OK
{
  "logs": [
    {
      "id": "uuid",
      "action": "source_added",
      "user": { "name": "John Doe", "email": "john@example.com" },
      "metadata": { "sourceId": "uuid", "title": "..." },
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 150
}

Response (CSV format):
id,action,user_email,created_at,metadata
uuid,source_added,john@example.com,2024-01-15T10:30:00Z,"..."
```

---

### Client-Side Queries (Supabase)

For reading data, use Supabase client directly with RLS protection:

```typescript
// Example: Fetch vault sources
import { createClient } from '@/lib/supabase/client';

export async function getVaultSources(vaultId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('sources')
    .select('*')
    .eq('vault_id', vaultId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}
```

---

### Real-Time Subscriptions

Subscribe to live updates using Supabase Realtime:

```typescript
'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect } from 'react';

export function useVaultRealtime(vaultId: string) {
  useEffect(() => {
    const supabase = createClient();
    
    // Subscribe to source changes
    const channel = supabase
      .channel(`vault-${vaultId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sources',
          filter: `vault_id=eq.${vaultId}`
        },
        (payload) => {
          console.log('Source changed:', payload);
          // Trigger UI update (e.g., invalidate query)
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [vaultId]);
}
```

**Supported Events:**
- `INSERT` - New source/annotation added
- `UPDATE` - Source/annotation updated
- `DELETE` - Source/annotation deleted

---

### Rate Limiting

All Server Actions are automatically rate-limited via Upstash Redis (if configured):

- **Limit**: 60 requests per minute per IP address
- **Window**: Sliding window
- **Response**: HTTP 429 (Too Many Requests)

To customize rate limits, edit `lib/redis.ts`:

```typescript
const RATE_LIMIT = {
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests
};
```

---

## 🔐 Security

### Authentication & Authorization

#### JWT Implementation
- **Stateless Authentication**: JWT tokens for scalable authentication
- **Token Expiry**: Access tokens expire in 7 days, refresh tokens in 30 days
- **Secure Storage**: Tokens stored in httpOnly cookies (not localStorage)
- **Token Rotation**: Automatic refresh token rotation on renewal

#### Role-Based Access Control (RBAC)
```javascript
// Middleware example
const checkPermission = (requiredRole) => {
  return async (req, res, next) => {
    const member = await VaultMember.findOne({
      vaultId: req.params.vaultId,
      userId: req.user.id
    });
    
    const roleHierarchy = { owner: 3, contributor: 2, viewer: 1 };
    
    if (roleHierarchy[member.role] >= roleHierarchy[requiredRole]) {
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions' });
    }
  };
};
```

### Data Protection

#### Encryption
- **In Transit**: TLS 1.3 for all communications
- **At Rest**: AES-256 encryption for sensitive data in database
- **Files**: Server-side encryption (SSE) for S3 objects

#### Input Validation
- **Request Validation**: Joi schemas for all API inputs
- **SQL Injection Prevention**: Parameterized queries via Prisma ORM
- **XSS Protection**: Content Security Policy headers
- **CSRF Protection**: SameSite cookies and CSRF tokens

### Rate Limiting

```javascript
// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests, please try again later'
});

// Endpoint-specific limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  skipSuccessfulRequests: true
});
```

### Audit Logging

All sensitive actions are logged:
- User authentication (login, logout, password changes)
- Vault operations (create, update, delete, permission changes)
- Source operations (add, edit, delete, file uploads)
- Member management (invite, role change, remove)

```sql
-- Example audit log entry
{
  "vault_id": "uuid",
  "user_id": "uuid",
  "action": "member_role_changed",
  "entity_type": "vault_member",
  "entity_id": "uuid",
  "metadata": {
    "old_role": "viewer",
    "new_role": "contributor",
    "changed_by": "uuid"
  },
  "ip_address": "192.168.1.1",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

## ⚡ Performance & Optimization

### Database Performance

#### Query Optimization
```sql
-- Composite indexes for common queries
CREATE INDEX idx_sources_vault_created ON sources(vault_id, created_at DESC);
CREATE INDEX idx_vault_members_user_role ON vault_members(user_id, role);

-- Full-text search index
CREATE INDEX idx_sources_search ON sources 
  USING gin(to_tsvector('english', title));

-- Partial index for active vaults only
CREATE INDEX idx_active_vaults ON vaults(updated_at DESC) 
  WHERE updated_at > NOW() - INTERVAL '30 days';
```

#### Connection Pooling
Supabase manages connection pooling automatically with PgBouncer:
- **Transaction mode**: For short-lived queries
- **Session mode**: For prepared statements
- Configurable pool size based on plan

### Caching Strategy (Redis)

When Upstash Redis is configured, the following are cached:

```typescript
// lib/redis.ts

// Cache vault list for 5 minutes
const cacheVaultList = async (userId: string) => {
  const cacheKey = `vaults:user:${userId}`;
  await redis.setex(cacheKey, 300, JSON.stringify(vaults));
};

// Cache user permissions for 15 minutes
const cachePermissions = async (userId: string, vaultId: string) => {
  const cacheKey = `permissions:${userId}:${vaultId}`;
  await redis.setex(cacheKey, 900, JSON.stringify(permissions));
};

// Invalidate cache on updates
const invalidateVaultCache = async (vaultId: string) => {
  const pattern = `*:${vaultId}`;
  // Delete all keys matching pattern
  await redis.del(pattern);
};
```

### Frontend Optimization

#### Code Splitting & Lazy Loading
```typescript
// app/vaults/[id]/page.tsx
import dynamic from 'next/dynamic';

// Lazy load heavy components
const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  loading: () => <PDFViewerSkeleton />,
  ssr: false,
});

const AnnotationEditor = dynamic(() => import('@/components/AnnotationEditor'), {
  loading: () => <Skeleton className="h-40" />,
});
```

#### Image Optimization
```typescript
// Next.js Image component with automatic optimization
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="SyncScript"
  width={200}
  height={50}
  priority // Above-the-fold images
/>
```

#### Streaming & Suspense
```typescript
// app/vaults/[id]/page.tsx
import { Suspense } from 'react';

export default function VaultPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <Suspense fallback={<VaultHeaderSkeleton />}>
        <VaultHeader vaultId={params.id} />
      </Suspense>
      
      <Suspense fallback={<SourceListSkeleton />}>
        <SourceList vaultId={params.id} />
      </Suspense>
    </div>
  );
}
```

### Real-time Performance

#### Debounced Subscriptions
```typescript
// Prevent excessive re-renders from rapid updates
import { useDebouncedCallback } from 'use-debounce';

const debouncedUpdate = useDebouncedCallback((payload) => {
  // Update UI
  queryClient.invalidateQueries(['sources', vaultId]);
}, 300);

channel.on('postgres_changes', { ... }, debouncedUpdate);
```

#### Optimistic Updates
```typescript
// Update UI immediately, rollback on error
const { mutate } = useMutation({
  mutationFn: updateSource,
  onMutate: async (newData) => {
    // Cancel outgoing queries
    await queryClient.cancelQueries(['source', sourceId]);
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(['source', sourceId]);
    
    // Optimistically update
    queryClient.setQueryData(['source', sourceId], newData);
    
    return { previous };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['source', sourceId], context.previous);
  },
});
```

### Bundle Size Optimization

Current production bundle (example):
```
Route (app)                              Size     First Load JS
┌ ○ /                                    142 B          87.1 kB
├ ○ /_not-found                          871 B          85.1 kB
├ ƒ /api/health                          0 B                0 B
├ ƒ /api/vaults/[id]/audit-logs          0 B                0 B
├ ○ /dashboard                           2.3 kB         89.2 kB
├ ○ /vaults/[id]                         8.1 kB         95.0 kB
└ ○ /vaults/[id]/sources/[sourceId]      11.2 kB        98.1 kB
+ First Load JS shared by all            84.2 kB
  ├ chunks/framework-xxxxx.js            45.2 kB
  ├ chunks/main-app-xxxxx.js             32.1 kB
  └ other shared chunks (total)          6.9 kB

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

---

## 🧪 Testing

### Manual Testing Workflow

#### 1. Authentication Flow
```bash
✅ Sign up with email/password
✅ Email verification (check Supabase email logs)
✅ Sign in with verified account
✅ Sign out
✅ Password reset flow
✅ OAuth sign-in (Google/GitHub if configured)
```

#### 2. Vault Operations
```bash
✅ Create new vault
✅ Update vault name/description
✅ Delete vault (cascade check)
✅ View vault as owner
✅ Invite member with each role (owner/contributor/viewer)
```

#### 3. Source Management
```bash
✅ Add source with URL
✅ Add source with PDF upload (10MB limit test)
✅ Update source metadata
✅ Delete source (check file deletion in storage)
✅ Bulk delete multiple sources
```

#### 4. Annotations
```bash
✅ Add annotation to source
✅ Add annotation with page number and highlight
✅ Update annotation text
✅ Delete annotation
```

#### 5. Collaboration
```bash
✅ Open vault in two browser tabs (different users)
✅ Add source in Tab 1 → appears in Tab 2 (real-time)
✅ Update source in Tab 2 → updates in Tab 1
✅ Test role permissions:
   - Viewer: Cannot add/edit/delete
   - Contributor: Can add/edit/delete sources
   - Owner: Full access
```

#### 6. Audit Logs
```bash
✅ Perform various actions
✅ View audit logs in /api/vaults/[id]/audit-logs
✅ Export logs as CSV
✅ Verify log entries have correct metadata
```

### Automated Testing (Future)

#### Unit Tests (Vitest)
```bash
npm run test
```

Test coverage goals:
- [ ] Server Actions: 80%+
- [ ] Utility Functions: 90%+
- [ ] Components: 70%+

#### E2E Tests (Playwright)
```bash
npm run test:e2e
```

Critical paths to automate:
- [ ] Sign up → Create vault → Add source → Invite member
- [ ] Upload PDF → Add annotation → Delete source
- [ ] Real-time collaboration between two users

### Linting & Formatting

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Check formatting
npm run format:check

# Auto-format code
npm run format
```

### Performance Testing

```bash
# Lighthouse CI (requires configuration)
npm run lighthouse

# Bundle analyzer
npm run analyze
```

**Performance Targets:**
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

---

## 📊 Assumptions & Limitations

### File Upload Constraints
| Constraint | Value | Configurable |
|------------|-------|--------------|
| Max file size | 10 MB | ✅ Yes (`app/actions/upload.ts`) |
| Allowed types | PDF only | ✅ Yes (can add DOCX, TXT) |
| Concurrent uploads | 1 per user | ⚠️ Frontend limit |
| Storage quota | Supabase plan limit | ❌ No (upgrade plan) |

### Rate Limiting
| Endpoint | Limit | Window | Configurable |
|----------|-------|--------|--------------|
| Server Actions | 60 req/min | 60s | ✅ Yes (`lib/redis.ts`) |
| File uploads | 10/min | 60s | ✅ Yes |
| API routes | 100/min | 60s | ✅ Yes |

### Database Limits
| Resource | Limit | Notes |
|----------|-------|-------|
| Vault name | 255 chars | VARCHAR(255) |
| Source title | 500 chars | VARCHAR(500) |
| Annotation note | Unlimited | TEXT field |
| Signed URL TTL | 1 hour | Configurable in storage policies |

### Known Limitations

#### Search Functionality
- ❌ **No Elasticsearch**: Search is PostgreSQL `ILIKE` or full-text search
- ❌ **No fuzzy matching**: Exact or prefix matches only
- ✅ **Workaround**: Use `to_tsvector` for better full-text search

#### Notifications
- ❌ **No Pusher/Twilio integration**: Only in-app toast notifications
- ❌ **No email digests**: Email sending not configured
- ✅ **Workaround**: Can add Supabase Edge Functions for webhooks

#### Advanced Features
- ❌ **No tags/topics**: Sources don't have many-to-many tags
- ❌ **No author management**: Author is just a string field
- ❌ **No citation export**: No BibTeX/RIS/EndNote export
- ✅ **Future enhancement**: See [Future Enhancements](#-future-enhancements)

### Browser Compatibility
| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Mobile Safari | iOS 14+ | ✅ Full |
| Mobile Chrome | Android 8+ | ✅ Full |

### Deployment Assumptions
- Running on Vercel (or similar serverless platform)
- Supabase cloud (not self-hosted)
- Environment variables properly configured
- HTTPS enabled (required for secure cookies)
- Custom domain configured (for production)

---

## 🚢 Deployment

### Vercel Deployment (Recommended)

#### Prerequisites
- Vercel account ([sign up](https://vercel.com/signup))
- Supabase project configured
- Upstash Redis configured (optional)
- GitHub repository

#### Deploy to Vercel

**Option 1: One-Click Deploy**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/syncscript)

**Option 2: Manual Deploy**

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

Follow the prompts to configure your project.

4. **Set Environment Variables**

Go to Vercel Dashboard → Project → Settings → Environment Variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# Upstash Redis (optional)
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxx

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

5. **Deploy to Production**
```bash
vercel --prod
```

#### Automatic Deployments

Connect your GitHub repository to Vercel for automatic deployments:

1. Go to Vercel Dashboard → Import Project
2. Select your GitHub repository
3. Configure build settings (auto-detected for Next.js)
4. Add environment variables
5. Deploy

**Branch Deployments:**
- `main` branch → Production
- Other branches → Preview deployments
- Pull requests → Automatic preview URLs

---

### Custom Domain Setup

1. **Add Domain in Vercel**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Environment Variables**
```env
NEXT_PUBLIC_APP_URL=https://syncscript.com
```

3. **Configure Supabase Redirect URLs**
   - Go to Supabase → Authentication → URL Configuration
   - Add production URL to allowed redirects
   - Update OAuth callback URLs

---

### Database Migrations

Run migrations on production database:

```bash
# Using Supabase CLI
npx supabase db push

# Or manually via Supabase Dashboard
# Copy SQL from lib/db/migrations/*.sql
# Execute in SQL Editor
```

---

### Health Checks

Vercel automatically monitors:
- Function response times
- Error rates
- Build success/failures

Custom health check endpoint:
```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: 'connected',
    redis: 'connected',
  });
}
```

Monitor at: `https://your-domain.vercel.app/api/health`

---

### Performance Monitoring

#### Vercel Analytics

Enable Vercel Analytics:
```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

#### Vercel Speed Insights

```bash
npm install @vercel/speed-insights
```

```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

### CI/CD Pipeline (GitHub Actions)

**Optional**: Add custom checks before Vercel deployment

```yaml
# .github/workflows/ci.yml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint

  type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run test
```

---

### Production Checklist

Before deploying to production:

**Environment Configuration**
- [ ] All environment variables set in Vercel
- [ ] `NEXT_PUBLIC_APP_URL` points to production domain
- [ ] Supabase redirect URLs include production domain
- [ ] OAuth providers configured with production callbacks

**Database**
- [ ] Production database created in Supabase
- [ ] All migrations run successfully
- [ ] RLS policies enabled on all tables
- [ ] Storage bucket created with correct policies
- [ ] Realtime enabled on required tables

**Security**
- [ ] HTTPS enforced (automatic with Vercel)
- [ ] Service role key never exposed to client
- [ ] Rate limiting enabled (Upstash configured)
- [ ] CORS configured correctly
- [ ] Security headers set (via next.config.js)

**Performance**
- [ ] Images optimized
- [ ] Bundle size checked (`npm run analyze`)
- [ ] Lighthouse score > 90
- [ ] Database indexes created

**Monitoring**
- [ ] Health check endpoint working
- [ ] Error tracking configured (Sentry optional)
- [ ] Vercel Analytics enabled
- [ ] Logs monitoring configured

**DNS & Domain**
- [ ] Custom domain connected
- [ ] SSL certificate active
- [ ] WWW redirect configured (optional)
- [ ] DNS propagated globally

---

### Scaling Considerations

#### Vercel Limits (Pro Plan)
- **Serverless Functions**: 10s execution time
- **Edge Functions**: 30s execution time
- **Bandwidth**: 1TB/month
- **Build time**: 45 minutes
- **Concurrent builds**: 12

#### Supabase Limits (Pro Plan)
- **Database size**: 8GB
- **File storage**: 100GB
- **Bandwidth**: 250GB/month
- **Realtime connections**: 500 concurrent

#### Upgrade Path
1. **Increase limits**: Upgrade Vercel/Supabase plans
2. **Optimize queries**: Add indexes, use caching
3. **CDN acceleration**: Vercel Edge Network included
4. **Database read replicas**: Supabase enterprise feature
5. **Horizontal scaling**: Serverless scales automatically

---

### Rollback Strategy

Vercel provides instant rollbacks:

1. **Via Dashboard**
   - Go to Deployments
   - Find stable deployment
   - Click "Promote to Production"

2. **Via CLI**
```bash
vercel rollback
```

Database rollbacks require manual migration reversal:
```sql
-- Revert migration if needed
-- Run previous schema version
```

---

### Monitoring & Debugging

#### View Logs
```bash
# Real-time logs
vercel logs --follow

# Filter by function
vercel logs --function=app/api/vaults/route

# Last 100 lines
vercel logs --limit=100
```

#### View Build Logs
- Vercel Dashboard → Deployments → Select deployment → View logs

#### Debug Production Issues
```typescript
// Add console.log in Server Actions
export async function createVault(name: string) {
  console.log('Creating vault:', { name, userId: user?.id });
  // Logs appear in Vercel Functions logs
}
```

---

## 🎨 Design Decisions

### 1. Next.js 14 (App Router) over Traditional SPA
**Decision**: Use Next.js 14 with App Router instead of Create React App or Vite SPA

**Rationale**:
- **Server Components**: Reduce client bundle size, fetch data closer to the database
- **Built-in API Routes**: Server Actions eliminate need for separate Express backend
- **SEO-Friendly**: SSR/SSG for better discoverability
- **Performance**: Automatic code splitting, image optimization, font optimization
- **Developer Experience**: File-system routing, TypeScript integration, fast refresh
- **Deployment**: Seamless Vercel integration with edge functions

### 2. PostgreSQL (Supabase) over MongoDB
**Decision**: Relational database with Supabase instead of NoSQL

**Rationale**:
- **Complex Relationships**: Many-to-many between vaults ↔ members ↔ sources ↔ annotations
- **Data Integrity**: ACID compliance, foreign keys, cascading deletes
- **Strong Consistency**: Critical for collaborative editing
- **Mature Ecosystem**: Well-established query patterns, migrations, indexing
- **Row Level Security (RLS)**: Database-level access control, no middleware needed
- **Real-time Built-in**: Supabase Realtime provides WebSocket subscriptions without additional setup
- **Full SQL Power**: Complex joins, aggregations, and full-text search

**Why Not MongoDB?**
- Embedding causes data duplication across vaults
- No native ACID transactions across documents
- Complex queries require aggregation pipelines
- Harder to enforce referential integrity

### 3. Supabase over Custom Backend
**Decision**: All-in-one Supabase platform instead of building separate services

**Rationale**:
- **Unified Platform**: Database, Auth, Storage, Realtime in one service
- **Row Level Security**: Granular permissions at database level
- **Managed Infrastructure**: No DevOps overhead, automatic backups, scaling
- **Built-in Auth**: JWT session management, OAuth providers, email verification
- **Storage with CDN**: Signed URLs, multipart uploads, automatic optimization
- **Real-time Subscriptions**: Native WebSocket support without Socket.io setup
- **Cost-Effective**: Generous free tier, pay-as-you-grow pricing
- **TypeScript SDK**: Full type safety with auto-generated types

### 4. JWT (Supabase Session) over Server Sessions
**Decision**: Stateless JWT authentication via Supabase Auth

**Rationale**:
- **Stateless**: No session storage needed, perfect for serverless/edge
- **Scalability**: Horizontal scaling without sticky sessions
- **Cross-Domain**: Easy API authentication for future mobile apps
- **Supabase Managed**: Automatic token refresh, secure cookie handling via `@supabase/ssr`
- **Industry Standard**: Well-tested, widely adopted pattern
- **Edge Compatible**: Works on Vercel Edge Runtime

### 5. Server Actions over REST API
**Decision**: Next.js Server Actions for mutations instead of Express REST endpoints

**Rationale**:
- **Type Safety**: End-to-end TypeScript without manual API typing
- **Less Boilerplate**: No route handlers, controllers, or validation middleware
- **Automatic Serialization**: Direct function calls instead of fetch/axios
- **Progressive Enhancement**: Works without JavaScript (form submissions)
- **Reduced Bundle Size**: No client-side API client libraries needed
- **Better DX**: Co-locate actions with components, easier refactoring

### 6. Upstash Redis over Self-Hosted Redis
**Decision**: Serverless Redis for rate limiting and caching

**Rationale**:
- **Serverless-Native**: No connection pooling issues with serverless functions
- **Pay-Per-Request**: More cost-effective than always-on instances
- **Global Replication**: Low latency worldwide via edge caching
- **No Connection Limits**: REST API instead of TCP connections
- **Zero Maintenance**: Fully managed, automatic updates
- **Vercel Integration**: Seamless integration with Vercel deployments

### 7. shadcn/ui over Material-UI or Ant Design
**Decision**: Headless component library built on Radix UI

**Rationale**:
- **Full Customization**: Copy components to your project, modify freely
- **Accessibility**: Built on Radix primitives (ARIA compliant)
- **Tailwind-First**: Natural integration with Tailwind CSS
- **Small Bundle**: Only include components you use
- **Type Safety**: Full TypeScript support
- **Modern Design**: Clean, minimal aesthetic that's easy to brand

### 8. Supabase Storage over AWS S3 Direct
**Decision**: Use Supabase Storage instead of direct S3 integration

**Rationale**:
- **Unified Platform**: Same authentication, policies, and SDK
- **RLS for Files**: Storage policies leverage same user context
- **Signed URLs**: Built-in, no AWS SDK needed
- **CDN Included**: Global edge caching out of the box
- **Simpler Setup**: No separate AWS account or IAM policies
- **Consistent DX**: Same patterns as database queries

### 9. Row Level Security (RLS) over Middleware Auth
**Decision**: Database-level security policies instead of application middleware

**Rationale**:
- **Defense in Depth**: Security enforced at data layer, not just app layer
- **No Bypass Risk**: Direct database queries automatically respect RLS
- **Performance**: Database evaluates policies efficiently with indexes
- **Declarative**: Policies are self-documenting, easier to audit
- **Less Code**: No need to repeat permission checks in every query
- **Multi-Tenant Safe**: User context automatically scoped to policies

### 10. Vercel over AWS/GCP/Azure
**Decision**: Deploy on Vercel instead of traditional cloud providers

**Rationale**:
- **Next.js Native**: Built by the Next.js team, optimal performance
- **Zero Config**: Git push to deploy, no YAML configs
- **Edge Network**: Automatic global CDN distribution
- **Serverless Functions**: Automatic scaling, no infrastructure management
- **Preview Deployments**: Every PR gets a unique URL
- **DX Optimized**: Fast build times, instant rollbacks, great dashboard

---

## 💡 Trade-offs & Considerations

### What We Gained
✅ **Faster Development**: Supabase + Next.js = minimal backend code  
✅ **Better DX**: Type safety, hot reload, automatic API generation  
✅ **Lower Costs**: Generous free tiers, serverless pricing  
✅ **Built-in Features**: Auth, storage, realtime without custom code  
✅ **Scalability**: Serverless scales automatically with traffic  

### What We Trade
⚠️ **Vendor Lock-in**: Heavily dependent on Supabase and Vercel  
⚠️ **Advanced Caching**: Limited to Next.js/Redis patterns (no Elasticsearch)  
⚠️ **Custom Auth**: Harder to implement custom auth flows  
⚠️ **Database Flexibility**: Committed to PostgreSQL schema  
⚠️ **Cold Starts**: Serverless functions can have 100-500ms cold starts  

### Future-Proofing
- **Migration Path**: Supabase is open source (can self-host if needed)
- **Standard Tech**: PostgreSQL, REST, WebSocket protocols are portable
- **Abstraction Layers**: Database queries wrapped in service functions
- **Feature Flags**: Gradual rollout of new patterns without breaking changes

---

## 🔮 Future Enhancements

### Phase 1 (Q2 2024)
- [ ] **AI-Powered Features**
  - Auto-citation generation from URLs
  - Smart metadata extraction from PDFs
  - AI-assisted summarization
  - Duplicate detection

- [ ] **Enhanced Collaboration**
  - Video/voice chat integration
  - Real-time cursor tracking
  - Collaborative annotations
  - Version history with diff view

- [ ] **Mobile Applications**
  - iOS app (React Native)
  - Android app (React Native)
  - Offline mode with sync

### Phase 2 (Q3 2024)
- [ ] **Advanced Search**
  - Semantic search using embeddings
  - Cross-vault search
  - Advanced filtering and faceting
  - Search history and saved searches

- [ ] **Integration Ecosystem**
  - Mendeley/Zotero import
  - Google Scholar integration
  - ORCID authentication
  - LaTeX export
  - Notion/Obsidian sync

- [ ] **Analytics & Insights**
  - Research trends analysis
  - Citation network visualization
  - Reading time tracking
  - Collaboration metrics

### Phase 3 (Q4 2024)
- [ ] **Enterprise Features**
  - SSO integration (SAML, LDAP)
  - Advanced admin controls
  - Custom branding
  - Compliance certifications (SOC 2, GDPR)
  - Dedicated infrastructure options

- [ ] **API & Extensibility**
  - Public REST API
  - GraphQL endpoint
  - Webhook system
  - Plugin architecture
  - Custom themes

---

## 🤝 Contributing

We welcome contributions from the community! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

#### Code Style
- Follow the existing code style
- Use ESLint and Prettier configurations
- Write meaningful commit messages
- Add comments for complex logic

#### Testing
- Write unit tests for new features
- Ensure all tests pass before submitting
- Maintain code coverage above 80%

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

#### Pull Request Process
1. Update README.md with details of changes if needed
2. Update API documentation if endpoints change
3. Increase version numbers following [SemVer](https://semver.org/)
4. Get at least one code review approval
5. Ensure CI/CD pipeline passes

### Reporting Bugs

Use GitHub Issues to report bugs. Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, browser, Node version)

### Feature Requests

We love feature ideas! Submit them via GitHub Issues with:
- Clear use case description
- Proposed solution
- Alternative solutions considered
- Additional context

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 SyncScript Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👥 Team

### Core Contributors

- **[Your Name]** - *Lead Developer* - [@yourusername](https://github.com/yourusername)
- **[Team Member 2]** - *Frontend Developer* - [@username2](https://github.com/username2)
- **[Team Member 3]** - *Backend Developer* - [@username3](https://github.com/username3)

### Acknowledgments

- Thanks to all contributors who have helped shape SyncScript
- Inspired by research collaboration challenges in academia
- Built for Hackfest x Datathon 2024

---

## 📞 Contact & Support

### Get Help

- 📧 Email: support@syncscript.com
- 💬 Discord: [Join our community](https://discord.gg/syncscript)
- 🐦 Twitter: [@syncscript](https://twitter.com/syncscript)
- 📖 Documentation: [docs.syncscript.com](https://docs.syncscript.com)

### Report Security Vulnerabilities

Please report security vulnerabilities to security@syncscript.com. Do not create public GitHub issues for security concerns.

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/syncscript&type=Date)](https://star-history.com/#yourusername/syncscript&Date)

---

<div align="center">

**Built with ❤️ for researchers, by researchers**

[⬆ Back to Top](#-syncscript---collaborative-research--citation-engine)

</div>
