import { getRepository } from 'typeorm';
import { Parser } from "json2csv";
import CategoryController from './CategoryController';
import { Project, ProjectClient, ProjectClientState } from '../entity/Project';
import TableGroupController from './TableGroupController';
import { User } from '../entity/User';
import { Ballot, BallotStatus, convertToClient } from '../entity/Ballot';
import { io } from '../app';
import { SocketStrings } from '../routes/socket';
import { Category } from "../entity/Category";

class ProjectController {
  public static async getAllProjects() {
    const projectRepository = getRepository(Project);
    const allProjects = await projectRepository.find({
      relations: ['categories', 'tableGroup'],
    });
    const projectsToReturn = this.serverToClient(allProjects);
    return projectsToReturn;
  }

  public static async batchUploadProjects(projects: ProjectClient[]) {
    const projectRepository = getRepository(Project);
    await projectRepository.delete({});
    const allProjects: Project[] = await projectRepository.save(
      this.clientToServer(projects),
    );
    return this.serverToClient(allProjects);
  }

  public static async updateProject(project: ProjectClient) {
    const projectRepository = getRepository(Project);
    const updatedProject: Project[] = await projectRepository.save(
      this.clientToServer([project]),
    );
    return this.serverToClient(updatedProject);
  }

  public static async changeProjectRound(project: ProjectClient, newRoundNumber: number) {
    const projectRepository = getRepository(Project);
    const updatedProject: ProjectClient = {
      ...project,
      roundNumber: newRoundNumber
    }
    return await projectRepository.save(updatedProject);
  }

  public static async changeProjectRounds(projects: ProjectClient[], newRoundNumber: number) {
    const projectRepository = getRepository(Project);
    await projects.map((project: ProjectClient) => {
      project.roundNumber = newRoundNumber;
    });
    return await projectRepository.save(projects);
  }

  public static async exportSponsorData(sponsor: string) {
    const projectRepository = getRepository(Project);
    const categoryRepository = getRepository(Category);

    const sponsorCategory = await categoryRepository.findOne({
      relations: ["criteria"],
      where: {
        company: sponsor
      }
    });

    if (!sponsorCategory) {
      return "Invalid sponsor";
    }

    const criteriaIDs = sponsorCategory.criteria.map(criteria => criteria.id!);

    if (criteriaIDs.length < 1) {
      return "No criteria";
    }

    let projects = await projectRepository.find({
      relations: ["categories", "ballots", "ballots.criteria"]
    });

    projects = projects.filter(project => {
      return project.categories.filter(category => category.id == sponsorCategory.id).length > 0;
    });

    let outputArray: any = [];

    for (let project of projects) {
      let output: any = {
        id: project.id,
        name: project.name,
        devpost: project.devpostURL
      }

      let criteriaScores: any = {};
      let criteriaJudgeNum: any = {};

      for (let criteriaID of criteriaIDs) {
        criteriaScores[criteriaID] = 0;
        criteriaJudgeNum[criteriaID] = 0;
      }


      for (let ballot of project.ballots) {
        if (!ballot.criteria) {
          continue;
        }
        
        if (criteriaIDs.includes(ballot.criteria.id!)) {
          criteriaScores[ballot.criteria.id!] += ballot.score;
          criteriaJudgeNum[ballot.criteria.id!] += 1;
        }
      }

      let numJudged = criteriaJudgeNum[criteriaIDs[0]];

      for (let criteriaID of criteriaIDs) {
        if (criteriaJudgeNum[criteriaID] != numJudged) {
          return "Invalid ballots: num judge mismatch";
        }
      }

      let total = 0;

      for (let criteriaID in criteriaScores) {
        criteriaScores[criteriaID] /= numJudged;
        total += criteriaScores[criteriaID];
      }

      output = {
        ...output,
        ...criteriaScores,
        numJudged,
        score: total / criteriaIDs.length
      }

      outputArray.push(output);
    }

    let fields = [
      {
        value: "id",
        label: "Id"
      },
      {
        value: "name",
        label: "Name"
      },
      {
        value: "devpost",
        label: "Devpost URL"
      },
      {
        value: "numJudged",
        label: "Number of Times Judged"
      }
    ]

    const criteriaFields = sponsorCategory.criteria.map(criteria => {
      return {
        value: criteria.id!.toString(),
        label: criteria.name!
      };
    })

    const scoreField = [
      {
        value: "score",
        label: "Average Score"
      }
    ];


    fields = fields.concat(criteriaFields).concat(scoreField);

    const csvParser = new Parser({ fields });

    return csvParser.parse(outputArray);
  }

  public static async queueProject(projectID: number, userID: number) {
    const ballotRepository = getRepository(Ballot);
    const projectRepository = getRepository(Project);
    const userRepository = getRepository(User);

    const [project, user, submittedBallots, pendingBallots] = await Promise.all([
      await projectRepository.findOne(projectID, {
        relations: ['categories', 'categories.criteria'],
      }),
      await userRepository.findOne(userID),
      await ballotRepository.find({
        where: [{
          user: { id: userID },
          project: { id: projectID },
          status: BallotStatus.Skipped,
        }, {
          user: { id: userID },
          project: { id: projectID },
          status: BallotStatus.Started,
        }, {
          user: { id: userID },
          project: { id: projectID },
          status: BallotStatus.Submitted,
        }, {
          user: { id: userID },
          project: { id: projectID },
          status: BallotStatus.Assigned,
        }],
      }),
      await ballotRepository.find({
        where: {
          user: { id: userID },
          status: BallotStatus.Pending,
        },
        relations: ['criteria', 'user', 'project'],
      }),
    ]);

    if (!project || !user) {
      throw new Error('Project or User does not exist');
    }

    // console.log(submittedBallots);

    if (submittedBallots.length > 0) {
      throw new Error('Project was already submitted, skipped, assigned, or started');
    }

    const removedBallotIDs: number[] = pendingBallots.map((ballot: Ballot) => {
      return ballot.id!;
    });

    if (pendingBallots.length > 0) {
      await ballotRepository.remove(pendingBallots);
    }

    const newBallots: Ballot[] = [];
    for (const category of project.categories) {
      // console.log(category);
      // if (!category.generated && category.company === user.company) {
      if (category.company === user.company) {
        const criteria = category.criteria;
        for (const criterion of criteria) {
          const newBallot = new Ballot();
          newBallot.status = BallotStatus.Pending;
          newBallot.project = project;
          newBallot.criteria = criterion;
          newBallot.user = user;
          newBallot.score = criterion.minScore;
          newBallot.roundNumber = project.roundNumber;
          newBallots.push(newBallot);
        }
      }
    }

    await ballotRepository.save(newBallots);

    return {
      newBallots,
      removedBallotIDs,
    };
  }

  public static async dequeueProject(projectID: number, userID: number) {
    const ballotRepository = getRepository(Ballot);

    const ballotsToRemove = await ballotRepository.find({
      relations: ['project'],
      where: {
        user: { id: userID },
        project: { id: projectID },
        status: BallotStatus.Assigned,
      },
    });

    if (!ballotsToRemove) {
      return 'Ballots do not exist';
    }

    ballotRepository.remove(ballotsToRemove);

    return ballotsToRemove.map((ballot: Ballot) => ballot.id);
  }

  public static async getNextProject(userID: number) {
    const ballotRepository = getRepository(Ballot);

    const projectBallots = await ballotRepository.find({
      relations: ['criteria', 'user', 'project', 'project.tableGroup'],
      where: [{
        user: { id: userID },
        status: BallotStatus.Assigned,
      }, {
        user: { id: userID },
        status: BallotStatus.Started,
      }, {
        user: { id: userID },
        status: BallotStatus.Pending,
      }],
    });

    const pendingBallots = [];
    const assignedBallots = [];
    const startedBallots = [];

    for (const ballot of projectBallots) {
      if (ballot.status === BallotStatus.Pending) {
        pendingBallots.push(ballot);
      } else if (ballot.status === BallotStatus.Assigned) {
        assignedBallots.push(ballot);
      } else if (ballot.status === BallotStatus.Started) {
        startedBallots.push(ballot);
      }
    }

    // A project has already been started. Give user that project.
    if (startedBallots.length > 0) {
      return {
        project: this.serverToClient([startedBallots[0].project]),
        ballots: convertToClient(startedBallots),
      };
    }

    // A project has already been shown to the user.
    if (assignedBallots.length > 0) {
      return {
        project: this.serverToClient([assignedBallots[0].project]),
        ballots: convertToClient(assignedBallots),
      };
    }

    // A project is in the pending queue. Mark it assigned and show that project.
    if (pendingBallots.length > 0) {
      const newBallots = pendingBallots.map((ballot: Ballot) => {
        return {
          ...ballot,
          status: BallotStatus.Assigned,
        };
      });
      await ballotRepository.save(newBallots);
      io.to(SocketStrings.Authenticated).emit(SocketStrings.ProjectGot, {
        newBallots: convertToClient(newBallots),
      });
      return {
        project: this.serverToClient([pendingBallots[0].project]),
        ballots: convertToClient(newBallots),
      };
    }

    return {
      project: null,
      ballots: {},
    };
  }

  public static async scoreProject(ballots: { [ballotID: string]: number }) {
    // console.log(ballots);
    const ballotRepository = getRepository(Ballot);

    const repoBallots = await ballotRepository.findByIds(Object.keys(ballots), {
      relations: ['criteria', 'user', 'project'],
    });

    const ballotsToSave = repoBallots.map((ballot: Ballot) => {
      return {
        ...ballot,
        score: ballots[ballot.id!],
        status: BallotStatus.Submitted,
      };
    });

    await ballotRepository.save(ballotsToSave);

    io.to(SocketStrings.Authenticated).emit(SocketStrings.ProjectScore, {
      newBallots: convertToClient(ballotsToSave),
    });

    return true;
  }

  public static async startProject(userID: number, projectID: number) {
    return this.setBallotStatus(
      userID,
      projectID,
      BallotStatus.Started,
      SocketStrings.ProjectStart,
    );
  }

  public static async skipProject(userID: number, projectID: number) {
    return this.setBallotStatus(
      userID,
      projectID,
      BallotStatus.Skipped,
      SocketStrings.ProjectSkip,
    );
  }

  public static async projectBusy(userID: number, projectID: number) {
    const ballotRepository = getRepository(Ballot);

    const ballotsToRemove = await ballotRepository.find({
      relations: ['project'],
      where: [{
        user: { id: userID },
        project: { id: projectID },
        status: BallotStatus.Started,
      }, {
        user: { id: userID },
        project: { id: projectID },
        status: BallotStatus.Assigned,
      }],
    });

    if (!ballotsToRemove) {
      return 'Ballots do not exist';
    }

    ballotRepository.remove(ballotsToRemove);

    const ballotIDsToRemove = ballotsToRemove.map((ballot: Ballot) => ballot.id!);

    io.to(SocketStrings.Authenticated).emit(SocketStrings.ProjectBusy, {
      ballotsToRemove: ballotIDsToRemove,
    });

    return ballotIDsToRemove;
  }

  public static async projectMissing(userID: number, projectID: number) {
    return this.setBallotStatus(
      userID,
      projectID,
      BallotStatus.Missing,
      SocketStrings.ProjectMissing,
    );
  }

  private static async setBallotStatus(
    userID: number,
    projectID: number,
    ballotStatus: BallotStatus,
    socketEmit: SocketStrings,
  ) {
    const ballotRepository = getRepository(Ballot);

    const repoBallots = await ballotRepository.find({
      relations: ['criteria', 'user', 'project'],
      where: {
        user: { id: userID },
        project: { id: projectID },
      },
    });

    const ballotsToSave = repoBallots.map((ballot: Ballot) => {
      return {
        ...ballot,
        status: ballotStatus,
      };
    });

    await ballotRepository.save(ballotsToSave);

    io.to(SocketStrings.Authenticated).emit(socketEmit, {
      newBallots: convertToClient(ballotsToSave),
    });

    return convertToClient(ballotsToSave);
  }

  private static clientToServer(projects: ProjectClient[]): Array<Partial<Project>> {
    return projects.map((project: ProjectClient) => {
      const {
        id,
        name,
        devpostURL,
        expoNumber,
        roundNumber,
        tableNumber,
        roomUrl,
        tags,
        tableGroupID,
        categoryIDs,
      } = project;
      return {
        id, name, devpostURL, expoNumber, roundNumber, tableNumber, roomUrl, tags,
        categories: categoryIDs.map((categoryID) => CategoryController.categoryDictionary[categoryID]),
        tableGroup: TableGroupController.tableGroupDictionary[tableGroupID],
      };
    });
  }

  private static serverToClient(projects: Project[]): ProjectClientState {
    return projects.reduce((dict: ProjectClientState, project: Project) => {
      const {
        id,
        name,
        devpostURL,
        expoNumber,
        roundNumber,
        tableNumber,
        roomUrl,
        tags,
        tableGroup,
        categories,
      } = project;
      dict[id!] = {
        id, name, devpostURL, expoNumber, roundNumber, tableNumber, roomUrl, tags,
        tableGroupID: tableGroup.id!,
        categoryIDs: categories ? categories.map((category) => category.id!) : [],
      };
      return dict;
    }, {});
  }
}

export default ProjectController;
