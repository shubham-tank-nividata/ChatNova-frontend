import React, { useState } from "react";
import "../../styles/home.css";
import { BiImageAlt } from "react-icons/bi";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { decode as atob } from "base-64";
import { useNavigate } from "react-router-dom";
import { axiosBasic } from "../../axios";

const CreatePost = ({ posts, setPosts }) => {
	const [content, setContent] = useState("");
	const [image, setImage] = useState(null);

	const navigate = useNavigate();

	const userid =
		localStorage.getItem("access_token") &&
		JSON.parse(atob(localStorage.getItem("access_token").split(".")[1]))
			.user_id;

	const handleChange = (e) => {
		if (e.target.name == "content") {
			const textarea = document.querySelector(".create-post textarea");
			textarea.style.height = "1px";
			textarea.style.height =
				textarea.style.fontSize + textarea.scrollHeight + "px";
			setContent(e.target.value);
		} else {
			setImage(e.target.files[0]);

			if (e.target.files.length > 0) {
				const selectedFile = e.target.files[0];
				const reader = new FileReader();

				const imgtag = document.querySelector(".uploaded-image");
				const imgcontainer = document.querySelector(
					".uploaded-image-container"
				);
				imgcontainer.style.display = "block";

				reader.onload = function (e) {
					imgtag.src = e.target.result;
				};

				reader.readAsDataURL(selectedFile);
			}
		}
	};

	const removeImage = (e) => {
		setImage(null);
		const reader = new FileReader();

		const imgtag = document.querySelector(".uploaded-image");
		document.querySelector("#add-image-input").value = null;
		document.querySelector(".uploaded-image-container").style.display = "none";
		imgtag.setAttribute("src", "");
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!content) return;
		const config = {
			headers: { "Content-Type": "multipart/form-data" },
		};
		const URL = `users/${userid}/posts/`;

		let formData = new FormData();

		formData.append("user", userid);
		formData.append("content", content);
		if (image) formData.append("image", image);

		axiosBasic
			.post(URL, formData, config)
			.then((res) => {
				setContent("");
				setImage(null);
				setPosts([res.data, ...posts]);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<section className="create-post card">
			<form className="card-body" onSubmit={handleSubmit}>
				<div className="input-group">
					<textarea
						onChange={handleChange}
						className="form-control"
						maxLength={280}
						aria-label="With textarea"
						name="content"
						value={content}
						placeholder="Say something ..."
					></textarea>
				</div>
				<div className="uploaded-image-container">
					<AiOutlineCloseCircle
						className="uploaded-image-cancel"
						onClick={removeImage}
					/>
					<img src="" alt="" className="uploaded-image" />
				</div>
				<div className="d-flex justify-content-between align-items-center mt-2">
					<div className="input-group">
						<label htmlFor="add-image-input" className="add-image-label">
							<BiImageAlt />
						</label>
						<input
							type="file"
							accept="image/*"
							name="image"
							id="add-image-input"
							onChange={handleChange}
						/>
					</div>
					<button type="submit" className="btn btn-primary post-submit-btn">
						Post
					</button>
				</div>
			</form>
		</section>
	);
};

export default CreatePost;
