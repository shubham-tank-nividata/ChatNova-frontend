import React, { useEffect, useState } from "react";
import "../styles/home.css";
import CreatePost from "./Post/CreatePost";
import axiosInstance from "../axios";
import Spinner from "./Spinner";
import Post from "./Post/Post";
import { Outlet } from "react-router-dom";

const Home = () => {
	const [posts, setPosts] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		axiosInstance
			.get("following/posts/")
			.then((res) => {
				setPosts(res.data);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		<div className="home-container container">
			<CreatePost posts={posts} setPosts={setPosts} />
			{loading ? (
				<div className="d-flex justify-content-center mt-3">
					<Spinner size="1.3rem" />
				</div>
			) : (
				posts.map((post) => (
					<Post key={post.id} post={post} posts={posts} setPosts={setPosts} />
				))
			)}
			<Outlet />
		</div>
	);
};

export default Home;
