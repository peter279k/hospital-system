import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import DatePicker from "react-datepicker";

import HttpRequest from '../HttpRequest.js';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';


const AddImmunization = () => <h2>新增疫苗接種資料</h2>;

const AddImmunizationTemplate = () => {

    const [form, setForm] = useState({});
    const [errors, setErrors] = useState({});
    const [visibleText] = useState('invisible');
    const [jsonResponse] = useState('');
    const [errorResponse] = useState('');
    const [startDate, setStartDate] = useState(new Date());

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

    const handleAddingImmunizationSubmit = e => {
        e.preventDefault();
        const newErrors = findHandleAddingImmunizationError();
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return false;
        }

        console.log('Done for filling immunization adding form');
    };

    const findHandleAddingImmunizationError = () => {
        const {
          vaccineId,
          vaccineCode,
          manufacturer,
          patientId,
          doseNumberPositiveInt,
          seriesPositiveInt,
          lotNumber,
          medOrgId,
        } = form;
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
          newErrors.medOrgId = '請輸入醫事單位id！';
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
            <Form.Control onChange={ e => setField('vaccineId', e.target.value) } as="select" custom isInvalid={ !!errors.vaccineId }>
              <option>請選擇疫苗代碼</option>
              <option value="AZ">COV_AZ</option>
            </Form.Control>
            <Form.Control.Feedback type='invalid'>{ errors.vaccineId }</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>請選擇疫苗名稱代號<Form.Label className="text-danger">*</Form.Label></Form.Label>
            <Form.Control onChange={ e => setField('vaccineCode', e.target.value) } as="select" custom isInvalid={ !!errors.vaccineCode }>
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
            <Form.Control onChange={ e => setField('manufacturer', e.target.value) } as="select" custom isInvalid={ !!errors.manufacturer }>
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
            <Form.Control onChange={ e => setField('patientId', e.target.value) } type="text" placeholder="請輸入Patient id" isInvalid={ !!errors.patientId }/>
            <Form.Control.Feedback type='invalid'>{ errors.patientId }</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>請輸入劑別<Form.Label className="text-danger">*</Form.Label></Form.Label>
            <Form.Control onChange={ e => setField('doseNumberPositiveInt', e.target.value) } type="text" placeholder="請輸入劑別" isInvalid={ !!errors.doseNumberPositiveInt }/>
            <Form.Control.Feedback type='invalid'>{ errors.doseNumberPositiveInt }</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>請輸入完整劑數<Form.Label className="text-danger">*</Form.Label></Form.Label>
            <Form.Control onChange={ e => setField('seriesPositiveInt', e.target.value) } type="text" placeholder="請輸入完整劑數" isInvalid={ !!errors.seriesPositiveInt }/>
            <Form.Control.Feedback type='invalid'>{ errors.seriesPositiveInt }</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>請輸入批號<Form.Label className="text-danger">*</Form.Label></Form.Label>
            <Form.Control onChange={ e => setField('lotNumber', e.target.value) } type="text" placeholder="請輸入批號" isInvalid={ !!errors.lotNumber }/>
            <Form.Control.Feedback type='invalid'>{ errors.lotNumber }</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>請選擇疫苗接種日期<Form.Label className="text-danger">*</Form.Label></Form.Label>
            <DatePicker
              className="form-control"
              dateFormat="yyyy/MM/dd"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              isInvalid={ !!errors.occurrenceDate }
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>請輸入Organization id<Form.Label className="text-danger">*</Form.Label></Form.Label>
            <Form.Control onChange={ e => setField('medOrgId', e.target.value) } type="text" placeholder="請輸入Organization id" isInvalid= { !!errors.medOrgId }/>
            <Form.Control.Feedback type='invalid'>{ errors.medOrgId }</Form.Control.Feedback>
          </Form.Group>
        </Form>

        <Form.Group className="mb-3">
          <Button variant="primary" type="submit" onClick={ handleAddingImmunizationSubmit }>
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

export default AddImmunizationTemplate;
