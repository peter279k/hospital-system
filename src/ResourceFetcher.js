import Axios from 'axios';
import { validate } from 'uuid';


var fhirServer = 'http://localhost:80/api/fhir_server';
var queryPatient = 'http://localhost:80/api/QueryPatient';
var getOrganization = 'http://localhost:80/api/GetOrganization';
var getImmunization = 'http://localhost:80/api/GetImmunization';
var getComposition = 'http://localhost:80/api/GetComposition';
var getObservation = 'http://localhost:80/api/GetObservation';

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
    let resource = {};
    resource = await Axios.get(apiUrl).then((response) => {
        return response.data;
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setErrorResponseText('回應JSON (Get Composition Resource Error Response)');
        setVisibleText('visible');
        return false;
    });
    if (resource) {
        compositionResource['resource'] = resource;
    }

    return compositionResource;
};

export async function getOrganizationResourceById(organizationId, fhirServerUrl, setJsonResponseText, setErrorResponseText, setVisibleText) {
    let fullUrl = fhirServerUrl + '/Organization/' + organizationId;
    if (validate(organizationId)) {
        fullUrl = urnUuidPrefix + organizationId;
    }
    let organizationResource = {
        'fullUrl': fullUrl,
        'resource': {},
    };
    let resource = {};
    let apiUrl = getOrganization + '/' + organizationId;
    resource = await Axios.get(apiUrl).then((response) => {
        return response.data;
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setErrorResponseText('回應JSON (Get Organization Resource Error Response)');
        setVisibleText('visible');
        return false;
    });
    if (resource) {
        organizationResource['resource'] = resource;
    }

    return organizationResource;
};

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
    let resource = {};
    resource = await Axios.get(apiUrl).then((response) => {
        return response.data;
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setErrorResponseText('回應JSON (Get Patient Resource Error Response)');
        setVisibleText('visible');
        return false;
    });

    if (resource) {
        patientResource['resource'] = resource;
    }

    return patientResource;
};

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
    let resource = {};
    resource = await Axios.get(apiUrl).then((response) => {
        return response.data;
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setErrorResponseText('回應JSON (Get Immunization Resource Error Response)');
        setVisibleText('visible');
        resource = false;
    });

    if (resource) {
        immunizationResource['resource'] = resource;
    }

    return immunizationResource;
};

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
    let resource = {};
    resource = await Axios.get(apiUrl).then((response) => {
        return response.data;
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setErrorResponseText('回應JSON (Get Observation Resource Error Response)');
        setVisibleText('visible');
        return false;
    });

    if (resource) {
        observationResource['resource'] = resource;
    }

    return observationResource;
}

export async function getFhirServerUrl(setJsonResponseText, setErrorResponseText, setVisibleText) {
    let fhirServerUrl = '';
    fhirServerUrl = await Axios.get(fhirServer).then((response) => {
        return response.data.fhir_server;
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setErrorResponseText('回應JSON (Get FHIR Server URL Error Response)');
        setVisibleText('visible');
        return false;
    });

    return fhirServerUrl;
};

export async function getObservationBundleById(observationBundleId) {
    let apiObservationBundleUrl = getObservation + '/' + observationBundleId;
    let observationBundle = {};

    observationBundle = await Axios.get(apiObservationBundleUrl).then((response) => {
        return response.data;
    }).catch((error) => {
        return error.response;
    });

    return observationBundle;
};

const ResourceFetcher = {
    getCompositionResourceById,
    getOrganizationResourceById,
    getPatientResourceById,
    getImmunizationResourceById,
    getObservationResourceById,
    getObservationBundleById,
    getFhirServerUrl,
};

export default ResourceFetcher;
