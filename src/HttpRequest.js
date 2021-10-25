import Axios from 'axios';
import base64 from 'base-64';
import utf8 from 'utf8';
import { validate } from 'uuid';
import ResourceChecker from './ResourceChecker.js';
import ResourceFetcher from './ResourceFetcher.js';
import ResourceCreator from './ResourceCreator.js';
import SerialNumber from './SerialNumber.js';


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
var createImmunization = 'http://localhost:8000/api/CreateImmunization';
var createImmunizationBundle = 'http://localhost:8000/api/CreateBundle/Immunization';
var createObservation = 'http://localhost:8000/api/CreateObservation';
var createObservationBundle = 'http://localhost:8000/api/CreateBundle/Observation';
var getObservationBundle = 'http://localhost:8000/api/GetObservationBundle';
var searchImmunization = 'http://localhost:8000/api/SearchImmunization';

var urnUuidPrefix = 'urn:uuid:';

export function sendPatientData(form, startDate, setJsonResponseText, setErrorResponseText, setVisibleText, setVisibleProgressBarText) {
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

    setVisibleProgressBarText('visible');
    Axios.post(createPatient, requestPayload).then((response) => {
        let responseJsonString = JSON.stringify(response.data, null, 2);
        setJsonResponseText(responseJsonString);
        setErrorResponseText('回應JSON');
        setVisibleText('visible');
        setVisibleProgressBarText('invisible');
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setErrorResponseText('回應JSON (Error Response)');
        setVisibleText('visible');
        setVisibleProgressBarText('invisible');
    });
};

export function sendPatientQueryData(form, startDate, searchText, setJsonResponseText, setVisibleText, setErrorResponseText, setVisibleProgressBarText) {
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
        setVisibleProgressBarText('visible');
        Axios.post(apiPatientUrl, requestPayload).then((response) => {
            let responseJsonString = JSON.stringify(response.data, null, 2);
            setErrorResponseText('回應JSON');
            setJsonResponseText(responseJsonString);
            setVisibleText('visible');
            setVisibleProgressBarText('invisible');
        }).catch((error) => {
            let errResponseJsonString = JSON.stringify(error.response, null, 2);
            setJsonResponseText(errResponseJsonString);
            setErrorResponseText('回應JSON (Error Response)');
            setVisibleText('visible');
            setVisibleProgressBarText('invisible');
        });
    } else {
        Axios.get(apiPatientUrl).then((response) => {
            let responseJsonString = JSON.stringify(response.data, null, 2);
            setJsonResponseText(responseJsonString);
            setErrorResponseText('回應JSON');
            setVisibleText('visible');
            setVisibleProgressBarText('invisible');
        }).catch((error) => {
            let errResponseJsonString = JSON.stringify(error.response, null, 2);
            setJsonResponseText(errResponseJsonString);
            setErrorResponseText('回應JSON (Error Response)');
            setVisibleText('visible');
            setVisibleProgressBarText('invisible');
        });
    }
};

export function sendPatientQueryDataJsonString(form, fieldStates, setVisibleProgressBarText) {
    let patientResourceId = form.patientResourceId;
    let apiPatientUrl = queryPatient + '/' + patientResourceId;

    setVisibleProgressBarText('visible');
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
        setPatientHomeAddress((!response.data['address'][0]['text']) ? (response.data['address'][1]['text']) : (response.data['address'][0]['text']));
        setPatientPhoneNumber(response.data['telecom'][0]['value']);
        setVisibleProgressBarText('invisible');
    }).catch((error) => {
        JSON.stringify(error.response, null, 2);
        let setNewErrors = fieldStates['errors'];
        setNewErrors({
            patientResourceId: '查詢patient resource id: ' + patientResourceId + '錯誤',
        });
        setVisibleProgressBarText('invisible');
    });
};

export function modifyPatientData(form, startDate, setJsonResponseText, setErrorResponseText, setVisibleText, setVisibleProgressBarText) {
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

    setVisibleProgressBarText('visible');
    Axios.put(updatePatient, requestPayload).then((response) => {
        let responseJsonString = JSON.stringify(response.data, null, 2);
        setJsonResponseText(responseJsonString);
        setErrorResponseText('回應JSON');
        setVisibleText('visible');
        setVisibleProgressBarText('invisible');
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setErrorResponseText('回應JSON (Error Response)');
        setVisibleText('visible');
        setVisibleProgressBarText('invisible');
    });
};

export function deletePatientData(form, setVisibleText, setJsonResponseText, setErrorResponseText, setVisibleProgressBarText) {
    let patientResourceId = form.patientResourceId;
    let deletePatientUrl = deletePatient + '/' + patientResourceId;
    setVisibleProgressBarText('visible');
    Axios.delete(deletePatientUrl).then((response) => {
        let responseJsonString = JSON.stringify(response.data, null, 2);
        setJsonResponseText(responseJsonString);
        setErrorResponseText('回應JSON');
        setVisibleText('visible');
        setVisibleProgressBarText('invisible');
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setErrorResponseText('回應JSON (Error Response)');
        setVisibleText('visible');
        setVisibleProgressBarText('invisible');
    });
};

export function sendFHIRServerData(setVisibleText, setJsonResponseText, setErrorResponseText, apiEndpoint, apiToken) {
    let requestPayload = {
        'fhir_server': apiEndpoint,
        'fhir_token': apiToken,
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

export async function sendFHIRServerDataForQRCodeDemo(apiEndpoint, apiToken) {
    if (apiToken === 'no') {
        apiToken = '';
    }

    let requestPayload = {
        'fhir_server': apiEndpoint,
        'fhir_token': apiToken,
    };
    await Axios.post(fhirServer, requestPayload).then((response) => {
        console.log(response.data);
    }).catch((error) => {
        console.error(error.response);
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

export function sendOrgData(medId, hospitalLists, setJsonResponseText, setErrorResponseText, setVisibleText, setVisibleProgressBarText) {
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

    setVisibleProgressBarText('visible');
    Axios.post(createOrganization, requestPayload).then((response) => {
        let responseJsonString = JSON.stringify(response.data, null, 2);
        setJsonResponseText(responseJsonString);
        setErrorResponseText('回應JSON');
        setVisibleText('visible');
        setVisibleProgressBarText('invisible');
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setErrorResponseText('回應JSON (Error Response)');
        setVisibleText('visible');
        setVisibleProgressBarText('invisible');
    });
};

export function sendQueryOrgData(orgId, setJsonResponseText, setVisibleText, setErrorResponseText, setVisibleProgressBarText) {
    let apiPatientUrl = getOrganization + '/' + orgId;
    setVisibleProgressBarText('visible');
    Axios.get(apiPatientUrl).then((response) => {
        let responseJsonString = JSON.stringify(response.data, null, 2);
        setJsonResponseText(responseJsonString);
        setErrorResponseText('回應JSON');
        setVisibleText('visible');
        setVisibleProgressBarText('invisible');
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setErrorResponseText('回應JSON (Error Response)');
        setVisibleText('visible');
        setVisibleProgressBarText('invisible');
    });
};

export async function sendImmunizationBundleData(form, startDate, setJsonResponseText, setErrorResponseText, setVisibleText, setBundleIdText, setVisibleProgressBarText) {
    setVisibleProgressBarText('visible');
    let apiUrl = queryPatient + '/' + form.patientId;
    let patientIdError = await ResourceChecker.checkPatientResourceByUrl(apiUrl, setJsonResponseText, setVisibleText);
    if (patientIdError) {
        setErrorResponseText('回應JSON (Error Response, patient resource id error)');
        setVisibleProgressBarText('invisible');
        return false;
    }

    apiUrl = getOrganization + '/' + form.medOrgId;
    let orgIdError = await ResourceChecker.checkOrgResourceByUrl(apiUrl, setJsonResponseText, setVisibleText);

    if (orgIdError) {
        setErrorResponseText('回應JSON (Error Response, organization resource id error)');
        setVisibleProgressBarText('invisible');
        return false;
    }

    let year = startDate.getFullYear();
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
    let immunizationJsonPayload = ResourceCreator.getImmunizationJsonPayload(form, vaccineDate);

    encodedJsonString = base64.encode(utf8.encode(JSON.stringify(immunizationJsonPayload)));
    requestPayload = {
        'json_payload': encodedJsonString,
    };

    [immunizationError, immunizationId] = await ResourceCreator.createImmunizationResource(createImmunization, requestPayload, setJsonResponseText, setVisibleText);
    if (immunizationError) {
        setErrorResponseText('回應JSON (Error Response, immunization resource creating error)');
        setVisibleProgressBarText('invisible');
        return false;
    }

    let compositionId = '';
    let compositionError = false;
    let patientReference = 'Patient/' + form.patientId;
    if (validate(form.patientId)) {
        patientReference = urnUuidPrefix + form.patientId;
    }
    let organizationReference = 'Organization/' + form.medOrgId;
    if (validate(form.medOrgId)) {
        organizationReference = urnUuidPrefix + form.medOrgId;
    }
    let immunizationReference = 'Immunization/' + immunizationId;
    if (validate(immunizationId)) {
        immunizationReference = urnUuidPrefix + immunizationId;
    }

    let compositionJsonPayload = ResourceCreator.getCompositionJsonPayload(patientReference, organizationReference, immunizationReference, 'immunization');
    encodedJsonString = base64.encode(utf8.encode(JSON.stringify(compositionJsonPayload)));
    requestPayload = {
        'json_payload': encodedJsonString,
    };

    [compositionError, compositionId] = await ResourceCreator.createCompositionResource(createComposition, requestPayload, setJsonResponseText, setVisibleText);
    if (compositionError) {
        setErrorResponseText('回應JSON (Error Response, composition resource creating error)');
        setVisibleProgressBarText('invisible');
        return false;
    }

    let fhirServerUrl = await ResourceFetcher.getFhirServerUrl(setJsonResponseText, setErrorResponseText, setVisibleText);
    if (fhirServerUrl === '') {
        setVisibleProgressBarText('invisible');
        return false;
    }

    let bundleId = '';
    let organizationResource = await ResourceFetcher.getOrganizationResourceById(form.medOrgId, fhirServerUrl, setJsonResponseText, setErrorResponseText, setVisibleText);
    let identifierValue = 'TW.' + organizationResource['resource']['identifier'][0]['value'] + '.' + startDate.toISOString().split('.')[0].replace(/[-,:,T]/g, '') + '.' + SerialNumber.getSerialNumber();
    if (Object.keys(organizationResource).length === 0) {
        setVisibleProgressBarText('invisible');
        return false;
    }

    let compositionResource = await ResourceFetcher.getCompositionResourceById(compositionId, fhirServerUrl, setJsonResponseText, setErrorResponseText, setVisibleText);
    if (Object.keys(compositionResource).length === 0) {
        setVisibleProgressBarText('invisible');
        return false;
    }

    let patientResource = await ResourceFetcher.getPatientResourceById(form.patientId, fhirServerUrl, setJsonResponseText, setErrorResponseText, setVisibleText);
    if (Object.keys(patientResource).length === 0) {
        setVisibleProgressBarText('invisible');
        return false;
    }

    let immunizationResource = await ResourceFetcher.getImmunizationResourceById(immunizationId, fhirServerUrl, setJsonResponseText, setErrorResponseText, setVisibleText);
    if (Object.keys(immunizationResource).length === 0) {
        setVisibleProgressBarText('invisible');
        return false;
    }

    let entries = [
        compositionResource,
        organizationResource,
        patientResource,
        immunizationResource,
    ];
    let bundleJsonPayload = ResourceCreator.getImmunizationBundleJsonPayload(identifierValue, vaccineDate, periodEndDate, startDate, entries);

    encodedJsonString = base64.encode(utf8.encode(JSON.stringify(bundleJsonPayload)));
    requestPayload = {
        'json_payload': encodedJsonString,
    };

    Axios.post(createImmunizationBundle, requestPayload).then((response) => {
        let responseJsonString = JSON.stringify(response.data, null, 2);
        setJsonResponseText(responseJsonString);
        setErrorResponseText('回應JSON (Bundle resource creating response)');
        setVisibleText('visible');
        setVisibleProgressBarText('invisible');
        bundleId = response.data.id;
        setBundleIdText('Bundle id: ' + bundleId + '（請記下此id）');
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setErrorResponseText('回應JSON (Error Response for Immunization Bundle resource creating)');
        setVisibleText('visible');
        setVisibleProgressBarText('invisible');
        setBundleIdText('');
    });
};

export async function sendObservationBundleData(form, startDate, issuedDate, setJsonResponseText, setErrorResponseText, setVisibleText, setBundleIdText, setVisibleProgressBarText) {
    setVisibleProgressBarText('visible');
    let apiUrl = queryPatient + '/' + form.patientId;
    let patientIdError = await ResourceChecker.checkPatientResourceByUrl(apiUrl, setJsonResponseText, setVisibleText);
    if (patientIdError) {
        setErrorResponseText('回應JSON (Error Response, patient resource id error)');
        setVisibleProgressBarText('invisible');
        return false;
    }

    apiUrl = getOrganization + '/' + form.orgId;
    let orgIdError = await ResourceChecker.checkOrgResourceByUrl(apiUrl, setJsonResponseText, setVisibleText);

    if (orgIdError) {
        setErrorResponseText('回應JSON (Error Response, organization resource id error)');
        setVisibleProgressBarText('invisible');
        return false;
    }

    let effectivePeriodStartDate = startDate.toISOString().split('.')[0] + 'Z';
    let effectivePeriodEndDate = issuedDate.toISOString().split('.')[0] + 'Z';

    let encodedJsonString = '';
    let requestPayload = {};

    let observationId = '';
    let observationError = false;
    let observationJsonPayload = ResourceCreator.getObservationJsonPayload(form, effectivePeriodStartDate, effectivePeriodEndDate);

    encodedJsonString = base64.encode(utf8.encode(JSON.stringify(observationJsonPayload)));
    requestPayload = {
        'json_payload': encodedJsonString,
    };

    [observationError, observationId] = await ResourceCreator.createObservationResource(createObservation, requestPayload, setJsonResponseText, setVisibleText);
    if (observationError) {
        setErrorResponseText('回應JSON (Error Response, observation resource creating error)');
        setVisibleProgressBarText('invisible');
        return false;
    }

    let compositionId = '';
    let compositionError = false;
    let patientReference = 'Patient/' + form.patientId;
    if (validate(form.patientId)) {
        patientReference = urnUuidPrefix + form.patientId;
    }
    let organizationReference = 'Organization/' + form.orgId;
    if (validate(form.orgId)) {
        organizationReference = urnUuidPrefix + form.orgId;
    }
    let observationReference = 'Observation/' + observationId;
    if (validate(observationId)) {
        observationReference = urnUuidPrefix + observationId;
    }

    let compositionJsonPayload = ResourceCreator.getCompositionJsonPayload(patientReference, organizationReference, observationReference, 'observation');
    encodedJsonString = base64.encode(utf8.encode(JSON.stringify(compositionJsonPayload)));
    requestPayload = {
        'json_payload': encodedJsonString,
    };

    [compositionError, compositionId] = await ResourceCreator.createCompositionResource(createComposition, requestPayload, setJsonResponseText, setVisibleText);
    if (compositionError) {
        setErrorResponseText('回應JSON (Error Response, composition resource creating error)');
        setVisibleProgressBarText('invisible');
        return false;
    }

    let fhirServerUrl = await ResourceFetcher.getFhirServerUrl(setJsonResponseText, setErrorResponseText, setVisibleText);
    if (fhirServerUrl === '') {
        setVisibleProgressBarText('invisible');
        return false;
    }

    let bundleId = '';
    let organizationResource = await ResourceFetcher.getOrganizationResourceById(form.orgId, fhirServerUrl, setJsonResponseText, setErrorResponseText, setVisibleText);
    let identifierValue = 'TW.' + organizationResource['resource']['identifier'][0]['value'] + '.' + startDate.toISOString().split('.')[0].replace(/[-,:,T]/g, '') + '.' + SerialNumber.getSerialNumber();
    if (Object.keys(organizationResource).length === 0) {
        setVisibleProgressBarText('invisible');
        return false;
    }

    let compositionResource = await ResourceFetcher.getCompositionResourceById(compositionId, fhirServerUrl, setJsonResponseText, setErrorResponseText, setVisibleText);
    if (Object.keys(compositionResource).length === 0) {
        setVisibleProgressBarText('invisible');
        return false;
    }

    let patientResource = await ResourceFetcher.getPatientResourceById(form.patientId, fhirServerUrl, setJsonResponseText, setErrorResponseText, setVisibleText);
    if (Object.keys(patientResource).length === 0) {
        setVisibleProgressBarText('invisible');
        return false;
    }

    let observationResource = await ResourceFetcher.getObservationResourceById(observationId, fhirServerUrl, setJsonResponseText, setErrorResponseText, setVisibleText);
    if (Object.keys(observationResource).length === 0) {
        setVisibleProgressBarText('invisible');
        return false;
    }

    let entries = [
        compositionResource,
        organizationResource,
        patientResource,
        observationResource,
    ];
    let bundleJsonPayload = ResourceCreator.getObservationBundleJsonPayload(identifierValue, startDate, entries);

    encodedJsonString = base64.encode(utf8.encode(JSON.stringify(bundleJsonPayload)));
    requestPayload = {
        'json_payload': encodedJsonString,
    };

    Axios.post(createObservationBundle, requestPayload).then((response) => {
        let responseJsonString = JSON.stringify(response.data, null, 2);
        setJsonResponseText(responseJsonString);
        setErrorResponseText('回應JSON (Bundle resource creating response)');
        setVisibleText('visible');
        setVisibleProgressBarText('invisible');
        bundleId = response.data.id;
        setBundleIdText('Bundle id: ' + bundleId + '（請記下此id）');
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setErrorResponseText('回應JSON (Error Response for Observation Bundle resource creating)');
        setVisibleText('visible');
        setVisibleProgressBarText('invisible');
        setBundleIdText('');
    });
};

export function sendImmunizationQueryData(requestPayload, setJsonResponseText, setVisibleText, setErrorResponseText, setVisibleProgressBarText) {
    setVisibleProgressBarText('visible');
    Axios.post(searchImmunization, requestPayload).then((response) => {
        let responseJsonString = JSON.stringify(response.data, null, 2);
        setJsonResponseText(responseJsonString);
        setErrorResponseText('回應JSON');
        setVisibleText('visible');
        setVisibleProgressBarText('invisible');
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setErrorResponseText('回應JSON (Error Response)');
        setVisibleText('visible');
        setVisibleProgressBarText('invisible');
    });
}

export function sendObservationBundleQueryData(observationBundleId, setJsonResponseText, setVisibleText, setErrorResponseText, setVisibleProgressBarText) {
    let apiObservationBundleUrl = getObservationBundle + '/' + observationBundleId;

    setVisibleProgressBarText('visible');
    Axios.get(apiObservationBundleUrl).then((response) => {
        let responseJsonString = JSON.stringify(response.data, null, 2);
        setJsonResponseText(responseJsonString);
        setErrorResponseText('回應JSON');
        setVisibleText('visible');
        setVisibleProgressBarText('invisible');
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setErrorResponseText('回應JSON (Error Response)');
        setVisibleText('visible');
        setVisibleProgressBarText('invisible');
    });
};

const HttpRequest = {
    sendPatientData,
    sendFHIRServerData,
    sendFHIRServerDataForQRCodeDemo,
    sendPatientQueryData,
    deletePatientData,
    modifyPatientData,
    sendPatientQueryDataJsonString,
    getHospitalLists,
    sendOrgData,
    sendQueryOrgData,
    sendImmunizationBundleData,
    sendObservationBundleData,
    sendImmunizationQueryData,
    sendObservationBundleQueryData,
};

export default HttpRequest;
