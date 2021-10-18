import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import DatePicker from "react-datepicker";

import HttpRequest from '../HttpRequest.js';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';


const AddObservation = () => <h2 className="text-info">新增篩檢資料</h2>;

const AddObservationTemplate = () => {

    const [errors, setErrors] = useState({});
    const [visibleText, setVisibleText] = useState('invisible');
    const [visibleProgressBar, setVisibleProgressBarText] = useState('invisible');
    const [startDate, setStartDate] = useState(new Date());
    const [issuedDate, setIssuedDate] = useState(new Date());
    const [jsonResponse, setJsonResponseText] = useState('');
    const [errorResponse, setErrorResponseText] = useState('');
    const [bundleId, setBundleIdText] = useState('');

    const [observationMethod, setObservationMethod] = useState('');
    const [observationValue, setObservationValue] = useState('');
    const [orgId, setOrgId] = useState('');
    const [patientId, setPatientId] = useState('');

    const resetInputField = e => {
      e.preventDefault();
      setStartDate(new Date());
      setIssuedDate(new Date());
      setVisibleText('invisible');
      setJsonResponseText('');
      setErrorResponseText('');
      setBundleIdText('');
      setObservationMethod('');
      setObservationValue('');
      setOrgId('');
      setPatientId('');
    };

    const handleObservationAddingSubmit = e => {
        e.preventDefault();
        const newErrors = findHandleAddingObservationError();
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return false;
        }

        let form = {
          'observationMethod': observationMethod,
          'observationValue': observationValue,
          'orgId': orgId,
          'patientId': patientId,
        };

        HttpRequest.sendObservationBundleData(form, startDate, issuedDate, setJsonResponseText, setErrorResponseText, setVisibleText, setBundleIdText, setVisibleProgressBarText);
    };

    const findHandleAddingObservationError = () => {
        const newErrors = {};
        if (!observationMethod || observationMethod === '') {
          newErrors.observationMethod = '請選擇篩檢方法！';
        }
        if (!observationValue || observationValue === '') {
          newErrors.observationValue = '請選擇篩檢結果！';
        }
        if (!orgId || orgId === '') {
          newErrors.orgId = '請輸入醫事單位id！';
        }
        if (!patientId || patientId === '') {
          newErrors.patientId = '請輸入patient id！';
        }
        if (!startDate || startDate === '' || startDate === null) {
          newErrors.startDate = '請選擇採檢日期！';
        }
        if (!issuedDate || issuedDate === '' || issuedDate === null) {
          newErrors.startDate = '請選擇報告日期！';
        }

        return newErrors;
    };

    return (
        <Switch>
        <Route path="/add_observation">
        <AddObservation />
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>請選擇採檢日<Form.Label className="text-danger">*</Form.Label></Form.Label>
            <DatePicker
              className="form-control"
              dateFormat="yyyy/MM/dd"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
            />
            <Form.Control.Feedback type='invalid'>{ errors.startDate }</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>請選擇報告日<Form.Label className="text-danger">*</Form.Label></Form.Label>
            <DatePicker
              className="form-control"
              dateFormat="yyyy/MM/dd"
              selected={issuedDate}
              onChange={(date) => setIssuedDate(date)}
            />
            <Form.Control.Feedback type='invalid'>{ errors.issuedDate }</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>請選擇篩檢方法<Form.Label className="text-danger">*</Form.Label></Form.Label>
            <Form.Control value={ observationMethod } onChange={ e => setObservationMethod(e.target.value) } as="select" custom isInvalid={ !!errors.observationMethod }>
              <option>請選擇篩檢方法</option>
              <option value="PCR">PCR</option>
              <option value="Real-Time PCR">Real-Time PCR</option>
              <option value="RT-PCR">RT-PCR</option>
              <option value="RT-qPCR">RT-qPCR（ Quantitative Reverse Transcription PCR）</option>
              <option value="NAA">NAA（Nucleic acid Amplification）</option>
              <option value="NAAT">NAAT（Nucleic acid Amplification Test）</option>
              <option value="NAT">NAT（Nucleic acid Test）</option>
              <option value="LAMP">LAMP（Loop-Mediated isothermal Amplification）</option>
              <option value="RT-LAMP">RT-LAMP</option>
              <option value="COVID-19 RNA test">COVID-19 RNA test</option>
              <option value="SARS-CoV-2 RNA test">SARS-CoV-2 RNA test</option>
              <option value="Molecular Diagnostics">Molecular Diagnostics</option>
            </Form.Control>
            <Form.Control.Feedback type='invalid'>{ errors.observationMethod }</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>請選擇篩檢結果<Form.Label className="text-danger">*</Form.Label></Form.Label>
            <Form.Control value={ observationValue } onChange={ e => setObservationValue(e.target.value) } as="select" custom isInvalid={ !!errors.observationValue }>
              <option>請選擇篩檢結果</option>
              <option value="Positive">Positive(陽性)</option>
              <option value="Negative">Negative(陰性)</option>
            </Form.Control>
            <Form.Control.Feedback type='invalid'>{ errors.observationValue }</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>請輸入Organization id<Form.Label className="text-danger">*</Form.Label></Form.Label>
            <Form.Control value={ orgId } onChange={ e => setOrgId(e.target.value) } type="text" placeholder="請輸入Organization id" isInvalid={ !!errors.orgId }/>
            <Form.Control.Feedback type='invalid'>{ errors.orgId }</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>請輸入Patient id<Form.Label className="text-danger">*</Form.Label></Form.Label>
            <Form.Control value={ patientId } onChange={ e => setPatientId(e.target.value) } type="text" placeholder="請輸入Patient id" isInvalid={ !!errors.patientId }/>
            <Form.Control.Feedback type='invalid'>{ errors.patientId }</Form.Control.Feedback>
          </Form.Group>
        </Form>

        <Form.Group className="mb-3">
          <Button variant="primary" type="submit" onClick={ handleObservationAddingSubmit }>
            送出
          </Button>{' '}
          <Button variant="danger" type="submit" onClick={ resetInputField }>
            清空資料
          </Button>{' '}
        </Form.Group>

        <ProgressBar variant="secondary" className={ visibleProgressBar } animated now={100} />

        <Form.Group className={ "mb-3 " + visibleText }>
          <h3 className="text-success">{ bundleId }</h3>
          <h3 className="text-info">{ errorResponse }</h3>
          <SyntaxHighlighter language="json" style={ dark }>
            { jsonResponse }
          </SyntaxHighlighter>
        </Form.Group>
      </Route>
      </Switch>
    );
};

export default AddObservationTemplate;
