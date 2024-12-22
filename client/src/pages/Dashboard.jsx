import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashboardComp from "../components/DasboardComp";

const Dashboard = () => {
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
		<div className="min-h-screen flex flex-col md:flex-row">
			<div className="md:w-56">
				{/* Sidebar */}
				<DashSidebar />
			</div>
			{/* Profile, etc. */}
			{tab === "profile" && <DashProfile />}
			{/* for 'posts' tab */}
			{tab === "posts" && <DashPosts />}
			{/* for users tab */}
			{tab === "users" && <DashUsers />}
			{/* for comments */}
			{tab === "comments" && <DashComments />}
			{/* for dashboard comp */}
			{tab === "dash" && <DashboardComp />}
		</div>
	);
};
//the importance of lines the useState and useEfect logic is to be able to retrieve the tab query from the url as required so the page can change as the tab selected changes
export default Dashboard;
