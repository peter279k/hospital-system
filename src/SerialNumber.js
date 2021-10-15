import { v4 as uuidv4 } from 'uuid';


export function getSerialNumber() {
    return uuidv4().split('-')[0];
}

const SerialNumber = {
    getSerialNumber,
};

export default SerialNumber;
