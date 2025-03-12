// HTML이 로드되면 할 일 불러오기
document.addEventListener("DOMContentLoaded", () => {
  printMonth();

  // 이전 달, 다음 달 버튼 이벤트 추가
  document
    .getElementById("cal-prevButton")
    .addEventListener("click", prevMonth);
  document
    .getElementById("cal-nextButton")
    .addEventListener("click", nextMonth);
  document
    .querySelector(".calendar-button")
    .addEventListener("click", loadTodos);
});

// Enter 키 입력 감지
function keyCodeCheck(event) {
  if (
    window.event.keyCode === 13 &&
    document.querySelector("#todoInput").value.trim() !== ""
  ) {
    makeTodoList();
  }
}

// 새로운 할 일 생성 함수
function makeTodoList(text = "", isChecked = false) {
  const todoInput = document.querySelector("#todoInput");
  const inputValue = text || todoInput.value.trim();

  if (inputValue === "") return;

  // 새로운 할 일 요소 생성
  const newLi = createTodoElement(inputValue, isChecked);

  // 해야 할 일 목록에 추가
  updateTodoList(newLi, isChecked);

  if (!text) todoInput.value = ""; // 직접 입력한 경우 입력창 초기화
  saveTodos();
}

// 개별 할 일 요소 생성
function createTodoElement(text, isChecked) {
  // 리스트 생성
  const newLi = document.createElement("li");

  // 체크박스 생성
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = isChecked;

  // 체크박스 이벤트
  checkbox.addEventListener("change", function () {
    newSpan.style.textDecoration = this.checked ? "line-through" : "none";
    updateTodoList(newLi, this.checked);
    saveTodos();
  });

  // 할 일 내용
  const newSpan = document.createElement("span");
  newSpan.textContent = text;
  if (isChecked) newSpan.style.textDecoration = "line-through";

  // 삭제 버튼
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "del";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", function () {
    newLi.remove();
    saveTodos();
  });

  newLi.append(checkbox, newSpan, deleteButton);
  return newLi;
}

// 완료된 할 일과 해야 할 일 분리해서 추가
function updateTodoList(liElement, isChecked) {
  const todoList = document.querySelector("#todoList");
  const completedList = document.querySelector("#completedList");

  if (isChecked) {
    completedList.appendChild(liElement);
  } else {
    todoList.appendChild(liElement);
  }
}

// localStorage 저장 함수
function saveTodos() {
  const todos = [];

  document.querySelectorAll("#todoList li, #completedList li").forEach((li) => {
    const text = li.querySelector("span").textContent;
    const isChecked = li.querySelector('input[type="checkbox"]').checked;
    todos.push({ text, isChecked });
  });

  localStorage.setItem("todos", JSON.stringify(todos));
}

// localStorage에서 데이터 불러오기
function loadTodos() {
  const todoList = document.querySelector("#todoList");
  const completedList = document.querySelector("#completedList");

  todoList.innerHTML = "";
  completedList.innerHTML = "";

  const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  savedTodos.forEach((todo) => {
    const newLi = createTodoElement(todo.text, todo.isChecked);
    updateTodoList(newLi, todo.isChecked);
  });
}
