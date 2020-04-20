import path from 'path';
import csv from 'csv-parse/lib/sync';
import fs from 'fs';

import Transaction from '../models/Transaction';

import CreateTransactionService from './CreateTransactionService';

import uploadConfig from '../config/upload';

interface RequestDTO {
  filename: string;
}

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute({ filename }: RequestDTO): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();
    const filePath = path.join(uploadConfig.directory, filename);
    const transactions: Transaction[] = [];

    const content = fs.readFileSync(filePath);

    const importedTransactions: TransactionDTO[] = csv(content, {
      columns: true,
      trim: true,
      skip_empty_lines: true,
    });

    for (const trans of importedTransactions) {
      const newTransaction = await createTransaction.execute(trans);
      transactions.push(newTransaction);
    }

    await fs.promises.unlink(filePath);
    return transactions;
  }
}

export default ImportTransactionsService;
