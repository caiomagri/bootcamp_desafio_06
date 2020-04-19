import path from 'path';
import csv from 'csv-parse/lib/sync';
import fs from 'fs';

import Transaction from '../models/Transaction';

import CreateTransactionService from './CreateTransactionService';

import uploadConfig from '../config/upload';

interface RequestDTO {
  filename: string;
}

interface ResultCSVParse {
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

    const records: ResultCSVParse[] = csv(content, {
      columns: true,
      trim: true,
      skip_empty_lines: true,
    });

    const response = records.reduce(async (task: any, data) => {
      const result: any = await task;
      if (result instanceof Transaction) transactions.push(result);
      return createTransaction.execute(data);
    }, Promise.resolve());

    const trans = await Promise.resolve(response);

    transactions.push(trans);
    return transactions;
  }
}

export default ImportTransactionsService;
