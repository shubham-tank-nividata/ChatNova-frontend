import React, { useEffect, useState } from "react";
import "../../styles/post.css";
import { Link, Outlet } from "react-router-dom";
import { BiLike, BiComment } from "react-icons/bi";
import { BsDot } from "react-icons/bs";
import {
	AiOutlineRetweet,
	AiTwotoneLike,
	AiOutlineDelete,
} from "react-icons/ai";
import axiosInstance, { axiosBasic } from "../../axios";
import { decode as atob } from "base-64";

const Post = ({
	post: {
		id: post_id,
		user_id,
		name,
		username,
		content,
		profile_image,
		image,
		created_at,
	},
	posts,
	setPosts,
}) => {
	const loggeduserid =
		localStorage.getItem("access_token") &&
		JSON.parse(atob(localStorage.getItem("access_token").split(".")[1]))
			.user_id;

	const date = new Date(created_at);
	const hours = date.getHours();
	const time = `${hours > 12 ? hours % 12 : hours} : ${
		date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
	} ${hours >= 12 ? "pm" : "am"}`;
	const date_created = `${date.toDateString().slice(4, 10)}, ${date
		.toDateString()
		.slice(11, 15)}`;

	const [liked, setLiked] = useState(false);
	const [likesCount, setLikesCount] = useState(0);
	const [commentsCount, setCommentsCount] = useState(0);

	useEffect(() => {
		(async () => {
			const res = await axiosBasic.get(
				`users/${loggeduserid}/likes/${post_id}/`
			);
			setLiked(res.data);
			const likesres = await axiosBasic.get(`posts/${post_id}/likes/`);
			setLikesCount(likesres.data.length);
			const commentsres = await axiosBasic.get(`posts/${post_id}/comments/`);
			setCommentsCount(commentsres.data.length);
		})();
	});

	const handleDelete = () => {
		axiosInstance
			.delete(`posts/${post_id}/`)
			.then((res) => {
				setPosts(posts.filter((post) => post.id != post_id));
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleLike = () => {
		if (liked) {
			axiosInstance
				.delete(`users/${loggeduserid}/likes/${post_id}/`)
				.then((res) => {
					setLiked(false);
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			axiosInstance
				.post(`users/${loggeduserid}/likes/${post_id}/`)
				.then((res) => {
					setLiked(true);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	return (
		<article className="post mt-5 mb-5 card">
			<div className="card-body">
				<header className="row">
					<div className="col-1 d-flex justify-content-center align-items-center">
						<img
							src={`http://localhost:8000${profile_image}`}
							className="post-userprofile-img"
						/>
					</div>
					<div className="col-9">
						<p className="post-user-name">{name}</p>
						<Link className="post-user-username" to={`/profile/${user_id}`}>
							@{username}
						</Link>
					</div>
					<div className="col-2">
						<p className="time">{time}</p>
						<p className="date">{date_created}</p>
					</div>
				</header>
				<main className="mt-4">
					<div className="row">
						<p className="card-text col-11">{content}</p>
						<div className="col-1 text-end">
							{loggeduserid == user_id && (
								<div className="btn-group dropup">
									<AiOutlineDelete
										size="1.3rem"
										data-bs-toggle="dropdown"
										aria-expanded="false"
										className="comment-delete-dropdown"
									/>
									<ul className="dropdown-menu">
										<li
											className="dropdown-item delete-option text-center text-danger"
											onClick={handleDelete}
										>
											Delete Post
										</li>
									</ul>
								</div>
							)}
						</div>
					</div>
					{image && (
						<img
							className="card-img-top p-2"
							src={`http://localhost:8000${image}`}
							alt=""
						/>
					)}
				</main>
				<section className="mt-3">
					<p className="counts m-0">
						<Link to={`./post/${post_id}/like`}>
							<BiLike size="1rem" /> {likesCount} <BsDot />{" "}
						</Link>
						<Link
							to={`./post/${post_id}/comment`}
							className={`commentlink-${post_id}`}
						>
							<BiComment size="1rem" /> {commentsCount}
						</Link>
					</p>
				</section>

				<footer className="row">
					<section className="col-4 d-flex justify-content-center">
						<div className="like" onClick={handleLike}>
							{liked ? (
								<AiTwotoneLike size="1.5rem" className="liked" />
							) : (
								<BiLike size="1.5rem" />
							)}
						</div>
					</section>
					<section className="comment-container col-4 d-flex justify-content-center">
						<Link className="comment" to={`./post/${post_id}/comment`}>
							<BiComment size="1.5rem" />
						</Link>
					</section>
					<section className="col-4 d-flex justify-content-center">
						<div className="repost">
							<AiOutlineRetweet size="1.5rem" />
						</div>
					</section>
				</footer>
			</div>
		</article>
	);
};

export default Post;
