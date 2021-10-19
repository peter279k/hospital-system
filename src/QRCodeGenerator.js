import Axios from 'axios';


var generateQRCodeUrl = 'http://localhost:8000/api/GenerateQRCode';


export function generateQRCode(bundlePayload, setQRCodeImage, setQRCodeVisibleText, setErrorResponseText) {
    Axios.post(generateQRCodeUrl, bundlePayload).then((response) => {
        let responseJson = response.data;
        let base64QRCodeImage = 'data:image/png;base64, ' + responseJson['qrcode_image'];
        setQRCodeImage(base64QRCodeImage);
        setQRCodeVisibleText('visible');
        setErrorResponseText('健康通行碼QRCode');
    }).catch((error) => {
        console.log(error.response);
        setErrorResponseText('健康通行碼QRCode產生失敗');
        setQRCodeVisibleText('invisible');
    });

};

const QRCodeGenerator = {
    generateQRCode,
};

export default QRCodeGenerator;
