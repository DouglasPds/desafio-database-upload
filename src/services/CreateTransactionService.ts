// import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';

interface Request {
	title: string;
	type: 'income' | 'outcome';
	value: number;
	category_id: string;
}

class CreateTransactionService {
	public async execute({
		title,
		type,
		value,
		category_id,
	}: Request): Promise<Transaction> {
		const transactionsRepository = getRepository(Transaction);

		const transaction = transactionsRepository.create({
			title,
			type,
			value,
			category_id,
		});

		await transactionsRepository.save(transaction);

		return transaction;
	}
}

export default CreateTransactionService;
