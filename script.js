// HTML이 로드되면 할 일 불러오기
document.addEventListener("DOMContentLoaded", () => {
  loadTodos();
  loadTodayInfo();
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

// 새로운 할 일 생성 함수 / 저장 데이터 불러오는 용 인자
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
    if (this.checked) {
      newSpan.classList.add("checkedTodos");
    } else {
      newSpan.classList.remove("checkedTodos");
    }
    updateTodoList(newLi, this.checked);
    saveTodos();
  });

  // 할 일 내용
  const newSpan = document.createElement("span");
  newSpan.textContent = text;

  // 저장된 데이터 체크박스 활성화
  if (isChecked) newSpan.classList.add("checkedTodos");

  // 삭제 버튼
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "del";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", function () {
    newLi.remove();
    saveTodos();
    updateStatus();
  });

  newLi.append(checkbox, newSpan, deleteButton);
  return newLi;
}

// 미완료/완료 할 일 개수 업데이트
function updateStatus() {
  const todoList = document.querySelector("#todoList");
  const completedList = document.querySelector("#completedList");
  const currentStatus = document.querySelector("#currentStatus");

  currentStatus.innerHTML = `❎ ${todoList.childElementCount} ✅ ${completedList.childElementCount}`;
}

// 미완료/완료 할 일 분리
function updateTodoList(liElement, isChecked) {
  const todoList = document.querySelector("#todoList");
  const completedList = document.querySelector("#completedList");

  if (isChecked) {
    completedList.appendChild(liElement);
  } else {
    todoList.appendChild(liElement);
  }

  updateStatus();
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

// 오늘의 날짜 업데이트
function loadTodayInfo() {
  const todayInfo = document.querySelector("#todayInfo");

  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth();
  var date = today.getDate();
  var day = today.getDay();

  var days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  todayInfo.innerHTML =
    year + "년 " + (month + 1) + "월 " + date + "일 (" + days[day] + ")";
}
