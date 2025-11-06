/* eslint-disable @typescript-eslint/no-shadow */

import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";
import { CacheProvider, CssBaseline, createCache, ThemeProvider } from "ui";
import { theme } from "ui/src/theme/theme";

export function ThemeRegistry(props: any) {
	const { options, children } = props;

	const [{ cache, flush }] = useState(() => {
		const cache = createCache(options);
		cache.compat = true;
		const prevInsert = cache.insert;
		let inserted: string[] = [];
		cache.insert = (...args) => {
			const serialized = args[1];
			if (cache.inserted[serialized.name] === undefined) {
				inserted.push(serialized.name);
			}
			return prevInsert(...args);
		};
		const flush = () => {
			const prevInserted = inserted;
			inserted = [];
			return prevInserted;
		};
		return { cache, flush };
	});

	useServerInsertedHTML(() => {
		const names = flush();
		if (names.length === 0) {
			return null;
		}
		let styles = "";
		for (const name of names) {
			styles += cache.inserted[name];
		}
		return (
			<style
				data-emotion={`${cache.key} ${names.join(" ")}`}
				key={cache.key}
				// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
				dangerouslySetInnerHTML={{
					__html: styles,
				}}
			/>
		);
	});

	return (
		<CacheProvider value={cache}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</CacheProvider>
	);
}
