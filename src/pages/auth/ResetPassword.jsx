import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import { resetPassword } from "../../api/auth";
import { useValidation } from "../../hooks/useValidation";
import { restPasswordSchema } from "../../validation/restPassword.shema";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useValidation(restPasswordSchema);

  useEffect(() => {
    const resetToken = searchParams.get('token');
    if (!resetToken) {
      setTokenValid(false);
    } else {
      setToken(resetToken);
    }
  }, [searchParams]);

  const onSubmit = async (data) => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await resetPassword(token, data.email, data.password, data.confirmPassword);

      toast.success(res.message || "Password reset successful!");

      setTimeout(() => {
        navigate('/login');
      }, 200);

    } catch (err) {
      toast.error(err.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center bg-gray-50 justify-center py-12 px-4 sm:px-6 lg:px-8"  >
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-center mb-4">
              Invalid Reset Link
            </h2>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Button
              textContent="Request New Reset Link"
              onClick={() => navigate('/forgot-password')}
              variant="primary"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ position: 'relative', zIndex: 100 }}>
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Reset Password
        </h2>

        <p className="text-gray-600 text-center mb-6">
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            name="email"
            label="Email Address"
            type="email"
            {...register("email")}
            error={errors.email?.message}
            placeholder="Enter your email"
          />
          <Input
            name="password"
            label="New Password"
            type="password"
            {...register("password")}
            error={errors.password?.message}
            placeholder="Enter new password"
          />

          <Input
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
            placeholder="Confirm new password"
          />

          <Button
            textContent="Reset Password"
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          />
        </form>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-blue-500 hover:underline text-sm"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}