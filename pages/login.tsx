// pages/login.tsx
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Moon, Sun } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  // Initialize dark mode based on user's system preferences
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(isDarkMode);
    }
  }, []);

  // Save dark mode preference to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', String(darkMode));
    }
  }, [darkMode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (result?.ok) {
      // Fetch session details (contains token and user info)
      const sessionResponse = await fetch("/api/auth/session");
      const session = await sessionResponse.json();

      // Save the token from the session into localStorage
      const token = session?.token || session?.user?.id; // Adjust based on your session structure
    if (token) {
      localStorage.setItem("token", token);
    }
      router.push("/dashboard");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className={`min-h-screen w-full ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="w-full max-w-xl mx-auto pt-20">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`mb-4 p-2 rounded-full ${
            darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'
          } float-right`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <form 
          onSubmit={handleLogin} 
          className={`${
            darkMode 
              ? 'bg-gray-800 shadow-lg shadow-gray-700/50' 
              : 'bg-white shadow-lg'
          } rounded px-8 pt-6 pb-8 mb-8`}
        >
          <div className="mb-4">
            <label 
              className={`block ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              } text-sm font-bold mb-2`} 
              htmlFor="email"
            >
              Email
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-200' 
                  : 'bg-white text-gray-700'
              } leading-tight focus:outline-none focus:shadow-outline`}
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label 
              className={`block ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              } text-sm font-bold mb-2`} 
              htmlFor="password"
            >
              Password
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-200' 
                  : 'bg-white text-gray-700'
              } leading-tight focus:outline-none focus:shadow-outline`}
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-800' 
                  : 'bg-blue-500 hover:bg-blue-700'
              } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
            >
              Sign In
            </button>
            <a 
              onClick={() => alert('Yaad kar k aa.....')}
              className={`inline-block align-baseline font-bold text-sm ${
                darkMode 
                  ? 'text-blue-400 hover:text-blue-300' 
                  : 'text-blue-500 hover:text-blue-800'
              }`} 
              href="#"
            >
              Forgot Password?
            </a>
            <button
              type="button"
              onClick={() => router.push("/register")} // Redirect to register page
              className={`${
                darkMode ? "bg-green-600 hover:bg-green-800" : "bg-green-500 hover:bg-green-700"
              } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className={`text-center ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        } text-xs`}>
          &copy;2024 Habit Tracker. All rights reserved.
        </p>
      </div>
    </div>
  );
}