let addBtn = document.querySelector('.add-btn');
let delBtn = document.querySelector('.del-btn');
let modalCont = document.querySelector('.modal-container');
let priorityColorContainer = document.querySelector('.priority-color-cont');
let modalTextArea = modalCont.querySelector('textarea');
let mainContainer = document.querySelector('.ticket-cont');
let colorToolbox = document.querySelector('.toolbox-priority-cont');
let uid = new ShortUniqueId();
let selectedColor = null, assignedColor = null, delmodeSwitch = false, createmodeSwitch = false, lockMode = false;
let colorClassList = ['pink','skyblue','green','grey'];
let currentFilter = null;

let ticketData = localStorage.getItem('tickets') ? JSON.parse(localStorage.getItem('tickets')) : [];
ticketData.forEach(t => createTicket(t.text, t.color, t.id));

function toggleModal() {
    modalCont.classList.toggle('visible');
    addBtn.classList.toggle('rotate');
    createmodeSwitch = !createmodeSwitch;
    if(createmodeSwitch){
        priorityColorContainer.addEventListener('click',priorityColorHandler);
        modalTextArea.addEventListener('keydown', createTicketHandler);
    }
    else{
        priorityColorContainer.removeEventListener('click',priorityColorHandler);
        modalTextArea.removeEventListener('keydown', createTicketHandler);
    }
}

function priorityColorHandler(e){
    e.target.classList.toggle('selected');
    if(selectedColor != null) selectedColor.classList.toggle('selected');
    selectedColor = e.target;
    assignedColor = selectedColor.classList[1];
}

function createTicketHandler(e){
    if(e.key != 'Enter') return;
    if(modalTextArea.value == '') alert('Please enter text');
    else if(!assignedColor) alert('Please select a color');
    else {
        let id = uid();
        createTicket(modalTextArea.value, assignedColor, id);
        updateStorage(id, modalTextArea.value, assignedColor);
        toggleModal();
        modalTextArea.value = '';
    }
}

function createTicket(textValue, ticketColor, id){
    let ticketDiv = document.createElement('div');
    ticketDiv.className = 'ticket';
    ticketDiv.innerHTML = `
        <div class="ticket-color ${ticketColor}"></div>
        <p class="ticket-id">${id}</p>
        <div class="ticket-text">${textValue}</div>
        <div class="lock-container">
            <div class="lock-head"></div>
            <div class="lock-body"></div>
        </div>`;
    mainContainer.appendChild(ticketDiv);
}

function delTicket(e){
    if(e.target != mainContainer){
        let id = e.target.parentNode.querySelector('.ticket-id').textContent;
        mainContainer.removeChild(e.target.parentNode);
        delStorage(id);
    }
}

function delBtnHandler(){
    delBtn.classList.toggle('del-mode');
    delmodeSwitch = !delmodeSwitch;
}

function delStorage(id){
    for(let i=0; i<ticketData.length; i++){
        if(ticketData[i].id == id){
            ticketData.splice(i,1);
            break;
        }
    }
    localStorage.setItem('tickets', JSON.stringify(ticketData));
}

function changeTicketColor(e){
    let el = e.target;
    if(el.classList[0] == 'ticket-color'){
        let i=(colorClassList.indexOf(el.classList[1])+1) % colorClassList.length;
        el.classList.replace(el.classList[1],colorClassList[i]);
        let id = el.nextElementSibling.textContent;
        let text = '';
        updateStorage(id, text, colorClassList[i]);
    }
}

function filterTickets(e){
    if(e.target == colorToolbox) return;
    let ticketList = mainContainer.children;
    let newFilter = e.target;
    if(newFilter == currentFilter){
        for(let i=0; i<ticketList.length; i++){
            ticketList[i].style.display = 'flex';
        }
        currentFilter = null;
    }
    else{
        if(currentFilter) currentFilter.classList.remove('filter-select');
        for(let i=0; i<ticketList.length; i++){
            if(ticketList[i].querySelector('.ticket-color').classList[1] == newFilter.classList[1]){
                ticketList[i].style.display = 'flex';
            }
            else{
                ticketList[i].style.display = 'none';
            }
        }
        currentFilter = newFilter;
    }
    newFilter.classList.toggle('filter-select');
}

function lockHandler(e) {
    let targetTicket = e.target.parentNode.parentNode;
    let ticketText = targetTicket.querySelector('.ticket-text');
    let id = targetTicket.querySelector('.ticket-id').textContent;
    let color = '';

    targetTicket.querySelector('.lock-head').classList.toggle('unlock');
    lockMode = !lockMode;
    ticketText.contentEditable = lockMode;

    if(!lockMode) updateStorage(id, ticketText.textContent, color);
}

function updateStorage(id,text,color){
    let data = null;    
    for(let t of ticketData){
        if(t.id == id){
            t.text = text || t.text;
            t.color = color || t.color;
            
            data = true;
        }
    }
    if(!data){
        data = {
            id: id,
            text: text,
            color: color
        }
        ticketData.push(data);
    }
    localStorage.setItem('tickets', JSON.stringify(ticketData));
}


addBtn.addEventListener('click', toggleModal);
delBtn.addEventListener('click', delBtnHandler);
colorToolbox.addEventListener('click', filterTickets);
mainContainer.addEventListener('click', (e) => {
    let modeSwitch = e.target.classList[0];
    if(delmodeSwitch) delTicket(e);
    else if(modeSwitch == 'ticket-color') changeTicketColor(e);
    else if(modeSwitch == 'lock-body' || modeSwitch == 'lock-head') lockHandler(e);
});

/* 

Updating localStorage
1. createTicket: at the end of create ticket fn
    create new object for ticket-text, ticket-color, ticket-id
    add this object to tickerArr
2. delTicket: on target click
    del data of the tickets selected
    from localStorage
3. changeTicketColor: on target click
    update ticket-color of corresponding ticket-id
    in ticketData
4. lockHandler: on lock
    update ticket-text of corresponding ticket-id
    in ticketData

Reloading from localStorage on page load
1. fetch data from localStorage into an array
2. traverse through the array
3. createTicket from every item in array

*/