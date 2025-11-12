import { create } from "zustand";

interface MarkdownStore {
	value: string;
	setValue: (value: string) => void;
}
const useMarkdownStore = create<MarkdownStore>((set) => ({
	value: "",
	setValue: (value: string) => {
		console.log(value);
		set({ value });
	},
}));

export const useMarkdownValue = () => {
	return useMarkdownStore((state) => state.value);
};

export const useSetMarkdownValue = () => {
	return useMarkdownStore((state) => state.setValue);
};
