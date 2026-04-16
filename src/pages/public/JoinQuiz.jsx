import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faTrophy } from '@fortawesome/free-solid-svg-icons';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { joinQuizByCode, startQuizAttempt } from '../../api/attempts';
import { getErrorMessage } from '../../api/api';
import { getAuthToken } from '../../api/userManagment';
import { useValidation } from '../../hooks/useValidation';
import { joinQuizSchema } from '../../validation/joinQuiz.shema';

const JoinQuiz = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useValidation(joinQuizSchema, {
    defaultValues: {
      code: '',
    },
  });

  const codeRegistration = register('code');

  const handleJoinQuiz = async ({ code }) => {
    if (loading) {
      return;
    }

    if (!getAuthToken()) {
      toast.error('Please log in first to join a quiz');
      navigate('/auth/login');
      return;
    }

    setLoading(true);
    try {
      const joined = await joinQuizByCode(code);
      const quizId = joined?.quiz?.id;
      const sessionId = joined?.session?.id;

      if (!quizId) {
        throw new Error('Quiz not found for this code');
      }

      const attempt = await startQuizAttempt(
        quizId,
        sessionId ? { quiz_session_id: sessionId } : {},
      );

      toast.success('Quiz joined successfully');
      navigate(`/private/take-quiz/${attempt.id}`);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to join quiz'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="py-12 px-4 sm:px-6 lg:px-8" style={{ position: 'relative', zIndex: 99 }}>
      <div className="max-w-4xl mx-auto">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Join a Quiz</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter a quiz code from the backend and we will start your attempt immediately.
          </p>
        </section>

        <section className="mb-10">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="p-8 text-center">
              <FontAwesomeIcon icon={faGamepad} className="text-5xl mb-4" />
              <h2 className="text-2xl font-bold mb-4">Quick Join</h2>
              <p className="mb-6">Paste the access code from a public quiz or session.</p>

              <form onSubmit={handleSubmit(handleJoinQuiz)} className="max-w-md mx-auto">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter quiz code"
                    aria-invalid={Boolean(errors.code)}
                    className="flex-1 px-4 py-3 rounded-lg border-0 text-gray-900 focus:outline-none"
                    {...codeRegistration}
                    onChange={(event) => {
                      event.target.value = event.target.value.toUpperCase();
                      codeRegistration.onChange(event);
                    }}
                  />
                  <Button
                    textContent={loading ? 'Joining...' : 'Join'}
                    variant="success"
                    type="submit"
                    loading={loading}
                  />
                </div>

                {errors.code?.message && (
                  <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-left text-sm text-red-700">
                    {errors.code.message}
                  </div>
                )}
              </form>
            </div>
          </Card>
        </section>

        <section className="text-center">
          <Card className="bg-gradient-to-r from-amber-100 to-orange-100 border-0">
            <div className="p-8">
              <FontAwesomeIcon icon={faTrophy} className="text-4xl text-orange-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Want to host your own quiz?</h3>
              <p className="text-gray-600 mb-6">Create one from the quiz builder and share its access code.</p>
              <Button
                textContent="Create a Quiz"
                onClick={() => navigate('/create-quiz')}
                className="bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition font-medium"
              />
            </div>
          </Card>
        </section>
      </div>
    </main>
  );
};

export default JoinQuiz;
