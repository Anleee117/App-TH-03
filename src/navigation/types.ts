export type TabParamList = {
  Home: undefined;
  Courses: undefined;
  Schedule: undefined;
  Assignments: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  CourseDetail: {courseId: string};
  SessionDetail: {sessionId: string};
  AssignmentDetail: {assignmentId: string};
  ResultDetail: {resultId: string};
};
