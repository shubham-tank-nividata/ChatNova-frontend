import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosBasic } from "../axios";
import Spinner from "./Spinner";
import { decode as atob } from "base-64";

const UserSearchList = ({ users, currentUserid }) => {
	const navigate = useNavigate();

	return users.length === 0 ? (
		<div>
			<p className="text-center mt-3 text-secondary">no result found</p>
		</div>
	) : (
		<>
			{users.map(
				(user) =>
					user.id != currentUserid && (
						<div
							onMouseDown={() => {
								navigate(`/profile/${user.id}`);
							}}
							key={user.id}
							className="search-result-user row"
						>
							<div className="col-2 d-flex justify-content-center align-items-center">
								<img
									src={`http://localhost:8000${user.image}`}
									className="search-user-img"
								/>
							</div>
							<div className="col-10">
								<p className="search-user-name">{user.name}</p>
								<p className="search-user-username" to={`/profile/${user.id}`}>
									@{user.username}
								</p>
							</div>
						</div>
					)
			)}
		</>
	);
};

const SearchUser = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [users, setUsers] = useState(null);
	const [focus, setFocus] = useState(false);
	const [loading, setLoading] = useState(true);

	const currentUserid =
		localStorage.getItem("access_token") &&
		JSON.parse(atob(localStorage.getItem("access_token").split(".")[1]))
			.user_id;

	useEffect(() => {
		if (searchQuery) {
			setLoading(true);
			axiosBasic
				.get(`/users/?search=${searchQuery}`)
				.then((res) => {
					setUsers(res.data);
					setLoading(false);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [searchQuery]);

	return (
		<div className="user-search-container">
			<input
				type="text"
				className="user-search-input"
				placeholder="Search User"
				onFocus={() => setFocus(true)}
				onBlur={() => setFocus(false)}
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
			{focus && searchQuery && (
				<div className="user-search-list">
					{loading ? (
						<div className="d-flex justify-content-center p-2">
							<Spinner size="0.5rem" />
						</div>
					) : (
						<UserSearchList users={users} currentUserid={currentUserid} />
					)}
				</div>
			)}
		</div>
	);
};

export default SearchUser;
