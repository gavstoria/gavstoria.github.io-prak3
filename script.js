document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const tasksCounter = document.getElementById('tasks-counter');
    const completedCounter = document.getElementById('completed-counter');
    const settingsToggle = document.getElementById('settings-toggle');
    const settingsPanel = document.getElementById('settings-panel');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function updateCounters() {
        const totalTasks = todos.length;
        const completedTasks = todos.filter(todo => todo.completed).length;
        tasksCounter.textContent = `${totalTasks} tugas`;
        completedCounter.textContent = `${completedTasks} selesai`;
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
        updateCounters();
    }

    function createTodoElement(todo) {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <span class="todo-text">${todo.text}</span>
            <div class="todo-actions">
                <button onclick="toggleTodo(${todo.id})">
                    <i class="fas ${todo.completed ? 'fa-undo' : 'fa-check'}"></i>
                </button>
                <button onclick="editTodo(${todo.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteTodo(${todo.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        return li;
    }

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach(todo => {
            todoList.appendChild(createTodoElement(todo));
        });
        updateCounters();
    }

    window.addTodo = (text) => {
        const todo = {
            id: Date.now(),
            text,
            completed: false
        };
        todos.push(todo);
        saveTodos();
        renderTodos();
    };

    window.toggleTodo = (id) => {
        todos = todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodos();
        renderTodos();
    };

    window.editTodo = (id) => {
        const todo = todos.find(t => t.id === id);
        const newText = prompt('Edit tugas:', todo.text);
        if (newText) {
            todos = todos.map(t =>
                t.id === id ? { ...t, text: newText } : t
            );
            saveTodos();
            renderTodos();
        }
    };

    window.deleteTodo = (id) => {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
    };

    // Settings handlers
    const fontSizeInput = document.getElementById('font-size');
    const fontSizeValue = document.getElementById('font-size-value');
    const fontFamilySelect = document.getElementById('font-family');
    const bgColorInput = document.getElementById('bg-color');
    const darkModeToggle = document.getElementById('dark-mode');

    fontSizeInput.addEventListener('input', (e) => {
        const size = e.target.value;
        document.body.style.fontSize = `${size}px`;
        fontSizeValue.textContent = `${size}px`;
        localStorage.setItem('fontSize', size);
    });

    fontFamilySelect.addEventListener('change', (e) => {
        document.body.style.fontFamily = e.target.value;
        localStorage.setItem('fontFamily', e.target.value);
    });

    bgColorInput.addEventListener('input', (e) => {
        document.body.style.backgroundColor = e.target.value;
        localStorage.setItem('bgColor', e.target.value);
    });

    darkModeToggle.addEventListener('change', (e) => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', e.target.checked);
    });

    settingsToggle.addEventListener('click', () => {
        settingsPanel.classList.toggle('active');
    });

    // Input handler
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && todoInput.value.trim()) {
            addTodo(todoInput.value.trim());
            todoInput.value = '';
        }
    });

    // Load saved settings
    const savedFontSize = localStorage.getItem('fontSize');
    const savedFontFamily = localStorage.getItem('fontFamily');
    const savedBgColor = localStorage.getItem('bgColor');
    const savedDarkMode = localStorage.getItem('darkMode');

    if (savedFontSize) {
        document.body.style.fontSize = `${savedFontSize}px`;
        fontSizeInput.value = savedFontSize;
        fontSizeValue.textContent = `${savedFontSize}px`;
    }
    if (savedFontFamily) {
        document.body.style.fontFamily = savedFontFamily;
        fontFamilySelect.value = savedFontFamily;
    }
    if (savedBgColor) {
        document.body.style.backgroundColor = savedBgColor;
        bgColorInput.value = savedBgColor;
    }
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }

    // Initial render
    renderTodos();
});