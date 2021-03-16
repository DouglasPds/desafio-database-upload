import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import CreateCategoryService from './CreateCategoryService';

interface Request {
	title: string;
	type: 'income' | 'outcome';
	value: number;
	category: string;
}

class CreateTransactionService {
	public async execute({
		title,
		type,
		value,
		category: categoryName,
	}: Request): Promise<Transaction> {
		const transactionsRepository = getCustomRepository(TransactionsRepository);
		const categoryRepository = getRepository(Category);
		const createCategory = new CreateCategoryService();
		let category;

		const hasTitle = await transactionsRepository.findOne({
			title,
		});

		if (hasTitle) {
			throw new AppError('This title has already saved.');
		}

		if (type === 'outcome') {
			const balance = await transactionsRepository.getBalance();
			if (value > balance.total) {
				throw new AppError('The value of outcome is bigger then total.');
			}
		}

		const hasExistCategoryTitle = await categoryRepository.findOne({
			title: categoryName,
		});

		if (!hasExistCategoryTitle) {
			category = await createCategory.execute({ categoryName });
		} else {
			category = hasExistCategoryTitle;
		}

		const transaction = transactionsRepository.create({
			title,
			type,
			value,
			category_id: category.id,
		});

		await transactionsRepository.save(transaction);

		return transaction;
	}
}

export default CreateTransactionService;
