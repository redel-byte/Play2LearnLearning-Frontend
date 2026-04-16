import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faBook,
  faClock,
  faCopy,
  faEye,
  faPlus,
  faQuestionCircle,
  faSave,
  faStar,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { createQuiz, fetchQuiz, publishQuiz, updateQuiz } from '../../api/quiz';
import { getErrorMessage } from '../../api/api';
import { getAuthToken } from '../../api/userManagment';

const createEmptyQuestion = (id) => ({
  id,
  question: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  explanation: '',
  points: 1,
});

const normalizeQuestion = (question, index) => ({
  id: question.id ?? index + 1,
  question: question.prompt ?? '',
  options: question.choices?.map((choice) => choice.label) ?? ['', '', '', ''],
  correctAnswer: Math.max(
    0,
    question.choices?.findIndex((choice) => choice.is_correct) ?? 0,
  ),
  explanation: '',
  points: question.points ?? 1,
});

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const quizId = searchParams.get('quizId');
  const isEditing = Boolean(quizId);

  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [passPercentage, setPassPercentage] = useState(60);
  const [isPublic, setIsPublic] = useState(true);
  const [questions, setQuestions] = useState([createEmptyQuestion(1)]);
  const [loading, setLoading] = useState(isEditing);
  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (!quizId) {
      return;
    }

    const loadQuiz = async () => {
      setLoading(true);
      try {
        const quiz = await fetchQuiz(quizId);
        setQuizTitle(quiz.title ?? '');
        setQuizDescription(quiz.description ?? '');
        setTimeLimit(quiz.time_limit_minutes ?? '');
        setMaxAttempts(quiz.max_attempts ?? 1);
        setPassPercentage(quiz.pass_percentage ?? 60);
        setIsPublic(Boolean(quiz.is_public));
        setQuestions(
          quiz.questions?.length
            ? quiz.questions.map(normalizeQuestion)
            : [createEmptyQuestion(1)],
        );
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load quiz'));
        navigate('/private/my-quizzes');
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId, navigate]);

  const stats = useMemo(() => ({
    totalQuestions: questions.length,
    totalPoints: questions.reduce((sum, question) => sum + Number(question.points || 0), 0),
  }), [questions]);

  const addQuestion = () => {
    setQuestions((current) => [...current, createEmptyQuestion(current.length + 1)]);
  };

  const removeQuestion = (id) => {
    if (questions.length === 1) {
      return;
    }

    setQuestions((current) => current.filter((question) => question.id !== id));
  };

  const updateQuestion = (id, field, value) => {
    setQuestions((current) => current.map((question) => (
      question.id === id ? { ...question, [field]: value } : question
    )));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions((current) => current.map((question) => (
      question.id === questionId
        ? {
          ...question,
          options: question.options.map((option, index) => (index === optionIndex ? value : option)),
        }
        : question
    )));
  };

  const duplicateQuestions = () => {
    setQuestions((current) => [
      ...current,
      ...current.map((question, index) => ({
        ...question,
        id: current.length + index + 1,
      })),
    ]);
  };

  const validateForm = () => {
    if (!getAuthToken()) {
      toast.error('Please log in first to save your quiz');
      navigate('/auth/login');
      return false;
    }

    if (quizTitle.trim().length < 3) {
      toast.error('Quiz title must be at least 3 characters');
      return false;
    }

    for (const [index, question] of questions.entries()) {
      if (question.question.trim().length < 3) {
        toast.error(`Question ${index + 1} needs a prompt`);
        return false;
      }

      const filledOptions = question.options.filter((option) => option.trim());
      if (filledOptions.length < 2) {
        toast.error(`Question ${index + 1} needs at least 2 answer choices`);
        return false;
      }

      if (!filledOptions[question.correctAnswer]) {
        toast.error(`Question ${index + 1} needs a valid correct answer`);
        return false;
      }
    }

    return true;
  };

  const buildPayload = () => ({
    title: quizTitle.trim(),
    description: quizDescription.trim() || null,
    is_public: isPublic,
    time_limit_minutes: timeLimit ? Number(timeLimit) : null,
    max_attempts: Number(maxAttempts),
    pass_percentage: Number(passPercentage),
    questions: questions.map((question, index) => {
      const sanitizedOptions = question.options
        .map((option) => option.trim())
        .filter(Boolean);

      return {
        type: 'single_choice',
        prompt: question.question.trim(),
        points: Number(question.points) || 1,
        position: index + 1,
        choices: sanitizedOptions.map((option, optionIndex) => ({
          label: option,
          is_correct: optionIndex === question.correctAnswer,
          position: optionIndex + 1,
        })),
      };
    }),
  });

  const saveQuiz = async (shouldPublish) => {
    if (!validateForm()) {
      return;
    }

    const setBusy = shouldPublish ? setPublishing : setSavingDraft;
    setBusy(true);

    try {
      const payload = buildPayload();
      const quiz = isEditing
        ? await updateQuiz(quizId, payload)
        : await createQuiz(payload);

      if (shouldPublish) {
        await publishQuiz(quiz.id);
      }

      toast.success(shouldPublish ? 'Quiz published successfully' : 'Quiz saved successfully');
      navigate('/private/my-quizzes');
    } catch (error) {
      toast.error(getErrorMessage(error, shouldPublish ? 'Failed to publish quiz' : 'Failed to save quiz'));
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8" style={{ position: 'relative', zIndex: 99 }}>
      <div className="max-w-4xl mx-auto">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {isEditing ? 'Edit Your Quiz' : 'Create Your Quiz'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Build your quiz, save it as a draft, and publish it when it is ready for players.
          </p>
        </section>

        <section className="mb-6 grid sm:grid-cols-3 gap-4">
          <Card className="bg-white border border-gray-100 rounded-2xl shadow-sm">
            <div className="p-5">
              <div className="text-sm text-gray-500">Questions</div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalQuestions}</div>
            </div>
          </Card>
          <Card className="bg-white border border-gray-100 rounded-2xl shadow-sm">
            <div className="p-5">
              <div className="text-sm text-gray-500">Total points</div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalPoints}</div>
            </div>
          </Card>
          <Card className="bg-white border border-gray-100 rounded-2xl shadow-sm">
            <div className="p-5">
              <div className="text-sm text-gray-500">Mode</div>
              <div className="text-2xl font-bold text-gray-900">{isPublic ? 'Public' : 'Private'}</div>
            </div>
          </Card>
        </section>

        <section className="mb-10">
          <Card className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FontAwesomeIcon icon={faBook} className="text-blue-600" />
                Quiz Settings
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title *</label>
                  <input
                    type="text"
                    value={quizTitle}
                    onChange={(event) => setQuizTitle(event.target.value)}
                    placeholder="Enter an engaging title for your quiz"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={quizDescription}
                    onChange={(event) => setQuizDescription(event.target.value)}
                    placeholder="Describe what your quiz is about..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FontAwesomeIcon icon={faClock} className="mr-2" />
                      Time Limit (minutes)
                    </label>
                    <input
                      type="number"
                      value={timeLimit}
                      onChange={(event) => setTimeLimit(event.target.value)}
                      min="1"
                      max="1440"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Attempts</label>
                    <input
                      type="number"
                      value={maxAttempts}
                      onChange={(event) => setMaxAttempts(event.target.value)}
                      min="1"
                      max="20"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pass Percentage</label>
                    <input
                      type="number"
                      value={passPercentage}
                      onChange={(event) => setPassPercentage(event.target.value)}
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(event) => setIsPublic(event.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      Make quiz public for learners
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faQuestionCircle} className="text-blue-600" />
              Questions ({questions.length})
            </h2>
            <div className="flex gap-3">
              <Button
                onClick={duplicateQuestions}
                className="bg-gray-400 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600"
                textContent={<><FontAwesomeIcon icon={faCopy} /> Duplicate All</>}
              />
              <Button
                onClick={addQuestion}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                textContent={<><FontAwesomeIcon icon={faPlus} /> Add Question</>}
              />
            </div>
          </div>

          <div className="space-y-6">
            {questions.map((question, questionIndex) => (
              <Card key={question.id} className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Question {questionIndex + 1}</h3>
                    {questions.length > 1 && (
                      <Button
                        onClick={() => removeQuestion(question.id)}
                        className="text-red-500 hover:text-red-700"
                        textContent={<FontAwesomeIcon icon={faTrash} />}
                      />
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Question Text *</label>
                      <textarea
                        value={question.question}
                        onChange={(event) => updateQuestion(question.id, 'question', event.target.value)}
                        placeholder="Enter your question here..."
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                      <input
                        type="number"
                        value={question.points}
                        min="1"
                        max="100"
                        onChange={(event) => updateQuestion(question.id, 'points', event.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Answer Options *</label>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center gap-3">
                            <input
                              type="radio"
                              name={`correct-${question.id}`}
                              checked={Number(question.correctAnswer) === optionIndex}
                              onChange={() => updateQuestion(question.id, 'correctAnswer', optionIndex)}
                              className="w-4 h-4 text-blue-600"
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(event) => updateOption(question.id, optionIndex, event.target.value)}
                              placeholder={`Option ${optionIndex + 1}`}
                              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {Number(question.correctAnswer) === optionIndex && (
                              <span className="text-green-600 text-sm font-medium">
                                <FontAwesomeIcon icon={faStar} /> Correct
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Explanation (Optional)</label>
                      <textarea
                        value={question.explanation}
                        onChange={(event) => updateQuestion(question.id, 'explanation', event.target.value)}
                        placeholder="Keep notes for later improvements"
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="flex flex-col md:flex-row gap-4">
          <Button
            className="bg-gray-400 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-600 transition flex items-center justify-center gap-2"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            textContent={<><FontAwesomeIcon icon={faEye} /> Review Quiz</>}
          />
          <Button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
            onClick={() => saveQuiz(false)}
            loading={savingDraft}
            textContent={<><FontAwesomeIcon icon={faSave} /> {savingDraft ? 'Saving...' : 'Save as Draft'}</>}
          />
          <Button
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
            onClick={() => saveQuiz(true)}
            loading={publishing}
            textContent={<><FontAwesomeIcon icon={faArrowRight} /> {publishing ? 'Publishing...' : 'Publish Quiz'}</>}
          />
        </section>
      </div>
    </main>
  );
};

export default CreateQuiz;
