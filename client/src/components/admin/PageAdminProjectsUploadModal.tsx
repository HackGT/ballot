import Axios from 'axios';
import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';

import { fillProjects } from '../../state/Project';
import Project, { ProjectState, TableGroupState, TableGroup } from '../../types/Project';
import Papa from 'papaparse';
import { AppState } from '../../state/Store';
import Category, { CategoryState, NameToCategoryMapping, CategoryCriteriaState } from '../../types/Category';
import { updateCategory, fillCategories } from '../../state/Category';
import { clearBallots } from '../../state/Ballot';
import { string } from 'prop-types';

const requiredHeaders = [
  'Submission Title',
  'Submission Url',
  'Plain Description',
  'Built With',
  'Desired Prizes',
];

const mapStateToProps = (state: AppState) => {
  return {
    tableGroups: state.tableGroups,
    categories: state.categories,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    fillCategories: (categories: CategoryState) => {
      dispatch(fillCategories(categories));
    },
    updateCategory: (categories: CategoryState) => {
      dispatch(updateCategory(categories));
    },
    fillProjects: (projects: ProjectState) => {
      dispatch(fillProjects(projects));
    },
    clearBallots: () => {
      dispatch(clearBallots());
    },
  };
};

interface PageAdminProjectsUploadModalProps {
  categories: CategoryCriteriaState;
  modalOpen: boolean;
  tableGroups: TableGroupState;
  closeModal: () => void;
  clearBallots: () => void;
  updateCategory: (categories: CategoryState) => void;
  fillProjects: (projects: ProjectState) => void;
  fillCategories: (categories: CategoryState) => void;
}

type State = {
  csv: string[][];
  csvHeaderIndicies: { [header: string]: number };
  requesting: boolean;
  totalProjectsToAccountFor: number;
  totalProjectsAccountedFor: number;
  inputNumberExpos: number;
  inputTableGroups: { [tableGroupID: number]: number };
  useSelfAssign: boolean;
}

type Action =
  | { type: 'use-self-assign', enabled: boolean }
  | { type: 'adjust-totals', numberExpos: number }
  | { type: 'adjust-counts', tableGroups: { [tableGroupID: number]: number } }
  | { type: 'update-csv', csv: string[][], csvHeaderIndicies: { [header: string]: number } }
  | { type: 'request-start' }
  | { type: 'request-finish' };

const PageAdminProjectsUploadModalComponent: React.FC<PageAdminProjectsUploadModalProps> = (props) => {
  const initialState = {
    csv: [],
    csvHeaderIndicies: {},
    totalProjectsToAccountFor: -1,
    totalProjectsAccountedFor: 0,
    inputNumberExpos: 1,
    inputTableGroups: {},
    requesting: false,
    useSelfAssign: false,
  }

  const [state, dispatch] = React.useReducer((state: State, action: Action) => {
    switch (action.type) {
      case 'use-self-assign':
        return {
          ...state,
          useSelfAssign: action.enabled,
        };
      case 'adjust-totals':
        return {
          ...state,
          inputNumberExpos: action.numberExpos > 0 ? action.numberExpos : 1,
          totalProjectsToAccountFor: Math.ceil(state.csv.length / action.numberExpos)
        };
      case 'adjust-counts':
        const inputTableGroups = {
          ...state.inputTableGroups,
          ...action.tableGroups,
        };
        return {
          ...state,
          inputTableGroups,
          totalProjectsAccountedFor: Object.values(inputTableGroups).reduce((counter, curVal) => counter + curVal, 0),
        };
      case 'update-csv':
        return {
          ...state,
          csv: action.csv,
          csvHeaderIndicies: action.csvHeaderIndicies,
          totalProjectsToAccountFor: action.csv.length
        };
      case 'request-start':
        return { ...state, requesting: true };
      case 'request-finish':
        return { ...state, requesting: false };
      default:
        return state;
    }
  }, initialState, undefined);

  const effectInputTableGroups = props.tableGroups;

  React.useEffect(() => {
    const initialTableGroups: { [tableGroupID: number]: number } = {};
    for (const tableGroup of Object.values(props.tableGroups)) {
      initialTableGroups[tableGroup.id!] = 10;
    }
    dispatch({ type: 'adjust-counts', tableGroups: initialTableGroups });
  }, [effectInputTableGroups]);

  React.useEffect(() => {
    const initialFetch = async () => {
      // Fetch categories into state, just in case.
      const fetchCategoriesResult = await Axios.get('/api/categories/allCategoriesCriteria');
      if (fetchCategoriesResult.status) {
        const payload: CategoryState = fetchCategoriesResult.data;
        props.fillCategories(payload);
      } else {
        // TODO error checking
      }
    };

    initialFetch();
  }, []);

  const handleUpload = async () => {
    dispatch({ type: 'request-start' });

    props.fillProjects({});

    // Generate a set of all categories for optional prizes.
    const generatedCategories = new Set<string>();
    for (const row of state.csv) {
      const categoriesString = row[state.csvHeaderIndicies['Desired Prizes']];
      if (categoriesString.length > 0) {
        const splitCategories = categoriesString.split(',');
        for (const category of splitCategories) {
          generatedCategories.add(category.trim());
        }
      }
    }

    // Check if the any of the generated categories is a preexisting nongenerated category.
    const existingCategoriesArray = Object.values(props.categories.categories).reduce((array: string[], category: Category) => {
      if (!category.generated) {
        array.push(category.name);
      }
      return array;
    }, []);
    for (const generatedCategory of Array.from(generatedCategories)) {
      for (const existingCategory of existingCategoriesArray) {
        if (existingCategory === generatedCategory) {
          generatedCategories.delete(generatedCategory);
        }
      }
    }

    // Delete all generated categories.
    const deleteGeneratedCategoriesResult = await Axios.delete('/api/categories/deleteGenerated');
    if (!deleteGeneratedCategoriesResult) {
      return;
      // TODO throw error couldn't reset generated categories.
    }

    // Create new generated categories.
    const categoriesToSend: Category[] = Array.from(generatedCategories).map((categoryName) => {
      return {
        name: categoryName,
        isDefault: false,
        generated: true,
        description: `Sponsor prize generated when projects were uploaded. Do not remove. - ${categoryName}`,
        company: '',
        criteria: [],
      };
    });
    const addGeneratedCategoriesResult = await Axios.post('/api/categories/update', {
      categories: categoriesToSend,
    });
    if (!addGeneratedCategoriesResult.status) {
      return;
      // TODO throw error couldn't generate new categories.
    }
    const payload: CategoryState = addGeneratedCategoriesResult.data;
    const onlyNonGenerated: CategoryState = Object.values(props.categories.categories).reduce((dict: CategoryState, currentCategory: Category) => {
      if (!currentCategory.generated) {
        dict[currentCategory.id!] = currentCategory;
      }
      return dict;
    }, {});
    console.log('nongenerated', onlyNonGenerated, payload);
    const newCategories = {
      ...onlyNonGenerated,
      ...payload,
    };
    props.fillCategories({
      ...onlyNonGenerated,
      ...payload,
    });

    // Create category name to category mapping
    const nameToCategoryMapping: NameToCategoryMapping = Object.values(newCategories).reduce((dict: NameToCategoryMapping, currentCategory: Category) => {
      dict[currentCategory.name] = currentCategory;
      return dict;
    }, {});
    const defaultCategoryIDs: number[] = Object.values(newCategories).reduce((array: number[], category: Category) => {
      if (category.isDefault) {
        array.push(category.id!);
      }
      return array;
    }, []);

    const projectsToSend: Project[] = [];
    const tableGroups: TableGroup[] = Object.values(props.tableGroups);
    const tableGroupNameMapping = tableGroups.map((tableGroup) => tableGroup.name);
    const allocatedTables: { [table: string]: number } = {};

    if (state.useSelfAssign) {
      for (let i = 0; i < state.csv.length; i++) {
        const csvRow = state.csv[i];
        const tableNumber = csvRow[state.csvHeaderIndicies['Table Number']];
        if (tableNumber) {
          const tableParts = tableNumber.split(' ');
          if (tableParts.length !== 3) {
            throw new Error('Need 3 parts: expo, group, number');
          }

          if (allocatedTables[tableNumber]) {
            throw new Error('Duplicate table');
          }

          if (!tableGroupNameMapping.includes(tableParts[1])) {
            throw new Error('Invalid table group name');
          }

          allocatedTables[tableNumber] = i;
        }
      }
    }

    const allocatedRows = Object.values(allocatedTables);
    let csvRowNumber = 0;

    // Pass 2 allocate rest.
    for (let expoNumber = 1; expoNumber <= state.inputNumberExpos; expoNumber++) {
      for (const tableGroup of tableGroups) {
        for (let tableNumber = 1; tableNumber <= state.inputTableGroups[tableGroup.id!]; tableNumber++) {
          const finalTableGroupName = `${expoNumber} ${tableGroup.name} ${tableNumber}`;
          if (allocatedTables[finalTableGroupName] === undefined) {
            while (allocatedRows.includes(csvRowNumber)) {
              csvRowNumber++;
            }

            let csvRow = state.csv[csvRowNumber];
            // console.log(csvRow);
            if (csvRow) {
              allocatedTables[finalTableGroupName] = csvRowNumber;
              allocatedRows.push(csvRowNumber);
              csvRowNumber++;
            }
          } else {
            console.log('thegame', finalTableGroupName);
          }
        }
      }
    }

    console.log(allocatedTables, allocatedRows.sort((a: number, b: number) => a - b));
    const tableGroupNameToObject: { [name: string]: TableGroup } = Object.values(props.tableGroups).reduce((dict, tableGroup: TableGroup) => {
      dict[tableGroup.name] = tableGroup;
      return dict;
    }, {});

    for (const tableKey of Object.keys(allocatedTables)) {
      const csvRow = state.csv[allocatedTables[tableKey]];
      const parts = tableKey.split(' ');
      const devpostDesiredCategories: number[] = csvRow[state.csvHeaderIndicies['Desired Prizes']].split(',').reduce((array: number[], categoryName: string) => {
        categoryName = categoryName.trim();
        if (categoryName) {
          array.push(nameToCategoryMapping[categoryName.trim()].id!);
        }
        return array;
      }, []);
      projectsToSend.push({
        name: csvRow[state.csvHeaderIndicies['Submission Title']],
        devpostURL: csvRow[state.csvHeaderIndicies['Submission Url']],
        expoNumber: parseInt(parts[0]),
        roundNumber: 1,
        tableGroupID: tableGroupNameToObject[parts[1]].id!,
        tableNumber: parseInt(parts[2]),
        categoryIDs: devpostDesiredCategories.concat(defaultCategoryIDs),
        tags: [],
      });
    }

    console.log(projectsToSend);

    const batchUploadResult = await Axios.post('/api/projects/upload', {
      projects: projectsToSend,
    });
    if (batchUploadResult.status) {
      const data = batchUploadResult.data;
      // console.log(data);
      props.fillProjects(data);
      props.clearBallots();
      props.closeModal();
      dispatch({ type: 'request-finish' });
    }
  };

  const getFileUploadForm = () => {
    const throwError = (message: string) => {
      dispatch({ type: 'update-csv', csv: [], csvHeaderIndicies: {} });
      // console.log(message);
      // TODO throw real error.
      return;
    };

    const parseResult = (result: Papa.ParseResult) => {
      const csvData: string[][] = result.data;
      if (csvData.length < 1) {
        return throwError('Empty');
      }
      if (csvData.length === 1) {
        return throwError('No content');
      }
      const csvHeaders = csvData[0];
      const csvHeaderIndicies: { [header: string]: number } = {};
      for (const header of requiredHeaders) {
        const headerIndex = csvHeaders.indexOf(header);
        if (headerIndex === -1) {
          return throwError('Required headers missing');
        }
        csvHeaderIndicies[header] = headerIndex;
      }
      csvHeaderIndicies['Table Number'] = csvHeaders.indexOf('Table Number');
      csvData.splice(0, 1)
      dispatch({ type: 'update-csv', csv: csvData, csvHeaderIndicies });
    };

    const handleFileUpload = (event: any) => {
      const target = event.target;
      const fileList: FileList = target.files;
      if (fileList.length !== 1) {
        return throwError('No file or too many files.');
      }
      const file = fileList[0];
      if (!file.name.endsWith('.csv')) {
        return throwError('Not CSV');
      }
      Papa.parse(file, {
        complete: parseResult,
        skipEmptyLines: true,
      });
    };

    return (
      <Form.Group>
        <Form.Label>Devpost CSV</Form.Label>
        <Form.Control
          disabled={state.requesting}
          onChange={handleFileUpload}
          type='file' />
        <Form.Text className="text-muted">
          Please download the CSV containing all projects from Devpost and upload it here.
        </Form.Text>
      </Form.Group>
    );
  };

  const getPropertiesForm = () => {
    if (state.csv.length > 0) {
      return (
        <div>
          <Form.Group>
            <Form.Label>Number of Expos</Form.Label>
            <Form.Control
              disabled={state.requesting}
              name='numberExpos'
              onChange={(event: any) => {
                dispatch({ type: 'adjust-totals', numberExpos: event.target.value})
              }}
              type='number'
              value={"" + state.inputNumberExpos} />
            <Form.Text className="text-muted">
              How many expos will there be at this event?
            </Form.Text>
          </Form.Group>
          {Object.values(props.tableGroups).map((tableGroup: TableGroup) => {
            return (
              <Form.Group key={tableGroup.id}>
                <Form.Label># <strong>{tableGroup.name}</strong> Tables</Form.Label>
                <Form.Control
                  disabled={state.requesting}
                  onChange={(event: any) => {
                    dispatch({
                      type: 'adjust-counts', tableGroups: {
                        [tableGroup.id!]: +event.target.value
                      }
                    });
                  }}
                  type='number'
                  value={"" + state.inputTableGroups[tableGroup.id!]} />
                <Form.Text className="text-muted">
                  How many tables are available in the {tableGroup.name} group in each expo?
                  </Form.Text>
              </Form.Group>
            )
          })}
          <p>Projects Accounted For: {state.totalProjectsAccountedFor} / {state.totalProjectsToAccountFor}</p>
          <Form.Group>
            <Form.Check
              disabled={state.requesting}
              onChange={(event: any) => dispatch({
                type: 'use-self-assign',
                enabled: event.target.value === 'on',
              })}
              type="checkbox"
              label="Use Table Self-Assign" />
            <Form.Text className="text-muted">
              Check if you want to use the "Table Number" column in the Devpost submission.
            </Form.Text>
          </Form.Group>
        </div>
      );
    }
  };

  const closeModal = () => {
    dispatch({ type: 'update-csv', csv: [], csvHeaderIndicies: {} });
    props.closeModal();
  }

  return (
    <Modal show={props.modalOpen} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Upload Projects</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {getFileUploadForm()}
          {getPropertiesForm()}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          disabled={state.requesting}
          onClick={closeModal}
          variant="secondary">
          Close & Discard
        </Button>
        <Button
          disabled={state.requesting}
          onClick={handleUpload}
          variant="primary">
          Upload Projects
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const PageAdminProjectsUploadModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(PageAdminProjectsUploadModalComponent);

export default PageAdminProjectsUploadModal;

