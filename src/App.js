import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Message from "./contexts/Message";
import Logout from "./components/Logout";
import axiosInstance from "./axios";
import { useState, useEffect } from "react";
import Container from "./components/Container";
import Profile from "./components/Profile";

function App() {
	return (
		<Message.Provider value={{ value: "", type: "success" }}>
			<Routes>
				<Route path="" element={<Container />}>
					<Route path="" element={<Navigate replace to="home/" />} />
					<Route path="home" element={<Home />} />
					<Route path="profile" element={<Profile />} />
				</Route>
				<Route path="logout/" element={<Logout />} />
				<Route path="signin/" element={<SignIn />} />
				<Route path="signup/" element={<SignUp />} />
			</Routes>
		</Message.Provider>
	);
}

export default App;
