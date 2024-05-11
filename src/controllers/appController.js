//appController.js
import { Project } from '../models/projectModel';
import { Task } from '../models/taskModel';
import { loadFromLocalStorage } from '../utils/localStorage'
import { setProjects, setAllTasks, getProjects, getAllTasks, setCurrentProject, getCurrentProject } from "../models/appState";

export const initializeApp = () => {
    const projectData = loadFromLocalStorage();
    let loadedProjects = [];
    let loadedAllTasks = [];


    if (!projectData || projectData.length === 0) {
        const defaultProject = Project('Default');
        loadedProjects.push(defaultProject);
        setCurrentProject(defaultProject);
    } else {
        projectData.forEach(projData => {
            const proj = Project(projData.name);
            projData.tasks.forEach(taskData => {
                const loadedTask = Task(taskData.title, taskData.description, taskData.dueDate, taskData.priority, taskData.projectName, taskData.status);
                proj.addTask(loadedTask);
                loadedAllTasks.push(loadedTask);
            });
            loadedProjects.push(proj);
        });
        setCurrentProject(loadedProjects[0]);
    }

    setProjects(loadedProjects);
    setAllTasks(loadedAllTasks);


    console.log('Projects and All Tasks loaded:', getProjects, getAllTasks());
    return {
        projects: getProjects(),
        allTasks: getAllTasks(),
        currentProject: getCurrentProject()
    };
};



