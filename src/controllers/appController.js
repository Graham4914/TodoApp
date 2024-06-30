//appController.js
import { Project } from '../models/projectModel';
import { Task } from '../models/taskModel';
import { renderAllTasksView, renderTasks } from '../views/taskView';
import { loadFromLocalStorage, initializeLocalStorage, saveToLocalStorage } from '../utils/localStorage'
import { setProjects, setAllTasks, getProjects, getAllTasks, setCurrentProject, getCurrentProject, loadAppState, addProject, saveAppState } from "../models/appState";
// import { synchronizeProjectTasks } from '../utils/taskUtils';
import { createMainContent } from '../views/mainContentView';



// export const initializeApp = () => {
//     loadAppState();
//     initializeLocalStorage('projects');
//     initializeLocalStorage('tasks');

//     const projectData = loadFromLocalStorage('projects');
//     const taskData = loadFromLocalStorage('tasks');

//     let loadedProjects = [];
//     let loadedAllTasks = [];

//     if (projectData && projectData.length > 0) {
//         projectData.forEach(projData => {
//             const proj = Project(projData.name);
//             projData.tasks.forEach(taskData => {
//                 const loadedTask = Task(taskData.title, taskData.description, taskData.dueDate, taskData.priority, taskData.projectName, taskData.status);
//                 // Ensure task ID consistency
//                 loadedTask.id = taskData.id;
//                 proj.addTask(loadedTask);
//                 loadedAllTasks.push(loadedTask);
//             });
//             loadedProjects.push(proj);
//         });
//         setCurrentProject(loadedProjects[0]);
//     } else {
//         setCurrentProject(null);
//     }

//     // Load standalone tasks that are not part of any project
//     if (taskData && taskData.length > 0) {
//         taskData.forEach(taskData => {
//             // Check if task already exists in loadedAllTasks to avoid duplication
//             if (!loadedAllTasks.some(task => task.id === taskData.id)) {
//                 const loadedTask = Task(taskData.title, taskData.description, taskData.dueDate, taskData.priority, taskData.projectName, taskData.status);
//                 loadedTask.id = taskData.id; // Ensure task ID consistency
//                 loadedAllTasks.push(loadedTask);
//             }
//         });
//     }

//     setProjects(loadedProjects);
//     setAllTasks(loadedAllTasks);
//     synchronizeProjectTasks();
//     renderAllTasksView(getAllTasks());

//     return {
//         projects: getProjects(),
//         allTasks: getAllTasks(),
//         currentProject: getCurrentProject()
//     };
// };
export const initializeApp = () => {
    loadAppState();
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
                const loadedTask = Task(taskData.title, taskData.description, taskData.dueDate, taskData.priority, taskData.projectName, taskData.status);
                // Ensure task ID consistency
                loadedTask.id = taskData.id;
                proj.addTask(loadedTask);
                loadedAllTasks.push(loadedTask);
            });
            loadedProjects.push(proj);
        });
        setCurrentProject(loadedProjects[0]);
    } else {
        const tutorialProject = {
            name: "Tutorial",
            tasks: [
                {
                    id: `task-${Date.now()}-1`,
                    title: 'Welcome to the To-Do App!',
                    description: 'This application is designed for ease of use and functionality. You can create tasks which can be standalone or grouped into projects. All tasks are shown in the all tasks view unless they are completed, in which case they will move to the completed folder. Tasks in a project are also shown in the all tasks view and in the sidebar filters such as overdue, upcoming, etc., for an overview of all tasks.',
                    dueDate: new Date().toISOString().split('T')[0],
                    priority: 'medium',
                    projectName: 'Tutorial',
                    status: 'incomplete'
                },
                {
                    id: `task-${Date.now()}-2`,
                    title: 'Add and Edit a Task',
                    description: 'Click on the "Add Task" button on the sidebar or in the project view (green plus button) to create a new task. You can add a task to a project or leave it as a standalone task. When added, task counters in the sidebar filters will update to show the number of tasks in each filter. Click on a task to edit its details.',
                    dueDate: new Date().toISOString().split('T')[0],
                    priority: 'medium',
                    projectName: 'Tutorial',
                    status: 'incomplete'
                },
                {
                    id: `task-${Date.now()}-3`,
                    title: 'Complete and Delete Tasks or Projects',
                    description: 'Mark a task as complete by clicking the checkbox next to it. It will be crossed out and moved to the completed folder, disappearing from other views. You can uncheck it in the completed view to restore it. Delete a task using the trash icon on the task, or delete a project with the delete icon in the project view.',
                    dueDate: new Date().toISOString().split('T')[0],
                    priority: 'medium',
                    projectName: 'Tutorial',
                    status: 'incomplete'
                },
                {
                    id: `task-${Date.now()}-4`,
                    title: 'Add and Edit Projects',
                    description: 'Add a new project using the plus button in the sidebar. Type the project name and open it to add tasks. You can add tasks directly to the project or move existing tasks into it. Change the project name by clicking on the heading in the main view. Delete or close the project with the options at the top right of the project view.',
                    dueDate: new Date().toISOString().split('T')[0],
                    priority: 'medium',
                    projectName: 'Tutorial',
                    status: 'incomplete'
                },
                {
                    id: `task-${Date.now()}-5`,
                    title: 'Toggle Due Date and Priority',
                    description: 'Use the sort buttons to toggle tasks by due date or priority. The tasks will sort from oldest to newest or by priority levels (low to high).',
                    dueDate: new Date().toISOString().split('T')[0],
                    priority: 'medium',
                    projectName: 'Tutorial',
                    status: 'incomplete'
                },
                {
                    id: `task-${Date.now()}-6`,
                    title: 'Toggle Dark Mode and Sidebar View',
                    description: 'Toggle dark mode using the switch in the settings. For smaller screens or to maximize space, you can toggle the sidebar out of view.',
                    dueDate: new Date().toISOString().split('T')[0],
                    priority: 'medium',
                    projectName: 'Tutorial',
                    status: 'incomplete'
                },
                {
                    id: `task-${Date.now()}-7`,
                    title: 'Managing the Tutorial and Projects',
                    description: 'When done with the tutorial, you can delete it or its tasks. Deleting the tutorial project won’t delete its tasks; they will remain in the all tasks view. Rename the tutorial project if desired. If no other projects are present, the application will reload the tutorial project upon restart to ensure you always have a default project available.',
                    dueDate: new Date().toISOString().split('T')[0],
                    priority: 'medium',
                    projectName: 'Tutorial',
                    status: 'incomplete'
                }
            ]
        };

        // Add tutorial tasks to allTasks
        tutorialProject.tasks.forEach(task => {
            loadedAllTasks.push(task);
        });

        loadedProjects.push(tutorialProject);
        setCurrentProject(tutorialProject);

        saveAppState();
    }

    // Load standalone tasks that are not part of any project
    if (taskData && taskData.length > 0) {
        taskData.forEach(taskData => {
            // Check if task already exists in loadedAllTasks to avoid duplication
            if (!loadedAllTasks.some(task => task.id === taskData.id)) {
                const loadedTask = Task(taskData.title, taskData.description, taskData.dueDate, taskData.priority, taskData.projectName, taskData.status);
                loadedTask.id = taskData.id; // Ensure task ID consistency
                loadedAllTasks.push(loadedTask);
            }
        });
    }

    setProjects(loadedProjects);
    setAllTasks(loadedAllTasks);
    synchronizeProjectTasks();

    renderAllTasksView(getAllTasks());

    return {
        projects: getProjects(),
        allTasks: getAllTasks(),
        currentProject: getCurrentProject()
    };
};



export const synchronizeProjectTasks = () => {
    const projects = getProjects();
    const allTasks = getAllTasks();

    projects.forEach(project => {
        project.tasks = allTasks.filter(task => task.projectName === project.name && task.status !== 'complete');
    });

    setProjects(projects);
};