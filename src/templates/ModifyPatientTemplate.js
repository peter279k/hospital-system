import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import DatePicker from "react-datepicker";
import Button from 'react-bootstrap/Button';

import HttpRequest from '../HttpRequest.js';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';


const ModifyPatient = () => <h2 className="text-info">修改病患資料</h2>;

const ModifyPatientTemplate = () => {

    const [visibleText, setVisibleText] = useState('invisible');
    const [errors, setErrors] = useState({});
    const [startDate, setStartDate] = useState(new Date());
    const [jsonResponse, setJsonResponseText] = useState('');
    const [errorResponse, setErrorResponseText] = useState('');

    const [patientResourceId, setPatientResourceId] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [passportNumber, setPassportNumber] = useState('');
    const [patientName, setPatientName] = useState('');
    const [patientEnName, setPatientEnName] = useState('');
    const [patientSex, setPatientSex] = useState('');
    const [patientHomeAddress, setPatientHomeAddress] = useState('');
    const [patientPhoneNumber, setPatientPhoneNumber] = useState('');

    const checkIdNumber = (idNumber) => {
        if (idNumber.length !== 10) {
          return '身份證字號應為10碼！';
        }
        let mappedAlphabetsNumbers = {
          'A': 10,
          'B': 11,
          'C': 12,
          'D': 13,
          'E': 14,
          'F': 15,
          'G': 16,
          'H': 17,
          'I': 34,
          'J': 18,
          'K': 19,
          'L': 20,
          'M': 21,
          'N': 22,
          'O': 35,
          'P': 23,
          'Q': 24,
          'R': 25,
          'S': 26,
          'T': 27,
          'U': 28,
          'V': 29,
          'W': 32,
          'X': 30,
          'Y': 31,
          'Z': 33,
        };
        let errorMessage = '身份證字號格式錯誤！';
        if (!Object.keys(mappedAlphabetsNumbers).includes(idNumber[0])) {
          return '身份證字號第一碼應為英文大寫數字！';
        }
        if (idNumber[1] !== '1' && idNumber[1] !== '2') {
          return '身份證字號第二碼應為1或2！';
        }
        let re = /\d+/;
        let subNumericString = idNumber.substring(1);
        let regRes = re.exec(subNumericString);
        if (regRes[0] !== regRes['input']) {
          return errorMessage;
        }
        let alphabetNumStr = String(mappedAlphabetsNumbers[idNumber[0]]);
        let checkNumber = 1 * Number(alphabetNumStr[0]) +
            9 * Number(alphabetNumStr[1]) +
            8 * Number(idNumber[1]) +
            7 * Number(idNumber[2]) +
            6 * Number(idNumber[3]) +
            5 * Number(idNumber[4]) +
            4 * Number(idNumber[5]) +
            3 * Number(idNumber[6]) +
            2 * Number(idNumber[7]) +
            1 * Number(idNumber[8]) +
            1 * Number(idNumber[9]);

        return (checkNumber % 10 === 0) ? '' : errorMessage;
    };

    const handleModifiedPatientSubmit = e => {
        e.preventDefault();
        const newErrors = findModifiedPatientFormErrors();
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return false;
        }
        let form = {
          'patientResourceId': patientResourceId,
          'idNumber': idNumber,
          'passportNumber': passportNumber,
          'patientName': patientName,
          'patientEnName': patientEnName,
          'patientSex': patientSex,
          'patientHomeAddress': patientHomeAddress,
          'patientPhoneNumber': patientPhoneNumber,
        };

        HttpRequest.modifyPatientData(form, startDate, setJsonResponseText, setErrorResponseText, setVisibleText);
    };

    const resetInputFields = e => {
        e.preventDefault();
        setPatientResourceId('');
        setIdNumber('');
        setPassportNumber('');
        setPatientName('');
        setPatientEnName('');
        setPatientSex('');
        setPatientHomeAddress('');
        setPatientPhoneNumber('');
        setStartDate(new Date());
    };

    const handleLoadingPatientData = e => {
        e.preventDefault();
        const newErrors = findLoadingPatientDataError();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }
        let fieldStates = {
            'idNumber': setIdNumber,
            'passportNumber': setPassportNumber,
            'patientName': setPatientName,
            'patientEnName': setPatientEnName,
            'patientSex': setPatientSex,
            'patientHomeAddress': setPatientHomeAddress,
            'patientPhoneNumber': setPatientPhoneNumber,
            'errors': setErrors,
        };
        let form = {
          'patientResourceId': patientResourceId,
        };

        HttpRequest.sendPatientQueryDataJsonString(form, fieldStates);
    };

    const findLoadingPatientDataError = () => {
        console.log(idNumber);
        const newErrors = {};
        if (!patientResourceId || patientResourceId === '') {
            newErrors.patientResourceId = 'Patient resource id不可空白！';
        }
        return newErrors;
    };

    const findModifiedPatientFormErrors = () => {
          const newErrors = {};
          if (!idNumber || idNumber === '') {
            newErrors.idNumber = '身份證字號請勿空白！';
          }
          let validateIdNumberRes = '';
          if (!!idNumber) {
            validateIdNumberRes = checkIdNumber(idNumber);
          }
          if (validateIdNumberRes !== '') {
            newErrors.idNumber = validateIdNumberRes;
          }
          if (!!passportNumber) {
            if (passportNumber.length !== 9) {
              newErrors.passportNumber = '護照號碼長度應為9！';
            }
            let pattern = /(\d+)/g;
            let validationRes = passportNumber.match(pattern);
            if (validationRes === null || validationRes.length !== 1 || validationRes[0] !== passportNumber) {
              newErrors.passportNumber = '護照號碼應只有數字！';
            }
          }
          if (!patientName || patientName === '') {
            newErrors.patientName = '病患姓名請勿空白！';
          }
          if (!patientEnName || patientEnName === '') {
            newErrors.patientEnName = '病患英文姓名請勿空白！';
          }
          if (!patientSex || patientSex === '') {
            newErrors.patientSex = '請選擇病患性別！';
          }
          if (!!patientSex) {
            if (patientSex !== 'male' && patientSex !== 'female') {
              newErrors.patientSex = '請選擇病患男性或女性！';
            }
          }
          if (!patientHomeAddress || patientHomeAddress === '') {
            newErrors.patientHomeAddress = '病患住家地址不可空白！';
          }
          if (!patientPhoneNumber || patientPhoneNumber === '') {
            newErrors.patientPhoneNumber = '病患手機號碼不可空白！';
          }

          return newErrors;
    };

    return (
        <Switch>
        <Route path="/modify_patient">
            <ModifyPatient />{' '}
            <Button onClick={ handleLoadingPatientData } variant="success" type="submit">載入資料</Button>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>請輸入Patient resource id<Form.Label className="text-danger">*</Form.Label></Form.Label>
                <Form.Control value={ patientResourceId } onChange={ e => setPatientResourceId(e.target.value) } type="text" placeholder="輸入Patient resource id" isInvalid={ !!errors.patientResourceId }/>
                <Form.Control.Feedback type='invalid'>{ errors.patientResourceId }</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>請輸入病患身份證字號<Form.Label className="text-danger">*</Form.Label></Form.Label>
                <Form.Control value={ idNumber } onChange={ e => setIdNumber(e.target.value) } type="text" placeholder="輸入身份證字號" isInvalid={ !!errors.idNumber }/>
                <Form.Control.Feedback type='invalid'>{ errors.idNumber }</Form.Control.Feedback>
                <Form.Text className="text-info">
                 此為醫事人員專用系統， 請勿任意分享身份證字號給他人
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>請輸入病患護照號碼</Form.Label>
                <Form.Control value={ passportNumber } onChange={ e => setPassportNumber(e.target.value) } type="text" placeholder="輸入護照號碼" isInvalid={ !!errors.passportNumber }/>
                <Form.Control.Feedback type='invalid'>{ errors.passportNumber }</Form.Control.Feedback>
                <Form.Text className="text-info">
                 此為醫事人員專用系統， 請勿任意分享護照號碼給他人
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>請輸入病患姓名<Form.Label className="text-danger">*</Form.Label></Form.Label>
                <Form.Control value={ patientName } onChange={ e => setPatientName(e.target.value) } type="text" placeholder="請輸入病患姓名" isInvalid={ !!errors.patientName }/>
                <Form.Control.Feedback type='invalid'>{ errors.patientName }</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>請輸入病患英文姓名<Form.Label className="text-danger">*</Form.Label></Form.Label>
                <Form.Control value={ patientEnName } onChange={ e => setPatientEnName(e.target.value) } type="text" placeholder="請輸入病患英文姓名" isInvalid={ !!errors.patientEnName }/>
                <Form.Control.Feedback type='invalid'>{ errors.patientEnName }</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>請輸入病患性別<Form.Label className="text-danger">*</Form.Label></Form.Label>
                <Form.Control value={ patientSex } onChange={ e => setPatientSex(e.target.value) } as="select" custom isInvalid={ !!errors.patientSex }>
                  <option>請選擇病患性別</option>
                  <option value="male">男</option>
                  <option value="female">女</option>
                </Form.Control>
                <Form.Control.Feedback type='invalid'>{ errors.patientSex }</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>請選擇病患出生日期<Form.Label className="text-danger">*</Form.Label></Form.Label>
                <DatePicker
                  className="form-control"
                  dateFormat="yyyy/MM/dd"
                  selected={startDate}
                  onChange={ (date) => setStartDate(date) }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>請輸入病患住家地址<Form.Label className="text-danger">*</Form.Label></Form.Label>
                <Form.Control value={ patientHomeAddress } onChange={ e => setPatientHomeAddress(e.target.value) } type="text" placeholder="請輸入病患住家地址" isInvalid={ !!errors.patientHomeAddress }/>
                <Form.Control.Feedback type='invalid'>{ errors.patientHomeAddress }</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>請輸入病患聯絡手機<Form.Label className="text-danger">*</Form.Label></Form.Label>
                <Form.Control value={patientPhoneNumber} onChange={ e => setPatientPhoneNumber(e.target.value) } type="text" placeholder="請輸入病患聯絡手機" isInvalid={ !!errors.patientPhoneNumber }/>
                <Form.Control.Feedback type='invalid'>{ errors.patientPhoneNumber }</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Button variant="primary" type="submit" onClick={ handleModifiedPatientSubmit }>
                  送出
                </Button>{' '}
                <Button variant="danger" type="submit" onClick={ resetInputFields }>
                  清空資料
                </Button>{' '}
              </Form.Group>

              <Form.Group className={ "mb-3 " + visibleText }>
                <h3 className="text-info">{ errorResponse }</h3>
                <SyntaxHighlighter language="json" style={ dark }>
                  { jsonResponse }
                </SyntaxHighlighter>
              </Form.Group>

            </Form>
        </Route>
        </Switch>
    );
};

export default ModifyPatientTemplate;
