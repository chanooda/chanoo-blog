export interface WriteReq {
	isPublish?: boolean;
	limit?: number;
	page?: number;
	search?: string;
	seriesId?: string;
	tagId?: string;
}

export interface Tag {
	id: string;
	name: string;
}

export interface WriteTag {
	id: string;
	tag: Tag;
	tagId: string;
	writeId: string;
}

export interface Write {
	content?: string;
	createdAt: string;
	heart: number;
	id: string;
	imgUrl: string;
	isPublish: true;
	seriesId: string;
	title: string;
	updatedAt: string;
	view: number;
	series: SeriesDetail;
	tags: Tag[];
	plainText?: string;
}

export interface Series {
	id: string;
	name: string;
	writeOrder: string[];
}

export interface SeriesDetail extends Series {
	writes: Write[];
}
