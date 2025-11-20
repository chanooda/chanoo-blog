import { ErrorBoundary } from "react-error-boundary";
import { useParams } from "react-router-dom";
import { WriteAdd } from "../../../modules/write/ui/writeAdd";

export function WriteEditPage() {
	const { id } = useParams();

	return (
		<ErrorBoundary fallback={<div>404</div>}>
			<WriteAdd id={id} />
		</ErrorBoundary>
	);
}
