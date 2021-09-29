import React, { useState } from 'react';
import { MemoryRouter, Switch, Route } from 'react-router-dom';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import { LinkContainer } from 'react-router-bootstrap';

import './App.css';

const Home = () => <span></span>;

const FirstVisit = () => <h2 className="text-info">病患資料登錄</h2>;

const FollowUp = () => <h2>病患資料查詢</h2>;

const App = () => {

  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

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

  const handleSubmit = e => {
    e.preventDefault();
    const newErrors = findFormErrors();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    console.log('Done for filling form!');
  };

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
    let digits = '0123456789';
    if (!Object.keys(mappedAlphabetsNumbers).includes(idNumber[0])) {
      return '身份證字號格式錯誤！';
    }
    if (idNumber[1] !== '1' && idNumber[1] !== '2') {
      return '身份證字號格式錯誤！';
    }
    if (!digits.includes(idNumber[2])) {
      return '身份證字號格式錯誤！';
    }
  };

  const findFormErrors = () => {
    const {
      idNumber,
      passportNumber,
      patientName,
      patientEnName,
      patientSex,
      patientBirthDate,
      patientHomeAddress,
      patientPhoneNumber,
    } = form;
    const newErrors = {};
    if (!idNumber || idNumber === '') {
      newErrors.idNumber = '身份證字號請勿空白！';
    }
    let validateIdNumberRes = checkIdNumber(idNumber);
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
    if (!patientBirthDate || patientBirthDate === '') {
      newErrors.patientBirthDate = '請選擇病患出生日期！';
    }
    if (!patientHomeAddress || patientHomeAddress === '') {
      newErrors.patientHomeAddress = '病患住家地址不可空白！';
    }
    if (!patientPhoneNumber || patientPhoneNumber === '') {
      newErrors.patientPhoneNumber = '病患手機號碼不可空白！';
    }

    return newErrors;
  }

  return (
  <MemoryRouter>
    <Container className="p-3">
      <Jumbotron>
        <h1 className="header">歡迎來到醫院院內系統</h1>
        <h2>{' '}</h2>
          <ButtonToolbar className="custom-btn-toolbar">
            <LinkContainer to="/">
              <Button>首頁</Button>
            </LinkContainer>
            <LinkContainer to="/first_visit">
              <Button>病患資料登錄</Button>
            </LinkContainer>
            <LinkContainer to="/follow_up">
              <Button>病患資料查詢</Button>
            </LinkContainer>
            <LinkContainer to="/organization">
              <Button variant="secondary">醫事單位管理</Button>
            </LinkContainer>
          </ButtonToolbar>
      </Jumbotron>
    </Container>
    <Container className="p-3">
      <h2>{' '}</h2>
          <Switch>
            <Route path="/first_visit">
            <FirstVisit />
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>請輸入病患身份證字號<Form.Label className="text-danger">*</Form.Label></Form.Label>
                <Form.Control onChange={ e => setField('idNumber', e.target.value) } type="text" placeholder="輸入身份證字號" isInvalid={ !!errors.idNumber }/>
                <Form.Control.Feedback type='invalid'>{ errors.idNumber }</Form.Control.Feedback>
                <Form.Text className="text-warning">
                 此為醫事人員專用系統， 請勿任意分享身份證字號給他人
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>請輸入病患護照號碼</Form.Label>
                <Form.Control onChange={ e => setField('passportNumber', e.target.value) } type="text" placeholder="輸入護照號碼" isInvalid={ !!errors.passportNumber }/>
                <Form.Control.Feedback type='invalid'>{ errors.passportNumber }</Form.Control.Feedback>
                <Form.Text className="text-warning">
                 此為醫事人員專用系統， 請勿任意分享護照號碼給他人
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>請輸入病患姓名<Form.Label className="text-danger">*</Form.Label></Form.Label>
                <Form.Control onChange={ e => setField('patientName', e.target.value) } type="text" placeholder="請輸入病患姓名" isInvalid={ !!errors.patientName }/>
                <Form.Control.Feedback type='invalid'>{ errors.patientName }</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>請輸入病患英文姓名</Form.Label>
                <Form.Control onChange={ e => setField('patientEnName', e.target.value) } type="text" placeholder="請輸入病患英文姓名" isInvalid={ !!errors.patientEnName }/>
                <Form.Control.Feedback type='invalid'>{ errors.patientEnName }</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>請輸入病患性別<Form.Label className="text-danger">*</Form.Label></Form.Label>
                <Form.Control onChange={ e => setField('patientSex', e.target.value) } as="select" custom isInvalid={ !!errors.patientSex }>
                  <option>請選擇病患性別</option>
                  <option value="male">男</option>
                  <option value="female">女</option>
                </Form.Control>
                <Form.Control.Feedback type='invalid'>{ errors.patientSex }</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>請選擇病患出生日期<Form.Label className="text-danger">*</Form.Label></Form.Label>
                <Form.Control onChange={ e => setField('patientBirthDate', e.target.value) } type="date" placeholder="請選擇病患出生日期" isInvalid={ !!errors.patientBirthDate }/>
                <Form.Control.Feedback type='invalid'>{ errors.patientBirthDate }</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>請輸入病患住家地址<Form.Label className="text-danger">*</Form.Label></Form.Label>
                <Form.Control onChange={ e => setField('patientHomeAddress', e.target.value) } type="text" placeholder="請輸入病患住家地址" isInvalid={ !!errors.patientHomeAddress } />
                <Form.Control.Feedback type='invalid'>{ errors.patientHomeAddress }</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>請輸入病患聯絡手機<Form.Label className="text-danger">*</Form.Label></Form.Label>
                <Form.Control onChange={ e => setField('patientPhoneNumber', e.target.value) } type="text" placeholder="請輸入病患聯絡手機" isInvalid= { !!errors.patientPhoneNumber }/>
                <Form.Control.Feedback type='invalid'>{ errors.patientPhoneNumber }</Form.Control.Feedback>
              </Form.Group>

              <Button variant="primary" type="submit" onClick={ handleSubmit }>
                送出
              </Button>
            </Form>
            </Route>
            <Route path="/follow_up">
              <FollowUp />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
    </Container>
  </MemoryRouter>
  );
};

export default App;
