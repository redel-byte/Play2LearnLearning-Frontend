import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../ui/Input";
import Button from "../ui/Button";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remeberMe, setRemeberMe] = useState(false)
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/login', {
        email: email,
        password: password
      });
      if (remeberMe) {
        localStorage.setItem('user', JSON.stringify(res.data))
      }
      sessionStorage.setItem('user', JSON.stringify(res.data))
      toast.success(res.data.message);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md z-99">
      <h2 className="text-2xl font-bold text-center mb-6">
        Login
      </h2>

      {/* Message Display */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${messageType === "error" ? "bg-red-100 text-red-700 border border-red-200" : "bg-green-100 text-green-700 border border-green-200"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input name="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        {/* Password */}

        <Input name="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        {/* Remember + Forgot */}
        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={remeberMe} onChange={(e) => { setRemeberMe(e.target.checked) }} className="accent-blue-500" />
            Remember me
          </label>

          <a href="#" className="text-blue-500 hover:underline">
            Forgot password?
          </a>
        </div>

        {/* Button */}
        <Button
          textContent="Sign In"
          type="submit"
          variant="primary"
          loading={loading}
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