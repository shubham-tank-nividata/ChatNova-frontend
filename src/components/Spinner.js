import React, { useEffect, useState } from "react";

const Spinner = ({ size }) => {
	const [spinner2, setSpinner2] = useState(false);
	const [spinner3, setSpinner3] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			setSpinner2(true);
		}, 50);
		setTimeout(() => {
			setSpinner3(true);
		}, 100);
	}, []);

	return (
		<>
			<div
				className="spinner-grow m-1"
				style={{ width: size, height: size }}
				role="status"
			>
				<span className="visually-hidden">Loading...</span>
			</div>
			{spinner2 && (
				<div
					className="spinner-grow m-1"
					style={{ width: size, height: size }}
					role="status"
				>
					<span className="visually-hidden">Loading...</span>
				</div>
			)}
			{spinner3 && (
				<div
					className="spinner-grow m-1"
					style={{ width: size, height: size }}
					role="status"
				>
					<span className="visually-hidden">Loading...</span>
				</div>
			)}
		</>
	);
};

export default Spinner;
