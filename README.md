# LETS_LERN | PREMIUM UNIVERSITY MENTORSHIP PLATFORM

A sophisticated, minimalist full-stack mentorship platform designed specifically for university freshstudents. Built with a focus on high-performance academic collaboration and a premium "Journal" aesthetic.

---

## 01. TECH STACK & ARCHITECTURE

The platform is built using a modern, scalable stack to ensure performance and developer efficiency.

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router + Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) via [Prisma ORM](https://www.prisma.io/)
- **Authentication**: Custom JWT-based Authentication with Secure Cookies
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Strictly Minimalist "Brutalist" design)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: React Context & Hooks
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 02. DESIGN PHILOSOPHY: "THE JOURNAL"

LETS_LERN follows a "Brutalist Minimalist" aesthetic, inspired by high-end design journals and academic publications:

1. **Pure Black Background**: Uses `#000000` as the primary base to provide maximum contrast.
2. **Zero Border Radius**: All buttons, inputs, cards, and avatars feature sharp `0px` corners.
3. **High Contrast Borders**: Components are defined by thin `border-white/10` lines rather than shadows.
4. **Grayscale-to-Color**: All user-uploaded images (avatars, blog covers) are rendered in grayscale by default, transitioning to full color only upon user interaction.
5. **Premium Typography**: Utilizes heavy uppercase headers with generous letter spacing (`tracking-tighter`) to evoke a sense of authority.

---

## 03. CORE MODULES & FEATURES

### A. Mentor Application & Verification
The platform allows standard users to apply for mentorship roles through a rigorous verification process:
- **Academic Proof**: Direct Google Drive integration for Grade Reports and National ID uploads.
- **Admin Review**: A dedicated admin panel for approving or rejecting applications.
- **Role Transformation**: Once approved, the user's role is automatically updated from `USER` to `MENTOR`.

### B. The Journal (Integrated Blog System)
A sophisticated storytelling platform where mentors and admins share insights and academic guidance:
- **Optimistic UI**: Likes and comments update instantly using React state before the server responds.
- **Threaded Discussions**: Nested comments allow for deep academic discourse.
- **Grayscale Filters**: Blog thumbnails remain grayscale until hovered.

### C. Community Hubs (Group Collaboration)
Department-specific digital classrooms categorized by engineering fields:
- **Live Classrooms**: Native support for Google Meet and Zoom integration.
- **Resource Repository**: Direct access to PDF notes, past papers, and recorded lectures.
- **Practice Exams**: Timed interactive test simulations with instant scoring.

### D. Real-Time Chat System
Secure direct messaging between mentors and students:
- **Real-time Updates**: Instant message delivery using Next.js Server Actions.
- **Conversation State**: Tracks unread messages and last-read timestamps.

---

## 04. GETTING STARTED

### Prerequisites
Ensure you have the following installed on your machine:
- **Node.js**: version 20.x or higher
- **npm**: version 10.x or higher
- **PostgreSQL**: Local or a cloud instance (e.g., Neon.tech)

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/hiruy72/learning-hub.git
   cd learning-hub
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and populate it with the following:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/lets_learn"
   JWT_SECRET="generate-a-long-random-string-here"
   ADMIN_EMAIL="admin@mentorship.com"
   ```

4. **Database Initialization**
   ```bash
   # Sync schema with database
   npx prisma db push

   # Generate Prisma client
   npx prisma generate

   # Seed the database with initial mentors, communities, and blogs
   npx prisma db seed
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 05. PROJECT STRUCTURE

```text
src/
 actions/             # Secure Server Actions (Data mutation)
    auth.ts          # Login/Signup logic
    blog.ts          # Post creation and interaction
    mentor.ts        # Application processing
 app/                 # Next.js App Router (Pages & API)
    (auth)/          # Authentication flow pages
    (dashboard)/     # Protected user area
    (public)/        # Public blogs and landing pages
    api/             # RESTful API endpoints
 components/          # Sharable React components
    blog/            # Blog-specific UI
    dashboard/       # Dashboard widgets
    shared/          # Navbar, Footer, etc.
    ui/              # Atomic shadcn/ui components
 lib/                 # Utility functions and configurations
    auth.ts          # JWT helper functions
    db.ts            # Prisma Client singleton
    utils.ts         # Generic helpers
 middleware.ts        # Edge route protection
```

---

## 06. DATABASE SCHEMA OVERVIEW

The database architecture is designed for high relational integrity:

- **User**: Stores profile data, roles (`USER`, `MENTOR`, `ADMIN`), and authentication details.
- **Application**: Tracks mentor applications and their verification status.
- **Community**: Departmental groups managed by mentors.
- **Blog**: Content entries authored by mentors or admins.
- **Message**: Real-time entries for community and direct chats.
- **Exam**: Academic test simulations associated with communities.

---

## 07. CONTRIBUTING

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 08. LICENSE

Distributed under the MIT License. See `LICENSE` for more information.

---

## 09. CONTACT

**Project Link**: [https://github.com/hiruy72/learning-hub](https://github.com/hiruy72/learning-hub)

Designed with  for the next generation of engineers.
