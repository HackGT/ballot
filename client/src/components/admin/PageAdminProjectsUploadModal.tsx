import Axios from 'axios';
import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';

import { fillProjects } from '../../state/Project';
import Project, { ProjectState, TableGroupState, TableGroup } from '../../types/Project';
import Papa from 'papaparse';
import { AppState } from '../../state/Store';
import Category, { CategoryState, NameToCategoryMapping } from '../../types/Category';
import categories, { updateCategory, fillCategories } from '../../state/Category';

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
	};
};

interface PageAdminProjectsUploadModalProps {
  categories: CategoryState;
  modalOpen: boolean;
  tableGroups: TableGroupState;
  closeModal: () => void;
  updateCategory: (categories: CategoryState) => void;
  fillProjects: (projects: ProjectState) => void;
  fillCategories: (categories: CategoryState) => void;
}

type State = {
  csv: string[][];
  csvHeaderIndicies: {[header: string]: number};
  requesting: boolean;
  totalProjectsToAccountFor: number;
  totalProjectsAccountedFor: number;
  inputNumberExpos: number;
  inputTableGroups: { [tableGroupID: number]: number };
  useSelfAssign: boolean;
}

type Action =
  | { type: 'use-self-assign', enabled: boolean }
  | { type: 'adjust-counts', tableGroups: { [tableGroupID: number]: number }}
  | { type: 'adjust-totals', numberExpos: number }
  | { type: 'update-csv', csv: string[][], csvHeaderIndicies: {[header: string]: number}}
	| { type: 'request-start'}
  | { type: 'request-finish'};

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
          totalProjectsToAccountFor: Math.ceil(action.csv.length / state.inputNumberExpos)
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
    const initialTableGroups: { [tableGroupID: number]: number} = {};
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
    const existingCategoriesArray = Object.values(props.categories).reduce((array: string[], category: Category) => {
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
    const onlyNonGenerated: CategoryState = Object.values(props.categories).reduce((dict: CategoryState, currentCategory: Category) => {
      if (!currentCategory.generated) {
        dict[currentCategory.id!] = currentCategory;
      }
      return dict;
    }, {});
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

    const projectsToSend: Project[] = [];
    let expoNumber = 1;
    let tableNumber = 1;
    // for (const csvRow of state.csv) {
    //   projectsToSend.push({
    //     name: csvRow[state.csvHeaderIndicies['Submission Title']],
    //     devpostURL: csvRow[state.csvHeaderIndicies['Submission Url']],
    //     expoNumber:
    //   })
    // }
  };

  const getFileUploadForm = () => {
    const throwError = (message: string) => {
      dispatch({ type: 'update-csv', csv: [], csvHeaderIndicies: {}});
      console.log(message);
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
      const csvHeaderIndicies: {[header: string]: number} = {};
      for (const header of requiredHeaders) {
        const headerIndex = csvHeaders.indexOf(header);
        if (headerIndex === -1) {
          return throwError('Required headers missing');
        }
        csvHeaderIndicies[header] = headerIndex;
      }
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
                    dispatch({ type: 'adjust-counts', tableGroups: {
                      [tableGroup.id!]: +event.target.value
                    }});
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
    dispatch({ type: 'update-csv', csv: [], csvHeaderIndicies: {}});
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

