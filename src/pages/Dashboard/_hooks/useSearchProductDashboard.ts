import { usePrivateRequest } from "@/hooks";
import { setProducts } from "@/store/productsSlice";
import { sleep } from "@/utils/appHelper";
import { Dispatch, SetStateAction, useState } from "react";
import { useDispatch } from "react-redux";

type Props = {
	setTab: Dispatch<SetStateAction<string>>;
};

export default function useSearchProductDashboard({ setTab }: Props) {
	const dispatch = useDispatch();
	const [isFetching, setIsFetching] = useState(false);

	const [value, setValue] = useState("");

	const privateRequest = usePrivateRequest();

	const search = async () => {
		try {
			setIsFetching(true);

			if (import.meta.env.DEV) await sleep(300);

			const res = await privateRequest.get(`/product-management/search?q=${value}`);

			const payload = res.data.data as { products: Product[]; count: number };

			if (res.data.data) {
				setTab("search");

				dispatch(
					setProducts({
						variant: "replace",
						payload: {
							products: payload.products,
							count: payload.count,
						},
					}),
				);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsFetching(false);
		}
	};

	return { isFetching, setValue, search, value };
}
