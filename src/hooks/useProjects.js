import useSWR from "swr";
import axios from "axios";

const fetcher = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching project data:", error);
    throw error;
  }
};

const useProjects = () => {
  const { data, error, isLoading } = useSWR(
    `${import.meta.env.VITE_BASE_URL}/api/projects`,
    fetcher
  );

  const projectOptions = data
    ? data.map((project) => ({
        value: project.projectId,
        label: project.project,
      }))
    : [];

  const taskOptions = (projectId) => {
    const selectedProject = data?.find((p) => p.projectId === projectId);
    return selectedProject
      ? selectedProject.tasks.map((task) => ({
          value: task.taskId,
          label: task.task,
        }))
      : [];
  };

  return { projectOptions, taskOptions, error, isLoading };
};

export default useProjects;
