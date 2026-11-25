/**
 * Academic Preparation Platform - Core Domain Models & Types
 * Student-first, board-exam focused data models
 */

export type UserRole = 'student' | 'parent' | 'admin' | 'super_admin' | 'content_admin' | 'support_admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type BoardType = 'CBSE' | 'ICSE' | 'STATE';

export interface StudentAcademicProfile {
  uid: string;
  board: BoardType;
  academicSession: string; // e.g. "2026-2027"
  classGrade: string; // e.g. "Class 10"
  selectedSubjectIds: string[];
  targetPercentage?: number;
  dailyAvailableMinutes: number; // e.g. 120
  preferredStudyTime: 'morning' | 'afternoon' | 'evening' | 'night';
  boardExamDate?: string; // ISO date string (e.g. "2027-02-15")
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: string;
  name: string;
  code: BoardType;
  description?: string;
  isActive: boolean;
}

export interface AcademicSession {
  id: string;
  name: string; // e.g., "2026-2027"
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface Subject {
  id: string;
  boardId: string;
  classGrade: string;
  name: string; // "Mathematics Standard", "Science", etc.
  code: string; // "041", "086", etc.
  iconName: string; // Lucide icon name, e.g. "Calculator", "Atom"
  color: string; // Hex color code for UI accents
  isOptional: boolean;
  displayOrder: number;
}

export interface Topic {
  id: string;
  chapterId: string;
  title: string;
  description?: string;
  isImportantForBoard: boolean;
  displayOrder: number;
}

export interface ChapterVideoLesson {
  id: string;
  title: string;
  youtubeId: string;
  channelName: string;
  durationMinutes: number;
  topicCovered?: string;
  isOneShot?: boolean;
}

export interface ChapterNoteDocument {
  id: string;
  title: string;
  pdfUrl: string;
  fileName: string;
  fileSizeBytes: string;
  pageCount: number;
  keyFormulas?: string[];
  sourceName: string;
  officialNcertChapterUrl?: string;
}

export interface Chapter {
  id: string;
  subjectId: string;
  unitName?: string;
  title: string;
  chapterNumber: number;
  officialWeightageMarks?: number; // Verified CBSE marks if officially published
  isWeightageEstimated: boolean;
  estimatedStudyHours?: number;
  syllabusOrder: number;
  topics: Topic[];
  notesDocument?: ChapterNoteDocument;
  videoLessons?: ChapterVideoLesson[];
  mindMapSummary?: string[];
}

export type ChapterStatus = 'not_started' | 'ncert_read' | 'pyqs_solved' | 'mastered';

export interface StudentChapterProgress {
  id: string;
  studentId: string;
  chapterId: string;
  subjectId: string;
  status: ChapterStatus;
  completedTopicIds: string[];
  personalNotes?: string;
  lastStudiedAt?: string;
  updatedAt: string;
}

export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskReason = 'upcoming_exam' | 'weak_chapter' | 'revision_due' | 'syllabus_backlog' | 'rescue_mode';

export interface StudyTask {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  subjectId: string;
  chapterId: string;
  topicId?: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  priority: TaskPriority;
  reason: TaskReason;
  reasonExplanation: string;
  isCompleted: boolean;
  completedAt?: string;
  isPostponed?: boolean;
  isRescueTask?: boolean;
  createdAt: string;
}

export interface StudySession {
  id: string;
  studentId: string;
  taskId?: string;
  subjectId: string;
  chapterId?: string;
  durationMinutes: number;
  startedAt: string;
  completedAt: string;
  notes?: string;
}

export type ExamType = 'unit_test' | 'class_test' | 'half_yearly' | 'pre_board' | 'mock_test' | 'practice_test';

export interface ExamRecord {
  id: string;
  studentId: string;
  examName: string;
  examType: ExamType;
  date: string; // YYYY-MM-DD
  subjectId: string;
  maximumMarks: number;
  obtainedMarks: number;
  percentage: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export type MistakeCategory =
  | 'concept_not_understood'
  | 'forgot_formula'
  | 'calculation_error'
  | 'misread_question'
  | 'incomplete_answer'
  | 'time_management'
  | 'lack_of_revision'
  | 'other';

export interface MistakeRecord {
  id: string;
  studentId: string;
  subjectId: string;
  chapterId: string;
  topicId?: string;
  questionText: string;
  whatWentWrong: string;
  correctExplanation: string;
  category: MistakeCategory;
  attachmentUrl?: string;
  attachmentStoragePath?: string;
  isUnderstood: boolean;
  nextRevisionDate?: string;
  revisionCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PYQItem {
  id: string;
  boardId: string;
  subjectId: string;
  chapterId: string;
  topicId?: string;
  year: number;
  examSession?: string; // "Term 1", "Main", "Compartment"
  questionText: string;
  questionType: 'mcq' | 'assertion_reason' | 'short_answer' | 'long_answer' | 'case_based';
  marks: number;
  officialAnswerOrHint?: string;
  sourceReference: string; // Verified CBSE paper reference
}

export interface PYQPaperDocument {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  year: number;
  session: string;
  type: 'question_paper' | 'marking_scheme' | 'practice_paper' | 'question_bank';
  fileName: string;
  localPdfUrl: string;
  officialSourceUrl: string;
  fileSizeBytes?: string;
  pageCount?: number;
  maxMarks: number;
  durationHours: number;
  isVerified: boolean;
}

export interface ParentStudentLink {
  id: string; // parentUid_studentUid
  parentId: string;
  studentId: string;
  status: 'pending' | 'active' | 'revoked';
  inviteCode?: string;
  createdAt: string;
  verifiedAt?: string;
}
