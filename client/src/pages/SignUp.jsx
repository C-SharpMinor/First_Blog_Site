import { Button, Label, TextInput } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
	return (
		<div className="min-h-screen mt-20 ">
			<div
				className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row
    md:items-center"
			>
				{/*left */}
				<div className="flex-1"> {/*for the fact that flex was used for the div that contains the left and right divs, this causes the divs to be unequal, the left div will be bigger than the right. so to ensure they take equal space, we use this flex-1 */}
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
				<form className="flex flex-col gap-4">
					<div>
						<Label value="Your username" />
						<TextInput type="text" placeholder="Username" id="username" />
					</div>
					<div>
						<Label value="Your email" />
						<TextInput type="text" placeholder="Email" id="email" />
					</div>
					<div>
						<Label value="Your password" />
						<TextInput type="text" placeholder="Password" id="password" />
					</div>
          <Button gradientDuoTone='purpleToPink' type='submit'>
            Sign Up
          </Button>
				</form>
        <div className="flex gap-2 mt-2 text-sm">
        <span> Have an account? </span>
        <Link to="/sign-in" className="text-blue-500"> Sign In</Link>          
        </div>
			</div>
			</div>
      
		</div>
	);
};

export default SignUp;
