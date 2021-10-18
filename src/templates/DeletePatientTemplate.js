import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';

import HttpRequest from '../HttpRequest.js';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';


const DeletePatient = () => <h2 className="text-info">刪除病患資料</h2>;

const DeletePatientTemplate = () => {

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

    const handleDeletePatientSubmit = e => {
        e.preventDefault();
        const newErrors = findDeletePatientError();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }

        HttpRequest.deletePatientData(form, setVisibleText, setJsonResponseText, setErrorResponseText, setVisibleProgressBarText);
    };

    const findDeletePatientError = () => {
        const {
          patientResourceId,
        } = form;
        const newErrors = {};
        if (!patientResourceId || patientResourceId === '') {
          newErrors.patientResourceId = '請輸入Patient resource id!';
        }

        return newErrors;
    };

    return (
        <Switch>
        <Route path="/delete_patient">
              <DeletePatient />
              <Form>
                <Form.Group className="mb-3">
                <Form.Label>請輸入Patient resource id<Form.Label className="text-danger">*</Form.Label></Form.Label>
                <Form.Control onChange={ e => setField('patientResourceId', e.target.value) } type="text" placeholder="輸入Patient resource id" isInvalid={ !!errors.patientResourceId }/>
                <Form.Control.Feedback type='invalid'>{ errors.patientResourceId }</Form.Control.Feedback>
              </Form.Group>
              </Form>

              <Form.Group className="mb-3">
                <Button variant="primary" type="submit" onClick={ handleDeletePatientSubmit }>
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

export default DeletePatientTemplate;
