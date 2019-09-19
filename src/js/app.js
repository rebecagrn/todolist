(function () {
  'use strict';
  let countdown;
  let index = 0;
  const $timerDisplay = document.querySelector('[data-js="timer-display"]');
  const $buttonPlay = document.querySelector('[data-js="button-play"]');
  const $buttonStop = document.querySelector('[data-js="button-stop"]');
  const $taskInput = document.querySelector('[data-js="task-input"]');
  const $allTasks = document.querySelector('[data-js="all-tasks"]');

  function clearInput(){
    $taskInput.value = '';
    return;
  }

  function timer(seconds) {
    clearInterval(countdown);

    const now = Date.now();
    const then = now + seconds * 1000;
    
    displayTimeLeft(seconds);

    countdown = setInterval(() => {
      const secondsLeft = Math.round((then - Date.now()) / 1000);
      if (secondsLeft < 0) {
        clearInterval(countdown);
        return;
      }

      displayTimeLeft(secondsLeft);
    }, 1000);
  }

  function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    document.title = display;
    $timerDisplay.textContent = display;
  }

  function startTimer(e) {
    e.preventDefault();
    return timer(1500);
  }

  function stopTimer(e) {
    e.preventDefault();
    clearInterval(countdown)
    $timerDisplay.textContent = '25:00';
    document.title = '25:00';
    return;
  }

  function generateTask(task){
    return `
      <li class="row">
        <span class="task">${task}</span>
        <i class="fas fa-check" data-remove="${task}"></i>
      </li>
    `;
  }

  function insertTaskHTML(task){
    $allTasks.innerHTML +=  generateTask(task);
  }

  function addTask(){
    if($taskInput.value === '') return;
    storageTask($taskInput.value);
    insertTaskHTML($taskInput.value);
    clearInput();
    location.reload();
  }

  function storageTask(task){
    let tasksItens = [];
    if(localStorage.getItem('tasksList') === null){
      addToStorage(task, tasksItens);
    } else {
      tasksItens = JSON.parse(localStorage.getItem('tasksList'));
      addToStorage(task, tasksItens);
    }
  }

  function addToStorage(task, tasksItens){
    tasksItens.push(task);
    localStorage.setItem('tasksList', JSON.stringify(tasksItens));
  }

  function checkKey(e){
    if(e.key === 'Enter'){
      addTask();
      index++;
    }
  }

  function getTasksFromStorage(){
    let myTasks = JSON.parse(localStorage.getItem('tasksList'));
    if(myTasks === null) return;
    myTasks.forEach((task) => {
      insertTaskHTML(task);
    });
  }

  function deleteTask(){
    let taskList = JSON.parse(localStorage.getItem('tasksList'));

    taskList.forEach((task, index) => {
      if(taskList[index] === this.dataset.remove){
        taskList.splice(index, 1);
      }
    });

    localStorage.setItem('tasksList', JSON.stringify(taskList));
    location.reload();
  }

  getTasksFromStorage();
  const $buttonsRemove = document.querySelectorAll('[data-remove]');

  [...$buttonsRemove].forEach((button) => {
    button.addEventListener('click', deleteTask);
  })

  $buttonPlay.addEventListener('click', startTimer);
  $buttonStop.addEventListener('click', stopTimer);
  document.addEventListener('keyup', checkKey);

})();