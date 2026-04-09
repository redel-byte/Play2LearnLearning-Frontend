import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import { forgotPassword } from "../../api/auth";
import { useValidation } from "../../hooks/useValidation";
import { forgotPasswordSchema } from "../../validation/forgotPassword.shema";

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useValidation(forgotPasswordSchema);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await forgotPassword(data.email);

      toast.success(res.message || "Password reset link sent!");
    } catch (err) {
      toast.error(err.error || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  py-12 px-4 sm:px-6 lg:px-8" style={{ position: 'relative', zIndex: 100 }}>
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Forgot Password
        </h2>

        <p className="text-gray-600 text-center mb-6">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            name="email"
            label="Email Address"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder="Enter your email"
          />

          <Button
            textContent="Send Reset Link"
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