import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const SignUp = () => {
	const [formData, setFormData] = useState({});
	const [errorMsg, setErrorMsg] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
	};
	const handleSubmit = async (e) => {
		//we have to make this async now since we are taking data to the db and it will take time to fetch the data
		e.preventDefault(); //defualt behaviour of a submit button is to cause th epage to reload, this prevents that

		//having handled the error if an empty field is provided in the backend, we have to do the same for the frontend as well
		if (!formData.username || !formData.email || !formData.password) {
			return setErrorMsg("All fields are required");
		}

		try {
			setLoading(true); //the loadign starts when the form is submitted
			setErrorMsg(null); // we have to remove the former errormsg value that might have been saved fromt he user's previous activity

			//encounterd a serious problem below, the cors was blocking from retrieving data from the
			//server even tho i had wriiten the proxy for the server in the vite.config.js So i had to do app.use(cors...) in server.js
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			const data = await res.json();

			if (data.success === false) {
				setLoading(false);
				return setErrorMsg(data.message); // this is to get the error message the backend will show in case of sth like an already-existing username
			}
			setLoading(false);
			if (res.ok) {
				navigate("/sign-in");
			}
		} catch (error) {
			setErrorMsg(error.message); //for errors we haven't already provided for usually from the client not backend eg user isn't with internet
			setLoading(false);
		}
	};
	console.log(formData);

	return (
		<div className="min-h-screen mt-20 ">
			<div
				className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row
    md:items-center"
			>
				{/*left */}
				<div className="flex-1">
					{/*for the fact that flex was used for the div that contains the left and right divs, this causes the divs to be unequal, the left div will be bigger than the right. so to ensure they take equal space, we use this flex-1 */}
					<Link
						to="/"
						className="font-bold font-semibold dark:text-white
        text-4xl"
					>
						<span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
							Ore's
						</span>
						Blog
					</Link>
					<p className="text-sm mt-5">This is my first full blog page</p>
				</div>
				{/*right */}
				<div className="flex-1">
					<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
						<div>
							<Label value="Your username" />
							<TextInput
								type="text"
								placeholder="Username"
								id="username"
								onChange={handleChange}
							/>
						</div>
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
								"Sign Up"
							)}
						</Button>
					</form>
					<div className="flex gap-2 mt-2 text-sm">
						<span> Have an account? </span>
						<Link to="/sign-in" className="text-blue-500">
							Sign In
						</Link>
					</div>
					{errorMsg && (
						<Alert className="mt-5" color="failure" type="error">
							{errorMsg}
						</Alert>
					)}
				</div>
			</div>
		</div>
	);
};

export default SignUp;
