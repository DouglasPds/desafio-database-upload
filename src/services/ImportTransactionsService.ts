import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
	public async execute(): Promise<Transaction[]> {
		const csvFilePath = path.resolve(__dirname, './import_template.csv');

		const readCSVStream = fs.createReadStream(csvFilePath);

		const transactionService = new CreateTransactionService();

		const parseStream = csvParse({
			from_line: 2,
			ltrim: true,
			rtrim: true,
		});

		const parseCSV = readCSVStream.pipe(parseStream);

		const transactions: Transaction[] = [];

		parseCSV.on('data', async line => {
			const [title, type, value, category] = line;
			const transaction = await transactionService.execute({
				title,
				type,
				value,
				category,
			});
			transactions.push(transaction);
		});

		await new Promise(resolve => {
			parseCSV.on('end', resolve);
		});

		return transactions;
	}
}

export default ImportTransactionsService;
