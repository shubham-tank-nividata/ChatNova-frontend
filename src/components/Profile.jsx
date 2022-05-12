import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/profile.css";
import axios from "axios";
import axiosInstance from "../axios";

const Profile = () => {
	const { userid } = useParams();

	const [userProfile, setUserProfile] = useState("");

	useEffect(() => {
		(async () => {
			try {
				const res = await axiosInstance.get(`users/profile/${userid}`);
				setUserProfile(res.data);
			} catch (err) {
				console.log(err);
			}
		})();
	}, [userid]);

	return (
		<div className="profile-container container">
			<section className="profile-pic">
				<img
					className="profile-pic-img"
					src={`http://localhost:8000${userProfile.image}`}
				/>
			</section>
			<div className="d-flex justify-content-between">
				<section className="user-detail">
					<h3>{userProfile.name}</h3>
					<p className="text-secondary">
						@{userProfile && userProfile.user.username}
					</p>
				</section>
			</div>
		</div>
	);
};

export default Profile;
