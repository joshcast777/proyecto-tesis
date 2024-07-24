import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";

type DialogLayoutProps = {
	description?: string;
	title?: string;
	dialogCloseContent?: React.ReactNode;
	content: React.ReactNode;
	footerContent?: React.ReactNode;
	headerContent?: React.ReactNode;
	triggerContent: React.ReactNode;
};

export default function DialogLayout({ title, description, dialogCloseContent, content, footerContent, headerContent, triggerContent }: DialogLayoutProps): React.ReactNode {
	return (
		<Dialog>
			<DialogTrigger asChild>{triggerContent}</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					{headerContent !== undefined ? (
						headerContent
					) : (
						<>
							<DialogTitle>{title}</DialogTitle>

							<DialogDescription>{description}</DialogDescription>
						</>
					)}
				</DialogHeader>

				{content}

				<DialogFooter className="sm:justify-start">
					{footerContent !== undefined && footerContent}

					{dialogCloseContent !== undefined && <DialogClose asChild>{dialogCloseContent}</DialogClose>}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
