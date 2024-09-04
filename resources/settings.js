//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  // @ts-ignore
  const vscode = acquireVsCodeApi();

  const checkboxes = document.querySelectorAll(".checkbox");
  for (const checkbox of checkboxes) {
    checkbox.addEventListener("change", () => {
      const attributeKey = checkbox.getAttribute("key");
      vscode.postMessage({
        type: "updateSetting",
        key: attributeKey,
        // @ts-ignore
        value: checkbox.checked,
      });
    });
  }

  const envVarTable = document.getElementById("envVariablesTableBody");

  if (envVarTable) {
    const newRow = createRow();
    envVarTable.appendChild(newRow);
  }

  const addEnvVariableButton = document.getElementById("addEnvVariable");

  if (addEnvVariableButton) {
    addEnvVariableButton.addEventListener("click", () => {
      const envVarTable = document.getElementById("envVariablesTableBody");
      const lastRow = envVarTable?.lastElementChild;
      if (lastRow) {
        const nameInput = lastRow.querySelector("#name");
        const valueInput = lastRow.querySelector("#value");
        // @ts-ignore
        if (nameInput?.value === "" && valueInput?.value === "") {
          return;
        }
      }

      const newRow = createRow();
      envVarTable?.appendChild(newRow);
    });
  }

  function createRow() {
    const newRow = document.createElement("tr");
    newRow.classList.add("envVarRow");

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.setAttribute("id", "name");
    nameInput.classList.add("settings-table-input");
    nameInput.addEventListener("change", () => {
      inputWasChanged();
    });

    const nameCell = document.createElement("td");
    nameCell.appendChild(nameInput);
    newRow.appendChild(nameCell);

    const valueInput = document.createElement("input");
    valueInput.type = "text";
    valueInput.setAttribute("id", "value");
    valueInput.classList.add("settings-table-input");
    valueInput.addEventListener("change", () => {
      inputWasChanged();
    });

    const valueCell = document.createElement("td");
    valueCell.appendChild(valueInput);
    newRow.appendChild(valueCell);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "x";
    deleteButton.addEventListener("click", () => {
      newRow.remove();
      inputWasChanged();
      const envVarTableRows = document.getElementsByClassName("envVarRow");
      if (envVarTableRows.length === 0) {
        const newEmptyRow = createRow();
        envVarTable?.appendChild(newEmptyRow);
      }
    });
    const deleteCell = document.createElement("td");
    deleteCell.appendChild(deleteButton);
    newRow.appendChild(deleteCell);

    return newRow;
  }

  function inputWasChanged() {
    const envVarTableRows = document.getElementsByClassName("envVarRow");
    const envVars = [];
    for (const row of envVarTableRows) {
      const nameInput = row.querySelector("#name");
      const valueInput = row.querySelector("#value");
      // @ts-ignore
      if (nameInput?.value === "" || valueInput?.value === "") {
        continue;
      }
      // @ts-ignore
      envVars.push({ name: nameInput.value, value: valueInput.value });
    }
    vscode.postMessage({
      type: "updateEnvVariables",
      key: "updateEnvVariables",
      vars: envVars,
    });
  }

  // Call the createRow function to add a new row to the table
  createRow();
})();
