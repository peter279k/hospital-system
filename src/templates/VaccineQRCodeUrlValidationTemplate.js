import React, { useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';

import QRCodeGenerator from '../QRCodeGenerator.js';


const VaccineQRCodeUrlValidationTemplate = () => {

    const [lineTagText, setLineTagText] = useState('polyline');
    const [lineOrPolyLineText, setLineOrPolyLineText] = useState('path check');
    const [strokeColorText, setStrokeColorText] = useState('#73AF55');
    const [points, setPoints] = useState('100.2,40.2 51.5,88.8 29.8,67.5 ');
    const [message, setMessage] = useState('success');
    const [messageText, setMessageText] = useState('Oh Yeah!');

    const [polyLine1X1, setPolyLine1X1] = useState('0');
    const [polyLine1Y1, setPolyLine1Y1] = useState('0');
    const [polyLine1X2, setPolyLine1X2] = useState('0');
    const [polyLine1Y2, setPolyLine1Y2] = useState('0');

    const [polyLine2X1, setPolyLine2X1] = useState('0');
    const [polyLine2Y1, setPolyLine2Y1] = useState('0');
    const [polyLine2X2, setPolyLine2X2] = useState('0');
    const [polyLine2Y2, setPolyLine2Y2] = useState('0');

    const setErrorLineIcon= (
        setLineTagText,
        setLineOrPolyLineText,
        setStrokeColorText,
        setMessage,
        setMessageText,
        setPoints,
        setPolyLine1X1,
        setPolyLine1Y1,
        setPolyLine1X2,
        setPolyLine1Y2,
        setPolyLine2X1,
        setPolyLine2Y1,
        setPolyLine2X2,
        setPolyLine2Y2,
        message
    ) => {
        setLineTagText('line');
        setLineOrPolyLineText('path line');
        setStrokeColorText('#D06079');
        setMessage('error');
        setMessageText(message);
        setPoints('');

        setPolyLine1X1('34.4');
        setPolyLine1Y1('37.9');
        setPolyLine1X2('95.8');
        setPolyLine1Y2('92.3');

        setPolyLine2X1('95.8');
        setPolyLine2Y1('38');
        setPolyLine2X2('34.4');
        setPolyLine2Y2('92.2');
    };

    useEffect(() => {
        async function validateVaccineToken() {
          let url = new URL(window.location.href);
          let urlParams = url.searchParams;
          let token = urlParams.get('token');
          if (token === null) {
            setErrorLineIcon(
                setLineTagText,
                setLineOrPolyLineText,
                setStrokeColorText,
                setMessage,
                setMessageText,
                setPoints,
                setPolyLine1X1,
                setPolyLine1Y1,
                setPolyLine1X2,
                setPolyLine1Y2,
                setPolyLine2X1,
                setPolyLine2Y1,
                setPolyLine2X2,
                setPolyLine2Y2,
                '驗證Token不存在！'
            );
            return false;
          }
          let validationResult = await QRCodeGenerator.validateVaccineToken(token);

          if (!!validationResult.data && validationResult.data['error']) {
            let errorMessage = validationResult.data['error'];
            if (errorMessage === 'Token is expired.') {
                errorMessage = 'Token已經過期！';
            } else {
                errorMessage = '此Token不合法！';
            }
            setErrorLineIcon(
                setLineTagText,
                setLineOrPolyLineText,
                setStrokeColorText,
                setMessage,
                setMessageText,
                setPoints,
                setPolyLine1X1,
                setPolyLine1Y1,
                setPolyLine1X2,
                setPolyLine1Y2,
                setPolyLine2X1,
                setPolyLine2Y1,
                setPolyLine2X2,
                setPolyLine2Y2,
                errorMessage
            );
          }
        };
        validateVaccineToken();
    }, []);

    return (
      <Switch>
        <Route path="/validate">
            {
                lineTagText === 'polyline' ? (
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                        <circle className="path circle" fill="none" stroke={ strokeColorText } strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1" />
                        <polyline className={ lineOrPolyLineText } fill="none" stroke={ strokeColorText } strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1={ polyLine1X1 } y1={ polyLine1Y1 } x2={ polyLine1X2 } y2={ polyLine1Y2 } points={ points }/>
                        <polyline className={ lineOrPolyLineText } fill="none" stroke={ strokeColorText } strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1={ polyLine2X1 } y1={ polyLine2Y1 } x2={ polyLine2X2 } y2={ polyLine2Y2 } points={ points }/>
                    </svg>
                ) : (
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                        <circle className="path circle" fill="none" stroke={ strokeColorText } strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1" />
                        <line className={ lineOrPolyLineText } fill="none" stroke={ strokeColorText } strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1={ polyLine1X1 } y1={ polyLine1Y1 } x2={ polyLine1X2 } y2={ polyLine1Y2 }/>
                        <line className={ lineOrPolyLineText } fill="none" stroke={ strokeColorText } strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1={ polyLine2X1 } y1={ polyLine2Y1 } x2={ polyLine2X2 } y2={ polyLine2Y2 }/>
                    </svg>
                )
            }
            <p className={ message }>{ messageText }</p>
        </Route>
      </Switch>
  );
};

export default VaccineQRCodeUrlValidationTemplate;
