import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';

import HttpRequest from '../HttpRequest.js';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';


const QueryOrganization = () => <h2 className="text-info">查詢醫事單位</h2>;

const QueryOrgTemplate = () => {

    const [orgId, setOrgId] = useState('');
    const [errors, setErrors] = useState({});
    const [visibleText, setVisibleText] = useState('invisible');
    const [visibleProgressBar, setVisibleProgressBarText] = useState('invisible');
    const [jsonResponse, setJsonResponseText] = useState('');
    const [errorResponse, setErrorResponseText] = useState('');

    const handleQueryOrgError = () => {
        const newErrors = {};
        if (!orgId || orgId === '') {
          newErrors.orgId = '請輸入Organization id!';
        }

        return newErrors;
    };

    const handleQueryOrgSubmit = e => {
        e.preventDefault();
        const newErrors = handleQueryOrgError();
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return false;
        }

        HttpRequest.sendQueryOrgData(orgId, setJsonResponseText, setVisibleText, setErrorResponseText, setVisibleProgressBarText);
    };

    const resetQueryOrgForm = e => {
      e.preventDefault();
      setOrgId('');
    };

    return (
        <Switch>
        <Route path="/query_organization">
              <QueryOrganization />
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>請輸入Organization resource id<Form.Label className="text-danger">*</Form.Label></Form.Label>
                  <Form.Control value={ orgId } onChange={ e => setOrgId(e.target.value) } type="text" placeholder="請輸入Organization resource id" isInvalid={ !!errors.orgId }/>
                  <Form.Control.Feedback type='invalid'>{ errors.orgId }</Form.Control.Feedback>
                </Form.Group>
              </Form>

              <Form.Group className="mb-3">
                <Button variant="primary" type="submit" onClick={ handleQueryOrgSubmit }>
                  送出
                </Button>{' '}
                <Button variant="danger" type="submit" onClick={ resetQueryOrgForm }>
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

export default QueryOrgTemplate;
