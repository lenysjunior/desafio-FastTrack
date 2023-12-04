document.addEventListener("DOMContentLoaded", function () {
    const taskForm = document.getElementById("taskForm");
    const editTaskForm = document.getElementById("editTaskForm");
    const taskList = document.getElementById("taskList");
    const descriptionModal = new bootstrap.Modal(document.getElementById("descriptionModal"));
    const editTaskModal = new bootstrap.Modal(document.getElementById("editTaskModal"));
    const taskDescriptionModalBody = document.getElementById("taskDescriptionModalBody");
    const saveChangesBtn = document.getElementById("saveChangesBtn");
    const markAsDoneBtn = document.getElementById("markAsDoneBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    taskForm.addEventListener("submit", function (e) {
        e.preventDefault();
        salvarTarefa();
    });

    taskList.addEventListener("click", function (e) {
        if (e.target.classList.contains("show-description")) {
            const taskId = e.target.dataset.taskId;
            exibirDescricaoTarefa(taskId);
        } else if (e.target.classList.contains("edit-task")) {
            const taskId = e.target.dataset.taskId;
            exibirFormularioEdicao(taskId);
        } else if (e.target.classList.contains("delete-task")) {
            const taskId = e.target.dataset.taskId;
            apagarTarefa(taskId);
        }
    });

    editTaskForm.addEventListener("submit", function (e) {
        e.preventDefault();
        salvarAlteracoesTarefa();
    });

    saveChangesBtn.addEventListener("click", function () {
        salvarAlteracoesTarefa();
        editTaskModal.hide();
    });

    markAsDoneBtn.addEventListener("click", function () {
        marcarComoRealizado();
        editTaskModal.hide();
    });
    cancelBtn.addEventListener("click", function () {
        editTaskModal.hide();
        renderTasks();
        location.reload()
    });

    function salvarTarefa() {
        const taskName = document.getElementById("taskName").value;
        const startTime = document.getElementById("startTime").value;
        const endTime = document.getElementById("endTime").value;
        const taskDescription = document.getElementById("taskDescription").value;

        if (taskName && startTime && endTime) {
            const taskId = Date.now();
            const task = {
                id: taskId,
                name: taskName,
                start: startTime,
                end: endTime,
                description: taskDescription,
                status: "Pendente"
            };

            saveTask(task);
            renderTasks();
            taskForm.reset();
        }
    }

    function saveTask(task) {
        let tasks = JSON.parse(localStorage.getItem("tarefas")) || [];
        tasks.push(task);
        localStorage.setItem("tarefas", JSON.stringify(tasks));
    }

    // Mostrar lista
    function renderTasks() {
        taskList.innerHTML = "";
        const tasks = JSON.parse(localStorage.getItem("tarefas")) || [];
    
        tasks.forEach(function (task) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class="task-name" data-task-id="${task.id}" data-toggle="modal" data-target="#descriptionModal" style="cursor: pointer">${task.name}</td>
                <td>${formatarData(task.start)}</td>
                <td>${formatarData(task.end)}</td>
                <td>${task.status}</td>
                <td><button class="btn btn-info btn-sm edit-task" data-task-id="${task.id}" data-toggle="modal" data-target="#editTaskModal">Alterar</button></td>
                <td><button class="btn btn-danger btn-sm delete-task" data-task-id="${task.id}">Apagar</button></td>
            `;
            taskList.appendChild(row);
        });
    }

    // Mostrar descrição no modal
    function exibirDescricaoTarefa(taskId) {
        const task = getTaskById(taskId);
        taskDescriptionModalBody.textContent = task.description;
        $('#descriptionModal').modal('show');  // Use modal('show') para exibir o modal
    }
    
    // Função para formatar a data usando moment.js
    function formatarData(data) {
        return moment(data).format('DD/MM/YYYY HH:mm');
    }
    

    function exibirFormularioEdicao(taskId) {
        const task = getTaskById(taskId);

        // Preencher o formulário de edição com os dados da tarefa
        document.getElementById("editTaskName").value = task.name;
        document.getElementById("editStartTime").value = task.start;
        document.getElementById("editEndTime").value = task.end;
        document.getElementById("editTaskDescription").value = task.description;

        // Adicionar o ID da tarefa como atributo personalizado ao botão "Salvar Alterações"
        saveChangesBtn.dataset.taskId = task.id;

        // Adicionar o ID da tarefa como atributo personalizado ao botão "Marcar como Realizado"
        markAsDoneBtn.dataset.taskId = task.id;

        editTaskModal.show();
    }

    function salvarAlteracoesTarefa() {
        const taskId = saveChangesBtn.dataset.taskId;
        const taskName = document.getElementById("editTaskName").value;
        const startTime = document.getElementById("editStartTime").value;
        const endTime = document.getElementById("editEndTime").value;
        const taskDescription = document.getElementById("editTaskDescription").value;

        if (taskId && taskName && startTime && endTime) {
            const tasks = JSON.parse(localStorage.getItem("tarefas")) || [];
            const taskIndex = tasks.findIndex(task => task.id == taskId);

            if (taskIndex !== -1) {
                tasks[taskIndex].name = taskName;
                tasks[taskIndex].start = startTime;
                tasks[taskIndex].end = endTime;
                tasks[taskIndex].description = taskDescription;
                localStorage.setItem("tarefas", JSON.stringify(tasks));
                renderTasks();
                location.reload()
            }
        }
    }

    function marcarComoRealizado() {
        const taskId = markAsDoneBtn.dataset.taskId;

        if (taskId) {
            const tasks = JSON.parse(localStorage.getItem("tarefas")) || [];
            const taskIndex = tasks.findIndex(task => task.id == taskId);

            if (taskIndex !== -1) {
                tasks[taskIndex].status = "Realizado";
                localStorage.setItem("tarefas", JSON.stringify(tasks));
                renderTasks();
                location.reload()
            }
        }
    }

    function apagarTarefa(taskId) {
        let tasks = JSON.parse(localStorage.getItem("tarefas")) || [];
        tasks = tasks.filter(task => task.id != taskId);
        localStorage.setItem("tarefas", JSON.stringify(tasks));
        renderTasks();
        location.reload()
    }

    function getTaskById(taskId) {
        const tasks = JSON.parse(localStorage.getItem("tarefas")) || [];
        return tasks.find(task => task.id == taskId);
    }

    renderTasks();
});
