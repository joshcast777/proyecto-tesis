import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "@/styles/styles.scss";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />

		<Toaster expand={true} />
	</React.StrictMode>
);
