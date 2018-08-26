import { Action } from '../../util/Permissions';
import { BallotService } from '../../controllers/BallotService';
import { ProjectScores } from '../types/ballot';


const resolvers = {
    Query: {
        nextBallotSet: (obj: any,
                        args: { user_id?: number, current_project_id?: number },
                        context: any) => {
            if (!context.user ||
                !context.user.can(Action.ViewBallot, args.user_id)) {
                throw new Error('You do not have permission to view ballots');
            }

            return BallotService.getNextProject(args.user_id!, args.current_project_id!);
        },
        getRanking: async (obj: any, args: any, context: any) => {
            if (!context.user ||
                !context.user.can(Action.ViewRanking, args.user_id)) {
                throw new Error('You do not have permission to view ballots');
            }

            console.log(JSON.stringify(await BallotService.getRanking()));
            return BallotService.getRanking() || [];
        },
    },

    Mutation: {
        skipProject: (obj: any, args: { user_id?: number }, context: any) => {
            if (!context.user ||
                !context.user.can(Action.ScoreBallot, args.user_id)) {
                throw new Error('You do not have permission to score ballots');
            }

            const ret = BallotService.skipProject(args.user_id!);
            return ret || [];
        },

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

            return ret || [];
        },
    },
};

export default resolvers;
