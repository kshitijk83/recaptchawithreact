import React, {useEffect} from 'react';
import { loadReCaptcha } from 'react-recaptcha-google'
import Form from './components/Form';

function App() {

  useEffect(()=>{
    loadReCaptcha();
  },[]);

  return (
    <div className="App">
      <Form />
    </div>
  );
}

export default App;