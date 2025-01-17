import React from "react";
import { Navbar, TextInput, Button, Dropdown, Avatar } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux"; //we want the sign in button at the header to show the user profile img, not sign in btn when he is signed in. that's the purpose of this
//the reason we needed useDispatch here is because we wanted to use the toggleTheme function in the Moon button
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOutSuccess } from "../redux/User/UserSlice";
import { useState, useEffect } from "react";

const Header = () => {
	const path = useLocation().pathname;
	const dispatch = useDispatch();
	const { currentUser } = useSelector((state) => state.user); //this is here so we caan know when the current user is available/exists. whent here is no current user, it means the person is not signed in
	//the below is to know which theme is currently active: now  the toggle function works but we wnat the toggle button icon to change to a sun when we are currently in the dark state
	const { theme } = useSelector((state) => state.theme);
	const [searchTerm, setSearchTerm] = useState("");
	const location = useLocation(); //using this for the search as well
	console.log(searchTerm);
	const navigate = useNavigate();

	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const searchTermFromUrl = urlParams.get("searchTerm");
		if (searchTermFromUrl) {
			setSearchTerm(searchTermFromUrl);
		}
	}, [location.search]); //location.search is the query string in the url

	console.log(currentUser);

	const handleSignOut = async () => {
		try {
			const res = await fetch("/api/user/signout", {
				method: "POST",
			});
			const data = await res.json();
			if (!res.ok) {
				console.log(data.message);
			} else {
				dispatch(signOutSuccess());
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const urlParams = new URLSearchParams(location.search);
		urlParams.set("searchTerm", searchTerm);
		const searchQuery = urlParams.toString();
		navigate(`/search?${searchQuery}`);
	};
	return (
		<Navbar className="border-b-2">
			<Link
				to="/"
				className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
			>
				<span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-red-500 rounded-lg text-white">
					Ore's
				</span>
				Blog
			</Link>
			<form className="flex items-center" onSubmit={handleSubmit}>
				{/* this element below is from flowbite*/}
				<TextInput
					type="text"
					placeholder="Search..."
					rightIcon={AiOutlineSearch}
					className="hidden lg:block"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
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
					{/* to understand this, you have to know how the selector, dispatch and reducer work hand in hand for this function above to work
					the selector is what watches the state of the variable. It tells the current state of the variable. this is why we passed it ino the theme variable and used it to check if the theme is light or dark in the next line of code
					the dispatch is what sends the action to the reducer you made in themeSlice. So it is not the dispatch that is doing the action, it is just like a mini API that sends tells the reducer in the 'backend' to perform whatever action 
					we have dictated there. and that's why we wrote in themeSlice that when the toggleTheme is called, it should change the state from light to dark or vice versa   
					and that's how it all relates to the reducer we write in the themeSlice. 
					ALL THE REDUCER IS DOING IS CHANGING THE STATE VARIABLE FROM 'LIGHT' TO 'DARK'. IT DOES NOT CHANGE THE COLOR OR SUN ICON. 
					IT IS WHEN WE COME HERE WE NOW USE THAT STATE TO CHANGE THE ICON  
					After doing all this the last hting is to add the <Provider /> and store to the main.jsx, it is the provider that connects your react app to the redux store*/}
					
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
						<Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
					</Dropdown>
				) : (
					<Link to="/sign-in">
						<Button gradientDuoTone="purpleToBlue" outline>
							Sign In
						</Button>
					</Link>
				)}
				<Navbar.Toggle />
				{/* the above is what shows the hamurger icon for smaller screen, then the navbar.collapse collapse inside this icon 
				if it is not a small scrren the hamburger will not show and the collapse doesn't collapse and just shows as like a horizontal list */}
			</div>
			<Navbar.Collapse>
				{" "}
				{/* we wanted these links to be before the things in the div so they had to be out of the div and the div shows after it cuz we set hte order to be 2*/}
				<Navbar.Link active={path === "/"} as={"div"}>
					{" "}
					{/*two anchor tags are not allowd inside each other so we specifed that the navbar.link was a div, so it's an anchor tag atill but now acts like a div*/}
					<Link to="/">Home</Link>
				</Navbar.Link>
				<Navbar.Link active={path === "/about"} as={"div"}>
					<Link to="/about">About</Link>
				</Navbar.Link>
				<Navbar.Link active={path === "/projects"} as={"div"}>
					<Link to="/projects"> Projects</Link>
				</Navbar.Link>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default Header;
