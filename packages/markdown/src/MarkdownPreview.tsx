/* eslint-disable react/function-component-definition */

import type { ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Box, Chip, Stack, Typography } from "ui";
import { day, type SeriesDetail, type Write, type WriteTag } from "utils";
import { A, Blockquote, Code, Img } from "./MarkdownComponents";

interface MarkdownPreviewWrite {
	createdAt?: string;
	id?: number;
	isPublish?: boolean;
	mainImage?: string;
	series?: string | SeriesDetail;
	tag: string[] | WriteTag[];
	title?: string;
}

export type GetIdType = "series" | "post" | "tag";

export interface MdPreviewProps extends ComponentProps<typeof ReactMarkdown> {
	handleGetId?: (type: GetIdType, id: number) => void;
	write: MarkdownPreviewWrite;
}

export function MarkdownPreview({
	children,
	handleGetId,
	write,
}: MdPreviewProps) {
	return (
		<Box
			fontFamily="inherit"
			height="100%"
			maxWidth={800}
			mx="auto"
			width="100%"
		>
			<Box minHeight={40} />
			<Stack direction="column" width="100%">
				<Typography my={0} variant="h3">
					{write?.title}
				</Typography>
				{write?.createdAt && (
					<Stack direction="row" gap={1} mt={2}>
						<Typography fontWeight={600}>김찬우</Typography>{" "}
						<Typography> • </Typography>
						<Typography color="grey.700">
							{day(write?.createdAt).format("YYYY-MM-DD")}
						</Typography>
					</Stack>
				)}
				{write.tag.length > 0 && (
					<Stack direction="row" flexWrap="wrap" gap={2} mt={2} width="100%">
						{write?.tag?.map((tag) => {
							if (typeof tag === "string")
								return <Chip color="primary" key={tag} label={tag} />;
							return (
								<Chip
									color="primary"
									key={tag.tag.id}
									label={tag.tag.name}
									onClick={() => handleGetId?.("tag", tag.tag.id)}
								/>
							);
						})}
					</Stack>
				)}
				{write?.series && (
					<Stack
						bgcolor="primary.900"
						borderRadius={3}
						color="grey.200"
						minHeight={100}
						mt={2}
						p={2}
						width="100%"
					>
						{typeof write.series === "string" ? (
							<Typography variant="h6">{write.series} </Typography>
						) : (
							<Typography
								sx={{ cursor: "pointer" }}
								variant="h6"
								onClick={() =>
									handleGetId?.("series", (write.series as SeriesDetail).id)
								}
							>
								{write.series.name}
							</Typography>
						)}

						{typeof write.series === "object" &&
							write.series.writes.length > 0 && (
								<Stack mt={1}>
									{write.series.writeOrder.map((order, index) => {
										const orderedWrite = (
											write.series as SeriesDetail
										).writes.find(
											(writeDetail) => writeDetail.id === order,
										) as Write;
										return (
											<Typography
												key={orderedWrite.id}
												sx={{
													"&:hover": { textDecoration: "underline" },
													cursor: "pointer",
													...(write?.id === orderedWrite.id && {
														fontWeight: 700,
													}),
												}}
												onClick={() => handleGetId?.("post", orderedWrite.id)}
											>
												{index + 1}. {orderedWrite.title}
											</Typography>
										);
									})}
								</Stack>
							)}

						<Stack />
					</Stack>
				)}
				{write?.mainImage && (
					<Box mt={2} mx="auto" width="100%">
						<Box
							alt="메인 이미지"
							component="img"
							src={write?.mainImage}
							sx={{ objectFit: "cover", aspectRatio: 16 / 9 }}
							width="100%"
						/>
					</Box>
				)}
			</Stack>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					code: Code,
					img: Img,
					a: A,
					blockquote: Blockquote,
				}}
			>
				{children}
			</ReactMarkdown>
			<Box minHeight={40} />
		</Box>
	);
}
