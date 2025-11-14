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
import { Controller, type GlobalError, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { ResetIcon } from "ui-icon";
import {
	buildQueryString,
	getQuery,
	type Series,
	type Tag,
	type WriteFilterForm,
} from "utils";
import { useChanooQuery } from "@/src/base/libs/queryHook";
import { WriteList } from "@/src/base/ui/list/WriteList";

export function WritesPage() {
	const { search: query } = useLocation();

	const navigate = useNavigate();

	const queryObject = getQuery(query, ["search", "seriesId", "tagId"]);

	const { watch, control, register, handleSubmit, reset } =
		useForm<WriteFilterForm>({
			defaultValues: {
				...queryObject,
			},
		});

	const { search: _search, tagId: _tagId, seriesId: _seriesId } = watch();

	const { data: series } = useChanooQuery<Series[], GlobalError>(["/series"]);
	const { data: tags } = useChanooQuery<Tag[], GlobalError>(["/tag"]);

	const resetQuires = () => {
		reset();
		navigate("/writes");
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
		navigate(`/writes?${queryString}`);
	};

	const searchSubmitHandler = handleSubmit((formData) => {
		setQueries(formData);
	});

	const changeSeriesHandler = (seriesId: string) => {
		setQueries({ seriesId });
	};

	const changeTagHandler = (tagId: string) => {
		setQueries({ tagId: tagId });
	};

	return (
		<div className="flex sm:flex-row flex-col h-full min-h-0 ">
			<div className="h-full min-w-60 p-2 w-60 flex flex-col gap-4">
				<div className="w-full"></div>
				<form className="flex flex-col gap-4" onSubmit={searchSubmitHandler}>
					<div>
						<span>Search</span>
						<Input {...register("search")} placeholder="검색" />
					</div>
					<Separator />
					<div className="w-full">
						<span>Series</span>
						<Controller
							name="seriesId"
							control={control}
							render={({ field: { onChange, value } }) => {
								return (
									<Select
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
											{series?.data?.data?.map((seriesName) => (
												<SelectItem
													key={seriesName.id}
													value={String(seriesName.id)}
												>
													{seriesName.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								);
							}}
						/>
					</div>
					<Separator />
					<div className="w-full">
						<span>Tags</span>
						<Controller
							name="tagId"
							control={control}
							render={({ field: { onChange, value } }) => (
								<Select
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
										{tags?.data?.data?.map((tag) => (
											<SelectItem key={tag.id} value={String(tag.id)}>
												{tag.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
					</div>
					<div className="w-full gap-2 flex items-center">
						<Button type="submit" className="w-full shrink">
							검색
						</Button>
						<Button
							type="button"
							className="shrink-0"
							size="icon"
							variant="link"
							onClick={resetQuires}
						>
							<ResetIcon />
						</Button>
					</div>
				</form>
			</div>
			<Separator orientation="vertical" />
			<div className="w-full">
				<WriteList />
			</div>
		</div>
	);
}
