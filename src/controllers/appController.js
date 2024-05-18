//appController.js
import { Project } from '../models/projectModel';
import { Task } from '../models/taskModel';
import { renderAllTasksView } from '../views/taskView';
import { loadFromLocalStorage, initializeLocalStorage, saveToLocalStorage } from '../utils/localStorage'
import { setProjects, setAllTasks, getProjects, getAllTasks, setCurrentProject, getCurrentProject, addProject } from "../models/appState";

export const initializeApp = () => {
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

    //     setProjects(loadedProjects);
    //     setAllTasks(loadedAllTasks);

    //     console.log('Projects and All Tasks loaded:', getProjects(), getAllTasks());
    //     return {
    //         projects: getProjects(),
    //         allTasks: getAllTasks(),
    //         currentProject: getCurrentProject()
    //     };
    // };

    // export const initializeApp = () => {

    //     initializeLocalStorage('projects'); // Ensure the 'projects' key is initialized
    //     initializeLocalStorage('tasks');

    //     const projectData = loadFromLocalStorage('projects');
    //     const taskData = loadFromLocalStorage('tasks');

    //     console.log('Loaded project data:', projectData);
    //     console.log('Loaded task data:', taskData);

    //     let loadedProjects = [];
    //     let loadedAllTasks = [];

    //     if (!Array.isArray(projectData) || projectData.length === 0) {
    //         const defaultProject = Project('Default');
    //         loadedProjects.push(defaultProject);
    //         setCurrentProject(defaultProject);
    //     } else {
    //         projectData.forEach(projData => {
    //             const proj = Project(projData.name);
    //             if (Array.isArray(projData.name));
    //             projData.tasks.forEach(taskData => {
    //                 const loadedTask = Task(taskData.title, taskData.description, taskData.dueDate, taskData.priority, taskData.projectName, taskData.status);
    //                 proj.addTask(loadedTask);
    //                 loadedAllTasks.push(loadedTask);
    //             });
    //             loadedProjects.push(proj);
    //         });

    //         setCurrentProject(loadedProjects[0]);

    //     }


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

    renderAllTasksView(loadedAllTasks);
    return {
        projects: getProjects(),
        allTasks: getAllTasks(),
        currentProject: getCurrentProject()
    };
};


