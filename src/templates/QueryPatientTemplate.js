import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import DatePicker from "react-datepicker";
import Button from 'react-bootstrap/Button';

import HttpRequest from '../HttpRequest.js';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';


const QueryPatientTemplate = () => {

    const [visibleText, setVisibleText] = useState('invisible');
    const [searchText, setSearchText] = useState('基本');
    const [buttonText, setSearchButtonText] = useState('進階搜尋');
    const [createdDate, setCreatedDateText] = useState('');
    const [searchVisibleText, setSearchVisibleText] = useState('invisible');
    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});
    const [labelText, setLabelText] = useState('請輸入病患id');
    const [startDate, setStartDate] = useState(new Date());
    const [jsonResponse, setJsonResponseText] = useState('');
    const [errorResponse, setErrorResponseText] = useState('');

    const setField = (field, value) => {
        setForm({
          ...form,
          [field]: value,
        });
        if (!!errors[field]) {
          setErrors({
            ...errors,
            [field]: null,
          });
        }
    };

    const findQueryPatientErrors = () => {
        const {
          patientIdOrName,
        } = form;
        const newErrors = {};

        if (!patientIdOrName || patientIdOrName === '') {
          newErrors.patientIdOrName = 'Patient id或是姓名請勿空白！';
        }

        return newErrors;
    };

    const handleQueryPatientSubmit = e => {
        e.preventDefault();
        const newErrors = findQueryPatientErrors();
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return false;
        }

        HttpRequest.sendPatientQueryData(form, startDate, searchText, setJsonResponseText, setVisibleText, setErrorResponseText);
    };

    const renderSearchTemplate = e => {
        e.preventDefault();
        if (searchText === '進階') {
          setLabelText('請輸入病患id(Patient Resource id)');
          setSearchButtonText('進階搜尋');
          setSearchText('基本');
          setCreatedDateText('');
          setSearchVisibleText('invisible');
        }
        if (searchText === '基本') {
          setLabelText('請輸入病患中文姓名');
          setSearchButtonText('基本搜尋');
          setCreatedDateText('請選擇建立資料之日期');
          setSearchVisibleText('visible');
          setSearchText('進階');
        }
    };

    return (
        <Switch>
        <Route path="/query_patient">
              <h2 className="text-info">病患資料{ searchText }查詢</h2>
              <Form>
                <Form.Group className="mb-3">
                  <Button variant="info" type="button" onClick={ renderSearchTemplate }>
                    {buttonText}
                  </Button>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>{labelText}<Form.Label className="text-danger">*</Form.Label></Form.Label>
                  <Form.Control onChange={ e => setField('patientIdOrName', e.target.value) } type="text" placeholder={labelText} isInvalid={ !!errors.patientIdOrName }/>
                  <Form.Control.Feedback type='invalid'>{ errors.patientIdOrName }</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className={'mb-3 ' + searchVisibleText}>
                  <Form.Label>{createdDate}</Form.Label>
                  <DatePicker
                    className="form-control"
                    dateFormat="yyyy/MM/dd"
                    selected={startDate}
                    onChange={ (date) => setStartDate(date) }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Button variant="primary" type="submit" onClick={ handleQueryPatientSubmit }>
                    送出
                  </Button>{' '}
                  <Button variant="danger" type="reset">
                    清空資料
                  </Button>{' '}
                </Form.Group>

                <Form.Group className={ "mb-3 " + visibleText }>
                  <h3 className="text-info">{ errorResponse }</h3>
                  <SyntaxHighlighter language="json" style={ dark }>
                    { jsonResponse }
                  </SyntaxHighlighter>
              </Form.Group>
              </Form>
            </Route>
        </Switch>
    );
};

export default QueryPatientTemplate;
