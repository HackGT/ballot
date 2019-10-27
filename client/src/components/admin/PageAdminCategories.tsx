import Axios from 'axios';
import React from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';

import { AppState } from '../../state/Store';
import Category, { CategoryState, EMPTY_CATEGORY, CategoryCriteriaState } from '../../types/Category';
import { fillCategories } from '../../state/Category';

import PageAdminCategoriesModal from './PageAdminCategoriesModal';
import PageAdminCategoriesCard from './PageAdminCategoriesCard';

const mapStateToProps = (state: AppState) => {
	return {
		categories: state.categories,
	};
};

const mapDispatchToProps = (dispatch: any) => {
	return {
		fillCategories: (categories: CategoryState) => {
			dispatch(fillCategories(categories));
		},
	};
};

interface PageAdminCategoriesProps {
	categories: CategoryCriteriaState;
	fillCategories: (categories: CategoryState) => void;
}

type State = {
	modalCategory: Category;
	modalOpen: boolean;
	requesting: boolean;
}

type Action =
	| { type: 'modal-open', modalCategory: Category }
	| { type: 'modal-close' }
	| { type: 'request-start'}
	| { type: 'request-finish'};

const PageAdminCategoriesComponent: React.FC<PageAdminCategoriesProps> = (props) => {
	const [state, dispatch] = React.useReducer((state: State, action: Action) => {
		switch (action.type) {
			case 'modal-open':
        return { ...state, modalOpen: true, modalCategory: action.modalCategory };
      case 'modal-close':
        return { ...state, modalOpen: false };
			case 'request-start':
				return { ...state, requesting: true };
			case 'request-finish':
				return { ...state, requesting: false };
			default:
				return state;
		}
	}, {
		modalCategory: EMPTY_CATEGORY,
		modalOpen: false,
		requesting: false,
	}, undefined);

	React.useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		dispatch({ type: 'request-start' });
		const result = await Axios.get('/api/categories/allCategoriesCriteria');

		if (result.status) {
			const payload: CategoryState = result.data;
			props.fillCategories(payload);
			dispatch({ type: 'request-finish' });
		} else {
			// TODO error checking
		}
	};

	const getCategoryCards = () => {
		const openModal = (event: any, modalCategory: Category) => {
			event.preventDefault();
			dispatch({ type: 'modal-open', modalCategory });
		};

		const createdCategories:any[] = [];
		const generatedCategories:any[] = [];

		for (const category of Object.values(props.categories.categories)) {
			if (category.generated) {
				generatedCategories.push(
					<PageAdminCategoriesCard
						key={category.id}
						category={category}
						openModal={openModal} />
				);
			} else {
				createdCategories.push(
					<PageAdminCategoriesCard
						key={category.id}
						category={category}
						openModal={openModal} />
				)
			}
		}
		return (
			<>
				{createdCategories}
				{generatedCategories}
			</>
		)
	};

	return (
		<div style={{ margin: '12px' }}>
			<h1 style={{ textAlign: 'center' }}>Categories</h1>
			<div style={{
				display: 'flex',
				justifyContent: 'center'
			}}>
				<Button size='sm' onClick={() => dispatch({ type: 'modal-open', modalCategory: EMPTY_CATEGORY })}>New Category</Button>
			</div>
			<div style={{
				display: 'flex',
				justifyContent: 'center',
				flexWrap: 'wrap',
				maxWidth: 1000,
				margin: '12px auto 0',
			}}>
				{getCategoryCards()}
				<PageAdminCategoriesModal
					modalOpen={state.modalOpen}
					category={state.modalCategory}
					closeModal={() => dispatch({ type: 'modal-close' })} />
			</div>
		</div>
	);
};

const PageAdminCategories = connect(
	mapStateToProps,
	mapDispatchToProps
)(PageAdminCategoriesComponent);

export default PageAdminCategories;
