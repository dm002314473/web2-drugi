import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [userInput, setUserInput] = useState('');
  const [enableXSS, setEnableXSS] = useState(false);
  const [message, setMessage] = useState('');

  const [name, setName] = useState('');
  const [oib, setOIB] = useState('');
  const [enableSensitiveData, setEnableSensitiveData] = useState(false);
  const [sensitiveDataMessage, setSensitiveDataMessage] = useState('');

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const toggleXSS = () => {
    setEnableXSS(!enableXSS);
  };

  const renderXSS = () => {
    if (enableXSS) {
      return <div dangerouslySetInnerHTML={{ __html: userInput }} />;
    } else {
      return <div>{userInput}</div>;
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleOIBChange = (e) => {
    setOIB(e.target.value.replace(/[^0-9]/g, ''));
  };

  const toggleSensitiveData = () => {
    setEnableSensitiveData(!enableSensitiveData);
  };

  const handleXSSStoreData = async () => {
    try {
      console.log("userInput: ", userInput);
      await api.post('/api/xss-data', { userInput });
      console.log('Data stored successfully');
      const storedMessage = enableXSS ? 'Vidljiv je samo tekst koji se nalazi izvan <script> taba, u bazu je svejedno spremljen i potencijalni zlonamjerni tekst' : 'Vidljiv je čitav tekst koji korisnik unese te se mogu poduzeti mjere zaštite';
      setMessage(storedMessage);  
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  const handleSensitiveDataStore = async () => {
    try {
      console.log("Name: ", name);
      console.log("OIB: ", oib);

      if (enableSensitiveData) {
        console.log("Sensitive data exposure enabled");
        console.log("Encrypted OIB: ", encryptFunction(oib));
      } else {
        console.log("Exposed OIB: ", oib);
      }

      await api.post('/api/sensitive-data', {
        oib: enableSensitiveData ? encryptFunction(oib) : oib,
        name: name,
      });
      console.log('Data stored successfully');

      const sensitiveDataMessage = enableSensitiveData
        ? 'U bazu se sprema enkriptirani tekst'
        : 'U bazu se sprema nezaštićeni tekst';
      setSensitiveDataMessage(sensitiveDataMessage);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  const encryptFunction = (data) => {
    const key = 'key';
    let encryptedData = '';
  
    //jednostavna enkripcija radi primjera
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      encryptedData += String.fromCharCode(charCode);
    }
    return encryptedData;
  }

  const api = axios.create({
    baseURL: 'http://localhost:5000',
  });

  return (
    <div>
      <h1>XSS Example</h1>
      <label>
        Enable/Disable XSS:
        <input type="checkbox" onChange={toggleXSS} />
      </label>
      <div>
        User Input:
        <input type="text" onChange={handleInputChange} value={userInput} />
      </div>
      <button onClick={handleXSSStoreData}>Store XSS Data</button>
      {renderXSS()}
      {message && <p>{message}</p>}
      
      <h1>Sensitive Data Exposure Example</h1>
      <div>
        Name:
        <input type="text" onChange={handleNameChange} value={name} />
      </div>
      <div>
        OIB:
        <input type="password" onChange={handleOIBChange} value={oib} />
      </div>
      <label>
        Enable/Disable Sensitive Data Exposure:
        <input type="checkbox" onChange={toggleSensitiveData} />
      </label>
      <button onClick={handleSensitiveDataStore}>Store Sensitive Data</button>
      {sensitiveDataMessage && <p>{sensitiveDataMessage}</p>}
    </div>
  );
}

export default App;
