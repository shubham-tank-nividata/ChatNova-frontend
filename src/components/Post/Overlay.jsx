import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "../../styles/post.css";
import { BiLike, BiComment } from "react-icons/bi";

const Overlay = () => {
	const navigate = useNavigate();

	const exitOverlay = (e) => {
		if (e.target.className == "overlay") navigate("../../");
	};

	return (
		<div className="overlay" onClick={exitOverlay}>
			<div className="lc-container">
				<nav className="d-flex justify-content-around">
					<NavLink
						className="like-link"
						to="./like"
						style={({ isActive }) => {
							return {
								borderBottom: isActive ? "4px solid blue" : "",
							};
						}}
					>
						<BiLike size="1.5rem" />
					</NavLink>

					<NavLink
						className="comment-link"
						to="./comment"
						style={({ isActive }) => {
							return {
								borderBottom: isActive ? "4px solid blue" : "",
							};
						}}
					>
						<BiComment size="1.5rem" />
					</NavLink>
				</nav>
				<main>
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default Overlay;
