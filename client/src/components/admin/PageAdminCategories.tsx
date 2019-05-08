import React from 'react';
import { CategoryState } from '../../state/Category';
import Category, { Criteria } from '../../types/Category';
import CategoryEditor from './CategoryEditor';
import { Accordion, Button, Icon, Popup } from 'semantic-ui-react';
import axios from 'axios';

interface PageAdminCategoriesProps {
    categories: CategoryState;
    updateCategory: (category: Category) => void;
    deleteCategory: (categoryID: number) => void;
    fillCategories: (categories: Category[]) => void;
    updateCriteria: (criteria: Criteria, categoryID: number) => void;
    deleteCriteria: (criteriaID: number, categoryID: number) => void;
}

const PageAdminCategories: React.FC<PageAdminCategoriesProps> = (props) => {
    const fillCategories = props.fillCategories;
    const [activeIndex, changeActiveIndex] = React.useState<number[]>([]);
    const [modalOpen, changeModalOpen] = React.useState(false);
    const [modalCategory, changeModalCategory] = React.useState<Category>({
        name: '',
        isDefault: false,
        criteria: [],
    });

    React.useEffect(() => {
        const fetchCategories = async () => {
            const result = await axios.get('/api/categories');

            fillCategories(result.data);
        };

        fetchCategories();
    }, [fillCategories]);

    const openModal = (category: Category) => {
        changeModalCategory(category);
        changeModalOpen(true);
    }

    const closeModal = () => {
        changeModalOpen(false);
    };

    const handleAccordion = (event: any, titleProps: any) => {
        const { index }: { index: number } = titleProps;

        const location = activeIndex.indexOf(index);

        const newActiveIndex = activeIndex.slice(0);

        if (location > -1) {
            newActiveIndex.splice(location, 1);
        } else {
            newActiveIndex.push(index);
        }

        changeActiveIndex(newActiveIndex);
        console.log(newActiveIndex);
    }

    const handleDeleteCategory = async (categoryID: number) => {
        await axios.delete(`/api/categories/${categoryID}`);

        props.deleteCategory(categoryID);
    }

    return (
        <div>
            <div style={{ paddingBottom: 15 }}>
                <h1 style={{ display: 'inline'}}>Categories</h1>
                <span style={{float: 'right'}}>
                    <Button animated='fade' color='blue' onClick={() => openModal({
                        id: -1,
                        name: '',
                        isDefault: false,
                        criteria: [],
                    })}>
                        <Button.Content visible>New Category</Button.Content>
                        <Button.Content hidden><Icon name='plus' /></Button.Content>
                    </Button>
                </span>
            </div>
            <CategoryEditor open={modalOpen} category={modalCategory} closeModal={closeModal}
                updateCategory={props.updateCategory}
                deleteCategory={props.deleteCategory} />
            { Object.values(props.categories).length > 0
                ? <Accordion fluid styled>
                    { Object.values(props.categories).sort((a: Category, b: Category) => {
                        return a.id! - b.id!;
                    }).map((category: Category) => {
                        return (
                            <div key={category.id}>
                                <Accordion.Title
                                    active={activeIndex.includes(category.id!)}
                                    index={category.id}
                                    onClick={handleAccordion}><h4 style={{ display: 'inline'}}><Icon name='dropdown' />{category.name} {category.isDefault ? '- Primary' : ''}</h4></Accordion.Title>
                                <Accordion.Content active={activeIndex.includes(category.id!)}>
                                    <div style={{
                                        marginLeft: 20,
                                    }}>
                                        {category.criteria.length > 0 ? category.criteria.map((criteria: Criteria) => {
                                            return (
                                                <div key={criteria.id} style={{
                                                    margin: '5px 0 15px 0px',
                                                }}>
                                                    <h3 style={{ margin: 0 }}>{criteria.name}</h3>
                                                    <p style={{ margin: 0 }}>Scored: {criteria.minScore} - {criteria.maxScore}</p>
                                                    <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{criteria.rubric}</p>
                                                </div>)
                                        }) : 'No Criteria Exist'}
                                        <Button compact onClick={() => openModal(category)}>Edit Category</Button>
                                        <Popup trigger={<Button color='red' basic compact>Delete Category</Button>} on='click' position='top center'>
                                            <Button color='red' onClick={() => handleDeleteCategory(category.id!)}>Confirm Delete</Button>
                                        </Popup>
                                    </div>
                                </Accordion.Content>
                            </div>
                        )
                    })}
                </Accordion>
                : <div>No categories currently exist. Create a new category to get started.</div>

            }
        </div>
    )
}

export default PageAdminCategories;
