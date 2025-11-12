import {
	type ChangeEvent,
	type ComponentProps,
	forwardRef,
	type KeyboardEvent,
	useEffect,
	useRef,
	useState,
} from "react";
import { Badge } from "./badge";
import { Input } from "./input";

interface SelectOption {
	label: string;
	value: string;
}

interface MultiSelectInputProps
	extends Omit<ComponentProps<"input">, "children"> {
	initialValue?: string[];
	selectOptionList?: SelectOption[];
}

export const MultiSelectInput = forwardRef<
	HTMLInputElement,
	MultiSelectInputProps
>(({ selectOptionList = [], initialValue = [], ...props }, ref) => {
	const isInitialValueSetting = useRef<boolean>(true);
	const selectedListRef = useRef<HTMLInputElement>(null);
	const nativeOptionList = useRef<string[]>([]);
	const [input, setInput] = useState("");
	const [selectedValues, setSelectTedValues] = useState<string[]>([]);
	const [showSelectOption, setShowSelectOption] = useState(false);

	const addSelectedValues = (value: string) => {
		if (!value) return;

		setSelectTedValues((prev) => {
			if (!prev.includes(value)) {
				nativeOptionList.current = [...prev, value];
				return [...prev, value];
			}
			return [...prev];
		});

		setInput(() => "");
	};

	const changeInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		if (value.length > 30) return;
		setInput(value);
	};

	const deleteSelectedValue = (value: string, index: number) => {
		const copySelectedValue = [...selectedValues];
		const nativeOption = document.getElementById(`option-${value}`);
		nativeOption?.click();
		copySelectedValue.splice(index, 1);
		setSelectTedValues(copySelectedValue);
	};

	const inputKeyDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement;

		if (e.key === "Enter" && e.nativeEvent.isComposing === false) {
			const { value } = target;
			addSelectedValues(value);
		}
	};

	const clickOptionListHandler = (value: string) => {
		addSelectedValues(value);
	};

	useEffect(() => {
		const selectedList = selectedListRef.current;
		if (selectedList && selectedList.scrollHeight > 72) {
			selectedList.scrollTop = selectedList.scrollHeight + 32;
		}
	}, [selectedValues]);

	useEffect(() => {
		if (isInitialValueSetting.current && initialValue.length > 0) {
			isInitialValueSetting.current = false;
			return;
		}
		const nativeOption = document.getElementById(
			`option-${selectedValues[selectedValues.length - 1]}`,
		);
		nativeOption?.click();
	}, [nativeOptionList?.current]);

	useEffect(() => {
		isInitialValueSetting.current = true;
		setSelectTedValues(initialValue);
		nativeOptionList.current = initialValue;
	}, [initialValue]);

	return (
		<div className="w-full flex flex-col">
			<div className="flex flex-row w-full">
				<div className="w-full flex flex-row flex-wrap gap-1">
					{selectedValues.length > 0 && (
						<div
							className="flex flex-row flex-wrap gap-1 max-h-72 overflow-auto"
							ref={selectedListRef}
						>
							{selectedValues?.map((selectedValue, index) => (
								<Badge
									key={selectedValue}
									onClick={() => deleteSelectedValue(selectedValue, index)}
								>
									selectedValue
								</Badge>
							))}
						</div>
					)}
					<div className="relative w-full">
						<Input
							onFocus={() => setShowSelectOption(true)}
							onBlur={() => setShowSelectOption(false)}
							placeholder="태그를 입력하세요."
							className="w-full"
							type="text"
							value={input}
							onChange={changeInputHandler}
							onKeyDown={inputKeyDownHandler}
						/>
						{showSelectOption && selectOptionList.length > 0 && (
							<div className="bg-white border border-gray-400 left-0 max-h-45 overflow-auto absolute top-100% w-full z-999">
								{selectOptionList?.map((selectOption) => (
									<Badge
										key={selectOption.value}
										onClick={(e) => {
											e.stopPropagation();
											clickOptionListHandler(selectOption.value);
										}}
									>
										{selectOption.label}
									</Badge>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
			{nativeOptionList?.current.map((value) => (
				<input
					id={`option-${value}`}
					type="checkbox"
					{...props}
					hidden
					key={value}
					ref={ref}
					value={value}
				/>
			))}
		</div>
	);
});
