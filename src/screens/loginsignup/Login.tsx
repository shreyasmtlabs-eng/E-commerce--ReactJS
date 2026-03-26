import { useState, useEffect } from "react";
import { Lock, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/slice/auth";
import type { RootState, AppDispatch } from "../../redux/store/store";
import Cookies from "js-cookie";
import { useMutation } from "@tanstack/react-query";
import { colors } from "../../assets/constants/color";

interface LoginFormData {
  email: string;
  password: string;
}

const Login = () => {
  const navigate = useNavigate();
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

  const loginMutation = useMutation<{ token: string }, Error, LoginFormData>({
    mutationFn: async (data) => {
      console.log("React QueryMutation>>>>>>>", data);
      const response = await fetch("https://fakestoreapi.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "mor_2314",
          password: "83r5^_",
        }),
      });

      return response.json();
    },

    onSuccess: (result, variables) => {
      console.log("Login Success Result:", result);
      if (result?.token) {
        Cookies.set("token", result.token, { expires: 1 });

        const foundUser = users.find(
          (u) =>
            u.email === variables.email && u.password === variables.password,
        );

        if (!foundUser) {
          setError("password", {
            type: "manual",
            message: "User not registered. Please sign up first.",
          });
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
    },

    onError: (error) => {
      console.error("Login Error:", error);
      setError("password", {
        type: "manual",
        message: "Login failed. Please try again!",
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    console.log("Form Submitted Data:>>>>", data);
    loginMutation.mutate(data);
  };

  useEffect(() => {
    if (isAuth) navigate("/home", { replace: true });
  }, [isAuth, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        background: `linear-gradient(135deg, ${colors.primary}15, ${colors.accent}25, ${colors.secondary}15)`,
      }}
    >
      <div className="w-full max-w-md">
        <div
          className="absolute top-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{
            background: colors.primary,
            transform: "translate(-30%, -30%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{
            background: colors.secondary,
            transform: "translate(30%, 30%)",
          }}
        />

        <div
          className="relative rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            boxShadow: `0 25px 50px -12px ${colors.dark}40`,
          }}
        >
          <div
            className="px-8 pt-8 pb-6 text-center"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            }}
          >
            <div className="flex justify-center mb-4"></div>
            <h1 className="text-2xl font-bold text-white">
              SMT Labs Pvt. Ltd.
            </h1>
            <h2 className="text-xl font-semibold text-white mt-3">
              Welcome Back
            </h2>
            <p className="text-sm text-white mt-1">
              Sign in to continue to your account
            </p>
          </div>

          <div className="p-8">
            <form
              className="space-y-4"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                    style={{ color: colors.secondary }}
                  />
                  <input
                    {...register("email", {
                      required: "Email is required",
                    })}
                    type="email"
                    placeholder="Email"
                    className="w-full pl-10 pr-3 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                    style={
                      {
                        borderColor: errors.email ? "#ef4444" : "#e5e7eb",
                        "--ring-color": colors.primary,
                      } as React.CSSProperties
                    }
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                    style={{ color: colors.secondary }}
                  />
                  <input
                    type={showpassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                    style={
                      {
                        borderColor: errors.password ? "#ef4444" : "#e5e7eb",
                        "--ring-color": colors.primary,
                      } as React.CSSProperties
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showpassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showpassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot Password */}
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="text-sm transition-colors hover:underline"
                  style={{ color: colors.secondary }}
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full py-3 rounded-xl text-white font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2 group"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                }}
              >
                {loginMutation.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/registration")}
                  className="font-semibold transition-colors hover:underline"
                  style={{ color: colors.primary }}
                >
                  Create an account
                </button>
              </p>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-gray-400 mt-6">
              © 2026 SMT Labs Pvt. Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
