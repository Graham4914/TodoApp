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