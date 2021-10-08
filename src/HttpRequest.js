import Axios from 'axios';
import base64 from 'base-64';
import utf8 from 'utf8';


var fhirServer = 'http://localhost:8000/api/fhir_server';
var createPatient = 'http://localhost:8000/api/CreatePatient';


export function sendPatientData(form, startDate, setJsonResponseText, setVisibleText) {
    let year = String(startDate.getFullYear());
    let month = String(startDate.getMonth() + 1);
    let day = String(startDate.getDate());
    if (month.length === 1) {
        month = '0' + month;
    }
    if (day.length === 1) {
        day = '0' + day;
    }
    let birthDate = year + '-' + month + '-' + day;

    let patientEnName = form.patientEnName;
    let patientEnNameInfo = patientEnName.split(' ');
    let jsonPayload = {
        'resourceType': 'Patient',
        'identifier': [
            {
                'system': 'https://www.dicom.org.tw/cs/identityCardNumber_tw',
                'value': form.idNumber,
            },
        ],
        'name': [
            {
                'text': form.patientName,
                'family': form.patientName[0],
                'given': [form.patientName.substring(1)],
            },
            {
                'text': patientEnName,
                'family': patientEnNameInfo[patientEnNameInfo.length-1],
                'given': [
                    patientEnNameInfo.slice(0, patientEnNameInfo.length-1).join(' '),
                ],
            },
        ],
        'gender': form.patientSex,
        'birthDate': birthDate,
        'address': [
            {
                'use': 'home',
                'text': form.patientHomeAddress,
            },
            {
                'country': 'TW',
            },
        ],
        'telecom': [
            {
                'use': 'home',
                'system': 'phone',
                'value': form.patientPhoneNumber,
            }
        ],
    };

    if (form.passportNumber) {
        jsonPayload['identifier'].push({
            'system': 'https://www.dicom.org.tw/cs/identityCardNumber_tw',
            'value': form.passportNumber,
        });
    }

    let encodedJsonString = base64.encode(utf8.encode(JSON.stringify(jsonPayload)));
    let requestPayload = {
        'json_payload': encodedJsonString,
    };

    Axios.post(createPatient, requestPayload).then((response) => {
        let responseJsonString = JSON.stringify(response.data, null, 2);
        setJsonResponseText(responseJsonString);
        setVisibleText('visible');
    }).catch((error) => {
        setJsonResponseText(error);
    });
};

export function sendPatientQueryData(form, startDate, setJsonResponseText) {
    let year = String(startDate.getFullYear());
    let month = String(startDate.getMonth() + 1);
    let day = String(startDate.getDate());
    if (month.length === 1) {
        month = '0' + month;
    }
    if (day.length === 1) {
        day = '0' + day;
    }
    let birthDate = year + '-' + month + '-' + day;
    let patientIdOrName = form.patientIdOrName;

    Axios.post(queryPatient, requestPayload).then((response) => {
        let responseJsonString = JSON.stringify(response.data, null, 2);
        setJsonResponseText(responseJsonString);
        setVisibleText('visible');
    }).catch((error) => {
        setJsonResponseText(error);
    });
};

export function sendFHIRServerData(setVisibleText, setJsonResponseText, apiEndpoint) {
    let requestPayload = {
        'fhir_server': apiEndpoint,
    };
    Axios.post(fhirServer, requestPayload).then((response) => {
        let responseJsonString = JSON.stringify(response.data, null, 2);
        setJsonResponseText(responseJsonString);
        setVisibleText('visible');
    }).catch((error) => {
        setJsonResponseText(error);
    });
}

const HttpRequest = {
    sendPatientData,
    sendFHIRServerData,
};
export default HttpRequest;
