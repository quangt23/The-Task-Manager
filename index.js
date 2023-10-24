let items = []
const todoInput = document.querySelector('.todo-input')
const completedTodosElement = document.querySelector('.completed-todos')
const uncompletedTodosElement = document.querySelector('.uncompleted-todos')
const audio = new Audio('pop-39222.mp3')
//Get todolist on first boot
window.onload = () => {
    let storeItem = localStorage.getItem('items')
    if(storeItem !== null){
        items = JSON.parse(storeItem)
    }

    render()
}

//Get the content typed into the input
todoInput.onkeyup = ((e) => {
    let value = e.target.value.replace(/^\s+/, "") //extract the value entered into the input field, remove any leading whitespace characters
    if(value && e.keyCode === 13){ //checks if value is not empty, checks if pressed 'enter' key
        addTodo(value) //add todo to list
        todoInput.value = '' //clears input field
        todoInput.focus()   //ready to enter next todo without having to click
    }
})

//Add todo
function addTodo(text){
    items.push({
        id: Date.now(),
        text,
        completed: false
    })

    saveAndRender()
}

function removeTodo(id){
    items = items.filter(todo => todo.id !== Number(id))
    saveAndRender()
}

function markAsCompleted(id){
    items = items.filter(todo => {
        if(todo.id === Number(id)){
            todo.completed = true
        }
        return todo
    })
    audio.play()
    saveAndRender()
}

function markAsUncompleted(id){
    items = items.filter(todo => {
        if(todo.id === Number(id)){
            todo.completed = false
        }
        return todo
    })

    saveAndRender()
}

function save(){
    localStorage.setItem('items', JSON.stringify(items))
}

function render(){
    let uncompletedTodos = items.filter(item => !item.completed)
    let completedTodos = items.filter(item => item.completed)

    completedTodosElement.innerHTML = ''
    uncompletedTodosElement.innerHTML = ''

    if(uncompletedTodos.length > 0){
        uncompletedTodos.forEach(todo => {
            uncompletedTodosElement.append(createTodoElement(todo))
        })
    }else{
        uncompletedTodosElement.innerHTML = `<div class='empty'>You have no tasks uncompleted!</div>`
    }

    if(completedTodos.length > 0){
        completedTodosElement.innerHTML = `<div class='completed-title'>Completed (${completedTodos.length}/${items.length})</div>`
        
        completedTodos.forEach(todo => {
            completedTodosElement.append(createTodoElement(todo))
        })
    }
}

function saveAndRender(){
    save()
    render()
}

//create todo item
function createTodoElement(todo){
    const todoDiv = document.createElement(`div`)
    todoDiv.setAttribute(`data-id`, todo.id)
    todoDiv.className = `item`

    //create todoitem text
    const todoTextSpan = document.createElement(`span`)
    todoTextSpan.innerHTML = todo.text

    //checkbox for list
    const todoInputCheckbox = document.createElement(`input`)
    todoInputCheckbox.type = 'checkbox'
    todoInputCheckbox.checked = todo.completed
    todoInputCheckbox.onclick = (e) => {
        let id = e.target.closest('.item').dataset.id
        e.target.checked ? markAsCompleted(id) : markAsUncompleted(id)

    }

    //delete button for list
    const todoRemoveBtn = document.createElement('a')
    todoRemoveBtn.href = '#'
    todoRemoveBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-x" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M18 6l-12 12" />
                                <path d="M6 6l12 12" />
                                </svg>`
    todoRemoveBtn.onclick = (e) => {
        let id = e.target.closest('.item').dataset.id
        removeTodo(id)
    }

    todoTextSpan.prepend(todoInputCheckbox)
    todoDiv.appendChild(todoTextSpan)
    todoDiv.appendChild(todoRemoveBtn)

    return todoDiv

}