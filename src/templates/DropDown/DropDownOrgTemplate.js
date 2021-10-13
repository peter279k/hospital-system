import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { LinkContainer } from 'react-router-bootstrap';


const DropDownOrgTemplate = () => {

    const [, setForm] = useState({});
    const [, setErrors] = useState({});
    const [, setLabelText] = useState('請輸入病患id');
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
        setVisibleText('invisible');
        setStartDate(new Date());
        setErrorResponseText('回應JSON');
    };

    return (
        <DropdownButton className="custom-btn-toolbar" title="醫事單位管理" variant="secondary">
                <LinkContainer to="/add_organization">
                  <Dropdown.Item onClick={ initialRouteState } eventKey="1">新增醫事單位</Dropdown.Item>
                </LinkContainer>
                <LinkContainer to="/query_organization">
                  <Dropdown.Item onClick={ initialRouteState } eventKey="2">查詢醫事單位</Dropdown.Item>
                </LinkContainer>
        </DropdownButton>
    );
};

export default DropDownOrgTemplate;
