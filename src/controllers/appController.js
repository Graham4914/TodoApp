//appController.js
import { Project } from '../models/projectModel';
import { Task } from '../models/taskModel';
import { renderAllTasksView, renderTasks } from '../views/taskView';
import { loadFromLocalStorage, initializeLocalStorage, saveToLocalStorage } from '../utils/localStorage'
import { setProjects, setAllTasks, getProjects, getAllTasks, setCurrentProject, getCurrentProject, loadAppState, addProject } from "../models/appState";
import { createMainContent } from '../views/mainContentView';




export const initializeApp = () => {
    loadAppState();
    console.log('App sate initialized')
    initializeLocalStorage('projects');
    initializeLocalStorage('tasks');

    const projectData = loadFromLocalStorage('projects');
    const taskData = loadFromLocalStorage('tasks');

    let loadedProjects = [];
    let loadedAllTasks = [];

    if (projectData && projectData.length > 0) {
        projectData.forEach(projData => {
            const proj = Project(projData.name);
            projData.tasks.forEach(taskData => {
                if (!loadedAllTasks.some(task => task.id === taskData.id)) {
                    const loadedTask = Task(taskData.title, taskData.description, taskData.dueDate, taskData.priority, taskData.projectName, taskData.status);
                    proj.addTask(loadedTask);
                    loadedAllTasks.push(loadedTask);
                }

            });
            loadedProjects.push(proj);
        });
        setCurrentProject(loadedProjects[0]);
    } else {
        setCurrentProject(null);
    }
    // Load standalone tasks that are not part of any project
    if (taskData && taskData.length > 0) {
        taskData.forEach(taskData => {
            const loadedTask = Task(taskData.title, taskData.description, taskData.dueDate, taskData.priority, taskData.projectName, taskData.status);
            loadedAllTasks.push(loadedTask);
        });
    }

    setProjects(loadedProjects);
    setAllTasks(loadedAllTasks);

    console.log('Projects and All Tasks loaded:', getProjects(), getAllTasks());
    // renderAllTasksView(loadedAllTasks);


    return {
        projects: getProjects(),
        allTasks: getAllTasks(),
        currentProject: getCurrentProject()
    };
};


