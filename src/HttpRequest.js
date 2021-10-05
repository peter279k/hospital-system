import Axios from 'axios';

export function sendPatientData(form, startDate) {
    return [form, startDate];
};

export function sendPatientData2() {
    Axios.get('https://jsonplaceholder.typicode.com/posts/3').then(
        result => this.setState({
            data: [...result.data],
        })
    );
};

const HttpRequest = {
    sendPatientData,
    sendPatientData2,
};
export default HttpRequest;
