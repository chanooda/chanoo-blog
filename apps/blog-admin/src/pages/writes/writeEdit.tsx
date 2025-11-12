import { ErrorBoundary } from "react-error-boundary";
import { useParams } from "react-router-dom";
import { WriteAdd } from "./writeAdd";

export function PostEdit() {
	const { id } = useParams();

	return (
		<ErrorBoundary fallback={<div>404</div>}>
			<WriteAdd id={id} />
		</ErrorBoundary>
	);
}
