import { useState, useEffect } from "react";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slice/auth";
import type { RootState, AppDispatch } from "../../redux/store/store";

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showpassword, setShowPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
  const users = useSelector((state: RootState) => state.auth.users);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>();

  // const onSubmit = async (data: LoginFormData) => {
  //   setLoading(true);

  //   setTimeout(() => {
  //     const foundUser = users.find(
  //       (u) => u.email === data.email && u.password === data.password,
  //     );

  //     if (foundUser) {
  //       dispatch(
  //         loginSuccess({
  //           user: foundUser,
  //           token: crypto.randomUUID(),
  //         }),
  //       );
  //       navigate("/home", { replace: true });
  //     } else {
  //       setError("password", {
  //         type: "manual",
  //         message: "Invalid email or password",
  //       });
  //     }

  //     setLoading(false);
  //   }, 1500);
  // };

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);

    try {
      const response = await fetch("https://fakestoreapi.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "mor_2314",
          password: "83r5^_",
        }),
      });

      const result = await response.json();

      if (result?.token) {
        const foundUser = users.find(
          (u) => u.email === data.email && u.password === data.password,
        );

        if (!foundUser) {
          setError("password", {
            type: "manual",
            message: "User not registered",
          });
          setLoading(false);
          return;
        }

        dispatch(
          loginSuccess({
            user: foundUser,
            token: result.token,
          }),
        );

        navigate("/home", { replace: true });
      } else {
        setError("password", {
          type: "manual",
          message: "Invalid email or password",
        });
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed. Try again!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuth) navigate("/home", { replace: true });
  }, [isAuth, navigate]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-sky-300 to-red-500 flex items-center justify-center px-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-9 md:p-8">
        <div className="text-center mb-5">
          <h1 className="text-2xl font-bold text-green-600">
            SMT Labs Pvt. Ltd.
          </h1>

          <h2 className="text-xl font-semibold text-gray-800 mt-2">Login</h2>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back! Sign in to continue.
          </p>
        </div>

        <form
          className="space-y-2.5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="relative">
            <Mail className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+$/,
                  message: "Email must include @ symbol",
                },
              })}
              placeholder="Email address"
              className="w-full pl-9 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <p className="text-xs text-red-500 text-left">
            {errors.email?.message}
          </p>

          <div className="relative">
            <Lock className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showpassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
              })}
              placeholder="Password"
              className="w-full pl-9 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showpassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600"
            >
              {showpassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <p className="text-xs text-red-500 mt-1">
            {errors.password?.message}
          </p>

          <div className="flex items-center justify-end text-sm">
            <button type="button" className="text-purple-600 hover:underline">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg text-white font-semibold transition bg-linear-to-r from-indigo-500 to-purple-600 hover:opacity-90"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/registration")}
            className="text-purple-600 font-semibold underline hover:text-purple-700"
          >
            Register
          </button>
        </p>

        <p className="text-center text-xs text-gray-400 mt-6">
          ©2026 SMT Labs Pvt. Ltd. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
