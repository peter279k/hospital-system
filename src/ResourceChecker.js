import Axios from 'axios';


export async function checkPatientResourceByUrl(apiUrl, setJsonResponseText, setVisibleText) {
    let patientIdError = false;
    patientIdError = await Axios.get(apiUrl).then((response) => {
        console.log(response.data);
        return false;
    }).catch((error) => {
        let errResponseJsonString = JSON.stringify(error.response, null, 2);
        setJsonResponseText(errResponseJsonString);
        setVisibleText('visible');
        return true;
    });

    return patientIdError;
};

export async function checkOrgResourceByUrl(apiUrl, setJsonResponseText, setVisibleText) {
    let orgIdError = false;
    orgIdError = await Axios.get(apiUrl).then((response) => {
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
