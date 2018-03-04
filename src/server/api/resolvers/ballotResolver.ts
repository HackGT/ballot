import { Action } from '../../util/Permissions';
import { BallotService } from '../../controllers/BallotService';
import { ProjectScores } from '../types/ballot';


const resolvers = {
    Query: {
        nextBallotSet: async (obj: any,
                              args: { user_id?: number },
                              context: any) => {
            if (!context.user ||
                !context.user.can(Action.ViewBallot, args.user_id)) {
                throw new Error('You do not have permission to view ballots');
            }

            return BallotService.getNextProject(args.user_id!);
        },
    },

    Mutation: {
        scoreProject: (obj: any,
                       args: { user_id?: number, scores?: ProjectScores[] },
                       context: any) => {
            if (!context.user ||
                !context.user.can(Action.ScoreBallot, args.user_id)) {
                throw new Error('You do not have permission to score ballots');
            }

            const ret = BallotService.scoreProject(args.user_id!,
                args.scores!.map((score) => {
                    return {
                        ballotId: score.ballot_id,
                        score: score.score,
                    };
                }));

            return ret ? ret : [];
        },
    },
};

export default resolvers;
