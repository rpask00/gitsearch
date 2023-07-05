import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import './styles/fontello/css/fontello.css';
import './styles/fontello-2175d362/css/fontello.css';
import {BrowserRouter} from 'react-router-dom';

document.body.style.backgroundColor = 'rgb(19, 42, 19)';

ReactDOM.render(
   <BrowserRouter>
      <React.StrictMode>
         <App />
      </React.StrictMode>
   </BrowserRouter>,

   document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
