import { getCustomRepository, getRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: RequestDTO): Promise<Transaction | undefined> {
    const categoryRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const balance = await transactionsRepository.getBalance();

    if (type === 'outcome' && value > balance.total) {
      throw new AppError('The value for outcome need to be small then credit.');
    }

    let categoryFinded = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryFinded) {
      categoryFinded = categoryRepository.create({ title: category });
      await categoryRepository.save(categoryFinded);
    }

    const payload = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryFinded.id,
    });

    const transaction = await transactionsRepository.save(payload);

    const response = await transactionsRepository.findOne({
      where: { id: transaction.id },
    });

    return response;
  }
}

export default CreateTransactionService;
