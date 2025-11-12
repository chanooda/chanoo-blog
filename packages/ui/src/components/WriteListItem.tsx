import { day, regex, removeMarkdown, type Write } from "utils";

interface WriteListItemProps {
	write: Write;
}

export function WriteListItem({ write }: WriteListItemProps) {
	const markdownPreviewContent = regex.getWriteDescription(
		removeMarkdown(write.content),
	);

	return (
		<div className="gap-2 flex flex-row flex-1 min-h-0 h-full">
			{write.imgUrl ? (
				<img
					alt={write.title}
					className="min-w-35% w-35% aspect-video object-cover"
					src={write.imgUrl}
				/>
			) : (
				<div className="min-w-35% w-35%" />
			)}
			<div className="w-full h-full min-h-0 flex-1 justify-between">
				<div>
					<p className="text-xl font-bold mb-2 line-clamp-1">{write.title}</p>
					<p className="text-sm text-gray-500 line-clamp-6">
						{markdownPreviewContent}
					</p>
				</div>
				<p className="text-sm text-gray-500 mt-1 text-end">
					{day(write.createdAt).defaultFormat()}
				</p>
			</div>
		</div>
	);
}
