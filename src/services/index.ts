import {
  UserProfile,
  StudentAcademicProfile,
  StudentChapterProgress,
  ChapterStatus,
  StudyTask,
  ExamRecord,
  MistakeRecord,
} from "@/types";
import { fetchDocById, upsertDoc, queryDocs, where } from "@/lib/firebase/firestore";

/**
 * Service for managing student profiles and onboarding data
 */
export const UserService = {
  async getStudentProfile(uid: string): Promise<StudentAcademicProfile | null> {
    return fetchDocById<StudentAcademicProfile>("student_profiles", uid);
  },

  async saveStudentProfile(profile: StudentAcademicProfile): Promise<void> {
    await upsertDoc("student_profiles", profile.uid, {
      ...profile,
      updatedAt: new Date().toISOString(),
    });
  },

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    return fetchDocById<UserProfile>("users", uid);
  },

  async saveUserProfile(profile: UserProfile): Promise<void> {
    await upsertDoc("users", profile.uid, {
      ...profile,
      updatedAt: new Date().toISOString(),
    });
  },
};

/**
 * Service for tracking chapter milestones and student progress
 */
export const ProgressService = {
  async getStudentProgress(studentId: string): Promise<StudentChapterProgress[]> {
    return queryDocs<StudentChapterProgress>("student_progress", where("studentId", "==", studentId));
  },

  async updateChapterProgress(
    studentId: string,
    chapterId: string,
    subjectId: string,
    status: ChapterStatus,
    completedTopicIds: string[] = [],
    personalNotes?: string
  ): Promise<void> {
    const progressId = `${studentId}_${chapterId}`;
    await upsertDoc("student_progress", progressId, {
      id: progressId,
      studentId,
      chapterId,
      subjectId,
      status,
      completedTopicIds,
      personalNotes: personalNotes || "",
      lastStudiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  },
};

/**
 * Service for daily study tasks and 15-minute rescue mode
 */
export const TaskService = {
  async getDailyTasks(studentId: string, dateStr: string): Promise<StudyTask[]> {
    return queryDocs<StudyTask>(
      "study_tasks",
      where("studentId", "==", studentId),
      where("date", "==", dateStr)
    );
  },

  async toggleTaskCompletion(taskId: string, isCompleted: boolean): Promise<void> {
    await upsertDoc("study_tasks", taskId, {
      isCompleted,
      completedAt: isCompleted ? new Date().toISOString() : null,
    });
  },

  async saveTasks(tasks: StudyTask[]): Promise<void> {
    for (const task of tasks) {
      await upsertDoc("study_tasks", task.id, task);
    }
  },
};

/**
 * Service for exams and marks tracking
 */
export const ExamService = {
  async getStudentExams(studentId: string): Promise<ExamRecord[]> {
    return queryDocs<ExamRecord>("exam_records", where("studentId", "==", studentId));
  },

  async saveExam(record: ExamRecord): Promise<void> {
    await upsertDoc("exam_records", record.id, record);
  },
};

/**
 * Service for Mistake Notebook
 */
export const MistakeService = {
  async getStudentMistakes(studentId: string): Promise<MistakeRecord[]> {
    return queryDocs<MistakeRecord>("mistakes", where("studentId", "==", studentId));
  },

  async saveMistake(record: MistakeRecord): Promise<void> {
    await upsertDoc("mistakes", record.id, record);
  },

  async toggleMistakeUnderstood(mistakeId: string, isUnderstood: boolean): Promise<void> {
    await upsertDoc("mistakes", mistakeId, {
      isUnderstood,
      updatedAt: new Date().toISOString(),
    });
  },
};
