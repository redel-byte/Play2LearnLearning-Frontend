import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAttempt, submitAttemptAnswers } from '../../api/attempts';
import { getErrorMessage } from '../../api/api';
import Navbar from '../../components/layout/Navbar';

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const TakeQuiz = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const loadAttempt = async () => {
      try {
        const attemptData = await getAttempt(attemptId);
        setAttempt(attemptData);

        const existingAnswers = {};
        attemptData.answers?.forEach((answer) => {
          existingAnswers[answer.question_id] = {
            text_answer: answer.text_answer ?? '',
            choice_ids: answer.selected_choices?.map((choice) => choice.id) ?? [],
          };
        });
        setAnswers(existingAnswers);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load quiz attempt'));
        navigate('/private/quiz-history');
      } finally {
        setLoading(false);
      }
    };

    loadAttempt();
  }, [attemptId, navigate]);

  const questions = useMemo(() => attempt?.quiz?.questions ?? [], [attempt]);
  const currentQuestionData = questions[currentQuestion];

  const handleChoiceChange = (questionId, choiceId, isMultipleChoice) => {
    setAnswers((current) => {
      const existingChoiceIds = current[questionId]?.choice_ids ?? [];
      const nextChoiceIds = isMultipleChoice
        ? (
          existingChoiceIds.includes(choiceId)
            ? existingChoiceIds.filter((id) => id !== choiceId)
            : [...existingChoiceIds, choiceId]
        )
        : [choiceId];

      return {
        ...current,
        [questionId]: {
          text_answer: '',
          choice_ids: nextChoiceIds,
        },
      };
    });
  };

  const handleTextAnswerChange = (questionId, value) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: {
        text_answer: value,
        choice_ids: [],
      },
    }));
  };

  const handleSubmit = useCallback(async () => {
    if (submitting) {
      return;
    }

    const payload = questions.map((question) => ({
      question_id: question.id,
      choice_ids: answers[question.id]?.choice_ids ?? [],
      text_answer: answers[question.id]?.text_answer ?? '',
    })).filter((answer) => answer.choice_ids.length > 0 || answer.text_answer.trim());

    if (payload.length === 0) {
      toast.error('Answer at least one question before submitting');
      return;
    }

    setSubmitting(true);
    try {
      await submitAttemptAnswers(attemptId, payload, true);
      toast.success('Quiz submitted successfully');
      navigate(`/private/quiz-results/${attemptId}`);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to submit quiz'));
    } finally {
      setSubmitting(false);
    }
  }, [answers, attemptId, navigate, questions, submitting]);

  useEffect(() => {
    if (!attempt?.quiz?.time_limit_minutes || !attempt?.started_at || attempt?.submitted_at) {
      return undefined;
    }

    const endTime = new Date(attempt.started_at).getTime() + (attempt.quiz.time_limit_minutes * 60 * 1000);

    const updateTimer = () => {
      const distance = Math.floor((endTime - Date.now()) / 1000);

      if (distance <= 0) {
        setTimeLeft(0);
        handleSubmit();
        return;
      }

      setTimeLeft(distance);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [attempt, handleSubmit]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!attempt || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Not Found</h2>
          <button
            onClick={() => navigate('/private/quiz-history')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Quiz History
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen z-90 relative py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{attempt.quiz.title}</h1>
              {timeLeft !== null && (
                <div className={`text-lg font-semibold ${timeLeft < 300 ? 'text-red-600' : 'text-gray-600'}`}>
                  Time Left: {formatTime(timeLeft)}
                </div>
              )}
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-sm text-gray-600">
                Points: {currentQuestionData?.points || 1}
              </span>
            </div>
          </div>

          {currentQuestionData && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">{currentQuestionData.prompt}</h2>

              {(currentQuestionData.type === 'single_choice' || currentQuestionData.type === 'true_false') && (
                <div className="space-y-3">
                  {currentQuestionData.choices?.map((choice) => (
                    <label
                      key={choice.id}
                      className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestionData.id}`}
                        checked={(answers[currentQuestionData.id]?.choice_ids ?? []).includes(choice.id)}
                        onChange={() => handleChoiceChange(currentQuestionData.id, choice.id, false)}
                        className="mr-3"
                      />
                      <span className="text-gray-700">{choice.label}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestionData.type === 'multiple_choice' && (
                <div className="space-y-3">
                  {currentQuestionData.choices?.map((choice) => (
                    <label
                      key={choice.id}
                      className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={(answers[currentQuestionData.id]?.choice_ids ?? []).includes(choice.id)}
                        onChange={() => handleChoiceChange(currentQuestionData.id, choice.id, true)}
                        className="mr-3"
                      />
                      <span className="text-gray-700">{choice.label}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestionData.type === 'short_answer' && (
                <textarea
                  value={answers[currentQuestionData.id]?.text_answer || ''}
                  onChange={(event) => handleTextAnswerChange(currentQuestionData.id, event.target.value)}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Enter your answer..."
                />
              )}
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex flex-wrap gap-2 justify-center">
              {questions.map((question, index) => {
                const isAnswered = Boolean(
                  answers[question.id]?.choice_ids?.length || answers[question.id]?.text_answer?.trim(),
                );

                return (
                  <button
                    key={question.id}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-10 h-10 rounded-full ${currentQuestion === index
                        ? 'bg-blue-500 text-white'
                        : isAnswered
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      } hover:opacity-80`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TakeQuiz;
