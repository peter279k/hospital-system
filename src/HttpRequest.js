import Axios from 'axios';
import base64 from 'base-64';
import utf8 from 'utf8';
import { v4 as uuidv4 } from 'uuid';
import ResourceChecker from './ResourceChecker.js';


var fhirServer = 'http://localhost:8000/api/fhir_server';
var createPatient = 'http://localhost:8000/api/CreatePatient';
var queryPatient = 'http://localhost:8000/api/QueryPatient';
var searchPatient = 'http://localhost:8000/api/SearchPatient';
var updatePatient = 'http://localhost:8000/api/UpdatePatient';
var deletePatient = 'http://localhost:8000/api/DeletePatient';
var hospitalLists = 'http://localhost:8000/api/GetHospitalLists';
var createOrganization = 'http://localhost:8000/api/CreateOrganization';
var getOrganization = 'http://localhost:8000/api/GetOrganization';
var createComposition = 'http://localhost:8000/api/CreateComposition';
var getComposition = 'http://localhost:8000/api/GetComposition';
var createImmunization = 'http://localhost:8000/api/CreateImmunization';
var getImmunization = 'http://localhost:8000/api/GetImmunization';
var createBundle = 'http://localhost:8000/api/CreateBundle';
//var getBundle = 'http://localhost:8000/api/getBundle';


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

export function getHospitalLists(setHospitalLists, setMedId) {
    Axios.get(hospitalLists).then((response) => {
        let responseArr = [{
            id: 0,
            name: '請選擇醫事單位',
            number: '',
        }];
        for (let index=0; index<response.data.hospital_name.length; index++) {
            responseArr.push({
                id: (index+1),
                name: response.data.hospital_name[index],
                number: response.data.hospital_number[index],
            });
        }
        setHospitalLists(responseArr);
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setMedId(errResponseJsonString);
    });
}

export function sendOrgData(medId, hospitalLists, setJsonResponseText, setErrorResponseText, setVisibleText) {
    let filteredMed = hospitalLists.filter((hospitalList) => {
        return hospitalList.number === medId;
    });
    let jsonPayload = {
        'resourceType': 'Organization',
        'identifier': [
            {
                'system': 'https://ma.mohw.gov.tw',
                'value': medId,
            },
        ],
        'name': filteredMed[0].name,
        'address': {
            'country': 'TW',
        },
    };

    let encodedJsonString = base64.encode(utf8.encode(JSON.stringify(jsonPayload)));
    let requestPayload = {
        'json_payload': encodedJsonString,
    };

    Axios.post(createOrganization, requestPayload).then((response) => {
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

export function sendQueryOrgData(orgId, setJsonResponseText, setVisibleText, setErrorResponseText) {
    let apiPatientUrl = getOrganization + '/' + orgId;
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

export async function sendImmunizationBundleData(form, startDate, setJsonResponseText, setErrorResponseText, setVisibleText, setBundleIdText) {
    let apiUrl = queryPatient + '/' + form.patientId;
    let patientIdError = await ResourceChecker.checkPatientResourceByUrl(apiUrl, setJsonResponseText, setVisibleText);
    if (patientIdError) {
        setErrorResponseText('回應JSON (Error Response, patient resource id error)');
        return false;
    }

    apiUrl = getImmunization + '/' + form.medOrgId;
    let orgIdError = await ResourceChecker.checkOrgResourceByUrl(apiUrl, setJsonResponseText, setVisibleText);

    if (orgIdError) {
        setErrorResponseText('回應JSON (Error Response, organization resource id error)');
        return false;
    }

    let year = String(startDate.getFullYear());
    let month = String(startDate.getMonth() + 1);
    let day = String(startDate.getDate());
    if (month.length === 1) {
        month = '0' + month;
    }
    if (day.length === 1) {
        day = '0' + day;
    }
    let vaccineDate = year + '-' + month + '-' + day;
    let periodEndDate = (year + 1) + '-' + month + '-' + day;

    let encodedJsonString = '';
    let requestPayload = {};

    let immunizationId = '';
    let immunizationError = false;
    let immunizationJsonPayload = {
        'resourceType': 'Immunization',
        'status': 'completed',
        'vaccineCode': {
            'coding': [
                {
                    'system': 'https://www.cdc.gov.tw',
                    'code': form.vaccineId,
                    'display': form.vaccineCode,
                },
            ],
        },
        'patient': {
            'reference': 'Patient/' + form.patientId,
        },
        'occurrenceDateTime': vaccineDate,
        'performer': [
            {
                'actor': {
                    'reference': 'Organization/' + form.medOrgId,
                },
            },
            {
                'actor': {
                    'display': form.medName,
                },
            },
        ],
        'manufacturer': {
            'display': form.manufacturer,
        },
        'lotNumber': form.lotNumber,
        'protocolApplied': [
            {
                'targetDisease': [
                    {
                        'coding': [
                            {
                                'system': 'http://hl7.org/fhir/sid/icd-10',
                                'code': 'U07.1',
                                'display': 'COVID-19, virus identified',
                            },
                        ],
                    },
                ],
                'doseNumberPositiveInt': form.doseNumberPositiveInt,
                'seriesDosesPositiveInt': form.seriesDosesPositiveInt,
            },
        ],
    }
    encodedJsonString = base64.encode(utf8.encode(JSON.stringify(immunizationJsonPayload)));
    requestPayload = {
        'json_payload': encodedJsonString,
    };

    await Axios.post(createImmunization, requestPayload).then((response) => {
        immunizationId = response.data.id;
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setVisibleText('visible');
        immunizationError = true;
    });

    if (immunizationError) {
        setErrorResponseText('回應JSON (Error Response, immunization resource creating error)');
        return false;
    }

    let compositionId = '';
    let compositionError = false;
    let compositionJsonPayload = {
        'resourceType': 'Composition',
        'status': 'final',
        'type': {
            'coding': [
                {
                    'system': 'http://loinc.org',
                    'code': '82593-5',
                    'display': 'Immunization summary report',
                },
            ],
        },
        'subject': [
            {
                'reference': 'Patient/' + form.patientId,
            }
        ],
        'date': startDate.toISOString().split('.')[0] + '+08:00',
        'title': 'COVID-19 Vaccine',
        'author': [
            {
                'reference': 'Organization/' + form.medOrgId,
            },
        ],
        'section': {
            'entry': [
                {
                    'reference': 'Organization/' + form.medOrgId,
                },
                {
                    'reference': 'Patient/' + form.patientId,
                },
                {
                    'reference': 'Immunization/' + immunizationId,
                },
            ],
        },
    }

    encodedJsonString = base64.encode(utf8.encode(JSON.stringify(compositionJsonPayload)));
    requestPayload = {
        'json_payload': encodedJsonString,
    };

    await Axios.post(createComposition, requestPayload).then((response) => {
        compositionId = response.data.id;
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setVisibleText('visible');
        compositionError = true;
    });

    if (compositionError) {
        setErrorResponseText('回應JSON (Error Response, composition resource creating error)');
        return false;
    }

    let fhirServerUrl = getFhirServerUrl(setJsonResponseText, setErrorResponseText, setVisibleText);
    if (fhirServerUrl === '') {
        return false;
    }

    let bundleId = '';
    let bundleJsonPayload = {
        'resourceType': 'Bundle',
        'identifier': [
            {
                'system': 'https://www.vghtc.gov.tw',
                'value': uuidv4(),
                'period': {
                    'start': vaccineDate,
                    'end': periodEndDate,
                },
            },
        ],
        'type': 'document',
        'timestamp': startDate.toISOString().split('.')[0] + '+08:00',
        'entry': [
            getCompositionResourceById(compositionId, fhirServerUrl, setJsonResponseText, setErrorResponseText, setVisibleText),
            getOrganizationResourceById(form.medOrgId, fhirServerUrl, setJsonResponseText, setErrorResponseText, setVisibleText),
            getPatientResourceById(form.patientId, fhirServerUrl, setJsonResponseText, setErrorResponseText, setVisibleText),
            getImmunizationResourceById(immunizationId, fhirServerUrl, setJsonResponseText, setErrorResponseText, setVisibleText),
        ],
    };

    encodedJsonString = base64.encode(utf8.encode(JSON.stringify(bundleJsonPayload)));
    requestPayload = {
        'json_payload': encodedJsonString,
    };

    Axios.post(createBundle, requestPayload).then((response) => {
        let responseJsonString = JSON.stringify(response.data, null, 2);
        setJsonResponseText(responseJsonString);
        setErrorResponseText('回應JSON (Bundle resource creating response)');
        setVisibleText('visible');
        bundleId = response.data.id;
        setBundleIdText('Bundle id: ' + bundleId + '（請記下此id）');
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setErrorResponseText('回應JSON (Error Response for Immunization Bundle resource creating)');
        setVisibleText('visible');
        setBundleIdText('');
    });
};

async function getCompositionResourceById(compositionId, fhirServerUrl, setJsonResponseText, setErrorResponseText, setVisibleText) {
    let fullUrl = fhirServerUrl + '/Composition' + compositionId;
    let compositionResource = {
        'fullUrl': fullUrl,
        'resource': {},
    };
    let apiUrl = getComposition + '/' + compositionId;
    await Axios.get(apiUrl).then((response) => {
        compositionResource['resource'] = response.data;
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setErrorResponseText('回應JSON (Get Composition Resource Error Response)');
        setVisibleText('visible');
    });

    return compositionResource;
}

async function getOrganizationResourceById(organizationId, fhirServerUrl, setJsonResponseText, setErrorResponseText, setVisibleText) {
    let fullUrl = fhirServerUrl + '/Organization' + organizationId;
    let organizationResource = {
        'fullUrl': fullUrl,
        'resource': {},
    };
    let apiUrl = getOrganization + '/' + organizationId;
    await Axios.get(apiUrl).then((response) => {
        organizationResource['resource'] = response.data;
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setErrorResponseText('回應JSON (Get Organization Resource Error Response)');
        setVisibleText('visible');
    });

    return organizationResource;
}

async function getPatientResourceById(patientId, fhirServerUrl, setJsonResponseText, setErrorResponseText, setVisibleText) {
    let fullUrl = fhirServerUrl + '/Patient' + patientId;
    let apiUrl = queryPatient + '/' + patientId;
    let patientResource = {
        'fullUrl': fullUrl,
        'resource': {},
    };
    await Axios.get(apiUrl).then((response) => {
        patientResource['resource'] = response.data;
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setErrorResponseText('回應JSON (Get Patient Resource Error Response)');
        setVisibleText('visible');
    });

    return patientResource;
}

async function getImmunizationResourceById(immunizationId, fhirServerUrl, setJsonResponseText, setErrorResponseText, setVisibleText) {
    let fullUrl = fhirServerUrl + '/Immunization' + immunizationId;
    let immunizationResource = {
        'fullUrl': fullUrl,
        'resource': {},
    };
    let apiUrl = createImmunization + '/' + immunizationId;
    await Axios.get(apiUrl).then((response) => {
        immunizationResource['resource'] = response.data;
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setErrorResponseText('回應JSON (Get Immunization Resource Error Response)');
        setVisibleText('visible');
    });

    return immunizationResource;
}

async function getFhirServerUrl(setJsonResponseText, setErrorResponseText, setVisibleText) {
    let fhirServerUrl = '';
    await Axios.get(fhirServer).then((response) => {
        fhirServerUrl = response.data.fhir_server;
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setErrorResponseText('回應JSON (Get FHIR Server URL Error Response)');
        setVisibleText('visible');
    });

    return fhirServerUrl;
}

const HttpRequest = {
    sendPatientData,
    sendFHIRServerData,
    sendPatientQueryData,
    deletePatientData,
    modifyPatientData,
    sendPatientQueryDataJsonString,
    getHospitalLists,
    sendOrgData,
    sendQueryOrgData,
    sendImmunizationBundleData,
};
export default HttpRequest;
