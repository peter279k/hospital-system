import React, { useState, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import DatePicker from "react-datepicker";
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';

import base64 from 'base-64';
import utf8 from 'utf8';

import VaccineRegister from '../VaccineRegister.js';


const VaccineRegisterTemplate = () => {

    const [visibleText, setVisibleText] = useState('invisible');
    const [vaccinePersonName, setVaccinePersonName] = useState('');
    const [vaccinePersonEnLastName, setVaccinePersonEnLastName] = useState('');
    const [vaccinePersonEnFirstName, setVaccinePersonEnFirstName] = useState('');
    const [countryName, setCountryName] = useState('');
    const [identityNumber, setIdentityNumber] = useState('');
    const [visibleProgressBar, setVisibleProgressBarText] = useState('invisible');
    const [errors, setErrors] = useState({});
    const [responseText, setResponseText] = useState('');
    const [errorResponseText, setErrorResponseText] = useState('');
    const [doseInputList, setDoseInputList] = useState([{ doseManufactureName: '', vaccinateDate: (new Date()), doseNumber: '' }]);

    const addDoseInfo = e => {
      e.preventDefault();
      const values = [...doseInputList];
      values.push({ doseManufactureName: '', vaccinateDate: (new Date()), doseNumber: '' });

      setDoseInputList(values);
    };

    const removeDoseInfo = index => {
      if (index === 0) {
        return false;
      }
      const values = [...doseInputList];
      values.splice(index, 1);

      setDoseInputList(values);
    };

    const vaccinationRegisterSubmit = e => {
      e.preventDefault();
      const newErrors = findVaccineRegisterErrors();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return false;
      }

      let encodedJsonString = base64.encode(utf8.encode(JSON.stringify(doseInputList)));

      let form = {
        'vaccinePersonName': vaccinePersonName,
        'identityNumber': identityNumber,
        'doseInputList': encodedJsonString,
      };

      if (!vaccinePersonEnFirstName || vaccinePersonEnFirstName === '') {
        form['vaccinePersonEnFirstName'] = vaccinePersonEnFirstName;
      }

      if (!vaccinePersonEnLastName || vaccinePersonEnLastName === '') {
        form['vaccinePersonEnLastName'] = vaccinePersonEnLastName;
      }

      if (!countryName || countryName === '') {
        form['countryName'] = countryName;
      }

      VaccineRegister.vaccineRegisterSubmit(form, setVisibleText, setVisibleProgressBarText, setResponseText, setErrorResponseText);
    };

    const findVaccineRegisterErrors = () => {
      const newErrors = {
      };
      let doseManufactureNames = [];
      let doseNumbers = [];

      if (!vaccinePersonName || vaccinePersonName === '') {
        newErrors.vaccinePersonName = '中文姓名不可空白！';
      }
      if (!identityNumber || identityNumber === '') {
        newErrors.identityNumber = '請輸入身份證/居留證/護照號碼！';
      }

      let doseManufactureName = '';
      let doseNumber = 0;
      for (let index=0; index<doseInputList.length; index++) {
        doseManufactureName = doseInputList[index].doseManufactureName;
        doseNumber = Number(doseInputList[index].doseNumber);
        if (!doseManufactureName || doseManufactureName === '') {
          doseManufactureNames[index] = '請輸入COVID-19疫苗第劑廠牌/品名！';
        }
        if (!doseNumber || doseNumber === 0) {
          doseNumbers[index] = '請輸入COVID-19疫苗第劑';
        }
        if (isNaN(doseNumber) || String(doseNumber).includes('.')) {
          doseNumbers[index] = '請輸入正確的COVID-19疫苗劑量數';
        }
      }

      if (doseManufactureNames.length !== 0) {
        newErrors.doseManufactureName = doseManufactureNames;
      }
      if (doseNumbers.length !== 0) {
        newErrors.doseNumber = doseNumbers;
      }

      return newErrors;
    };

    const resetInputFields = e => {
      e.preventDefault();
      setVisibleText('invisible');
      setVaccinePersonName('');
      setVaccinePersonEnLastName('');
      setVaccinePersonEnFirstName('');
      setCountryName('');
      setIdentityNumber('');
      setDoseInputList([{ doseManufactureName: '', vaccinateDate: (new Date()), doseNumber: 0 }]);
    };

    const handleInputChange = (index, event) => {
      let values = [...doseInputList];
      if (!!event.target && event.target.name === 'doseManufactureName') {
        values[index].doseManufactureName = event.target.value;
      } else if (!!event.target && event.target.name === 'doseNumber') {
        values[index].doseNumber = event.target.value;
      } else {
        values[index].vaccinateDate = event;
      }

      setDoseInputList(values);
    };

    return (
        <Switch>
        <Route path="/vaccine_register">
              <h2 className="text-info">註冊疫苗紀錄</h2>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>請輸入中文姓名<Form.Label className="text-danger">*</Form.Label></Form.Label>
                  <Form.Control value={ vaccinePersonName } onChange={ e => setVaccinePersonName(e.target.value) } type="text" placeholder="請輸入中文姓名" isInvalid={ !!errors.vaccinePersonName }/>
                  <Form.Control.Feedback type='invalid'>{ errors.vaccinePersonName }</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>請輸入英文名字（同護照）</Form.Label>
                  <Form.Control value={ vaccinePersonEnLastName } onChange={ e => setVaccinePersonEnLastName(e.target.value) } type="text" placeholder="請輸入Last name" isInvalid={ !!errors.vaccinePersonEnLastName }/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>請輸入英文姓氏（同護照）</Form.Label>
                  <Form.Control value={ vaccinePersonEnFirstName } onChange={ e => setVaccinePersonEnFirstName(e.target.value) } type="text" placeholder="請輸入First name" isInvalid={ !!errors.vaccinePersonEnFirstName }/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>請輸入國籍</Form.Label>
                    <Form.Control value={ countryName } onChange={ e => setCountryName(e.target.value) } type="text" placeholder="請輸入國籍" isInvalid={ !!errors.countryName }/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>請輸入身份證/居留證/護照號碼<Form.Label className="text-danger">*</Form.Label></Form.Label>
                    <Form.Control value={ identityNumber } onChange={ e => setIdentityNumber(e.target.value) } type="text" placeholder="請輸入身份證/居留證/護照號碼" isInvalid={ !!errors.identityNumber }/>
                    <Form.Control.Feedback type='invalid'>{ errors.identityNumber }</Form.Control.Feedback>
                </Form.Group>
                {
                  doseInputList.map((doseInfo, index) => {
                    return (
                        <Fragment key={ index }>
                        <Form.Group className="mb-3">
                          <Form.Label>請輸入COVID-19疫苗廠牌/品名<Form.Label className="text-danger">*</Form.Label></Form.Label>
                            <Form.Control name="doseManufactureName" value={ doseInfo.doseManufactureName } onChange={ e => handleInputChange(index, e) } type="text" placeholder="請輸入COVID-19疫苗第幾劑廠牌/品名" isInvalid={ !!errors.doseManufactureName }/>
                            <Form.Control.Feedback type='invalid'>{ (Object.values(errors).length !== 0 && Object.keys(errors).includes('doseManufactureName') && errors.doseManufactureName[index] !== undefined) ? errors.doseManufactureName[index] : null }</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>請輸入COVID-19疫苗第幾劑<Form.Label className="text-danger">*</Form.Label></Form.Label>
                            <Form.Control name="doseNumber" value={ doseInfo.doseNumber } onChange={ e => handleInputChange(index, e) } type="text" placeholder="請輸入COVID-19疫苗第幾劑" isInvalid={ !!errors.doseNumber }/>
                            <Form.Control.Feedback type='invalid'>{ (Object.values(errors).length !== 0 && Object.keys(errors).includes('doseNumber') && errors.doseNumber[index] !== undefined) ? errors.doseNumber[index] : null }</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>請選擇COVID-19疫苗劑接種日期<Form.Label className="text-danger">*</Form.Label></Form.Label>
                            <DatePicker
                              className="form-control"
                              name="vaccinateDate"
                              dateFormat="yyyy/MM/dd"
                              selected={ doseInfo.vaccinateDate }
                              onChange={ (date) => handleInputChange(index, date) }
                            />
                        </Form.Group>
                        {
                          index === (doseInputList.length - 1) ? (
                            <Form.Group className="mb-3">
                            <Button variant="warning" type="submit" onClick={ addDoseInfo }>
                              新增COVID-19疫苗資訊
                            </Button>{' '}
                            <Button variant="danger" type="button" onClick={ () => removeDoseInfo(index) }>
                              移除COVID-19疫苗資訊
                            </Button>{' '}
                          </Form.Group>
                          ) : ''
                        }
                        </Fragment>
                    );
                  })
                }
                <Form.Group className="mb-3">
                  <Button variant="primary" type="submit" onClick={ vaccinationRegisterSubmit }>
                    送出
                  </Button>{' '}
                  <Button variant="danger" type="submit" onClick={ resetInputFields }>
                    清空資料
                  </Button>{' '}
                </Form.Group>

                <ProgressBar variant="secondary" className={ visibleProgressBar } animated now={100} />

                <Form.Group className={ "mb-3 " + visibleText }>
                  <h3 className="text-info">{ responseText }</h3>
                  <h3 className="text-danger">{ errorResponseText }</h3>
                </Form.Group>

              </Form>
            </Route>
        </Switch>
    );
};

export default VaccineRegisterTemplate;
