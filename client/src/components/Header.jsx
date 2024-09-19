import React from "react";
import {
	Navbar,
	TextInput,
	Button,
	Dropdown,
	DropdownItem,
	Avatar,
} from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux"; //we want the sign in button at the header to show the user profile img, not sign in btn when he is signed in. that's the purpose of this
//the reason we needed useDispatch her is because we wanted to use the toggleTheme function in the MOon button
import { toggleTheme } from "../redux/theme/themeSlice";

const Header = () => {
	const path = useLocation().pathname;
	const dispatch = useDispatch();
	const { currentUser } = useSelector((state) => state.user); //this is here so we caan know when the current user is available/exists. whent here is no current user, it means the person is not signed in
	//the below is to know which theme is currently active: now  the toggle function works but we wnat the toggle button icon to change to a sun when we are currently in the dark state
	const { theme } = useSelector((state) => state.theme);
	console.log(currentUser);
	return (
		<Navbar className="border-b-2">
			<Link
				to="/"
				className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
			>
				<span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
					Ore's
				</span>
				Blog
			</Link>
			<form className="flex items-center">
				{/* this element below is from flowbite*/}
				<TextInput
					type="text"
					placeholder="Search..."
					rightIcon={AiOutlineSearch}
					className="hidden lg:block"
				/>
			</form>
			<Button className="w-12 h-10 lg:hidden" color="gray" pill>
				{/* this is from flowbite*/}
				<AiOutlineSearch />
			</Button>
			<div className="flex gap-2 md:order-2">
				<Button
					className="w-12 h-10 hidden lg:block"
					color="gray"
					pill
					onClick={() => dispatch(toggleTheme())}
				>
					{theme === "light" ? <FaMoon /> : <FaSun />}
				</Button>
				{currentUser ? (
					<Dropdown
						arrowIcon={false} //so the dropdown does not show an arrow icon since we'll be putting a picture there
						inline
						label={<Avatar alt="User" rounded img={currentUser.profilePic} />}
					>
						<Dropdown.Header>
							<span className="block text-sm">@{currentUser.username} </span>
							<span className="block text-sm font-medium truncate">
								{currentUser.email}
							</span>
						</Dropdown.Header>
						<Link to={"/dashboard?tab=profile"}>
							<Dropdown.Item> Profile</Dropdown.Item>
						</Link>
						<Dropdown.Divider />
						<Dropdown.Item>Sign Out</Dropdown.Item>
					</Dropdown>
				) : (
					<Link to="/sign-in">
						<Button gradientDuoTone="purpleToBlue" outline>
							Sign In
						</Button>
					</Link>
				)}
				<Navbar.Toggle />
			</div>
			<Navbar.Collapse>
				{" "}
				{/* we wanted these links to be before the things in the div so they had to be out of the div and the div shows after it cuz we set hte order to be 2*/}
				<Navbar.Link active={path === "/"} as={"div"}>
					{" "}
					{/*two anchor tags are not allowd inside each other so we specifed that the navbar.collapse was a div, so it's an anchor tag atill but now acts like a div*/}
					<Link to="/">Home</Link>
				</Navbar.Link>
				<Navbar.Link active={path === "/about"} as={"div"}>
					<Link to="/about">About</Link>
				</Navbar.Link>
				<Navbar.Link active={path === "/projects"} as={"div"}>
					<Link to="/projects">Projects</Link>
				</Navbar.Link>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default Header;
