import { Navigate } from "react-router";
import { useAuth } from "@/04-hooks/use-auth";
import { UnauthorizedError } from "../errors/custom-exceptions/unauthorized-exception";

interface ProtectedRouteProps {
	children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {

	const { user } = useAuth();

	if (user && !user.isAdmin) {
	  throw new UnauthorizedError("Unauthorized");
	}

	return (
		<>
			{children}
		</>
	)
}
export default ProtectedRoute;