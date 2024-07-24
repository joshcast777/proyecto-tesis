import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import PoseEstimationRoute from "./routes/PoseEstimationRoute";
import "./styles/styles.scss";

export default function App(): React.ReactNode {
	return (
		<BrowserRouter>
			<PoseEstimationRoute />

			<Toaster expand={true} />
		</BrowserRouter>
	);
}
