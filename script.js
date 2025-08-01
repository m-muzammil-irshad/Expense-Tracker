
const transactionForm = document.querySelector("#transactionForm");
const state = {
    expense: 0,
    earning: 0,
    net: 0,
    transactions: [

    ]
}
 
let update = false;
let tid;

const addtransaction = (e) => {
    e.preventDefault();
    const isEarn = e.submitter.id === 'ernBtn' ? true : false;

    const formData = new FormData(transactionForm);
    const tData = {};
    formData.forEach((value, key) => {
        tData[key] = value;
    });
    const { txt, amount } = tData;
    const transaction = {
        id: update ? tid : Math.floor(Math.random() * 1000),
        text: txt,
        amount: +amount,
        type: isEarn ? "Credit" : "Debit"
    };
    if (update) {
        const tIndex = state.transactions.findIndex((t) => t.id === tid);

        state.transactions[tIndex] = transaction;
        update = false;
        tid = null;
    } else {
        state.transactions.push(transaction);
    }
    renderTransactions(transaction)
}
transactionForm.addEventListener("submit", addtransaction);


const renderTransactions = () => {
    const transactions = document.querySelector(".transactions");
    const netAmount = document.querySelector(".balance h2");
    const earningAmnt = document.querySelector("#ernBtn .earning_amnt");
    const expenseAmnt = document.querySelector("#expenceBtn .expense_amnt");
    transactions.innerHTML = "";
    const showTransactions = state.transactions;
    let earning = 0;
    let expense = 0;
    let net = 0;

    showTransactions.forEach((transaction) => {
        const { id, text, amount, type } = transaction;
        const isCredit = type === "Credit" ? true : false;
        const sign = isCredit ? '+' : '-';
        const transactionEl =
            `<div class="transaction" id = "${id}">
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
        earning += isCredit ? amount : 0;
        expense += !isCredit ? amount : 0;
        net = earning - expense;
        transactions.insertAdjacentHTML("afterbegin", transactionEl);

        netAmount.innerText = `${net} Rs`;
        earningAmnt.innerText = `${earning} Rs`;
        expenseAmnt.innerText = `${expense} Rs`;
    });
};
renderTransactions();

const showEdit = (id) => {
    const selectedTransaction = document.getElementById(id);
    const lower = selectedTransaction.querySelector(".lower");
    lower.classList.add("showLower");
}
const deleteHandler = (id) => {
   // Pehle us transaction ko dhoondho jo delete karni hai
    const transactionToDelete = state.transactions.find((t) => t.id === id);

    // Agar transaction mil gayi to earning ya expense me se uska amount hatao
    if (transactionToDelete.amount > 0) {
        state.earning -= transactionToDelete.amount;
    } else {
        state.expense -= Math.abs(transactionToDelete.amount);
    }

    // Us transaction ko list se hata do
    state.transactions = state.transactions.filter((t) => t.id !== id);

    // Net balance dobara calculate karo
    state.net = state.earning - state.expense;

    // UI dobara render karo
    renderTransactions();
};

const editHandler = (id) => {
    const findTransaction = state.transactions.find((t) => t.id === id);
    const { text, amount } = findTransaction;
    const textInput = document.querySelector("#text");
    const amountInput = document.querySelector("#amount");
    textInput.value = text;
    amountInput.value = amount;

    update = true;
    tid = id;
}

