import React, { useEffect, useState, useContext } from "react";
import { Outlet, NavLink, Link } from "react-router-dom";
import "../styles/container.css";
import axiosInstance from "../axios";
import { decode as atob } from "base-64";
import { FiLogOut } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";

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
									to={""}
									style={({ isActive }) => {
										return { color: isActive ? "white" : "" };
									}}
								>
									Search
								</NavLink>
							</li>
						</ul>

						<div className="btn-group">
							<p
								type="button"
								className="dropdown-toggle text-white mb-0"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								<img
									className="nav-user-img"
									src={`http://localhost:8000${user.image}`}
								/>
								{user.name}{" "}
							</p>
							<ul className="dropdown-menu dropdown-menu-end">
								<li>
									<Link
										className="dropdown-item text-secondary d-flex justify-content-between align-items-center"
										to={`/profile/${
											localStorage.getItem("access_token") &&
											JSON.parse(
												atob(localStorage.getItem("access_token").split(".")[1])
											).user_id
										}`}
									>
										<span>Profile</span>
										<CgProfile />
									</Link>
								</li>
								<li>
									<Link
										className="dropdown-item text-danger d-flex justify-content-between align-items-center"
										to="/logout"
									>
										<span>logout</span>
										<FiLogOut />
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</nav>

			<Outlet />
		</div>
	);
};

export default Container;
