import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  login as authLogin,
  signup as authSignup,
  logout as authLogout,
  getCurrentUser,
  resetPassword as authResetPassword,
  changePassword as authChangePassword,
  initAuthDemo,
} from "../utils/auth";

export default function Login() {
  const [mode, setMode] = useState("login"); // login / signup / reset
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPasswordForChange, setCurrentPasswordForChange] =
    useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadedQuestion, setLoadedQuestion] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    initAuthDemo().then(() => {
      const user = getCurrentUser();
      if (user) {
        setCurrentUser(user.email);
        setIsAdmin(user.role === "admin");
      }
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      const user = await authLogin({ email, password });
      setCurrentUser(user.email);
      const adminFlag = user.role === "admin";
      setIsAdmin(adminFlag);
      setSuccess(`Logged in as ${user.role}.`);

      if (adminFlag) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!securityQuestion || !securityAnswer) {
      setError("Security question and answer required.");
      return;
    }
    setSubmitting(true);
    try {
      await authSignup({
        email,
        password,
        securityQuestion,
        securityAnswer,
        role: "user",
      });
      setSuccess("Account created. You can now log in.");
      setMode("login");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      await authResetPassword({ email, securityAnswer, newPassword });
      setSuccess("Password updated. You can now login.");
      setMode("login");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      if (!currentUser) throw new Error("No user session");
      await authChangePassword({
        email: currentUser,
        currentPassword: currentPasswordForChange,
        newPassword,
      });
      setSuccess("Password changed successfully. Please login again.");
      // log out after change
      authLogout();
      setCurrentUser(null);
      setIsAdmin(false);
      setMode("login");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
      setCurrentPasswordForChange("");
      setNewPassword("");
    }
  };

  const handleLogout = () => {
    authLogout();
    setCurrentUser(null);
    setIsAdmin(false);
    setSuccess("Logged out.");
  };

  const fetchQuestion = () => {
    const stored = JSON.parse(localStorage.getItem("demo_users") || "[]");
    const u = stored.find(
      (u) => u.email === email.trim().toLowerCase()
    );
    if (u) {
      setLoadedQuestion(u.securityQuestion);
      setError(null);
    } else {
      setLoadedQuestion("");
      setError("No account with that email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {currentUser
              ? `Welcome, ${currentUser}`
              : mode === "login"
              ? "Login"
              : mode === "signup"
              ? "Sign Up"
              : mode === "reset"
              ? "Reset Password"
              : "Change Password"}
          </h2>
          {currentUser && (
            <button
              onClick={handleLogout}
              className="text-sm text-purple-600 hover:underline"
            >
              Logout
            </button>
          )}
        </div>

        {error && (
          <div className="mb-3 text-red-700 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-3 text-green-800 bg-green-100 p-2 rounded">
            {success}
          </div>
        )}

        {!currentUser && mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="••••••••"
              />
            </div>
            <div className="flex justify-between items-center text-sm">
              <button
                type="button"
                onClick={() => {
                  setMode("reset");
                  setError(null);
                  setSuccess(null);
                  setLoadedQuestion("");
                }}
                className="text-purple-600 hover:underline"
              >
                Forgot password?
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                  setSuccess(null);
                }}
                className="text-purple-600 hover:underline"
              >
                Create account
              </button>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
            >
              {submitting ? "Logging in..." : "Login"}
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Demo admin: <strong>plainsmotorinnn@gmail.com</strong> /{" "}
              <strong>plainsmotorinnn123</strong>
            </p>
          </form>
        )}

        {!currentUser && mode === "signup" && (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Security Question (for reset)
              </label>
              <input
                type="text"
                required
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="e.g., Your favorite color?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Answer to Security Question
              </label>
              <input
                type="text"
                required
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Your answer"
              />
            </div>
            <div className="text-sm">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setSuccess(null);
                }}
                className="text-purple-600 hover:underline"
              >
                Already have an account?
              </button>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
            >
              {submitting ? "Creating..." : "Sign Up"}
            </button>
          </form>
        )}

        {!currentUser && mode === "reset" && (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 border rounded px-3 py-2"
                  placeholder="you@example.com"
                />
                <button
                  type="button"
                  onClick={fetchQuestion}
                  className="px-3 py-2 bg-gray-100 rounded text-sm"
                >
                  Load question
                </button>
              </div>
            </div>
            {loadedQuestion && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  {loadedQuestion}
                </label>
                <input
                  type="text"
                  required
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Your answer"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">
                New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="••••••••"
              />
            </div>
            <div className="text-sm flex justify-between">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setLoadedQuestion("");
                  setError(null);
                  setSuccess(null);
                }}
                className="text-purple-600 hover:underline"
              >
                Back to login
              </button>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
            >
              {submitting ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {currentUser && (
          <>
            <div className="mt-4 text-sm text-gray-600">
              You are logged in as{" "}
              <strong>
                {currentUser} {isAdmin && "(admin)"}
              </strong>
              .
            </div>

            {/* Change password UI */}
            <div className="mt-6 p-4 border rounded bg-gray-50">
              <h3 className="font-semibold mb-2">Change Password</h3>
              <form onSubmit={handleChangePassword} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPasswordForChange}
                    onChange={(e) =>
                      setCurrentPasswordForChange(e.target.value)
                    }
                    className="w-full border rounded px-3 py-2"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                  {submitting ? "Updating..." : "Change Password"}
                </button>
              </form>
            </div>

            {isAdmin && (
              <div className="mt-4 p-4 border rounded bg-gray-50">
                <h3 className="font-semibold">Admin Dashboard</h3>
                <p className="text-sm">
                  Example admin-only controls go here.
                </p>
              </div>
            )}
          </>
        )}

        <p className="text-xs text-gray-500 mt-4">
          <strong>Note:</strong> All data is stored in the browser. This is
          demo only; do not use for production.
        </p>
      </div>
    </div>
  );
}
