"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const Ballot_1 = require("../entity/Ballot");
class BallotController {
    static async getAllBallots() {
        const ballotRepository = typeorm_1.getRepository(Ballot_1.Ballot);
        const allBallots = await ballotRepository.find({
            relations: ['project', 'criteria', 'user'],
        });
        return Ballot_1.convertToClient(allBallots);
    }
}
exports.default = BallotController;
