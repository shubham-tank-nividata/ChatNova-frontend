import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/profile.css";
import axios from "axios";
import axiosInstance from "../axios";
import "lightbox2/dist/css/lightbox.min.css";
import "lightbox2/dist/js/lightbox-plus-jquery.js";
import Spinner from "./Spinner";
import { decode as atob } from "base-64";

const Profile = () => {
	const { userid } = useParams();
	const loggedUserId =
		localStorage.getItem("access_token") &&
		JSON.parse(atob(localStorage.getItem("access_token").split(".")[1]))
			.user_id;

	const [userProfile, setUserProfile] = useState({});
	const [profileImage, setProfileImage] = useState(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	const handleChange = (e) => {
		if ([e.target.name] == "image") {
			setProfileImage({ image: e.target.files });
			var selectedFile = e.target.files[0];
			var reader = new FileReader();

			var imgtag = document.querySelector(".lb-image");

			reader.onload = function (e) {
				imgtag.src = e.target.result;
			};

			reader.readAsDataURL(selectedFile);
		}
	};

	function onFileSelected(event) {}

	const handleImageSubmit = (e) => {
		e.preventDefault();

		const config = {
			headers: { "Content-Type": "multipart/form-data" },
		};
		const URL = `http://localhost:8000/api/users/profile/${userid}`;

		let formData = new FormData();
		formData.append("username", userProfile.user.username);
		formData.append("email", userProfile.user.email);
		formData.append("password", userProfile.user.password);
		formData.append("name", userProfile.name);
		formData.append("date_of_birth", userProfile.date_of_birth);
		formData.append("bio", userProfile.bio);
		formData.append("image", profileImage.image[0]);

		axios
			.put(URL, formData, config)
			.then((res) => {
				window.location.href = `/profile/${userid}`;
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		(async () => {
			try {
				const res = await axiosInstance.get(`users/profile/${userid}`);
				setUserProfile(res.data);
				setLoading(false);

				// for image upload option on user profile
				if (loggedUserId == userid) {
					if (!document.querySelector(".input-container")) {
						const form = document.createElement("form");
						form.className = "input-container";
						form.addEventListener("submit", handleImageSubmit);
						const input = document.createElement("input");
						input.type = "file";
						input.accept = "image/*";
						input.name = "image";
						input.className = "image-input";
						input.id = "image-input";
						input.style.display = "none";

						const submit = document.createElement("input");
						submit.type = "submit";
						submit.id = "image-submit";
						submit.innerText = "save";
						submit.style.display = "none";

						const editImgLabel = document.createElement("label");
						editImgLabel.setAttribute("for", "image-input");
						editImgLabel.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="2.1em" width="2.1em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0H24V24H0z"></path><path d="M20 3c.552 0 1 .448 1 1v1.757l-2 2V5H5v8.1l4-4 4.328 4.329-1.327 1.327-.006 4.239 4.246.006 1.33-1.33L18.899 19H19v-2.758l2-2V20c0 .552-.448 1-1 1H4c-.552 0-1-.448-1-1V4c0-.552.448-1 1-1h16zm1.778 4.808l1.414 1.414L15.414 17l-1.416-.002.002-1.412 7.778-7.778zM15.5 7c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5S14 9.328 14 8.5 14.672 7 15.5 7z"></path></g></svg>`;

						const submitLabel = document.createElement("label");
						submitLabel.setAttribute("for", "image-submit");
						submitLabel.innerHTML = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="2.1em" width="2.1em" xmlns="http://www.w3.org/2000/svg"><g><path fill="none" d="M0 0h24v24H0z"></path><path d="M4 3h14l2.707 2.707a1 1 0 0 1 .293.707V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm3 1v5h9V4H7zm-1 8v7h12v-7H6zm7-7h2v3h-2V5z"></path></g></svg>`;

						form.append(editImgLabel);
						form.append(input);
						form.append(submit);
						form.append(submitLabel);

						document.querySelector(".lb-data").append(form);
					}
				}
			} catch (err) {
				console.log(err);
			}
		})();
	}, [userid, profileImage]);

	useEffect(() => {
		const form = document.querySelector(".input-container");
		if (form) {
			form.removeEventListener("submit", handleImageSubmit);
			form.addEventListener("submit", handleImageSubmit);
		}
	}, [profileImage]);

	const addEventToForm = () => {
		document
			.querySelector(".image-input")
			.addEventListener("change", handleChange);
	};

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
							onClick={addEventToForm}
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
