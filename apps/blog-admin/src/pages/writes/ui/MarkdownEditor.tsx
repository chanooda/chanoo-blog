/* eslint-disable react/no-unstable-nested-components */

import { Button } from "@ui/components/button";
import { Popover, PopoverContent } from "@ui/components/popover";
import MDEditor, {
	commands,
	type ICommand,
	type MDEditorProps,
} from "@uiw/react-md-editor";
import { convertLink } from "markdown";
import {
	type KeyboardEvent,
	type MouseEvent,
	memo,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { ExternalLinkIcon, ImageIcon } from "ui-icon";
import { debounce } from "utils";
import { WriteEmbedAddModal } from "@/src/components/modal/WriteEmbedAddModal";
import { WriteImageAddModal } from "@/src/components/modal/WriteImageAddModal";
import {
	useMarkdownValue,
	useSetMarkdownValue,
} from "@/src/libs/markdownStore";

export type ModalType = "image" | "embed" | "";

export type MarkdownEditorProps = MDEditorProps;

const MemoMDEditor = memo(function MemoMDEditor({ ...props }: MDEditorProps) {
	return <MDEditor {...props} />;
});

export const MarkdownEditor = () => {
	const insertImageRef = useRef<HTMLButtonElement>(null);
	const insertEmbedRef = useRef<HTMLButtonElement>(null);
	const [value, setValue] = useState("");

	const [modalType, setModalType] = useState<ModalType>("");
	const [popoverOpen, setPopoverOpen] = useState(false);

	const setMarkdownValue = useSetMarkdownValue();
	const debounceRef = useRef<
		(((value: string) => void) & { cancel?: () => void }) | undefined
	>(undefined);

	useEffect(() => {
		debounceRef.current = debounce((value: string) => {
			setMarkdownValue(value);
		}, 500);

		return () => {
			debounceRef.current?.cancel?.();
		};
	}, [setMarkdownValue]);

	const markdownValueChangeHandler = (value?: string) => {
		setValue(value || "");
		debounceRef.current?.(value || "");
	};

	const contextMenuHandler = useCallback((e: MouseEvent<HTMLDivElement>) => {
		if (
			e.target === document.querySelector("textarea.w-md-editor-text-input")
		) {
			e.preventDefault();
			setPopoverOpen(true);
		}
	}, []);

	const closeOptionHandler = () => {
		setPopoverOpen(false);
	};

	const closeModalHandler = () => {
		closeOptionHandler();
		setModalType("");
	};

	const popoverContextMenuHandler = (e: MouseEvent<HTMLDivElement>) => {
		e.preventDefault();
		closeOptionHandler();
	};

	const insertImage: ICommand = {
		value: "image",
		name: "image",
		keyCommand: "image",
		children: ({ textApi, close }) => {
			return (
				<WriteImageAddModal
					open={modalType === "image"}
					onChooseImage={(url: string) => {
						textApi?.replaceSelection(`![image](${url})`);
						close();
						setModalType("");
					}}
					onClose={() => {
						closeModalHandler();
						close();
					}}
				/>
			);
		},
		render(command, disabled, executeCommand) {
			return (
				<Button
					ref={insertImageRef}
					size="icon"
					variant="outline"
					className="w-8 h-8"
					onClick={() => {
						executeCommand(command);
					}}
				>
					<ImageIcon fontSize="inherit" />
				</Button>
			);
		},
		execute() {
			setModalType((prev) => (prev === "image" ? "" : "image"));
		},
	};

	const embed: ICommand = {
		name: "embed",
		keyCommand: "embed",
		render: (command, disabled, executeCommand) => (
			<Button
				ref={insertEmbedRef}
				size="icon"
				variant="outline"
				className="w-8 h-8"
				onClick={() => {
					executeCommand(command);
				}}
			>
				<ExternalLinkIcon fontSize="inherit" />
			</Button>
		),
		children: ({ textApi, close }) => {
			return (
				<WriteEmbedAddModal
					open={modalType === "embed"}
					getEmbedUrl={(url: string) => {
						textApi?.replaceSelection(convertLink(url));
						close();
						closeModalHandler();
					}}
					onClose={() => {
						close();
						closeModalHandler();
					}}
				/>
			);
		},
		execute() {
			setModalType((prev) => (prev === "embed" ? "" : "embed"));
		},
	};

	const {
		bold,
		italic,
		hr,
		title,
		divider,
		unorderedListCommand,
		orderedListCommand,
		checkedListCommand,
	} = commands;

	const editorKeydownHandler = useCallback(
		(e: KeyboardEvent<HTMLDivElement>) => {
			if (e.metaKey || e.ctrlKey) {
				if (e.key === "i") {
					console.log("insert image");
					insertImageRef?.current?.click();
				}
				if (e.key === "e") {
					console.log("insert embed");
					insertEmbedRef?.current?.click();
				}
			}
		},
		[],
	);

	const newCommands = [
		{ ...bold, shortcuts: "" },
		{ ...italic, shortcuts: "" },
		{ ...hr, shortcuts: "" },
		{ ...title, shortcuts: "" },
		{ ...divider, shortcuts: "" },
		{ ...unorderedListCommand, shortcuts: "" },
		{ ...orderedListCommand, shortcuts: "" },
		{ ...checkedListCommand, shortcuts: "" },
		{ ...insertImage, shortcuts: "" },
		{ ...embed, shortcuts: "" },
	];
	// useEffect(() => {
	//   const editor = document.getElementById('editor');
	//   const keydownHandler = (e: KeyboardEvent) => {
	//     if (e.metaKey || e.ctrlKey) {
	//       if (e.key === 'i') {
	//         console.log('insert image');
	//         insertImageRef?.current?.click();
	//       }
	//       if (e.key === 'e') {
	//         console.log('insert embed');
	//         insertEmbedRef?.current?.click();
	//       }
	//     }
	//   };
	//   editor?.addEventListener('keydown', keydownHandler);

	//   () => editor?.removeEventListener('keydown', keydownHandler);
	// }, []);

	return (
		<>
			<MemoMDEditor
				commands={newCommands}
				height="100%"
				preview="edit"
				spellCheck={false}
				onContextMenu={contextMenuHandler}
				onKeyDown={editorKeydownHandler}
				value={value}
				onChange={markdownValueChangeHandler}
			/>

			<Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
				<PopoverContent>
					<div className="flex gap-2">
						<Button size="icon" onClick={() => insertImageRef.current?.click()}>
							<ImageIcon />
						</Button>
						<Button size="icon" onClick={() => insertEmbedRef.current?.click()}>
							<ExternalLinkIcon />
						</Button>
					</div>
				</PopoverContent>
			</Popover>
		</>
	);
};
