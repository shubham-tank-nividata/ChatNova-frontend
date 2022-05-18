import axios from "axios";
import React, { useEffect, useState } from "react";
import axiosInstance, { axiosBasic } from "../axios";

const FollowBtn = ({ loggeduserid, userid, setUserProfile }) => {
	const [followed, setFollowed] = useState(false);

	const toggleFollow = () => {
		axiosBasic
			.post(`users/follow/${loggeduserid}/${userid}/`)
			.then((res) => {
				setUserProfile(res.data);
				setFollowed(!followed);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		axiosBasic
			.get(`users/follow/${loggeduserid}/${userid}/`)
			.then((res) => {
				setFollowed(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	});

	return followed ? (
		<button className="btn btn-light btn-unfollow" onClick={toggleFollow}>
			{" "}
			Unfollow{" "}
		</button>
	) : (
		<button className="btn btn-primary btn-follow" onClick={toggleFollow}>
			{" "}
			Follow{" "}
		</button>
	);
};

export default FollowBtn;
