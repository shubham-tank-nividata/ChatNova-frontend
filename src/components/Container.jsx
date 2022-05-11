import React, { useEffect, useState } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import "../container.css";
import axiosInstance from "../axios";

const Container = () => {
	const [user, setUser] = useState({});

	useEffect(() => {
		(async () => {
			try {
				axiosInstance.defaults.headers["Authorization"] =
					"JWT " + localStorage.getItem("access_token");
				const res = await axiosInstance.get(`users/loggeduser/`);
				setUser(res.data);
			} catch (err) {
				console.log(err);
			}
		})();
	}, []);

	return (
		<div className="container-fluid main-container">
			<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
				<div className="container-fluid">
					<NavLink className="navbar-brand" to="/">
						ChatNova
					</NavLink>
					<button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarText"
						aria-controls="navbarText"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarText">
						<ul className="navbar-nav me-auto mb-2 mb-lg-0">
							<li className="nav-item">
								<NavLink
									className="nav-link"
									style={({ isActive }) => {
										return { color: isActive ? "white" : "" };
									}}
									aria-current="page"
									to="/home"
								>
									Home
								</NavLink>
							</li>
							<li className="nav-item">
								<NavLink
									className="nav-link"
									to="/profile"
									style={({ isActive }) => {
										return { color: isActive ? "white" : "" };
									}}
								>
									Profile
								</NavLink>
							</li>
						</ul>
						<span className="navbar-text text-light">{user.name}</span>
						<span className="navbar-text">
							<Link className="btn" to="/logout">
								{" "}
								logout{" "}
							</Link>
						</span>
					</div>
				</div>
			</nav>

			<Outlet />
		</div>
	);
};

export default Container;
