import { create } from "zustand";

interface MarkdownStore {
	value: string;
	setValue: (value: string) => void;
	reset: () => void;
}
const useMarkdownStore = create<MarkdownStore>((set) => ({
	value: "",
	setValue: (value: string) => {
		set({ value });
	},
	reset: () => {
		set({ value: "" });
	},
}));

export const useMarkdownValue = () => {
	return useMarkdownStore((state) => state.value);
};

export const useSetMarkdownValue = () => {
	return useMarkdownStore((state) => state.setValue);
};

export const useResetMarkdown = () => {
	return useMarkdownStore((state) => state.reset);
};
