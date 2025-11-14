"use client";

import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ui/components/select";
import { Separator } from "@ui/components/separator";
import { WriteListCard } from "@ui/components/WriteListCard";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import {
	buildQueryString,
	getQuery,
	type Series,
	type Tag,
	type Write,
	type WriteFilterForm,
} from "utils";
import { LINK } from "@/src/_base/config";

interface PostListProps {
	series: Series[];
	tags: Tag[];
	writes: Write[];
}

export function WriteListWithFilter({ writes, series, tags }: PostListProps) {
	const query = useSearchParams();
	const router = useRouter();

	const queryObject = getQuery(query.toString(), [
		"search",
		"seriesId",
		"tagId",
	]);

	const { watch, control, reset, register, handleSubmit } =
		useForm<WriteFilterForm>({
			defaultValues: { ...queryObject },
		});

	const { search: _search, seriesId: _seriesId, tagId: _tagId } = watch();

	const resetQuires = () => {
		reset();
		router.push(LINK.home);
	};

	const setQueries = ({
		search = _search,
		seriesId = _seriesId,
		tagId = _tagId,
	}: Partial<WriteFilterForm>) => {
		const queryString = buildQueryString({
			search,
			seriesId,
			tagId,
		});
		router.push(`${LINK.home}?${queryString}`);
	};

	const searchSubmitHandler = handleSubmit((formData) => {
		setQueries(formData);
	});

	const changeSeriesHandler = (seriesId: string) => {
		setQueries({ seriesId });
	};

	const changeTagHandler = (tagId: string) => {
		setQueries({ tagId });
	};

	return (
		<div className="w-full h-full">
			<div className="flex flex-col lg:flex-row min-h-full">
				<div className="gap-2 flex-col min-w-60 hidden lg:flex border-r p-4">
					<form
						className="w-full flex flex-col gap-4"
						onSubmit={searchSubmitHandler}
					>
						<div className="flex items-center justify-between">
							<p>Search</p>
							<Button
								size="sm"
								type="button"
								variant="link"
								onClick={resetQuires}
							>
								초기화
							</Button>
						</div>
						<Input {...register("search")} placeholder="검색" />
						<Separator />
						<div className="w-full">
							<Controller
								name="seriesId"
								control={control}
								render={({ field: { onChange, value, name } }) => (
									<Select
										name={name}
										value={value}
										onValueChange={(value) => {
											onChange(value);
											changeSeriesHandler(value);
										}}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="시리즈 선택" />
										</SelectTrigger>
										<SelectContent>
											{series?.map((seriesName) => (
												<SelectItem
													key={seriesName.id}
													value={String(seriesName.id)}
												>
													{seriesName.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
						</div>
						<Separator />
						<div className="w-full">
							<Controller
								name="tagId"
								control={control}
								render={({ field: { onChange, value, name } }) => (
									<Select
										name={name}
										value={value}
										onValueChange={(value) => {
											onChange(value);
											changeTagHandler(value);
										}}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="태그 선택" />
										</SelectTrigger>
										<SelectContent>
											{tags?.map((tag) => (
												<SelectItem key={tag.id} value={String(tag.id)}>
													{tag.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
						</div>
						<Button type="submit">검색</Button>
					</form>
				</div>

				<form
					className="flex flex-row gap-2 lg:hidden p-4 flex-wrap sm:flex-nowrap"
					onSubmit={searchSubmitHandler}
				>
					<Input {...register("search")} placeholder="검색" />
					<Controller
						name="seriesId"
						control={control}
						render={({ field: { onChange, value, name } }) => (
							<Select
								name={name}
								value={value}
								onValueChange={(value) => {
									onChange(value);
									changeSeriesHandler(value);
								}}
							>
								<SelectTrigger>
									<SelectValue placeholder="시리즈 선택" />
								</SelectTrigger>
								<SelectContent>
									{series?.map((seriesName) => (
										<SelectItem
											key={seriesName.id}
											value={String(seriesName.id)}
										>
											{seriesName.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>
					<Controller
						name="tagId"
						control={control}
						render={({ field: { onChange, value, name } }) => (
							<Select
								name={name}
								value={value}
								onValueChange={(value) => {
									onChange(value);
									changeTagHandler(value);
								}}
							>
								<SelectTrigger>
									<SelectValue placeholder="태그 선택" />
								</SelectTrigger>
								<SelectContent>
									{tags?.map((tag) => (
										<SelectItem key={tag.id} value={String(tag.id)}>
											{tag.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>
					<Button className="w-24" type="submit">
						검색
					</Button>
					<Button
						className="w-24"
						size="sm"
						variant="link"
						type="button"
						onClick={resetQuires}
					>
						초기화
					</Button>
				</form>

				{writes?.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 w-full p-4">
						{writes?.map((write) => (
							<div key={write.id}>
								<Link href={`${LINK.writes}/${write.id}`}>
									<WriteListCard write={write} />
								</Link>
							</div>
						))}
					</div>
				) : (
					<div className="w-full" />
				)}
			</div>
		</div>
	);
}
