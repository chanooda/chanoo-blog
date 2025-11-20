"use client";

import { WriteListCard } from "@ui/components/WriteListCard";
import Link from "next/link";
import type { Write } from "utils";
import { LINK } from "@/src/_base/config";

interface WriteListProps {
	writeList: Write[];
}

export function WriteList({ writeList }: WriteListProps) {
	return (
		<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
			{writeList?.map((write) => {
				return (
					<Link key={write.id} href={`${LINK.writes}/${write.id}`}>
						<WriteListCard write={write} />
					</Link>
				);
			})}
		</div>
	);
}
