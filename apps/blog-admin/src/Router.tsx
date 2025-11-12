import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/container/Layout";
import { NotFound } from "./pages/404";
import { FolderPage } from "./pages/folder/Folder";
import { Home } from "./pages/Home";
import { WriteDetail } from "./pages/writes/write";
import { WriteAdd } from "./pages/writes/writeAdd";
import { WritesPage } from "./pages/writes/writesPage";

export function Router() {
	return (
		<Routes>
			<Route element={<Layout />} path="/">
				<Route element={<Home />} path="/" />
				<Route element={<WritesPage />} path="/writes" />
				<Route element={<WriteAdd />} path="/writes/add" />
				<Route element={<WriteDetail />} path="/writes/:id" />
				<Route element={<WriteDetail />} path="/writes/:id/edit" />
				<Route element={<FolderPage />} path="/folder" />
				<Route element={<FolderPage />} path="/folder/:id" />
			</Route>
			<Route element={<NotFound />} path="*" />
		</Routes>
	);
}
