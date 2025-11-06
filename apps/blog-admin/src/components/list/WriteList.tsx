import { Link, useLocation } from "react-router-dom";
import { Grid2, WriteListCard } from "ui";
import { getQuery, objetEmptyFilter, type Write } from "utils";
import { useChanooQuery } from "../../libs/queryHook";
import type { GlobalError } from "../../types/global";

export function WriteList() {
	const { search: query } = useLocation();

	const queryObject = getQuery(query, ["search", "seriesId", "tagId"]);

	const { data: writeList } = useChanooQuery<Write[], GlobalError>(
		["/write", objetEmptyFilter(queryObject)],
		{
			throwOnError: true,
		},
	);

	return (
		<Grid2
			columns={{ xs: 2, sm: 8, md: 12, lg: 12, xl: 12 }}
			container
			p={3}
			spacing={{ xs: 2, md: 3 }}
			width="100%"
		>
			{writeList?.data.data.map((write) => {
				return (
					<Grid2 key={write.id} size={{ lg: 4, md: 6, sm: 8, xl: 3, xs: 2 }}>
						<Link to={`/post/${write.id}`}>
							<WriteListCard write={write} />
						</Link>
					</Grid2>
				);
			})}
		</Grid2>
	);
}
