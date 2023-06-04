const form = document.querySelector('#todoForm')
const input = document.querySelector('#todoInput')
const list = document.querySelector('#todoList');
let todoItems = []
const editButton = `<button class="editButton">edit</button>`
const clearButton = document.querySelector('#clearTasks') // Clear Completed Tasks button


form.addEventListener('submit', event => {
    event.preventDefault();  //prevents page from refreshing on enter
    addItem(input.value)
})

function addItem(text) {
    if(text !== ''){
        const todo = {
            name: text,
            id: Date.now(),  //this adds a unique id to the item based on the date/time
            completed: false
        }
        todoItems.push(todo); //add new todo item to array list
        addToLocalStorage(todoItems);
        input.value = '';  //resets input value to blank after submit
    }
}

// function to add todo items to local storage
function addToLocalStorage(todoItems) {
    localStorage.setItem('todoItemsReference', JSON.stringify(todoItems));
    renderItems(todoItems);
}

function renderItems(todoItems) {
    list.innerHTML = '';
    todoItems.forEach(item => {
        const checked = item.completed ? 'checked': null;
        const li = document.createElement('li');
        li.setAttribute('data-key', item.id);
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${checked}> 
            ${item.name}
            ${editButton}
        `;
        list.append(li);
        // add delete button to item
        const delBtn = document.createElement('button');
        delBtn.innerHTML = '&times;';
        delBtn.classList.add('delete-Btn')
        li.appendChild(delBtn);
        delBtn.addEventListener('click', () => {
            deleteItem(li.getAttribute('data-key'));
        });
    });
    makeEditFunctional()
    checkIfListEmpty()
}

function makeEditFunctional() {
    const tasks = Array.from(document.querySelectorAll('#todoList li'))

    for (let i = 0; i < tasks.length; i++) {
        const edit = tasks[i].querySelector('button')
        const taskToEdit = todoItems[i]
        edit.addEventListener('click', () => editItem(taskToEdit, i))
    }
}
function editItem(task, i) {
    let newTask = prompt('Edit your task: ')    // goal for a future update: avoid prompt(), add a popup or make a new edit form visible instead
    if (newTask) {
        task = newTask
        todoItems[i].name = task
        addToLocalStorage(todoItems)
    }
}

// function to delete single todo item
function deleteItem(id) {
    const numID = Number(id);
    todoItems = todoItems.filter(item => item.id !== numID); //remove todo item from todoItems array
    const li = document.querySelector(`li[data-key="${numID}"]`);
    li.remove(); //remove todo item from page rendering
    addToLocalStorage(todoItems); //update localStorage
}

function getFromLocalStorage() {
    const reference = localStorage.getItem('todoItemsReference');
    if (reference) {
      todoItems = JSON.parse(reference);
      renderItems(todoItems);
    }
  }
getFromLocalStorage(); //initializes on page refresh



// Function that checks if there are any items in the list and, if not, hides the clear button for better UX.
function checkIfListEmpty() {
    if (todoItems.length == 0) {
        clearButton.classList.add('hidden')
    } else {
        clearButton.classList.remove('hidden')
    }
}

// Event listener to clear all completed tasks
clearButton.addEventListener('click', clearCompletedTasks)
// Clear all completed tasks
function clearCompletedTasks() {
    const reference = localStorage.getItem('todoItemsReference');
    todoItems = JSON.parse(reference);
    let unfinishedTasks = todoItems.filter((item, i) => !item.completed)
    todoItems = unfinishedTasks
    addToLocalStorage(todoItems)
}



// Event listener waiting for checked items
list.addEventListener("change", (item) =>{ updateCheckedItem(item) })



// Updated the checkbox checked status for the clicked item
function updateCheckedItem(item){
    const checkedItemID = Number(item.target.parentElement.getAttribute('data-key'))
    const checkedItem = todoItems.find( item => item.id === checkedItemID)

    if(item.target.checked){
        checkedItem.completed = true
    } else {
        checkedItem.completed = false
    }
    addToLocalStorage(todoItems)
}



