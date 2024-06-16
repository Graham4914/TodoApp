//taskController.js
import { Task } from '../models/taskModel';
import { renderAllTasksView, renderTasks, showTaskDetailModal, closeTaskDetailModal, hideTaskDetailModal, toggleTaskFormVisibility, closeNewTaskModal } from '../views/taskView';
import { saveToLocalStorage } from '../utils/localStorage';
import { isTaskDueToday, isTaskOverdue, isTaskUpcoming, isTaskCompleted, calculateTaskCount, updateCounters } from '../utils/taskUtils';
import { updateMainContentForProject } from './projectController';
import { projectsArray, getCurrentProject, getProjects, getAllTasks, getTaskById, setAllTasks, saveAppState, setProjects } from '../models/appState';

let currentEditingTaskId = null;

const openTaskDetail = (taskId) => {
    const task = getTaskById(taskId);
    if (task) {
        currentEditingTaskId = task.id;
        showTaskDetailModal(task);
        console.log("Opening task detail for ID:", currentEditingTaskId); // Debugging line
    } else {
        console.error("Task not found with ID:", taskId);
    }
};

const closeTaskDetail = () => {
    saveCurrentTask(currentEditingTaskId);
    currentEditingTaskId = null;
    hideTaskDetailModal();
    updateCounters();
};

function deleteTask(taskToDelete) {
    const projects = getProjects();
    const allTasks = getAllTasks();
    // Remove task from its project
    const project = projects.find(p => p.name === taskToDelete.projectName);
    if (project) {
        project.tasks = project.tasks.filter(task => task.id !== taskToDelete.id);
    }

    // Remove task from allTasksArray
    const updatedAllTasks = allTasks.filter(task => task.id !== taskToDelete.id);

    setProjects(projects);
    setAllTasks(updatedAllTasks);
    saveToLocalStorage('projects', projects);
    saveToLocalStorage('tasks', updatedAllTasks);
    renderAllTasksView(updatedAllTasks);
    updateCounters();
}


const saveCurrentTask = (taskId) => {
    console.log("Task ID in saveCurrentTask:", taskId);
    const task = getTaskById(taskId);
    if (!task) {
        console.error('Task not found with ID:', taskId);
        return;
    }

    const projects = getProjects();
    const allTasks = getAllTasks();

    // Update task details
    task.title = document.getElementById('modalTitle').value;
    task.description = document.getElementById('modalDescription').value;
    task.dueDate = document.getElementById('modalDueDate').value;
    task.priority = document.getElementById('modalPriority').value;

    const newProjectName = document.getElementById('modalProjectSelect').value;

    // Check if task has been reassigned to a new project
    if (task.projectName !== newProjectName) {
        const oldProject = projects.find(p => p.name === task.projectName);
        if (oldProject) {
            oldProject.tasks = oldProject.tasks.filter(t => t.id !== taskId);
        }

        const newProject = projects.find(p => p.name === newProjectName);
        if (newProject) {
            task.projectName = newProjectName;
            newProject.tasks.push(task);
        } else {
            console.error("New project not found:", newProjectName);
        }
    }

    // Update the allTasks array
    const taskIndex = allTasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        allTasks[taskIndex] = task;
    }

    setProjects(projects);
    setAllTasks(allTasks);

    saveAppState();
    renderAllTasksView(allTasks);
    updateMainContentForProject(getCurrentProject());
    updateCounters();

    console.log("Updated Task Data", JSON.stringify(task));
};

const addTaskToProject = (title, description, dueDate, priority, projectName) => {
    console.log('Adding task with:', { title, description, dueDate, priority, projectName });
    const projects = getProjects();
    const allTasks = getAllTasks();

    console.log('Current state before adding:', { allTasks, projects });

    try {
        const newTask = {
            id: `task-${Date.now()}`, // Generate a unique ID for the task
            title,
            description,
            dueDate,
            priority,
            projectName,
            status: 'incomplete' // Default status
        };
        allTasks.push(newTask);

        if (projectName) {
            const project = projects.find(p => p.name === projectName);
            console.log('Found project:', project);
            if (project) {
                project.tasks.push(newTask);
            } else {
                console.log('No project found with name:', projectName);
            }
        }

        setAllTasks(allTasks);
        setProjects(projects);
        saveAppState();
        renderAllTasksView(allTasks);
        updateCounters();
        console.log('Task added, updated tasks list:', allTasks);
    } catch (error) {
        console.error('Failed to add task in addTaskToProject:', error);
        throw error; // Rethrow or handle the error appropriately
    }
};


const handleFormSubmit = (event) => {
    event.preventDefault();

    const form = event.target;
    const title = form.elements['title']?.value.trim();
    const description = form.elements['description']?.value.trim();
    const dueDate = form.elements['due-date']?.value;
    const priority = form.elements['priority']?.value;
    const projectName = form.elements['projectSelect']?.value;

    if (!title) {
        alert("Please enter a title for the task.");
        return;
    }

    try {
        addTaskToProject(title, description, dueDate, priority, projectName);
        toggleTaskFormVisibility(false);
        console.log('Task added successfully:', { title, description, dueDate, priority, projectName });
        alert("Task added successfully.");
        closeNewTaskModal();
    } catch (error) {
        console.error('Error adding task:', error);
        alert("Failed to add task.");
    }
};


export { deleteTask, saveCurrentTask, addTaskToProject, handleFormSubmit, openTaskDetail, closeTaskDetail };