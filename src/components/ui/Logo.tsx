type Props = {
	showName?: boolean;
};
export default function Logo({ showName = true }: Props) {
	return (
		<div className="inline-flex items-center">
			<div className="bg-[#cd1818] flex-shrink-0 w-8 flex h-8 rounded-md justify-center items-center">
				<span className="text-white text-xl font-bold translate-y-[1px]">:D</span>
			</div>
			{showName && <span className="ml-2 font-bold">Dstore</span>}
		</div>
	);
}
