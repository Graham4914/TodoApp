const saveToLocalStorage = () => {
    console.log('Saving to local storage', projectsArray);
    localStorage.setItem('projects', JSON.stringify(projectsArray));
};
const loadFromLocalStorage = () => {
    const savedProjects = JSON.parse(localStorage.getItem('projects') || '[]');
    console.log('Loaded from Local storage', savedProjects);
    return savedProjects;
};

export { saveToLocalStorage, loadFromLocalStorage };