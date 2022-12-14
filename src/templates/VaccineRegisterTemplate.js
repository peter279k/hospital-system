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
        newErrors.vaccinePersonName = '???????????????????????????';
      }
      if (!identityNumber || identityNumber === '') {
        newErrors.identityNumber = '??????????????????/?????????/???????????????';
      }

      let doseManufactureName = '';
      let doseNumber = 0;
      for (let index=0; index<doseInputList.length; index++) {
        doseManufactureName = doseInputList[index].doseManufactureName;
        doseNumber = Number(doseInputList[index].doseNumber);
        if (!doseManufactureName || doseManufactureName === '') {
          doseManufactureNames[index] = '?????????COVID-19??????????????????/?????????';
        }
        if (!doseNumber || doseNumber === 0) {
          doseNumbers[index] = '?????????COVID-19????????????';
        }
        if (isNaN(doseNumber) || String(doseNumber).includes('.')) {
          doseNumbers[index] = '??????????????????COVID-19???????????????';
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
              <h2 className="text-info">??????????????????</h2>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>?????????????????????<Form.Label className="text-danger">*</Form.Label></Form.Label>
                  <Form.Control value={ vaccinePersonName } onChange={ e => setVaccinePersonName(e.target.value) } type="text" placeholder="?????????????????????" isInvalid={ !!errors.vaccinePersonName }/>
                  <Form.Control.Feedback type='invalid'>{ errors.vaccinePersonName }</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>????????????????????????????????????</Form.Label>
                  <Form.Control value={ vaccinePersonEnLastName } onChange={ e => setVaccinePersonEnLastName(e.target.value) } type="text" placeholder="?????????Last name" isInvalid={ !!errors.vaccinePersonEnLastName }/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>????????????????????????????????????</Form.Label>
                  <Form.Control value={ vaccinePersonEnFirstName } onChange={ e => setVaccinePersonEnFirstName(e.target.value) } type="text" placeholder="?????????First name" isInvalid={ !!errors.vaccinePersonEnFirstName }/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>???????????????</Form.Label>
                    <Form.Control value={ countryName } onChange={ e => setCountryName(e.target.value) } type="text" placeholder="???????????????" isInvalid={ !!errors.countryName }/>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>??????????????????/?????????/????????????<Form.Label className="text-danger">*</Form.Label></Form.Label>
                    <Form.Control value={ identityNumber } onChange={ e => setIdentityNumber(e.target.value) } type="text" placeholder="??????????????????/?????????/????????????" isInvalid={ !!errors.identityNumber }/>
                    <Form.Control.Feedback type='invalid'>{ errors.identityNumber }</Form.Control.Feedback>
                </Form.Group>
                {
                  doseInputList.map((doseInfo, index) => {
                    return (
                        <Fragment key={ index }>
                        <Form.Group className="mb-3">
                          <Form.Label>?????????COVID-19????????????/??????<Form.Label className="text-danger">*</Form.Label></Form.Label>
                            <Form.Control name="doseManufactureName" value={ doseInfo.doseManufactureName } onChange={ e => handleInputChange(index, e) } type="text" placeholder="?????????COVID-19?????????????????????/??????" isInvalid={ !!errors.doseManufactureName }/>
                            <Form.Control.Feedback type='invalid'>{ (Object.values(errors).length !== 0 && Object.keys(errors).includes('doseManufactureName') && errors.doseManufactureName[index] !== undefined) ? errors.doseManufactureName[index] : null }</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>?????????COVID-19???????????????<Form.Label className="text-danger">*</Form.Label></Form.Label>
                            <Form.Control name="doseNumber" value={ doseInfo.doseNumber } onChange={ e => handleInputChange(index, e) } type="text" placeholder="?????????COVID-19???????????????" isInvalid={ !!errors.doseNumber }/>
                            <Form.Control.Feedback type='invalid'>{ (Object.values(errors).length !== 0 && Object.keys(errors).includes('doseNumber') && errors.doseNumber[index] !== undefined) ? errors.doseNumber[index] : null }</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                          <Form.Label>?????????COVID-19?????????????????????<Form.Label className="text-danger">*</Form.Label></Form.Label>
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
                              ??????COVID-19????????????
                            </Button>{' '}
                            <Button variant="danger" type="button" onClick={ () => removeDoseInfo(index) }>
                              ??????COVID-19????????????
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
                    ??????
                  </Button>{' '}
                  <Button variant="danger" type="submit" onClick={ resetInputFields }>
                    ????????????
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
