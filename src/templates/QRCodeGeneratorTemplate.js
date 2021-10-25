import React, { useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import ProgressBar from 'react-bootstrap/ProgressBar';

import QRCodeGenerator from '../QRCodeGenerator.js';


const GenerateHealthQRCode = () => <h2 className="text-info">產生Vaccine QRCode</h2>;

const QRCodeGeneratorTemplate = () => {

    const [errors, setErrors] = useState({});
    const [visibleText, setVisibleText] = useState('invisible');
    const [visibleProgressBar, setVisibleProgressBarText] = useState('invisible');
    const [errorResponse, setErrorResponseText] = useState('');
    const [identifierNumber, setIdentifierNumber] = useState('');
    const [lastOccurrenceDate, setLastOccurrenceDate] = useState('無');
    const [doseVaccineNumber, setDoseVaccineNumber] = useState('0');
    const [qrCodeImage, setQRCodeImage] = useState('');

    const resetInputField = e => {
      e.preventDefault();
      setVisibleText('invisible');
      setErrorResponseText('');
      setIdentifierNumber('');
    };

    const updateVaccineRecordFromFHIR = e => {
        e.preventDefault();
    };

    const handleGeneratingQRCodeSubmit = e => {
        e.preventDefault();
        const newErrors = findHandlingGeneratingQRCodeError();
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          return false;
        }

        QRCodeGenerator.generateQRCode(identifierNumber, setQRCodeImage, setErrorResponseText, setVisibleText, setVisibleProgressBarText, setLastOccurrenceDate, setDoseVaccineNumber);
    };

    const findHandlingGeneratingQRCodeError = () => {
        const newErrors = {};
        if (!identifierNumber || identifierNumber === '') {
          newErrors.identifierNumber = '身份證字號請勿空白！';
        }

        return newErrors;
    };

    return (
      <Switch>
        <Route path="/generate_qrcode">
              <GenerateHealthQRCode />
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>請輸入身份證字號<Form.Label className="text-danger">*</Form.Label></Form.Label>
                  <Form.Control value={ identifierNumber } onChange= { e => setIdentifierNumber(e.target.value) } type="text" placeholder="請輸入身份證字號" isInvalid={ !!errors.identifierNumber }></Form.Control>
                  <Form.Control.Feedback type='invalid'>{ errors.identifierNumber }</Form.Control.Feedback>
                </Form.Group>
              </Form>

              <Form.Group className="mb-3">
                <Button variant="primary" type="submit" onClick={ handleGeneratingQRCodeSubmit }>
                  送出
                </Button>{' '}
                <Button variant="danger" type="submit" onClick={ resetInputField }>
                  清空資料
                </Button>{' '}
              </Form.Group>

              <ProgressBar variant="secondary" className={ visibleProgressBar } animated now={100} />

              <Form.Group className={ "mb-3 " + visibleText }>
                <h3 className="text-danger">{ errorResponse }</h3>
                <h3 className="text-info">疫苗最後接種日期：<span className="text-success">{ lastOccurrenceDate }</span></h3>
                <h3 className="text-info">目前疫苗第幾劑：<span className="text-success">{ doseVaccineNumber }</span></h3>{' '}
                <Image src={ qrCodeImage } thumbnail />
              </Form.Group>
              <Form.Group className={ "mb-3 " + visibleText }>
                <Button variant="primary" type="submit" onClick={ updateVaccineRecordFromFHIR }>
                  更新疫苗資料紀錄
                </Button>{' '}
              </Form.Group>
        </Route>
      </Switch>
  );
};

export default QRCodeGeneratorTemplate;
