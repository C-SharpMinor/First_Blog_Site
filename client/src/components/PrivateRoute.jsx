import React from "react";
import { useSelector } from "react-redux"; // to know if sb is authenticated or not
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
	const { currentUser } = useSelector((state) => state.user);
	return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;

//process: aim was to make this so the dashboard is private ie you can't gain access unless signed in
// went to app.jsx to wrap the dashboard int e private route
//line * means if there is a current user, you can show it's children using htat <outlet /> which is why wrapped the dashboard in the private comp before

//Navigate imported here is different from useNavigate: Navigate is a component for rediretcing and useNavigate is a hook we've been assigning to a variable and that variable is now used to redirect
