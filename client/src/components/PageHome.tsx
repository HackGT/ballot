import React from 'react';
import { AppState } from '../state/Store';
import User, { UserRole, getRoleString } from '../types/User';
import { loginUser } from '../state/Account';
import { connect } from 'react-redux';
import PageProjects from './expo/PageProjects';

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

interface PageHomeProps {
  account: User;
  loginUser: (user: User) => void;
}

type State = {
  requesting: boolean;
}

type Action =
  | { type: 'request-start'}
  | { type: 'request-finish'};

const containerStyle: React.CSSProperties = {
  maxWidth: 720,
  margin: '0 auto',
};

const PageHomeComponent: React.FC<PageHomeProps> = (props) => {
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

  const header = <h1>Welcome To Ballot!</h1>;
  const yourRole = <strong>Your Status: {getRoleString(props.account.role)}</strong>;
  const adminBlurb = <p>Hello {props.account.name}! Thank you for using Ballot! As an owner, you have full control over every aspect of the judging and expo process. You will be able to assign tables, judges, and how projects are scored. This also means you have the potential to cause issues if you are not careful. Please make sure you have read through all the user guides before messing with the available tools.</p>
  const mobileBlurb = <p>Ballot works on devices of all screen sizes! If you are using a tablet or laptop, you can use the navigation bar to navigation throughout this application. If you are on a mobile device, simply click the menu button on the upper right to access all the pages.</p>
  const projectsBlurb = <p>To view all the projects at this hackathon, go to the projects page. Each project has an expo number and table number. If you tap/click on the project, you will be directed to the Devpost entry, where the group will go into more detail about the project, present videos and images, and show where you can see their project.</p>;
  const judgingBlurb = <p>If you go to the judging page, you will be able to judge projects as they are assigned to you. Projects will automatically be assigned to you, so all you have to do is wait for the next project to pop in. Ballot will guide you through the process and will provide you with a timer to keep you on track. You will also be presented with the judging criteria and rubric while you're scoring. </p>
  const profileBlurb = <p>Make sure to go to your profile to add any skills, programming languages, fields, or other keywords so that Ballot can try to optimize the projects you receive to match your experience and expertise!</p>
  const pendingBlurb = <p>Congratulations! You just signed up for an account; however, you are not yet approved to judge. Your page will automatically update once the admins have approved you to judge!</p>

  const ownerBody = (
    <div style={containerStyle}>
      {header}
      {yourRole}
      {adminBlurb}
      {mobileBlurb}

    </div>
  );
  const adminBody = (
    <div style={containerStyle}>
      {header}
      {yourRole}
      {adminBlurb}
      {mobileBlurb}
    </div>
  );
  const judgeBody = (
    <div style={containerStyle}>
      {header}
      {yourRole}
      {mobileBlurb}
      {projectsBlurb}
      {judgingBlurb}
      {/* {profileBlurb} */}
    </div>
  );
  const pendingBody = (
    <div style={containerStyle}>
      {header}
      {yourRole}
      {mobileBlurb}
      {projectsBlurb}
      {pendingBlurb}
      {/* {profileBlurb} */}
    </div>
  );

  switch (props.account.role) {
    case UserRole.Owner:
      return ownerBody;
    case UserRole.Admin:
      return adminBody;
    case UserRole.Judge:
      return judgeBody;
    case UserRole.Pending:
      return pendingBody;
  }

  return (
    <PageProjects />
  );
};

const PageHome = connect(mapStateToProps, mapDispatchToProps)(PageHomeComponent);

export default PageHome;
