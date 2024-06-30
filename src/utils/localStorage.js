const loadFromLocalStorage = (key) => {
    try {
        const item = localStorage.getItem(key);
        const data = item ? JSON.parse(item) : [];
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error loading from local storage:', error);
        return [];
    }
};

const saveToLocalStorage = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to local storage:', error);
    }
};



const initializeLocalStorage = (key) => {
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify([]));
    }
};

export { saveToLocalStorage, loadFromLocalStorage, initializeLocalStorage };

