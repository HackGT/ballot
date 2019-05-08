import React from 'react';
import Category, { Criteria } from '../../types/Category';
import { Button, Icon, Modal, TransitionablePortal, Form } from 'semantic-ui-react';
import axios from 'axios';

interface CategoryEditorProps {
    open: boolean;
    category: Category;
    closeModal: () => void;
    updateCategory: (category: Category) => void;
    deleteCategory: (categoryID: number) => void;
}

const CategoryEditor: React.FC<CategoryEditorProps> = (props) => {
    const [inputs, changeInputs] = React.useState<{ name: string, isDefault: boolean }>({
        name: props.category.name,
        isDefault: props.category.isDefault,
    });
    const [criteria, changeCriteria] = React.useState<Criteria[]>(JSON.parse(JSON.stringify(props.category.criteria))); // Deep copy bc array in object is referenced, causing unnecessary state updates.
    const [newCriteriaID, changeNewCriteriaID] = React.useState(-1);

    React.useEffect(() => {
        changeInputs({
            name: props.category.name,
            isDefault: props.category.isDefault,
        });
        changeCriteria(JSON.parse(JSON.stringify(props.category.criteria)));
    }, [props.category]);

    const handleChange = (event: any) => {
        const target = event.target;
        const value = target.value;

        changeInputs({
            ...inputs,
            name: value,
        });
    }

    const deleteCriteria = (index: number) => {
        const newCriteria = criteria;
        newCriteria.splice(index, 1);
        changeCriteria(newCriteria);
    }

    const updateCriteria = (updatedCriteria: Criteria, index: number) => {
        const newCriteria = criteria;
        newCriteria[index] = updatedCriteria;
        console.log('wow');

        changeCriteria(newCriteria);
    }

    const handleSave = () => {
        console.log({
            ...props.category,
            ...inputs,
            criteria,
        });

        axios.post('/api/categories', {
            'id': props.category.id,
            'name': inputs.name,
            'isDefault': inputs.isDefault,
            'criteria': criteria,
        });

        props.updateCategory({ ...props.category, ...inputs, criteria });
        props.closeModal();
    }

    return (
        <>
        {/* Workaround bc semantic-ui does not transition dimmer for modal */}
        <style>{`
          .ui.dimmer {
            transition: background-color 0.3s ease;
            background-color: transparent;
          }

          .modal-fade-in .ui.dimmer {
            background-color: #000000AA;
          }
        `}</style>
        <TransitionablePortal
            open={props.open}
            onOpen={() => setTimeout(() => document.body.classList.add('modal-fade-in'), 0)}
            transition={{ animation: 'scale', duration: 300 }}>
            <Modal size='tiny' open={true} closeIcon onClose={() => {
                document.body.classList.remove('modal-fade-in');
                props.closeModal();

                setTimeout(() => {
                    changeCriteria(props.category.criteria);
                    changeNewCriteriaID(-1);
                }, 500);
            }}>
                <Modal.Header>{ props.category.id ? 'Edit Category' : 'New Category' }</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Input name='name' placeholder='Category Name' fluid onChange={handleChange} value={inputs.name} />
                        <Form.Checkbox checked={inputs.isDefault} label='Default Category' toggle onChange={() => changeInputs({ ...inputs, isDefault: !inputs.isDefault })} />
                    </Form>
                </Modal.Content>
                {criteria.map((c: Criteria, index: number) => {
                    return (
                        <CriteriaEditor key={c.id} criteria={c} delete={() => deleteCriteria(index)} updateCriteria={(cParam) => updateCriteria(cParam, index)} />
                    )
                })}
                <Modal.Content>
                    <Button color='blue' onClick={() => {
                        criteria.push({
                            id: newCriteriaID,
                            name: '',
                            rubric: '',
                            minScore: 0,
                            maxScore: 10,
                        });
                        changeNewCriteriaID(newCriteriaID - 1);
                    }}>
                        <Icon name='add' /> Add Criteria
                    </Button>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='green' onClick={handleSave}>
                        <Icon name='checkmark' /> Save
                    </Button>
                </Modal.Actions>
            </Modal>
        </TransitionablePortal>
        </>
    )
}

interface CriteriaEditorProps {
    criteria: Criteria;
    delete: () => void;
    updateCriteria: (criteria: Criteria) => void;
}

const CriteriaEditor: React.FC<CriteriaEditorProps> = (props) => {
    const [inputs, changeInputs] = React.useState<Criteria>(props.criteria);
    const [deleted, changeDeleted] = React.useState(false); // Workaround for non-disappearing thing bc I'm not smart enough to work it out.

    React.useEffect(() => {
        props.updateCriteria(inputs);
    }, [inputs])

    const handleChange = (event: any) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;

        changeInputs({
            ...inputs,
            [name]: value,
        });
    }

    const handleDelete = () => {
        changeDeleted(true);
        if (props.criteria.id! > -1) {
            axios.delete(`/api/criteria/${props.criteria.id}`);
        }
        props.delete();
    }

    if (deleted) {
        return null;
    }

    return (
        <Modal.Content>
            <Form>
                <Form.Input name='name' placeholder='Criteria Name' label='Criteria Name' value={inputs.name} onChange={handleChange} />
                <Form.TextArea name='rubric' placeholder='Rubric' label='Rubric' value={inputs.rubric} onChange={handleChange} />
                <Form.Group widths='equal'>
                    <Form.Input name='minScore' type='number' label='Min Score' placeholder='Min Score' value={inputs.minScore} onChange={handleChange} />
                    <Form.Input name='maxScore' type='number' label='Max Score' placeholder='Max Score' value={inputs.maxScore} onChange={handleChange} />
                </Form.Group>
            </Form>
            <Button size='mini' compact color='red' basic floated='right' onClick={handleDelete}>Delete Criteria</Button>
        </Modal.Content>
    )
}

export default CategoryEditor;
