import Axios from 'axios';
import base64 from 'base-64';
import utf8 from 'utf8';


var fhirServer = 'http://localhost:8000/api/fhir_server';
var createPatient = 'http://localhost:8000/api/CreatePatient';
var queryPatient = 'http://localhost:8000/api/QueryPatient';
var searchPatient = 'http://localhost:8000/api/SearchPatient';
var updatePatient = 'http://localhost:8000/api/UpdatePatient';
var deletePatient = 'http://localhost:8000/api/DeletePatient';


export function sendPatientData(form, startDate, setJsonResponseText, setErrorResponseText, setVisibleText) {
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
        setErrorResponseText('回應JSON');
        setVisibleText('visible');
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setErrorResponseText('回應JSON (Error Response)');
        setVisibleText('visible');
    });
};

export function sendPatientQueryData(form, startDate, searchText, setJsonResponseText, setVisibleText, setErrorResponseText) {
    let patientIdOrName = form.patientIdOrName;
    let apiPatientUrl = queryPatient + '/' + patientIdOrName;
    if (searchText === '進階') {
        apiPatientUrl = searchPatient;
        let createdDate = '';
        let searchParams = '';
        let numberPattern = new RegExp(/(\d+)/);
        let patternResult = numberPattern.exec(patientIdOrName);
        if (startDate && startDate !== '') {
            let year = String(startDate.getFullYear());
            let month = String(startDate.getMonth() + 1);
            let day = String(startDate.getDate());
            if (month.length === 1) {
                month = '0' + month;
            }
            if (day.length === 1) {
                day = '0' + day;
            }
            createdDate = year + '-' + month + '-' + day;
        }
        if (patternResult && patternResult[0] === patternResult['input']) {
            searchParams += '_id=' + patientIdOrName;
        } else {
            searchParams += 'name=' + patientIdOrName;
        }
        if (createdDate !== '') {
            searchParams += '&_lastUpdated=' + createdDate;
        }
        let requestPayload = {
            'search_params': searchParams,
        };
        Axios.post(apiPatientUrl, requestPayload).then((response) => {
            let responseJsonString = JSON.stringify(response.data, null, 2);
            setErrorResponseText('回應JSON');
            setJsonResponseText(responseJsonString);
            setVisibleText('visible');
        }).catch((error) => {
            let errResponseJsonString = JSON.stringify(error.response, null, 2);
            setJsonResponseText(errResponseJsonString);
            setErrorResponseText('回應JSON (Error Response)');
            setVisibleText('visible');
        });
    } else {
        Axios.get(apiPatientUrl).then((response) => {
            let responseJsonString = JSON.stringify(response.data, null, 2);
            setJsonResponseText(responseJsonString);
            setErrorResponseText('回應JSON');
            setVisibleText('visible');
        }).catch((error) => {
            let errResponseJsonString = JSON.stringify(error.response, null, 2);
            setJsonResponseText(errResponseJsonString);
            setErrorResponseText('回應JSON (Error Response)');
            setVisibleText('visible');
        });
    }
};

export function sendPatientQueryDataJsonString(form, fieldStates) {
    let patientResourceId = form.patientResourceId;
    let apiPatientUrl = queryPatient + '/' + patientResourceId;
    Axios.get(apiPatientUrl).then((response) => {
        let setIdNumber = fieldStates['idNumber'];
        setIdNumber(response.data['identifier'][0]['value']);

        if (response.data['identifier'].length > 1) {
            let setPassportNumber = fieldStates['passportNumber'];
            setPassportNumber(response.data['identifier'][1]['value']);
        }

        let setPatientName = fieldStates['patientName'];
        let setPatientEnName = fieldStates['patientEnName'];
        let setPatientSex = fieldStates['patientSex'];
        let setPatientHomeAddress = fieldStates['patientHomeAddress'];
        let setPatientPhoneNumber = fieldStates['patientPhoneNumber'];

        setPatientName(response.data['name'][0]['text']);
        setPatientEnName(response.data['name'][1]['text']);
        setPatientSex(response.data['gender']);
        setPatientHomeAddress(response.data['address'][0]['text']);
        setPatientPhoneNumber(response.data['telecom'][0]['value']);
    }).catch((error) => {
        JSON.stringify(error.response, null, 2);
        let setNewErrors = fieldStates['errors'];
        setNewErrors({
            patientResourceId: '查詢patient resource id: ' + patientResourceId + '錯誤',
        });
    });
};

export function modifyPatientData(form, startDate, setJsonResponseText, setErrorResponseText, setVisibleText) {
    let jsonPayload = {
        'resourceType': 'Patient',
        'id': form.patientResourceId,
        'address': [
            {
                'country': 'TW',
            },
        ],
    };

    if (form.patientSex) {
        jsonPayload['gender'] = form.patientSex;
    }

    if (form.patientHomeAddress) {
        jsonPayload['address'].push({
            'use': 'home',
            'text': form.patientHomeAddress,
        });
    }

    if (form.patientPhoneNumber) {
        jsonPayload['telecom'] = [
            {
                'use': 'home',
                'system': 'phone',
                'value': form.patientPhoneNumber,
            },
        ];
    }

    if (form.idNumber) {
        if (jsonPayload['identifier'] === undefined) {
            jsonPayload['identifier'] = [
                {
                    'system': 'https://www.dicom.org.tw/cs/identityCardNumber_tw',
                    'value': form.idNumber,
                },
            ];
        }
    }

    if (form.patientName) {
        if (jsonPayload['name'] === undefined) {
            jsonPayload['name'] = [
                {
                    'text': form.patientName,
                    'family': form.patientName[0],
                    'given': [form.patientName.substring(1)],
                },
            ];
        } else {
            jsonPayload['name'].push({
                'text': form.patientName,
                'family': form.patientName[0],
                'given': [form.patientName.substring(1)],
            });
        }
    }

    if (form.patientEnName) {
        let patientEnName = form.patientEnName;
        let patientEnNameInfo = patientEnName.split(' ');
        if (jsonPayload['name'] === undefined) {
            jsonPayload['name'] = [
                {
                    'text': patientEnName,
                    'family': patientEnNameInfo[patientEnNameInfo.length-1],
                    'given': [
                        patientEnNameInfo.slice(0, patientEnNameInfo.length-1).join(' '),
                    ],
                },
            ];
        } else {
            jsonPayload['name'].push({
                'text': patientEnName,
                'family': patientEnNameInfo[patientEnNameInfo.length-1],
                'given': [
                    patientEnNameInfo.slice(0, patientEnNameInfo.length-1).join(' '),
                ],
            });
        }
    }

    if (!!startDate) {
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
        jsonPayload['birthDate'] = birthDate;
    }

    if (form.passportNumber) {
        if (jsonPayload['identifier'] !== undefined) {
            jsonPayload['identifier'].push({
                'system': 'https://www.dicom.org.tw/cs/identityCardNumber_tw',
                'value': form.passportNumber,
            });
        } else {
            jsonPayload['identifier'] = [
                {
                    'system': 'https://www.dicom.org.tw/cs/identityCardNumber_tw',
                    'value': form.passportNumber,
                },
            ];
        }
    }

    let encodedJsonString = base64.encode(utf8.encode(JSON.stringify(jsonPayload)));
    let requestPayload = {
        'json_payload': encodedJsonString,
        'patient_id': form.patientResourceId,
    };

    Axios.put(updatePatient, requestPayload).then((response) => {
        let responseJsonString = JSON.stringify(response.data, null, 2);
        setJsonResponseText(responseJsonString);
        setErrorResponseText('回應JSON');
        setVisibleText('visible');
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setErrorResponseText('回應JSON (Error Response)');
        setVisibleText('visible');
    });
};

export function deletePatientData(form, setVisibleText, setJsonResponseText, setErrorResponseText) {
    let patientResourceId = form.patientResourceId;
    let deletePatientUrl = deletePatient + '/' + patientResourceId;
    Axios.delete(deletePatientUrl).then((response) => {
        let responseJsonString = JSON.stringify(response.data, null, 2);
        setJsonResponseText(responseJsonString);
        setErrorResponseText('回應JSON');
        setVisibleText('visible');
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setErrorResponseText('回應JSON (Error Response)');
        setVisibleText('visible');
    });
};

export function sendFHIRServerData(setVisibleText, setJsonResponseText, setErrorResponseText, apiEndpoint) {
    let requestPayload = {
        'fhir_server': apiEndpoint,
    };
    Axios.post(fhirServer, requestPayload).then((response) => {
        let responseJsonString = JSON.stringify(response.data, null, 2);
        setJsonResponseText(responseJsonString);
        setErrorResponseText('回應JSON');
        setVisibleText('visible');
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setErrorResponseText('回應JSON (Error Response)');
        setVisibleText('visible');
    });
}

const HttpRequest = {
    sendPatientData,
    sendFHIRServerData,
    sendPatientQueryData,
    deletePatientData,
    modifyPatientData,
    sendPatientQueryDataJsonString,
};
export default HttpRequest;
