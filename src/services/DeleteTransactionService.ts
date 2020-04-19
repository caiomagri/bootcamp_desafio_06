import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface RequestDTO {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: RequestDTO): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transaction = await transactionsRepository.findOne(id);

    if (!transaction) {
      throw new AppError(' The transaction was not founded.');
    }

    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
