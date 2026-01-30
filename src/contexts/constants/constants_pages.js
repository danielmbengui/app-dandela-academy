export const PAGE_HOME = "/";
export const PAGE_LOGIN = "/login";
export const PAGE_REGISTER = "/register";
export const PAGE_ACTIVE_ACCOUNT = "/active-account";
export const PAGE_FORGOT_PASSWORD = "/forgot-password";
export const PAGE_NOT_AUTHORIZED = "/not-authorized";
export const PAGE_NOT_FOUND = "/not-found";

export const PAGE_DASHBOARD_HOME = "/dashboard";
export const PAGE_DASHBOARD_CALENDAR = "/calendar";
export const PAGE_DASHBOARD_COMPUTERS = "/computers";
export const PAGE_DASHBOARD_USERS = "/users";
export const PAGE_TEACHERS = "/teachers";
export const PAGE_DASHBOARD_PROFILE = "/profile";
export const PAGE_LESSONS = "/lessons";
export const PAGE_SESSIONS = "/sessions";
export const PAGE_LESSONS_TEACHER = "/on-site";
export const PAGE_CHAPTERS = "/chapters";
export const PAGE_STATS = "/stats";
export const PAGE_SETTINGS = "/settings";
export const PAGE_TERMS_PRIVACY = "/terms/privacy";
export const PAGE_TERMS_USAGE = "/terms/usage";

export const PAGE_ADMIN_HOME = (uidUser) =>
  `/admin/${uidUser}`;
export const PAGE_ADMIN_LESSONS = (uidUser) =>
  `/admin/${uidUser}/lessons`;
export const PAGE_ADMIN_ONE_LESSON = (uidUser, uidLesson) =>
  `/admin/${uidUser}/lessons/${uidLesson}`;
export const PAGE_ADMIN_CHAPTERS = (uidUser, uidLesson) =>
  `/admin/${uidUser}/lessons/${uidLesson}/chapters`;
export const PAGE_ADMIN_ONE_CHAPTER = (uidUser, uidLesson, uidChapter) =>
  `/admin/${uidUser}/lessons/${uidLesson}/chapters/${uidChapter}`;
export const PAGE_ADMIN_CREATE_CHAPTER = (uidUser, uidLesson) =>
  `/admin/${uidUser}/lessons/${uidLesson}/chapters/create`;
export const PAGE_ADMIN_CHAPTER_SUBCHAPTERS = (uidUser, uidLesson, uidChapter) =>
  `/admin/${uidUser}/lessons/${uidLesson}/chapters/${uidChapter}/subchapters`;
export const PAGE_ADMIN_ONE_SUBCHAPTER = (uidUser, uidLesson, uidChapter, uidSubchapter) =>
  `/admin/${uidUser}/lessons/${uidLesson}/chapters/${uidChapter}/subchapters/${uidSubchapter}`;
export const PAGE_ADMIN_CREATE_SUBCHAPTER = (uidUser, uidLesson, uidChapter) =>
  `/admin/${uidUser}/lessons/${uidLesson}/chapters/${uidChapter}/subchapters/create`;
export const PAGE_ADMIN_CHAPTER_QUIZ = (uidUser, uidLesson, uidChapter) =>
  `/admin/${uidUser}/lessons/${uidLesson}/chapters/${uidChapter}/quiz`;
export const PAGE_ADMIN_ONE_QUIZ = (uidUser, uidLesson, uidChapter, uidQuiz) =>
  `/admin/${uidUser}/lessons/${uidLesson}/chapters/${uidChapter}/quiz/${uidQuiz}`;

export const PAGE_ADMIN_UPDATE_ONE_LESSON = "/admin/lessons/update";
export const PAGE_ADMIN_UPDATE_ONE_LESSON_TEACHER = (uidUser, uidLesson, uidLessonTeacher) =>
  `/admin/${uidUser}/lessons/${uidLesson}/${uidLessonTeacher}`;
//export const PAGE_ADMIN_UPDATE_ONE_LESSON = "/admin/lessons/update";
//export const PAGE_TEACHER_LESSONS = "/teacher/lessons";
//export const PAGE_TEACHER_UPDATE_ONE_LESSON = "/teacher/lessons/update";
export const PAGE_TEACHER_HOME = (uidUser) =>
  `/teacher/${uidUser}`;
export const PAGE_TEACHER_LESSONS = (uidUser) =>
  `/teacher/${uidUser}/lessons`;
export const PAGE_TEACHER_SESSIONS_LIST = (uidUser) =>
  `/teacher/${uidUser}/sessions`;
export const PAGE_TEACHER_CREATE_SESSION_LIST = (uidUser) =>
  `/teacher/${uidUser}/sessions/create`;
export const PAGE_TEACHER_EDIT_SESSION = (uidUser, uidLesson, uidSession) =>
  `/teacher/${uidUser}/sessions/${uidLesson}/${uidSession}`;

export const PAGE_TEACHER_ONE_LESSON = (uidUser,uidSourceLesson, uidLesson) =>
  `/teacher/${uidUser}/lessons/${uidSourceLesson}/${uidLesson}`;
export const PAGE_TEACHER_SESSIONS = (uidUser, uidSourceLesson, uidLesson) =>
  `/teacher/${uidUser}/lessons/${uidSourceLesson}/${uidLesson}/sessions`;
export const PAGE_TEACHER_CREATE_SESSION = (uidUser, uidSourceLesson, uidLesson) =>
  `/teacher/${uidUser}/lessons/${uidSourceLesson}/${uidLesson}/sessions/create`;

export const PAGE_CONTACT = "/contact";






export const PAGE_WAITING_LIST = "/waiting-list";
export const PAGE_RESET_PASSWORD = "/reset-password";




export const PAGE_DASHBOARD_STUDENTS = "/dashboard/students";
export const PAGE_DASHBOARD_TUTORS = "/dashboard/tutors";
//export const PAGE_DAHBOARD_HOME = "/dashboard";
