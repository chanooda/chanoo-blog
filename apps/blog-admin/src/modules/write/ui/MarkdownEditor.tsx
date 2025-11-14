/* eslint-disable react/no-unstable-nested-components */

import { Button } from "@ui/components/button";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@ui/components/context-menu";
import MDEditor, {
	commands,
	type ICommand,
	type MDEditorProps,
} from "@uiw/react-md-editor";
import { convertLink } from "markdown";
import {
	type KeyboardEvent,
	memo,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { ExternalLinkIcon, ImageIcon } from "ui-icon";
import { debounce } from "utils";
import { WriteEmbedAddModal } from "@/src/base/ui/modal/WriteEmbedAddModal";
import { WriteImageAddModal } from "@/src/base/ui/modal/WriteImageAddModal";
import {
	useMarkdownValue,
	useSetMarkdownValue,
} from "@/src/modules/write/libs/markdownStore";

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

	const setMarkdownValue = useSetMarkdownValue();
	const markdownValue = useMarkdownValue();

	const debounceSetMarkdownValue = useCallback(
		debounce((value: string) => setMarkdownValue(value), 500),
		[],
	);

	const markdownValueChangeHandler = (value?: string) => {
		setValue(value || "");
		debounceSetMarkdownValue(value || "");
	};

	const closeModalHandler = () => {
		setModalType("");
	};

	const insertImage: ICommand = {
		value: "image",
		name: "image",
		keyCommand: "image",
		children: ({ textApi, close }) => {
			const replaceSelection = textApi?.replaceSelection
				? textApi.replaceSelection.bind(textApi)
				: null;
			return (
				<WriteImageAddModal
					key={modalType}
					open={modalType === "image"}
					onChooseImage={(url: string) => {
						if (replaceSelection) {
							replaceSelection(`![image](${url})`);
						}
						close();
						closeModalHandler();
					}}
					onOpenChange={() => {
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
			const replaceSelection = textApi?.replaceSelection
				? textApi.replaceSelection.bind(textApi)
				: null;
			return (
				<WriteEmbedAddModal
					key={modalType}
					open={modalType === "embed"}
					getEmbedUrl={(url: string) => {
						if (replaceSelection) {
							replaceSelection(convertLink(url));
						}
						close();
						closeModalHandler();
					}}
					onOpenChange={() => {
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

	useEffect(() => {
		if (markdownValue) {
			setValue(markdownValue);
		}
	}, [markdownValue]);

	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>
				<MemoMDEditor
					className="[&_.w-md-editor-text]:h-full"
					commands={newCommands}
					height="100%"
					preview="edit"
					spellCheck={false}
					onKeyDown={editorKeydownHandler}
					value={value}
					autoFocus
					onChange={markdownValueChangeHandler}
					extraCommands={[]}
					autoFocusEnd
				/>
			</ContextMenuTrigger>
			<ContextMenuContent className="z-50">
				<ContextMenuItem onClick={() => insertImageRef.current?.click()}>
					<ImageIcon />
				</ContextMenuItem>
				<ContextMenuItem onClick={() => insertEmbedRef.current?.click()}>
					<ExternalLinkIcon />
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
};
