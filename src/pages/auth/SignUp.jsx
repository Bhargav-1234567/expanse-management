import React from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { register } from "../../redux/slices/usersSlice";
import useCustomNavigation from "../../hooks/useCustomNavigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const SignUp = () => {
  const dispatch = useDispatch();
  const { navigate } = useCustomNavigation();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    dispatch(register(data));
    alert("Registration successful!");
    navigate("/login");
  };
  return (
    <div className="login-container w-100">
      <form onSubmit={handleSubmit(onSubmit)} className="w-100">
        <div className="go-back-link" onClick={() => navigate("/login")}>
          <FontAwesomeIcon icon={faChevronLeft} /> Go To Login
        </div>

        <div className="form-item">
          <label>Username</label>
          <input
            placeholder="Enter your username"
            {...formRegister("username", { required: "Username is required" })}
            type="text"
          />
          {errors.username && (
            <p className="error-message">{errors.username.message}</p>
          )}
        </div>

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
            {...formRegister("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            type="password"
          />
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" className="btn-filled w-100">
          Register
        </button>
      </form>
    </div>
  );
};

export default SignUp;
