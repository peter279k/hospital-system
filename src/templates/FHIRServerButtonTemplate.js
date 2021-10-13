import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { LinkContainer } from 'react-router-bootstrap';


const FHIRServerButtonTemplate = () => {

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
        <LinkContainer to="/fhir_server_setting">
              <Button onClick={ initialRouteState } variant="secondary">FHIRServer設定</Button>
        </LinkContainer>
    );
};

export default FHIRServerButtonTemplate;
