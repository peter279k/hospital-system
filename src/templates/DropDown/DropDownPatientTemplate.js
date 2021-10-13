import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { LinkContainer } from 'react-router-bootstrap';


const DropDownPatientTemplate = () => {

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
    );
};

export default DropDownPatientTemplate;
