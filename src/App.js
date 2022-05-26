import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Message from "./contexts/Message";
import Logout from "./components/Logout";
import Container from "./components/Container";
import Profile from "./components/Profile";
import FollowerFollowing from "./components/FollowerFollowing";
import Explore from "./components/Explore";
import Overlay from "./components/Post/Overlay";
import LikeList from "./components/Post/LikeList";
import Comment from "./components/Post/Comment";

function App() {
	return (
		<Message.Provider value={{ value: "", type: "success" }}>
			<Routes>
				<Route path="" element={<Container />}>
					<Route path="" element={<Navigate replace to="home/" />} />
					<Route path="home" element={<Home />}>
						<Route path="post">
							<Route path=":postid" element={<Overlay />}>
								<Route path="like" element={<LikeList />} />
								<Route path="comment" element={<Comment />} />
							</Route>
						</Route>
					</Route>
					<Route path="explore" element={<Explore />} />
					<Route path="profile">
						<Route path=":userid" element={<Profile />}>
							<Route
								path="following"
								element={<FollowerFollowing type="following" />}
							/>
							<Route
								path="followers"
								element={<FollowerFollowing type="followers" />}
							/>
							<Route path="post">
								<Route path=":postid" element={<Overlay />}>
									<Route path="like" element={<LikeList />} />
									<Route path="comment" element={<Comment />} />
								</Route>
							</Route>
						</Route>
					</Route>
				</Route>
				<Route path="logout/" element={<Logout />} />
				<Route path="signin/" element={<SignIn />} />
				<Route path="signup/" element={<SignUp />} />
			</Routes>
		</Message.Provider>
	);
}

export default App;
