import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import HttpRequest from '../HttpRequest.js';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';


const FHIRServerSetting = () => <h2 className="text-info">FHIRServer設定</h2>;

const FHIRServerSettingTemplate = () => {

    const [form, setForm] = useState({});
    const [apiToken, setApiToken] = useState('');
    const [errors, setErrors] = useState({});
    const [visibleText, setVisibleText] = useState('invisible');
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

    const handleFHIRServerSubmit = e => {
        e.preventDefault();
        const newErrors = findFHIRServerError();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }

        HttpRequest.sendFHIRServerData(setVisibleText, setJsonResponseText, setErrorResponseText, form.apiEndpoint, apiToken);
    };

    const findFHIRServerError = () => {
        const {
            apiEndpoint,
        } = form;
        const newErrors = {};

        if (!apiEndpoint || apiEndpoint === '') {
            newErrors.apiEndpoint = 'FHIR Server 請勿空白！';
        }

        return newErrors;
    };

    return (
        <Switch>
        <Route path="/fhir_server_setting">
              <FHIRServerSetting />
              <Form.Group className="mb-3">
                <Form.Label>請輸入FIHR Server API Endpoint<Form.Label className="text-danger">*</Form.Label></Form.Label>
                <Form.Control onChange={ e => setField('apiEndpoint', e.target.value) } type="text" placeholder="請輸入FIHR Server API Endpoint" isInvalid={ !!errors.apiEndpoint }/>
                <Form.Control.Feedback type='invalid'>{ errors.apiEndpoint }</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>請輸入FIHR Server API Token</Form.Label>
                <Form.Control onChange={ e => setApiToken(e.target.value) } type="text" placeholder="請輸入FIHR Server API Token"/>
              </Form.Group>

              <Form.Group className="mb-3">
                <Button variant="primary" type="submit" onClick={ handleFHIRServerSubmit }>
                  送出
                </Button>{' '}
              </Form.Group>

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

export default FHIRServerSettingTemplate;
