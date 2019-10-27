import Axios from 'axios';
import React from 'react';
import { connect } from 'react-redux';
import { Button, Card, ButtonGroup, Form } from 'react-bootstrap';

import Ballot, { BallotObject, BallotStatus } from '../../types/Ballot';
import Category, { CategoryState, CriteriaState, Criteria, CategoryCriteriaState } from '../../types/Category';
import Project, { ProjectState, TableGroupState, EMPTY_PROJECT } from '../../types/Project';
import User from '../../types/User';
import { AppState } from '../../state/Store';
import { fetchCategories } from '../../state/Category';
import { fetchTableGroups } from '../../state/TableGroup';
import { requestStart, requestFinish } from '../../state/Request';
import { updateBallots, startBallots, scoreBallots, clearBallots, missingBallots, busyBallots, skipBallots } from '../../state/Ballot';
// @ts-ignore
import { SvgLoader, SvgProxy } from 'react-svgmt';

import './PageJudging.css';

const mapStateToProps = (state: AppState) => {
	return {
		account: state.account,
		ballots: state.ballots,
		categories: state.categories,
		tableGroups: state.tableGroups,
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		fetchTableGroups: () => {
			dispatch(fetchTableGroups());
		},
		fetchCategories: () => {
			dispatch(fetchCategories());
		},
		updateBallots: (ballots: BallotObject) => {
			dispatch(updateBallots(ballots));
		},
		startBallots: (userID: number, projectID: number) => {
			dispatch(startBallots(userID, projectID));
		},
		clearBallots: () => {
			dispatch(clearBallots());
		},
		requestFinish: () => {
			dispatch(requestFinish());
		},
		requestStart: () => {
			dispatch(requestStart());
		},
		missingBallots: (userID: number, projectID: number) => {
			dispatch(missingBallots(userID, projectID));
		},
		busyBallots: (userID: number, projectID: number) => {
			dispatch(busyBallots(userID, projectID));
		},
		skipBallots: (userID: number, projectID: number) => {
			dispatch(skipBallots(userID, projectID));
		},
	};
};

enum JudgingState {
	Loading = 0,
	FindProject = 1,
	JudgeProject = 2,
	NextProject = 3,
	NoProject = 4,
}

interface PageJudgingProps {
	account: User;
	ballots: BallotObject;
	categories: CategoryCriteriaState;
	tableGroups: TableGroupState;
	fetchTableGroups: () => void;
	fetchCategories: () => void;
	startBallots: (userID: number, projectID: number) => void;
	clearBallots: () => void;
	updateBallots: (ballots: BallotObject) => void;
	missingBallots: (userID: number, projectID: number) => void;
	busyBallots: (userID: number, projectID: number) => void;
	skipBallots: (userID: number, projectID: number) => void;
}

type State = {
	criteria: CriteriaState;
	currentProject: Project | undefined;
	judgingState: JudgingState;
}

type Action =
	| { type: 'update-current-project', project: Project | undefined }
	| { type: 'update-judging-state', state: JudgingState }
	| { type: 'update-criteria', criteria: CriteriaState };

const PageJudgingComponent: React.FC<PageJudgingProps> = (props) => {
	const [state, dispatch] = React.useReducer((state: State, action: Action) => {
		switch (action.type) {
			case 'update-criteria':
				return { ...state, criteria: action.criteria };
			case 'update-current-project':
				return { ...state, currentProject: action.project };
			case 'update-judging-state':
				return { ...state, judgingState: action.state };
			default:
				return state;
		}
	}, {
		criteria: {},
		currentProject: undefined,
		judgingState: JudgingState.Loading,
	}, undefined);

	const updateBallotState = (ballots: BallotObject) => {
		if (Object.values(ballots).length > 0) {
			const firstBallot: Ballot = Object.values(ballots)[0];

			if (firstBallot.status === BallotStatus.Started) {
				dispatch({ type: 'update-judging-state', state: JudgingState.JudgeProject });
			} else if (firstBallot.status === BallotStatus.Assigned) {
				dispatch({ type: 'update-judging-state', state: JudgingState.FindProject });
			}
		} else {
			dispatch({ type: 'update-current-project', project: EMPTY_PROJECT });
			dispatch({ type: 'update-judging-state', state: JudgingState.NoProject });
		}
	}

	const fetchNextProject = async (userID: number) => {
		const result = await Axios.post('/api/projects/nextProject', {
			userID,
		});

		if (Object.values(result.data.ballots).length > 0) {
			const ballots: BallotObject = result.data.ballots;
			const projects: ProjectState = result.data.project;
			props.updateBallots(ballots);
			dispatch({ type: 'update-current-project', project: Object.values(projects)[0] });
		}

		updateBallotState(result.data.ballots);
	};

	React.useEffect(() => {
		props.fetchTableGroups();
		props.fetchCategories();
		fetchNextProject(props.account.id!);
	}, []);

	React.useEffect(() => {
		updateBallotState(props.ballots);
	}, [props.ballots])

	const _getSkipButtons = () => {
		const reset = () => {
			dispatch({ type: 'update-judging-state', state: JudgingState.NextProject });
			dispatch({ type: 'update-current-project', project: EMPTY_PROJECT });
		};
		return (
			<div style={{ marginTop: 20 }}>
				<ButtonGroup>
					{/* <Button
						onClick={() => {
							props.missingBallots(props.account.id!, state.currentProject!.id!);
							reset();
						}}
						variant='outline-danger'>
						Missing
					</Button> */}
					{/* <Button
						onClick={() => {
							props.busyBallots(props.account.id!, state.currentProject!.id!);
							reset();
						}}
						variant='outline-danger'>
						Busy
					</Button> */}
					<Button
						onClick={() => {
							props.skipBallots(props.account.id!, state.currentProject!.id!);
							reset();
						}}
						variant='outline-danger'>
						Skip
					</Button>
				</ButtonGroup>
			</div>
		);
	};

	const _renderFindProject = () => {
		const handleImHere = () => {
			props.startBallots(props.account.id!, state.currentProject!.id!);
		};

		if (state.currentProject && state.currentProject.id !== 0) {
			const slug = `${props.tableGroups[state.currentProject!.tableGroupID].name}_${state.currentProject!.tableNumber}`
			console.log(slug + " > path");
			return (
				<div style={{
					textAlign: 'center',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center'
				}}>
					<h6>Next Project</h6>
					<h1><a href={state.currentProject!.devpostURL} style={{ color: 'black', textDecoration: 'underline' }} target='_blank'>{state.currentProject!.name}</a></h1>
					<h3>
						At <span style={{ color: props.tableGroups[state.currentProject!.tableGroupID].color }}>{props.tableGroups[state.currentProject!.tableGroupID].name}</span> {state.currentProject!.tableNumber}
					</h3>
					<Button
						style={{ marginTop: 20, padding: '10px 30px', fontSize: 25 }}
						variant='success'
						onClick={handleImHere}>
						I'm Here
					</Button>
					{_getSkipButtons()}
					<SvgLoader width="350" path={"judging_map.svg"}>
						<SvgProxy selector={"#" + slug + " > path"} fill={props.tableGroups[state.currentProject!.tableGroupID].color} />
					</SvgLoader>
				</div>
			);
		}

		return null;
	};

	const _renderJudgeProject = () => {
		const _renderScoreRange = (ballotID: number, min: number, max: number) => {
			return (
				<>
					<div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
						{min}
						<input
							type='range'
							min={min}
							max={max}
							className='slider'
							value={props.ballots[ballotID].score}
							onChange={(event) => {
								props.updateBallots({
									[ballotID]: {
										...props.ballots[ballotID],
										score: +event.target.value,
									},
								});
							}} />
						{max}
					</div>
					<div>
						<strong>{props.ballots[ballotID].score}</strong>
					</div>
				</>
			);
		};

		const _renderBallots = () => {
			return Object.values(props.ballots).map((ballot: Ballot) => {
				if (!ballot.criteriaID) {
					return null;
				}

				const category: Category = props.categories.categories[props.categories.criteria[ballot.criteriaID].categoryID];
				const criteria = props.categories.criteria[ballot.criteriaID];
				return (
					<Card
						key={ballot.id}
						style={{
							margin: '12px 0',
						}}>
						<Card.Body>
							<Card.Title>{criteria.name}</Card.Title>
							<Card.Subtitle>{category.name}</Card.Subtitle>
							<Card.Text style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>{criteria.rubric}</Card.Text>
							{_renderScoreRange(ballot.id!, criteria.minScore, criteria.maxScore)}
						</Card.Body>
					</Card>
				);
			});
		};

		const _handleScoreBallots = async () => {
			const scoreObject = Object.values(props.ballots).reduce((dict, ballot: Ballot) => {
				dict[ballot.id!] = ballot.score;
				return dict;
			}, {});

			const result = await Axios.post('api/projects/scoreProject', {
				ballots: scoreObject,
			});

			if (result.status) {
				props.clearBallots();
				dispatch({ type: 'update-judging-state', state: JudgingState.NextProject });
				dispatch({ type: 'update-current-project', project: EMPTY_PROJECT });
			} else {
				// TODO error checking.
			}
		}

		if (state.currentProject && state.currentProject.id !== 0) {
			return (
				<div style={{ maxWidth: 560, textAlign: 'center', margin: '0 auto' }}>
					<h1><a href={state.currentProject!.devpostURL} style={{ color: 'black', textDecoration: 'underline' }} target='_blank'>{state.currentProject!.name}</a></h1>
					<h6><span style={{ color: props.tableGroups[state.currentProject!.tableGroupID].color }}>{props.tableGroups[state.currentProject!.tableGroupID].name}</span> {state.currentProject!.tableNumber}</h6>
					{_renderBallots()}
					<Button
						size='lg'
						variant='success'
						onClick={() => _handleScoreBallots()}
						>Submit Scores</Button>
					{_getSkipButtons()}
				</div>
			);
		}

		return null;
	};

	const _renderNextProject = () => {
		const exclamations = [
			'You are out of control!',
			'Absolutely incredible!',
			'Congratulations!',
			`You're on a roll!`,
			`Keep it going!`,
			`Just a couple hundred projects left to go!`,
			`Great Job`,
		];
		return (
			<div style={{ textAlign: 'center' }}>
				<h3>{exclamations[Math.floor(Math.random() * exclamations.length)]}</h3>
				<p>Your scores have been submitted!</p>
				<Button onClick={() => fetchNextProject(props.account.id!)}>Next Project</Button>
			</div>
		);
	};

	const _renderNoProject = () => {
		return (
			<div style={{ textAlign: 'center' }}>
				<p>There are currently no projects assigned to you.</p>
				<Button onClick={() => fetchNextProject(props.account.id!)}>Refresh</Button>
			</div>
		);
	};

	if (
		Object.values(props.tableGroups).length === 0
		|| !state.currentProject
		|| Object.values(props.categories.criteria).length === 0) {
		return null;
		// TODO loading
	}

	switch (state.judgingState) {
		case JudgingState.FindProject:
			return _renderFindProject();
		case JudgingState.JudgeProject:
			return _renderJudgeProject();
		case JudgingState.NextProject:
			return _renderNextProject();
		case JudgingState.NoProject:
			return _renderNoProject();
	}

	return null;
};

const PageJudging = connect(mapStateToProps, mapDispatchToProps)(PageJudgingComponent);

export default PageJudging;
