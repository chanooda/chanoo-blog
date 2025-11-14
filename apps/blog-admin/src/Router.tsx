import { Route, Routes } from "react-router-dom";
import { Layout } from "./base/ui/container/Layout";
import { NotFound } from "./pages/404";
import { FolderPage } from "./pages/folder/Folder";
import { Home } from "./pages/Home";
import { WriteAddPage } from "./pages/writes/ui/writeAddPage";
import { WriteEditPage } from "./pages/writes/ui/writeEditPage";
import { WritePage } from "./pages/writes/ui/writePage";
import { WritesPage } from "./pages/writes/ui/writesPage";

export function Router() {
	return (
		<Routes>
			<Route element={<Layout />} path="/">
				<Route element={<Home />} path="/" />
				<Route element={<WritesPage />} path="/writes" />
				<Route element={<WriteAddPage />} path="/writes/add" />
				<Route element={<WritePage />} path="/writes/:id" />
				<Route element={<WriteEditPage />} path="/writes/:id/edit" />
				<Route element={<FolderPage />} path="/folder" />
				<Route element={<FolderPage />} path="/folder/:id" />
			</Route>
			<Route element={<NotFound />} path="*" />
		</Routes>
	);
}
