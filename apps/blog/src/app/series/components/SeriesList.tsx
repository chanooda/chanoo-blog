"use client";

import { NextLink } from "@Components/common/NextLink";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import {
	MenuItem,
	Select,
	type SelectChangeEvent,
	Stack,
	Typography,
	WriteListItem,
} from "ui";
import type { Series, SeriesDetail } from "utils";

interface SeriesListProps {
	series: Series[];
	seriesDetail?: SeriesDetail;
}

interface SeriesListForm {
	seriesId: number;
}

export function SeriesList({ series, seriesDetail }: SeriesListProps) {
	const query = useSearchParams();
	const router = useRouter();
	const { register, watch } = useForm<SeriesListForm>({
		defaultValues: {
			seriesId: Number(query.get("seriesId")) || 0,
		},
	});

	const changeSeriesHandler = (e: SelectChangeEvent<number>) => {
		const seriesId = e.target.value;
		router.push(seriesId ? `/series?seriesId=${seriesId}` : "/series");
	};

	return (
		<Stack height="100%" maxWidth={800} minHeight="100%" mx="auto" width="100%">
			<Stack width={300}>
				<Select
					{...(register("seriesId"),
					{
						onChange: changeSeriesHandler,
					})}
					defaultValue={watch("seriesId")}
					size="small"
				>
					<MenuItem value={0}>시리즈를 선택해주세요.</MenuItem>
					{series?.map((seriesName) => (
						<MenuItem key={seriesName.id} value={seriesName.id}>
							{seriesName.name}
						</MenuItem>
					))}
				</Select>
			</Stack>
			{seriesDetail ? (
				<Stack gap={2} mt={4} width="100%">
					{seriesDetail.writes.map((write) => (
						<NextLink href={`/post/${write.id}`} key={write.id}>
							<WriteListItem write={write} />
						</NextLink>
					))}
				</Stack>
			) : (
				<Stack
					alignItems="center"
					height="100%"
					justifyContent="center"
					width="100%"
				>
					<Typography variant="h5">시리즈를 선택해주세요.</Typography>
				</Stack>
			)}
		</Stack>
	);
}
