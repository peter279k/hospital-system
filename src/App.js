import React, { useState } from 'react';
import { MemoryRouter, Switch, Route } from 'react-router-dom';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import { LinkContainer } from 'react-router-bootstrap';

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

import './App.css';


const Home = () => <h2>Version 1.0</h2>;

const App = () => {

  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [labelText, setLabelText] = useState('請輸入病患id');
  const [buttonText, setSearchButtonText] = useState('進階搜尋');
  const [searchText, setSearchText] = useState('基本');
  const [createdDate, setCreatedDateText] = useState('');
  const [visibleText, setVisibleText] = useState('invisible');
  const [searchVisibleText, setSearchVisibleText] = useState('invisible');
  const [startDate, setStartDate] = useState(new Date());
  const [jsonResponse, setJsonResponseText] = useState('');
  const [errorResponse, setErrorResponseText] = useState('');

  const initialRouteState = () => {
    setJsonResponseText('');
    setVisibleText('invisible');
    setForm({});
    setErrors({});
    setLabelText('請輸入病患id(Patient Resource id)');
    if (searchText === '基本') {
      setSearchButtonText('進階搜尋');
      setCreatedDateText('');
    } else {
      setSearchButtonText('基本搜尋');
      setCreatedDateText('請選擇建立資料之日期');
    }
    setVisibleText('invisible');
    setStartDate(new Date());
    setErrorResponseText('回應JSON');
  };

  return (
  <MemoryRouter>
    <Container className="p-3">
      <Jumbotron>
        <h1 className="header">歡迎來到醫院院內管理系統</h1>
          <ButtonToolbar className="custom-btn-toolbar">
            <LinkContainer to="/">
              <Button>首頁</Button>
            </LinkContainer>
            <DropdownButton className="custom-btn-toolbar" title="病患資料管理" variant="info">
                <LinkContainer to="/add_patient">
                  <Dropdown.Item onClick={ initialRouteState } eventKey="1">新增病患資料</Dropdown.Item>
                </LinkContainer>
                <LinkContainer to="/query_patient">
                  <Dropdown.Item onClick={ initialRouteState } eventKey="2">查詢病患資料</Dropdown.Item>
                </LinkContainer>
                <LinkContainer to="/modify_patient">
                  <Dropdown.Item onClick={ initialRouteState } eventKey="3">修改病患資料</Dropdown.Item>
                </LinkContainer>
                <LinkContainer to="/delete_patient">
                  <Dropdown.Item onClick={ initialRouteState } eventKey="4">刪除病患資料</Dropdown.Item>
                </LinkContainer>
            </DropdownButton>
            <DropdownButton className="custom-btn-toolbar" title="醫事單位管理" variant="secondary">
                <LinkContainer to="/add_organization">
                  <Dropdown.Item onClick={ initialRouteState } eventKey="1">新增醫事單位</Dropdown.Item>
                </LinkContainer>
                <LinkContainer to="/query_organization">
                  <Dropdown.Item onClick={ initialRouteState } eventKey="2">查詢醫事單位</Dropdown.Item>
                </LinkContainer>
            </DropdownButton>
            <DropdownButton className="custom-btn-toolbar" title="疫苗曁篩檢資料管理" variant="info">
              <LinkContainer to="/add_immunization">
                <Dropdown.Item onClick={ initialRouteState } eventKey="1">新增疫苗接種資料</Dropdown.Item>
              </LinkContainer>
              <LinkContainer to="/query_immunization">
                <Dropdown.Item onClick={ initialRouteState } eventKey="2">查詢疫苗接種資料</Dropdown.Item>
              </LinkContainer>
              <LinkContainer to="/add_observation">
                <Dropdown.Item onClick={ initialRouteState } eventKey="2">新增篩檢資料</Dropdown.Item>
              </LinkContainer>
              <LinkContainer to="/query_observation">
                <Dropdown.Item onClick={ initialRouteState } eventKey="3">查詢篩檢資料</Dropdown.Item>
              </LinkContainer>
            </DropdownButton>
            <LinkContainer to="/fhir_server_setting">
              <Button onClick={ initialRouteState } variant="secondary">FHIRServer設定</Button>
            </LinkContainer>
          </ButtonToolbar>
      </Jumbotron>
    </Container>
    <Container className="p-3">
          <Switch>
            <AddPatientTemplate />
          </Switch>
          <Switch>
            <QueryPatientTemplate />
          </Switch>
          <Switch>
            <ModifyPatientTemplate />
          </Switch>
          <Switch>
            <DeletePatientTemplate />
          </Switch>
          <Switch>
            <QueryOrgTemplate />
          </Switch>
          <Switch>
            <AddOrgTemplate />
          </Switch>
          <Switch>
            <AddImmunizationTemplate />
          </Switch>
          <Switch>
            <QueryImmunizationTemplate />
          </Switch>
          <Switch>
            <AddObservationTemplate />
          </Switch>
          <Switch>
            <QueryObservationTemplate />
          </Switch>
          <Switch>
            <FHIRServerSettingTemplate />
          </Switch>
          <Switch>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
    </Container>
  </MemoryRouter>
  );
};

export default App;
