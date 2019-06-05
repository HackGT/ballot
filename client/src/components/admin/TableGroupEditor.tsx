import React from 'react';
import { TableGroup } from './ProjectUploader';
import { Form, Icon } from 'semantic-ui-react';

interface TableGroupEditorProps {
    index: number;
    tableGroup: TableGroup;
    updateTableGroup: (tableGroup: TableGroup, index: number) => void;
    deleteTableGroup: (index: number) => void;
}

const TableGroupEditor: React.FC<TableGroupEditorProps> = (props) => {
    const handleChange = (event: any) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        props.updateTableGroup({
            ...props.tableGroup,
            [name]: value,
        }, props.index);
    };

    return (
        <Form>
            <Form.Group>
                <Form.Input
                    name='groupName'
                    onChange={handleChange}
                    value={props.tableGroup.groupName}
                    width={12} />
                <Form.Input
                    name='numberTables'
                    type='number'
                    onChange={handleChange}
                    value={props.tableGroup.numberTables}
                    width={4} />
                <Form.Button
                    circular
                    basic
                    onClick={() => {
                        props.deleteTableGroup(props.index);
                    }}
                    icon='close'
                    color='red' />
            </Form.Group>
        </Form>
    );
}

export default TableGroupEditor;
