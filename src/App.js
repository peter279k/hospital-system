import React, { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
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

import './App.css';


const App = () => {

  const [, setForm] = useState({});
  const [, setErrors] = useState({});
  const [, setLabelText] = useState('請輸入病患id(Patient Resource id)');
  const [, setSearchButtonText] = useState('進階搜尋');
  const [searchText] = useState('基本');
  const [setCreatedDateText] = useState('');
  const [setVisibleText] = useState('invisible');
  const [setStartDate] = useState(new Date());
  const [setJsonResponseText] = useState('');
  const [setErrorResponseText] = useState('');

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
