import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { axiosBasic } from "../axios";
import Spinner from "./Spinner";

const UserList = ({ users }) => {
	if (users.length === 0) {
		return <h5 className="text-secondary text-center m-2 p-2">None</h5>;
	}

	return (
		<>
			{users.map((user) => (
				<div key={user.id} className="follow-user row">
					<div className="col-2 d-flex justify-content-center align-items-center">
						<img
							src={`http://localhost:8000${user.image}`}
							className="follow-user-img"
						/>
					</div>
					<div className="col-10">
						<p className="follow-user-name">{user.name}</p>
						<Link className="follow-user-username" to={`../../${user.id}`}>
							@{user.username}
						</Link>
					</div>
				</div>
			))}
		</>
	);
};

const FollowerFollowing = ({ type }) => {
	const navigate = useNavigate();

	const { userid } = useParams();
	const [users, setUsers] = useState(null);
	const [loading, setLoading] = useState(true);

	const exitOverlay = (e) => {
		if (e.target.className == "overlay") navigate("../");
	};

	useEffect(() => {
		axiosBasic
			.get(`/users/${type}/${userid}/`)
			.then((res) => {
				setLoading(false);
				setUsers(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	});

	return (
		<div className="overlay" onClick={exitOverlay}>
			<div className="follower-container">
				<header>
					<h4>{type === "followers" ? "Followers" : "Following"}</h4>
				</header>
				<main className="follower-main">
					{loading ? (
						<div className="d-flex justify-content-center p-3">
							<Spinner size="0.5rem" />
						</div>
					) : (
						<UserList users={users} />
					)}
				</main>
			</div>
		</div>
	);
};

export default FollowerFollowing;
