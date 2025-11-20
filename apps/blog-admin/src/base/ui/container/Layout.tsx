import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@ui/components/navigation-menu";
import { Spinner } from "@ui/components/spinner";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Link, Outlet } from "react-router-dom";
import { FileIcon, FileTextIcon, Pencil1Icon } from "ui-icon";

const menuList = [
	{
		label: "Home",
		href: "/",
	},
	{
		label: "Write",
		href: "/writes",
		icon: <FileTextIcon />,
		items: [
			{
				label: "Add",
				href: "/writes/add",
				icon: <Pencil1Icon />,
			},
		],
	},
	{
		label: "Folder",
		href: "/folder",
		icon: <FileIcon />,
	},
];

export function Layout() {
	return (
		<div className="h-dvh w-dvw">
			<div className="h-full w-full flex flex-col">
				<header className="w-full py-4 flex justify-end px-4 border-b">
					<NavigationMenu viewport={false}>
						<NavigationMenuList className="flex gap-4 flex-wrap">
							{menuList?.map((menu) => {
								if (menu.items) {
									return (
										<NavigationMenuItem key={menu.href}>
											<Link to={menu.href}>
												<NavigationMenuTrigger className="flex-row p-2 items-center gap-2">
													{menu.icon} {menu.label}
												</NavigationMenuTrigger>
											</Link>
											<NavigationMenuContent>
												<ul>
													{menu.items?.map((item) => {
														return (
															<li key={item.href}>
																<NavigationMenuLink asChild>
																	<Link
																		className="flex-row items-center gap-2 select-none"
																		to={item.href}
																	>
																		{item.icon} {item.label}
																	</Link>
																</NavigationMenuLink>
															</li>
														);
													})}
												</ul>
											</NavigationMenuContent>
										</NavigationMenuItem>
									);
								}
								return (
									<NavigationMenuItem key={menu.href}>
										<NavigationMenuLink key={menu.href} asChild>
											<Link
												className="flex-row items-center gap-2"
												to={menu.href}
											>
												{menu.icon} {menu.label}
											</Link>
										</NavigationMenuLink>
									</NavigationMenuItem>
								);
							})}
						</NavigationMenuList>
					</NavigationMenu>
				</header>
				<main className="h-full w-full min-h-0">
					<Suspense
						fallback={
							<div className="w-full flex h-full items-center justify-center">
								<Spinner />
							</div>
						}
					>
						<ErrorBoundary
							fallback={
								<div className="w-full flex h-full items-center justify-center">
									<span className="text-red-500 text-3xl">Error</span>
								</div>
							}
						>
							<Outlet />
						</ErrorBoundary>
					</Suspense>
				</main>
			</div>
		</div>
	);
}
