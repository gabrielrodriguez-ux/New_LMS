# 🚀 ThePower LMS - Demo Guide

This demo showcases the **Student Experience (LMS/LPX)** surface of the platform.

## Prerequisites
- Node.js (v18+)
- npm

## Quick Start (Frontend Demo)

1. Navigate to the frontend directory:
   ```bash
   cd frontend/lms-app
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to: **[http://localhost:3000](http://localhost:3000)**

## Demo Scenarios to Try

### 1. Navigation & Profile
- **Global Navbar**: Persistent navigation across all pages.
- **Profile Page** (`/profile`):
  - Click your avatar in the top right.
  - View gamification stats (XP, Level, Badges).
  - **Edit Mode**: Click "Edit Profile" to update your bio or location (interactive mock).

### 2. Dashboard (`/dashboard`)
- **Gamification Widget**: Real-time view of your weekly ranking.
- **Daily Challenge**: Challenge interactions.
- **Active Course**: Resume your main course.

### 3. My Courses (`/my-courses`)
- **Filters**: Toggle between "All", "In Progress", and "Completed".
- **Progress Trackers**: Visual progress bars for each enrollment.
- **Status Badges**: Clear indication of course states.

### 4. Leaderboard (`/leaderboard`)
- **Global Ranking**: Full list of top students.
- **Badge Showcase**: Visual grid of earned achievements.
- **My Stats**: Highlighted personal performance card.

### 5. Community (`/community`)
- **Social Feed**: Posts from other students and instructors.
- **Interactions**: Like, Comment, and Share buttons.
- **Create Post**: Interactive text area to share thoughts.

### 6. Course Player (`/dashboard/courses/123`)
- **Immersive Mode**: Distraction-free video learning.
- **Syllabus**: Sidebar navigation of modules.
- **Resources**: Downloadable content area.

### 7. **[NEW]** Admin Backoffice (L&D View)
- **Login**: [`/admin/login`](http://localhost:3000/admin/login) (Mock SSO).
- **Dashboard**: [`/admin`](http://localhost:3000/admin) (after login).
- **Clients & Subs**: Manage B2B contracts and seats (`/admin/clients`).
- **FUNDAE Monitor**: Dedicated compliance tracking (`/admin/fundae`).

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (ThePower Branding)
- **Icons**: Lucide React
- **Type Safety**: TypeScript
