import { getRepository } from 'typeorm';

import { Ballot, convertToClient } from '../entity/Ballot';

export default class BallotController {
  public static async getAllBallots() {
    const ballotRepository = getRepository(Ballot);
    const allBallots = await ballotRepository.find({
      relations: ['project', 'criteria', 'user'],
    });
    return convertToClient(allBallots);
  }
}
