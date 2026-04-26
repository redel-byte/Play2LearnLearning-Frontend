import React, { useEffect, useMemo, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
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
import { useValidation } from '../../hooks/useValidation';
import { quizSchema } from '../../validation/quiz.shema';

const createEmptyQuestion = () => ({
  question: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  explanation: '',
  points: 1,
});

const createDefaultQuizValues = () => ({
  title: '',
  description: '',
  timeLimit: '',
  maxAttempts: 1,
  passPercentage: 60,
  isPublic: true,
  questions: [createEmptyQuestion()],
});

const normalizeQuestion = (question) => {
  const mappedOptions = question.choices?.map((choice) => choice.label) ?? [];
  const options = [...mappedOptions.slice(0, 4)];

  while (options.length < 4) {
    options.push('');
  }

  const correctAnswerIndex = question.choices?.findIndex((choice) => choice.is_correct) ?? 0;

    return {
      question: question.prompt ?? '',
      options,
      correctAnswer: correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
      explanation: question.explanation ?? '',
      points: question.points ?? 1,
    };
};

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const quizId = searchParams.get('quizId');
  const isEditing = Boolean(quizId);

  const defaultValues = useMemo(() => createDefaultQuizValues(), []);
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useValidation(quizSchema, { defaultValues });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const watchedQuestions = watch('questions') ?? defaultValues.questions;
  const isPublic = watch('isPublic');

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
        reset({
          title: quiz.title ?? '',
          description: quiz.description ?? '',
          timeLimit: quiz.time_limit_minutes ?? '',
          maxAttempts: quiz.max_attempts ?? 1,
          passPercentage: quiz.pass_percentage ?? 60,
          isPublic: Boolean(quiz.is_public),
          questions: quiz.questions?.length
            ? quiz.questions.map(normalizeQuestion)
            : [createEmptyQuestion()],
        });
      } catch (error) {
        toast.error(getErrorMessage(error, 'Failed to load quiz'));
        navigate('/private/my-quizzes');
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [navigate, quizId, reset]);

  const stats = useMemo(() => ({
    totalQuestions: watchedQuestions.length,
    totalPoints: watchedQuestions.reduce((sum, question) => sum + Number(question?.points || 0), 0),
  }), [watchedQuestions]);

  const addQuestion = () => {
    append(createEmptyQuestion());
  };

  const removeQuestion = (index) => {
    if (fields.length === 1) {
      return;
    }

    remove(index);
  };

  const duplicateQuestions = () => {
    append(watchedQuestions.map((question) => ({
      ...createEmptyQuestion(),
      ...question,
      options: [...(question?.options ?? ['', '', '', ''])],
    })));
  };

  const buildPayload = (values) => ({
    title: values.title.trim(),
    description: values.description?.trim() || null,
    is_public: values.isPublic,
    time_limit_minutes: values.timeLimit ? Number(values.timeLimit) : null,
    max_attempts: Number(values.maxAttempts),
    pass_percentage: Number(values.passPercentage),
    questions: values.questions.map((question, index) => {
      const sanitizedOptions = question.options
        .map((option, originalIndex) => ({
          label: option.trim(),
          originalIndex,
        }))
        .filter(({ label }) => label);

        return {
          type: 'single_choice',
          prompt: question.question.trim(),
          explanation: question.explanation?.trim() || null,
          points: Number(question.points) || 1,
          position: index + 1,
        choices: sanitizedOptions.map(({ label, originalIndex }, optionIndex) => ({
          label,
          is_correct: originalIndex === Number(question.correctAnswer),
          position: optionIndex + 1,
        })),
      };
    }),
  });

  const saveQuiz = async (values, shouldPublish) => {
    if (!getAuthToken()) {
      toast.error('Please log in first to save your quiz');
      navigate('/auth/login');
      return;
    }

    const setBusy = shouldPublish ? setPublishing : setSavingDraft;
    setBusy(true);

    try {
      const payload = buildPayload(values);
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

  const handleSaveDraft = handleSubmit((values) => saveQuiz(values, false));
  const handlePublish = handleSubmit((values) => saveQuiz(values, true));

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
                    placeholder="Enter an engaging title for your quiz"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('title')}
                  />
                  {errors.title?.message && (
                    <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {errors.title.message}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe what your quiz is about..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    {...register('description')}
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
                      min="1"
                      max="1440"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      {...register('timeLimit')}
                    />
                    {errors.timeLimit?.message && (
                      <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {errors.timeLimit.message}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Attempts</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      {...register('maxAttempts')}
                    />
                    {errors.maxAttempts?.message && (
                      <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {errors.maxAttempts.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pass Percentage</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      {...register('passPercentage')}
                    />
                    {errors.passPercentage?.message && (
                      <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {errors.passPercentage.message}
                      </div>
                    )}
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        {...register('isPublic')}
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
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FontAwesomeIcon icon={faQuestionCircle} className="text-blue-600" />
                Questions ({fields.length})
              </h2>
              {errors.questions?.message && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {errors.questions.message}
                </div>
              )}
            </div>
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
            {fields.map((field, questionIndex) => {
              const questionErrors = errors.questions?.[questionIndex] || {};
              const currentQuestion = watchedQuestions?.[questionIndex] || createEmptyQuestion();

              return (
                <Card key={field.id} className="bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Question {questionIndex + 1}</h3>
                      {fields.length > 1 && (
                        <Button
                          onClick={() => removeQuestion(questionIndex)}
                          className="text-red-500 hover:text-red-700"
                          textContent={<FontAwesomeIcon icon={faTrash} />}
                        />
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Question Text *</label>
                        <textarea
                          rows={2}
                          placeholder="Enter your question here..."
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          {...register(`questions.${questionIndex}.question`)}
                        />
                        {questionErrors.question?.message && (
                          <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {questionErrors.question.message}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          {...register(`questions.${questionIndex}.points`)}
                        />
                        {questionErrors.points?.message && (
                          <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {questionErrors.points.message}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Answer Options *</label>
                        <div className="space-y-2">
                          {currentQuestion.options.map((option, optionIndex) => (
                            <div key={`${field.id}-${optionIndex}`} className="flex items-center gap-3">
                              <input
                                type="radio"
                                value={optionIndex}
                                checked={Number(currentQuestion.correctAnswer ?? 0) === optionIndex}
                                className="w-4 h-4 text-blue-600"
                                {...register(`questions.${questionIndex}.correctAnswer`, { valueAsNumber: true })}
                              />
                              <input
                                type="text"
                                placeholder={`Option ${optionIndex + 1}`}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                {...register(`questions.${questionIndex}.options.${optionIndex}`)}
                              />
                              {Number(currentQuestion.correctAnswer ?? 0) === optionIndex && (
                                <span className="text-green-600 text-sm font-medium">
                                  <FontAwesomeIcon icon={faStar} /> Correct
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                        {(questionErrors.options?.message || questionErrors.correctAnswer?.message) && (
                          <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {questionErrors.options?.message || questionErrors.correctAnswer?.message}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Explanation (Optional)</label>
                        <textarea
                          rows={2}
                          placeholder="Keep notes for later improvements"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          {...register(`questions.${questionIndex}.explanation`)}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
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
            onClick={handleSaveDraft}
            loading={savingDraft}
            textContent={<><FontAwesomeIcon icon={faSave} /> {savingDraft ? 'Saving...' : 'Save as Draft'}</>}
          />
          <Button
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
            onClick={handlePublish}
            loading={publishing}
            textContent={<><FontAwesomeIcon icon={faArrowRight} /> {publishing ? 'Publishing...' : 'Publish Quiz'}</>}
          />
        </section>
      </div>
    </main>
  );
};

export default CreateQuiz;
