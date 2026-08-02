const todoInput = document.querySelector('#todo-input') as HTMLInputElement;
const form = document.querySelector('form') as HTMLFormElement;
const filters = document.querySelectorAll('.filter') as NodeListOf<HTMLSpanElement>;
const todoList = document.querySelector('#todo-list') as HTMLUListElement;

interface TodoObject {
    text: string,
    id: number,
    completed: boolean
}

let allTodos: TodoObject[] = [];
let currentFilter = 'all';

//  THE TASK RENDERING AND FUNCTION WITH EACH TASK

form.addEventListener('submit', (e: Event) => {
    e.preventDefault();
    addTodos();
    saveToLocalStorage()
    renderTodos();
})

function addTodos(){
    const todoText: string = todoInput.value.trim();
    if(todoText.length > 0){
        const newTask: TodoObject = {
        text: todoText,
        id: Date.now(),
        completed: false
        }

        allTodos.push(newTask);
        todoInput.value = "";
    }
    
}

function displayTodos(todosCreated = allTodos){
    todoList.innerHTML = "";

    todosCreated.forEach((todo) => {
        const todoItem = createTodo(todo);
        todoList.appendChild(todoItem);
    })

}

function createTodo(todo: TodoObject){
    const li = document.createElement('li') as HTMLLIElement;
    li.className = 'todo';
    li.innerHTML = 
    `
        <input type="checkbox" id="todo-${todo.id}" ${todo.completed ? "checked" : ""}/>
        <label for="todo-${todo.id}" class="custom-checkbox"
            ><i class="fa-solid fa-check"></i
        ></label>
        <label for="todo-${todo.id}" class="todo-text">${todo.text}</label>
        <button class="edit-button"><i class="fa-solid fa-pen"></i></button>
        <button class="delete-button"><i class="fa-solid fa-trash"></i></button>
    `

    const editBtn = li.querySelector('.edit-button') as HTMLButtonElement;
    const deleteBtn = li.querySelector('.delete-button') as HTMLButtonElement;
    const checkbox = li.querySelector('input') as HTMLInputElement;

    editBtn.addEventListener('click', () => {
        if(!checkbox.checked){
            todoInput.value = todo.text;
            removeTodo(todo.id);
            saveToLocalStorage()
            renderTodos();
        }
    })

    deleteBtn.addEventListener('click', () => {
        removeTodo(todo.id);
        saveToLocalStorage();
        renderTodos();
    })

    checkbox.addEventListener('change', () => {
        completedTodo(todo.id);
        saveToLocalStorage();
        renderTodos();
    })
    return li;
};


function removeTodo(todoId: number){
    allTodos = allTodos.filter((todo) => todo.id !== todoId);
}

function completedTodo(todoId: number){
    const todo = allTodos.find(todo => todo.id === todoId);
    if(todo){
        todo.completed = !todo.completed;
    }
    
}
    
const filterContainer = document.querySelector('.filters') as HTMLDivElement;


filterContainer.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    const clickedChild = target.closest('.filter') as HTMLElement;

    if(!clickedChild) return;

    filterContainer.querySelector('.active')?.classList.remove('active');
    clickedChild.classList.add('active');

    const filterType = clickedChild.dataset.filter;

    if (!filterType) return;

    currentFilter = filterType;
    renderTodos();
})

function renderTodos() {
    let todosToDisplay = allTodos;

    if (currentFilter === "active") {
        todosToDisplay = allTodos.filter(todo => !todo.completed);
    }

    if (currentFilter === "completed") {
        todosToDisplay = allTodos.filter(todo => todo.completed);
    }

    displayTodos(todosToDisplay);
}

function saveToLocalStorage(){
    const jsonTodos: string = JSON.stringify(allTodos);
    localStorage.setItem('todos', jsonTodos);
}

function getFromLocalStorage(){
    const storedTodos = localStorage.getItem('todos');
    if(storedTodos){
        const changedTodos = JSON.parse(storedTodos);
        allTodos = changedTodos;
    }

}

getFromLocalStorage();
renderTodos();