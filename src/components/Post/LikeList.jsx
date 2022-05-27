import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { axiosBasic } from "../../axios";
import Spinner from "../Spinner";

const UserList = ({ users }) => {
	if (users.length === 0) {
		return <h5 className="text-secondary text-center m-2 p-2">No Likes</h5>;
	}

	return (
		<>
			{users.map((user) => (
				<Link
					key={user.id}
					className="follow-user row like-user"
					to={`/profile/${user.id}`}
				>
					<div className="col-2 d-flex justify-content-center align-items-center">
						<img
							src={`http://localhost:8000${user.image}`}
							className="follow-user-img"
						/>
					</div>
					<div className="col-10">
						<p className="follow-user-name">{user.name}</p>
						<p className="follow-user-username">@{user.username}</p>
					</div>
				</Link>
			))}
		</>
	);
};

const LikeList = () => {
	const { postid } = useParams();
	const [loading, setLoading] = useState(true);
	const [likes, setLikes] = useState([]);

	useEffect(() => {
		axiosBasic
			.get(`http://localhost:8000/api/posts/${postid}/likes/`)
			.then((res) => {
				setLoading(false);
				setLikes(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	});

	return loading ? (
		<div className="d-flex justify-content-center p-4">
			<Spinner size="1rem" />
		</div>
	) : (
		<div className="p-5 pt-0 pb-0">
			<UserList users={likes} />
		</div>
	);
};

export default LikeList;
