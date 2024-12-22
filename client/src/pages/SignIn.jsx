import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
	signInStart,
	signInSuccess,
	signInFailure,
} from "../redux/User/UserSlice";
import { useDispatch, useSelector } from "react-redux"; // in order to use the above logics we have to dispatch them so we need this too
import OAuth from "../components/OAuth";

const SignIn = () => {
	const [formData, setFormData] = useState({});
	// const [errorMsg, setErrorMsg] = useState(null);  alll they did was replacd by dispatch
	// const [loading, setLoading] = useState(false);
	const { loading, error: errorMsg } = useSelector((state) => state.user); //this is to get the loading and error from the user slice
	const dispatch = useDispatch();

	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value.trim() }); //the trim method removes whitespaces from the beginning and end of a string
	};
	const handleSubmit = async (e) => {
		//we have to make this async now since we are taking data to the db and it will take time to fetch the data
		e.preventDefault(); //defualt behaviour of a submit button is to cause th epage to reload, this prevents that

		//having handled the error if an empty field is provided in the backend, we have to do the same for the frontend as well
		if (!formData.email || !formData.password) {
			// return setErrorMsg("All fields are required"); replaced by dispatch
			dispatch(signInFailure("All fields are required")); //for a dispatch , whatever is inside the reducer's brakcet is the payload(ie goes for action.payload)

			//we could've handled this error with thte backend since we had made provisios for exactly this there too. but i guess this is to prevent watsed resource going to the backend
		}

		try {
			//setLoading(true); *this, and the next line, was working but it was replaced by the functions from userSlice* //the loadign starts when the form is submitted
			//setErrorMsg(null); // we have to remove the former errormsg value that might have been saved fromt he user's previous activity

			dispatch(signInStart());
			//encounterd a serious problem below, the cors was blocking from retrieving data from the
			//server even tho i had wriiten the proxy for the server in the vite.config.js So i had to do app.use(cors...) in server.js
			const res = await fetch("/api/auth/signin", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			const data = await res.json();
			console.log(res); //houses information on the response, if it was ok, the headers, status, etc
			console.log(data); //houses whatever IS RETURNED by backend

			//axios can also be used to get data from backend, so THERE ARE 2 WAYS YOU CAN RETRIEVE backend data. check *** project to see how i used axios.
			//axios automatically turns the formData to json but with fetch, you convert it yourself. but with axios, you have to install the dependency. so fetch is nice for smaller projects
			//ALSO, in fetch we had to get the json of the res. you just do res.data in axios
			//in axios, the above command would've been rep. as
			// try {
			// 	const res = await axios.post("/api/auth/signin", formData, {
			// 	  headers: { "Content-Type": "application/json" },
			// 	});
			// 	console.log(res.data);
			//   } catch (error) {
			// 	console.error("Failed to sign in:", error.response.status);
			//   }

			if (data.success === false) {
				//setLoading(false);
				// return setErrorMsg(data.message); *replaced by the dispatch code* // this is to get the error message the backend will show in case of sth like an already-existing username
				dispatch(signInFailure(data.message));
				//in this place, in the backend i explained that 'data' is now the 'err' returned there.
				//So the data.message works cuz i wrote err.message there. if i had written err.shsghsf I'd have to put data.shsghsf
			}
			// setLoading(false);  no longer requiresd since the dispatch functions have been written to set the loading to false
			if (res.ok) {
				dispatch(signInSuccess(data));
				navigate("/");
			}
		} catch (error) {
			//setErrorMsg(error.message); *replaced by dispatch*  //for errors we haven't already provided for usually from the client not backend eg user isn't with internet
			//setLoading(false);
			dispatch(signInFailure(error.message));
		}
	};
	console.log(formData);

	return (
		<div className="min-h-screen mt-20">
			<div
				className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row
    md:items-center"
			>
				{/*left */}
				<div className="flex-1">
					{/*for the fact that flex was used for the div that contains the left and right divs, this causes the divs to be unequal, the left div will be bigger than the right. so to ensure they take equal space, we use this flex-1 */}
					<Link
						to="/"
						className="font-semibold dark:text-white
        text-4xl"
					>
						<span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
							Ore's
						</span>
						Blog
					</Link>
					<p className="text-sm mt-5">
						You can sign in with your email and password or with Google
					</p>
				</div>
				{/*right */}
				<div className="flex-1">
					<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
						<div>
							<Label value="Your email" />
							<TextInput
								type="text"
								placeholder="Email"
								id="email"
								onChange={handleChange}
							/>
						</div>
						<div>
							<Label value="Your password" />
							<TextInput
								type="text"
								placeholder="Password"
								id="password"
								onChange={handleChange}
							/>
						</div>
						<Button
							gradientDuoTone="purpleToPink"
							type="submit"
							disabled={loading}
						>
							{loading ? (
								<>
									<Spinner size="sm" />
									<span className="pl-3"> Loading...</span>
								</>
							) : (
								"Sign In"
							)}
						</Button>
						<OAuth />
					</form>
					<div className="flex gap-2 mt-2 text-sm">
						<span> Don't have an account? </span>
						<Link to="/sign-up" className="text-blue-500">
							Sign Up
						</Link>
					</div>
					{errorMsg && (
						<Alert className="mt-5" color="failure" type="error">
							{errorMsg}
							{/* {errorMsg}  replaced by the dispatch*/}
						</Alert>
					)}
				</div>
			</div>
		</div>
	);
};

export default SignIn;
