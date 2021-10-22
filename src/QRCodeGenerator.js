import Axios from 'axios';


var getDatabaseRecordUrl = 'http://localhost:8000/api/GetDatabaseRecord';
var insertDatabaseRecordUrl = 'http://localhost:8000/api/InsertDatabaseRecord';
var searchPatient = 'http://localhost:8000/api/SearchPatient';
var searchImmunization = 'http://localhost:8000/api/SearchImmunization';
var generateQRCodeUrl = 'http://localhost:8000/api/GenerateQRCode';


export async function generateQRCode(identifierNumber, setQRCodeImage, setErrorResponseText, setVisibleText, setVisibleProgressBarText, setLastOccurrenceDate, setDoseVaccineNumber) {
    setVisibleProgressBarText('visible');
    let patientExisted = await getPatientResourceByIdentifiedNumber(identifierNumber, setErrorResponseText, setVisibleText);
    if (!patientExisted) {
        setVisibleProgressBarText('invisible');
        setErrorResponseText('未找到病患註冊資料！');
        setVisibleText('visible');
        return false;
    }
    let patientResource = patientExisted['entry'];
    let checkDatabaseError = await checkDatabaseRecordIsExisted(identifierNumber, setErrorResponseText, setVisibleText);
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
        setErrorResponseText('產生健康通行碼QRCode失敗，尚未找到此身份證字號之疫苗接種資料！');
        setVisibleText('visible');
        setLastOccurrenceDate('無');
        setDoseVaccineNumber('0');
        return false;
    }

    let responseJson = checkDatabaseError;
    getQRCodeImage(identifierNumber, setQRCodeImage, setErrorResponseText, setLastOccurrenceDate, setDoseVaccineNumber, setVisibleProgressBarText, setVisibleText, responseJson);
};

async function getQRCodeImage(identifierNumber, setQRCodeImage, setErrorResponseText, setLastOccurrenceDate, setDoseVaccineNumber, setVisibleProgressBarText, setVisibleText, responseJson={}) {
    let requestPayload = {
        'identifier_number': identifierNumber,
    };

    if (Object.keys(responseJson).length !== 0) {
        let base64QRCodeImage = 'data:image/png;base64, ' + responseJson['base64EncodedImage'];
        setVisibleProgressBarText('invisible');
        setVisibleText('visible');
        setQRCodeImage(base64QRCodeImage);
        setErrorResponseText('');
        setLastOccurrenceDate((new Date(Number(responseJson['lastOccurrenceDate']))).toISOString());
        setDoseVaccineNumber(responseJson['DoseNumberPositiveInt']);

        return true;
    }

    Axios.post(generateQRCodeUrl, requestPayload).then((response) => {
        let responseJson = response.data;
        let base64QRCodeImage = 'data:image/png;base64, ' + responseJson['base64_encoded_image'];
        setVisibleProgressBarText('invisible');
        setVisibleText('visible');
        setQRCodeImage(base64QRCodeImage);
        setErrorResponseText('');
        setLastOccurrenceDate((new Date(Number(responseJson['last_occurrence_date']))).toISOString());
        setDoseVaccineNumber(responseJson['dose_number_positive_int']);
    }).catch((error) => {
        console.log(error.response);
        setVisibleProgressBarText('invisible');
        setQRCodeImage('images/broken.png');
        setErrorResponseText('產生健康通行碼QRCode失敗');
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

    insertResponse = await Axios.post(insertDatabaseRecordUrl, requestPayload).then((response) => {
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
    let response = await Axios.post(searchImmunization, requestPayload).then((response) => {
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
    };
    let checkDatabaseError = false;
    checkDatabaseError = await Axios.post(getDatabaseRecordUrl, requestPayload).then((response) => {
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
    let existed = await Axios.post(searchPatient, requestPayload).then((response) => {
        return response.data;
    }).catch((error) => {
        setErrorResponseText('健康通行碼QRCode產生失敗，' + error.response['message']);
        setVisibleText('visible');
        return false;
    });

    return existed;
};

const QRCodeGenerator = {
    generateQRCode,
};

export default QRCodeGenerator;
