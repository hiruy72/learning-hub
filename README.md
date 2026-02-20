# LETS_LERN | MENTORSHIP PLATFORM

A premium, minimalist full-stack mentorship platform designed for university freshers. Built with a focus on high-performance academic collaboration and a sophisticated "Journal" aesthetic.

---

## 01. TECH STACK

- **Framework**: Next.js 16 (App Router + Turbopack)
- **Language**: TypeScript
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: Custom JWT-based Authentication
- **Styling**: Tailwind CSS (Strictly Minimalist)
- **Animations**: Framer Motion
- **Icons**: Lucide React

---

## 02. DESIGN PHILOSOPHY

The platform follows a "Brutalist Minimalist" aesthetic:
- **Pure Black Background**: `#000000` base for maximum contrast.
- **Zero Border Radius**: Sharp edges on all inputs, buttons, and cards.
- **High Contrast**: White accents and borders (`border-white/10`).
- **Grayscale Aesthetic**: All images are grayscale by default, transitioning to color on interaction.
- **Premium Typography**: Heavy uppercase headers and generous letter spacing.

---

## 03. CORE FEATURES

### A. Mentor Application System
Standard users can apply to become mentors. The process requires identity and academic verification via direct Google Drive links for Grade Reports and National IDs, which are then reviewed by admins.

### B. The Journal (Blog System)
A sophisticated content platform where mentors and admins share insights.
- **Interactive Likes**: Optimistic UI updates with real-time feedback.
- **Discussion Threads**: Threaded comments for academic debate.
- **Tagged Navigation**: Categorized content discovery.

### C. Community Hubs
Department-specific groups where mentees can access:
- **Live Classroom Links**: Integration with Google Meet/Zoom.
- **Shared Resources**: PDFs, notes, and external links.
- **Practice Exams**: Interactive test simulations.

### D. Real-Time Chat
Direct messaging system for real-time collaboration between mentors and mentees.

---

## 04. GETTING STARTED

### Prerequisites
- Node.js 20.x or higher
- PostgreSQL Database

### Installation
```bash
# Clone the repository
git clone https://github.com/hiruy72/Next-JS_backend.git

# Install dependencies
npm install
```

### Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed dummy data (Blogs, Communities, Mentors)
npx prisma db seed
```

### Environment Variables
Create a `.env` file in the root:
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your_secret_key"
ADMIN_EMAIL="admin@mentorship.com"
```

### Development
```bash
npm run dev
```

---

## 05. PROJECT STRUCTURE

```text
src/
├── actions/      # Secure Server Actions (Auth, Blogs, Mentor)
├── app/          # App Router (Dashboard & Public Pages)
├── components/   # UI Components (Atomic Design)
├── lib/          # Utilities, DB Client, Auth Logic
└── prisma/       # Database Schema & Seed Scripts
```

---

## 06. KEY IMPLEMENTATIONS

1. **Custom Auth**: Security-first JWT implementation replacing third-party dependencies.
2. **Optimistic Updates**: Using `useTransition` for instant UI feedback on social interactions.
3. **Responsive Grids**: Tailored layouts for seamless desktop and mobile experiences.

---

## 07. ROADMAP

- [ ] Video call integration directly in-platform.
- [ ] AI-powered resource summarization.
- [ ] Global search across blogs, users, and communities.
- [ ] Real-time notifications via WebSocket.

---

## 08. LICENSE

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with passion for the next generation of engineers.*
