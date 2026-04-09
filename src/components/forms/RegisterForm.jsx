import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthRegister } from "../../api/auth";
import { registerShema } from "../../validation/register.shema";
import { useValidation } from "../../hooks/useValidation";

export default function RegisterForm() {
    const [remeberMe, setRemeberMe] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useValidation(registerShema);
    const onSubmit = async (data) => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await AuthRegister(data.firstName, data.lastName, data.email, data.password)
            if (remeberMe) {
                localStorage.setItem('user', JSON.stringify(res))
            }
            sessionStorage.setItem('user', JSON.stringify(res))
            toast.success(res.message);
            navigate('/');
        } catch (err) {
            toast.error(err.response?.message || "Register failed");
            console.error('Registration error:', err.response || err.message);
            if (err.response?.status === 500) {
                toast.error(err.response);
            }
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
                {/* First Name */}
                <Input name="firstName" label="First Name" type="text" {...register("firstName")} error={errors.firstName?.message} />

                {/* Last Name */}
                <Input name="Lastname" label="Last Name" type="text" {...register("lastName")} error={errors.lastName?.message} />

                {/* Email */}
                <Input name="email" label="Email" type="email" {...register("email")} error={errors.email?.message} />

                {/* Password */}
                <Input name="password" label="Password" type="password" {...register("password")} error={errors.password?.message} />

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
                    textContent="Register now"
                    type="submit"
                    variant="primary"
                    loading={loading}
                />
            </form>

            {/* Register */}
            <p className="text-sm text-center mt-4">
                You have an account?{" "}
                <a href="/login" className="text-blue-500 hover:underline">
                    Login
                </a>
            </p>
        </div>
    );
}