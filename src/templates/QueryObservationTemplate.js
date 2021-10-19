import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';

import HttpRequest from '../HttpRequest.js';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';


const QueryObservation = () => <h2 className="text-info">查詢篩檢資料</h2>;

const QueryObservationTemplate = () => {

    const [errors, setErrors] = useState({});
    const [visibleText, setVisibleText] = useState('invisible');
    const [visibleProgressBar, setVisibleProgressBarText] = useState('invisible');
    const [jsonResponse, setJsonResponseText] = useState('');
    const [errorResponse, setErrorResponseText] = useState('');

    const [observationId, setObservationId] = useState('');

    const resetInputField = e => {
      e.preventDefault();
      setVisibleText('invisible');
      setJsonResponseText('');
      setErrorResponseText('');
      setObservationId('');
    };

    const handleObservationQueryingSubmit = e => {
        e.preventDefault();
        const newErrors = findHandleQueryingObservationError();
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return false;
        }

        let observationBundleId = observationId;

        HttpRequest.sendObservationBundleQueryData(observationBundleId, setJsonResponseText, setVisibleText, setErrorResponseText, setVisibleProgressBarText);
    };


    const findHandleQueryingObservationError = () => {
        const newErrors = {};
        if (!observationId || observationId === '') {
            newErrors.observationId = '請輸入Observation id!';
        }

        return newErrors;
    };

    return (
        <Switch>
        <Route path="/query_observation">
              <QueryObservation />
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>請輸入Observation id<Form.Label className="text-danger">*</Form.Label></Form.Label>
                  <Form.Control value={ observationId } onChange={ e => setObservationId(e.target.value) } type="text" placeholder="請輸入Observation id" isInvalid={ !!errors.observationId }/>
                  <Form.Control.Feedback type='invalid'>{ errors.observationId }</Form.Control.Feedback>
                </Form.Group>
              </Form>

              <Form.Group className="mb-3">
                <Button variant="primary" type="submit" onClick={ handleObservationQueryingSubmit }>
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

export default QueryObservationTemplate;
