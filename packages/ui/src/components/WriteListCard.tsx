import { day, regex, removeMarkdown, type Write } from "utils";
import { Badge } from "./badge";
import { Card, CardContent, CardFooter, CardHeader } from "./card";

interface WriteListCardProps {
	write: Write;
}

export function WriteListCard({ write }: WriteListCardProps) {
	const markdownPreviewContent = regex.getWriteDescription(
		removeMarkdown(write.content),
	);

	return (
		<Card className="w-full py-4 gap-4">
			<CardHeader className="px-4">
				{write.imgUrl ? (
					<img
						alt={write.title}
						src={write.imgUrl}
						className="w-full h-auto aspect-video object-cover rounded-sm"
					/>
				) : (
					<div className="w-full h-auto aspect-video" />
				)}
			</CardHeader>
			<CardContent className="px-4">
				<span className="text-sm text-primary/70">{write.series.name}</span>
				<h2 className="line-clamp-1 text-xl ">{write.title}</h2>
				<div className="my-3 w-full">
					<p className="line-clamp-4 text-sm text-gray-500">
						{markdownPreviewContent}
					</p>
				</div>
				<div className="gap-1 flex flex-wrap">
					{write.tags.map((tag) => (
						<Badge color="primary" key={tag.id}>
							{tag.name}
						</Badge>
					))}
				</div>
			</CardContent>
			<CardFooter className="gap-2 px-4 flex flex-row justify-between items-center">
				{!write.isPublish && <p className="text-gray-500 text-sm">비공개글</p>}
				<p className="text-gray-500 text-sm text-end w-full">
					{day(write.createdAt).defaultFormat()}
				</p>
			</CardFooter>
		</Card>
	);
}
