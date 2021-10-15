import Axios from 'axios';


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

export function getCompositionJsonPayload(patientReference, startDate, organizationReference, immunizationReference) {
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
                'reference': patientReference,
            }
        ],
        'date': startDate.toISOString().split('.')[0] + '+08:00',
        'title': 'COVID-19 Vaccine',
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
                    'reference': immunizationReference,
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

export async function createImmunizationResource(createImmunization, requestPayload, setJsonResponseText, setVisibleText) {
    let immunizationError = false;
    let immunizationId = '';

    await Axios.post(createImmunization, requestPayload).then((response) => {
        immunizationId = response.data.id;
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setVisibleText('visible');
        immunizationError = true;
    });

    return [
        immunizationError,
        immunizationId,
    ];
}

export async function createCompositionResource(createComposition, requestPayload, setJsonResponseText, setVisibleText) {
    let compositionError = false;
    let compositionId = '';

    await Axios.post(createComposition, requestPayload).then((response) => {
        compositionId = response.data.id;
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setVisibleText('visible');
        compositionError = true;
    });

    return [
        compositionError,
        compositionId,
    ];
}

export function getObservationBundleJsonPayload(form) {
};

const ResourceCreator = {
    getImmunizationBundleJsonPayload,
    getObservationBundleJsonPayload,
    getImmunizationJsonPayload,
    getCompositionJsonPayload,
    createImmunizationResource,
    createCompositionResource,
};

export default ResourceCreator;
