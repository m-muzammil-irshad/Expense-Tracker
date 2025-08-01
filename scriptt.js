const transactionForm = document.querySelector("#transactionForm");

const state = {
    expense: 0,
    earning: 0,
    net: 0,
    transactions: [

    ]
};
let update = false;
let tid;

const addTransaction = (e) => {
    e.preventDefault();
    const data = {}
    const formData = new FormData(transactionForm);
    formData.forEach((value, key) => {
        data[key] = value;
    });
    const isEarn = e.submitter.id === 'ernBtn' ? true : false;
    const { txt, amount } = data;

    const transaction = {
        id: update ? tid : Math.floor(Math.random() * 1000),
        amount: +amount,
        text: txt,
        type: isEarn ? "credit" : "debit",
    };

if(update){
const tIndex = state.transactions.findIndex((t) => t.id === tid);
state.transactions[tIndex] = transaction;
update = false;
tid = null;
}else{
state.transactions.push(transaction);
}
    renderTransaction(transaction);
}
transactionForm.addEventListener("submit", addTransaction);



const renderTransaction = () => {
    const transactions = document.querySelector(".transactions");
    const total = document.querySelector(".balance h2");
    const earningAmnt = document.querySelector("#ernBtn .earning_amnt");
    const expenseAmnt = document.querySelector("#expenceBtn .expense_amnt");
    transactions.innerHTML = "";
    const showTransactions = state.transactions;
    let earning = 0;
    let expense = 0;
    let net = 0;
    showTransactions.forEach((transaction) => {
        const { id, amount, text, type } = transaction;
        const isCredit = type === 'credit' ? true : false;
        const sign = isCredit ? "+" : "-";
        earning += isCredit ? amount : 0;
        expense += !isCredit ? amount : 0;
        net = earning - expense;
        const transactionTemplate =
            ` <div class="transaction" id = "${id}">
                <div class="content" onclick = "showEdit(${id})">
                <div class="left_part">
                    <p class="earning_src">${text}</p>
                    <p class="earning_amnt">${sign} ${amount} Rs</p>
                </div>
                <div class="status ${isCredit ? "credit" : "debit"}">${isCredit ? "C" : "D"}</div>
                </div>
                <div class="lower">
                    <i class="fa-solid fa-pen" onclick = "editHandler(${id})"></i>
                    <i class="fa-solid fa-trash-can" onclick = "deleteHandler(${id})"></i>
                </div>
            </div>`


        transactions.innerHTML += transactionTemplate;
        total.innerHTML = `${net} Rs`;
        earningAmnt.innerHTML = `${earning} Rs`;
        expenseAmnt.innerHTML = `${expense} Rs`;

    });
}
renderTransaction();


const showEdit = (id) => {

    const seletedTransaction = document.getElementById(id);
    const lower = seletedTransaction.querySelector(".lower");
    lower.classList.toggle("showLower");
}

const deleteHandler = (id) => {
    const filtered = state.transactions.filter((t) => t.id !== id);
    state.transactions = filtered;
    renderTransaction();
}

const editHandler = (id) => {
const findTransaction = state.transactions.find((t)=>t.id === id);
const {text,amount} = findTransaction;

const textInput = document.querySelector("#text");
const amountInput = document.querySelector("#amount");

textInput.value = text;
amountInput.value = amount;
update = true;
tid = id;

}