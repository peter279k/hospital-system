import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import { LinkContainer } from 'react-router-bootstrap';

import HomeTemplate from './templates/HomeTemplate.js';
import AddPatientTemplate from './templates/AddPatientTemplate.js';
import ModifyPatientTemplate from './templates/ModifyPatientTemplate.js';
import QueryPatientTemplate from './templates/QueryPatientTemplate.js';
import DeletePatientTemplate from './templates/DeletePatientTemplate.js';
import QueryOrgTemplate from './templates/QueryOrgTemplate.js';
import AddOrgTemplate from './templates/AddOrgTemplate.js';
import AddImmunizationTemplate from './templates/AddImmunizationTemplate.js';
import QueryImmunizationTemplate from './templates/QueryImmunizationTemplate.js';
import AddObservationTemplate from './templates/AddObservationTemplate.js';
import QueryObservationTemplate from './templates/QueryObservationTemplate.js';
import FHIRServerSettingTemplate from './templates/FHIRServerSettingTemplate.js';

import DropDownPatientTemplate from './templates/DropDown/DropDownPatientTemplate.js';
import DropDownOrgTemplate from './templates/DropDown/DropDownOrgTemplate.js';
import DropDownImmunizationObservationTemplate from './templates/DropDown/DropDownImmunizationObservationTemplate.js';
import FHIRServerButtonTemplate from './templates/FHIRServerButtonTemplate';

import './App.css';


const App = () => {

  return (
  <MemoryRouter>
    <Container className="p-3">
      <Jumbotron>
        <h1 className="header">歡迎來到醫院院內管理系統</h1>
          <ButtonToolbar className="custom-btn-toolbar">
            <LinkContainer to="/">
              <Button>首頁</Button>
            </LinkContainer>
            <DropDownPatientTemplate />
            <DropDownOrgTemplate />
            <DropDownImmunizationObservationTemplate />
            <DropDownImmunizationObservationTemplate />
            <FHIRServerButtonTemplate />
          </ButtonToolbar>
      </Jumbotron>
    </Container>
    <Container className="p-3">
        <AddPatientTemplate />
        <QueryPatientTemplate />
        <ModifyPatientTemplate />
        <DeletePatientTemplate />
        <QueryOrgTemplate />
        <AddOrgTemplate />
        <AddImmunizationTemplate />
        <QueryImmunizationTemplate />
        <AddObservationTemplate />
        <QueryObservationTemplate />
        <FHIRServerSettingTemplate />
        <HomeTemplate />
    </Container>
  </MemoryRouter>
  );
};

export default App;
