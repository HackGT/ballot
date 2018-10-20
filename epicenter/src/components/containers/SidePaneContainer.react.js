import { connect } from 'react-redux';
import SidePane from '../SidePane.react';

const mapStateToProps = state => {
  return {
    pane: state.program.get('leftPane'),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setPane: pane => {
      dispatch({
        type: 'SET_PANE',
        pane,
      });
    },
  };
};

const SidePaneContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SidePane);

export default SidePaneContainer;
