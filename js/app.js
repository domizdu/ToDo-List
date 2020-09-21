const body = document.querySelector('body');
const taskInput = document.getElementById('taskInput');
const priorityInput = document.getElementById('priorityInput');
const addTaskBtn = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const removeFinishedTasksBtn = document.getElementById('removeFinishedTasksButton');
const paragraphTasksToFinish = document.getElementById('tasksToFinish');
const spanCounter = document.getElementById('counter');
spanCounter.innerText = '0';

addTaskBtn.addEventListener('click', function(e) {
    let phrase = taskInput.value;
    let priority = parseInt(priorityInput.value);
    if ( phrase.length <= 5 ^ phrase.length >= 100 ) {
        removeInputError(); // Usuwa wcześniejszy komunikat o błędzie, jeżeli był
        showTaskInputError();
    }
    else {
        removeInputError();

        if ( 
            isNaN(priority) ||
            priority < 1 ||
            priority > 10
        ) {
            showPriorityInputError();
        }
        else {
            removeInputError();

            
            const newListItem = document.createElement('li');
            taskList.appendChild(newListItem);
            const newTitle = document.createElement('h3');
            newListItem.appendChild(newTitle);
            newTitle.innerText = phrase;
            taskInput.value = '';   //phrase - czyszczenie
            const newParagraph = document.createElement('p');
            newListItem.appendChild(newParagraph);
            newParagraph.innerText = `Priority: ${priority}`;
            newListItem.dataset.priority = priority;
            priorityInput.value = '';   //priority - czyszczenie
            const newDeleteBtn = document.createElement('button');
            newListItem.appendChild(newDeleteBtn);
            newDeleteBtn.classList.add('deleteButton');
            newDeleteBtn.innerText = 'Delete';
            const newCompleteBtn = document.createElement('button');
            newListItem.appendChild(newCompleteBtn);
            newCompleteBtn.classList.add('completeButton');
            newCompleteBtn.innerText = 'Complete';

            // Zdarzenie dla przycisku Delete
            newDeleteBtn.addEventListener('click', function(e) {
                const taskToRemove = this.parentElement;
                taskToRemove.parentElement.removeChild(taskToRemove);
                
                countUnfinishedTasks();
            });
            // Zdarzenie dla przycisku Complete
            newCompleteBtn.addEventListener('click', function(e) {
                const taskListItem = this.parentElement;
                taskListItem.classList.toggle('done');
                if ( taskListItem.className === 'done' ) {
                    this.innerText = 'Incomplete';
                }
                else {
                    this.innerText = 'Complete';
                }

                countUnfinishedTasks();
            });

            sortListByPriority();
            countUnfinishedTasks();
        }
    }
});

// Usunięcie wykonanych zadań
removeFinishedTasksBtn.addEventListener('click', function(e) {
    const completedTasks = taskList.querySelectorAll('.done');
    completedTasks.forEach(function(completedTask) {
        completedTask.parentElement.removeChild(completedTask);
    });
});


// Utworzenie komunikatu o błędzie dla taskInput
function showTaskInputError() {
    const errorMsg = document.createElement('p');
    body.insertBefore(errorMsg, paragraphTasksToFinish);
    errorMsg.classList.add('errorMsg');
    errorMsg.innerText = 'Your task should contain more than 5 and less than 100 characters.';
}
// Utworzenie komunikatu o błędzie dla priorityInput
function showPriorityInputError() {
    const errorMsg = document.createElement('p');
    body.insertBefore(errorMsg, paragraphTasksToFinish);
    errorMsg.classList.add('errorMsg');
    errorMsg.innerText = 'Provide priority for your task as a number. Type a digit from 1 to 10.';
}
// Usunięcie komunikatu o błędzie, jeżeli się pojawił
function removeInputError() {
    const errorMsg = body.querySelector('.errorMsg');
    if ( errorMsg !== null ) {
        errorMsg.parentElement.removeChild(errorMsg);
    }
}
// Sortowanie listy zadań wg priorytetu
function sortListByPriority() {
    const taskListItems = taskList.children;
    // Przeniesienie elementów do nowej tablicy, bo był problem z bezpośrednim sortowaniem tablicy typu HTMLCollection (taskListItems)
    const unorderedTaskListItems = [];
    for (let i = 0; i < taskListItems.length; i++) {
        unorderedTaskListItems.push( taskListItems[i] );
    }

    const orderedTaskListItems = unorderedTaskListItems.sort(function(a, b) {
        return b.dataset.priority - a.dataset.priority;
    });
    
    // Uzupełnienie listy uporządkowanymi elementami
    for (let i = 0; i < orderedTaskListItems.length; i++) {
        taskList.appendChild( orderedTaskListItems[i] );
    }
}
// Obliczenie ilości zadań niewykonanych
function countUnfinishedTasks() {
    const unfinishedTasks = taskList.querySelectorAll('li:not(.done)');    
    spanCounter.innerText = unfinishedTasks.length;
}