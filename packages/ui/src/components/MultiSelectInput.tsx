import { Chip, Input, MenuItem, Stack } from "@mui/material";
import {
	type ChangeEvent,
	type ComponentProps,
	forwardRef,
	type KeyboardEvent,
	type MouseEvent,
	useEffect,
	useRef,
	useState,
} from "react";
import { useOnClickOutside } from "usehooks-ts";

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
	const inputWrapperRef = useRef<HTMLDivElement>(null);
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

	const clickInputWrapperHandler = (e: MouseEvent<HTMLDivElement>) => {
		setShowSelectOption((prev) => !prev);
	};

	const clickOptionListHandler = (value: string) => {
		addSelectedValues(value);
	};

	useOnClickOutside(inputWrapperRef, (e) => {
		setShowSelectOption(false);
	});

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
		<Stack width="100%">
			<Stack direction="row" width="100%">
				<Stack direction="row" flexWrap="wrap" gap={1}>
					{selectedValues.length > 0 && (
						<Stack
							direction="row"
							flexWrap="wrap"
							gap={1}
							maxHeight={72}
							overflow="auto"
							ref={selectedListRef}
						>
							{selectedValues?.map((selectedValue, index) => (
								<Chip
									key={selectedValue}
									label={selectedValue}
									onClick={() => deleteSelectedValue(selectedValue, index)}
								/>
							))}
						</Stack>
					)}
					<Stack
						position="relative"
						ref={inputWrapperRef}
						sx={{ width: 200, minWidth: 200 }}
						onClick={clickInputWrapperHandler}
					>
						<Input
							fullWidth
							placeholder="태그를 입력하세요."
							sx={{ width: "100%" }}
							type="text"
							value={input}
							onChange={changeInputHandler}
							onKeyDown={inputKeyDownHandler}
						/>
						{showSelectOption && selectOptionList.length > 0 && (
							<Stack
								bgcolor="white"
								border={({ palette }) => `1px solid ${palette.grey[400]}`}
								left={0}
								maxHeight={180}
								overflow="auto"
								position="absolute"
								top="100%"
								width="100%"
								zIndex={999}
							>
								{selectOptionList?.map((selectOption) => (
									<MenuItem
										key={selectOption.value}
										value={selectOption.value}
										onClick={(e) => {
											e.stopPropagation();
											clickOptionListHandler(selectOption.value);
										}}
									>
										{selectOption.label}
									</MenuItem>
								))}
							</Stack>
						)}
					</Stack>
				</Stack>
			</Stack>
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
		</Stack>
	);
});
