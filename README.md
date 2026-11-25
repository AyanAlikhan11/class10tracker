# BoardPrep - Student-First Class 10 Board Exam Preparation Platform

> **Product Promise:** *One day at a time. One chapter at a time. Your boards. Your pace. Your progress.*

A clean, modern, student-first academic companion for CBSE Class 10 students that answers three fundamental questions within 5 seconds of opening:
1. **How is my preparation going?**
2. **What should I study today?**
3. **What should I do next?**

---

## 🛠️ Technology Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript with strict type checking
- **Styling:** Tailwind CSS with custom academic design tokens
- **Icons:** Lucide React
- **Backend & Auth:** Firebase Authentication, Cloud Firestore, Firebase Storage
- **Validation:** Zod & React Hook Form
- **Charts:** Recharts
- **Animations:** Framer Motion

---

## 🎨 Design Tokens

- **Primary Blue:** `#3978E8`
- **Secondary Teal:** `#42B9A5`
- **Background:** `#F7F9FC`
- **Surface:** `#FFFFFF`
- **Main Text:** `#243247`
- **Muted Text:** `#718096`
- **Success:** `#37A779`
- **Warning:** `#F2B84B`
- **Radius:** 16px (cards), 12px (controls)

---

## 📁 Project Architecture

```text
src/
  app/                     # Next.js App Router pages and layouts
    globals.css            # Base styles and tokens
    layout.tsx             # Root layout
    page.tsx               # Public landing page (Phase 1)
  components/              # Reusable UI components
    ui/                    # Button, Card, Badge, Input primitives
    layout/                # Navbar, Footer
    dashboard/             # Student dashboard components
    syllabus/              # Syllabus tracker components
    planner/               # Daily planner and Rescue Mode
    exams/                 # Marks tracker components
    mistakes/              # Mistake notebook components
  constants/               # Curriculum & Design constants
  lib/
    firebase/              # Firebase client, auth, and firestore helpers
    utils/                 # Utility functions (cn, dates, formatting)
    validations/           # Zod validation schemas
  services/                # Business logic and database access layers
  types/                   # TypeScript domain models
firestore.rules            # Firestore security rules
storage.rules              # Firebase Storage security rules
.env.example               # Example environment configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested with Node v24)
- npm or pnpm

### 2. Installation
```bash
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env.local` and configure your Firebase credentials:
```bash
cp .env.example .env.local
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 5. Typecheck & Build
```bash
npm run typecheck
npm run build
```
