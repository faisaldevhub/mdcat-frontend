import { useReducer, useCallback, useMemo } from "react";

// =============================================================================
// Quiz Session Reducer — Local Page State
// =============================================================================
// Per FRONTEND_ARCHITECTURE.md: "The active quiz session (current question
// index, selected answers, navigation state) is local page state managed
// with useReducer. It is not global state because it is only relevant
// within the quiz page."

export interface QuizSessionState {
  currentIndex: number;
  totalQuestions: number;
  /** Map of questionId → selected option key ("a", "b", "c", "d") */
  answers: Record<number, string>;
  /** Set of questionIds that have been saved to the backend */
  savedAnswers: Record<number, boolean>;
  isSubmitting: boolean;
  isCompleted: boolean;
}

type QuizSessionAction =
  | { type: "INIT"; totalQuestions: number }
  | { type: "GO_TO"; index: number }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "SELECT_ANSWER"; questionId: number; option: string }
  | { type: "ANSWER_SAVED"; questionId: number }
  | { type: "SET_SUBMITTING"; isSubmitting: boolean }
  | { type: "COMPLETE" };

const initialState: QuizSessionState = {
  currentIndex: 0,
  totalQuestions: 0,
  answers: {},
  savedAnswers: {},
  isSubmitting: false,
  isCompleted: false,
};

function quizSessionReducer(
  state: QuizSessionState,
  action: QuizSessionAction
): QuizSessionState {
  switch (action.type) {
    case "INIT":
      return { ...initialState, totalQuestions: action.totalQuestions };

    case "GO_TO":
      if (action.index < 0 || action.index >= state.totalQuestions) return state;
      return { ...state, currentIndex: action.index };

    case "NEXT":
      if (state.currentIndex >= state.totalQuestions - 1) return state;
      return { ...state, currentIndex: state.currentIndex + 1 };

    case "PREV":
      if (state.currentIndex <= 0) return state;
      return { ...state, currentIndex: state.currentIndex - 1 };

    case "SELECT_ANSWER":
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.option },
      };

    case "ANSWER_SAVED":
      return {
        ...state,
        savedAnswers: { ...state.savedAnswers, [action.questionId]: true },
      };

    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.isSubmitting };

    case "COMPLETE":
      return { ...state, isCompleted: true, isSubmitting: false };

    default:
      return state;
  }
}

/**
 * Hook for managing quiz session state.
 * Returns the state and convenience action dispatchers.
 *
 * The `actions` and `computed` objects are memoized so they maintain
 * referential stability across renders. This prevents useEffect
 * dependencies from triggering unnecessary re-runs.
 */
export function useQuizSession() {
  const [state, dispatch] = useReducer(quizSessionReducer, initialState);

  const init = useCallback(
    (totalQuestions: number) => dispatch({ type: "INIT", totalQuestions }),
    []
  );

  const goTo = useCallback(
    (index: number) => dispatch({ type: "GO_TO", index }),
    []
  );

  const next = useCallback(() => dispatch({ type: "NEXT" }), []);
  const prev = useCallback(() => dispatch({ type: "PREV" }), []);

  const selectAnswer = useCallback(
    (questionId: number, option: string) =>
      dispatch({ type: "SELECT_ANSWER", questionId, option }),
    []
  );

  const markSaved = useCallback(
    (questionId: number) => dispatch({ type: "ANSWER_SAVED", questionId }),
    []
  );

  const setSubmitting = useCallback(
    (isSubmitting: boolean) =>
      dispatch({ type: "SET_SUBMITTING", isSubmitting }),
    []
  );

  const complete = useCallback(() => dispatch({ type: "COMPLETE" }), []);

  // Memoize action dispatchers so the reference is stable across renders.
  const actions = useMemo(
    () => ({
      init,
      goTo,
      next,
      prev,
      selectAnswer,
      markSaved,
      setSubmitting,
      complete,
    }),
    [init, goTo, next, prev, selectAnswer, markSaved, setSubmitting, complete]
  );

  const answeredCount = Object.keys(state.answers).length;
  const unansweredCount = state.totalQuestions - answeredCount;
  const isLastQuestion = state.currentIndex === state.totalQuestions - 1;
  const isFirstQuestion = state.currentIndex === 0;

  // Memoize computed values for referential stability.
  const computed = useMemo(
    () => ({
      answeredCount,
      unansweredCount,
      isLastQuestion,
      isFirstQuestion,
    }),
    [answeredCount, unansweredCount, isLastQuestion, isFirstQuestion]
  );

  return {
    state,
    actions,
    computed,
  };
}
