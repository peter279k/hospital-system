import Axios from 'axios';

var fhirServer = 'http://localhost:8000/api/fhir_server';


export function sendPatientData(form, startDate) {
    return [form, startDate];
};

export function sendPatientData2(setJsonResponseText) {
    Axios.get('https://jsonplaceholder.typicode.com/posts/3').then(
        result => {
            console.log(result.data);
            setJsonResponseText([{value: 1}, {value: 2}]);
        }
    );
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
    sendPatientData2,
    sendFHIRServerData,
};
export default HttpRequest;
