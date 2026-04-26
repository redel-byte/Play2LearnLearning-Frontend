import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button';
import {
  deleteQuiz,
  duplicateQuiz,
  fetchQuizzes,
  publishQuiz,
  shareQuiz,
  unpublishQuiz,
} from '../../api/quiz';
import { getErrorMessage } from '../../api/api';

const formatDate = (value) => {
  if (!value) {
    return 'Not available';
  }

  return new Date(value).toLocaleDateString();
};

const MyQuizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [shareFeatured, setShareFeatured] = useState(false);
  const [sharingQuizId, setSharingQuizId] = useState(null);

  const loadQuizzes = async () => {
    setLoading(true);
    try {
      const response = await fetchQuizzes({ mine_only: true });
      setQuizzes(response.data ?? []);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to load quizzes'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const stats = useMemo(() => ({
    totalQuizzes: quizzes.length,
    published: quizzes.filter((quiz) => quiz.published_at).length,
    drafts: quizzes.filter((quiz) => !quiz.published_at).length,
    totalQuestions: quizzes.reduce((sum, quiz) => sum + (quiz.total_questions || quiz.questions?.length || 0), 0),
  }), [quizzes]);

  const handleEditQuiz = (quizId) => {
    navigate(`/create-quiz?quizId=${quizId}`);
  };

  const handleCreateQuiz = () => {
    navigate('/create-quiz');
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) {
      return;
    }

    setActionId(quizId);
    try {
      await deleteQuiz(quizId);
      toast.success('Quiz deleted successfully');
      await loadQuizzes();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to delete quiz'));
    } finally {
      setActionId(null);
    }
  };

  const handleTogglePublish = async (quiz) => {
    setActionId(quiz.id);
    try {
      if (quiz.published_at) {
        await unpublishQuiz(quiz.id);
        toast.success('Quiz moved back to draft');
      } else {
        await publishQuiz(quiz.id);
        toast.success('Quiz published successfully');
      }
      await loadQuizzes();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update quiz status'));
    } finally {
      setActionId(null);
    }
  };

  const handleDuplicateQuiz = async (quizId) => {
    setActionId(quizId);
    try {
      await duplicateQuiz(quizId);
      toast.success('Quiz duplicated successfully');
      await loadQuizzes();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to duplicate quiz'));
    } finally {
      setActionId(null);
    }
  };

  const handleViewHistory = (quizIdOrQuiz = null) => {
    const quizId = typeof quizIdOrQuiz === 'object' ? quizIdOrQuiz?.id : quizIdOrQuiz;

    if (typeof quizId === 'string' && quizId.length > 0) {
      navigate(`/private/quizzes/${quizId}/results`);
      return;
    }

    navigate('/private/quiz-history');
  };

  const handleShareQuiz = async () => {
    if (!sharingQuizId) {
      return;
    }

    setActionId(sharingQuizId);
    try {
      const response = await shareQuiz(sharingQuizId, { featured: shareFeatured });
      const sharedQuiz = response.quiz?.data ?? response.quiz ?? null;
      const code = sharedQuiz?.access_code;

      if (code) {
        await navigator.clipboard.writeText(code);
        toast.success(`Quiz shared and access code copied: ${code}`);
      } else {
        toast.success('Quiz shared successfully');
      }

      await loadQuizzes();
      setSharingQuizId(null);
      setShareFeatured(false);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to share quiz'));
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen z-90 relative gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Quizzes</h1>
            <p className="text-gray-600 mt-2">Manage, update, publish, and clean up the quizzes you created.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button textContent="View History" variant="secondary" onClick={() => handleViewHistory()} />
            <Button textContent="Create New Quiz" variant="primary" onClick={handleCreateQuiz} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalQuizzes}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Published</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.published}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Drafts</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.drafts}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm font-medium text-gray-600">Questions Built</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.totalQuestions}</p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Quizzes</h2>
          </div>

          {quizzes.length === 0 ? (
            <div className="px-6 py-10 text-center text-gray-500">
              <p className="mb-4">No quizzes yet.</p>
              <Button textContent="Create your first quiz" onClick={handleCreateQuiz} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pass Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quizzes.map((quiz) => (
                    <tr key={quiz.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{quiz.title}</div>
                        <div className="text-sm text-gray-500">Created: {formatDate(quiz.created_at)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {quiz.total_questions || quiz.questions?.length || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {quiz.pass_percentage}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          quiz.published_at ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {quiz.published_at ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {quiz.access_code || 'Private'}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => handleEditQuiz(quiz.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleTogglePublish(quiz)}
                            className="text-green-600 hover:text-green-900"
                            disabled={actionId === quiz.id}
                          >
                            {quiz.published_at ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={() => handleDuplicateQuiz(quiz.id)}
                            className="text-purple-600 hover:text-purple-900"
                            disabled={actionId === quiz.id}
                          >
                            Duplicate
                          </button>
                          <button
                            onClick={() => setSharingQuizId(quiz.id)}
                            className="text-amber-600 hover:text-amber-900"
                            disabled={actionId === quiz.id}
                          >
                            Share
                          </button>
                          {quiz.published_at && (
                            <button
                              onClick={() => handleViewHistory(quiz.id)}
                              className="text-gray-700 hover:text-gray-900"
                            >
                              Results
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteQuiz(quiz.id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={actionId === quiz.id}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {sharingQuizId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-[200]">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Share Quiz</h3>
            <p className="text-sm text-gray-600 mb-4">
              Make this quiz public and optionally mark it as featured.
            </p>

            <label className="flex items-center gap-3 text-sm text-gray-700 mb-6">
              <input
                type="checkbox"
                checked={shareFeatured}
                onChange={(event) => setShareFeatured(event.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Feature this quiz in the public library
            </label>

            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                textContent="Cancel"
                onClick={() => {
                  setSharingQuizId(null);
                  setShareFeatured(false);
                }}
              />
              <Button
                textContent={actionId === sharingQuizId ? 'Sharing...' : 'Share Quiz'}
                onClick={handleShareQuiz}
                loading={actionId === sharingQuizId}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyQuizzes;
