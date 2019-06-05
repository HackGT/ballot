import React from 'react';
import Project from '../../types/Project';
import { Button, Icon, Modal, TransitionablePortal, Form, Input, Message } from 'semantic-ui-react';
import axios from 'axios';
import * as papa from 'papaparse';
import projects, { ProjectState } from '../../state/Project';
import InputUpload from '../common/InputUpload';
import TableGroupEditor from './TableGroupEditor';

interface ProjectUploaderProps {
    open: boolean;
    closeModal: () => void;
    fillProjects: (projects: ProjectState) => void;
    appendFillProjects: (projects: ProjectState) => void;
}

interface RowTitles {
    name: number;
    url: number;
    description: number;
    builtWith: number;
    categories: number;
    tableNumber: number;
}

interface AllotedTables {
    [tableString: string]: number;
}

export interface TableGroup {
    groupName: string;
    numberTables: number;
}

interface UploaderInputs {
    error: boolean;
    errorTitle: string;
    errorText: string;
    numberExpos: number;
    tableGroups: TableGroup[];
}

const initialState = {
    csv: [],
    csvKeys: {
        name: -1,
        url: -1,
        description: -1,
        builtWith: -1,
        categories: -1,
        tableNumber: -1,
    },
    inputs: {
        error: false,
        errorTitle: '',
        errorText: '',
        numberExpos: 1,
        tableGroups: [{
            groupName: 'First Group',
            numberTables: 10,
        }],
    },
    projectsAccountedFor: 10,
    projectsPerExpo: 0,
};

const ProjectUploader: React.FC<ProjectUploaderProps> = (props) => {
    const [csv, changeCSV] = React.useState<string[]>(initialState.csv);
    const [csvKeys, changeCSVKeys] = React.useState<RowTitles>(initialState.csvKeys);
    const [inputs, changeInputs] = React.useState<UploaderInputs>(JSON.parse(JSON.stringify(initialState.inputs)));
    const [
        projectsAccountedFor,
        changeProjectsAccountedFor
    ] = React.useState(initialState.projectsAccountedFor);
    const [projectsPerExpo, changeProjectsPerExpo] = React.useState(initialState.projectsPerExpo);

    React.useEffect(() => {
        changeProjectsPerExpo(Math.ceil(csv.length / inputs.numberExpos));
    }, [csv, inputs]);

    const reset = () => {
        changeCSV(initialState.csv);
        changeInputs(JSON.parse(JSON.stringify(initialState.inputs)));
        changeProjectsAccountedFor(initialState.projectsAccountedFor);
    };

    const verifyCSV = (csvInput: string[]): string | boolean => {
        if (csvInput.length <= 2) {
            return 'File is empty.';
        }
        const rowTitles = csvInput[0];
        const keys: RowTitles = {
            name: rowTitles.indexOf('Submission Title'),
            url: rowTitles.indexOf('Submission Url'),
            description: rowTitles.indexOf('Plain Description'),
            builtWith: rowTitles.indexOf('Built With'),
            categories: rowTitles.indexOf('Desired Prizes'),
            tableNumber: rowTitles.indexOf('Table Number'),
        }
        changeCSVKeys(keys);

        if (
            keys.name < 0
            && keys.url < 0
            && keys.description < 0
            && keys.builtWith < 0
            && keys.categories < 0
        ) {
            return 'File is missing one or more of the following columns: Submission Title, Submission URL, Plain Description, Built With, Desired Prizes.';
        }

        const row1 = csvInput[1];

        if (!row1[keys.name] || !row1[keys.url]) {
            return 'First row is missing a name or url';
        }

        return true;
    }

    const onChangeFile = (file: File) => {
        if (file.name.endsWith('.csv')) {
            papa.parse(file, {
                complete: (results) => {
                    const reason = verifyCSV(results.data);
                    if (reason === true) {
                        changeInputs({
                            ...inputs,
                            error: false,
                        });
                    } else {
                        changeInputs({
                            ...inputs,
                            error: true,
                            errorTitle: 'Invalid File',
                            errorText: `This file does not match the Devpost specifications: ${reason}`
                        });
                        return;
                    }
                    results.data.splice(0, 1);
                    changeCSV(results.data);
                },
                skipEmptyLines: true,
            });
        } else {
            changeCSV(initialState.csv);
            changeInputs({
                ...inputs,
                error: true,
                errorTitle: 'Invalid File',
                errorText: 'File is not a CSV file',
            });
        }
    };

    const updateNumberExpos = (numberExpos: number) => {
        // Check if inputted value is greater than 1
        let result = numberExpos > 0 ? numberExpos : 1;
        // Check if number expos can provide at least 1 project per group per expo.
        if (result > (Math.floor(csv.length / inputs.tableGroups.length))) {
            result = Math.floor(csv.length / inputs.tableGroups.length);
        }
        changeInputs({
            ...inputs,
            numberExpos: result,
        });
    };

    const handleNumberExpos = (event: any) => {
        const value = +event.target.value;
        updateNumberExpos(value);
    };

    const handleAddTableGroup = () => {
        const tableGroups = inputs.tableGroups;
        tableGroups.push({
            groupName: 'New Table Group',
            numberTables: 10,
        });
        changeInputs({
            ...inputs,
            tableGroups,
        });
        updateNumberExpos(inputs.numberExpos);
        countTables();
    };

    const handleDeleteTableGroup = (index: number) => {
        const tableGroups = inputs.tableGroups;
        tableGroups.splice(index, 1);
        changeInputs({
            ...inputs,
            tableGroups,
        });
        updateNumberExpos(inputs.numberExpos);
        countTables();
    };

    const handleUpdateTableGroup = (tableGroup: TableGroup, index: number) => {
        const newTableGroups = inputs.tableGroups;
        newTableGroups[index] = tableGroup
        changeInputs({
            ...inputs,
            tableGroups: newTableGroups,
        });
        updateNumberExpos(inputs.numberExpos);
        countTables();
    };

    const handleSubmit = () => {
        if (csv.length > 0 && projectsAccountedFor === projectsPerExpo) {
            const toUpload: {
                name: string;
                devpostURL: string;
                expoNumber: number;
                tableGroup: string;
                tableNumber: number;
                sponsorPrizes: string;
                tags: string;
            }[] = [];

            let rowNumber = 0;

            // Check whether table numbers were requested
            if (csvKeys.tableNumber > -1) {
                // Table numbers requested
                const allTableGroupNames = new Set();
                for (const tableGroup of inputs.tableGroups) {
                    allTableGroupNames.add(tableGroup.groupName);
                }

                const tablesAlloted: AllotedTables = {};
                for (let expoNumber = 1; expoNumber <= inputs.numberExpos; expoNumber++) {
                    for (const tableGroup of inputs.tableGroups) {
                        for (let tableNumber = 1; tableNumber <= tableGroup.numberTables; tableNumber++) {
                            const row = csv[rowNumber];
                            if (row[csvKeys.tableNumber]) {
                                const assignment = row[csvKeys.tableNumber].split(' ');
                                if (allTableGroupNames.has(assignment[0])) {
                                    toUpload.push({
                                        name: row[csvKeys.name],
                                        devpostURL: row[csvKeys.url],
                                        expoNumber,
                                        tableGroup: assignment[0],
                                        tableNumber: parseInt(assignment[1]),
                                        sponsorPrizes: row[csvKeys.categories],
                                        tags: row[csvKeys.builtWith],
                                    });
                                } else {
                                    throw new Error();
                                }
                            } else {
                                toUpload.push({
                                    name: row[csvKeys.name],
                                    devpostURL: row[csvKeys.url],
                                    expoNumber,
                                    tableGroup: tableGroup.groupName,
                                    tableNumber,
                                    sponsorPrizes: row[csvKeys.categories],
                                    tags: row[csvKeys.builtWith],
                                });
                            }

                            rowNumber++;
                        }
                    }
                }
            } else {
                // No requested table numbers
                for (let expoNumber = 1; expoNumber <= inputs.numberExpos; expoNumber++) {
                    for (const tableGroup of inputs.tableGroups) {
                        for (let tableNumber = 1; tableNumber <= tableGroup.numberTables; tableNumber++) {
                            const row = csv[rowNumber];
                            toUpload.push({
                                name: row[csvKeys.name],
                                devpostURL: row[csvKeys.url],
                                expoNumber,
                                tableGroup: tableGroup.groupName,
                                tableNumber,
                                sponsorPrizes: row[csvKeys.categories],
                                tags: row[csvKeys.builtWith],
                            });

                            rowNumber++;
                        }
                    }
                }
            }

            console.log(toUpload);
        } else {
            // No rows
        }
    };

    const countTables = () => {
        let newProjectsAccountedFor = 0;
        for (const group of inputs.tableGroups) {
            newProjectsAccountedFor = +newProjectsAccountedFor + +group.numberTables;
        }
        changeProjectsAccountedFor(newProjectsAccountedFor);
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
                <Modal
                    size='tiny'
                    open={true}
                    closeIcon
                    closeOnDimmerClick={false}
                    onClose={() => {
                        document.body.classList.remove('modal-fade-in');
                        setTimeout(() => {
                            reset();
                        }, 500);
                        props.closeModal();
                    }
                }>
                    <Modal.Header>Upload Projects CSV</Modal.Header>
                    <Modal.Content>
                        <Message
                            error
                            hidden={!inputs.error}
                            header={inputs.errorTitle}
                            content={inputs.errorText}
                        />
                        <InputUpload
                            id='uploadProjects'
                            placeholder='Click to upload...'
                            onFileChange={onChangeFile} />

                        {csv.length > 0
                            ? <>
                                <Input
                                    value={inputs.numberExpos}
                                    style={{
                                        width: 60,
                                    }}
                                    type='number'
                                    onChange={handleNumberExpos}
                                    label='Number of Expos'
                                    labelPosition='left' />
                                <h3 style={{
                                    margin: '20px 0 5px'
                                }}>
                                    Table Group
                                    <span style={{
                                        float: 'right',
                                        marginRight: 55,
                                    }}>
                                        # Tables
                                    </span>
                                </h3>
                                {inputs.tableGroups.map((tableGroup, index) => {
                                    return (
                                        <TableGroupEditor
                                            key={index}
                                            index={index}
                                            deleteTableGroup={handleDeleteTableGroup}
                                            tableGroup={tableGroup}
                                            updateTableGroup={handleUpdateTableGroup} />
                                    );
                                })}
                                <span style={{
                                    float: 'right',
                                    paddingRight: 5,
                                }}>{projectsAccountedFor} / {projectsPerExpo}</span>
                                <div>
                                    <Form.Button
                                        color='blue'
                                        basic
                                        size='tiny'

                                        onClick={handleAddTableGroup}>
                                        Add Table Group
                                    </Form.Button>
                                </div>
                            </> : null
                        }
                    </Modal.Content>
                    {csv.length > 0
                        ? <Modal.Actions>
                            <Button color='green' onClick={handleSubmit}>
                                <Icon name='checkmark' /> Upload Projects
                                </Button>
                        </Modal.Actions>
                        : null
                    }
                </Modal>
            </TransitionablePortal>
        </>
    )
}

export default ProjectUploader;
