// scroll bar
import 'simplebar/src/simplebar.css';
import "./index.css"

// import ReactDOM from 'react-dom/client';
import  ReactDOM  from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import GlobalContext from './global/GlobalContext/GlobalContext';
//
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';


// ----------------------------------------------------------------------
//=========== PLEASE REMOVE THIS CONSOLE.LOG STATEMENT WHEN YOU ARE IN DEVELOPMENT==============
console.log = function() {}
//========= PLEASE REMOVE THIS CONSOLE.LOG STATEMENT WHEN YOU ARE IN DEVELOPMENT============


// const root = ReactDOM.createRoot(document.getElementById('root'));

ReactDOM.render(
  <GlobalContext>
    <BrowserRouter>
  <HelmetProvider>
      <App />
  </HelmetProvider>
  </BrowserRouter>
  </GlobalContext>,
  document.getElementById('root')
);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
