import React, { ReactElement } from 'react';
import { Badge, Button, Overlay, Popover, Spinner } from 'react-bootstrap';
import Project, { ProjectWithHealth, TableGroup } from '../../types/Project';
import { AppState } from '../../state/Store';
import { connect } from 'react-redux';
import { CategoryCriteriaState } from '../../types/Category';
import { BallotState } from '../../types/Ballot';
import { changeProjectRound } from "../../state/Project";

const mapStateToProps = (state: AppState) => {
  return {
    categories: state.categories,
    ballots: state.ballots,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    changeProjectRound: (project: Project, newRoundNumber: number) => {
      dispatch(changeProjectRound(project, newRoundNumber));
    }
  }
}

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
  changeProjectRound: (project: Project, newRoundNumber: number) => void;
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

    const _changeRound = (difference: number) => {
      props.changeProjectRound(props.project, props.project.roundNumber + difference);
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
                  {props.categories.categories[+categoryID].name} -
                  AVG: {scoresArray.reduce((total, value) => total + value, 0) / scoresArray.length} [{scoresArray.join(', ')}]
                </p>
              )
            })
            : 'No Scores'}
          <p><br />Change Round</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => _changeRound(-1)}
            disabled={props.project.roundNumber == 1}
          >
            Move Back 1
          </Button>
          {' '}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => _changeRound(1)}
          >
            Move Up 1
          </Button>
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
          width: 60,
          height: 60,
          background: props.tableGroup.color,
          opacity: props.dimmed ? 0.5 : 1,
          color: 'white',
          textAlign: 'center',
          lineHeight: '40px',
          filter: props.selectedProject === props.project.id! + ' ' + props.userID ? 'invert(30%)' : '',
          userSelect: 'none',
          MozUserSelect: 'none',
          cursor: 'pointer',
        }}
        onClick={() => props.handleSelectedProjectChange('' + props.project.id!)}>
        <div style={{
          display: 'flex',
          flexDirection: "column",
          alignItems: 'center',
          justifyContent: 'space-evenly',
          width: 60,
          height: 60,
          fontWeight: "bold",
          lineHeight: "initial"
        }} className='dot'>
          {props.loading ? <Spinner animation="border" style={{ gridRow: 1, gridColumn: 1 }} /> : null}
          <span style={{ fontSize: 10 }}>E: {props.project.expoNumber}</span>
          <span style={{ fontSize: 10 }}>R: {props.project.roundNumber}</span>
          <span>{props.tableGroup.shortcode}{props.project.tableNumber}</span>
        </div>
      </div>
      {_getOverlay()}
    </div>
  );
};

const PageAdminProjectsEpicenterProjectDot = connect(mapStateToProps, mapDispatchToProps)(PageAdminProjectsEpicenterProjectDotComponent);

export default PageAdminProjectsEpicenterProjectDot;

