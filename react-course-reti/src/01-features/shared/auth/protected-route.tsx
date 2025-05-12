import { Navigate } from "react-router";
import { useAuth } from "@/04-hooks/use-auth";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {

	const { user } = useAuth();

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