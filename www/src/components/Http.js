import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.GATSBY_API_URL,
  crossdomain: true,
});

export default instance;
