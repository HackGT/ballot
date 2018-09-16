import { connect } from 'react-redux';
import JudgeListing from '../JudgeListing.react';

const mapStateToProps = state => {
  return {
    judgeIDs: state.canonical.users.keySeq(),
  };
};

const JudgeListingContainer = connect(
  mapStateToProps,
)(JudgeListing);

export default JudgeListingContainer;