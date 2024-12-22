import { useSelector } from "react-redux"; // to know if sb is authenticated or not
import { Outlet, Navigate } from "react-router-dom";

const AdminPrivateRoute = () => {
	const { currentUser } = useSelector((state) => state.user);
	return currentUser.isAdmin ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default AdminPrivateRoute;
