type ToastContentProps = {
	title: string;
	message: string;
};

export function ToastContent({ title, message }: ToastContentProps): React.ReactNode {
	return (
		<div className="text-gray-50">
			<h5 className="text-lg font-semibold">{title}</h5>

			<p className="text-base">{message}</p>
		</div>
	);
}
