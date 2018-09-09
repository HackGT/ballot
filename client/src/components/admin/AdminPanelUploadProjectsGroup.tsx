import * as React from 'react';
import { Button, EditableText, H4, NumericInput } from '@blueprintjs/core';

export interface AdminPanelUploadProjectsGroupProps {
    name: string;
    index: number;
    numberProjects: number;
    deleteRow: (index: number) => void;
    updateNumberProjects: (index: number, value: number) => void;
    updateName: (index: number, value: string) => void;
}

const AdminPanelUploadProjectsGroup: React.SFC<AdminPanelUploadProjectsGroupProps> = (props) => {
    const handleDelete = () => {
        props.deleteRow(props.index);
    }

    const handleUpdateName = (value: string) => {
        props.updateName(props.index, value);
    }

    const handleUpdateNumberProjects = (value: number) => {
        props.updateNumberProjects(props.index, value);
    }

    return (
        <div>
            <H4>
                <EditableText
                    placeholder='Project Group Name'
                    defaultValue={props.name}
                    onConfirm={handleUpdateName}
                />
                <span style={{ float: 'right' }}>
                    <div style={{
                        display: 'flex',
                    }}>
                    <NumericInput
                        style={{
                            width: 50
                        }}
                        value={props.numberProjects}
                        onValueChange={handleUpdateNumberProjects}
                    />
                    <Button
                        name='delete'
                        icon='small-cross'
                        small={true}
                        intent='danger'
                        onClick={handleDelete}
                        minimal={true} />
                    </div>
                </span>
            </H4>


        </div>
    );
}

export default AdminPanelUploadProjectsGroup;
