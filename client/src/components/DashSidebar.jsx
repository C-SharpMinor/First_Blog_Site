import React, { useState, useEffect } from "react";
import { Sidebar } from "flowbite-react";
import { useLocation } from "react-router-dom";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { Link } from "react-router-dom";

const DashSidebar = () => {
	//copied the below that's before the return from Dashboard.jsx cuz we need to be able to get the tab query at the url
	const location = useLocation();
	const [tab, setTab] = useState("");
	useEffect(() => {
		const urlParams = new URLSearchParams(location.search);
		const tabFromUrl = urlParams.get("tab");
		// console.log(tabFromUrl); //so you can see in the console that we are getting the tab submitted in the url
		if (tabFromUrl) {
			setTab(tabFromUrl);
		}
	}, [location.search]);

	return (
		// <div>DashSidebar</div>  first we did this to make sure that the component was working
		<Sidebar className="w-full md:w-56">
			<Sidebar.Items>
				<Sidebar.ItemGroup>
					<Link to="/dashboard?tab=profile">
						<Sidebar.Item
							active={tab === "profile"}
							icon={HiUser}
							label={"User"}
							labelColor="dark"
						>
							Profile
						</Sidebar.Item>
					</Link>
					<Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer">
						Sign Out
					</Sidebar.Item>
				</Sidebar.ItemGroup>
			</Sidebar.Items>
		</Sidebar>
	);
};

export default DashSidebar;
