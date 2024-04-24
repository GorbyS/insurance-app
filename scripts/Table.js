'use strict';

class Table {

  constructor() {
    const recordsFromStorage = localStorage.getItem("records");
    this.records = recordsFromStorage ? JSON.parse(recordsFromStorage) : [];

    this.tbody = document.createElement("tbody");
    this.button = document.getElementById("confirm");
    this.fullName = document.getElementById("full-name");
    this.bday = document.getElementById("bday");
    this.phoneNum = document.getElementById("phone");
    this.email = document.getElementById("email");

    this.warningMessage = document.createElement("p");
    this.warningMessage.innerText = "There are no items available.";
    this.warningMessage.style.display = this.records.length === 0 ? "block" : "none"


    this.createInsuredTable();
    this.saveNewInsured();
    this.setDataOnLoad();
  }

  createInsuredTable() {
    let columnTitles = ["Full name", "Birthday", "Phone Number", "Email"];
    let parentPath = document.getElementById("insured-person");
    

    let table = document.createElement("table");
    let header = document.createElement("thead");
    let headerTr = document.createElement("tr");
    let titleInsured = document.createElement("h2");
    titleInsured.innerText = "Created clients";


    for (let i = 0; i < columnTitles.length; i++) {
      let td = document.createElement("td");
      td.innerHTML = columnTitles[i];
      headerTr.appendChild(td);
    }

    table.classList.add("insured-table");
    table.appendChild(this.tbody);
    parentPath.appendChild(titleInsured);
    parentPath.appendChild(table);
    header.appendChild(headerTr);
    table.appendChild(header);
    table.appendChild(this.warningMessage);
  }
  
  createCell(data) {
    let td = document.createElement("td");
    td.setAttribute("id", "user-data");
    td.innerHTML = data;

    return td;
  }

  saveNewInsured() {
    this.button.onclick = () => {
      const record = new User(this.fullName.value, this.phoneNum.value, this.bday.value, this.email.value);
      const existingData = localStorage.getItem("records");

      
      if (this.validateForm() === false) {
        return;
      }


      if (existingData) {
        this.records = JSON.parse(existingData);
        this.records.push(record);
      } else {
        this.records = [record];
      }


      localStorage.setItem("records", JSON.stringify(this.records));
      this.createTableRow(record);
      this.warningMessage.style.display = this.records.length === 0 ? "block" : "none";


      this.fullName.value = "";
      this.phoneNum.value = "";
      this.bday.value = "";
      this.email.value = "";
    };
  }

  setDataOnLoad() {
    for (const user of this.records) {
      this.createTableRow(user);
    }
  }

  createDeleteButton(user) {
    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = () => {
      this.deleteUser(user);
    };
    return deleteButton;
  }

  deleteUser(user) {
    const index = this.records.indexOf(user);

    if (index !== -1) {
      this.records.splice(index, 1);
    }

    localStorage.setItem("records", JSON.stringify(this.records));
    this.clearTable();
    this.setDataOnLoad();
  }

  clearTable() {
    this.tbody.innerHTML = "";
    this.warningMessage.style.display = this.records.length === 0 ? "block" : "none";
  }

  createTableRow(user) {
    let tr = document.createElement("tr");
    this.tbody.appendChild(tr);

    tr.appendChild(this.createCell(user.fullName));
    tr.appendChild(this.createCell(user.bday));
    tr.appendChild(this.createCell(user.phone));
    tr.appendChild(this.createCell(user.email));

    let deleteButtonCell = document.createElement("td");
    deleteButtonCell.appendChild(this.createDeleteButton(user));
    tr.appendChild(deleteButtonCell);
  }


  createError(input, text) {
    const parent = input.parentNode;
    const errorLabel = document.createElement("label");

    errorLabel.classList.add("error-label");
    errorLabel.textContent = text;
    parent.classList.add("error");
    parent.append(errorLabel);
  }

  removeError(input) {
    const parent = input.parentNode;

    if (parent.classList.contains("error")) {
      parent.querySelector('.error-label').remove();
      parent.classList.remove("error");
    }

  }

  validateForm() {
    const form = document.getElementById("user-form");
    const allInputs = form.querySelectorAll("input");
    let result = true;
    let phonePatern = /^\+(?:[0-9] ?){10,14}[0-9]$/;
    let userNamePatern = /[A-Za-z]+/;
    // let userBdayPatern = "d";

    form.addEventListener('submit', function(event) {
      event.preventDefault();
    });

    for (const input of allInputs) {

      this.removeError(input);

      if (input.dataset.minLength) {

        if (input.value.length < input.dataset.minLength) {
          this.removeError(input);
          this.createError(input, `Min ${input.dataset.minLength} symbols`);
          result = false;
        }

      }

      if (input.dataset.maxLength) {

        if (input.value.length > input.dataset.maxLength) {
          this.removeError(input);
          this.createError(input, `Max ${input.dataset.maxLength} symbols`);
          result = false;
        }

      }

      if (input.dataset.required == "true") {

        if (input.value == "") {
          this.removeError(input);
          this.createError(input, "Please fill out the field");
          result = false;
        }
        
      }


    }

    // if (!userNamePatern.test(this.fullName.value)) {
    //   this.removeError(this.fullName);
    //   this.createError(this.fullName, "Must contain only letters");
    // }

    if (!userNamePatern.test(this.fullName.value)) {
      this.removeError(this.fullName);
      this.createError(this.fullName, "Must contain only letters");
    }

    if (!phonePatern.test(this.phoneNum.value)) {
      this.removeError(this.phoneNum);
      this.createError(this.phoneNum, "Please fill correct phone number");
    }

    return result;
  }


}




