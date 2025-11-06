export const getHash = (length: number) => {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
};

export const convertLink = (url: string) => {
	let convertUrl = url;
	if (url.indexOf("https://youtu.be/") !== -1) {
		convertUrl = `https://www.youtube.com/embed/${url.replace("https://youtu.be/", "")}`;
		return convertUrl;
	}
	if (url.indexOf("https://github.com/") !== -1) {
		const splitUrl = url.replace("https://", "").split("/");
		const owner = splitUrl[1];
		const repo = splitUrl[2];
		convertUrl = `https://opengraph.githubassets.com/${getHash(10)}/${owner}/${repo}`;
		return convertUrl;
	}

	return "";
};

// https://youtu.be/vcCcExrKbj4
// https://github.com/chanooda
// https://github.com/chanooda/chanoo
