import React, { ReactElement } from 'react';
import { Overlay, Popover, Badge, Spinner } from 'react-bootstrap';
import Project, { TableGroup, ProjectWithHealth } from '../../types/Project';
import { AppState } from '../../state/Store';
import { connect } from 'react-redux';
import { CategoryState, CategoryCriteriaState } from '../../types/Category';
import { BallotState } from '../../types/Ballot';

const mapStateToProps = (state: AppState) => {
	return {
    categories: state.categories,
    ballots: state.ballots,
	};
};

interface PageAdminProjectsEpicenterProjectDotProps {
  ballots: BallotState;
  dimmed: boolean;
  categories: CategoryCriteriaState;
  loading: boolean;
  tableGroup: TableGroup;
  project: ProjectWithHealth;
  selectedProject: string;
  userID: number;
  onClick?: (event: any) => void;
  onContextMenu?: (event: any) => void;
  handleSelectedProjectChange: (projectID: string) => void;
}

const PageAdminProjectsEpicenterProjectDotComponent: React.FC<PageAdminProjectsEpicenterProjectDotProps> = (props) => {
  const ref: any = React.useRef(React.createRef());

  const _getOverlay = () => {
    const categoryScoreArrays: {
      [categoryID: number]: {
        [userID: number]: number;
      };
    } = {};
    if (props.ballots.dProjectScores[props.project.id!] && Object.values(props.ballots.dProjectScores[props.project.id!]).length > 0 && Object.values(props.categories.criteria).length > 0) {
      const allUserBallots = Object.values(props.ballots.dProjectScores[props.project.id!]);
      for (const userBallots of allUserBallots) {
        for (const ballot of userBallots) {
          if (!categoryScoreArrays[props.categories.criteria[ballot.criteriaID].categoryID]) {
            categoryScoreArrays[props.categories.criteria[ballot.criteriaID].categoryID] = {};
          }

          if (!categoryScoreArrays[props.categories.criteria[ballot.criteriaID].categoryID][ballot.userID]) {
            categoryScoreArrays[props.categories.criteria[ballot.criteriaID].categoryID][ballot.userID] = 0;
          }

          categoryScoreArrays[props.categories.criteria[ballot.criteriaID].categoryID][ballot.userID] += ballot.score;
        }
      }
    }

    return (
      <Overlay
        show={props.selectedProject === props.project.id! + ' ' + props.userID}
        target={ref.current.current}>
        <Popover id={'popover' + props.project.id}>
          <strong>{props.project.name}</strong>
          <p><a href={props.project.devpostURL} target='_blank'>{props.project.devpostURL}</a><br />
            {props.project.categoryIDs.reduce((badges: ReactElement[], categoryID: number) => {
              if (props.categories.categories[categoryID]) {
                const badgeVariant =
                  props.categories.categories[categoryID].generated
                  ? 'secondary'
                  : props.categories.categories[categoryID].isDefault
                    ? 'success' : 'primary';
                badges.push(
                  <Badge
                    key={categoryID}
                    variant={badgeVariant}
                    style={{ margin: '0 2px' }}>
                    {props.categories.categories[categoryID].name}
                  </Badge>
                );
              }
              return badges;
            }, [])}
          </p>
          <p>Health: {props.project.health}</p>
          {Object.keys(categoryScoreArrays).length > 0
            ? Object.keys(categoryScoreArrays).map((categoryID: string) => {
              const scoresArray = Object.values(categoryScoreArrays[+categoryID])
              return (
                <p style={{ margin: 0 }} key={categoryID}>
                  {props.categories.categories[+categoryID].name} - AVG: {scoresArray.reduce((total, value) => total + value, 0) / scoresArray.length} [{scoresArray.join(', ')}]
                </p>
              )
            })
            : 'No Scores'}
        </Popover>
      </Overlay>
    );
  };

  if (!props.project) {
    return null;
  }

  return (
    <div key={props.project.id + ' ' + props.userID} onClick={props.onClick} onContextMenu={props.onContextMenu}>
      <div
        ref={ref.current}
        key={props.project.id! + ' ' + props.userID}
        id={props.project.id! + ' ' + props.userID}
        className='dot'
        style={{
          margin: 2,
          width: 40,
          height: 40,
          background: props.tableGroup.color,
          opacity: props.dimmed ? 0.5 : 1,
          borderRadius: '50%',
          color: 'white',
          textAlign: 'center',
          lineHeight: '40px',
          filter: props.selectedProject === props.project.id! + ' ' + props.userID ? 'invert(30%)' : '',
          userSelect: 'none',
          MozUserSelect: 'none',
          cursor: 'pointer',
        }}
        onClick={() => props.handleSelectedProjectChange('' + props.project.id!)} >
        <div style={{
          display: 'grid',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
        }}>
          {props.loading ? <Spinner animation="border" style={{ gridRow: 1, gridColumn: 1 }} /> : null}
          <strong className='dot' style={{ gridRow: 1, gridColumn: 1, lineHeight: 0.9, marginBottom: 8 }}>
            <span style={{ fontSize: 10 }}>{props.project.expoNumber}</span><br />
            {props.tableGroup.shortcode}{props.project.tableNumber}
          </strong>
        </div>
      </div>
      {_getOverlay()}
    </div>
  );
};

const PageAdminProjectsEpicenterProjectDot = connect(mapStateToProps)(PageAdminProjectsEpicenterProjectDotComponent);

export default PageAdminProjectsEpicenterProjectDot;
