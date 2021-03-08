import Axios from 'axios';
import React from 'react';
import { Card, ListGroup, ListGroupItem, ButtonGroup, Button, Badge } from 'react-bootstrap';
import { connect } from 'react-redux';

import { deleteCategory } from '../../state/Category';
import Category, { Criteria } from '../../types/Category';
import { requestFinish, requestStart } from '../../state/Request';
import { AppState } from '../../state/Store';

const mapStateToProps = (state: AppState) => {
	return {
		requesting: state.requesting,
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		deleteCategory: (categoryID: number) => {
			dispatch(deleteCategory(categoryID));
		},
		requestFinish: () => {
      dispatch(requestFinish());
    },
    requestStart: () => {
      dispatch(requestStart());
    },
	};
};

interface PageAdminCategoriesProps {
	category: Category;
	requesting: boolean;
	openModal: (event: any, category: Category) => void;
	deleteCategory: (categoryID: number) => void;
	requestFinish: () => void;
  requestStart: () => void;
}

const PageAdminCategoriesComponent: React.FC<PageAdminCategoriesProps> = (props) => {
	const handleDelete = async (event: any) => {
		event.preventDefault();
		props.requestStart();
		const result = await Axios.post('/api/categories/delete', {
			categoryID: props.category.id!,
		});
		if (result.status) {
			props.deleteCategory(props.category.id!);
			props.requestFinish();
		}
	};

	const getCriteriaRows = () => {
		if (props.category.criteria) {
			return Object.values(props.category.criteria).map((criteria: Criteria) => {
				return (
					<ListGroupItem key={criteria.id}>
						<h6>{criteria.name}</h6>
						<p style={{
							whiteSpace: 'pre-wrap',
						}}>Scored: {criteria.minScore} - {criteria.maxScore}<br />
						{criteria.rubric}</p>
					</ListGroupItem>
				);
			});
		}
	};

	return (
		<Card style={{
      width: '44rem',
      margin: '12px',
    }}>
      <Card.Body>
				<Card.Title>
					{props.category.name}
					<span style={{ margin: '0 5px'}}>{props.category.isDefault ? <Badge variant="primary">Default</Badge>: <></>}{props.category.generated ? <Badge variant="secondary">Generated</Badge> : <></>}</span>
					<span>{props.category.isHidden ? <Badge variant="primary">Hidden</Badge>: <></>}</span>
					<br /><h6>{props.category.company}</h6>
				</Card.Title>
				<Card.Text style={{
					whiteSpace: 'pre-wrap',
				}}>
					{props.category.description}
				</Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        {getCriteriaRows()}
      </ListGroup>
      <Card.Body>
				<ButtonGroup>
          <Button
            disabled={props.requesting}
            onClick={(event: any) => props.openModal(event, props.category)}
            size='sm'
            variant='primary'>
            Edit
          </Button>
					<Button
						disabled={props.requesting}
						onClick={handleDelete}
						size='sm'
						variant='outline-danger'>
						Delete
					</Button>
        </ButtonGroup>
      </Card.Body>
    </Card>
	);
};

const PageAdminCategories = connect(mapStateToProps, mapDispatchToProps)(PageAdminCategoriesComponent);

export default PageAdminCategories;
