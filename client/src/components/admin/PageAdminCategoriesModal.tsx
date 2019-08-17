import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';

import Category, { Criteria, createEmptyCriteria, CategoryState } from '../../types/Category';
import { updateCategory } from '../../state/Category';
import PageAdminCategoriesModalCriteria from './PageAdminCategoriesModalCriteria';
import Axios from 'axios';

const mapDispatchToProps = (dispatch: any) => {
	return {
		updateCategory: (categories: CategoryState) => {
			dispatch(updateCategory(categories));
		},
	};
};

interface PageAdminCategoriesModalProps {
  modalOpen: boolean;
  category: Category;
  closeModal: () => void;
	updateCategory: (category: CategoryState) => void;
}

type State = {
  category: Category;
  currentNewCategoryID: number;
  requesting: boolean;
}

type Action =
  | { type: 'increase-new-category-id' }
	| { type: 'request-start'}
  | { type: 'request-finish'}
  | { type: 'update-category', category: Category };

const PageAdminCategoriesModalComponent: React.FC<PageAdminCategoriesModalProps> = (props) => {
	const [state, dispatch] = React.useReducer((state: State, action: Action) => {
		switch (action.type) {
      case 'increase-new-category-id':
        return { ...state, currentNewCategoryID: state.currentNewCategoryID - 1}
			case 'request-start':
				return { ...state, requesting: true };
			case 'request-finish':
        return { ...state, requesting: false };
      case 'update-category':
        return { ...state, category: action.category };
			default:
				return state;
		}
	}, {
    requesting: false,
    category: props.category,
    currentNewCategoryID: -2,
  }, undefined);

  const category = props.category;

  React.useEffect(() => {
    dispatch({ type: 'update-category', category: props.category });
  }, [category]);

  const handleSaveChanges = async () => {
    dispatch({ type: 'request-start' });
    const result = await Axios.post('/api/categories/update', {
      categories: [{
        ...state.category,
        criteria: Object.values(state.category.criteria).map((criteria: Criteria) => {
          const { name, rubric, minScore, maxScore } = criteria;
          return { name, rubric, minScore, maxScore };
        }),
      }],
    });
    if (result.status) {
      const data = result.data;
      console.log(data);
      props.updateCategory(data);
      props.closeModal();
      dispatch({ type: 'request-finish' });
    } else {
      // TODO add error checking.
    }
  };

  const getCriteriaRows = () => {
    const updateCriteria = (criteria: Criteria) => {
      dispatch({
        type: 'update-category',
        category: {
          ...state.category,
          criteria: {
            ...state.category.criteria,
            [criteria.id!]: criteria,
          },
        },
      });
    };

    const deleteCriteria = (criteriaID: number) => {
      let {[criteriaID]: omitCategory, ...rest} = state.category.criteria;
      dispatch({
        type: 'update-category',
        category: {
          ...state.category,
          criteria: rest,
        },
      });
    };

    return Object.values(state.category.criteria).map((criteria) => {
      return <PageAdminCategoriesModalCriteria
        key={criteria.id}
        criteria={criteria}
        requesting={state.requesting}
        updateCriteria={updateCriteria}
        deleteCriteria={deleteCriteria} />
    });
  };

  const handleNewCriteria = () => {
    const criteria = state.category.criteria;
    criteria[state.currentNewCategoryID] = createEmptyCriteria(state.currentNewCategoryID);
    dispatch({ type: 'increase-new-category-id' });
    dispatch({
      type: 'update-category',
      category: {
        ...state.category,
        criteria,
      }
    });
  };

  const getForm = () => {
    return (
      <Form>
        <Form.Group>
          <Form.Label>Category Name</Form.Label>
          <Form.Control
            disabled={state.requesting}
            onChange={(event: any) => dispatch({
              type: 'update-category',
              category: {
                ...state.category,
                name: event.target.value,
              },
            })}
            value={state.category.name}
            type='text'
            placeholder='Name' />
          <Form.Text className="text-muted">
            If you are using Ballot for optional prizes, this name needs to match the Devpost output.
          </Form.Text>
        </Form.Group>
        <Form.Group>
          <Form.Check
            disabled={state.requesting}
            onChange={(event: any) => dispatch({
              type: 'update-category',
              category: {
                ...state.category,
                isDefault: event.target.value === 'on',
              }
            })}
            type="checkbox"
            label="Default Category" />
          <Form.Text className="text-muted">
            Check this box if all submissions are eligible for this category.
          </Form.Text>
        </Form.Group>
        <Form.Group>
          <Form.Label>Category Description</Form.Label>
          <Form.Control
            as='textarea'
            disabled={state.requesting}
            name='description'
            onChange={(event: any) => dispatch({
              type: 'update-category',
              category: {
                ...state.category,
                description: event.target.value,
              }
            })}
            value={state.category.description}
            placeholder='Description' />
        </Form.Group>
        {getCriteriaRows()}
        <Button
          disabled={state.requesting}
          variant='outline-primary'
          onClick={handleNewCriteria}>New Criteria</Button>
      </Form>
    );
  };

	return (
		<Modal show={props.modalOpen} onHide={props.closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {getForm()}
      </Modal.Body>
      <Modal.Footer>
        <Button
          disabled={state.requesting}
          onClick={props.closeModal}
          variant="secondary">
          Close
        </Button>
        <Button
          disabled={state.requesting}
          onClick={handleSaveChanges}
          variant="primary">
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
	);
};

const PageAdminCategoriesModal = connect(null, mapDispatchToProps)(PageAdminCategoriesModalComponent);

export default PageAdminCategoriesModal;

