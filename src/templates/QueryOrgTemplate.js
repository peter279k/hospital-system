import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import HttpRequest from '../HttpRequest.js';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';


const QueryOrganization = () => <h2>查詢醫事單位</h2>;

const QueryOrgTemplate = () => {

    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});
    const [visibleText] = useState('invisible');
    const [jsonResponse] = useState('');
    const [errorResponse] = useState('');

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

    const handleQueryOrgError = () => {
        const {
          orgId,
        } = form;
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

        console.log('Done for filling org querying form');
    };

    return (
        <Switch>
        <Route path="/query_organization">
              <QueryOrganization />
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>請輸入Organization id<Form.Label className="text-danger">*</Form.Label></Form.Label>
                  <Form.Control onChange={ e => setField('orgId', e.target.value) } type="text" placeholder="請輸入Organization id" isInvalid={ !!errors.orgId }/>
                  <Form.Control.Feedback type='invalid'>{ errors.orgId }</Form.Control.Feedback>
                </Form.Group>
              </Form>

              <Form.Group className="mb-3">
                <Button variant="primary" type="submit" onClick={ handleQueryOrgSubmit }>
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
        </Route>
        </Switch>
    );
};

export default QueryOrgTemplate;
