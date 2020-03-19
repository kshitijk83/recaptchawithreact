import Axios from 'axios';
import * as apiConstants from './api';

const instance = Axios.create({
    baseURL: apiConstants.BASE_URL,
    headers:{
        'Content-Type': 'application/json'
    },
    // timeout: 10000
});

export default instance;