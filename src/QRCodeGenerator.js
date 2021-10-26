import Axios from 'axios';


var getDatabaseRecordUrl = '/api/GetDatabaseRecord';
var insertDatabaseRecordUrl = '/api/InsertDatabaseRecord';
var searchPatient = '/api/SearchPatient';
var searchImmunization = '/api/SearchImmunization';
var generateQRCodeUrl = '/api/GenerateQRCode';
var validateQRCodeUrl = '/api/ValidateQRCode';

export async function generateQRCode(setCountdownTime, countdownRef, identifierNumber, setQRCodeImage, setErrorResponseText, setVisibleText, setVisibleProgressBarText, setLastOccurrenceDate, setDoseVaccineNumber, forcedFetch=false) {
    setVisibleProgressBarText('visible');
    let patientExisted = await getPatientResourceByIdentifiedNumber(identifierNumber, setErrorResponseText, setVisibleText);
    if (!patientExisted || patientExisted['total'] === 0) {
        setVisibleProgressBarText('invisible');
        setErrorResponseText('未找到病患註冊資料！');
        setVisibleText('visible');
        return false;
    }
    let patientResource = patientExisted['entry'];
    let checkDatabaseError = null;
    if (forcedFetch === true) {
        checkDatabaseError = false;
    } else {
        checkDatabaseError = await checkDatabaseRecordIsExisted(identifierNumber, setErrorResponseText, setVisibleText);
    }
    let checkImmunizationExisted = false;
    let maxTimestamp = 0;
    let currentTimestamp = 0;
    let immunizationResource = {};
    let immunizationSingleResource = {};
    let diseaseCode = 'U07.1';

    if (!checkDatabaseError) {
        for (let index=0; index<patientResource.length; index++) {
            checkImmunizationExisted = await queryImmunizationByPatientId(patientResource[index]['resource']['id']);
            if (!checkImmunizationExisted) {
                continue;
            }
            immunizationResource = checkImmunizationExisted;
            if (immunizationResource['total'] === 0) {
                continue;
            }
            for (let immunizationIndex=0; immunizationIndex<immunizationResource['entry'].length; immunizationIndex++) {
                if (!immunizationResource['entry'][immunizationIndex]['resource']['protocolApplied']) {
                    continue;
                }
                if (immunizationResource['entry'][immunizationIndex]['resource']['protocolApplied'].length !== 1) {
                    continue;
                }
                if (immunizationResource['entry'][immunizationIndex]['resource']['protocolApplied'][0]['targetDisease'][0]['coding'][0]['code'] !== diseaseCode) {
                    continue;
                }
                currentTimestamp = (new Date(immunizationResource['entry'][immunizationIndex]['resource']['occurrenceDateTime'])).getTime();
                if (currentTimestamp > maxTimestamp) {
                    maxTimestamp = currentTimestamp;
                    immunizationSingleResource = immunizationResource['entry'][immunizationIndex]['resource'];
                }
            }
        }
        if (Object.keys(immunizationSingleResource).length !== 0) {
            await insertImmunizationResourceToDatabase(immunizationSingleResource, identifierNumber);
        }
    }

    if (!checkDatabaseError && Object.keys(immunizationSingleResource).length === 0) {
        setVisibleProgressBarText('invisible');
        setErrorResponseText('產生Vaccine QRCode失敗，尚未找到此身份證字號之疫苗接種資料！');
        setVisibleText('visible');
        setLastOccurrenceDate('無');
        setDoseVaccineNumber('0');
        setCountdownTime(Date.now());
        return false;
    }

    let responseJson = checkDatabaseError;
    getQRCodeImage(countdownRef, identifierNumber, setQRCodeImage, setErrorResponseText, setLastOccurrenceDate, setDoseVaccineNumber, setVisibleProgressBarText, setVisibleText, responseJson);
};

async function getQRCodeImage(countdownRef, identifierNumber, setQRCodeImage, setErrorResponseText, setLastOccurrenceDate, setDoseVaccineNumber, setVisibleProgressBarText, setVisibleText, responseJson={}) {
    let requestPayload = {
        'identifier_number': identifierNumber,
        'ip_address': process.env.REACT_APP_IP_ADDRESS,
    };

    if (Object.keys(responseJson).length !== 0) {
        let base64QRCodeImage = 'data:image/png;base64, ' + responseJson['base64EncodedImage'];
        setVisibleProgressBarText('invisible');
        setVisibleText('visible');
        setQRCodeImage(base64QRCodeImage);
        setErrorResponseText('');
        setLastOccurrenceDate((new Date(Number(responseJson['lastOccurrenceDate']))).toISOString());
        setDoseVaccineNumber(responseJson['DoseNumberPositiveInt']);
        countdownRef.current.start();

        return true;
    }

    Axios.post(process.env.REACT_APP_API_ADDRESS + generateQRCodeUrl, requestPayload).then((response) => {
        let responseJson = response.data;
        let base64QRCodeImage = 'data:image/png;base64, ' + responseJson['base64_encoded_image'];
        setVisibleProgressBarText('invisible');
        setVisibleText('visible');
        setQRCodeImage(base64QRCodeImage);
        setErrorResponseText('');
        setLastOccurrenceDate((new Date(Number(responseJson['last_occurrence_date']))).toISOString());
        setDoseVaccineNumber(responseJson['dose_number_positive_int']);
        countdownRef.current.start();
    }).catch((error) => {
        console.log(error.response);
        setVisibleProgressBarText('invisible');
        setQRCodeImage('images/broken.png');
        setErrorResponseText('產生Vaccine QRCode失敗');
        setLastOccurrenceDate('無');
        setDoseVaccineNumber('0');
    });
};

async function insertImmunizationResourceToDatabase(immunizationSingleResource, identifier_number) {
    let requestPayload = {
        'dose_number_positive_int': immunizationSingleResource['protocolApplied'][0]['doseNumberPositiveInt'],
        'last_occurrence_date': (new Date(immunizationSingleResource['occurrenceDateTime'])).getTime(),
        'identifier_number': String(identifier_number),
        'immunization_id': String(immunizationSingleResource['id']),
    };
    let insertResponse = {};

    insertResponse = await Axios.post(process.env.REACT_APP_API_ADDRESS + insertDatabaseRecordUrl, requestPayload).then((response) => {
        return response.data;
    }).catch((error) => {
        return error.response;
    });

    return insertResponse;
}

async function queryImmunizationByPatientId(patientId) {
    let searchParams = 'patient=' + patientId;
    let requestPayload = {
        'search_params': searchParams,
    };
    let response = await Axios.post(process.env.REACT_APP_API_ADDRESS + searchImmunization, requestPayload).then((response) => {
        return response.data;
    }).catch((error) => {
        console.warn(error.response['message']);
        return false;
    });

    return response;
};

async function checkDatabaseRecordIsExisted(identifierNumber, setErrorResponseText, setVisibleText) {
    let requestPayload = {
        'identifier_number': identifierNumber,
        'ip_address': process.env.REACT_APP_IP_ADDRESS,
    };
    let checkDatabaseError = false;
    checkDatabaseError = await Axios.post(process.env.REACT_APP_API_ADDRESS + getDatabaseRecordUrl, requestPayload).then((response) => {
        return response.data;
    }).catch((error) => {
        setErrorResponseText(error.response['message']);
        setVisibleText('visible');
        return false;
    });

    return checkDatabaseError;
};

async function getPatientResourceByIdentifiedNumber(identifierNumber, setErrorResponseText, setVisibleText) {
    let searchParams = 'identifier=' + identifierNumber;
    let requestPayload = {
        'search_params': searchParams,
    };
    let existed = await Axios.post(process.env.REACT_APP_API_ADDRESS + searchPatient, requestPayload).then((response) => {
        return response.data;
    }).catch((error) => {
        setErrorResponseText('產生Vaccine QRCode失敗，' + error.response['message']);
        setVisibleText('visible');
        return false;
    });

    return existed;
};

async function validateVaccineToken(token) {
    let requestPayload = {
        'token': token,
    };
    let validatedResult = await Axios.post(process.env.REACT_APP_API_ADDRESS + validateQRCodeUrl, requestPayload).then((response) => {
        return response.data;
    }).catch((error) => {
        return error.response;
    });

    return validatedResult;
}

const QRCodeGenerator = {
    generateQRCode,
    validateVaccineToken,
};

export default QRCodeGenerator;
