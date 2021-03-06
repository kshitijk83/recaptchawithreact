import React, {useReducer, useRef} from 'react';
import ReCaptcha from 'react-google-recaptcha';
import useHttp from '../hooks/http';
import * as constants from '../constants';
import * as apiConstants from '../api';

const initState = {
    name: '',
    email: '',
    password: '',
    token: '',
    recaptchaRequired: false
}

const userReducer = (currentState, action)=>{
    switch (action.type){
        case constants.SET_NAME:
            return {
                ...currentState,
                name: action.value
            };
        case constants.SET_EMAIL:
            return {
                ...currentState,
                email: action.value
            };
        case constants.SET_PASSWORD:
            return {
                ...currentState,
                password: action.value
            };
        case constants.SET_TOKEN:
            return {
                ...currentState,
                token: action.value
            };
        case constants.SET_RECAPTCHA_REQUIRED:
            return {
                ...currentState,
                recaptchaRequired: action.value
            };
        case constants.CLEAR:
            return {
                ...currentState,
                name: '',
                email: '',
                password: '',
                token: '',
            }
        default:
            throw Error('Should not reach here');
    }
}

const Form = (props) => {
    const [state, dispatch] = useReducer(userReducer, initState); // a redecur hook for maintaining the form 
    const {
        httpState,
        sendRequest,
        clear,
    } = useHttp();

    const captchaRef = useRef(null);

    // for submitting the form
    const onSubmitHandler = (event)=>{
        event.preventDefault();
        let data = {
            name: state.name,
            email: state.email,
            password: state.password,
        }
        clear();

        if(state.recaptchaRequired&&state.token){
            // if captcha is required, i.e., person had made more than 3 requests in 1hr period
            data.recaptchaToken = state.token;
            sendRequest(apiConstants.SIGNUP_ROUTE, constants.POST, data)
            .then((res)=>{
                debugger;
                dispatch({type: constants.CLEAR});
                captchaRef.current.reset();
            })
        } else{
            // if captcha not required send the request without any recaptcha-token for verification
            sendRequest(apiConstants.SIGNUP_ROUTE, constants.POST, data)
            .then((data)=>{
                // if the back end requires recaptcha token, we will activate it
                dispatch({type: constants.CLEAR});
                if(data&&data.captchaRequired){
                    dispatch({type: constants.SET_RECAPTCHA_REQUIRED, value: data.captchaRequired})
                }
            })
        }
    }

    const onChange=(token)=>{
        // when recaptcha is verified, token is stored
        dispatch({type: constants.SET_TOKEN, value: token})
    }

    return (
        <form className="form" onSubmit={(e)=>onSubmitHandler(e)}>
            <div className="inputCon">
                <input type="text"
                required
                value={state.name}
                placeholder="Enter name"
                onChange={(event)=>dispatch({type: constants.SET_NAME, value: event.target.value})}
                />
            </div>
            <div className="inputCon">
                <input
                required
                type="email"
                value={state.email}
                placeholder="Enter email"
                onChange={(event)=>dispatch({type: constants.SET_EMAIL, value: event.target.value})}
                />
            </div>
            <div className="inputCon">
                <input
                required
                type="password"
                value={state.password}
                placeholder="Enter password"
                onChange={(event)=>dispatch({type: constants.SET_PASSWORD, value: event.target.value})}
                />
            </div>
            {state.recaptchaRequired?<ReCaptcha
                ref={captchaRef}
                sitekey="6LeLceIUAAAAAB-fTZBbFNzoSw15lIeopqRFgKI1"
                onChange={onChange}
                onExpired={()=>dispatch({type: constants.SET_TOKEN, value: ''})}
                />:null}
            <button type="submit" >Register</button>
            {httpState.isLoading?<div className="flash">{"Loading..."}</div>:null}
            {httpState.error?<div className="flash">{httpState.error+"*"}</div>:null}
            {httpState.successMessage?<div className="flash">{httpState.successMessage+"*"}</div>:null}
        </form>
    )
}

export default Form;