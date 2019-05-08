import { AppState } from '../../state/Store';
import Category, { Criteria } from '../../types/Category';
import { updateCategory, deleteCategory, fillCategories, updateCriteria, deleteCriteria, CategoryState } from '../../state/Category';
import PageAdminCategories from './PageAdminCategories';
import { connect } from 'react-redux';

const mapStateToProps = (state: AppState) => {
    return {
        categories: state.categories,
    };
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        updateCategory: (category: Category) => {
            dispatch(updateCategory(category));
        },
        deleteCategory: (categoryID: number) => {
            dispatch(deleteCategory(categoryID));
        },
        fillCategories: (categories: CategoryState) => {
            dispatch(fillCategories(categories));
        },
        updateCriteria: (criteria: Criteria, categoryID: number) => {
            dispatch(updateCriteria(criteria, categoryID));
        },
        deleteCriteria: (criteriaID: number, categoryID: number) => {
            dispatch(deleteCriteria(criteriaID, categoryID));
        },
    };
}

const PageAdminCategoriesContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(PageAdminCategories);

export default PageAdminCategoriesContainer;
