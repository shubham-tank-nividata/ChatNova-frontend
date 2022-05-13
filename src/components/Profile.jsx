import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/profile.css";
import axios from "axios";
import axiosInstance from "../axios";
import "lightbox2/dist/css/lightbox.min.css";
import "lightbox2/dist/js/lightbox-plus-jquery.js";
import Spinner from "./Spinner";

const Profile = () => {
	const { userid } = useParams();

	const [userProfile, setUserProfile] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const res = await axiosInstance.get(`users/profile/${userid}`);
				setUserProfile(res.data);
				setLoading(false);
			} catch (err) {
				console.log(err);
			}
		})();
	}, [userid]);

	return (
		<div className="profile-container container">
			{loading ? (
				<div className="text-center">
					<Spinner size="1.5rem" />
				</div>
			) : (
				<>
					<section className="profile-pic">
						<a
							href={`http://localhost:8000${userProfile.image}`}
							data-lightbox="image-1"
							data-title={userProfile.name}
						>
							<img
								className="profile-pic-img"
								src={`http://localhost:8000${userProfile.image}`}
							/>
						</a>
					</section>
					<div className="d-flex flex-wrap justify-content-between">
						<section className="user-detail flex-fill">
							<h3>{userProfile.name}</h3>
							<p className="text-secondary">
								@{userProfile && userProfile.user.username}
							</p>
						</section>

						<section className="following text-center">
							<h3>0</h3>
							<h5>Following</h5>
						</section>
						<section className="followers text-center">
							<h3>0</h3>
							<h5>Followers</h5>
						</section>
					</div>
				</>
			)}
		</div>
	);
};

export default Profile;
