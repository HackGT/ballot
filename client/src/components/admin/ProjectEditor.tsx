import React from 'react';
import Project from '../../types/Project';
import { Button, Icon, Modal, TransitionablePortal, Form } from 'semantic-ui-react';
import axios from 'axios';

interface ProjectEditorProps {
    open: boolean;
    project: Project;
    closeModal: () => void;
    updateProject: (project: Project) => void;
}

const ProjectEditor: React.FC<ProjectEditorProps> = (props) => {
    const [inputs, changeInputs] = React.useState<Project>({
        name: props.project.name,
        devpostURL: props.project.devpostURL,
        expoNumber: props.project.expoNumber,
        tableGroup: props.project.tableGroup,
        tableNumber: props.project.tableNumber,
        sponsorPrizes: props.project.sponsorPrizes,
        tags: props.project.tags,
    });

    React.useEffect(() => {
        changeInputs({
            name: props.project.name,
            devpostURL: props.project.devpostURL,
            expoNumber: props.project.expoNumber,
            tableGroup: props.project.tableGroup,
            tableNumber: props.project.tableNumber,
            sponsorPrizes: props.project.sponsorPrizes,
            tags: props.project.tags,
        });
    }, [props.project]);

    const handleChange = (event: any) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        changeInputs({
            ...inputs,
            [name]: value,
        });
    }

    const handleSave = () => {
        console.log({
            ...props.project,
            ...inputs,
        });

        axios.post('/api/projects', {
            'id': props.project.id,
            'name': inputs.name,
            'devpostURL': inputs.devpostURL,
            'expoNumber': inputs.expoNumber,
            'tableGroup': inputs.tableGroup,
            'tableNumber': inputs.tableNumber,
            'sponsorPrizes': inputs.sponsorPrizes,
            'tags': inputs.tags,
        });

        props.updateProject({ ...props.project, ...inputs});
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
            }}>
                <Modal.Header>{ props.project.id ? 'Edit Project' : 'Add Project' }</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Input name='name' placeholder='Project Name' fluid onChange={handleChange} value={inputs.name} />
                        <Form.Input name='devpostURL' placeholder='https://___.devpost.com/___' fluid onChange={handleChange} value={inputs.devpostURL} />
                        <Form.Group widths='equal'>
                            <Form.Input fluid name='expoNumber' placeholder='Expo #' onChange={handleChange} value={inputs.expoNumber} />
                            <Form.Input fluid name='tableGroup' placeholder='Table Group Name' onChange={handleChange} value={inputs.tableGroup} />
                            <Form.Input fluid name='tableNumber' placeholder='Table #' onChange={handleChange} value={inputs.tableNumber} />
                        </Form.Group>

                    </Form>
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

export default ProjectEditor;
