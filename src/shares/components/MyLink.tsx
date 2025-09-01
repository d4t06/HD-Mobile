import { HTMLAttributeAnchorTarget, ReactNode } from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

type Props = {
	to: string;
	target?: HTMLAttributeAnchorTarget;
	activeClass?: string;
	children: ReactNode;
	className?: string;
};

export default function MyLink({
	className = "",
	activeClass = "text-[#cd1818] bg-[--a-5-cl]",
	to,
	target,
	children,
}: Props) {
	const resolved = useResolvedPath(to);
	const match = useMatch({ path: resolved.pathname, end: true });

	return (
		<Link
			target={target}
			className={`${className} ${match ? activeClass : ""}`}
			to={to}
		>
			{children}
		</Link>
	);
}
