import Http from './Http';


export const fetchCompositions = () => {
  return Http.get('/compositions');
};

export const closeConnection = () => {
  navigator.sendBeacon(`${process.env.GATSBY_API_URL}/close`, '');
};

export const createComposition = (args = {}) => {
  return Http.post('/create', args);
};

export const updateComposition = (args = {}) => {
  return Http.post('/update', args);
};