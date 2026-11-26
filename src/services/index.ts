import {
  UserProfile,
  StudentAcademicProfile,
  StudentChapterProgress,
  ChapterStatus,
  StudyTask,
  ExamRecord,
  MistakeRecord,
  Subject,
  Chapter,
  PYQPaperDocument,
  GameQuestion,
  GameScore,
} from "@/types";
import {
  fetchDocById,
  upsertDoc,
  queryDocs,
  subscribeDocs,
  removeDoc,
  where,
} from "@/lib/firebase/firestore";
import {
  INITIAL_CBSE_CLASS_10_SUBJECTS,
  INITIAL_SAMPLE_CHAPTERS,
  CBSE_CLASS_10_OFFICIAL_PAPERS,
} from "@/constants/curriculum";
import { GAME_QUESTIONS } from "@/constants/gameQuestions";

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

  async listUsers(): Promise<UserProfile[]> {
    return queryDocs<UserProfile>("users");
  },
};

/**
 * Service for tracking chapter milestones and student progress
 */
export const ProgressService = {
  async getStudentProgress(studentId: string): Promise<StudentChapterProgress[]> {
    return queryDocs<StudentChapterProgress>("student_progress", where("studentId", "==", studentId));
  },

  subscribeStudentProgress(
    studentId: string,
    onData: (rows: StudentChapterProgress[]) => void
  ): () => void {
    return subscribeDocs<StudentChapterProgress>(
      "student_progress",
      [where("studentId", "==", studentId)],
      onData
    );
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
    // Query only by studentId to avoid requiring a composite Firestore index,
    // then filter by date on the client.
    const all = await queryDocs<StudyTask>("study_tasks", where("studentId", "==", studentId));
    return all.filter((t) => t.date === dateStr);
  },

  subscribeDailyTasks(
    studentId: string,
    dateStr: string,
    onData: (rows: StudyTask[]) => void
  ): () => void {
    return subscribeDocs<StudyTask>(
      "study_tasks",
      [where("studentId", "==", studentId)],
      (rows) => onData(rows.filter((t) => t.date === dateStr))
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

  subscribeStudentExams(
    studentId: string,
    onData: (rows: ExamRecord[]) => void
  ): () => void {
    return subscribeDocs<ExamRecord>(
      "exam_records",
      [where("studentId", "==", studentId)],
      onData
    );
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

  subscribeStudentMistakes(
    studentId: string,
    onData: (rows: MistakeRecord[]) => void
  ): () => void {
    return subscribeDocs<MistakeRecord>(
      "mistakes",
      [where("studentId", "==", studentId)],
      onData
    );
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

function mergeById<T extends { id: string }>(
  defaults: T[],
  remote: Array<T & { isDeleted?: boolean }>
): T[] {
  const map = new Map<string, T>();
  defaults.forEach((item) => map.set(item.id, item));
  remote.forEach((item) => {
    if (item.isDeleted) {
      map.delete(item.id);
    } else {
      map.set(item.id, item);
    }
  });
  return Array.from(map.values());
}

/**
 * Content service: reads admin-managed curriculum content from Firestore and
 * merges it over the built-in defaults so the platform always has usable data.
 */
export const ContentService = {
  async getSubjects(): Promise<Subject[]> {
    let remote: Array<Subject & { isDeleted?: boolean }> = [];
    try {
      remote = await queryDocs<Subject & { isDeleted?: boolean }>("subjects");
    } catch (err) {
      console.warn("Could not load custom subjects, using built-in curriculum.", err);
    }
    return mergeById<Subject>(INITIAL_CBSE_CLASS_10_SUBJECTS, remote).sort(
      (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
    );
  },

  async getChaptersBySubject(subjectId: string): Promise<Chapter[]> {
    const defaults = INITIAL_SAMPLE_CHAPTERS[subjectId] || [];
    let remote: Array<Chapter & { isDeleted?: boolean }> = [];
    try {
      remote = await queryDocs<Chapter & { isDeleted?: boolean }>(
        "chapters",
        where("subjectId", "==", subjectId)
      );
    } catch (err) {
      console.warn("Could not load custom chapters, using built-in curriculum.", err);
    }
    return mergeById<Chapter>(defaults, remote).sort(
      (a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0)
    );
  },

  async getAllChapters(): Promise<Chapter[]> {
    const remote = await queryDocs<Chapter & { isDeleted?: boolean }>("chapters");
    const defaults = Object.values(INITIAL_SAMPLE_CHAPTERS).flat();
    return mergeById<Chapter>(defaults, remote).sort(
      (a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0)
    );
  },

  async getPapers(): Promise<PYQPaperDocument[]> {
    let remote: Array<PYQPaperDocument & { isDeleted?: boolean }> = [];
    try {
      remote = await queryDocs<PYQPaperDocument & { isDeleted?: boolean }>("pyq_papers");
    } catch (err) {
      console.warn("Could not load custom papers, using built-in library.", err);
    }
    return mergeById<PYQPaperDocument>(CBSE_CLASS_10_OFFICIAL_PAPERS, remote);
  },

  async getGameQuestions(): Promise<GameQuestion[]> {
    let remote: Array<GameQuestion & { isDeleted?: boolean }> = [];
    try {
      remote = await queryDocs<GameQuestion & { isDeleted?: boolean }>("game_questions");
    } catch (err) {
      console.warn("Could not load custom game questions, using built-in bank.", err);
    }
    return mergeById<GameQuestion>(GAME_QUESTIONS, remote);
  },
};

/**
 * Game score persistence (per student, isolated).
 */
export const GameService = {
  async getScore(studentId: string): Promise<GameScore | null> {
    return fetchDocById<GameScore>("game_scores", studentId);
  },

  async saveScore(score: GameScore): Promise<void> {
    await upsertDoc("game_scores", score.studentId, score);
  },
};

const STUDENT_ACTIVITY_COLLECTIONS = [
  "student_progress",
  "study_tasks",
  "study_sessions",
  "exam_records",
  "mistakes",
  "game_scores",
];

/**
 * Wipes all private academic activity for a single student while preserving
 * their login credentials and profile. Used for the one-time data reset and by
 * the admin data-management tools.
 */
export async function resetStudentActivity(studentId: string): Promise<void> {
  for (const collectionName of STUDENT_ACTIVITY_COLLECTIONS) {
    try {
      const rows = await queryDocs<{ id: string }>(
        collectionName,
        where("studentId", "==", studentId)
      );
      await Promise.all(rows.map((row) => removeDoc(collectionName, row.id)));
    } catch (err) {
      console.warn(`Could not reset ${collectionName} for ${studentId}:`, err);
    }
  }
}
