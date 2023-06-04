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

let ticketArr = [];



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
        createTicket(modalTextArea.value, assignedColor);
        toggleModal();
        modalTextArea.value = '';
    }
}

function createTicket(textValue, ticketColor){
    let ticketDiv = document.createElement('div');
    ticketDiv.className = 'ticket';
    ticketDiv.innerHTML = `
        <div class="ticket-color ${ticketColor}"></div>
        <p class="ticket-id">${uid()}</p>
        <textarea class="ticket-text" disabled="true">${textValue}</textarea>
        <div class="lock-container">
            <div class="lock-head"></div>
            <div class="lock-body"></div>
        </div>`;
    mainContainer.appendChild(ticketDiv);
}

function delTicket(e){
    if(e.target != mainContainer)
        mainContainer.removeChild(e.target.parentNode);
}

function delBtnHandler(){
    delBtn.classList.toggle('del-mode');
    delmodeSwitch = !delmodeSwitch;
}

function changeTicketColor(e){
    let el = e.target;
    if(el.classList[0] == 'ticket-color'){
        let i=(colorClassList.indexOf(el.classList[1])+1) % colorClassList.length;
        el.classList.replace(el.classList[1],colorClassList[i]);
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
    let lock = e.target;
    console.log(e.target);
    lock.parentNode.querySelector('.lock-head').classList.toggle('unlock');
    lockMode = !lockMode;
    lock.parentNode.parentNode.querySelector('.ticket-text').disabled = !lockMode;
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