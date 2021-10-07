import Axios from 'axios';

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

const HttpRequest = {
    sendPatientData,
    sendPatientData2,
};
export default HttpRequest;
