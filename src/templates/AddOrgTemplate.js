import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ProgressBar from 'react-bootstrap/ProgressBar';

import HttpRequest from '../HttpRequest.js';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';


const AddOrganization = () => <h2 className="text-info">新增醫事單位</h2>;

const AddOrgTemplate = () => {

    const [errors, setErrors] = useState({});
    const [visibleText, setVisibleText] = useState('invisible');
    const [visibleProgressBar, setVisibleProgressBarText] = useState('invisible');
    const [jsonResponse, setJsonResponseText] = useState('');
    const [errorResponse, setErrorResponseText] = useState('');
    const [medId, setMedId] = useState('');
    const [hospitalLists, setHospitalLists] = useState([]);

    useEffect(() => {
      HttpRequest.getHospitalLists(setHospitalLists, setMedId);
    }, []);

    const resetInputField = e => {
      e.preventDefault();
      setMedId('');
      setVisibleText('invisible');
      setErrorResponseText('');
      setJsonResponseText('');
    };

    const handleAddingOrgSubmit = e => {
        e.preventDefault();
        const newErrors = findHandleAddingOrgError();
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return false;
        }

        HttpRequest.sendOrgData(medId, hospitalLists, setJsonResponseText, setErrorResponseText, setVisibleText, setVisibleProgressBarText);
    };

    const findHandleAddingOrgError = () => {
        const newErrors = {};
        if (!medId || medId === '') {
          newErrors.medId = '醫事代碼請勿空白！';
        }

        return newErrors;
    };

    return (
      <Switch>
        <Route path="/add_organization">
              <AddOrganization />
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>選擇的醫事代碼為：<h3 className="text-info">{ medId }</h3></Form.Label>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>請選擇醫事單位名稱<Form.Label className="text-danger">*</Form.Label></Form.Label>
                  <Form.Control value={ medId } onChange= { e => setMedId(e.target.value) } as="select" custom placeholder="請輸入醫事單位名稱" isInvalid={ !!errors.medId }>
                    {
                      hospitalLists.map((hospitalList) => {
                        return <option key={ hospitalList.id } value={ hospitalList.number }>{ hospitalList.name }</option>
                      })
                    }
                  </Form.Control>
                  <Form.Control.Feedback type='invalid'>{ errors.medId }</Form.Control.Feedback>
                </Form.Group>
              </Form>

              <Form.Group className="mb-3">
                <Button variant="primary" type="submit" onClick={ handleAddingOrgSubmit }>
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

export default AddOrgTemplate;
