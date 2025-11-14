import { ErrorBoundary } from "react-error-boundary";
import { WriteDetail } from "@/src/modules/write";

export const WritePage = () => {
	return (
		<ErrorBoundary
			fallback={
				<div className="text-center text-2xl font-bold h-full flex items-center justify-center text-red-500">
					404
				</div>
			}
		>
			<WriteDetail />
		</ErrorBoundary>
	);
};
