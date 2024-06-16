// sidebarView.js

import { createProjectListElement } from "./projectView";
import { showTaskForm, renderAllTasksView, renderFilteredTasks } from "./taskView";
import { getProjects, setProjects, addProject, getAllTasks } from "../models/appState";
import { updateCounters } from "../utils/taskUtils";


const createSidebar = () => {

    const sidebar = document.createElement('div');
    sidebar.classList.add('sidebar');
    sidebar.id = 'sidebar';

    // Task Header Container
    const taskHeaderContainer = document.createElement('div');
    taskHeaderContainer.classList.add('task-header-container');

    const tasksHeading = document.createElement('h2');
    tasksHeading.classList.add('tasks-heading');
    tasksHeading.textContent = 'Tasks';

    const taskControls = document.createElement('div');
    taskControls.classList.add('task-controls');

    const addTaskButton = document.createElement('button');
    addTaskButton.classList.add('uniform-plus-button', 'add-project-button');
    addTaskButton.innerHTML = '<i class="fas fa-plus"></i>';
    addTaskButton.addEventListener('click', () => {
        showTaskForm();
    });

    taskControls.appendChild(addTaskButton);
    taskHeaderContainer.appendChild(tasksHeading);
    taskHeaderContainer.appendChild(taskControls);
    sidebar.appendChild(taskHeaderContainer);


    const buttonNames = ['All', 'Today', 'Upcoming', 'Overdue', 'Completed'];
    buttonNames.forEach(name => {
        const button = document.createElement('button');
        button.textContent = `${name} `;
        button.classList.add('nav-button');
        button.id = `${name.toLowerCase().replace(' ', '-')}-button`;

        console.log(`Created button with ID: ${button.id}`); // Debugging line

        const counter = document.createElement('span');
        counter.classList.add('task-counter');
        button.appendChild(counter);

        button.addEventListener('click', () => {
            const filterType = name.toLowerCase().replace(' ', '');
            console.log(`Button clicked: ${filterType}`);
            renderFilteredTasks(filterType);
            updateCounters();
        });

        sidebar.appendChild(button);
    });

    const projectListContainer = createProjectListElement();
    sidebar.appendChild(projectListContainer);

    // Burger Menu (Toggle Button)
    const burgerMenu = document.createElement('button');
    burgerMenu.id = 'burger-menu';
    burgerMenu.classList.add('burger-menu');
    burgerMenu.innerHTML = '<i class="fas fa-bars"></i>'; // Icon for the toggle button

    burgerMenu.addEventListener('click', () => {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');
        sidebar.classList.toggle('hidden');
        mainContent.classList.toggle('full-width');
    });

    document.body.appendChild(burgerMenu);

    // Dark Mode Toggle Button
    const darkModeToggleButton = document.createElement('button');
    darkModeToggleButton.id = 'toggle-dark-mode';
    darkModeToggleButton.classList.add('toggle-dark-mode');
    darkModeToggleButton.innerHTML = '<i class="fas fa-moon"></i>'; // Icon for dark mode toggle

    darkModeToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        darkModeToggleButton.innerHTML = document.body.classList.contains('dark-mode')
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';
    });

    document.body.appendChild(darkModeToggleButton);

    // Function to check screen width and toggle sidebar visibility
    const checkScreenWidth = () => {
        const sidebar = document.getElementById('sidebar');
        const burgerMenu = document.getElementById('burger-menu');
        const mainContent = document.querySelector('.main-content');
        if (window.innerWidth < 600) {
            sidebar.classList.add('hidden');
            burgerMenu.style.display = 'block';
            mainContent.classList.add('full-width');
        } else {
            sidebar.classList.remove('hidden');
            burgerMenu.style.display = 'block'; // Keep burger menu visible
            mainContent.classList.remove('full-width');
        }
    };


    // Function to check screen width and toggle sidebar visibility
    // const checkScreenWidth = () => {
    //     const sidebar = document.getElementById('sidebar');
    //     const toggleButton = document.getElementById('toggle-sidebar');
    //     const mainContent = document.querySelector('.main-content');
    //     if (window.innerWidth < 600) {
    //         sidebar.classList.add('hidden');
    //         toggleButton.style.display = 'block';
    //         mainContent.classList.add('full-width');
    //     } else {
    //         sidebar.classList.remove('hidden');
    //         toggleButton.style.display = 'none';
    //         mainContent.classList.remove('full-width');
    //     }
    // };

    // Call checkScreenWidth on window resize
    window.addEventListener('resize', checkScreenWidth);

    // Initial check on page load
    window.addEventListener('load', checkScreenWidth);




    // Toggle Button
    // const toggleButton = document.createElement('button');
    // toggleButton.id = 'toggle-sidebar';
    // toggleButton.classList.add('toggle-sidebar');
    // toggleButton.innerHTML = '<i class="fas fa-bars"></i>'; // Icon for the toggle button

    // toggleButton.addEventListener('click', () => {
    //     const sidebar = document.getElementById('sidebar');
    //     const mainContent = document.querySelector('.main-content');
    //     sidebar.classList.toggle('hidden');
    //     mainContent.classList.toggle('full-width');
    // });

    // document.body.appendChild(toggleButton);

    // Dark Mode Toggle Button
    // const darkModeToggleButton = document.createElement('button');
    // darkModeToggleButton.id = 'toggle-dark-mode';
    // darkModeToggleButton.classList.add('toggle-dark-mode');
    // darkModeToggleButton.innerHTML = '<i class="fas fa-moon"></i>'; // Icon for dark mode toggle

    // darkModeToggleButton.addEventListener('click', () => {
    //     document.body.classList.toggle('dark-mode');
    //     darkModeToggleButton.innerHTML = document.body.classList.contains('dark-mode')
    //         ? '<i class="fas fa-sun"></i>'
    //         : '<i class="fas fa-moon"></i>';
    // });

    // document.body.appendChild(darkModeToggleButton);

    return sidebar;
};

export { createSidebar };