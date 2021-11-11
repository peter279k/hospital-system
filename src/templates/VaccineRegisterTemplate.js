import React, { useState, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import DatePicker from "react-datepicker";
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';

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
    const [doseInputList, setDoseInputList] = useState([{ doseManufactureName: '', vaccinateDate: (new Date()) }]);

    const addDoseInfo = e => {
      e.preventDefault();
      const values = [...doseInputList];
      values.push({ doseManufactureName: '', vaccinateDate: (new Date()) });

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

      let form = {
        'vaccinePersonName': vaccinePersonName,
        'vaccinePersonEnFirstName': vaccinePersonEnFirstName,
        'vaccinePersonEnLastName': vaccinePersonEnLastName,
        'countryName': countryName,
        'identityNumber': identityNumber,
        'doseInputList': doseInputList,
      };

      VaccineRegister.vaccineRegisterSubmit(form, setVisibleText, setVisibleProgressBarText, setResponseText, setErrorResponseText);
    };

    const findVaccineRegisterErrors = () => {
      const newErrors = {
        doseManufactureName: [],
      };

      if (!vaccinePersonName || vaccinePersonName === '') {
        newErrors.vaccinePersonName = '中文姓名不可空白！';
      }
      if (!identityNumber || identityNumber === '') {
        newErrors.identityNumber = '請輸入身份證/居留證/護照號碼！';
      }

      let doseManufactureName = '';
      for (let index=0; index<doseInputList.length; index++) {
        doseManufactureName = doseInputList[index].doseManufactureName;
        if (!doseManufactureName || doseManufactureName === '') {
          newErrors.doseManufactureName.push('請輸入COVID-19疫苗第' + (index + 1) + '劑廠牌/品名！');
        }
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
      setDoseInputList([{ doseManufactureName: '', vaccinateDate: (new Date()) }]);
    };

    const handleInputChange = (index, event) => {
      let values = [...doseInputList];
      if (!!event.target && event.target.name === 'doseManufactureName') {
        values[index].doseManufactureName = event.target.value;
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
                          <Form.Label>請輸入COVID-19疫苗第{ (index + 1) }劑廠牌/品名<Form.Label className="text-danger">*</Form.Label></Form.Label>
                            <Form.Control name="doseManufactureName" value={ doseInfo.doseManufactureName } onChange={ e => handleInputChange(index, e) } type="text" placeholder={ "請輸入COVID-19疫苗第"+ (index + 1) + "劑廠牌/品名" } isInvalid={ !!errors.doseManufactureName }/>
                            <Form.Control.Feedback type='invalid'>{ (Object.values(errors).length !== 0 && errors.doseManufactureName.length !== 0) ? errors.doseManufactureName[index] : '' }</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>請選擇COVID-19疫苗第{ index + 1 }劑接種日期<Form.Label className="text-danger">*</Form.Label></Form.Label>
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
