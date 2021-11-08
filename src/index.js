import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Import Bootstrap Datepicker for React.js
import "react-datepicker/dist/react-datepicker.css";

ReactDOM.render(<App />, document.getElementById('root'));

serviceWorkerRegistration.unregister();
