import { AccessRoute } from "@/types";
import { Navigate, Outlet } from "react-router-dom";

export function PrivateRoute({ redirectTo, isAuthenticated: authenticated, children }: AccessRoute): React.ReactNode {
	return authenticated ? children || <Outlet /> : <Navigate to={redirectTo} />;
}

export function PublicRoute({ redirectTo, isAuthenticated: authenticated, children }: AccessRoute): JSX.Element {
	return authenticated ? <Navigate to={redirectTo} /> : children || <Outlet />;
}
