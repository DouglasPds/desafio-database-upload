import { getRepository } from 'typeorm';
import Category from '../models/Category';

interface Request {
	categoryName: string;
}

class CreateCategoryService {
	public async execute({ categoryName: title }: Request): Promise<Category> {
		const categoriesRepository = getRepository(Category);

		const category = categoriesRepository.create({ title });

		await categoriesRepository.save(category);

		return category;
	}
}

export default CreateCategoryService;
