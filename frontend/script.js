document.addEventListener("DOMContentLoaded", function () {
  // Определение текущей страницы по наличию определённых элементов
  if (document.getElementById("register-btn")) {
    // Страница авторизации (index.html)
    document.getElementById("register-btn").addEventListener("click", register);
    document.getElementById("login-btn").addEventListener("click", login);
  }
  if (document.getElementById("task-list")) {
    // Страница задач (tasks.html)
    loadTasks();
    document.getElementById("create-task-btn").addEventListener("click", createTask);
    document.getElementById("logout-btn").addEventListener("click", logout);
  }
});

function register() {
  console.log("Запуск функции register");
  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value.trim();

  if (!username || !password) {
    alert("Введите имя пользователя и пароль для регистрации");
    return;
  }

  fetch("http://127.0.0.1:5000/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.message === "User created") {
      alert("Регистрация успешна. Теперь выполните вход.");
      // Очистка полей ввода
      document.getElementById("register-username").value = "";
      document.getElementById("register-password").value = "";
    } else {
      alert("Ошибка регистрации: " + (data.error || "Неизвестная ошибка"));
    }
  })
  .catch(error => {
    console.error("Ошибка регистрации:", error);
    alert("Ошибка сети при регистрации.");
  });
}

function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!username || !password) {
    alert("Введите имя пользователя и пароль для входа");
    return;
  }

  fetch("http://127.0.0.1:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.access_token) {
      localStorage.setItem("authToken", data.access_token);
      alert("Вход выполнен успешно");
      window.location.href = "tasks.html";
    } else {
      alert("Ошибка входа: " + (data.error || "Неверные учетные данные"));
    }
  })
  .catch(error => {
    console.error("Ошибка входа:", error);
    alert("Ошибка сети при входе.");
  });
}

function logout() {
  localStorage.removeItem("authToken");
  window.location.href = "index.html";
}

function loadTasks() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("Необходима авторизация");
    window.location.href = "index.html";
    return;
  }

  fetch("http://127.0.0.1:5000/tasks", {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    }
  })
  .then(response => response.json())
  .then(data => {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";
    if (Array.isArray(data)) {
      data.forEach(task => {
        const li = document.createElement("li");
        li.textContent = `${task.title} - ${task.description} (Выполнить до: ${new Date(task.todo).toLocaleString()})`;

        // Кнопка удаления задачи
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Удалить";
        deleteBtn.addEventListener("click", () => deleteTask(task.id));
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
      });
    } else {
      alert("Ошибка загрузки задач");
    }
  })
  .catch(error => {
    console.error("Ошибка при загрузке задач:", error);
    alert("Ошибка сети при загрузке задач.");
  });
}

function createTask() {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("Необходима авторизация");
    window.location.href = "index.html";
    return;
  }

  const title = document.getElementById("task-title").value.trim();
  const description = document.getElementById("task-description").value.trim();
  const todoValue = document.getElementById("task-todo").value;
  
  if (!title || !description || !todoValue) {
    alert("Заполните все поля для создания задачи");
    return;
  }

  // Преобразование даты и времени в формат ISO
  const todo = new Date(todoValue).toISOString();

  console.log("Отправка данных:", { title, description, todo });
  console.log("Дата в запросе:", todo);

  fetch("http://127.0.0.1:5000/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ title, description, todo })
  })
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      alert("Задача создана");
      // Очистка полей
      document.getElementById("task-title").value = "";
      document.getElementById("task-description").value = "";
      document.getElementById("task-todo").value = "";
      loadTasks(); // обновление списка задач
    } else {
      alert("Ошибка создания задачи: " + (data.error || "Неизвестная ошибка"));
    }
  })
  .catch(error => {
    console.error("Ошибка создания задачи:", error);
    alert("Ошибка сети при создании задачи.");
  });
}

function deleteTask(taskId) {
  const token = localStorage.getItem("authToken");
  if (!token) {
    alert("Необходима авторизация");
    window.location.href = "index.html";
    return;
  }

  fetch(`http://127.0.0.1:5000/task/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.message) {
      alert("Задача удалена");
      loadTasks();
    } else {
      alert("Ошибка при удалении задачи: " + (data.error || "Неизвестная ошибка"));
    }
  })
  .catch(error => {
    console.error("Ошибка удаления задачи:", error);
    alert("Ошибка сети при удалении задачи.");
  });
}
