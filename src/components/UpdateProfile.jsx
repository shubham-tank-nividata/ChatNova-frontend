import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { decode as atob } from "base-64";
import axiosInstance, { axiosBasic } from "../axios";

const UpdateProfile = () => {
	const navigate = useNavigate();

	const { userid } = useParams();
	const loggedUserId =
		localStorage.getItem("access_token") &&
		JSON.parse(atob(localStorage.getItem("access_token").split(".")[1]))
			.user_id;

	const [userProfile, setUserProfile] = useState(null);

	useEffect(() => {
		axiosBasic
			.get(`users/profile/${userid}`)
			.then((res) => {
				setUserProfile(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [userid]);

	const exitOverlay = (e) => {
		if (e.target.className == "overlay") navigate("../");
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const config = {
			headers: { "Content-Type": "multipart/form-data" },
		};
		const URL = `users/profile/${userid}`;

		let formData = new FormData();
		formData.append("username", userProfile.user.username);
		formData.append("email", userProfile.user.email);
		formData.append("password", userProfile.user.password);
		formData.append("name", userProfile.name);
		formData.append("date_of_birth", userProfile.date_of_birth);
		formData.append("bio", userProfile.bio);

		axiosBasic
			.put(URL, formData, config)
			.then((res) => {
				window.location.href = `/profile/${userid}`;
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		userProfile && (
			<div className="overlay" onClick={exitOverlay}>
				<form
					className="update-profile-container"
					onSubmit={handleSubmit}
					autoComplete="off"
				>
					<div className="form-floating mt-4 mb-5">
						<input
							type="text"
							className="form-control"
							id="floatingInput"
							placeholder="Name"
							value={userProfile.name}
							onChange={(e) =>
								setUserProfile({ ...userProfile, name: e.target.value })
							}
						/>
						<label htmlFor="floatingInput">Name</label>
					</div>
					<div className="form-floating mb-5">
						<input
							type="text"
							className="form-control"
							id="floatingInput"
							placeholder="username"
							value={userProfile.user.username}
							onChange={(e) =>
								setUserProfile({
									...userProfile,
									user: { ...userProfile.user, username: e.target.value },
								})
							}
						/>
						<label htmlFor="floatingInput">Username</label>
					</div>
					<div className="form-floating mb-5">
						<input
							type="text"
							className="form-control"
							id="floatingInput"
							placeholder="bio"
							value={userProfile.bio === "null" ? "" : userProfile.bio}
							onChange={(e) =>
								setUserProfile({
									...userProfile,
									bio: e.target.value,
								})
							}
						/>
						<label htmlFor="floatingInput">Bio</label>
					</div>
					<div className="mb-3 d-flex justify-content-end">
						<button type="submit" className="btn profile-update-btn">
							Update
						</button>
						<button
							className="btn btn-outline-danger profile-update-cancel-btn"
							onClick={() => navigate("../")}
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		)
	);
};

export default UpdateProfile;
