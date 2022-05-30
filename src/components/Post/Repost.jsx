import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { Link } from "react-router-dom";

const Repost = ({ postid }) => {
	const [post, setPost] = useState(null);

	useEffect(() => {
		axiosInstance
			.get(`posts/${postid}/`)
			.then((res) => {
				setPost(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		post && (
			<article className="post repost mt-1 mb-3 card">
				<div className="card-body">
					<header className="row">
						<div className="col-1 d-flex justify-content-center align-items-center">
							<img
								src={`http://localhost:8000${post.profile_image}`}
								className="repost-userprofile-img"
							/>
						</div>
						<div className="col-9">
							<p className="repost-user-name">{post.name}</p>
							<Link
								className="repost-user-username"
								to={`/profile/${post.user_id}`}
							>
								@{post.username}
							</Link>
						</div>
						<div className="col-2">
							<p className="time">{post.time}</p>
							<p className="date">{post.date_created}</p>
						</div>
					</header>
					<main className="mt-3">
						<div className="row">
							<p className="card-text col-11">{post.content}</p>
						</div>
						{post.image && (
							<img
								className="card-img-top p-2"
								src={`http://localhost:8000${post.image}`}
								alt=""
							/>
						)}
					</main>
				</div>
			</article>
		)
	);
};

export default Repost;
