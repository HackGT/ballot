import React from 'react';
import { Overlay, Popover, Badge, Spinner } from 'react-bootstrap';
import Project, { TableGroup } from '../../types/Project';
import { AppState } from '../../state/Store';
import { connect } from 'react-redux';
import { CategoryState } from '../../types/Category';

const mapStateToProps = (state: AppState) => {
	return {
    categories: state.categories,
	};
};

interface PageAdminProjectsEpicenterProjectDotProps {
  dimmed: boolean;
  categories: CategoryState;
  loading: boolean;
  tableGroup: TableGroup;
  project: Project;
  selectedProject: number;
  onClick?: (event: any) => void;
  onContextMenu?: (event: any) => void;
  handleSelectedProjectChange: (projectID: number) => void;
}

const PageAdminProjectsEpicenterProjectDotComponent: React.FC<PageAdminProjectsEpicenterProjectDotProps> = (props) => {
  const ref: any = React.useRef(React.createRef());

  const _getOverlay = () => {
    return (
      <Overlay
        show={props.selectedProject === props.project.id!}
        target={ref.current.current}>
        <Popover id={'popover' + props.project.id}>
          <strong>{props.project.name}</strong>
          <p><a href={props.project.devpostURL} target='_blank'>{props.project.devpostURL}</a><br />
            {props.project.categoryIDs.map((categoryID: number) => {
              return (
                <Badge
                  key={categoryID}
                  variant={props.categories[categoryID].generated ? 'secondary' : 'primary'}
                  style={{ margin: '0 2px' }}>
                  {props.categories[categoryID].name}
                </Badge>
              );
            })}
          </p>
        </Popover>
      </Overlay>
    );
  };

  return (
    <div key={props.project.id} onClick={props.onClick} onContextMenu={props.onContextMenu}>
      <div
        ref={ref.current}
        key={props.project.id!}
        id={"" + props.project.id!}
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
          filter: props.selectedProject === props.project.id! ? 'invert(30%)' : '',
          userSelect: 'none',
          MozUserSelect: 'none',
          cursor: 'pointer',
        }}
        onClick={() => props.handleSelectedProjectChange(props.project.id!)} >
        <div style={{
          display: 'grid',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {props.loading ? <Spinner animation="border" style={{ gridRow: 1, gridColumn: 1 }} /> : null}
          <strong className='dot' style={{ gridRow: 1, gridColumn: 1 }}>{props.tableGroup.shortcode}{props.project.tableNumber}</strong>
        </div>
      </div>
      {_getOverlay()}
    </div>
  );
};

const PageAdminProjectsEpicenterProjectDot = connect(mapStateToProps)(PageAdminProjectsEpicenterProjectDotComponent);

export default PageAdminProjectsEpicenterProjectDot;

