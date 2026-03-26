import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Calendar,
  Users,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerSuccess } from "../../redux/slice/auth";
import type { RootState, AppDispatch } from "../../redux/store/store";
import { colors } from "../../assets/constants/color";

interface RegistrationFormData {
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  gender: string;
  password: string;
  confirm: string;
  dob: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  description: string;
}

const Registration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);

  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.auth.users);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegistrationFormData>();

  const password = useWatch({
    control,
    name: "password",
  });

  const onSubmit = (data: RegistrationFormData) => {
    console.log(" Registration Form:>>>>>", data);

    setLoading(true);
    setTimeout(() => {
      const exists = users.find((u) => u.email === data.email);

      if (exists) {
        alert("Email already registered");
        setLoading(false);
        return;
      }

      const { confirm, ...userData } = data;
      dispatch(registerSuccess(userData));
      console.log(" Users After Register>>>>>>:", users);
      setLoading(false);
      navigate("/login", { replace: true });
    }, 1500);
  };

  useEffect(() => {
    if (isAuth) navigate("/home", { replace: true });
  }, [isAuth, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-6"
      style={{
        background: `linear-gradient(135deg, ${colors.primary}15, ${colors.accent}25, ${colors.secondary}15)`,
      }}
    >
      <div className="w-full max-w-2xl">
        {/* Decorative Elements */}
        <div
          className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{
            background: colors.primary,
            transform: "translate(-30%, -30%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{
            background: colors.secondary,
            transform: "translate(30%, 30%)",
          }}
        />

        {/* Registration Card */}
        <div
          className="relative rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm"
          style={{
            background: "rgba(255, 255, 255, 0.98)",
            boxShadow: `0 25px 50px -12px ${colors.dark}40`,
          }}
        >
          {/* Gradient Header */}
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
            <h2 className="text-xl font-semibold text-white mt-2">
              Create Account
            </h2>
            <p className="text-sm text-white/90 mt-1">
              Join us to start shopping
            </p>
          </div>

          {/* Form Container */}
          <div className="flex flex-col max-h-[80vh]">
            <div className="flex-1 overflow-y-auto px-8 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <form
                id="registration-form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="py-6 space-y-4"
              >
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <User
                          className="w-4 h-4"
                          style={{ color: colors.primary }}
                        />
                        First Name
                      </span>
                    </label>
                    <input
                      placeholder="Enter first name"
                      {...register("firstname", {
                        required: "First name is required",
                        pattern: {
                          value: /^[A-Za-z\s]+$/,
                          message: "Only alphabets allowed",
                        },
                      })}
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                      style={
                        {
                          borderColor: errors.firstname ? "#ef4444" : "#e5e7eb",
                          "--ring-color": colors.primary,
                        } as React.CSSProperties
                      }
                    />
                    {errors.firstname && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.firstname.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <User
                          className="w-4 h-4"
                          style={{ color: colors.primary }}
                        />
                        Last Name
                      </span>
                    </label>
                    <input
                      placeholder="Enter last name"
                      {...register("lastname", {
                        required: "Last name is required",
                        pattern: {
                          value: /^[A-Za-z\s]+$/,
                          message: "Only alphabets allowed",
                        },
                      })}
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                      style={
                        {
                          borderColor: errors.lastname ? "#ef4444" : "#e5e7eb",
                          // focusRing: colors.primary,
                          "--ring-color": colors.primary,
                        } as React.CSSProperties
                      }
                    />
                    {errors.lastname && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.lastname.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email & Mobile */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <Mail
                          className="w-4 h-4"
                          style={{ color: colors.primary }}
                        />
                        Email Address
                      </span>
                    </label>
                    <input
                      placeholder="you@example.com"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]/,
                          message: "Enter a valid email address",
                        },
                      })}
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                      style={
                        {
                          borderColor: errors.email ? "#ef4444" : "#e5e7eb",
                          "--ring-color": colors.primary,
                        } as React.CSSProperties
                      }
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <Phone
                          className="w-4 h-4"
                          style={{ color: colors.primary }}
                        />
                        Mobile Number
                      </span>
                    </label>
                    <input
                      placeholder="9876543210"
                      maxLength={10}
                      {...register("mobile", {
                        required: "Mobile is required",
                        pattern: {
                          value: /^\d{10}$/,
                          message: "Enter valid 10 digit number",
                        },
                      })}
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                      style={
                        {
                          borderColor: errors.mobile ? "#ef4444" : "#e5e7eb",
                          "--ring-color": colors.primary,
                        } as React.CSSProperties
                      }
                    />
                    {errors.mobile && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.mobile.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <MapPin
                          className="w-4 h-4"
                          style={{ color: colors.primary }}
                        />
                        Country
                      </span>
                    </label>
                    <input
                      placeholder="Country"
                      {...register("country", {
                        required: "Country is required",
                        pattern: {
                          value: /^[A-Za-z\s]+$/,
                          message: "Only alphabets allowed",
                        },
                      })}
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                      style={
                        {
                          borderColor: errors.country ? "#ef4444" : "#e5e7eb",
                          "--ring-color": colors.primary,
                        } as React.CSSProperties
                      }
                    />
                    {errors.country && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.country.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <MapPin
                          className="w-4 h-4"
                          style={{ color: colors.primary }}
                        />
                        State
                      </span>
                    </label>
                    <input
                      placeholder="State"
                      {...register("state", {
                        required: "State is required",
                        pattern: {
                          value: /^[A-Za-z\s]+$/,
                          message: "Only alphabets allowed",
                        },
                      })}
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                      style={
                        {
                          borderColor: errors.state ? "#ef4444" : "#e5e7eb",
                          "--ring-color": colors.primary,
                        } as React.CSSProperties
                      }
                    />
                    {errors.state && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.state.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <MapPin
                          className="w-4 h-4"
                          style={{ color: colors.primary }}
                        />
                        City
                      </span>
                    </label>
                    <input
                      placeholder="City"
                      {...register("city", {
                        required: "City is required",
                        pattern: {
                          value: /^[A-Za-z\s]+$/,
                          message: "Only alphabets allowed",
                        },
                      })}
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                      style={
                        {
                          borderColor: errors.city ? "#ef4444" : "#e5e7eb",
                          "--ring-color": colors.primary,
                        } as React.CSSProperties
                      }
                    />
                    {errors.city && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <MapPin
                          className="w-4 h-4"
                          style={{ color: colors.primary }}
                        />
                        Pincode
                      </span>
                    </label>
                    <input
                      placeholder="123456"
                      maxLength={6}
                      {...register("pincode", {
                        required: "Pincode is required",
                        pattern: {
                          value: /^\d{6}$/,
                          message: "Enter valid 6 digit pincode",
                        },
                      })}
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                      style={
                        {
                          borderColor: errors.pincode ? "#ef4444" : "#e5e7eb",
                          "--ring-color": colors.primary,
                        } as React.CSSProperties
                      }
                    />
                    {errors.pincode && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.pincode.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <Lock
                          className="w-4 h-4"
                          style={{ color: colors.primary }}
                        />
                        Password
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password"
                        {...register("password", {
                          required: "Password is required",
                          pattern: {
                            value:
                              /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,10}$/,
                            message:
                              "Must contain 1 uppercase, 1 number & 1 symbol (6-10 chars)",
                          },
                        })}
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 pr-10"
                        style={
                          {
                            borderColor: errors.password
                              ? "#ef4444"
                              : "#e5e7eb",
                            "--ring-color": colors.primary,
                          } as React.CSSProperties
                        }
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <Lock
                          className="w-4 h-4"
                          style={{ color: colors.primary }}
                        />
                        Confirm Password
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? "text" : "password"}
                        placeholder="Confirm password"
                        {...register("confirm", {
                          required: "Please confirm your password",
                          validate: (value) =>
                            value === password || "Passwords do not match",
                        })}
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 pr-10"
                        style={
                          {
                            borderColor: errors.confirm ? "#ef4444" : "#e5e7eb",
                            "--ring-color": colors.primary,
                          } as React.CSSProperties
                        }
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowConfirm((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.confirm && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.confirm.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* DOB & Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <Calendar
                          className="w-4 h-4"
                          style={{ color: colors.primary }}
                        />
                        Date of Birth
                      </span>
                    </label>
                    <input
                      type="date"
                      {...register("dob", {
                        required: "Date of birth is required",
                      })}
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
                      style={
                        {
                          borderColor: errors.dob ? "#ef4444" : "#e5e7eb",
                          "--ring-color": colors.primary,
                        } as React.CSSProperties
                      }
                    />
                    {errors.dob && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.dob.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <span className="flex items-center gap-2">
                        <Users
                          className="w-4 h-4"
                          style={{ color: colors.primary }}
                        />
                        Gender
                      </span>
                    </label>
                    <div className="relative">
                      <select
                        {...register("gender", {
                          required: "Please select gender",
                        })}
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 appearance-none"
                        style={
                          {
                            borderColor: errors.gender ? "#ef4444" : "#e5e7eb",
                            "--ring-color": colors.primary,
                          } as React.CSSProperties
                        }
                        defaultValue=""
                      >
                        <option value="" disabled hidden>
                          Select gender
                        </option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                        ▼
                      </div>
                    </div>
                    {errors.gender && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <FileText
                        className="w-4 h-4"
                        style={{ color: colors.primary }}
                      />
                      Description (Optional)
                    </span>
                  </label>
                  <textarea
                    placeholder="Tell us something about yourself (max 100 characters)"
                    {...register("description", {
                      maxLength: {
                        value: 100,
                        message: "Description cannot exceed 100 characters",
                      },
                    })}
                    rows={3}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 resize-none"
                    style={
                      {
                        borderColor: errors.description ? "#ef4444" : "#e5e7eb",
                        "--ring-color": colors.primary,
                      } as React.CSSProperties
                    }
                  />
                  {errors.description && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </form>
            </div>

            {/* Footer */}
            <div
              className="shrink-0 px-8 pb-6 pt-4 bg-white border-t"
              style={{ borderColor: colors.accent + "40" }}
            >
              <button
                type="submit"
                form="registration-form"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                }}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>Create Account</>
                )}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-semibold transition-colors hover:underline"
                  style={{ color: colors.primary }}
                >
                  Sign In
                </button>
              </p>

              <p className="text-center text-xs text-gray-400 mt-4">
                By creating an account, you agree to our Terms of Service and
                Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
