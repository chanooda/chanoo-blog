import { getWrites } from "../_base/api";
import { WriteList } from "../_pages/writes";

export const dynamic = "force-dynamic";

const getData = async () => {
	const writes = await getWrites({
		isPublish: true,
	});
	return writes;
};

export default async function Home() {
	const writes = await getData();
	return <WriteList writeList={writes} />;
}
