import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@/styles/styles.scss";
import { Toaster } from "sonner";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<App />

			<Toaster expand={true} />
		</BrowserRouter>
	</React.StrictMode>
);
