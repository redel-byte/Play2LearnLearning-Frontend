import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import { getErrorMessage } from '../../api/api';
import { fetchQuiz, getQuizResults } from '../../api/quiz';

const formatDateTime = (value) => {
  if (!value) {
    return '-';
  }

  return new Date(value).toLocaleString();
};

const TeacherQuizResults = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      setLoading(true);

      try {
        const [quizData, resultsData] = await Promise.all([
          fetchQuiz(quizId),
          getQuizResults(quizId),
        ]);

        setQuiz(quizData);
        setAttempts(resultsData.data ?? []);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load student results'));
        navigate('/private/my-quizzes');
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [quizId, navigate]);

  const stats = useMemo(() => {
    const submitted = attempts.filter((attempt) => attempt.submitted_at);
    const scores = submitted
      .map((attempt) => Number(attempt.percentage))
      .filter((percentage) => Number.isFinite(percentage));

    const averageScore = scores.length > 0
      ? scores.reduce((sum, percentage) => sum + percentage, 0) / scores.length
      : 0;

    return {
      totalAttempts: submitted.length,
      averageScore,
      passed: submitted.filter((attempt) => attempt.passed).length,
    };
  }, [attempts]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-90 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Results</h1>
              <p className="text-gray-600 mt-2">{quiz?.title || 'Quiz results'}</p>
            </div>
            <Button
              textContent="Back to My Quizzes"
              variant="secondary"
              onClick={() => navigate('/private/my-quizzes')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">{stats.totalAttempts}</div>
              <div className="text-blue-700">Submitted Attempts</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-900">{stats.averageScore.toFixed(1)}%</div>
              <div className="text-green-700">Average Score</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-900">{stats.passed}</div>
              <div className="text-yellow-700">Passed</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {attempts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No students have submitted this quiz yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attempts.map((attempt) => {
                    const percentage = Number(attempt.percentage ?? 0);

                    return (
                      <tr key={attempt.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {attempt.learner?.full_name || 'Unknown student'}
                          </div>
                          <div className="text-sm text-gray-500">{attempt.learner?.email || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {attempt.score ?? 0}/{attempt.max_score ?? 0} ({percentage.toFixed(1)}%)
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            attempt.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {attempt.passed ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateTime(attempt.submitted_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => navigate(`/private/quiz-results/${attempt.id}`)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Review Answers
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherQuizResults;
