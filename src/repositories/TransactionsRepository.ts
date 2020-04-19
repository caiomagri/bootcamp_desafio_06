import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const income = transactions.reduce((prev, cur) => {
      if (cur.type === 'income') {
        return prev + cur.value;
      }

      return prev;
    }, 0);

    const outcome = transactions.reduce((prev, cur) => {
      if (cur.type === 'outcome') {
        return prev + cur.value;
      }

      return prev;
    }, 0);

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
