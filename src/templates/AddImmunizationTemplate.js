import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';
import DatePicker from "react-datepicker";

import HttpRequest from '../HttpRequest.js';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';


const AddImmunization = () => <h2 className="text-info">新增疫苗接種資料</h2>;

const AddImmunizationTemplate = () => {

    const [errors, setErrors] = useState({});
    const [visibleText, setVisibleText] = useState('invisible');
    const [visibleProgressBar, setVisibleProgressBarText] = useState('invisible');
    const [jsonResponse, setJsonResponseText] = useState('');
    const [errorResponse, setErrorResponseText] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [bundleId, setBundleIdText] = useState('');

    const [vaccineId, setVaccineId] = useState('');
    const [vaccineCode, setVaccineCode] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [patientId, setPatientId] = useState('');
    const [doseNumberPositiveInt, setDoseNumberPositiveInt] = useState('');
    const [seriesPositiveInt, setSeriesPositiveInt] = useState('');
    const [lotNumber, setLotNumber] = useState('');
    const [medOrgId, setMedOrgId] = useState('');
    const [medName, setMedName] = useState('');

    const resetInputFields = e => {
      e.preventDefault();
      setStartDate(new Date());
      setBundleIdText('');
      setVaccineId('');
      setVaccineCode('');
      setManufacturer('');
      setPatientId('');
      setDoseNumberPositiveInt('');
      setSeriesPositiveInt('');
      setLotNumber('');
      setMedOrgId('');
      setMedName('');
      setVisibleText('invisible');
      setJsonResponseText('');
      setErrorResponseText('');
    };

    const handleAddingImmunizationSubmit = e => {
        e.preventDefault();
        const newErrors = findHandleAddingImmunizationError();
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return false;
        }
        let form = {
          'vaccineId': vaccineId,
          'vaccineCode': vaccineCode,
          'manufacturer': manufacturer,
          'patientId': patientId,
          'doseNumberPositiveInt': doseNumberPositiveInt,
          'seriesPositiveInt': seriesPositiveInt,
          'lotNumber': lotNumber,
          'medOrgId': medOrgId,
          'medName': medName,
        };
        HttpRequest.sendImmunizationBundleData(form, startDate, setJsonResponseText, setErrorResponseText, setVisibleText, setBundleIdText, setVisibleProgressBarText);
    };

    const findHandleAddingImmunizationError = () => {
        const newErrors = {};
        if (!vaccineId || vaccineId === '') {
          newErrors.vaccineId = '請選擇疫苗代碼！';
        }
        if (!vaccineCode || vaccineCode === '') {
          newErrors.vaccineCode = '請選擇疫苗名稱代號！';
        }
        if (!manufacturer || manufacturer === '') {
          newErrors.manufacturer = '請選擇疫苗名稱代號！';
        }
        if (!patientId || patientId === '') {
          newErrors.patientId = '請輸入Patient id！';
        }
        if (!doseNumberPositiveInt || doseNumberPositiveInt === '') {
          newErrors.doseNumberPositiveInt = '請輸入劑別！';
        }
        if (!seriesPositiveInt || seriesPositiveInt === '') {
          newErrors.seriesPositiveInt = '請輸入完整劑數！';
        }
        if (!lotNumber || lotNumber === '') {
          newErrors.lotNumber = '請輸入批號！';
        }
        if (!medOrgId || medOrgId === '') {
          newErrors.medOrgId = '請輸入Organization id！';
        }
        if (!medName || medName === '') {
          newErrors.medName = '請輸入負責醫事人員名稱！';
        }
        if (!startDate || startDate === '' || startDate === null) {
          newErrors.startDate = '請選擇疫苗接種日期！';
        }

        return newErrors;
    };

    return (
        <Switch>
        <Route path="/add_immunization">
        <AddImmunization />
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>請選擇疫苗代碼<Form.Label className="text-danger">*</Form.Label></Form.Label>
            <Form.Control value={ vaccineId } onChange={ e => setVaccineId(e.target.value) } as="select" custom isInvalid={ !!errors.vaccineId }>
              <option>請選擇疫苗代碼</option>
              <option value="CoV_AZ">CoV_AZ</option>
              <option value="CoV_Moderna">CoV_Moderna</option>
              <option value="CoV_Medigen">CoV_Medigen</option>
            </Form.Control>
            <Form.Control.Feedback type='invalid'>{ errors.vaccineId }</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>請選擇疫苗名稱代號<Form.Label className="text-danger">*</Form.Label></Form.Label>
            <Form.Control value={ vaccineCode } onChange={ e => setVaccineCode(e.target.value) } as="select" custom isInvalid={ !!errors.vaccineCode }>
              <option>請選擇疫苗名稱代號</option>
              <option value="AZD1222">AZD1222</option>
              <option value="BNT162b2">BNT162b2</option>
              <option value="mRNA-1273">mRNA-1273</option>
              <option value="MVC-COV1901">MVC-COV1901</option>
            </Form.Control>
            <Form.Control.Feedback type='invalid'>{ errors.vaccineCode }</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>請選擇疫苗廠商<Form.Label className="text-danger">*</Form.Label></Form.Label>
            <Form.Control value={ manufacturer } onChange={ e => setManufacturer(e.target.value) } as="select" custom isInvalid={ !!errors.manufacturer }>
              <option>請選擇疫苗廠商</option>
              <option value="AstraZeneca">AstraZeneca</option>
              <option value="Pfizer BioNTech">Pfizer BioNTech</option>
              <option value="Moderna Biotech">Moderna Biotech</option>
              <option value="Medigen">Medigen</option>
            </Form.Control>
            <Form.Control.Feedback type='invalid'>{ errors.manufacturer }</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>請輸入Patient id<Form.Label className="text-danger">*</Form.Label></Form.Label>
            <Form.Control value={ patientId } onChange={ e => setPatientId(e.target.value) } type="text" placeholder="請輸入Patient id" isInvalid={ !!errors.patientId }/>
            <Form.Control.Feedback type='invalid'>{ errors.patientId }</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>請輸入劑別<Form.Label className="text-danger">*</Form.Label></Form.Label>
            <Form.Control value={ doseNumberPositiveInt } onChange={ e => setDoseNumberPositiveInt(e.target.value) } type="text" placeholder="請輸入劑別" isInvalid={ !!errors.doseNumberPositiveInt }/>
            <Form.Control.Feedback type='invalid'>{ errors.doseNumberPositiveInt }</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>請輸入完整劑數<Form.Label className="text-danger">*</Form.Label></Form.Label>
            <Form.Control value={ seriesPositiveInt } onChange={ e => setSeriesPositiveInt(e.target.value) } type="text" placeholder="請輸入完整劑數" isInvalid={ !!errors.seriesPositiveInt }/>
            <Form.Control.Feedback type='invalid'>{ errors.seriesPositiveInt }</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>請輸入批號<Form.Label className="text-danger">*</Form.Label></Form.Label>
            <Form.Control value={ lotNumber} onChange={ e => setLotNumber(e.target.value) } type="text" placeholder="請輸入批號" isInvalid={ !!errors.lotNumber }/>
            <Form.Control.Feedback type='invalid'>{ errors.lotNumber }</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>請選擇疫苗接種日期<Form.Label className="text-danger">*</Form.Label></Form.Label>
            <DatePicker
              className="form-control"
              dateFormat="yyyy/MM/dd"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
            />
            <Form.Control.Feedback type='invalid'>{ errors.startDate }</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>請輸入Organization id<Form.Label className="text-danger">*</Form.Label></Form.Label>
            <Form.Control value={ medOrgId } onChange={ e => setMedOrgId(e.target.value) } type="text" placeholder="請輸入Organization id" isInvalid= { !!errors.medOrgId }/>
            <Form.Control.Feedback type='invalid'>{ errors.medOrgId }</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>請輸入負責醫事人員名稱<Form.Label className="text-danger">*</Form.Label></Form.Label>
            <Form.Control value={ medName } onChange={ e => setMedName(e.target.value) } type="text" placeholder="請輸入負責醫事人員名稱" isInvalid= { !!errors.medName }/>
            <Form.Control.Feedback type='invalid'>{ errors.medName }</Form.Control.Feedback>
          </Form.Group>
        </Form>

        <Form.Group className="mb-3">
          <Button variant="primary" type="submit" onClick={ handleAddingImmunizationSubmit }>
            送出
          </Button>{' '}
          <Button variant="danger" type="submit" onClick={ resetInputFields }>
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

export default AddImmunizationTemplate;
