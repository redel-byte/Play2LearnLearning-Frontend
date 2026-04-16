import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getAttempt } from '../../api/attempts';
import { getErrorMessage } from '../../api/api';

const QuizResults = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      try {
        const attemptData = await getAttempt(attemptId);
        setAttempt(attemptData);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load quiz results'));
        navigate('/private/quiz-history');
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [attemptId, navigate]);

  const answersByQuestionId = useMemo(() => (
    (attempt?.answers ?? []).reduce((map, answer) => {
      map[answer.question_id] = answer;
      return map;
    }, {})
  ), [attempt]);

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Results Not Found</h2>
          <button
            onClick={() => navigate('/private/quiz-history')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to History
          </button>
        </div>
      </div>
    );
  }

  const percentage = Number(attempt.percentage ?? 0);
  const answeredCount = attempt.answers?.length ?? 0;
  const questions = attempt.quiz?.questions ?? [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Quiz Results</h1>
            <button
              onClick={() => navigate('/private/quiz-history')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Back to History
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(percentage)}`}>{percentage.toFixed(1)}%</div>
              <div className="text-gray-600 mt-2">Score</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">
                {attempt.score ?? 0}/{attempt.max_score ?? 0}
              </div>
              <div className="text-gray-600 mt-2">Points</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">{getGrade(percentage)}</div>
              <div className="text-gray-600 mt-2">Grade</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">{answeredCount}</div>
              <div className="text-gray-600 mt-2">Questions Answered</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-2">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Started</div>
              <div className="font-semibold">{attempt.started_at ? new Date(attempt.started_at).toLocaleString() : '-'}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Completed</div>
              <div className="font-semibold">{attempt.submitted_at ? new Date(attempt.submitted_at).toLocaleString() : 'Not completed'}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Question Review</h2>

          <div className="space-y-6">
            {questions.map((question, index) => {
              const answer = answersByQuestionId[question.id];
              const selectedChoiceIds = answer?.selected_choices?.map((choice) => choice.id) ?? [];
              const correctChoiceIds = question.choices?.filter((choice) => choice.is_correct).map((choice) => choice.id) ?? [];
              const wasAnswered = selectedChoiceIds.length > 0 || Boolean(answer?.text_answer);

              return (
                <div key={question.id} className="border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Question {index + 1}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{question.points || 1} points</span>
                      {wasAnswered && typeof answer?.is_correct === 'boolean' && (
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          answer.is_correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {answer.is_correct ? 'Correct' : 'Incorrect'}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700">{question.prompt}</p>
                  </div>

                  {question.type !== 'short_answer' ? (
                    <div className="space-y-2 mb-4">
                      {question.choices?.map((choice) => {
                        const isCorrect = correctChoiceIds.includes(choice.id);
                        const isSelected = selectedChoiceIds.includes(choice.id);

                        return (
                          <div
                            key={choice.id}
                            className={`p-3 rounded border ${
                              isCorrect
                                ? 'bg-green-50 border-green-300'
                                : isSelected
                                  ? 'bg-red-50 border-red-300'
                                  : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center">
                              {isCorrect && <span className="text-green-600 mr-2">✓</span>}
                              {isSelected && !isCorrect && <span className="text-red-600 mr-2">✗</span>}
                              <span className={isSelected ? 'font-medium' : ''}>{choice.label}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-4 mb-4">
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Your Answer:</div>
                        <div className="p-3 bg-gray-50 border rounded">
                          {answer?.text_answer || <span className="text-gray-500 italic">Not answered</span>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
