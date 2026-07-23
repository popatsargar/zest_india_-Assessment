import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../layouts/AuthLayout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";

function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const { login, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from ?? "/";

  const validate = () => {
    const nextErrors = {};

    if (!formData.username.trim()) {
      nextErrors.username = "Username is required.";
    }

    if (!formData.password) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    try {
      await login({
        username: formData.username.trim(),
        password: formData.password
      });

      toast.success("Login successful.");
      navigate(redirectPath, { replace: true });
    } catch (error) {
      const message =
        error?.response?.data?.message ??
        error?.response?.data?.title ??
        "Login failed. Please verify your credentials.";
      toast.error(message);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Use your assignment credentials to sign in to the student portal."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          id="username"
          label="Username"
          value={formData.username}
          onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
          error={errors.username}
          autoComplete="username"
        />

        <Input
          id="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
          error={errors.password}
          autoComplete="current-password"
        />

        <Button type="submit" className="w-full" loading={isAuthLoading}>
          Sign In
        </Button>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
