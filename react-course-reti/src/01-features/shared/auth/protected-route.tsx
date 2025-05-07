import { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "@/06-providers/auth/auth-context";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {

	const { user } = useContext(AuthContext);

	if (!user?.isAdmin) {
	   return <Navigate to='/'></Navigate>
	}

	return (
		<>
			{children}
		</>
	)
}
export default ProtectedRoute;