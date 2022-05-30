import React, { useContext, useEffect, useState } from "react";
import "../../styles/post.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { BiLike, BiComment, BiRepost } from "react-icons/bi";
import { BsDot } from "react-icons/bs";
import {
	AiOutlineRetweet,
	AiTwotoneLike,
	AiOutlineDelete,
} from "react-icons/ai";
import axiosInstance, { axiosBasic } from "../../axios";
import { decode as atob } from "base-64";
import Repost from "./Repost";
import CreateRepost from "../../contexts/CreateRepost";

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
		repost,
		likes_count,
		comments_count,
		repost_count,
	},
	posts,
	setPosts,
}) => {
	const navigate = useNavigate();
	const loggeduserid =
		localStorage.getItem("access_token") &&
		JSON.parse(atob(localStorage.getItem("access_token").split(".")[1]))
			.user_id;

	const createRepost = useContext(CreateRepost);

	const date = new Date(created_at);
	const hours = date.getHours();
	const time = `${hours > 12 ? hours % 12 : hours} : ${
		date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
	} ${hours >= 12 ? "pm" : "am"}`;
	const date_created = `${date.toDateString().slice(4, 10)}, ${date
		.toDateString()
		.slice(11, 15)}`;

	const [liked, setLiked] = useState(false);
	const [likesCount, setLikesCount] = useState(likes_count);
	// const [commentsCount, setCommentsCount] = useState(comments_count);

	useEffect(() => {
		(async () => {
			const res = await axiosBasic.get(
				`users/${loggeduserid}/likes/${post_id}/`
			);
			setLiked(res.data);
		})();
	});

	const handleDelete = () => {
		axiosInstance
			.delete(`posts/${post_id}/`)
			.then((res) => {
				setPosts(posts.filter((post) => post.id != post_id));
				if (repost) {
					const repostCount = document.querySelector(`#repost-count-${repost}`);
					repostCount.innerText = parseInt(repostCount.innerText) - 1;
				}
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
					setLikesCount(likesCount - 1);
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			axiosInstance
				.post(`users/${loggeduserid}/likes/${post_id}/`)
				.then((res) => {
					setLiked(true);
					setLikesCount(likesCount + 1);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	const handleRepost = () => {
		createRepost.setRepost(post_id);
		navigate("/home");
		document.querySelector(".main-outlet").scrollTo(0, 0);
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
					<div className={`row ${loggeduserid == user_id ? "" : "mb-3"}`}>
						<p className="card-text col-11">{content}</p>
						{loggeduserid == user_id && (
							<div className="col-1 text-end">
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
							</div>
						)}
					</div>
					{image && (
						<img
							className="card-img-top p-2"
							src={`http://localhost:8000${image}`}
							alt=""
						/>
					)}
				</main>
				{repost && <Repost postid={repost} />}
				<section>
					<p className="counts m-0">
						<Link to={`./post/${post_id}/like`}>
							<BiLike size="1rem" /> {likesCount} <BsDot />{" "}
						</Link>
						<Link
							to={`./post/${post_id}/comment`}
							className={`commentlink-${post_id}`}
						>
							<BiComment size="1rem" /> {comments_count} <BsDot />{" "}
						</Link>
						<BiRepost size="1.4rem" style={{ color: "#9b9b9b" }} />{" "}
						<span style={{ color: "gray" }} id={`repost-count-${post_id}`}>
							{repost_count}
						</span>
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
						<div className="repost" onClick={handleRepost}>
							<AiOutlineRetweet size="1.5rem" />
						</div>
					</section>
				</footer>
			</div>
		</article>
	);
};

export default Post;
