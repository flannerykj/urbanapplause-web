import C from '../constants';
import moment from 'moment';
import 'moment/min/locales'

let baseURL = C.SERVER_URL;

const initSettings = () => {
  const savedLanguage = localStorage.getItem('languagePref');
  const initLanguage = savedLanguage ? savedLanguage : "en";
  return function(dispatch, getState) {
    localStorage.setItem('languagePref', initLanguage||"en")
    dispatch(setLanguage(initLanguage));
  }
}
export const setLanguage = (languagePref) => {
  moment.locale(languagePref);
  return function(dispatch, getState) {
    localStorage.setItem('languagePref', languagePref)
    dispatch({type: 'SET_LANGUAGE', languagePref: languagePref});
  }
}
export default {initSettings, setLanguage};







