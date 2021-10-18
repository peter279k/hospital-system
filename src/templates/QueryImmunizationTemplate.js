import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';

import HttpRequest from '../HttpRequest.js';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const QueryImmunization = () => <h2 className="text-info">查詢疫苗接種資料</h2>;

const QueryImmunizationTemplate = () => {

    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});
    const [visibleText, setVisibleText] = useState('invisible');
    const [visibleProgressBar, setVisibleProgressBarText] = useState('invisible');
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

    const handleQueryingImmunizationSubmit = e => {
        e.preventDefault();
        const newErrors = findHandleQueryingImmunizationError();
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return false;
        }

        let immunizationBundleId = form.immunizationId;

        HttpRequest.sendImmunizationBundleQueryData(immunizationBundleId, setJsonResponseText, setVisibleText, setErrorResponseText, setVisibleProgressBarText);
    };

    const findHandleQueryingImmunizationError = () => {
        const {
          immunizationId,
        } = form;
        const newErrors = {};
        if (!immunizationId || immunizationId === '') {
          newErrors.immunizationId = '請輸入Immunization id!';
        }

        return newErrors;
    };

    return (
        <Switch>
        <Route path="/query_immunization">
              <QueryImmunization />
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>請輸入Immunization Bundle id<Form.Label className="text-danger">*</Form.Label></Form.Label>
                  <Form.Control onChange={ e => setField('immunizationId', e.target.value) } type="text" placeholder="請輸入Immunization Bundle id" isInvalid={ !!errors.immunizationId }/>
                  <Form.Control.Feedback type='invalid'>{ errors.immunizationId }</Form.Control.Feedback>
                </Form.Group>
              </Form>

              <Form.Group className="mb-3">
                <Button variant="primary" type="submit" onClick={ handleQueryingImmunizationSubmit }>
                  送出
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
