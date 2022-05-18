import React, { useContext, useEffect, useState } from "react";
import Message from "../contexts/Message";
import { Link } from "react-router-dom";
import axiosInstance from "../axios";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
	const message = useContext(Message);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [error, setError] = useState({});

	const navigate = useNavigate();

	const fieldValidation = () => {
		if (!email) {
			setError({ email: `Please Enter Email` });
			return true;
		}
		if (!password) {
			setError({ password: `Please Enter Password` });
			return true;
		}
		return false;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (fieldValidation()) return;

		try {
			const res = await axiosInstance.post("token/", {
				email,
				password,
			});
			localStorage.setItem("access_token", res.data.access);
			localStorage.setItem("refresh_token", res.data.refresh);
			axiosInstance.defaults.headers["Authorization"] =
				"JWT " + localStorage.getItem("access_token");
			navigate("/home");
		} catch (err) {
			console.log(err);
			message.type = "danger";
			message.value = err.response.data.detail;
			setError({});
		}
	};

	useEffect(() => () => {
		message.value = "";
		message.type = "success";
	});

	return (
		<form onSubmit={handleSubmit} className="signin-container">
			<h1 className="mb-5">ChatNova</h1>

			{message.value && (
				<p className={`alert alert-${message.type} pt-2 pb-2`}>
					{message.value}
				</p>
			)}
			<h3 className="mb-4">Sign In</h3>

			<div className="input-group flex-nowrap">
				<input
					type="text"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="form-control mt-3"
					placeholder="Email"
					aria-label="email"
					aria-describedby="addon-wrapping"
				/>
			</div>
			{error.email && (
				<div className="alert alert-danger pt-1 pb-1">{error.email}</div>
			)}

			<div className="input-group flex-nowrap">
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="form-control mt-4"
					placeholder="Password"
					aria-describedby="addon-wrapping"
				/>
			</div>

			{error.password && (
				<div className="alert alert-danger mt-3	 pt-1 pb-1">
					{error.password}
				</div>
			)}

			<div className="d-flex justify-content-around flex-wrap mt-3">
				<button type="submit" className="btn submit-btn mt-3 mb-3">
					Sign In
				</button>
			</div>

			<div className="d-flex flex-column align-items-center justify-content-start mt-2">
				<p className="mb-0">Don't have an account?</p>
				<Link to="/signup">Sign Up</Link>
			</div>
		</form>
	);
};

export default SignIn;
