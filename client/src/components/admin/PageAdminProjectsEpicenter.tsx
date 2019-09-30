import React, { ReactElement } from 'react';
import { InputGroup, Card, FormControl } from 'react-bootstrap';
import { connect } from 'react-redux';

import User from '../../types/User';
import { AppState } from '../../state/Store';
import Project, { ProjectState, TableGroupState } from '../../types/Project';
import { UserState } from '../../types/User';
import { requestStart, requestFinish } from '../../state/Request';
import { CategoryState } from '../../types/Category';
import PageAdminProjectsEpicenterProjectDot from './PageAdminProjectsEpicenterProjectDot';
import PageAdminProjectsEpicenterEmptyDot from './PageAdminProjectsEpicenterEmptyDot';
import { queueProject, subscribeQueuedProject } from '../../state/Ballot';
import Ballot, { BallotState, BallotStatus } from '../../types/Ballot';

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
    subscribeQueuedProject: () => {
      dispatch(subscribeQueuedProject());
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
  categories: CategoryState;
  projects: ProjectState;
  tableGroups: TableGroupState;
  users: UserState;
  queueProject: (projectID: number, userID: number) => void;
  subscribeQueuedProject: () => void;
  requestFinish: () => void;
  requestStart: () => void;
}

type State = {
  currentExpo: number;
  requesting: boolean;
  selectedProject: number;
  judgeSelectedProject: number;
}

type Action =
  | { type: 'change-current-expo', currentExpo: number }
  | { type: 'change-selected-project', projectID: number }
  | { type: 'change-judge-selected-project', projectID: number };

const PageAdminProjectsEpicenterComponent: React.FC<PageAdminProjectsEpicenterProps> = (props) => {
	const [state, dispatch] = React.useReducer((state: State, action: Action) => {
		switch (action.type) {
      case 'change-current-expo':
        return { ...state, currentExpo: action.currentExpo > 0 ? action.currentExpo : 1 };
      case 'change-selected-project':
        return { ...state, selectedProject: action.projectID, judgeSelectedProject: 0 };
      case 'change-judge-selected-project':
        return { ...state, selectedProject: 0, judgeSelectedProject: action.projectID };
			default:
				return state;
		}
	}, {
    currentExpo: 1,
    requesting: false,
    selectedProject: 0,
    judgeSelectedProject: 0,
  }, undefined);

  React.useEffect(() => {
    const onClick = (event: any) => {
      console.log(event.target.className);
      if (event.target.className !== 'dot' && !event.target.className.includes('judge')) {
        dismissPopover();
      }
    };
    const keydown = (event: any) => {
      if (event.key === "Escape") {
        dismissPopover();
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', keydown);
    props.subscribeQueuedProject();

    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', keydown)
    };
  }, []);

  const dismissPopover = () => {
    dispatch({
      type: 'change-selected-project',
      projectID: 0,
    });
  };

  const _getProjects = () => {
    const _handleSelectedProjectChange = async (projectID: number) => {
      if (state.selectedProject === projectID) {
        dispatch({ type: 'change-selected-project', projectID: 0 });
      } else {
        dispatch({ type: 'change-selected-project', projectID });
      }
    };

    if (Object.values(props.tableGroups).length > 0 && Object.values(props.projects).length > 0) {
      const projectCircles = Object.values(props.projects).reduce((output, project: Project) => {
        const tableGroup = props.tableGroups[project.tableGroupID];
        if (project.expoNumber === state.currentExpo) {
          output.push(
            <PageAdminProjectsEpicenterProjectDot
              key={project.id!}
              dimmed={false}
              loading={false}
              project={project}
              tableGroup={tableGroup}
              selectedProject={state.selectedProject}
              handleSelectedProjectChange={_handleSelectedProjectChange}
             />
          );
        }
        return output;
      }, []);

      if (projectCircles.length === 0) {
        return <p>No projects in this expo.</p>;
      }

      return projectCircles;
    }
  };

  const _getJudges = () => {
    const _handleJudgeSelection = (userID: number) => {
      console.log(state.selectedProject);
      if (state.selectedProject !== 0) {
        props.queueProject(state.selectedProject, userID);
        dismissPopover();
      }
    };

    const _handleJudgeSelectedProject = async (projectID: number) => {
      if (state.judgeSelectedProject === projectID) {
        dispatch({ type: 'change-judge-selected-project', projectID: 0 });
      } else {
        dispatch({ type: 'change-judge-selected-project', projectID });
      }
    };

    const _getDerivedProjects = (userID: number) => {
      const toReturn = [];
      if (props.ballots.dJudgeQueues[userID]) {

        const queuedProject = props.ballots.dJudgeQueues[userID].queuedProject;
        if (queuedProject) {
          toReturn.push(
            <PageAdminProjectsEpicenterProjectDot
              key={queuedProject.id}
              dimmed={false}
              loading={queuedProject.pending}
              tableGroup={props.tableGroups[props.projects[queuedProject.id].tableGroupID]}
              project={props.projects[queuedProject.id]}
              selectedProject={state.judgeSelectedProject}
              onContextMenu={(event) => {
                console.log(event.type);
                event.preventDefault();
                // TODO dequeue project here.
                return false;
              }}
              handleSelectedProjectChange={() => _handleJudgeSelectedProject(queuedProject.id)}
            />
          );
        } else {
          toReturn.push(
            <PageAdminProjectsEpicenterEmptyDot solid key={-1} />
          )
        }

        const activeProjectID = props.ballots.dJudgeQueues[userID].activeProjectID;
        if (activeProjectID) {
          toReturn.push(
            <PageAdminProjectsEpicenterProjectDot
              key={activeProjectID}
              dimmed={false}
              loading={false}
              tableGroup={props.tableGroups[props.projects[activeProjectID].tableGroupID]}
              project={props.projects[activeProjectID]}
              selectedProject={state.judgeSelectedProject}
              handleSelectedProjectChange={() => _handleJudgeSelectedProject(activeProjectID)}
            />
          );
        } else {
          toReturn.push(
            <PageAdminProjectsEpicenterEmptyDot solid={false} key={-2} />
          )
        }

        for (const projectID of props.ballots.dJudgeQueues[userID].otherProjectIDs) {
          toReturn.push(
            <PageAdminProjectsEpicenterProjectDot
              key={projectID}
              dimmed={true}
              loading={false}
              tableGroup={props.tableGroups[props.projects[projectID].tableGroupID]}
              project={props.projects[projectID]}
              selectedProject={state.judgeSelectedProject}
              handleSelectedProjectChange={() => _handleJudgeSelectedProject(projectID)}
            />
          );
        }
      } else {
        toReturn.push([
          <PageAdminProjectsEpicenterEmptyDot solid key={-1} />,
          <PageAdminProjectsEpicenterEmptyDot solid={false} key={-2} />,
        ]);
      }

      return toReturn;
    };

    return Object.values(props.users).reduce((toShow: ReactElement[], user: User) => {
      if (user.isJudging) {
        toShow.push(
          <Card
            key={user.id}
            className={'judge'}
            style={{
              width: 300,
              margin: 5,
              cursor: 'pointer',
            }}
            onClick={() => _handleJudgeSelection(user.id!)}>
            <Card.Body className={'judge'}>
              <Card.Title className={'judge'}>{user.name}</Card.Title>
              <div style={{ display: 'flex' }}>
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
      <InputGroup className="mb-3" style={{
        maxWidth: 150,
        margin: '0 auto',
      }}>
        <InputGroup.Text>Expo #</InputGroup.Text>
        <FormControl
          onChange={(event: any) => dispatch({ type: 'change-current-expo', currentExpo: +event.target.value })}
          type='number'
          value={"" + state.currentExpo} />
      </InputGroup>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        maxWidth: 1300,
        margin: '12px auto 0',
      }}>
        {_getProjects()}
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        maxWidth: 1300,
        margin: '12px auto 0',
      }}>
        {_getJudges()}
      </div>
    </>
	);
};

const PageAdminProjectsEpicenter = connect(mapStateToProps, mapDispatchToProps)(PageAdminProjectsEpicenterComponent);

export default PageAdminProjectsEpicenter;
