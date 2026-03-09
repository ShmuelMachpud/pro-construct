import axiosInstance from "../../global/services/axios";

export const getProjects = async () => {
  const response = await axiosInstance.get("/projects");
  return response.data;
};

export const createProject = async (data: any) => {
  const response = await axiosInstance.post("/projects", data);
  return response.data;
};