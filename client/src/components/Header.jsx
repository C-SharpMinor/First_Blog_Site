import React from "react";
import { Navbar, TextInput, Button } from "flowbite-react";
import "./header.css";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon } from "react-icons/fa";

const Header = () => {
    const path= useLocation().pathname;

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
				<Button className="w-12 h-10 hidden lg:block" color="gray" pill>
					<FaMoon />
				</Button>
				<Link to="/sign-in">
					<Button gradientDuoTone="purpleToBlue" outline>Sign In</Button>
				</Link>
			<Navbar.Toggle />
			</div>
				<Navbar.Collapse> {/* we wanted these links to be before the things in the div so they had to be out of the div and the div shows after it cuz we set hte order to be 2*/}
					<Navbar.Link active={path === "/"} as={'div'}> {/*two anchor tags are not allowd inside each other so we specifed that the navbar.collapse was a div, so it's an anchor tag atill but now acts like a div*/}
						<Link to="/">Home</Link>
					</Navbar.Link>
					<Navbar.Link active={path === "/about"} as={'div'}>
						<Link to="/about">About</Link>
					</Navbar.Link>
					<Navbar.Link active={path === "/projects"} as={'div'}>
						<Link to="/projects">Projects</Link>
					</Navbar.Link>
				</Navbar.Collapse>
		</Navbar>
	);
};

export default Header;
