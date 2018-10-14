import { connect } from 'react-redux';
import SidePane from '../SidePane.react';

const mapStateToProps = state => {
  return {
    pane: state.program.get('leftPane'),
  };
};

const SidePaneContainer = connect(
  mapStateToProps,
)(SidePane);

export default SidePaneContainer;
