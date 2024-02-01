const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("Alert");
const listItems = document.getElementById("list-items");
const addUpdate = document.getElementById("AddUpdateClick");
const searchValue = document.getElementById("search-box");





const generate_unique_id = () => {
    const id = "id" + Math.random().toString(16).slice(2);
    return id;
}



const fetch_from_local_storage = () => {
    const arr = JSON.parse(localStorage.getItem('todolist'));
    return arr;

}

const add_to_local_storage = (obj) => {
    const arr = fetch_from_local_storage();
    const updated_arr = JSON.stringify([obj, ...arr])
    localStorage.setItem('todolist', updated_arr);
    populate_todos(fetch_from_local_storage());
}

const delete_from_local_storage = (id) => {
    const arr = fetch_from_local_storage();
    const updated_arr = arr.filter((ele) => ele.id !== id)
    localStorage.setItem('todolist', JSON.stringify(updated_arr));
    populate_todos(fetch_from_local_storage());
}

const update_in_local_storage = (id) => {
    const arr = fetch_from_local_storage();
    const updated_arr = arr.map(obj => {
        if (obj.id === id) {
            return { id: obj.id, task: todoValue.value, status: obj.status }
        } else {
            return obj;
        }
    });
    localStorage.setItem('todolist', JSON.stringify(updated_arr));
    populate_todos(fetch_from_local_storage());
}

const create_element = (task, id) => {
    const li = document.createElement("li");
    const div1 = document.createElement("div");
    const div2 = document.createElement("div");
    const img1 = document.createElement("img");
    const img2 = document.createElement("img");

    div1.id = id;
    div1.title = "Hit Double Click and Complete";
    div1.ondblclick = () => completed_todo_items(div1);
    div1.textContent = task;

    img1.className = "edit todo-controls";
    img1.onclick = () => update_todo_item(img1);
    img1.src = "/images/pencil.png";

    img2.className = "delete todo-controls";
    img2.onclick = () => delete_todo_item(img2);
    img2.src = "/images/delete.png";

    div2.appendChild(img1);
    div2.appendChild(img2);

    li.appendChild(div1);
    li.appendChild(div2);

    return li;
}

const populate_todos = (arr) => {
    // const arr = fetch_from_local_storage();
    // Populate the todo list container

    listItems.textContent = '';
    arr.forEach(({ task, id }) => {
        const li = create_element(task, id);
        listItems.appendChild(li);
    })
}


const set_alert_message = (str, color = 'green') => {
    todoAlert.textContent = str;
    todoAlert.style.color = color;
    setTimeout(() => {
        todoAlert.textContent = '';
    }, 3000);
}


const create_do_item = () => {
    if (todoValue.value === "") {
        set_alert_message("Please enter your todo text!", 'red')
        todoValue.focus();
    } else {

        let itemList = { task: todoValue.value, id: generate_unique_id(), status: false };
        add_to_local_storage(itemList);
        todoValue.value = "";
        set_alert_message("Todo item Created Successfully!");
    }
}

const delete_todo_item = (e) => {
    const id = e.parentElement.parentElement.querySelector('div').getAttribute('id')
    delete_from_local_storage(id);
    console.log(id)
    set_alert_message(`Task successfully deleted`)
}







if (localStorage.getItem('todolist') === null) {
    const obj = [];
    localStorage.setItem('todolist', JSON.stringify(obj));
    console.log(localStorage.getItem('todolist'));
}
populate_todos(fetch_from_local_storage());




function update_todo_item(f) {
    if (
        f.parentElement.parentElement.querySelector("div").style.textDecoration ===
        ""
    ) {
        console.log(f)
        todoValue.value =
            f.parentElement.parentElement.querySelector("div").innerText;
        const id = f.parentElement.parentElement.querySelector('div').getAttribute('id')
        updateText = f.parentElement.parentElement.querySelector("div");
        addUpdate.setAttribute("onclick", `update_on_selection_items('${id}')`);
        addUpdate.setAttribute("src", "/images/refresh.png");
        todoValue.focus();
    }
}


const update_on_selection_items = (id) => {
    update_in_local_storage(id)
    addUpdate.setAttribute("onclick", "CreateToDoItems()");
    addUpdate.setAttribute("src", "/images/plus.png");
    todoValue.value = "";
    set_alert_message("Todo item Updated Successfully!");
}


const completed_todo_items = (e) => {
    if (e.parentElement.querySelector("div").style.textDecoration === "") {
        const img = document.createElement("img");
        img.src = "/images/check-mark.png";
        img.className = "todo-controls";
        e.parentElement.querySelector("div").style.textDecoration = "line-through";
        e.parentElement.querySelector("div").appendChild(img);
        e.parentElement.querySelector("img.edit").remove();


        const id = e.parentElement.querySelector("div").getAttribute('id')
        const todo = fetch_from_local_storage();
        todo.forEach((element) => {
            if (
                element.id = id
            ) {
                element.status = true;
            }
        });
        localStorage.setItem('todolist', JSON.stringify(todo))
        set_alert_message("Todo item Completed Successfully!");
    }
}



searchValue.addEventListener("blur", (e) => search_task(e))
const search_task = (e) => {
    console.log(searchValue.value)
    if (searchValue.value === "") {
        populate_todos(fetch_from_local_storage())
    } else {

        const arr = fetch_from_local_storage();

        const updated_arr = arr.filter(ele => ele.task.includes(searchValue.value))
        populate_todos(updated_arr)
    }

}

