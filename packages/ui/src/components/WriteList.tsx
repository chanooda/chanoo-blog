import type { Write } from "utils";
import { WriteListCard } from "./WriteListCard";

interface WriteListProps {
	writeList: Write[];
}

export function WriteList({ writeList }: WriteListProps) {
	return (
		<div className="grid grid-cols-2 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-12 xl:grid-cols-12 gap-4 md:gap-6">
			{writeList?.map((write) => {
				return (
					<div
						key={write.id}
						className="col-span-2 sm:col-span-8 md:col-span-12 lg:col-span-12 xl:col-span-12"
					>
						<WriteListCard write={write} />
					</div>
				);
			})}
		</div>
	);
}
