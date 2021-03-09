import React, { ReactElement } from 'react';
import { InputGroup, Card, FormControl, Accordion } from 'react-bootstrap';
import { connect } from 'react-redux';

import PageAdminProjectsEpicenterProjectDot from './PageAdminProjectsEpicenterProjectDot';
import PageAdminProjectsEpicenterEmptyDot from './PageAdminProjectsEpicenterEmptyDot';
import Project, { ProjectState, TableGroupState, ProjectWithHealth } from '../../types/Project';
import User from '../../types/User';
import { AppState } from '../../state/Store';
import Ballot, { BallotState, BallotStatus } from '../../types/Ballot';
import Category, { CategoryState, CategoryCriteriaState } from '../../types/Category';
import { queueProjectEmit, subscribeQueuedProject, subscribeQueueProject, queueProject, subscribeGetProject, subscribeScoreProject, unsubscribeAll, subscribeSkipProject, subscribeMissingProject, subscribeBusyProject } from '../../state/Ballot';
import { requestStart, requestFinish } from '../../state/Request';
import { UserState } from '../../types/User';
import { Button } from 'react-bootstrap';
import Axios from "axios";

const mapStateToProps = (state: AppState) => {
  return {
    account: state.account,
    ballots: state.ballots,
    categories: state.categories,
    tableGroups: state.tableGroups,
    projects: state.projects,
    users: state.users,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    queueProject: (projectID: number, userID: number) => {
      dispatch(queueProject(projectID, userID));
    },
    queueProjectEmit: (projectID: number, userID: number) => {
      dispatch(queueProjectEmit(projectID, userID));
    },
    subscribeQueueProject: () => {
      dispatch(subscribeQueueProject());
    },
    subscribeQueuedProject: () => {
      dispatch(subscribeQueuedProject());
    },
    subscribeGotProject: () => {
      dispatch(subscribeGetProject());
    },
    subscribeScoreProject: () => {
      dispatch(subscribeScoreProject());
    },
    subscribeSkipProject: () => {
      dispatch(subscribeSkipProject());
    },
    subscribeMissingProject: () => {
      dispatch(subscribeMissingProject());
    },
    subscribeBusyProject: () => {
      dispatch(subscribeBusyProject());
    },
    unsubscribeAll: () => {
      dispatch(unsubscribeAll());
    },
    requestFinish: () => {
      dispatch(requestFinish());
    },
    requestStart: () => {
      dispatch(requestStart());
    },
  };
};

interface PageAdminProjectsEpicenterProps {
  account: User;
  ballots: BallotState;
  categories: CategoryCriteriaState;
  projects: ProjectState;
  tableGroups: TableGroupState;
  users: UserState;
  queueProject: (projectID: number, userID: number) => void;
  queueProjectEmit: (projectID: number, userID: number) => void;
  subscribeQueueProject: () => void;
  subscribeQueuedProject: () => void;
  subscribeGotProject: () => void;
  subscribeScoreProject: () => void;
  subscribeMissingProject: () => void;
  subscribeBusyProject: () => void;
  subscribeSkipProject: () => void;
  unsubscribeAll: () => void;
  requestFinish: () => void;
  requestStart: () => void;
}

enum SortType {
  Location,
  AverageScore,
  ProjectHealth,
  TimesJudged,
}

type State = {
  selectedProject: string;
  judgeSelectedProject: string;
  currentExpo: number;
  currentRound: number;
  powerGoodness: number;
  powerVariance: number;
  powerSkip: number;
  projects: { [projectID: number]: ProjectWithHealth };
  sortBy: SortType;
  filterBy: number | undefined;
}

type Action =
  | { type: 'change-current-expo', currentExpo: number }
  | { type: 'change-current-round', currentRound: number }
  | { type: 'change-selected-project', projectID: string }
  | { type: 'change-judge-selected-project', projectID: string }
  | { type: 'change-parameters', goodness: number, variance: number, skip: number }
  | { type: 'change-sort-by', sortBy: SortType }
  | { type: 'change-filter-by', filterBy: number | undefined }
  | { type: 'update-projects', projects: { [projectID: number]: ProjectWithHealth } };

const PageAdminProjectsEpicenterComponent: React.FC<PageAdminProjectsEpicenterProps> = (props) => {
  const [state, dispatch] = React.useReducer((state: State, action: Action) => {
    switch (action.type) {
      case 'change-current-expo':
        return { ...state, currentExpo: action.currentExpo > 0 ? action.currentExpo : 1 };
      case 'change-current-round':
        return { ...state, currentRound: action.currentRound > 0 ? action.currentRound : 1 };
      case 'change-selected-project':
        return { ...state, selectedProject: action.projectID, judgeSelectedProject: '' };
      case 'change-judge-selected-project':
        return { ...state, selectedProject: '', judgeSelectedProject: action.projectID };
      case 'change-sort-by':
        return { ...state, sortBy: action.sortBy };
      case 'change-filter-by':
        return { ...state, filterBy: action.filterBy };
      case 'update-projects':
        return { ...state, projects: action.projects };
      case 'change-parameters':
        return {
          ...state,
          powerGoodness: action.goodness > 0 ? action.goodness : 0,
          powerVariance: action.variance > 0 ? action.variance : 0,
          powerSkip: action.skip > 0 ? action.skip : 0,
        };
      default:
        return state;
    }
  }, {
    currentExpo: 1,
    currentRound: 1,
    selectedProject: '',
    judgeSelectedProject: '',
    powerGoodness: 0.5,
    powerSkip: 0.5,
    powerVariance: 0.5,
    projects: {},
    sortBy: SortType.Location,
    filterBy: undefined,
  });

  React.useEffect(() => {
    const projectsWithHealth: { [projectID: number]: ProjectWithHealth } = {};
    for (const projectID of Object.keys(props.projects)) {
      projectsWithHealth[+projectID] = {
        ...props.projects[+projectID],
        health: calculateProjectHealth(props.projects[+projectID]),
      }
    }
    dispatch({ type: 'update-projects', projects: projectsWithHealth });
  }, [props.projects, state.powerGoodness, state.powerSkip, state.powerVariance, props.ballots]);

  const calculateProjectHealth = (project: Project) => {
    let totalHealth = 0;

    /* 
    // This block checks the number of times a project has been judged for the default category

    // If project has already been judged
    if (props.ballots.dProjectScores[project.id!] && Object.values(props.ballots.dProjectScores[project.id!]).length > 0) {
      const categoryScoreArrays: { [userID: number]: number } = {};
      const allUserBallots = Object.values(props.ballots.dProjectScores[project.id!]);
      // The default prize category
      let defaultCategoryID = Object.values(props.categories.categories).filter((category: Category) => {
        return category.isDefault
      })[0].id;
      console.log('default', defaultCategoryID);
      // Iterate over all ballots for project
      for (const userBallots of allUserBallots) {
        // Get the ballot associated with that judgement
        for (const ballot of userBallots) {
          // If the judge was for the default category (i.e. overall hackgt or how all judging is in healthtech)
          if (props.categories.criteria[ballot.criteriaID].categoryID === defaultCategoryID) {
            // If the judge hasn't been put into the map
            if (!categoryScoreArrays[ballot.userID]) {
              categoryScoreArrays[ballot.userID] = 0;
            }
            // Add the judge's id -> score into the map
            categoryScoreArrays[ballot.userID] += ballot.score;
          }
        }
      }

      console.log('calcProjectHe', categoryScoreArrays);
      // Add the number of times the project has been judged
      totalHealth += Object.values(categoryScoreArrays).length;
    }
    */

    for (const judgeQueue of Object.values(props.ballots.dJudgeQueues)) {
      // If project is in the queue increase the health by 1
      if (judgeQueue.queuedProject && judgeQueue.queuedProject.id === project.id!) {
        totalHealth++;
      }

      // If project is currently being judged increase health by 2
      if (judgeQueue.activeProjectID === project.id!) {
        totalHealth += 2;
      }

      // If judge already judged this project
      if (judgeQueue.otherProjectIDs.includes(project.id!)) {
        totalHealth += 2;
      }
    }

    return totalHealth;
  }

  const autoAssign = () => {
    // get users who are judges
    const userIDs = Object.keys(props.users).map((value) => parseInt(value)).reduce((judgingUsers: number[], userID) => {
      // check that user ID is an approved judge
      if (props.users[userID].isJudging!) {
        // check that judge's user ID is not in judge queues
        // or does not have a queued project
        // or has a queued project with ID = 0
        if (!props.ballots.dJudgeQueues[userID]
          || props.ballots.dJudgeQueues[userID].queuedProject === undefined
          || props.ballots.dJudgeQueues[userID].queuedProject.id === 0) {
          judgingUsers.push(userID);
        }
      }
      return judgingUsers;
    }, []);
    console.log("User IDS", userIDs);
    // check that there is at least one judge that we can assign the project to
    if (userIDs.length > 0) {
      // pick a random judge
      const randomUserID = userIDs[Math.floor(Math.random() * userIDs.length)];
      console.log("Random judge", randomUserID);
      // get projects that can be assigned to a judge
      const canAssignProjects = Object.values(state.projects).filter((project: Project) => {
        // check that project is in current expo & round
        if (project.expoNumber != state.currentExpo || project.roundNumber !== state.currentRound) {
          return false;
        }

        // check that project is not currently assigned to the judge or in the judge's queue
        if (props.ballots.dJudgeQueues[randomUserID]) {
          if (project.id! === props.ballots.dJudgeQueues[randomUserID].activeProjectID
            || props.ballots.dJudgeQueues[randomUserID].otherProjectIDs.includes(project.id!)) {
            return false;
          }
        }
        // map projects to companies
        const projectCompanyList = project.categoryIDs.map((categoryID: number) => {
          return props.categories.categories[categoryID].company;
        });
        // return projects that match the judge's company
        return projectCompanyList.includes(props.users[randomUserID].company!);
        // sort projects by health
      }).sort((a: ProjectWithHealth, b: ProjectWithHealth) => {
        // return a.health - b.health;
        let company = props.users[randomUserID].company!
        return calculateProjectCompanyHealth(a, company) - calculateProjectCompanyHealth(b, company)
      });
      console.log("Projects to be assigned", canAssignProjects);
      
      if (canAssignProjects.length > 0) {
        // get lowest health value
        const lowestHealth = canAssignProjects[0].health;
        // get projects with health = lowest health value
        const sameLowestHealthProjects = canAssignProjects.filter((project: ProjectWithHealth) => {
          return project.health === lowestHealth;
        });

        // randomly pick project to assign from among projects with health = lowest health value
        // assign project to judge
        queueProject(sameLowestHealthProjects[Math.floor(Math.random() * sameLowestHealthProjects.length)].id!, randomUserID);
      }
    }
  };

  // Calculates the health of a project for a certain company
  const calculateProjectCompanyHealth = (project: Project, company: string): number => {
    let categoryHealth = 0;

    // Iterate over all judges
    for (const judgeID of Object.keys(props.ballots.dJudgeQueues).map(Number)) {
      // If the judge is not of the same company
      if (props.users[judgeID].company! !== company) {
        continue
      }
      let judgeQueue = props.ballots.dJudgeQueues[judgeID];
      // If project is in the queue increase the health by 1
      if (judgeQueue.queuedProject && judgeQueue.queuedProject.id === project.id!) {
        categoryHealth++;
      }

      // If project is currently being judged increase health by 2
      if (judgeQueue.activeProjectID === project.id!) {
        categoryHealth += 2;
      }

      // If judge already judged this project
      if (judgeQueue.otherProjectIDs.includes(project.id!)) {
        categoryHealth += 2;
      }
    }
    return categoryHealth;
  }

  const calculateProjectScore = (projectId: number): number => {
    if (!props.ballots.dProjectScores[projectId!]) {
      return 0;
    }

    const categoryScoreArrays: { [projectID: number]: { [userID: number]: number } } = {
      [projectId!]: {}
    };
    const defaultCategoryID = Object.values(props.categories.categories).filter((category: Category) => {
      return state.filterBy ? category.id! === state.filterBy : category.isDefault;
    })[0].id;
    const allUserBallots = Object.values(props.ballots.dProjectScores[projectId!]);
    for (const userBallots of allUserBallots) {
      for (const ballot of userBallots) {
        if (ballot.status === BallotStatus.Submitted) {
          if (props.categories.criteria[ballot.criteriaID].categoryID === defaultCategoryID) {
            if (!categoryScoreArrays[ballot.projectID][ballot.userID]) {
              categoryScoreArrays[ballot.projectID][ballot.userID] = 0;
            }

            categoryScoreArrays[ballot.projectID][ballot.userID] += ballot.score;
          }
        }
      }
    }

    const catScoreArrays = Object.values(categoryScoreArrays[projectId!]);
    const score = catScoreArrays.reduce((total, score) => total + score, 0) / (catScoreArrays.length > 0 ? catScoreArrays.length : 1);
    console.log(score);
    return score;
  }

  const moveProjectsToRound2 = async () => {
    const projects = [];
    for (const projectId of Object.keys(props.projects)) {
      if (calculateProjectScore(parseInt(projectId)) >= 0.5) {
        projects.push(props.projects[parseInt(projectId)]);
      }
    }
    const newRoundNumber = 2;
    try {
      const result = await Axios.post('/api/projects/changeProjectRounds', {
        projects,
        newRoundNumber
      });
      if (result.status) {
        alert('Projects moved to round 2!');
        window.location.reload();
      }
    } catch (error) {
      alert('Error moving projects!');
      console.log(error);
      return Promise.resolve();
    }
  }

  document.onkeypress = (event: any) => {
    if (event.key === ' ') {
      event.preventDefault();
      autoAssign();
    }
  }

  React.useEffect(() => {
    const onClick = (event: any) => {
      console.log(event.target.className);
      if (event.target.className !== 'dot' && !event.target.className.includes('judge')) {
        dismissPopover();
      }
    };
    const keydown = (event: any) => {
      if (event.key === 'Escape') {
        dismissPopover();
      }
    };

    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', keydown);
    props.subscribeQueueProject();
    props.subscribeQueuedProject();
    props.subscribeGotProject();
    props.subscribeScoreProject();
    props.subscribeBusyProject();
    props.subscribeMissingProject();
    props.subscribeSkipProject();

    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', keydown);
      props.unsubscribeAll();
    };
  }, []);

  const queueProject = (projectID: number, userID: number) => {
    props.queueProject(projectID, userID);
    props.queueProjectEmit(projectID, userID);
  };

  const dismissPopover = () => {
    dispatch({
      type: 'change-selected-project',
      projectID: '',
    });
  };

  const _getProjects = () => {
    const _handleSelectedProjectChange = async (projectID: string) => {
      if (state.selectedProject === projectID) {
        dispatch({ type: 'change-selected-project', projectID: '' });
      } else {
        dispatch({ type: 'change-selected-project', projectID });
      }
    };

    if (Object.values(props.tableGroups).length > 0 && Object.values(state.projects).length > 0) {
      // TODO sort projects by health, instead of just score.
      const projectCircles = Object.values(state.projects)
        .filter((project: ProjectWithHealth) => {
          return state.filterBy ? project.categoryIDs.includes(state.filterBy) : true;
        })
        .sort((a: ProjectWithHealth, b: ProjectWithHealth) => {
          switch (state.sortBy) {
            case SortType.AverageScore:
              if (!props.ballots.dProjectScores[a.id!] && !props.ballots.dProjectScores[b.id!]) {
                return 0;
              }
              if (!props.ballots.dProjectScores[b.id!]) {
                return -1;
              }
              if (!props.ballots.dProjectScores[a.id!]) {
                return 1;
              }

              const categoryScoreArrays: { [projectID: number]: { [userID: number]: number } } = {
                [a.id!]: {},
                [b.id!]: {},
              };
              const defaultCategoryID = Object.values(props.categories.categories).filter((category: Category) => {
                return state.filterBy ? category.id! === state.filterBy : category.isDefault;
              })[0].id;
              const allUserBallots = Object.values(props.ballots.dProjectScores[a.id!]).concat(Object.values(props.ballots.dProjectScores[b.id!]));
              for (const userBallots of allUserBallots) {
                for (const ballot of userBallots) {
                  if (ballot.status === BallotStatus.Submitted) {
                    if (props.categories.criteria[ballot.criteriaID].categoryID === defaultCategoryID) {
                      if (!categoryScoreArrays[ballot.projectID][ballot.userID]) {
                        categoryScoreArrays[ballot.projectID][ballot.userID] = 0;
                      }

                      categoryScoreArrays[ballot.projectID][ballot.userID] += ballot.score;
                    }
                  }
                }
              }

              const aCatScoreArrays = Object.values(categoryScoreArrays[a.id!]);
              const bCatScoreArrays = Object.values(categoryScoreArrays[b.id!]);
              console.log(aCatScoreArrays, bCatScoreArrays);

              const aScore = aCatScoreArrays.reduce((total, score) => total + score, 0) / (aCatScoreArrays.length > 0 ? aCatScoreArrays.length : 1);
              const bScore = bCatScoreArrays.reduce((total, score) => total + score, 0) / (bCatScoreArrays.length > 0 ? bCatScoreArrays.length : 1);
              // console.log(Object.values(categoryScoreArrays[a.id!]).length);
              console.log(aScore, bScore);
              return aScore < bScore ? 1 : -1;
            case SortType.ProjectHealth:
              return a.health - b.health;
            default:
              return ((a.tableGroupID * 1000) + a.tableNumber) - ((b.tableGroupID * 1000) + b.tableNumber);
          }
        })
        .reduce((output: ReactElement[], project: ProjectWithHealth) => {
          const tableGroup = props.tableGroups[project.tableGroupID];
          if (project.expoNumber === state.currentExpo && project.roundNumber === state.currentRound) {
            output.push(
              <PageAdminProjectsEpicenterProjectDot
                key={project.id!}
                dimmed={false}
                loading={false}
                userID={0}
                project={project}
                tableGroup={tableGroup}
                selectedProject={state.selectedProject + ' 0'}
                handleSelectedProjectChange={_handleSelectedProjectChange}
              />
            );
          }
          return output;
        }, []);

      if (projectCircles.length === 0) {
        return <p>No projects in this expo/round.</p>;
      }

      return projectCircles;
    }
  };

  const _getJudges = () => {
    const _handleJudgeSelection = (userID: number) => {
      console.log(state.selectedProject);
      if (state.selectedProject.length === 0) {
        return null;
      }

      if (
        props.ballots.dJudgeQueues[userID]
        && props.ballots.dJudgeQueues[userID].activeProjectID === +state.selectedProject
        || props.ballots.dJudgeQueues[userID]
        && props.ballots.dJudgeQueues[userID].otherProjectIDs.includes(+state.selectedProject)
      ) {
        return null;
      }

      if (props.projects[+state.selectedProject].categoryIDs.map((categoryID: number) => {
        return props.categories.categories[categoryID].company === props.users[userID].company!;
      }).includes(true)) {
        queueProject(+state.selectedProject, userID);
        dismissPopover();
      } else {
        // TOOD error
      }
    };

    const _handleJudgeSelectedProject = async (projectID: string) => {
      if (state.judgeSelectedProject === projectID) {
        dispatch({ type: 'change-judge-selected-project', projectID: '' });
      } else {
        dispatch({ type: 'change-judge-selected-project', projectID });
      }
    };

    const _getDerivedProjects = (userID: number) => {
      const toReturn = [];
      if (props.ballots.dJudgeQueues[userID]) {

        const queuedProject = props.ballots.dJudgeQueues[userID].queuedProject;
        if (queuedProject && queuedProject.id !== 0 && props.projects[queuedProject.id]) {
          toReturn.push(
            <PageAdminProjectsEpicenterProjectDot
              key={queuedProject.id}
              dimmed={false}
              loading={queuedProject.pending}
              tableGroup={props.tableGroups[props.projects[queuedProject.id].tableGroupID]}
              project={state.projects[queuedProject.id]}
              userID={userID}
              selectedProject={state.judgeSelectedProject}
              onContextMenu={(event) => {
                console.log(event.type);
                event.preventDefault();
                // TODO dequeue project here.
                return false;
              }}
              handleSelectedProjectChange={() => _handleJudgeSelectedProject(queuedProject.id + ' ' + userID)}
            />
          );
        } else {
          toReturn.push(
            <PageAdminProjectsEpicenterEmptyDot solid key={-1} />
          )
        }

        const activeProjectID = props.ballots.dJudgeQueues[userID].activeProjectID;
        if (activeProjectID && props.projects[activeProjectID]) {
          toReturn.push(
            <PageAdminProjectsEpicenterProjectDot
              key={activeProjectID}
              dimmed={false}
              loading={false}
              tableGroup={props.tableGroups[props.projects[activeProjectID].tableGroupID]}
              project={state.projects[activeProjectID]}
              selectedProject={state.judgeSelectedProject}
              userID={userID}
              handleSelectedProjectChange={() => _handleJudgeSelectedProject(activeProjectID + ' ' + userID)}
            />
          );
        } else {
          toReturn.push(
            <PageAdminProjectsEpicenterEmptyDot solid={false} key={-2} />
          )
        }

        const otherProjectIDs = props.ballots.dJudgeQueues[userID].otherProjectIDs;
        if (otherProjectIDs) {
          const other = [];
          for (const projectID of otherProjectIDs) {
            if (props.projects[projectID]) {
              other.push(
                <PageAdminProjectsEpicenterProjectDot
                  key={'' + projectID + ' ' + userID}
                  dimmed={true}
                  loading={false}
                  tableGroup={props.tableGroups[props.projects[projectID].tableGroupID]}
                  project={state.projects[projectID]}
                  userID={userID}
                  selectedProject={state.judgeSelectedProject}
                  handleSelectedProjectChange={() => _handleJudgeSelectedProject(projectID + ' ' + userID)}
                />
              );
            }
          }
          toReturn.push(other.reverse());
        }
      } else {
        toReturn.push([
          <PageAdminProjectsEpicenterEmptyDot solid key={-1} />,
          <PageAdminProjectsEpicenterEmptyDot solid={false} key={-2} />,
        ]);
      }

      return toReturn;
    };

    return Object.values(props.users).sort((a: User, b: User) => {
      return a.company! < b.company! ? -1 : 1;
    }).reduce((toShow: ReactElement[], user: User) => {
      if (user.isJudging) {
        toShow.push(
          <Card
            key={user.id}
            className={'judge'}
            style={{
              width: 220,
              margin: 5,
              cursor: 'pointer',
            }}
            onClick={() => _handleJudgeSelection(user.id!)}>
            <Card.Body className={'judge'}>
              <Card.Title className={'judge'}>{user.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {user.company}
              </Card.Subtitle>
              <div style={{ display: 'flex', flexFlow: 'wrap' }}>
                {_getDerivedProjects(user.id!)}
              </div>
            </Card.Body>
          </Card>
        );
      }
      return toShow;
    }, []);
  };

  return (
    <>
      <Accordion>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey='0'>
            Filter/Sort
          </Accordion.Toggle>
          <Accordion.Collapse eventKey='0'>
            <Card.Body>
              <h2>Sort</h2>
              <Button size='sm' onClick={() => dispatch({ type: 'change-sort-by', sortBy: SortType.Location})}>By Location</Button>
              <Button size='sm' onClick={() => dispatch({ type: 'change-sort-by', sortBy: SortType.AverageScore})}>By Average Score</Button>
              <Button size='sm' onClick={() => dispatch({ type: 'change-sort-by', sortBy: SortType.ProjectHealth})}>By Project Health</Button>
              <Button size='sm' onClick={() => dispatch({ type: 'change-sort-by', sortBy: SortType.TimesJudged})}>By Times Judged (Includes Pending/Assigned)</Button>
              <p style={{whiteSpace: 'pre-wrap'}}>
                  Currently sorting <strong>By {SortType[state.sortBy]}</strong>
              </p>
              <h2>Filter</h2>
              {Object.values(props.categories.categories).reduce((buttons: ReactElement[], category: Category) => {
                if (!category.generated) {
                  buttons.push(
                    <Button
                      key={category.id}
                      size='sm'
                      onClick={() => dispatch({
                        type: 'change-filter-by',
                        filterBy: category.id,
                      })}>By {category.name}</Button>
                  );
                }
                return buttons;
              }, [])}
              {state.filterBy &&
              <p style={{whiteSpace: 'pre-wrap'}}>
                Currently filtering <strong>By {Object.values(props.categories.categories)
                  .find((category: Category) => {return category.id === state.filterBy}).name}</strong>
              </p>
              }
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey='1'>
            Expo {state.currentExpo} | Round {state.currentRound}
            {/* | Goodness {state.powerGoodness} | Variance {state.powerVariance} | Skip {state.powerSkip} */}
          </Accordion.Toggle>
          <Accordion.Collapse eventKey='1'>
            <Card.Body>
              <InputGroup className="mb-3" style={{
                maxWidth: 150,
                marginRight: 10,
              }}>
                <InputGroup.Text>Expo #</InputGroup.Text>
                <FormControl
                  onChange={(event: any) => dispatch({ type: 'change-current-expo', currentExpo: +event.target.value })}
                  type='number'
                  value={"" + state.currentExpo} />
              </InputGroup>
              <InputGroup className="mb-3" style={{
                maxWidth: 150,
                marginRight: 10,
              }}>
                <InputGroup.Text>Round #</InputGroup.Text>
                <FormControl
                  onChange={(event: any) => dispatch({ type: 'change-current-round', currentRound: +event.target.value })}
                  type='number'
                  value={"" + state.currentRound} />
              </InputGroup>
              {/* <InputGroup className="mb-3" style={{
                maxWidth: 350,
                marginRight: 10,
              }}>
                <InputGroup.Text>Goodness Power</InputGroup.Text>
                <FormControl
                  onChange={(event: any) => dispatch({
                    type: 'change-parameters',
                    goodness: +event.target.value,
                    variance: state.powerVariance,
                    skip: state.powerSkip,
                  })}
                  step='0.1'
                  type='number'
                  value={"" + state.powerGoodness} />
              </InputGroup>
              <p>Good projects with >= 2 judges have lower health. Multiplier is taken to the (times judged * goodness power) power. 0 to disable.</p>
              <InputGroup className="mb-3" style={{
                maxWidth: 350,
                marginRight: 10,
              }}>
                <InputGroup.Text>Variance Power</InputGroup.Text>
                <FormControl
                  onChange={(event: any) => dispatch({
                    type: 'change-parameters',
                    goodness: state.powerGoodness,
                    variance: +event.target.value,
                    skip: state.powerSkip,
                  })}
                  step='0.1'
                  type='number'
                  value={"" + state.powerVariance} />
              </InputGroup>
              <p>Higher-variance projects with >= 2 judges have lower health. (5 / (5 + sstdev)) to the variancePower. 0 to disable.</p>
              <InputGroup className="mb-3" style={{
                maxWidth: 350,
                marginRight: 10,
              }}>
                <InputGroup.Text>Skip Power</InputGroup.Text>
                <FormControl
                  onChange={(event: any) => dispatch({
                    type: 'change-parameters',
                    goodness: state.powerGoodness,
                    variance: state.powerVariance,
                    skip: +event.target.value,
                  })}
                  step='0.1'
                  type='number'
                  value={"" + state.powerSkip} />
              </InputGroup>
              <p>Twice-skipped projects have lower health. Multiplier is (# skipped) to the skipPower. 0 to disable.</p> */}
            </Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey='2'>
            Bulk Move Projects
          </Accordion.Toggle>
          <Accordion.Collapse eventKey='2'>
            <Card.Body>
              <Button size='sm' onClick={() => {
                if (window.confirm('This operation will move all projects with score >=0.5 to round 2. Continue?')) {
                  moveProjectsToRound2()
                }
              }}>Move Projects to Round 2</Button>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        margin: '12px auto 0',
      }}>
        {_getProjects()}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        margin: '12px auto 0',
      }}>
        {_getJudges()}
      </div>
    </>
  );
};

const PageAdminProjectsEpicenter = connect(mapStateToProps, mapDispatchToProps)(PageAdminProjectsEpicenterComponent);

export default PageAdminProjectsEpicenter;
