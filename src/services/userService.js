import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${process.env.USER_URL}/users`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch games data from REST API');
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${process.env.USER_URL}/users`, userData);
    return response.data;
  } catch (error) {
    // console.error(error);
    throw new Error('Failed to create user through REST API');
  }
};
