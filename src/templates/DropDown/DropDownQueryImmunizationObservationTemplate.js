import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { LinkContainer } from 'react-router-bootstrap';


const DropDownQueryImmunizationObservationTemplate = () => {

    const [, setForm] = useState({});
    const [, setErrors] = useState({});
    const [, setLabelText] = useState('請輸入病患id(Patient Resource id)');
    const [, setSearchButtonText] = useState('進階搜尋');
    const [searchText] = useState('基本');
    const [, setCreatedDateText] = useState('');
    const [, setVisibleText] = useState('invisible');
    const [, setStartDate] = useState(new Date());
    const [, setJsonResponseText] = useState('');
    const [, setErrorResponseText] = useState('');

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
        setStartDate(new Date());
        setErrorResponseText('');
    };

    return (
        <DropdownButton className="custom-btn-toolbar" title="查詢疫苗接種資料" variant="success">
        <LinkContainer to="/query_immunization">
          <Dropdown.Item onClick={ initialRouteState } eventKey="1">查詢疫苗接種資料</Dropdown.Item>
        </LinkContainer>
        {/* <LinkContainer to="/query_observation">
          <Dropdown.Item onClick={ initialRouteState } eventKey="2">查詢篩檢資料</Dropdown.Item>
        </LinkContainer> */}
        <LinkContainer to="/generate_qrcode">
          <Dropdown.Item onClick={ initialRouteState } eventKey="2">產生QRCode</Dropdown.Item>
        </LinkContainer>
      </DropdownButton>
    );
};

export default DropDownQueryImmunizationObservationTemplate;
