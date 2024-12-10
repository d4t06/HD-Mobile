import { Button } from "@/components";
import Modal, { ModalRef } from "@/components/Modal";
import Popover, {
	PopoverContent,
	PopoverTrigger,
	TriggerRef,
} from "@/components/Popover";
import { CodeBracketIcon, DocumentTextIcon, PlusIcon } from "@heroicons/react/16/solid";
import { useRef, useState } from "react";
import { useImportCategory } from "../../_hooks/useImportCategory";
import AddItem from "@/components/Modal/AddItem";
import JsonInput from "@/components/Modal/JsonInput";
import useCategoryAction from "../../_hooks/useCategoryAction";

type Modal = "Form" | "Json";

export default function AddCategoryBtn() {
	const [modal, setModal] = useState<Modal | "">("");

	const modalRef = useRef<ModalRef>(null);
	const triggerRef = useRef<TriggerRef>(null);

	const { actions, isFetching } = useCategoryAction({ modalRef });
	const { status, setStatus, submit } = useImportCategory({ modalRef });

	const closeModal = () => {
		return modalRef.current?.close();
	};

	const openModal = (modal: Modal) => {
		setModal(modal);
		triggerRef.current?.close();
		modalRef.current?.open();
	};

	const handleAddCategory = async (variant: "form" | "json", value: string) => {
		switch (variant) {
			case "form": {
				const categorySchema: CategorySchema = {
					attribute_order: "",
					name: value,
					name_ascii: "",
					hidden: false,
				};

				await actions({ type: "Add", category: categorySchema });
				break;
			}

			case "json": {
				await submit(value);
			}
		}
	};

	const renderModal = () => {
		if (!modal) return;

		switch (modal) {
			case "Form":
				return (
					<AddItem
						loading={isFetching}
						title="Add category"
						cbWhenSubmit={(value) => handleAddCategory("form", value)}
						closeModal={closeModal}
					/>
				);
			case "Json":
				return (
					<JsonInput
						status={status}
						title="Import category"
						closeModal={closeModal}
						submit={(v) => handleAddCategory("json", v)}
					>
						{status === "fetching" && <p className="text-lg">... Importing</p>}
					</JsonInput>
				);
			default:
				return <h1 className="text-3xl">Not thing to show</h1>;
		}
	};

	const classes = {
		menuItem:
			"px-3 py-1 flex font-[500] items-center hover:text-[#cd1818] space-x-1 hover:bg-[#f4f6f8]",
	};

	return (
		<>
			<Popover>
				<PopoverTrigger ref={triggerRef}>
					<Button
						className="flex-shrink-0 h-full px-2"
						colors={"third"}
						size={"clear"}
					>
						<PlusIcon className="w-5" />
						<span className="hidden sm:block ml-1">Add category</span>
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className="w-full translate-y-[8px]"
					appendTo="parent"
					animationClassName="origin-top"
				>
					<div className="overflow-hidden relative flex flex-col rounded-lg py-3 bg-[#fff] shadow-[2px_2px_10px_0_rgba(0,0,0,.15)] text-[#333]">
						<button onClick={() => openModal("Json")} className={classes.menuItem}>
							<CodeBracketIcon className="w-5" />
							<span>Json</span>
						</button>

						<button onClick={() => openModal("Form")} className={classes.menuItem}>
							<DocumentTextIcon className="w-5" />
							<span>Form</span>
						</button>
					</div>
				</PopoverContent>
			</Popover>

			<Modal ref={modalRef} variant="animation" onClose={() => setStatus("input")}>
				{renderModal()}
			</Modal>
		</>
	);
}
