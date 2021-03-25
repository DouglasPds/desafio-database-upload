import { getRepository } from 'typeorm';
import { validate } from 'uuid';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

interface Request {
	id: string;
}
class DeleteTransactionService {
	public async execute({ id }: Request): Promise<void> {
		const transactionsRepository = getRepository(Transaction);

		if (!validate(id)) {
			throw new AppError('This id is not an uuid.');
		}

		const transactionExists = await transactionsRepository.findOne({
			id,
		});

		if (!transactionExists) {
			throw new AppError('This id transaction not exists.');
		}

		await transactionsRepository.delete({ id });
	}
}

export default DeleteTransactionService;
