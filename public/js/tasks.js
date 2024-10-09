document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  if (!token) {
    alert('Please login first');
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('username').textContent = username;

  document.getElementById('logout').addEventListener('click', async () => {
    const response = await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      headers: {
        'x-auth-token': token
      }
    });

    if (response.ok) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.setItem('logout', 'true');
      window.location.href = 'index.html';
    } else {
      alert('Failed to logout');
    }
  });

  const taskForm = document.getElementById('task-form');
  const taskList = document.getElementById('task-list');
  const updateTaskForm = document.getElementById('update-task-form');
  let currentTaskId = null;

  taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    const response = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({ title, description })
    });

    const data = await response.json();
    if (response.ok) {
      addTaskToList(data);
      taskForm.reset();
    } else {
      alert(data.msg || 'Failed to add task');
    }
  });

  const response = await fetch('http://localhost:5000/api/tasks', {
    headers: {
      'x-auth-token': token
    }
  });

  const tasks = await response.json();
  tasks.forEach(task => addTaskToList(task));

  function addTaskToList(task) {
    const li = document.createElement('li');
    li.setAttribute('data-id', task._id);
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    li.innerHTML = `
      <span>
        Title: ${task.title}<br>
        Description: ${task.description}<br>
        Status: ${task.completed ? 'Complete' : 'Incomplete'}
      </span>
      <div>
        <i class="fas fa-edit edit-task mr-2" style="cursor:pointer;"></i>
        <i class="fas fa-trash delete-task" style="cursor:pointer;"></i>
      </div>
    `;
    taskList.appendChild(li);

    li.querySelector('.edit-task').addEventListener('click', () => openEditModal(task));
    li.querySelector('.delete-task').addEventListener('click', () => deleteTask(task._id));
  }

  function openEditModal(task) {
    currentTaskId = task._id;
    document.getElementById('update-title').value = task.title;
    document.getElementById('update-description').value = task.description;
    document.getElementById('update-completed').checked = task.completed;
    $('#updateTaskModal').modal('show');
  }

  updateTaskForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newTitle = document.getElementById('update-title').value;
    const newDescription = document.getElementById('update-description').value;
    const newCompleted = document.getElementById('update-completed').checked;

    const response = await fetch(`http://localhost:5000/api/tasks/${currentTaskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({ title: newTitle, description: newDescription, completed: newCompleted })
    });

    const data = await response.json();
    if (response.ok) {
      const li = taskList.querySelector(`[data-id="${currentTaskId}"]`);
      li.querySelector('span').innerHTML = `
        Title: ${data.title}<br>
        Description: ${data.description}<br>
        Status: ${data.completed ? 'Complete' : 'Incomplete'}
      `;
      $('#updateTaskModal').modal('hide');
    } else {
      alert(data.msg || 'Failed to update task');
    }
  });

  async function deleteTask(taskId) {
    const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'x-auth-token': token
      }
    });

    if (response.ok) {
      const li = taskList.querySelector(`[data-id="${taskId}"]`);
      taskList.removeChild(li);
    } else {
      const data = await response.json();
      alert(data.msg || 'Failed to delete task');
    }
  }
});