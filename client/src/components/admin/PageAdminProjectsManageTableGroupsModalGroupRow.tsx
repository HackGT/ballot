import Axios from 'axios';
import React from 'react';
import { Button, Form, Modal, Col } from 'react-bootstrap';
import { connect } from 'react-redux';

import { fillProjects } from '../../state/Project';
import { ProjectState, TableGroup } from '../../types/Project';

interface PageAdminProjectsManageTableGroupsModalGroupRowProps {
  tableGroup: TableGroup;
  requesting: boolean;
  updateTableGroup: (tableGroup: TableGroup) => void;
  deleteTableGroup: (tableGroupID: number) => void;
}

const PageAdminProjectsManageTableGroupsModalGroupRow: React.FC<PageAdminProjectsManageTableGroupsModalGroupRowProps> = (props) => {
  const handleChange = (event: any) => {
    const target = event.target;
    props.updateTableGroup({
      ...props.tableGroup,
      [target.name]: target.value,
    });
  };

	return (
		<div style={{ marginBottom: 12 }}>
      <hr />
      <Form.Row>
        <Form.Group as={Col} md="7">
          <Form.Label>Table Group Name</Form.Label>
          <Form.Control
            disabled={props.requesting}
            name='name'
            onChange={handleChange}
            value={props.tableGroup.name}
            placeholder='Name' />
        </Form.Group>
        <Form.Group as={Col} md="2">
          <Form.Label>Shortcode</Form.Label>
          <Form.Control
            disabled={props.requesting}
            name='shortcode'
            onChange={handleChange}
            value={props.tableGroup.shortcode}
            placeholder='Code' />
        </Form.Group>
        <Form.Group as={Col} md="3">
          <Form.Label>Color</Form.Label>
          <Form.Control
            disabled={props.requesting}
            name='color'
            onChange={handleChange}
            placeholder='#000000'
            style={{
              backgroundColor: props.tableGroup.color,
            }}
            value={props.tableGroup.color} />
        </Form.Group>
      </Form.Row>
      <Button
        disabled={props.requesting}
        size='sm'
        variant='outline-danger'
        onClick={() => props.deleteTableGroup(props.tableGroup.id!)}>
        Delete
      </Button>
    </div>
	);
};

export default PageAdminProjectsManageTableGroupsModalGroupRow;

