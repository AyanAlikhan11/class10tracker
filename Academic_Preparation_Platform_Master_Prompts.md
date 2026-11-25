# Complete Phase-Wise Development Master Prompt

## Student-First Class 10 Board Exam Preparation Platform

**Purpose:** This is the single master prompt document for building the
complete academic preparation platform phase by phase using Antigravity,
Cursor, Claude Code, or another AI coding assistant.

**Product promise:** *One day at a time. One chapter at a time. Your
boards. Your pace. Your progress.*

The platform is an easy-to-use academic companion that helps students
understand what to study next, track syllabus completion, record marks,
identify mistakes, and prepare confidently for board examinations. It is
not intended to become another video-library or complicated
school-management application.

------------------------------------------------------------------------

# 1. Product vision and non-negotiable principles

Build a student-first, mobile-first academic preparation platform. A
student should be able to open the app and understand within five
seconds:

1.  How is my preparation going?
2.  What should I study today?
3.  What should I do next?

### Target and initial scope

-   Initial launch: CBSE Class 10.
-   Initial subjects: Mathematics Standard or Basic, Science, Social
    Science, English, and configurable language/optional subjects.
-   Future expansion: ICSE and State Boards through configurable
    syllabus data, not a complete redesign.
-   Primary users: students.
-   Later user experiences: parents and platform administrators.

### Student-friendly UX rules

-   Use plain, familiar language. Avoid technical terms wherever
    possible.
-   Keep the number of choices small and make the next action obvious.
-   Use short descriptions and clear headings.
-   Prefer one or two taps for common actions.
-   Make touch targets large enough for phones.
-   Provide helpful empty, loading, success, and error states.
-   Use a skippable first-time guided tour.
-   Never shame students for missed days or unfinished tasks.
-   Do not overwhelm the dashboard with charts, cards, notifications, or
    features.
-   Make the experience usable on budget Android phones and slower
    connections.
-   Preserve progress across sessions and devices.
-   Keep student records private by default.

### Visual direction

Create a friendly, modern, calm, premium education product---not a
corporate analytics dashboard.

Suggested design tokens: - Primary blue: `#3978E8` - Secondary teal:
`#42B9A5` - Background: `#F7F9FC` - Surface: `#FFFFFF` - Main text:
`#243247` - Muted text: `#718096` - Success: `#37A779` - Warning:
`#F2B84B`

Use Inter or Nunito Sans, consistent spacing, rounded cards
(approximately 12--18px), subtle shadows, clear contrast, restrained
animation, and familiar Lucide icons. Treat these as starting tokens and
maintain consistency. Avoid excessive gradients, glassmorphism, visual
clutter, tiny text, and decorative interactions.

------------------------------------------------------------------------

# 2. Technology stack and architecture

Use: - Next.js with App Router - TypeScript with strict checking -
Tailwind CSS - shadcn/ui and reusable custom components - Lucide React
icons - Firebase Authentication - Cloud Firestore - Firebase Storage -
Recharts for simple analytics - Framer Motion for restrained, purposeful
animation - React Hook Form and Zod for forms and validation - Vercel
for deployment - PWA support in the production phase

### Suggested structure

``` text
src/
  app/
  components/
    ui/
    layout/
    landing/
    dashboard/
    syllabus/
    planner/
    exams/
    mistakes/
    revision/
    parent/
    admin/
  config/
  constants/
  hooks/
  lib/
    firebase/
    utils/
    validations/
  services/
  types/
```

### Architecture requirements

-   Separate UI, business logic, data access, validation, types, and
    configuration.
-   Use reusable components and consistent design tokens.
-   Keep Firestore access in service/repository modules rather than
    scattering database calls throughout UI components.
-   Use strict TypeScript and validate inputs with Zod.
-   Protect private routes and authorize every sensitive operation.
-   Never trust a client-provided role or student ID for access
    decisions.
-   Never expose Firebase Admin credentials or secrets in client code.
-   Use environment variables and document required configuration.
-   Create and test Firestore and Storage security rules.
-   Use pagination and sensible query patterns.
-   Avoid fake functionality, hardcoded student records, fake progress,
    and placeholder buttons.
-   Keep the data model configurable for multiple boards, sessions,
    classes, subjects, chapters, and topics.
-   Do not build every feature in the first phase.

### Suggested data domains

Design the data model for: - Users and student profiles - Parent-student
relationships - Roles and permissions - Boards and academic sessions -
Classes and subjects - Units, chapters, and topics - Learning
resources - Student chapter progress - Daily study tasks - Study
sessions and focus sessions - Exams and marks - Mistakes and mistake
attachments - Revision schedules and revision records - PYQ questions
and sample papers - Announcements - Administrative audit logs

Keep centrally managed syllabus/content separate from each student's
personal progress.

------------------------------------------------------------------------

# 3. How to execute this master plan

**Do not ask the coding agent to build all phases in one uncontrolled
operation.**

For each phase: 1. Inspect the existing project and understand its
current structure. 2. Identify what already works and reuse it. 3.
Implement only the requested phase. 4. Connect the feature to real
Firebase data where required. 5. Test the complete user flow. 6. Run
lint, type-check, and build commands. 7. Fix errors before moving
forward. 8. Summarize changed files, configuration, tests, and anything
still requiring manual setup.

Never delete or rewrite working features just to make implementation
easier. Do not claim a test passed unless it was actually run. If a
required Firebase credential or external integration is unavailable,
clearly identify the missing setup rather than simulating success.

------------------------------------------------------------------------

# PHASE 0 --- Project foundation and architecture

**Goal:** Establish a clean, scalable, working foundation.

### Prompt

You are a senior full-stack software architect and product engineer. Set
up the foundation for the student-first academic preparation platform
described in this document.

1.  Inspect the current repository before changing anything.
2.  Confirm the framework, package manager, scripts, dependencies, and
    existing implementation.
3.  Create or refine the modular folder structure.
4.  Configure strict TypeScript, Tailwind CSS, shadcn/ui, and Lucide
    icons.
5.  Configure Firebase client initialization safely using environment
    variables.
6.  Prepare Firebase Authentication, Firestore, and Storage service
    modules.
7.  Define typed models and validation schemas for the core data
    domains.
8.  Establish route protection and an authorization strategy.
9.  Prepare Firestore and Storage security rules with least-privilege
    access.
10. Add a clear `.env.example` without real secrets.
11. Add useful error handling, logging boundaries, and shared utilities.
12. Document local setup, Firebase setup, and deployment prerequisites.

Do not build the complete product yet. Do not insert fake users or fake
academic records. Keep the foundation ready for the next phases.

### Acceptance checks

-   The app starts.
-   TypeScript passes.
-   Lint passes where configured.
-   Firebase configuration fails gracefully when environment variables
    are missing.
-   No secret is exposed to the browser.
-   The architecture is documented and understandable.

------------------------------------------------------------------------

# PHASE 1 --- Design system and public landing page

**Goal:** Establish the product identity and a welcoming first
impression.

### Prompt

Act as an award-winning UI/UX designer and senior frontend developer
specializing in education products. Create a cohesive design system and
responsive public landing page.

### Landing page

1.  Navigation: logo, Home, How It Works, Features, About, Login, and
    Get Started.
2.  Hero:
    -   Heading: "Your board exam preparation, made simpler."
    -   Supporting text: "Know what to study, track your progress, and
        prepare for your boards one small step at a time."
    -   Primary CTA: "Start Preparing"
    -   Secondary CTA: "Explore Features"
    -   Use a relevant, warm student-focused illustration.
3.  How it works:
    -   Choose your subjects.
    -   Follow your daily study plan.
    -   Track your progress.
    -   Get ready for boards.
4.  Feature section: Syllabus Tracker, Daily Study Planner, Marks
    Tracker, Mistake Notebook, Board Preparation, and Progress Insights.
5.  Product preview: show genuine UI previews, not fabricated product
    screenshots.
6.  Motivation section: consistency over last-minute studying.
7.  FAQ.
8.  Footer: About, Contact, Privacy, Terms, and Support.

### Design and UX

-   Apply the visual direction and tokens in Section 1.
-   Build reusable buttons, cards, form controls, navigation, badges,
    progress indicators, dialogs, and feedback components.
-   Use accessible contrast, visible focus states, semantic HTML, and
    responsive layouts.
-   Use restrained motion and optimize imagery.
-   Ensure every CTA navigates to a real destination or performs a real
    action.
-   Do not invent testimonials, customer counts, success rates, or
    unsupported academic claims.

### Acceptance checks

Test desktop, tablet, and mobile layouts. Check navigation, CTA
destinations, keyboard focus, contrast, and page performance.

------------------------------------------------------------------------

# PHASE 2 --- Authentication and student onboarding

**Goal:** Make account creation and setup simple enough for a student to
complete without help.

### Prompt

Build the complete authentication and onboarding experience using
Firebase Authentication and Firestore.

### Authentication

Implement: - Email and password registration - Email and password
login - Google sign-in - Forgot/reset password - Email verification
where appropriate - Logout - Protected routes - Useful authentication
errors and loading states

### Student onboarding wizard

Use a short, friendly, step-by-step flow.

**Step 1 --- Welcome** - Explain that setup is quick. - Show how many
steps remain.

**Step 2 --- Academic details** - Board - Academic session - Class -
Initially support CBSE Class 10

**Step 3 --- Subjects** - Mathematics Standard or Basic - Science -
Social Science - English - Configurable language and optional subjects -
Let students select the subjects they actually study.

**Step 4 --- Study goals** - Target percentage (optional) - Daily
available study time - Preferred study time - Board examination date, if
known

**Step 5 --- Completion** - Show a friendly welcome message. - Redirect
to the student dashboard.

### UX requirements

-   One main decision per screen.
-   Large selectable cards and readable labels.
-   Clear Back and Continue actions.
-   Visible progress indicator.
-   Save onboarding progress safely.
-   Allow profile details to be edited later.
-   Explain unfamiliar terms.
-   Do not silently select optional subjects.
-   Do not repeatedly show onboarding after completion.

### Backend and security

-   Link profile records to the authenticated Firebase UID.
-   Prevent duplicate profiles.
-   Enforce ownership and role permissions in security rules and trusted
    server-side operations.
-   Never allow the client to assign itself a privileged role.
-   Ensure one student cannot access another student's data.

### Acceptance checks

Test registration, login, Google sign-in when configured, password
reset, interrupted onboarding, resumed onboarding, completed onboarding,
logout, and route protection.

------------------------------------------------------------------------

# PHASE 3 --- Student dashboard

**Goal:** Make the dashboard the simplest and most useful screen in the
product.

### Prompt

Build the main Student Dashboard. It must answer three questions
immediately:

1.  How is my preparation going?
2.  What should I study today?
3.  What should I do next?

### Desktop navigation

-   Overview
-   My Syllabus
-   Today's Study Plan
-   My Tests & Marks
-   Mistake Notebook
-   Revision
-   My Progress
-   Settings

Place Help & Support, profile, and Logout in a predictable lower
section.

### Mobile navigation

Use a simple bottom navigation: - Home - Syllabus - Study Plan -
Progress - More

Keep common actions reachable with one or two taps.

### Dashboard sections

1.  **Welcome:** Use the authenticated student's first name and a
    time-appropriate greeting.
2.  **Preparation summary:** Overall syllabus progress, completed
    chapters, remaining chapters, and a clearly explained readiness
    indicator.
3.  **Today's tasks:** Show no more than three main tasks, each with
    subject, chapter, short description, estimated duration, completion
    control, and Start/Continue action.
4.  **Subject progress:** Simple progress bars for selected subjects.
5.  **Upcoming tests:** Relevant exam dates and deadlines.
6.  **Recent performance:** Latest test records and understandable
    trends.
7.  **Encouragement:** Positive, non-judgmental messages.
8.  **Quick actions:** Update syllabus, add marks, review mistakes, and
    start revision.

### UX requirements

-   Avoid information overload.
-   Make important numbers readable.
-   Avoid excessive graphs.
-   Provide helpful empty states for new students.
-   Add skeleton loading and useful error recovery.
-   Make the page responsive and accessible.

### Data requirements

-   All personal data must come from the authenticated student's
    records.
-   Calculate progress dynamically from saved chapter statuses.
-   Update the interface after successful actions.
-   Respect the selected academic session.
-   Never show fabricated numbers or static demo progress in production.

------------------------------------------------------------------------

# PHASE 4 --- Dynamic syllabus tracker

**Goal:** Break a large syllabus into small, understandable milestones.

### Prompt

Build a complete syllabus tracking system, initially for CBSE Class 10.

### Syllabus hierarchy

Board → Academic Session → Class → Subject → Unit → Chapter → Topic →
Learning Resources.

### Subject overview

For each subject display: - Subject name and icon - Total chapters -
Completed chapters - Remaining chapters - Overall progress

### Four chapter states

1.  Not Started
2.  NCERT Read
3.  PYQs Solved
4.  Mastered

Let students update a chapter's status easily. Make the current status
obvious and explain what each stage means.

### Chapter detail page

Show: - Chapter overview - Topic checklist - Chapter status - Official
board weightage, only if verified and available - Estimated study time,
if available - Personal notes - Related mistakes - Revision history -
Relevant PYQs, when available

### Filters and sorting

Filters: - All chapters - Not Started - In Progress - Completed

Sorting: - Syllabus order - Weakest chapters - High-priority chapters

### Data and content management

-   Store syllabus content centrally.
-   Store individual student progress separately.
-   Allow authorized administrators to update syllabus content without
    frontend code changes.
-   Use verified official CBSE syllabus and assessment documents for the
    selected academic session.
-   Never invent chapter-level marks or represent estimates as official
    weightage.
-   Clearly label unavailable or estimated information.
-   Do not hardcode chapter arrays inside UI components.

### Acceptance checks

Test progress updates, persistence after logout, filters, sorting,
chapter details, subject switching, and empty states.

------------------------------------------------------------------------

# PHASE 5 --- Daily study planner and 15-minute Rescue Mode

**Goal:** Help students know what to study without spending time
planning the plan.

### Prompt

Build the Daily Study Planner and a transparent task recommendation
engine.

### Daily plan

Create a page named "Today's Study Plan" showing: - Date and friendly
greeting - Daily study goal - Completed tasks - Remaining tasks -
Estimated total study time

Recommend a maximum of three primary tasks each day.

### Task recommendation inputs

Use: 1. Incomplete chapters 2. Chapter progress 3. Weak topics 4.
Upcoming school examinations 5. Previous test performance 6. Revision
due dates 7. Student's available study time

Prioritize upcoming exam topics, weak chapters, important unfinished
syllabus, and revision due. Explain why a task is recommended.

### Task structure

Each task should include: - Title - Subject - Chapter and topic - Short
description - Estimated duration - Priority - Completion status

Example: - Mathematics --- Quadratic Equations --- Solve five practice
questions --- 20 minutes. - Science --- Carbon and Its Compounds ---
Revise important reactions --- 15 minutes. - English --- First Flight
--- Read one chapter and revise vocabulary --- 15 minutes.

### Task actions

-   Start
-   Mark complete
-   Postpone
-   View chapter
-   Replace with another relevant task

Do not let replacement create unrelated tasks or duplicate work.

### Focus timer

Implement Start, Pause, Resume, and Finish. Save completed study
sessions. Handle refreshes and interrupted sessions sensibly.

### 15-minute Rescue Mode

Add a visible action: "Only have 15 minutes today?"

When selected: - Recommend one or two short tasks. - Prefer formula
review, flashcards, or weak-topic revision. - Reduce workload without
guilt. - Preserve the normal plan and record what was completed.

### Streaks and consistency

-   Track study consistency.
-   Allow two rest days per week.
-   Do not unfairly reset progress.
-   Encourage returning after missed days.
-   Do not use shame-based notifications.

### Recommendation engine

Start with transparent, testable rule-based logic. Do not pretend to use
AI if no AI service is connected. Keep the architecture extensible for
future AI recommendations.

### Acceptance checks

Test daily task generation, task completion, postponement, replacement,
Rescue Mode, timer persistence, duplicate prevention, and Firestore
persistence.

------------------------------------------------------------------------

# PHASE 6 --- Marks tracker and Mistake Notebook

**Goal:** Help students understand why they lose marks and what to
improve.

### Prompt

Build two connected modules: Academic Performance Tracker and Mistake
Notebook.

## Module A --- Examination tracker

Support: - Unit Tests - Class Tests - Half-Yearly Examinations -
Pre-Board Examinations - Mock Tests - Practice Tests

Each record should include: - Examination name - Date - Subject -
Maximum marks - Obtained marks - Calculated percentage - Optional
remarks

Validate that marks are numeric, non-negative, and do not exceed maximum
marks unless the assessment explicitly supports a different scoring
scheme.

### Performance views

Display: - Latest marks - Highest marks - Average marks - Improvement or
decline - Subject-wise performance - Marks over time

Use simple, readable charts and clear labels. Do not overwhelm students
with analytics.

## Module B --- Mistake Notebook

Allow students to record: - Subject - Chapter - Topic - Question or
problem - What went wrong? - Correct explanation - Mistake category -
Optional photograph - Date recorded - Review status

Categories: 1. Concept not understood 2. Forgot formula 3. Calculation
error 4. Misread the question 5. Incomplete answer 6. Time management 7.
Lack of revision 8. Other

### Photo uploads

Use Firebase Storage. Support upload, preview, and deletion of the
student's own attachments. Validate file type and size. Handle failed
uploads and orphaned files safely.

### Revision workflow

Allow students to: - Review a mistake - Mark it understood - Schedule
another review - See repeated mistakes - Open the related chapter

### Dashboard integration

Show repeated mistakes, weak subjects, topics needing revision, and
performance trends based only on actual records.

### Privacy

Students can access only their own academic records and attachments.
Never expose marks or mistakes publicly.

### Acceptance checks

Test marks calculations, editing and deletion, chart accuracy, image
upload, image deletion, access control, and revision scheduling.

------------------------------------------------------------------------

# PHASE 7 --- Board exam preparation and PYQ system

**Goal:** Turn the platform into a focused exam-preparation workspace
when boards approach.

### Prompt

Build Board Sprint Mode and the structured Previous Year Question (PYQ)
system.

### Board Sprint activation

Activate approximately 90 days before the student's configured board
examination date. Let the student continue using the normal dashboard.

### Sprint dashboard

Display: - Days remaining - Overall syllabus completion - Subject-wise
readiness - Weak chapters - High-priority unfinished topics - Upcoming
revision tasks - Sample paper completion - PYQ practice progress

### PYQ library

Organize questions by: - Board - Academic session - Class - Subject -
Chapter - Topic - Year - Question type - Marks

Provide filters for subject, chapter, difficulty, year, and marks.

### Practice experience

Create a distraction-free screen where students can: - Read a question -
Write or record their answer - Mark it for review - Track completion -
Record difficulty - Review relevant explanations when authorized content
is available

### Sample paper tracker

Let students record: - Sample paper name - Date - Time taken - Maximum
marks - Obtained marks - Weak sections - Completion status

### Estimated study ROI

Create a prioritization aid using verified importance/weightage and
estimated study hours. Clearly label estimates and explain the
calculation. Never guarantee marks or predict that a question will
appear in the board exam.

### Readiness indicator

Use a transparent calculation based on: - Chapter mastery - PYQ
practice - Revision completion - Test performance

Explain how the score is calculated. Do not present it as a guaranteed
board result.

### Content integrity

Allow authorized administrators to upload verified papers and resources.
Respect copyright and distribution permissions. Do not scrape or
redistribute unauthorized question banks.

### Acceptance checks

Test date-based activation, manual access, PYQ filters, question
progress, sample paper records, readiness calculation, and content
permissions.

------------------------------------------------------------------------

# PHASE 8 --- Parent dashboard and administration panel

**Goal:** Provide useful parent visibility while protecting student
privacy, and give administrators secure content-management tools.

## Part A --- Parent dashboard

### Prompt

Build a separate parent experience with: - Student academic overview -
Overall syllabus completion - Subject-wise progress - Examination marks
and trends - Upcoming examinations - Weekly preparation summary -
Revision progress

### Weekly digest

Summarize: - Chapters completed - Study consistency - Tests attempted -
Performance trends - Areas needing attention

Support optional email or WhatsApp delivery only after the required
integration, consent, and configuration are in place.

### Parent privacy

-   Require a verified invitation or approval to link a parent and
    student.
-   Enforce relationship-based access.
-   Prevent access to unrelated students.
-   Show only appropriate academic information.
-   Do not expose every private daily activity.
-   Provide age-appropriate privacy controls.
-   Do not make parent access a backdoor into student accounts.

## Part B --- Admin panel

Create a separate, protected administration interface.

### Admin navigation

-   Overview
-   Users
-   Boards
-   Academic Sessions
-   Classes
-   Subjects
-   Syllabus
-   Chapters
-   Topics
-   PYQ Library
-   Learning Resources
-   Announcements
-   Reports
-   Settings

### Admin functionality

1.  Manage boards.
2.  Manage academic sessions.
3.  Manage classes.
4.  Add, edit, and archive subjects.
5.  Add, edit, and archive chapters.
6.  Manage topic structures.
7.  Upload learning resources.
8.  Manage verified PYQ content.
9.  Update syllabus weightage with source and session metadata.
10. Publish announcements.
11. Manage users and support requests.
12. View aggregate platform analytics where privacy permits.

### Roles

Implement least-privilege roles: - Super Admin - Content Administrator -
Support Administrator

Enforce authorization server-side and in database rules. A client must
never be able to grant itself a role.

### Audit logs

Record important administrative changes, including actor, action,
target, timestamp, and relevant change metadata. Do not log passwords,
secrets, or unnecessary sensitive student content.

### Acceptance checks

Test role permissions, content creation and updates, parent-student
linking, unauthorized access, audit logs, and all protected routes.

------------------------------------------------------------------------

# PHASE 9 --- Testing, optimization, PWA, and deployment

**Goal:** Make the product reliable on real student devices and real
data.

### Prompt

Act as a senior QA engineer, application security engineer,
accessibility specialist, and DevOps engineer. Audit the entire platform
and prepare it for production.

## 1. Functional testing

Test complete user journeys: - Registration and login - Password reset -
Onboarding - Student dashboard - Syllabus tracking - Daily task
generation - Task completion - Focus timer - Marks entry - Mistake
Notebook - Image uploads - PYQ practice - Board Sprint - Parent
dashboard - Admin panel

Test successful, invalid, empty, offline, interrupted, and unauthorized
cases.

## 2. Responsive testing

Verify: - Small Android phones - Large Android phones - Tablets -
Laptops - Desktop monitors

Fix horizontal overflow, clipped content, tiny controls, and broken
navigation.

## 3. Performance

-   Optimize and resize images.
-   Lazy-load non-critical modules.
-   Reduce unnecessary Firebase reads and writes.
-   Paginate large lists.
-   Avoid unnecessary React re-renders.
-   Use appropriate caching.
-   Optimize fonts and bundles.
-   Keep initial screens fast on slower networks.

## 4. Security

Audit: - Firebase Authentication - Firestore security rules - Storage
security rules - Role-based access - Parent-student permissions - Input
validation - File upload validation - Protected routes - Server-side
authorization - Abuse and rate-limiting risks for sensitive endpoints

Never rely on hidden UI controls as security.

## 5. PWA

Implement: - Web app manifest - Installable application - Appropriate
app icons - Service worker - Offline fallback - Cached application
shell - Network-aware error messages

Do not place sensitive student records in an insecure shared cache.
Explain which features require an internet connection.

## 6. Accessibility

-   Readable typography
-   Keyboard accessibility
-   Screen-reader labels
-   Sufficient color contrast
-   Large touch targets
-   Clear error messages
-   Understandable navigation
-   Reduced-motion support

## 7. Final verification

Run the project's actual scripts, including where configured:

``` bash
npm run build
npm run lint
npx tsc --noEmit
```

Fix actual errors. Do not suppress errors or disable checks simply to
make the build pass. Report any checks that could not be run.

## 8. Deployment

Prepare for Vercel deployment and document: - Environment variables -
Firebase project configuration - Firestore indexes - Security rules
deployment - Storage configuration - Authorized domains - Domain
configuration - Backup and recovery considerations

Do not claim production readiness until the relevant checks have been
performed.

------------------------------------------------------------------------

# PHASE 10 --- Final product-wide UI/UX consistency audit

**Goal:** Make every module feel like one cohesive, polished product.

### Prompt

Act as a principal product designer. Audit the existing implementation
before making changes. Improve consistency without removing features or
changing working business logic.

### Audit checklist

1.  Consistent navigation across modules.
2.  Consistent typography and heading hierarchy.
3.  Consistent button and form styles.
4.  Consistent card and dialog patterns.
5.  Consistent spacing and alignment.
6.  Familiar, meaningful icons.
7.  Meaningful color usage and accessible contrast.
8.  Clear labels and understandable actions.
9.  Responsive mobile navigation.
10. Readable charts and progress indicators.
11. Helpful empty states and onboarding guidance.
12. Predictable loading, success, and error feedback.

### Student-friendliness review

-   Replace technical language with simple wording.
-   Explain unfamiliar features at the point of use.
-   Keep important actions easy to find.
-   Avoid overwhelming students with choices.
-   Use short descriptions under important headings.
-   Keep common tasks accessible within two taps wherever practical.
-   Make the guided tour skippable and available again from Help.
-   Use encouraging, non-judgmental messages.

### Interaction review

-   Add subtle click and hover feedback.
-   Use skeleton loaders.
-   Add clear toast notifications.
-   Confirm destructive actions.
-   Preserve form data when appropriate.
-   Avoid unnecessary modal windows.
-   Ensure every visible button works.

### Visual review

-   Refine spacing and alignment.
-   Improve typography hierarchy.
-   Improve mobile layouts.
-   Simplify crowded screens.
-   Use illustrations selectively.
-   Avoid excessive gradients, animation, and glassmorphism.

Do not redesign blindly. Identify issues first, prioritize by student
impact, make targeted improvements, and retest affected flows.

------------------------------------------------------------------------

# 4. Product-wide acceptance checklist

Before calling the platform complete, verify:

-   [ ] A student can register, log in, and recover access.
-   [ ] Onboarding can be completed and edited.
-   [ ] A student sees only their own private data.
-   [ ] The dashboard uses real saved records.
-   [ ] The syllabus is centrally managed and session-aware.
-   [ ] Chapter progress persists across devices.
-   [ ] Daily tasks are relevant, understandable, and limited.
-   [ ] Rescue Mode reduces workload without penalty.
-   [ ] Study sessions are recorded accurately.
-   [ ] Marks calculations are correct.
-   [ ] Mistake photos are securely stored.
-   [ ] Revision records persist.
-   [ ] Board Sprint uses the configured exam date.
-   [ ] PYQ content has appropriate permissions and metadata.
-   [ ] Readiness calculations are transparent.
-   [ ] Parent access requires a verified relationship.
-   [ ] Admin roles are enforced securely.
-   [ ] The application works on small Android screens.
-   [ ] Loading, empty, offline, and error states are helpful.
-   [ ] Accessibility has been reviewed.
-   [ ] Security rules have been tested.
-   [ ] Build, lint, and TypeScript checks have been run.
-   [ ] Deployment instructions are documented.

------------------------------------------------------------------------

# 5. Recommended implementation order

    Order Phase      Main deliverable
  ------- ---------- --------------------------------
        1 Phase 0    Project foundation
        2 Phase 1    Design system and landing page
        3 Phase 2    Authentication and onboarding
        4 Phase 3    Student dashboard
        5 Phase 4    Syllabus tracker
        6 Phase 5    Daily planner and Rescue Mode
        7 Phase 6    Marks and Mistake Notebook
        8 Phase 7    Board Sprint and PYQs
        9 Phase 8    Parent and admin modules
       10 Phase 9    QA, security, PWA, deployment
       11 Phase 10   Product-wide UI/UX refinement

------------------------------------------------------------------------

# 6. Reusable instruction to give the AI coding agent after every phase

Paste this instruction after each implementation phase:

> Review the phase you have just implemented. Inspect the actual code
> and run the relevant tests. Check for broken navigation,
> non-functional buttons, fake or hardcoded data, incorrect Firestore
> queries, missing loading and error states, responsive layout problems,
> TypeScript errors, and security issues. Fix the problems you can
> verify. Preserve working functionality and do not start the next
> phase. Give me a concise report of what was implemented, what was
> tested, what passed, and what still requires configuration or
> attention.

------------------------------------------------------------------------

# 7. Final product positioning

**Product promise:** One day at a time. One chapter at a time.

**Suggested tagline:** Your boards. Your pace. Your progress.

**Core differentiator:** Students do not need another 500-video library.
They need a simple, trustworthy place that shows where they stand and
the next useful step to take.

**Build priority:** Make the Student Dashboard, Syllabus Tracker, and
Daily Study Planner genuinely excellent before expanding into advanced
features.

**Final instruction to the coding agent:** Build for real students
first. Every feature must make preparation easier, clearer, or more
manageable. Simplicity, trust, accessibility, and reliable functionality
are more important than adding features for the sake of quantity.
