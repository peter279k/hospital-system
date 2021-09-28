import React from 'react';
import { MemoryRouter, Switch, Route } from 'react-router-dom';

import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import { LinkContainer } from 'react-router-bootstrap';

import './App.css';

const Home = () => <span></span>;

const FirstVisit = () => <h2 className="text-info">病患資料登入</h2>;

const FollowUp = () => <h2>病患資料查詢</h2>;

const [ form, setForm ] = useState({});

const [ errors, setErrors ] = useState({});

const setField = (field, value) => {
  setForm({
    ...form,
    [field]: value,
  });
  if ( !!errors[field] ) setErrors({
    ...errors,
    [field]: null,
  })
};

const App = () => (
  <MemoryRouter>
    <Container className="p-3">
      <Jumbotron>
        <h1 className="header">歡迎來到病患登錄系統</h1>
        <h2>{' '}</h2>
          <ButtonToolbar className="custom-btn-toolbar">
            <LinkContainer to="/">
              <Button>首頁</Button>
            </LinkContainer>
            <LinkContainer to="/first_visit">
              <Button>病患資料登入</Button>
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
            <Form onSubmit={submitForm}>
              <Form.Group className="mb-3" controlId="twIDNumber">
                <Form.Label>請輸入病患身份證字號<Form.Label className="text-danger">*</Form.Label></Form.Label>
                <Form.Control onChange={ e => setField('idNumber', e.target.value) } name="idNumber" type="text" placeholder="輸入身份證字號" isInvalid={ !!errors.name }/>
                <Form.Control.Feedback type='invalid'>
                  { errors.name }
                </Form.Control.Feedback>
                <Form.Text className="text-muted">
                 此為醫事人員專用系統， 請勿任意分享身份證字號給他人
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="twPassportIDNumber">
                <Form.Label>請輸入病患護照號碼</Form.Label>
                <Form.Control name="passportNumber" type="text" placeholder="輸入護照號碼" />
                <Form.Text className="text-muted">
                 此為醫事人員專用系統， 請勿任意分享護照號碼給他人
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formUserName">
                <Form.Label>請輸入病患姓名<Form.Label className="text-danger">*</Form.Label></Form.Label>
                <Form.Control name="patientName" type="text" placeholder="請輸入病患姓名" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formUserENName">
                <Form.Label>請輸入病患英文姓名</Form.Label>
                <Form.Control name="patientEnName" type="text" placeholder="請輸入病患英文姓名" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formUserENName">
                <Form.Label>請輸入病患性別<Form.Label className="text-danger">*</Form.Label></Form.Label>
                <Form.Control name="patientSex" as="select" custom>
                  <option>請選擇病患性別</option>
                  <option value="male">男</option>
                  <option value="female">女</option>
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formUserBirthDate">
                <Form.Label>請選擇病患出生日期<Form.Label className="text-danger">*</Form.Label></Form.Label>
                <Form.Control name="patientBirthDate" type="date" placeholder="請選擇病患出生日期" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formUserAddress">
                <Form.Label>請輸入病患住家地址<Form.Label className="text-danger">*</Form.Label></Form.Label>
                <Form.Control name="patientHomeAddress" type="text" placeholder="請輸入病患住家地址" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formUserPhone">
                <Form.Label>請輸入病患聯絡手機<Form.Label className="text-danger">*</Form.Label></Form.Label>
                <Form.Control name="patientPhoneNumber" type="text" placeholder="請輸入病患聯絡手機" />
              </Form.Group>

              <Button variant="primary" type="submit">
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

const findFormErrors = () => {
  const { name, food, rating, comment } = form
  const newErrors = {}
  // name errors
  if ( !name || name === '' ) newErrors.name = 'cannot be blank!'
  else if ( name.length > 30 ) newErrors.name = 'name is too long!'
  // food errors
  if ( !food || food === '' ) newErrors.food = 'select a food!'
  // rating errors
  if ( !rating || rating > 5 || rating < 1 ) newErrors.rating = 'must assign a rating between 1 and 5!'
  // comment errors
  if ( !comment || comment === '' ) newErrors.comment = 'cannot be blank!'
  else if ( comment.length > 100 ) newErrors.comment = 'comment is too long!'

  return newErrors
}

function submitForm(e) {
  e.preventDefault();
  const newErrors = findFormErrors();
  // Conditional logic:
  if ( Object.keys(newErrors).length > 0 ) {
    setErrors(newErrors);
  } else {
    alert('Thank you for your feedback!')
  }
}

export default App;
