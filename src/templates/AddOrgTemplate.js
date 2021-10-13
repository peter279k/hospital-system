import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import HttpRequest from '../HttpRequest.js';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';


const AddOrganization = () => <h2>新增醫事單位</h2>;

const AddOrgTemplate = () => {

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

    const handleAddingOrgSubmit = e => {
        e.preventDefault();
        const newErrors = findHandleAddingOrgError();
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return false;
        }

        console.log('Done for filling organization adding form');
    };

    const findHandleAddingOrgError = () => {
        const {
          medId,
          medName,
        } = form;
        const newErrors = {};

        if (!medId || medId === '') {
          newErrors.medId = '醫事代碼請勿空白！';
        }

        if (!medName || medName === '') {
          newErrors.medName = '醫事單位名稱請勿空白！';
        }

        return newErrors;
    };

    return (
      <Switch>
        <Route path="/add_organization">
              <AddOrganization />
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>請輸入醫事代碼<Form.Label className="text-danger">*</Form.Label></Form.Label>
                  <Form.Control onChange={ e => setField('medId', e.target.value) } type="text" placeholder="請輸入醫事代碼" isInvalid={ !!errors.medId }/>
                  <Form.Control.Feedback type='invalid'>{ errors.medId }</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>請輸入醫事單位名稱<Form.Label className="text-danger">*</Form.Label></Form.Label>
                  <Form.Control onChange= { e => setField('medName', e.target.value) } type="text" placeholder="請輸入醫事單位名稱" isInvalid={ !!errors.medName }/>
                  <Form.Control.Feedback type='invalid'>{ errors.medName }</Form.Control.Feedback>
                </Form.Group>
              </Form>

              <Form.Group className="mb-3">
                <Button variant="primary" type="submit" onClick={ handleAddingOrgSubmit }>
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

export default AddOrgTemplate;
