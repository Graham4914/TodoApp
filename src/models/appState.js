//appState.js

import { loadFromLocalStorage, saveToLocalStorage } from "../utils/localStorage";

//state for tasks
export let allTasksArray = [];
// State for projects
export let currentProject = null;
export let projectsArray = [];

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


export const getAllTasks = () => allTasksArray;
export const setAllTasks = (tasks) => {
    allTasksArray = tasks;

};
export const addTask = (task) => {
    allTasksArray.push(task);
};

// New function to get task by ID
export const getTaskById = (taskId) => {
    const allTasks = getAllTasks();
    return allTasks.find(task => task.id === taskId);
};

export const loadAppState = () => {
    projectsArray = loadFromLocalStorage('projects');
    allTasksArray = loadFromLocalStorage('tasks');
};

export const saveAppState = () => {
    saveToLocalStorage('projects', projectsArray);
    saveToLocalStorage('tasks', allTasksArray);
};