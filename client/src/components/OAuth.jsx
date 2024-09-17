import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/User/UserSlice";
import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";

const OAuth = () => {
	const auth = getAuth(app);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleGoogleClick = async () => {
		const provider = new GoogleAuthProvider();
		provider.setCustomParameters({ prompt: "select_account" }); //this makes it ask which account you wanna use everytime you click the google auth button instead of it's normal behaviour of using the account you've used to sign in before to sign in again automatically
		try {
			const resultsFromGoogle = await signInWithPopup(auth, provider);
			// console.log(resultsFromGoogle); this was to show the results gotten when you submit your email
			//sending the info to backend:
			const res = await fetch("/api/auth/google", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				bpdy: JSON.stringify({
					name: resultsFromGoogle.user.displayName,
					email: resultsFromGoogle.user.email,
					GooglePhotoUrl: resultsFromGoogle.user.photoURL,
				}),
			});
			const data = await res.json();
			if (res.ok) {
				dispatch(signInSuccess(data));
				navigate("/");
			}
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<Button
			type="button"
			gradientDuoTone="pinkToOrange"
			outline
			onClick={handleGoogleClick}
		>
			<AiFillGoogleCircle className="w-6 h-6 mr-2" />
			Continue with Google
		</Button>
	);
};

export default OAuth;

//when we finshed makingthis we then went to the backend to write the corresponding code
