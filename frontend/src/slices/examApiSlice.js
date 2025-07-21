import { apiSlice } from './apiSlice';

// Define the base URL for the exams API
const EXAMS_URL = '/api/exams';

// Inject endpoints for the exam slice
export const examApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all exams
    getExams: builder.query({
      query: () => ({
        url: `${EXAMS_URL}/exam`,
        method: 'GET',
      }),
    }),
    // Get exams created by current user (for teachers)
    getMyExams: builder.query({
      query: () => ({
        url: `${EXAMS_URL}/my-exams`,
        method: 'GET',
      }),
    }),
    // Get a single exam by ID
    getExamById: builder.query({
      query: (examId) => ({
        url: `${EXAMS_URL}/exam/${examId}`,
        method: 'GET',
      }),
    }),
    // Create a new exam
    createExam: builder.mutation({
      query: (data) => ({
        url: `${EXAMS_URL}/exam`,
        method: 'POST',
        body: data,
      }),
    }),
    // Update an existing exam
    updateExam: builder.mutation({
      query: ({ examId, ...data }) => ({
        url: `${EXAMS_URL}/exam/${examId}`,
        method: 'PUT',
        body: data,
      }),
    }),
    // Get questions for a specific exam
    getQuestions: builder.query({
      query: (examId) => ({
        url: `${EXAMS_URL}/exam/questions/${examId}`,
        method: 'GET',
      }),
    }),
    // Create a new question for an exam
    createQuestion: builder.mutation({
      query: (data) => ({
        url: `${EXAMS_URL}/exam/questions`,
        method: 'POST',
        body: data,
      }),
    }),
    // Update an existing question
    updateQuestion: builder.mutation({
      query: ({ questionId, ...data }) => ({
        url: `${EXAMS_URL}/exam/questions/${questionId}`,
        method: 'PUT',
        body: data,
      }),
    }),

    //Delete an exam
    deleteExam: builder.mutation({
      query: (examId) => ({
        url: `${EXAMS_URL}/exam/${examId}`,
        method: 'POST',
        credentials: 'include',
      }),
    }),
    // Get exam results by examId
    getExamResults: builder.query({
      query: (examId) => ({
        url: `${EXAMS_URL}/results/${examId}`,
        method: 'GET',
      }),
      providesTags: ['ExamResults'],
    }),
    // Get a single student's exam result for a specific exam
    getStudentExamResult: builder.query({
      query: ({ examId, studentId }) => ({
        url: `${EXAMS_URL}/results/${examId}/${studentId}`,
        method: 'GET',
      }),
    }),
    // Get the last submitted exam for the logged-in student
    getLastStudentSubmission: builder.query({
      query: () => ({
        url: `${EXAMS_URL}/last-submission`,
        method: 'GET',
      }),
    }),
    // Get student statistics (completed exams, avg score, etc.)
    getStudentStats: builder.query({
      query: () => ({
        url: `${EXAMS_URL}/student-stats`,
        method: 'GET',
      }),
      providesTags: ['StudentStats'],
    }),
    // Get teacher submissions for all their exams
    getTeacherSubmissions: builder.query({
      query: () => ({
        url: `${EXAMS_URL}/teacher-submissions`,
        method: 'GET',
      }),
      providesTags: ['TeacherSubmissions'],
    }),
    // Submit an exam
    submitExam: builder.mutation({
      query: (data) => ({
        url: `${EXAMS_URL}/submit`,
        method: 'POST',
        body: data,
      }),
      // Invalidate relevant caches when exam is submitted
      invalidatesTags: ['StudentStats', 'TeacherSubmissions', 'ExamResults'],
    }),
  }),
});

// Export the generated hooks for each endpoint
export const {
  useGetExamsQuery,
  useGetMyExamsQuery,
  useGetExamByIdQuery,
  useCreateExamMutation,
  useUpdateExamMutation,
  useGetQuestionsQuery,
  useCreateQuestionMutation,
  useDeleteExamMutation,
  useGetExamResultsQuery,
  useSubmitExamMutation,
  useUpdateQuestionMutation,
  useGetStudentExamResultQuery,
  useGetLastStudentSubmissionQuery,
  useGetStudentStatsQuery,
  useGetTeacherSubmissionsQuery,
} = examApiSlice;
