import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { GrLinkNext } from "react-icons/gr";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Message from "../contexts/Message";
import axiosInstance from "../api";

const SignUp = () => {
	const message = useContext(Message);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [dob, setDob] = useState({
		date: "",
		month: "",
		year: "",
	});
	const [password1, setPassword1] = useState("");
	const [password2, setPassword2] = useState("");

	const [error, setError] = useState({});
	const [page, setPage] = useState(1);

	const navigate = useNavigate();

	const fieldValidation = () => {
		if (!name) {
			setPage(1);
			setError({ name: `Name can not be empty` });
			return false;
		}
		if (!email) {
			setPage(1);
			setError({ email: `Email can not be empty` });
			return false;
		}
		if (!dob.date || !dob.month || !dob.year) {
			setPage(1);
			setError({ dob: `Invalid date of birth` });
			return false;
		}
		if (!password1 || !password2) {
			setError({ password: `Password can not be empty` });
			return false;
		}

		if (password1 !== password2) {
			return setError({ password: `Password didn't match` });
		}
		return true;
	};

	const serverValidationError = (data) => {
		const err = {};

		if (data.name) {
			err.name = data.name[0];
			setPage(1);
		}
		if (data.user) {
			if (data.user.email) {
				err.email = data.user.email[0];
				setPage(1);
			}
			if (data.user.password) {
				err.password = data.user.password[0];
				setPage(1);
			}
		}
		if (data.date_of_birth) {
			err.dob = `Invalid date of birth`;
			setPage(1);
		}

		setError({ ...err });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!fieldValidation()) return;

		// const res = await fetch("http://127.0.0.1:8000/api/signup/", {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// 	body: JSON.stringify({
		// user: {
		// 	username: `${name.replaceAll(" ", "")}_${Math.random()
		// 		.toString(36)
		// 		.slice(2)}`,
		// 	email,
		// 	password: password1,
		// },
		// name,
		// date_of_birth: `${dob.year}-${dob.month}-${dob.date}`,
		// 	}),
		// });
		// const data = await res.json();

		try {
			const res = await axiosInstance.post("signup/", {
				user: {
					username: `${name.replaceAll(" ", "")}_${Math.random()
						.toString(36)
						.slice(2)}`,
					email,
					password: password1,
				},
				name,
				date_of_birth: `${dob.year}-${dob.month}-${dob.date}`,
			});
			const data = res.data;
			if (data.success) {
				message.value = data.success;
				navigate("/signin");
			}
		} catch (err) {
			serverValidationError(err.response.data);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="signup-container">
			<h1>
				{" "}
				{page === 2 && (
					<IoArrowBack className="prev-icon" onClick={() => setPage(1)} />
				)}{" "}
				ChatNova
			</h1>
			<h3 className="mt-5">Create Your Account</h3>

			{page === 1 && (
				<>
					<div className="input-group flex-nowrap">
						<input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="form-control mt-3"
							placeholder="Name"
							aria-label="Name"
							aria-describedby="addon-wrapping"
						/>
					</div>

					{error.name && (
						<div className="alert alert-danger pt-1 pb-1">{error.name}</div>
					)}

					<div className="input-group flex-nowrap">
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="form-control mt-3"
							placeholder="Email"
							aria-label="Email"
							aria-describedby="addon-wrapping"
						/>
					</div>

					{error.email && (
						<div className="alert alert-danger pt-1 pb-1">{error.email}</div>
					)}

					<h4 className="mt-5">Date of Birth</h4>
					<div className="input-group d-flex">
						<div className="p-1 flex-xl-fill flex-grow-1 ">
							<select
								className="form-select"
								value={dob.month}
								onChange={(e) => setDob({ ...dob, month: e.target.value })}
							>
								<option value="" disabled hidden>
									Month
								</option>
								<option value="1">January</option>
								<option value="2">February</option>
								<option value="3">March</option>
								<option value="5">April</option>
								<option value="5">May</option>
								<option value="6">June</option>
								<option value="7">July</option>
								<option value="8">August</option>
								<option value="9">September</option>
								<option value="10">October</option>
								<option value="11">November</option>
								<option value="12">December</option>
							</select>
						</div>
						<div className="p-1 flex-md-fill flex-grow-1 ">
							<select
								className="form-select"
								value={dob.date}
								onChange={(e) => setDob({ ...dob, date: e.target.value })}
							>
								<option value="" disabled hidden>
									Day
								</option>
								{!dob.month
									? [...Array(31).keys()].map((i) => (
											<option key={i} value={i + 1}>
												{i + 1}
											</option>
									  ))
									: [
											...Array(
												new Date(dob.year || 4, dob.month, 0).getDate()
											).keys(),
									  ].map((i) => (
											<option key={i} value={i + 1}>
												{i + 1}
											</option>
									  ))}
							</select>
						</div>
						<div className="p-1 flex-lg-fill flex-grow-1">
							<select
								className="form-select"
								value={dob.year}
								onChange={(e) => setDob({ ...dob, year: e.target.value })}
							>
								<option value="" disabled hidden>
									Year
								</option>
								{[...Array(new Date().getFullYear() - 1902 + 1).keys()]
									.reverse()
									.map((i) => (
										<option key={i} value={i + 1902}>
											{i + 1902}
										</option>
									))}
							</select>
						</div>
					</div>

					{error.dob && (
						<div className="alert alert-danger pt-1 pb-1">{error.dob}</div>
					)}

					<div className="d-flex justify-content-around flex-wrap mt-3">
						<div className="d-flex flex-column align-items-center justify-content-start mt-2">
							<p className="mb-0">Already have an account?</p>
							<Link to="/signin">Sign In</Link>
						</div>
						<button
							onClick={() => setPage(2)}
							className="btn btn-secondary mt-3 mb-3"
						>
							Next
							<GrLinkNext className="next-icon" />
						</button>
					</div>
				</>
			)}

			{page === 2 && (
				<>
					<div className="input-group flex-nowrap">
						<input
							type="password"
							value={password1}
							onChange={(e) => setPassword1(e.target.value)}
							className="form-control mt-4"
							placeholder="Password"
							aria-describedby="addon-wrapping"
						/>
					</div>

					<div className="input-group flex-nowrap">
						<input
							type="password"
							value={password2}
							onChange={(e) => setPassword2(e.target.value)}
							className="form-control mt-4"
							placeholder="Confirm password"
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
							Sign Up
						</button>
					</div>
				</>
			)}
		</form>
	);
};

export default SignUp;
