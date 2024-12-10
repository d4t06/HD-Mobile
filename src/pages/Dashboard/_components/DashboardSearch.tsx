import { ArrowPathIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/16/solid";
import useSearchProductDashboard from "../_hooks/useSearchProductDashboard";
import { Dispatch, FormEventHandler, SetStateAction } from "react";
import { Button } from "@/components";

type Props = {
	setTab: Dispatch<SetStateAction<string>>;
};

export default function DashboardSearch({ setTab }: Props) {
	const { setValue, isFetching, value, search } = useSearchProductDashboard({ setTab });

	const handleFormSubmit: FormEventHandler = (e) => {
		e.preventDefault();
		search();
	};

	const handleClearSearch = () => {
		console.log("clear");

		setTab("");
		setValue("");
	};

	const classes = {
		form: "flex space-x-2",
		container:
			"relative border bg-white border-black/15 flex items-center rounded-[10px] px-[10px]",
		input: "placeholder:text-[#80880] bg-white py-[5px] px-[10pox] w-full font-[500] outline-none text-[#333]",
	};

	return (
		<>
			<form className={classes.form} onSubmit={handleFormSubmit}>
				<div className={classes.container}>
					<input
						value={value}
						onChange={(e) => setValue(e.target.value)}
						type="text"
						className={classes.input}
						placeholder="iphone 15..."
					/>

					{value && (
						<div className="absolute right-2 flex items-center">
							{isFetching ? (
								<ArrowPathIcon className="text-[#808080] w-6 animate-spin" />
							) : (
								<button type="button" className="h-full" onClick={() => handleClearSearch()}>
									<XMarkIcon className="text-[#808080] w-6 " />
								</button>
							)}
						</div>
					)}
				</div>

				<Button size={"clear"} className="px-3" colors={"third"} type="submit">
					<MagnifyingGlassIcon className="w-6" />
				</Button>
			</form>
		</>
	);
}
