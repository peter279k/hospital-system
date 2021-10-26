import Axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export function getImmunizationBundleJsonPayload(identifierValue, vaccineDate, periodEndDate, startDate, entries) {
    let bundleJsonPayload = {
        'resourceType': 'Bundle',
        'identifier': [
            {
                'system': 'https://www.vghtc.gov.tw',
                'value': identifierValue,
                'period': {
                    'start': vaccineDate,
                    'end': periodEndDate,
                },
            },
        ],
        'type': 'document',
        'timestamp': startDate.toISOString().split('.')[0] + '+08:00',
        'entry': entries,
    };

    return bundleJsonPayload;
};

export function getObservationBundleJsonPayload(identifierValue, startDate, entries) {
    let startDateString = startDate.getFullYear() + '-' + String(startDate.getMonth() + 1) + '-' + startDate.getDate();
    let bundleJsonPayload = {
        'resourceType': 'Bundle',
        'identifier': [
            {
                'system': 'https://www.vghtc.gov.tw',
                'value': identifierValue,
                'period': {
                    'start': startDateString,
                },
            },
        ],
        'type': 'document',
        'timestamp': startDate.toISOString().split('.')[0] + '+08:00',
        'entry': entries,
    };

    return bundleJsonPayload;
};

export function getCompositionJsonPayload(patientReference, organizationReference, immunizationObservationReference, compositionType) {
    let todayDate = new Date();
    let todayISOString = todayDate.toISOString().split('.')[0] + '+08:00';
    let todayLocaleTimeStringArr = String(todayDate).split(' ');
    let todayLocaleTimeString = todayLocaleTimeStringArr.slice(1, todayLocaleTimeStringArr.length-4).join(' ');
    let compositionInfo = {
        'immunization': {
            'system': 'http://loinc.org',
            'code': '82593-5',
            'display': 'Immunization summary report',
        },
        'observation': {
            'system': 'http://loinc.org',
            'code': 'LP6464-4',
            'display': 'Nucleic acid amplification with probe detection',
        },
        'immunization_title': 'COVID-19 Vaccine',
        'observation_title': 'COVID-19 Test Certificate ' + todayLocaleTimeString,
    };
    let compositionJsonPayload = {
        'resourceType': 'Composition',
        'id': uuidv4(),
        'status': 'final',
        'type': {
            'coding': [
                compositionInfo[compositionType],
            ],
        },
        'subject': [
            {
                'reference': patientReference,
            }
        ],
        'date': todayISOString,
        'title': compositionInfo[compositionType + '_title'],
        'author': [
            {
                'reference': organizationReference,
            },
        ],
        'section': {
            'entry': [
                {
                    'reference': organizationReference,
                },
                {
                    'reference': patientReference,
                },
                {
                    'reference': immunizationObservationReference,
                },
            ],
        },
    };

    return compositionJsonPayload;
};

export function getImmunizationJsonPayload(form, vaccineDate) {
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
    };

    return immunizationJsonPayload;
};

export function getObservationJsonPayload(form, effectivePeriodStartDate, effectivePeriodEndDate) {
    let observationJsonPayload = {
        'resourceType': 'Observation',
        'id': uuidv4(),
        'status': 'final',
        'code': {
            'coding': [
                {
                    'system': 'http://loinc.org',
                    'code': 'LP6464-4',
                    'display': 'Nucleic acid amplification with probe detection',
                },
            ],
        },
        'effectivePeriod': {
            'start': effectivePeriodStartDate,
            'end': effectivePeriodEndDate,
        },
        'valueString': form.observationValue,
        'performer': [
            {
                'reference': 'Organization/' + form.orgId,
            },
        ],
    }

    return observationJsonPayload;
};

export async function createImmunizationResource(createImmunization, requestPayload, setJsonResponseText, setVisibleText) {
    let immunizationError = false;
    let immunizationId = '';
    let result = [];

    result = await Axios.post(process.env.REACT_APP_API_ADDRESS + createImmunization, requestPayload).then((response) => {
        immunizationId = response.data.id;
        return [
            immunizationError,
            immunizationId,
        ];
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setVisibleText('visible');
        immunizationId = true;
        return [
            immunizationError,
            immunizationId,
        ];
    });

    return result;
}

export async function createObservationResource(createObservation, requestPayload, setJsonResponseText, setVisibleText) {
    let observationError = false;
    let observationId = '';
    let result = [];

    result = await Axios.post(process.env.REACT_APP_API_ADDRESS + createObservation, requestPayload).then((response) => {
        observationId = response.data.id;
        return [
            observationError,
            observationId,
        ];
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setVisibleText('visible');
        observationError = true;
        return [
            observationError,
            observationId,
        ];
    });

    return result;
}

export async function createCompositionResource(createComposition, requestPayload, setJsonResponseText, setVisibleText) {
    let compositionError = false;
    let compositionId = '';
    let result = [];

    result = await Axios.post(process.env.REACT_APP_API_ADDRESS + createComposition, requestPayload).then((response) => {
        compositionId = response.data.id;
        return [
            compositionError,
            compositionId,
        ];
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setVisibleText('visible');
        compositionError = true;
        return [
            compositionError,
            compositionId,
        ];
    });

    return result;
}

const ResourceCreator = {
    getImmunizationBundleJsonPayload,
    getObservationBundleJsonPayload,
    getImmunizationJsonPayload,
    getObservationJsonPayload,
    getCompositionJsonPayload,
    createImmunizationResource,
    createCompositionResource,
    createObservationResource,
};

export default ResourceCreator;
