import Axios from 'axios';


export async function checkPatientResourceByUrl(apiUrl, setJsonResponseText, setVisibleText) {
    let patientIdError = false;
    await Axios.get(apiUrl).then((response) => {
        console.log(response.data);
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setVisibleText('visible');
        patientIdError = true;
    });

    return patientIdError;
};

export async function checkOrgResourceByUrl(apiUrl, setJsonResponseText, setVisibleText) {
    let orgIdError = false;
    await Axios.get(apiUrl).then((response) => {
        console.log(response.data);
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setVisibleText('visible');
        orgIdError = true;
    });

    return orgIdError;
};

const ResourceChecker = {
    checkPatientResourceByUrl,
    checkOrgResourceByUrl,
};
export default ResourceChecker;
