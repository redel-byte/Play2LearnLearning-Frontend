import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faSearch,
  faFilter,
  faClock,
  faUser,
  faArrowRight,
  faGlobe,
  faSignal,
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { fetchQuizzes } from '../../api/quiz';
import { startQuizAttempt } from '../../api/attempts';
import { getErrorMessage } from '../../api/api';
import { getAuthToken } from '../../api/userManagment';

const SORT_OPTIONS = [
  { value: 'created_at:desc', label: 'Newest first' },
  { value: 'created_at:asc', label: 'Oldest first' },
  { value: 'title:asc', label: 'Title A-Z' },
  { value: 'title:desc', label: 'Title Z-A' },
];

const formatDuration = (minutes) => {
  if (!minutes) {
    return 'No limit';
  }

  return `${minutes} min`;
};

const Library = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeOnly, setActiveOnly] = useState(true);
  const [sortValue, setSortValue] = useState(SORT_OPTIONS[0].value);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [startingQuizId, setStartingQuizId] = useState(null);

  const [sortBy, sortOrder] = useMemo(() => sortValue.split(':'), [sortValue]);

  useEffect(() => {
    const loadQuizzes = async () => {
      setLoading(true);
      try {
        const response = await fetchQuizzes({
          page: currentPage,
          per_page: 9,
          search: searchTerm || undefined,
          public_only: true,
          active_only: activeOnly,
          sort_by: sortBy,
          sort_order: sortOrder,
        });

        setQuizzes(response.data ?? []);
        setTotalPages(response.meta?.last_page ?? 1);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load quiz library'));
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, [activeOnly, currentPage, searchTerm, sortBy, sortOrder]);

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchTerm(searchInput.trim());
  };

  const handleStartQuiz = async (quizId) => {
    if (!getAuthToken()) {
      toast.error('Please log in first to start a quiz');
      navigate('/auth/login');
      return;
    }

    setStartingQuizId(quizId);
    try {
      const attempt = await startQuizAttempt(quizId);
      toast.success('Quiz started successfully');
      navigate(`/private/take-quiz/${attempt.id}`);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Unable to start this quiz'));
    } finally {
      setStartingQuizId(null);
    }
  };

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8" style={{ position: 'relative', zIndex: 99 }}>
      <div className="max-w-7xl mx-auto">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Quiz Library</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore public quizzes, search by title, and launch a real attempt from the backend.
          </p>
        </section>

        <section className="mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  placeholder="Search quizzes by title or description..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                textContent={<><FontAwesomeIcon icon={faSearch} /> Search</>}
              />
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faFilter} className="text-gray-500" />
                <span className="font-medium text-gray-700">Sort:</span>
                <select
                  value={sortValue}
                  onChange={(event) => {
                    setSortValue(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={activeOnly}
                  onChange={(event) => {
                    setActiveOnly(event.target.checked);
                    setCurrentPage(1);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Show active quizzes only
              </label>
            </div>
          </div>
        </section>

        <section className="mb-12">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-blue-600" />
            </div>
          ) : quizzes.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center text-gray-500">
              No quizzes found with the current search and filters.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <Card
                  key={quiz.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
                        <FontAwesomeIcon icon={faBook} className="text-blue-600 text-xl" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        quiz.published_at ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {quiz.published_at ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{quiz.title}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {quiz.description || 'No description provided for this quiz yet.'}
                    </p>

                    <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-4">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        {quiz.total_questions || 0} questions
                      </span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        Pass {quiz.pass_percentage}%
                      </span>
                      <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-medium">
                        {quiz.max_attempts} attempt{quiz.max_attempts > 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faClock} className="text-gray-400" />
                        <span>{formatDuration(quiz.time_limit_minutes)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                        <span>{quiz.creator?.full_name || 'Unknown author'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-5">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faGlobe} className="text-gray-400" />
                        <span>{quiz.is_public ? 'Public' : 'Private'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faSignal} className="text-gray-400" />
                        <span>{quiz.average_score}% avg</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleStartQuiz(quiz.id)}
                      loading={startingQuizId === quiz.id}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                      textContent={<><FontAwesomeIcon icon={faArrowRight} /> {startingQuizId === quiz.id ? 'Starting...' : 'Start Quiz'}</>}
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {totalPages > 1 && (
          <section className="flex items-center justify-center gap-4">
            <Button
              variant="secondary"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              textContent="Previous"
            />
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="secondary"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              textContent="Next"
            />
          </section>
        )}
      </div>
    </main>
  );
};

export default Library;
