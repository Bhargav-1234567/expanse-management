import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { login } from "../../redux/slices/usersSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.users.currentUser);
  const navigate = useNavigate();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser]);
  const onSubmit = (data) => {
    dispatch(login(data));
  };
  return (
    <div className="login-container w-100">
      <form onSubmit={handleSubmit(onSubmit)} className="w-100">
        <div className="form-item">
          <label>Email</label>
          <input
            placeholder="Enter your email"
            {...formRegister("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
            type="email"
          />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
        </div>

        <div className="form-item">
          <label>Password</label>
          <input
            placeholder="Enter your password"
            {...formRegister("password", { required: "Password is required" })}
            type="password"
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" className="btn-bordered w-100 form-item">
          Login
        </button>
        <button
          type="button"
          className="btn-filled w-100"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Login;
