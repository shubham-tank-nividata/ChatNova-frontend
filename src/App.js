import "./App.css";
import { Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import Message from "./contexts/Message";

function App() {
	return (
		<Message.Provider value={{ value: "" }}>
			<Routes>
				<Route path="signin/" element={<SignIn />} />
				<Route path="signup/" element={<SignUp />} />
				<Route path="home/" element={<Home />} />
			</Routes>
		</Message.Provider>
	);
}

export default App;
