import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { LinkContainer } from 'react-router-bootstrap';


const FHIRServerButtonTemplate = () => {

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
        <LinkContainer to="/fhir_server_setting">
              <Button onClick={ initialRouteState } variant="secondary">FHIRServer設定</Button>
        </LinkContainer>
    );
};

export default FHIRServerButtonTemplate;
