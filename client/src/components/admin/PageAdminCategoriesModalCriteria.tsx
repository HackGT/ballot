import React from 'react';
import { Form, Col, Button } from 'react-bootstrap';

import { Criteria } from '../../types/Category';

interface PageAdminCategoriesModalCriteriaProps {
  criteria: Criteria;
  requesting: boolean;
  updateCriteria: (criteria: Criteria) => void;
  deleteCriteria: (criteriaID: number) => void;
}

const PageAdminCategoriesModalCriteria: React.FC<PageAdminCategoriesModalCriteriaProps> = (props) => {
  const handleChange = (event: any) => {
    const target = event.target;
    props.updateCriteria({
      ...props.criteria,
      [target.name]: target.value,
    });
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <hr />
      <Form.Group>
        <Form.Label>Criteria Name</Form.Label>
        <Form.Control
          disabled={props.requesting}
          name='name'
          onChange={handleChange}
          value={props.criteria.name}
          placeholder='Name' />
      </Form.Group>
      <Form.Group>
        <Form.Label>Rubric</Form.Label>
        <Form.Control
          as='textarea'
          disabled={props.requesting}
          name='rubric'
          onChange={handleChange}
          value={props.criteria.rubric}
          placeholder='Rubric' />
      </Form.Group>
      <Form.Row>
        <Form.Group as={Col}>
          <Form.Label>Min Score</Form.Label>
          <Form.Control
            disabled={props.requesting}
            name='minScore'
            onChange={handleChange}
            type='number'
            value={"" + props.criteria.minScore} />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Max Score</Form.Label>
          <Form.Control
            disabled={props.requesting}
            name='maxScore'
            onChange={handleChange}
            type='number'
            value={"" + props.criteria.maxScore} />
        </Form.Group>
      </Form.Row>
      <Button
        disabled={props.requesting}
        onClick={() => props.deleteCriteria(props.criteria.id!)}
        size='sm'
        variant='outline-danger'>
        Delete Criteria
      </Button>
    </div>
  );
};

export default PageAdminCategoriesModalCriteria;
