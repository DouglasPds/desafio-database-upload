import { EntityRepository, getRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
	income: number;
	outcome: number;
	total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
	public async getBalance(): Promise<Balance> {
		const transactionsRepository = getRepository(Transaction);

		const transactions = await transactionsRepository.find();

		const { income, outcome } = transactions.reduce(
			(accumulated: Balance, transaction: Transaction) => {
				if (transaction.type === 'income') {
					accumulated.income += Number(transaction.value);
				} else if (transaction.type === 'outcome') {
					accumulated.outcome += Number(transaction.value);
				}

				return accumulated;
			},
			{
				income: 0,
				outcome: 0,
				total: 0,
			},
		);

		const total = income - outcome;

		return { income, outcome, total };
	}
}

export default TransactionsRepository;
