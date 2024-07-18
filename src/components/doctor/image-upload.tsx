import { cn } from "@/lib";

type ImageUploadProps = {
	uploadedImageSrc: string;
};

export default function ImageUpload({ uploadedImageSrc }: ImageUploadProps): React.ReactNode {
	return (
		<div className="flex aspect-[9/14] items-center justify-center rounded border border-gray-500">
			<img
				className={cn("h-full w-full rounded", {
					"object-cover": uploadedImageSrc.includes("assets"),
					"object-contain": !uploadedImageSrc.includes("assets")
				})}
				src={uploadedImageSrc}
				alt="Uploaded image"
			/>
		</div>
	);
}
