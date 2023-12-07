import axios from 'axios';

const apiURL =
  typeof process !== 'undefined'
    ? process.env.BLOG_ADMIN_BASE_URL
    : import.meta.env.VITE_APP_BLOG_ADMIN_BASE_URL || '';

export const axiosClient = axios.create({
  baseURL: `${apiURL || ''}/api`
});
