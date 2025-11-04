import axios from "axios";
import { AbstractBaseRepository } from "./abstract/baseRepository.abstract";

console.log("asdasdasd", process.env.BLOG_ADMIN_BASE_URL);

export class BaseRepository implements AbstractBaseRepository {
	client = axios.create({
		baseURL: `${process.env.BLOG_ADMIN_BASE_URL || ""}/api`,
	});
}
