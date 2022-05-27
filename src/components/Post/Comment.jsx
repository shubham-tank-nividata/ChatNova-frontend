import React, { useEffect, useState } from "react";
import axiosInstance, { axiosBasic } from "../../axios";
import { useParams, Link } from "react-router-dom";
import { MdSend } from "react-icons/md";
import Spinner from "../Spinner";
import { decode as atob } from "base-64";
import { AiOutlineDelete } from "react-icons/ai";

const SingleComment = ({
	comment,
	loggeduser,
	postid,
	rerender,
	setRerender,
}) => {
	const date = new Date(comment.created_at);
	const hours = date.getHours();
	const time = `${hours > 12 ? hours % 12 : hours} : ${
		date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
	} ${hours >= 12 ? "pm" : "am"}`;
	const date_created = `${date.toDateString().slice(4, 10)}, ${date
		.toDateString()
		.slice(11, 15)}`;

	const decr = () => {
		const c = document.querySelector(`.commentlink-${postid}`);
		const child = c.childNodes[2];
		c.replaceChild(document.createTextNode(parseInt(c.innerText) - 1), child);
	};

	const handleDelete = () => {
		axiosInstance
			.delete(`posts/${postid}/comments/${comment.id}/`)
			.then((res) => {
				decr();
				setRerender(!rerender);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div className="single-comment mb-3">
			<header className="row">
				<div className="col-2 d-flex justify-content-center align-items-center">
					<img
						src={`http://localhost:8000${comment.image}`}
						className="post-userprofile-img user-comment-img"
					/>
				</div>
				<div className="col-6">
					<p className="post-user-name comment-user-name">{comment.name}</p>
					<Link
						className="post-user-username"
						to={`/profile/${comment.user_id}`}
					>
						@{comment.username}
					</Link>
				</div>
				<div className="col-4">
					<p className="time">{time}</p>
					<p className="date">{date_created}</p>
				</div>
			</header>
			<main className="row">
				<p className="text-black comment-text col-11">{comment.comment_text}</p>
				<div className="col-1">
					{loggeduser == comment.user_id && (
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
									Delete
								</li>
							</ul>
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

const Comment = () => {
	const { postid } = useParams();

	const [comments, setComments] = useState([]);
	const [commentInput, setCommentInput] = useState("");
	const [loading, setLoading] = useState(true);
	const [rerender, setRerender] = useState(true);

	const user_id =
		localStorage.getItem("access_token") &&
		JSON.parse(atob(localStorage.getItem("access_token").split(".")[1]))
			.user_id;

	useEffect(() => {
		axiosBasic
			.get(`posts/${postid}/comments/`)
			.then((res) => {
				setComments(res.data);
				setLoading(false);
			})
			.catch((err) => console.log(err));
	}, [rerender]);

	function incr() {
		const c = document.querySelector(`.commentlink-${postid}`);
		const child = c.childNodes[2];
		c.replaceChild(document.createTextNode(parseInt(c.innerText) + 1), child);
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		if (commentInput === "") {
			return;
		}
		axiosInstance
			.post(`posts/${postid}/comments/`, {
				user_id,
				post_id: postid,
				comment_text: commentInput,
			})
			.then((res) => {
				setCommentInput("");
				setRerender(!rerender);
				incr();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<section className="comment-section p-3 d-flex flex-column justify-content-end">
			<div className="comment-list">
				{loading ? (
					<div className="d-flex justify-content-center">
						<Spinner size="1rem" />
					</div>
				) : comments.length === 0 ? (
					<h5 className="text-secondary text-center">No comments yet</h5>
				) : (
					comments.map((comment) => (
						<SingleComment
							key={comment.id}
							comment={comment}
							loggeduser={user_id}
							postid={postid}
							rerender={rerender}
							setRerender={setRerender}
						/>
					))
				)}
			</div>
			<form onSubmit={handleSubmit}>
				<div className="input-group">
					<input
						type="text"
						className="form-control comment-input"
						placeholder="write comment ..."
						value={commentInput}
						onChange={(e) => setCommentInput(e.target.value)}
					/>
					<button type="submit" className="input-group-text comment-submit">
						<MdSend size="1.2rem" />
					</button>
				</div>
			</form>
		</section>
	);
};

export default Comment;
