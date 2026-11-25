import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const RegisterSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const StudentOnboardingSchema = z.object({
  board: z.enum(["CBSE", "ICSE", "STATE"]),
  academicSession: z.string().min(1, "Please select an academic session"),
  classGrade: z.string().min(1, "Please select your class"),
  selectedSubjectIds: z.array(z.string()).min(1, "Please select at least one subject"),
  targetPercentage: z.number().min(30).max(100).optional(),
  dailyAvailableMinutes: z.number().min(15).max(720),
  preferredStudyTime: z.enum(["morning", "afternoon", "evening", "night"]),
  boardExamDate: z.string().optional(),
});

export const ExamRecordSchema = z.object({
  examName: z.string().min(1, "Examination name is required"),
  examType: z.enum([
    "unit_test",
    "class_test",
    "half_yearly",
    "pre_board",
    "mock_test",
    "practice_test",
  ]),
  date: z.string().min(1, "Date is required"),
  subjectId: z.string().min(1, "Subject is required"),
  maximumMarks: z.number().positive("Maximum marks must be greater than 0"),
  obtainedMarks: z.number().nonnegative("Obtained marks cannot be negative"),
  remarks: z.string().optional(),
}).refine((data) => data.obtainedMarks <= data.maximumMarks, {
  message: "Obtained marks cannot exceed maximum marks",
  path: ["obtainedMarks"],
});

export const MistakeRecordSchema = z.object({
  subjectId: z.string().min(1, "Subject is required"),
  chapterId: z.string().min(1, "Chapter is required"),
  topicId: z.string().optional(),
  questionText: z.string().min(3, "Question text is required"),
  whatWentWrong: z.string().min(3, "Explanation of what went wrong is required"),
  correctExplanation: z.string().min(3, "Correct concept or explanation is required"),
  category: z.enum([
    "concept_not_understood",
    "forgot_formula",
    "calculation_error",
    "misread_question",
    "incomplete_answer",
    "time_management",
    "lack_of_revision",
    "other",
  ]),
});

export const ChapterProgressUpdateSchema = z.object({
  chapterId: z.string().min(1),
  subjectId: z.string().min(1),
  status: z.enum(["not_started", "ncert_read", "pyqs_solved", "mastered"]),
  completedTopicIds: z.array(z.string()),
  personalNotes: z.string().optional(),
});
