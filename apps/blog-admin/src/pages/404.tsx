import { Link } from "react-router-dom";

export function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center h-screen w-screen">
			<h1 className="text-4xl font-bold">404 - Not Found</h1>
			<p className="text-lg">존재하지 않는 페이지입니다.</p>
			<Link to="/" className="text-blue-500 underline hover:text-blue-600 ">
				홈으로 돌아가기
			</Link>
		</div>
	);
}
