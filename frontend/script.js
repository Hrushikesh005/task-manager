const token = localStorage.getItem("token");

if (window.location.pathname.includes("dashboard") && !token) {
  window.location.href = "login.html";
}
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    });

    const data = await res.json();

    document.getElementById("message").innerText = data.message;
  });
}
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await res.json();

    if (data.token) {

      localStorage.setItem("token", data.token);

      window.location.href = "dashboard.html";

    } else {

      document.getElementById("message").innerText = data.message;

    }

  });
}
// load tasks when dashboard opens
if (window.location.pathname.includes("dashboard")) {
  loadTasks();
}

async function loadTasks() {

  const token = localStorage.getItem("token");

  const res = await fetch("/api/tasks", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  const tasks = await res.json();

  const taskList = document.getElementById("taskList");

  taskList.innerHTML = "";

  tasks.forEach(task => {

    const li = document.createElement("li");

    li.innerHTML = `
      ${task.title} - ${task.status}
      <button onclick="deleteTask('${task._id}')">Delete</button>
    `;

    taskList.appendChild(li);

  });
}

async function createTask() {

  const token = localStorage.getItem("token");

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const priority = document.getElementById("priority").value;

  await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      title,
      description,
      priority
    })
  });

  loadTasks();
}

async function deleteTask(id) {

  const token = localStorage.getItem("token");

  await fetch(`/api/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token
    }
  });

  loadTasks();
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}