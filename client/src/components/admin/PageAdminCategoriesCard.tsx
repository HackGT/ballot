import Axios from 'axios';
import React from 'react';
import { Card, ListGroup, ListGroupItem, ButtonGroup, Button, Badge } from 'react-bootstrap';
import { connect } from 'react-redux';

import { deleteCategory } from '../../state/Category';
import Category, { Criteria } from '../../types/Category';

const mapDispatchToProps = (dispatch: any) => {
	return {
		deleteCategory: (categoryID: number) => {
			dispatch(deleteCategory(categoryID));
		},
	};
};

interface PageAdminCategoriesProps {
	category: Category;
	openModal: (event: any, category: Category) => void;
	deleteCategory: (categoryID: number) => void;
}

type State = {
	requesting: boolean;
}

type Action =
	| { type: 'request-start'}
	| { type: 'request-finish'};

const PageAdminCategoriesComponent: React.FC<PageAdminCategoriesProps> = (props) => {
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

	const handleDelete = async (event: any) => {
		event.preventDefault();
		dispatch({ type: 'request-start' });
		const result = await Axios.post('/api/categories/delete', {
			categoryID: props.category.id!,
		});
		if (result.status) {
			props.deleteCategory(props.category.id!);
		}
	};

	const getCriteriaRows = () => {
		if (props.category.criteria) {
			return Object.values(props.category.criteria).map((criteria: Criteria) => {
				return (
					<ListGroupItem key={criteria.id}>
						<h6>{criteria.name}</h6>
						<p>Scored: {criteria.minScore} - {criteria.maxScore}<br />
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
				</Card.Title>
				<Card.Text>
					{props.category.description}
				</Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        {getCriteriaRows()}
      </ListGroup>
      <Card.Body>
				<ButtonGroup>
          <Button
            disabled={state.requesting}
            onClick={(event: any) => props.openModal(event, props.category)}
            size='sm'
            variant='primary'>
            Edit
          </Button>
					<Button
						disabled={state.requesting}
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

const PageAdminCategories = connect(null, mapDispatchToProps)(PageAdminCategoriesComponent);

export default PageAdminCategories;
