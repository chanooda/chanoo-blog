import { WriteListCard } from "@ui/components/WriteListCard";
import { memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { getQuery, objetEmptyFilter, type Write } from "utils";
import type { GlobalError } from "../../../types/global";
import { useChanooQuery } from "../../libs/queryHook";

export const WriteList = memo(() => {
	const { search: query } = useLocation();

	const queryObject = getQuery(query, ["search", "seriesId", "tagId"]);

	const { data: writeList } = useChanooQuery<Write[], GlobalError>(
		["/write", objetEmptyFilter(queryObject)],
		{
			throwOnError: true,
		},
	);

	return (
		<div className="grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 p-3 w-full">
			{writeList?.data.data.map((write) => {
				return (
					<Link key={write.id} to={`/writes/${write.id}`}>
						<WriteListCard write={write} />
					</Link>
				);
			})}
		</div>
	);
});
