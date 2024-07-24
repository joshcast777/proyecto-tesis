import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

type TooltipLayoutProps = {
	content: React.ReactNode;
	triggerContent: React.ReactNode;
};

export default function TooltipLayout({ content, triggerContent }: TooltipLayoutProps): React.ReactNode {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>{triggerContent}</TooltipTrigger>

				<TooltipContent asChild>{content}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
