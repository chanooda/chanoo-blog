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
import type { FormEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import {
	buildQueryString,
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

	const { watch, control, reset } = useForm<WriteFilterForm>({
		defaultValues: {
			search: query.get("search") || undefined,
			seriesId: query.get("seriesId") || undefined,
			tagId: query.get("tagId") || undefined,
		},
	});

	const { search: _search, seriesId: _seriesId, tagId: _tagId } = watch();

	const resetQuires = () => {
		reset({
			search: undefined,
			seriesId: undefined,
			tagId: undefined,
		});
		router.push(LINK.writes);
	};

	const setQueries = (
		search = _search,
		chooseSeriesId = _seriesId,
		chooseTagId = _tagId,
	) => {
		const queryString = buildQueryString({
			search,
			seriesId: chooseSeriesId,
			tagId: chooseTagId,
		});
		router.push(`${LINK.writes}?${queryString}`);
	};

	const searchSubmitHandler = (e: FormEvent) => {
		e.preventDefault();
		setQueries(e.target?.[0].value || undefined, undefined, undefined);
	};

	const changeSeriesHandler = (value: string) => {
		setQueries(undefined, value || undefined, undefined);
	};

	const changeTagHandler = (chooseTagId: string) => {
		setQueries(undefined, undefined, chooseTagId || undefined);
	};

	return (
		<div className="w-full max-w-768 mx-auto py-12">
			<div>
				<div className="relative">
					<div className="gap-2 flex flex-col left-[-235px] min-w-50 absolute w-50">
						<form
							className="w-full flex flex-col gap-4"
							onSubmit={searchSubmitHandler}
						>
							<div className="flex items-center justify-between">
								<p>Search</p>
								<Button size="sm" variant="link" onClick={resetQuires}>
									초기화
								</Button>
							</div>
							<Controller
								name="search"
								control={control}
								render={({ field }) => <Input {...field} placeholder="검색" />}
							/>
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
						</form>
					</div>

					<div className="flex flex-row gap-1 mb-1 xl:hidden">
						<Controller
							name="search"
							control={control}
							render={({ field }) => <Input {...field} placeholder="검색" />}
						/>
						<Controller
							name="seriesId"
							control={control}
							render={({ field }) => (
								<Select
									{...field}
									onValueChange={(value) => {
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
							render={({ field: { onChange } }) => (
								<Select
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
						<Button size="sm" variant="link" onClick={resetQuires}>
							초기화
						</Button>
					</div>

					{writes?.length > 0 ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 w-full">
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
		</div>
	);
}
