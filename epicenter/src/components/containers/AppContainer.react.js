import { connect } from 'react-redux';
import App from '../App.react';

const mapStateToProps = state => {
  return {};
};

const AppContainer = connect(
  mapStateToProps,
)(App);

export default AppContainer;