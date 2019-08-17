import React from 'react';
import { AppState } from '../../state/Store';
import User from '../../types/User';
import { loginUser } from '../../state/Account';
import { connect } from 'react-redux';

const mapStateToProps = (state: AppState) => {
	return {
		account: state.account,
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		loginUser: (user: User) => {
			dispatch(loginUser(user));
		},
	};
};

interface PageProjectsProps {
	account: User;
	loginUser: (user: User) => void;
}

type State = {
	requesting: boolean;
}

type Action =
	| { type: 'request-start'}
	| { type: 'request-finish'};

const PageProjectsComponent: React.FC<PageProjectsProps> = (props) => {
	const [state, dispatch] = React.useReducer((state: State, action: Action) => {
		switch (action.type) {
			case 'request-start':
				return { ...state, requesting: true };
			case 'request-finish':
				return { ...state, requesting: false };
			default:
				return state;
		}
	}, {
		requesting: false,
	}, undefined);

	return (
		<div>Projects</div>
	);
};

const PageProjects = connect(mapStateToProps, mapDispatchToProps)(PageProjectsComponent);

export default PageProjects;
