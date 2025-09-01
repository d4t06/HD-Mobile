import type { ReactNode } from "react";
import Image from "../ui/Image";

type Upload = {
	variant: "upload";
	image: ImageTypeSchema;
};

type GalleryItem = {
	variant: "gallery-item";
	image: ImageType;
	setActive: () => void;
	active: boolean;
};

type Props = (Upload | GalleryItem) & {
	children: ReactNode;
};

export default function GalleryItem({ children, ...props }: Props) {
	const classes = {
		imageContainer: "relative pt-[100%]",
		imageFrame:
			"absolute flex w-full items-center justify-center bg-[#f1f1f1] inset-0 rounded-[8px] border-[2px] border-[#ccc] hover:border-[#cd1818] overflow-hidden",
	};

	return (
		<div className="px-[4px] relative w-1/4 sm:w-1/6 lg:w-1/8 mt-[8px]">
			<div className={classes.imageContainer}>
				<div
					onClick={props.variant === 'gallery-item' ? props.setActive : undefined}
					className={`${classes.imageFrame}
                      ${props.variant === 'gallery-item' && props.active ? "border-[#cd1818]" : ""}`}
				>
					<Image
						className={`w-full h-auto ${props.variant === 'gallery-item' ? "" : "opacity-[.4]"}`}
						src={props.image.image_url}
					/>
					{children}
				</div>
			</div>
		</div>
	);
}
