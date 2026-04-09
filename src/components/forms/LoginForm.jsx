import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../ui/Input";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { login } from "../../api/auth";
import { useValidation } from "../../hooks/useValidation";
import { loginSchema } from "../../validation/login.shema";


export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useValidation(loginSchema);
  const [remeberMe, setRemeberMe] = useState(false)
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await login(data.email, data.password)
      if (remeberMe) {
        localStorage.setItem('user', JSON.stringify(res))
      }
      sessionStorage.setItem('user', JSON.stringify(res))
      toast.success(res.message);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md z-99">
      <h2 className="text-2xl font-bold text-center mb-6">
        Login
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          name="email"
          label="Email"
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />

        {/* Password */}
        <Input
          name="password"
          label="Password"
          type="password"
          {...register("password")}
          error={errors.password?.message}
        />

        {/* Remember + Forgot */}
        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={remeberMe} onChange={(e) => { setRemeberMe(e.target.checked) }} className="accent-blue-500" />
            Remember me
          </label>

          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-blue-500 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {/* Button */}
        <Button
          textContent="Sign In"
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
        />
      </form>

      {/* Register */}
      <p className="text-sm text-center mt-4">
        Don't have an account?{" "}
        <a href="/register" className="text-blue-500 hover:underline">
          Register
        </a>
      </p>
    </div>
  );
}