import { Project } from "../models/projectModel";
import { Task } from "../models/taskModel";
import { loadFromLocalStorage } from '../utils/localStorage'

export const initializeApp = () => {
    const projectData = loadFromLocalStorage();

    projectsArray = [];
    allTasksArray = [];
    savedProjects.forEach(projData => {
        const proj = Project(projData.name);
        projData.tasks.forEach(task => {
            const loadedTask = Task(task.title, task.description, task.dueDate, task.priority, task.projectName, task.status);
            proj.addTask(loadedTask); ``
            allTasksArray.push(loadedTask);
        });
        projectsArray.push(proj);
    });

    console.log('Projects and All Tasks loaded:', projectsArray, allTasksArray);
    return { projectsArray, allTasksArray };
};