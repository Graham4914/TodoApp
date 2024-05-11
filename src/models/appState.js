//appState.js
// State for projects
let currentProject = null;
let projectsArray = [];

// Projects handling
export const getProjects = () => projectsArray;
export const setProjects = (projects) => {
    projectsArray = projects;
};
export const getCurrentProject = () => currentProject;
export const setCurrentProject = (project) => {
    currentProject = project;
};
export const addProject = (project) => {
    projectsArray.push(project);
};

// Tasks handling
let allTasksArray = [];

export const getAllTasks = () => allTasksArray;
export const setAllTasks = (tasks) => {
    allTasksArray = tasks;
};
export const addTask = (task) => {
    allTasksArray.push(task);
};