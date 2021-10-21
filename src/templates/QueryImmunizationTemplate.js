import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import DatePicker from "react-datepicker";
import ProgressBar from 'react-bootstrap/ProgressBar';

import HttpRequest from '../HttpRequest.js';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const QueryImmunization = () => <h2 className="text-info">查詢疫苗接種資料</h2>;

const QueryImmunizationTemplate = () => {

    const [errors, setErrors] = useState({});
    const [visibleText, setVisibleText] = useState('invisible');
    const [visibleProgressBar, setVisibleProgressBarText] = useState('invisible');
    const [jsonResponse, setJsonResponseText] = useState('');
    const [errorResponse, setErrorResponseText] = useState('');
    const [patientOrOrgId, setPatientOrOrgId] = useState('');
    const [searchChangeText, setSearchChangeText] = useState('使用醫事單位id尋找');
    const [startDate, setStartDate] = useState(new Date());
    const [visibleOrgIdStar, setVisibleOrgIdStar] = useState('invisible');
    const [labelText, setLabelText] = useState('請輸入病患id');

    const resetInputField = e => {
      e.preventDefault();
      setVisibleText('invisible');
      setJsonResponseText('');
      setErrorResponseText('');
      setStartDate(new Date());
    };

    const handleQueryingImmunizationSubmit = e => {
        e.preventDefault();
        const newErrors = findHandleQueryingImmunizationError();
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return false;
        }

        let requestPayload = {
          'search_params': '',
        };
        let searchParams = 'performer=';
        if (searchChangeText === '使用醫事單位id尋找') {
          searchParams = 'patient=';
        }
        searchParams += patientOrOrgId;

        if (!!startDate) {
          let year = String(startDate.getFullYear());
          let month = startDate.getMonth() + 1;
          let date = startDate.getDate();
          if (month <= 9) {
            month = '0' + String(month);
          }
          if (date <= 9) {
            date = '0' + String(date);
          }
          searchParams += '&date=' + year + '-' + month + '-' + date;
        }

        requestPayload['search_params'] = searchParams;

        HttpRequest.sendImmunizationQueryData(requestPayload, setJsonResponseText, setVisibleText, setErrorResponseText, setVisibleProgressBarText);
    };

    const findHandleQueryingImmunizationError = () => {
        const newErrors = {};
        if (!patientOrOrgId || patientOrOrgId === '') {
          newErrors.patientOrOrgId = '請輸入醫事單位id';
          if (searchChangeText === '使用醫事單位id尋找') {
            newErrors.patientOrOrgId = '請輸入病患id';
          }
        }

        return newErrors;
    };

    const searchOgrId = e => {
      e.preventDefault();
      if (searchChangeText === '使用醫事單位id尋找') {
        setSearchChangeText('使用病患id尋找');
        setVisibleOrgIdStar('text-danger visible');
        setPatientOrOrgId('');
        setLabelText('請輸入醫事單位id');
      } else {
        setSearchChangeText('使用醫事單位id尋找');
        setVisibleOrgIdStar('invisible');
        setPatientOrOrgId('');
        setLabelText('請輸入病患id');
      }
    };

    return (
        <Switch>
        <Route path="/query_immunization">
              <QueryImmunization />
              <Form>
                <Form.Group className="mb-3">
                  <Button variant="primary" type="submit" onClick={ searchOgrId }>
                    { searchChangeText }
                  </Button>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>{ labelText }<Form.Label className="text-danger">*</Form.Label></Form.Label>
                  <Form.Control value={ patientOrOrgId } onChange={ e => setPatientOrOrgId(e.target.value) } type="text" placeholder={ labelText } isInvalid={ !!errors.patientOrOrgId }/>
                  <Form.Control.Feedback type='invalid'>{ errors.patientOrOrgId }</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                <Form.Label>請選擇接種日期<Form.Label className={ visibleOrgIdStar }>*</Form.Label></Form.Label>
                  <DatePicker
                    className="form-control"
                    dateFormat="yyyy/MM/dd"
                    selected={startDate}
                    onChange={ (date) => setStartDate(date) }
                  />
                </Form.Group>
              </Form>

              <Form.Group className="mb-3">
                <Button variant="primary" type="submit" onClick={ handleQueryingImmunizationSubmit }>
                  送出
                </Button>{' '}
                <Button variant="danger" type="submit" onClick={ resetInputField }>
                  清空資料
                </Button>{' '}
              </Form.Group>

              <ProgressBar variant="secondary" className={ visibleProgressBar } animated now={100} />

              <Form.Group className={ "mb-3 " + visibleText }>
                <h3 className="text-info">{ errorResponse }</h3>
                <SyntaxHighlighter language="json" style={ dark }>
                  { jsonResponse }
                </SyntaxHighlighter>
              </Form.Group>
        </Route>
        </Switch>
    );
};

export default QueryImmunizationTemplate;
