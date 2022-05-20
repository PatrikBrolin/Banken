const logoutForm = document.getElementById("logout");
const userName = document.querySelector(".user");
const accountUserName = document.querySelector(".account-user-name");
const accountNumber = document.querySelector(".account-number");
let accountForm = document.getElementById("add-account-form");
const content = document.querySelector(".content");
const btnLeft = document.querySelector(".btn-left");
const btnRight = document.querySelector(".btn-right");
const accountCard = document.querySelectorAll("main-card");
const accountDiv = document.querySelector(".account");
let deleteAccountForm = document.getElementById("delete-account-form");
let addMoneyForm = document.getElementById("add-money-form");
let withdrawMoneyForm = document.getElementById('withdraw-money-form')

withdrawMoneyForm.addEventListener('submit', async (e) => {
	e.preventDefault();

	const acc = await getAccounts();

	let withdrawSelection = document.getElementById("withdrawSelection").value;
	let withdrawInput = document.getElementById("withdrawInput").value;
	let currentValue = 0;

	acc.forEach((item) => {
		if (item._id === withdrawSelection) {
			currentValue = item.AccountAmount;
		}
	});

	withdrawInput = parseInt(currentValue) - parseInt(withdrawInput);

	if(withdrawInput >= 0){
		await fetch(`api/withdraw/${withdrawSelection}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				accountAmount: withdrawInput,
			}),
		});
	} else{
		alert(`Du kan max ta ut ${currentValue} kr`)
	}

})

addMoneyForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	const acc = await getAccounts();

	let moneySelection = document.getElementById("moneySelection").value;
	let moneyInput = document.getElementById("moneyInput").value;
	let currentValue = 0;

	acc.forEach((item) => {
		if (item._id === moneySelection) {
			currentValue = item.AccountAmount;
		}
	});

	moneyInput = parseInt(moneyInput) + parseInt(currentValue);
	await fetch(`api/addmoney/${moneySelection}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			accountAmount: moneyInput,
		}),
	});
});

deleteAccountForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	let accountSelection = document.getElementById("accountSelection").value;

	await fetch(`api/delete/${accountSelection}`, { method: "DELETE" });
});

logoutForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	await fetch("/api/logout", { method: "POST" });

	location.href = "http://localhost:3000/";
});

accountForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	const user = await checkForUser();

	const accountName = document.getElementById("account-name");
	const amount = document.getElementById("amount");

	const res = await fetch("/api/create-account", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			accountName: accountName.value,
			accountAmount: amount.value,
			user: user._id,
		}),
	});
});

const checkForUser = async () => {
	const res = await fetch("/api/user");
	const data = await res.json();

	return data.user;
};

const getAccounts = async () => {
	const res = await fetch("/api/accounts");
	const data = await res.json();

	return data.accounts;
};

const render = async () => {
	content.innerHTML = "";
	let user = await checkForUser();
	let accounts = await getAccounts();

	accounts.forEach((account) => {
		let accountName = document.createElement("h4");
		accountName.innerText = account.AccountName;
		accountName.classList.add("account-name");

		let accountNumber = document.createElement("p");
		accountNumber.innerText = account._id;
		accountNumber.classList.add("account-number");

		let accountUserName = document.createElement("p");
		accountUserName.innerText = user.Username;
		accountUserName.classList.add("account-user-name");

		let mainCard = document.createElement("div");
		mainCard.classList.add("main-card");

		let masterCard = document.createElement('i')
		masterCard.classList.add('fa', 'fa-cc-mastercard', 'fa-4x')

		mainCard.append(accountName, accountNumber, accountUserName, masterCard);
		content.append(mainCard);

		mainCard.addEventListener("click", (e) => {
			accountDiv.innerHTML = "";
			
			let nameOnAccount = document.createElement("h3");
			let amountOnAccount = document.createElement("p");
			nameOnAccount.innerText = `${account.AccountName}`;
			amountOnAccount.innerText = `${account.AccountAmount} Kr`;

			accountDiv.append(nameOnAccount, amountOnAccount);
		});
	});
};

btnRight.addEventListener("click", () => {
	content.scrollLeft += 420;
});

btnLeft.addEventListener("click", () => {
	content.scrollLeft -= 420;
});

function addAccount() {
	accountForm.style.display = "flex";
}

async function addMoney() {
	let accounts = await getAccounts();
	let accountSelection = document.getElementById("moneySelection");
	accountSelection.innerHTML = "";
	accounts.forEach((item) => {
		let option = document.createElement("option");
		option.innerText = item.AccountName;
		option.value = item._id;
		accountSelection.append(option);
	});
	addMoneyForm.style.display = "flex";
}

async function withdrawMoney(){
	let accounts = await getAccounts();
	let accountSelection = document.getElementById("withdrawSelection");
	accountSelection.innerHTML = "";
	accounts.forEach((item) => {
		let option = document.createElement("option");
		option.innerText = item.AccountName;
		option.value = item._id;
		accountSelection.append(option);
	});
	withdrawMoneyForm.style.display = "flex";
}

async function deleteAccount() {
	let accounts = await getAccounts();
	let accountSelection = document.getElementById("accountSelection");
	accountSelection.innerHTML = "";
	accounts.forEach((item) => {
		let option = document.createElement("option");
		option.innerText = item.AccountName;
		console.log(option);
		option.value = item._id;
		accountSelection.append(option);
	});
	deleteAccountForm.style.display = "flex";
}

function closeWindow() {
	accountForm.style.display = "none";
	deleteAccountForm.style.display = "none";
	addMoneyForm.style.display = "none";
	location.reload();
}

render();