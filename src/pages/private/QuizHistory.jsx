import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getMyAttemptHistory, startQuizAttempt } from '../../api/attempts';
import { getErrorMessage } from '../../api/api';

const QuizHistory = () => {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadAttempts = async () => {
      setLoading(true);
      try {
        const response = await getMyAttemptHistory({ page: currentPage });
        setAttempts(response.data ?? []);
        setTotalPages(response.meta?.last_page ?? 1);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load quiz history'));
      } finally {
        setLoading(false);
      }
    };

    loadAttempts();
  }, [currentPage]);

  const filteredAttempts = useMemo(() => attempts.filter((attempt) => {
    if (filter === 'completed') {
      return Boolean(attempt.submitted_at);
    }

    if (filter === 'in_progress') {
      return !attempt.submitted_at;
    }

    return true;
  }), [attempts, filter]);

  const averageScore = useMemo(() => {
    const completed = attempts.filter((attempt) => typeof attempt.percentage === 'number');

    if (completed.length === 0) {
      return 0;
    }

    return completed.reduce((sum, attempt) => sum + attempt.percentage, 0) / completed.length;
  }, [attempts]);

  const handleRetakeQuiz = async (quizId) => {
    try {
      const attempt = await startQuizAttempt(quizId);
      toast.success('New attempt started');
      navigate(`/private/take-quiz/${attempt.id}`);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to start a new attempt'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen z-90 relative py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Quiz History</h1>
            <button
              onClick={() => navigate('/private/my-quizzes')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Back to My Quizzes
            </button>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              All ({attempts.length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Completed ({attempts.filter((attempt) => attempt.submitted_at).length})
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-4 py-2 rounded-lg ${filter === 'in_progress' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              In Progress ({attempts.filter((attempt) => !attempt.submitted_at).length})
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">{attempts.length}</div>
              <div className="text-blue-700">Total Attempts</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-900">{averageScore.toFixed(1)}%</div>
              <div className="text-green-700">Average Score</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-900">{attempts.filter((attempt) => !attempt.submitted_at).length}</div>
              <div className="text-yellow-700">In Progress</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredAttempts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No quiz attempts found for this filter.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Started</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAttempts.map((attempt) => (
                    <tr key={attempt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{attempt.quiz?.title || 'Untitled quiz'}</div>
                        <div className="text-sm text-gray-500">
                          {attempt.quiz?.total_questions || attempt.quiz?.questions?.length || 0} questions
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          attempt.submitted_at ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {attempt.submitted_at ? 'Completed' : 'In Progress'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {typeof attempt.percentage === 'number' ? `${attempt.percentage}%` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {attempt.started_at ? new Date(attempt.started_at).toLocaleString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {attempt.submitted_at ? new Date(attempt.submitted_at).toLocaleString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-3">
                          {attempt.submitted_at ? (
                            <button
                              onClick={() => navigate(`/private/quiz-results/${attempt.id}`)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View Results
                            </button>
                          ) : (
                            <button
                              onClick={() => navigate(`/private/take-quiz/${attempt.id}`)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Continue
                            </button>
                          )}
                          {attempt.quiz_id && (
                            <button
                              onClick={() => handleRetakeQuiz(attempt.quiz_id)}
                              className="text-gray-700 hover:text-gray-900"
                            >
                              Retake
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 mt-6 rounded-lg">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <p className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </p>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizHistory;
