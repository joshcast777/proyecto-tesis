import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App.tsx";
import "@/styles/styles.scss";
// import { Toaster } from "sonner";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { LoginForm } from "./views/index.ts";
import AdminDashboard from "./views/Dashboard/AdminDashboard.tsx";

const router = createBrowserRouter([
	{
		path: "/auth",
		element: <LoginForm />
	},
	{
		path: "/admin-dashboard",
		element: <AdminDashboard />
	}
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
		{/* <BrowserRouter>
			<App />

			<Toaster expand={true} />
		</BrowserRouter> */}
	</React.StrictMode>
);
