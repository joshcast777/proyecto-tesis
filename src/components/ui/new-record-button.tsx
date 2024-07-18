import { CirclePlus } from "lucide-react";
import { Button } from "./button";

type NewRecordButtonProps = {
	newButtonLabel: string;
	newButtonClick?: () => void;
};

export default function NewRecordButton({ newButtonLabel, newButtonClick }: NewRecordButtonProps): React.ReactNode {
	return (
		<div className="container mt-16 flex items-center justify-end gap-5">
			<Button
				className="gap-2 bg-blue-700 hover:bg-blue-800"
				onClick={(): void => {
					if (newButtonClick !== undefined) {
						newButtonClick();
					}
				}}
			>
				<CirclePlus />
				{newButtonLabel}
			</Button>
		</div>
	);
}
