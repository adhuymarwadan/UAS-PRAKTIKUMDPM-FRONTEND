import axios from "axios";

const BASE_URL = "http://192.168.10.8:5000";

export const fetchEmployees = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/employees`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

export const addEmployee = async (employeeData) => {
  try {
    const response = await axios.post(`${BASE_URL}/employees`, employeeData);
    return response.data;
  } catch (error) {
    console.error("Error adding employee:", error);
    throw error;
  }
};

export const fetchEmployeeById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/employees/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching employee by ID:", error);
    throw error;
  }
};

export const updateEmployee = async (id, employeeData) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/employees/${id}`,
      employeeData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};

export const deleteEmployee = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/employees/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error;
  }
};
