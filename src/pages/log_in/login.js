import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./logIn.css";
import MainLogo from "../../assets/Mainlogo.png";

const LoginPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [error, setError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setCompanyId("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedCompanyId = companyId.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !trimmedEmail ||
      !trimmedPassword ||
      (isSignUp && !trimmedCompanyId) ||
      (isSignUp && !trimmedName)
    ) {
      setError("All fields are required.");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isSignUp
        ? "http://localhost/QMS-ASIANAVIS/HRMSBACKEND/HRMSbackend/signup.php"
        : "http://localhost/QMS-ASIANAVIS/HRMSBACKEND/HRMSbackend/login.php";

      const body = isSignUp
        ? {
            name: trimmedName,
            email: trimmedEmail,
            password: trimmedPassword,
            companyId: trimmedCompanyId,
          }
        : {
            email: trimmedEmail,
            password: trimmedPassword,
          };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (result.success) {
        if (isSignUp) {
          alert("Signup successful! Please wait for verification.");
          resetForm();
          setIsSignUp(false); // switch to login after signup success
        } else {
          alert("Login successful! Redirecting...");
          // Optionally save user info here
          navigate("/Homepage");
        }
      } else {
        setError(result.message || "Something went wrong");
      }
    } catch {
      setError("Failed to connect to server.");
    }

    setIsLoading(false);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  return (
    <section className="bg-[url('https://flowbite.s3.amazonaws.com/blocks/marketing-ui/authentication/background.jpg')] bg-no-repeat bg-cover bg-center bg-gray-700 bg-blend-multiply min-h-screen flex items-center justify-center">
      <div className="w-full bg-white rounded-lg shadow sm:max-w-md xl:p-6 dark:bg-gray-800">
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute w-64 h-0 bg-slate-50 opacity-50 blur-3xl rounded-full"></div>
          <img
            className="w-48 h-20 relative"
            src={MainLogo}
            alt="logo"
            draggable={false}
          />
        </div>
        <h1 className="text-center text-gray-900 dark:text-white text-xl md:text-2xl font-bold mb-4">
          {isSignUp ? "Sign up for an account" : "Sign in to your account"}
        </h1>
        {error && (
          <p className="text-red-500 text-center mb-4 text-sm">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignUp && (
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required={isSignUp}
                className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 w-full text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-blue-600 focus:border-blue-600"
              />
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              required
              className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 w-full text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-blue-600 focus:border-blue-600"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 w-full text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-blue-600 focus:border-blue-600"
            />
          </div>
          {isSignUp && (
            <div>
              <label
                htmlFor="companyId"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Company ID
              </label>
              <input
                id="companyId"
                type="text"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                placeholder="Enter your company ID"
                required={isSignUp}
                className="bg-gray-50 border border-gray-300 rounded-lg p-2.5 w-full text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-blue-600 focus:border-blue-600"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={isLoading}
          >
            {isLoading ? "Please wait..." : isSignUp ? "Sign up" : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-500 dark:text-gray-400">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={toggleMode}
            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
