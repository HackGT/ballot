import { getRepository } from 'typeorm';

import CategoryController from './CategoryController';
import { Project, ProjectClient, ProjectClientState } from '../entity/Project';
import TableGroupController from './TableGroupController';
import { User } from '../entity/User';
import { Ballot, BallotStatus } from '../entity/Ballot';

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

  public static async queueProject(projectID: number, userID: number) {
    const ballotRepository = getRepository(Ballot);
    const projectRepository = getRepository(Project);
    const userRepository = getRepository(User);

    const [project, user, submittedBallots, assignedBallots] = await Promise.all([
      await projectRepository.findOne(projectID, {
        relations: ['categories', 'categories.criteria',],
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
        }]
      }),
      await ballotRepository.find({
        where: {
          user: { id: userID },
          status: BallotStatus.Assigned,
        },
        relations: ['criteria', 'user', 'project'],
      }),
    ]);

    if (!project || !user) {
      throw new Error('Project or User does not exist');
    }

    console.log(submittedBallots);

    if (submittedBallots.length > 0) {
      throw new Error('Project was already submitted, started, or skipped');
    }

    const removedBallotIDs: number[] = assignedBallots.map((ballot: Ballot) => {
      return ballot.id!;
    });

    if (assignedBallots.length > 0) {
      await ballotRepository.remove(assignedBallots);
    }

    const newBallots: Ballot[] = [];
    for (const category of project.categories) {
      console.log(category);
      if (!category.generated) {
        const criteria = category.criteria;
        for (const criterion of criteria) {
          const newBallot = new Ballot();
          newBallot.status = BallotStatus.Assigned;
          newBallot.project = project;
          newBallot.criteria = criterion;
          newBallot.user = user;
          newBallot.score = 0;
          newBallots.push(newBallot);
        }
      }
    }

    console.log('ballots', newBallots);
    await ballotRepository.save(newBallots);

    return {
      newBallots,
      removedBallotIDs
    };
  }

  public static async dequeueProject(projectID: number, userID: number) {
    const ballotRepository = getRepository(Ballot);

    const ballotsToRemove = await ballotRepository.find({
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

  private static clientToServer(projects: ProjectClient[]): Array<Partial<Project>> {
    return projects.map((project: ProjectClient) => {
      const {
        id,
        name,
        devpostURL,
        expoNumber,
        tableNumber,
        tags,
        tableGroupID,
        categoryIDs,
      } = project;
      return {
        id, name, devpostURL, expoNumber, tableNumber, tags,
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
        tableNumber,
        tags,
        tableGroup,
        categories,
      } = project;
      dict[id!] = {
        id, name, devpostURL, expoNumber, tableNumber, tags,
        tableGroupID: tableGroup.id!,
        categoryIDs: categories.map((category) => category.id!),
      };
      return dict;
    }, {});
  }
}

export default ProjectController;
