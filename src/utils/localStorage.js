const saveToLocalStorage = (key, data) => {
    try {
        console.log(`Saving to local storage: ${key}`, data);
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to local storage:', error);
    }
};

const loadFromLocalStorage = (key) => {
    try {
        const item = localStorage.getItem(key);
        const data = item ? JSON.parse(item) : [];
        console.log(`Loaded from local storage: ${key}`, data);
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error loading from local storage:', error);
        return [];
    }
};

const initializeLocalStorage = (key) => {
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify([]));
    }
};

export { saveToLocalStorage, loadFromLocalStorage, initializeLocalStorage };

