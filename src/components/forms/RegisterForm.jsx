import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthRegister } from "../../api/auth";
import { registerShema } from "../../validation/register.shema";
import { useValidation } from "../../hooks/useValidation";
import { clearStoredUser, setStoredUser } from "../../api/userManagment";

export default function RegisterForm() {
    const [remeberMe, setRemeberMe] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const { register, handleSubmit, watch, formState: { errors } } = useValidation(registerShema);
    const selectedRole = watch("role", "learner");

    const onSubmit = async (data) => {
        if (loading) return;
        setLoading(true);
    try {
        const res = await AuthRegister(
            data.firstName,
                data.lastName,
                data.email,
            data.password,
            data.role,
        )
            clearStoredUser();

            if (remeberMe) {
                localStorage.setItem('user', JSON.stringify(res))
            } else {
                sessionStorage.setItem('user', JSON.stringify(res))
            }
            setStoredUser(res);
            toast.success(res.message);
            navigate('/');
        } catch (err) {
            toast.error(err?.message || "Register failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md z-99">
            <h2 className="text-2xl font-bold text-center mb-6">
                Register
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input name="firstName" label="First Name" type="text" {...register("firstName")} error={errors.firstName?.message} />

                <Input name="Lastname" label="Last Name" type="text" {...register("lastName")} error={errors.lastName?.message} />

                <Input name="email" label="Email" type="email" {...register("email")} error={errors.email?.message} />

                <Input name="password" label="Password" type="password" {...register("password")} error={errors.password?.message} />

                <div className="mb-4">
                    <p className="block text-sm font-medium mb-2 text-blue-700">Role</p>
                    <div className="grid grid-cols-2 gap-3">
                        <label
                            className={`border rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                                selectedRole === "learner"
                                    ? "border-blue-600 bg-blue-50"
                                    : "border-blue-200 bg-white"
                            }`}
                        >
                            <input
                                type="radio"
                                value="learner"
                                className="sr-only"
                                defaultChecked
                                {...register("role")}
                            />
                            <span className="block font-semibold text-slate-800">Student</span>
                            <span className="block text-sm text-slate-500">Join quizzes and track your progress.</span>
                        </label>

                        <label
                            className={`border rounded-xl px-4 py-3 cursor-pointer transition-colors ${
                                selectedRole === "teacher"
                                    ? "border-blue-600 bg-blue-50"
                                    : "border-blue-200 bg-white"
                            }`}
                        >
                            <input
                                type="radio"
                                value="teacher"
                                className="sr-only"
                                {...register("role")}
                            />
                            <span className="block font-semibold text-slate-800">Teacher</span>
                            <span className="block text-sm text-slate-500">Create, publish, and manage quizzes.</span>
                        </label>
                    </div>
                    {errors.role?.message && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-2 py-1 mt-2">
                            {errors.role.message}
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center text-sm">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" checked={remeberMe} onChange={(e) => { setRemeberMe(e.target.checked) }} className="accent-blue-500" />
                        Remember me
                    </label>

                    <button
                        type="button"
                        onClick={() => navigate('/auth/forgot-password')}
                        className="text-blue-500 hover:underline"
                    >
                        Forgot password?
                    </button>
                </div>

                <Button
                    textContent="Register now"
                    type="submit"
                    variant="primary"
                    loading={loading}
                />
            </form>

            <p className="text-sm text-center mt-4">
                You have an account?{" "}
                <Link to="/auth/login" className="text-blue-500 hover:underline">
                    Login
                </Link>
            </p>
        </div>
    );
}

