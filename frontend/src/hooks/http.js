import { useReducer, useCallback } from 'react';
import instance from '../instance';
import * as appConstants from '../constants';

const initialState = {
    isLoading: false,
    error: null,
    data: null,
    successMessage: null,
}

const httpReducer = (currentState, action)=>{
    switch (action.type) {
        case appConstants.SEND:
            return { isLoading: true, error: null, successMessage: null };
        case appConstants.RESPONSE:
            return { ...currentState, isLoading: false, data: action.data, successMessage: action.successMessage };
        case appConstants.ERROR:
            return { isLoading: false, error: action.errorMessage, successMessage: null };
        case appConstants.CLEAR:
            return { ...currentState, error: null, successMessage: null, identifier: null };
        default:
            throw Error('Should not be reached!');
    }
}

const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

    const clear = useCallback(()=>{
        dispatchHttp({type: appConstants.CLEAR});
    },[]);

    const sendRequest =useCallback((url, method, data)=>{
        dispatchHttp({type: appConstants.SEND });
        return instance({
            method,
            url,
            data,
        })
        .then(response=>{
            dispatchHttp({type: appConstants.RESPONSE, data: response.data, successMessage: response.data.message})
            return response.data;
        })
        .catch(err=>{
            // console.log(err);
            const error = (err.response&&err.response.data&&err.response.data.message)||'Unknown Error';
            dispatchHttp({type: appConstants.ERROR, errorMessage: error});
        })
    },[]);

    return{
        httpState,
        dispatchHttp,
        sendRequest,
        clear
    }
};

export default useHttp;