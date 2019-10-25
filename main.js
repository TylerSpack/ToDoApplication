class List {
    constructor(name) {
        this.name = name;
        this.tasks = [];
    }

    tasks;
    static allLists = [];
    static activeListIndex = 0;

    static DrawTasks() {
        $("#tasks").html("");
        if (this.allLists.length > 0 && this.activeListIndex < this.allLists.length) {
            $("#tasks").append(`<span class="listName">${this.allLists[this.activeListIndex].name}</span>`);
            if (this.allLists[this.activeListIndex].tasks.length > 0) {
                for (let i = 0; i < this.allLists[this.activeListIndex].tasks.length; i++) {
                    $("#tasks").append(
                        `
                <div class="task" id="task${i}">
                    <div style="width: 100%; display:flex; align-items: center;">
                        <i class="${this.allLists[this.activeListIndex].tasks[i].checkboxClass}" onclick="List.toggleChecked(${i})"></i>
                         <input type="text" value="${this.allLists[this.activeListIndex].tasks[i].name}" onkeyup="updateTaskName(${i}, this.value)">
                    </div>
                    <i class="fas fa-trash" onclick="deleteTask('${i}', this)"></i>
                </div>
                `
                    );
                }
            }
            else{
                $("#tasks").append(`
                <span style="font-size: 1.5em; margin-bottom: 5px">No Tasks</span>
                `);
            }
        }

    }

    static DrawLists() {
        $("#lists").html("");
        let isActive = "";
        for (let i = 0; i < List.allLists.length; i++) {
            if (List.activeListIndex === i) {
                isActive = "active";
            }
            $("#lists").append(
                `
                <div class="list ${isActive} hover" id="list${i}" onclick="selectList(${i})">
                    ${List.allLists[i].name}
                </div>
                `
            );
            isActive = "";
        }
        if(List.allLists.length > 0){
            $("#lists").append(`<button onclick="deleteList(List.activeListIndex)" class="deleteBtn")>Delete List</button>`)
        }

    }
    static toggleChecked(index) {
        if (this.allLists[this.activeListIndex].tasks[index].checkboxClass === "far fa-check-square") {
            this.allLists[this.activeListIndex].tasks[index].checkboxClass = "far fa-square";
        } else {
            this.allLists[this.activeListIndex].tasks[index].checkboxClass = "far fa-check-square";
        }
        this.DrawTasks();
    }
}

let storedLists = localStorage.getItem('lists');
List.allLists = storedLists === null ? [] : JSON.parse(storedLists);
if (List.allLists.length > 0) {
    List.DrawLists();
    List.DrawTasks();
}

function updateTaskName(index, name){
    console.log(List.allLists[List.activeListIndex].tasks[index]);
    List.allLists[List.activeListIndex].tasks[index].name = name;
    console.log(List.allLists[List.activeListIndex].tasks[index]);
    localStorage.setItem('lists', JSON.stringify(List.allLists));
}
function addList(event) {
    if (event.which === 13 && $("#newListName").val() !== "") {
        List.allLists.unshift(new List($("#newListName").val()));
        List.DrawLists();
        selectList(0);
        $("#newListName").val("");
    }
    localStorage.setItem('lists', JSON.stringify(List.allLists));
}

function addTask(event) {
    if (event.which === 13 && List.allLists.length > 0) {
        List.allLists[List.activeListIndex].tasks.unshift({
            name: $("#newTaskName").val(),
            checkboxClass: "far fa-square"
        });
        List.DrawTasks();
        $("#newTaskName").val("");
    }
    localStorage.setItem('lists', JSON.stringify(List.allLists));
}

function deleteTask(index, el) {
    List.allLists[List.activeListIndex].tasks.splice(index, 1);
    $(el).parent().animate({
            opacity: 0,
            width: 0
        },
        1000, function(){
            List.DrawTasks();
        });
    // $(el).parent().fadeOut("slow", function(){});
    localStorage.setItem('lists', JSON.stringify(List.allLists));
}

function deleteList(index) {
    List.allLists.splice(index, 1);
    if (List.allLists.length > 0) {
        selectList(List.activeListIndex === index ? 0 : List.activeListIndex);
        if (List.activeListIndex > index) {
            List.activeListIndex--;
        }
    }
    List.DrawTasks();
    List.DrawLists();

    localStorage.setItem('lists', JSON.stringify(List.allLists));
}

function selectList(index) {
    List.activeListIndex = index;
    List.DrawLists();
    List.DrawTasks();
}

function clearAll() {
    if(List.allLists.length > 0) {
        List.allLists[List.activeListIndex].tasks = [];
    }
    List.DrawTasks();
    localStorage.setItem('lists', JSON.stringify(List.allLists));
}

function clearSelectedTasks() {
    if(List.allLists.length > 0){
        for (let i = 0; i < List.allLists[List.activeListIndex].tasks.length; i++) {
            if (List.allLists[List.activeListIndex].tasks[i].checkboxClass === "far fa-check-square") {
                List.allLists[List.activeListIndex].tasks.splice(i, 1);
                i--;
            }
        }
    }

    List.DrawTasks();
    localStorage.setItem('lists', JSON.stringify(List.allLists));
}

