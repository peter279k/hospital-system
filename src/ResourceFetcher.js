import Axios from 'axios';
import { validate } from 'uuid';


var fhirServer = 'http://localhost:8000/api/fhir_server';
var queryPatient = 'http://localhost:8000/api/QueryPatient';
var getOrganization = 'http://localhost:8000/api/GetOrganization';
var getImmunization = 'http://localhost:8000/api/GetImmunization';
var getComposition = 'http://localhost:8000/api/GetComposition';
var getObservation = 'http://localhost:8000/api/GetObservation';

var urnUuidPrefix = 'urn:uuid:';

export async function getCompositionResourceById(compositionId, fhirServerUrl, setJsonResponseText, setErrorResponseText, setVisibleText) {
    let fullUrl = fhirServerUrl + '/Composition/' + compositionId;
    if (validate(compositionId)) {
        fullUrl = urnUuidPrefix + compositionId;
    }
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

export async function getOrganizationResourceById(organizationId, fhirServerUrl, setJsonResponseText, setErrorResponseText, setVisibleText) {
    let fullUrl = fhirServerUrl + '/Organization/' + organizationId;
    if (validate(organizationId)) {
        fullUrl = urnUuidPrefix + organizationId;
    }
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

export async function getPatientResourceById(patientId, fhirServerUrl, setJsonResponseText, setErrorResponseText, setVisibleText) {
    let fullUrl = fhirServerUrl + '/Patient/' + patientId;
    if (validate(patientId)) {
        fullUrl = urnUuidPrefix + patientId;
    }
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

export async function getImmunizationResourceById(immunizationId, fhirServerUrl, setJsonResponseText, setErrorResponseText, setVisibleText) {
    let fullUrl = fhirServerUrl + '/Immunization/' + immunizationId;
    if (validate(immunizationId)) {
        fullUrl = urnUuidPrefix + immunizationId;
    }
    let immunizationResource = {
        'fullUrl': fullUrl,
        'resource': {},
    };
    let apiUrl = getImmunization + '/' + immunizationId;
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

export async function getObservationResourceById(observationId, fhirServerUrl, setJsonResponseText, setErrorResponseText, setVisibleText) {
    let fullUrl = fhirServerUrl + '/Observation/' + observationId;
    if (validate(observationId)) {
        fullUrl = urnUuidPrefix + observationId;
    }
    let observationResource = {
        'fullUrl': fullUrl,
        'resource': {},
    };
    let apiUrl = getObservation + '/' + observationId;
    await Axios.get(apiUrl).then((response) => {
        observationResource['resource'] = response.data;
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setErrorResponseText('回應JSON (Get Observation Resource Error Response)');
        setVisibleText('visible');
    });

    return observationResource;
}

export async function getFhirServerUrl(setJsonResponseText, setErrorResponseText, setVisibleText) {
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

const ResourceFetcher = {
    getCompositionResourceById,
    getOrganizationResourceById,
    getPatientResourceById,
    getImmunizationResourceById,
    getObservationResourceById,
    getFhirServerUrl,
};

export default ResourceFetcher;
