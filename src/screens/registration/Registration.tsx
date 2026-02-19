import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerSuccess } from "../../redux/slice/auth";
import type { RootState, AppDispatch } from "../../redux/store/store";

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
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-sky-300 to-red-500 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="text-center pt-6 px-6 `flex-shrink-0`">
          <h1 className="text-2xl font-bold text-green-600">
            SMT Labs Pvt. Ltd.
          </h1>
          <h2 className="text-xl font-semibold mt-2">Registration</h2>
        </div>

        <div className="flex-1 overflow-y-auto px-6 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <form
            id="registration-form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="py-4 space-y-4"
          >
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  placeholder="First Name"
                  {...register("firstname", {
                    required: "First name is required",
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Only alphabets allowed",
                    },
                  })}
                  className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 placeholder:text-sm placeholder:text-gray-500"
                />
                {errors.firstname && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.firstname.message}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <input
                  placeholder="Last Name"
                  {...register("lastname", {
                    required: "Last name is required",
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Only alphabets allowed",
                    },
                  })}
                  className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 placeholder:text-sm placeholder:text-gray-500"
                />
                {errors.lastname && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.lastname.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+$/,
                      message: "Email must include @ symbol",
                    },
                  })}
                  className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 placeholder:text-sm placeholder:text-gray-500"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <input
                  placeholder="Mobile No"
                  maxLength={10}
                  {...register("mobile", {
                    required: "Mobile is required",
                    pattern: {
                      value: /^\d{10}$/,
                      message: "Enter valid 10 digit number",
                    },
                  })}
                  className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 placeholder:text-sm placeholder:text-gray-500"
                />
                {errors.mobile && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.mobile.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  placeholder="Country"
                  {...register("country", {
                    required: "Country is required",
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Only alphabets allowed",
                    },
                  })}
                  className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 placeholder:text-sm"
                />
                {errors.country && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <input
                  placeholder="State"
                  {...register("state", {
                    required: "State is required",
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Only alphabets allowed",
                    },
                  })}
                  className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 placeholder:text-sm"
                />
                {errors.state && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.state.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  placeholder="City"
                  {...register("city", {
                    required: "City is required",
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Only alphabets allowed",
                    },
                  })}
                  className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 placeholder:text-sm"
                />
                {errors.city && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <input
                  placeholder="Pincode"
                  {...register("pincode", {
                    required: "Pincode is required",
                    pattern: {
                      value: /^\d{6}$/,
                      message: "Enter valid 6 digit pincode",
                    },
                  })}
                  className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 placeholder:text-sm placeholder:text-gray-500"
                />
                {errors.pincode && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.pincode.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <div className="relative">
                  <input
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,10}$/,
                        message:
                          "Password must contain 1 uppercase, 1 number & 1 symbol (6–10 chars)",
                      },
                    })}
                    className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 placeholder:text-sm placeholder:text-gray-500 pr-10"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm password"
                    {...register("confirm", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 placeholder:text-sm placeholder:text-gray-500 pr-10"
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

            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="DD-MM-YYYY"
                  onFocus={(e) => (e.target.type = "date")}
                  // onBlur={(e) => (e.target.type = "text")}
                  {...register("dob", {
                    required: "Date of birth is required",
                  })}
                  className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 placeholder:text-sm placeholder:text-gray-700"
                />
                {errors.dob && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.dob.message}
                  </p>
                )}
              </div>

              <div className="flex-1">
                <div className="relative">
                  <select
                    {...register("gender", {
                      required: "Please select gender",
                    })}
                    className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 text-gray-700 appearance-none"
                    defaultValue=""
                  >
                    <option value="" disabled hidden>
                      Gender
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

            <div className="w-full">
              <div className="relative">
                <textarea
                  placeholder="Description (0-100 characters)"
                  {...register("description", {
                    maxLength: {
                      value: 100,
                      message: "Description cannot exceed 100 characters",
                    },
                  })}
                  rows={4}
                  className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 placeholder:text-sm placeholder:text-gray-500 resize-none"
                />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="`flex-shrink-0` px-2 pb-2 pt-3 bg-white border-t border-gray-100">
          <button
            type="submit"
            form="registration-form"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-semibold transition-opacity ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-linear-to-r from-indigo-500 to-purple-600 hover:opacity-90"
            }`}
          >
            {loading ? "Creating Account..." : "Submit"}
          </button>

          <p className="text-center text-xs text-gray-400 mt-2 mb-1">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-purple-600 font-semibold underline hover:text-purple-700"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Registration;
