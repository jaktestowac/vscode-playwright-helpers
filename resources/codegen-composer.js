//@ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  // @ts-ignore
  const vscode = acquireVsCodeApi();
  const state = vscode.getState();
  const codegenComposerState = state?.codegenComposerState !== undefined ? state.codegenComposerState : [];

  const executeCommandButton = document.querySelectorAll("#prepareCommandButton");
  const codegenContainerTable = document.querySelector("#codegenContainerTable");
  const optionDescription = document.querySelector("#option-description");
  const optionsDropdown = document.querySelector("#optionsDropdown");
  const addOption = document.querySelector("#addOption");

  restoreCodegenComposerState(codegenComposerState);
  onRowNumberChange();

  function updateCodegenComposerState(codegenComposerState) {
    vscode.setState({ codegenComposerState });
  }

  function restoreCodegenComposerState(codegenComposerState) {
    const codegenContainerTable = document.querySelector("#codegenContainerTable");
    if (codegenContainerTable) {
      for (const row of codegenComposerState) {
        const newRow = createRow(row.key, row.value, row.values, row.description);
        codegenContainerTable.appendChild(newRow);
      }
    }
  }

  function saveCodegenComposerState() {
    const codegenContainerTable = document.querySelector("#codegenContainerTable");
    if (codegenContainerTable) {
      const allRows = codegenContainerTable.querySelectorAll(".cgcRow");
      const codegenComposerState = [];
      for (const row of allRows) {
        // @ts-ignore
        const key = row.querySelector("#name")?.value;
        // @ts-ignore
        const value = row.querySelector("#value")?.value ?? "";
        // @ts-ignore
        const options = row.querySelector("#value")?.options;
        const values = [];
        if (options) {
          for (const option of options) {
            values.push(option.value);
          }
        }

        const description = row.querySelector("#name")?.getAttribute("aria-label");
        codegenComposerState.push({ key, value, values, description });
      }
      updateCodegenComposerState(codegenComposerState);
    }
  }

  for (const button of executeCommandButton) {
    button.addEventListener("click", () => {
      const params = {};
      const allRows = document.querySelectorAll(".cgcRow");

      const emptyErrors = [];
      const endValues = [];
      for (const row of allRows) {
        // @ts-ignore
        const key = row.querySelector("#name")?.value;
        // @ts-ignore
        const value = row.querySelector("#value")?.value;
        if (key.startsWith("--")) {
          params[key] = value;
          if (value === "") {
            emptyErrors.push(key);
          }
        } else {
          endValues.push(value);
        }
      }

      if (emptyErrors.length > 0) {
        addErrorRow(`The following options have empty values: ${emptyErrors.join(", ")}`);
        return;
      } else {
        const errorRow = document.querySelector("#noOptionsRow");
        if (errorRow) {
          errorRow.remove();
        }
      }

      let mergedParams = "";
      for (const [key, value] of Object.entries(params)) {
        mergedParams += `${key}=${value} `;
      }
      for (const value of endValues) {
        mergedParams += ` ${value} `;
      }
      params["mergedParams"] = mergedParams;

      vscode.postMessage({
        type: "prepareCommand",
        params,
      });
    });
  }

  addOption?.addEventListener("click", () => {
    const selectedOption = optionsDropdown?.querySelector("option:checked");
    if (selectedOption === null) {
      return;
    }

    const objRaw = selectedOption?.getAttribute("obj");

    if (!objRaw) {
      return;
    }
    const obj = JSON.parse(objRaw.replace(/\$\$/g, '"'));

    let value = obj.defaultValue;
    if (obj.defaultValue === undefined && obj.valueType !== undefined) {
      value = "";
    }

    const allRows = document.querySelectorAll(".cgcRow");
    for (const row of allRows) {
      // @ts-ignore
      const key = row.querySelector("#name")?.value;
      if (key === obj.key) {
        addErrorRow(`Option ${obj.key} already exists`);
        return;
      }
    }

    const newRow = createRow(obj.key, value, obj.possibleValues, formatDescription(obj, false));
    codegenContainerTable?.appendChild(newRow);
    onRowNumberChange();
  });

  optionsDropdown?.addEventListener("change", (e) => {
    const selectedOption = optionsDropdown.querySelector("option:checked");
    if (selectedOption === null) {
      return;
    }

    if (optionDescription) {
      optionDescription.textContent = "";
    }

    const objRaw = selectedOption.getAttribute("obj");

    if (!objRaw) {
      return;
    }

    const obj = JSON.parse(objRaw.replace(/\$\$/g, '"'));
    if (optionDescription) {
      optionDescription.innerHTML = formatDescription(obj);
    }
  });

  function createRow(key, value, values, description) {
    if (key === undefined && value === undefined && values === undefined) {
      const newRow = document.createElement("tr");
      newRow.setAttribute("id", "noOptionsRow");
      const noOptionsDiv = document.createElement("div");
      noOptionsDiv.textContent = description || "- No options selected";
      const nameCell = document.createElement("td");
      nameCell.setAttribute("colspan", "3");
      nameCell.appendChild(noOptionsDiv);
      newRow.appendChild(nameCell);
      return newRow;
    }

    const newRow = document.createElement("tr");
    newRow.classList.add("cgcRow");

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.setAttribute("placeholder", "Value");
    nameInput.setAttribute("id", "name");
    nameInput.classList.add("settings-table-input");
    nameInput.value = key;
    nameInput.readOnly = true;
    nameInput.setAttribute("aria-label", description);
    nameInput.setAttribute("title", description);

    const nameCell = document.createElement("td");
    nameCell.appendChild(nameInput);
    newRow.appendChild(nameCell);

    if (value !== undefined && (values === undefined || values.length === 0)) {
      const valueInput = document.createElement("input");
      valueInput.type = "text";
      valueInput.setAttribute("placeholder", "Value");
      valueInput.setAttribute("id", "value");
      valueInput.classList.add("settings-table-input");
      valueInput.value = value;
      valueInput.addEventListener("change", () => {
        saveCodegenComposerState();
      });

      const valueCell = document.createElement("td");
      valueCell.appendChild(valueInput);
      newRow.appendChild(valueCell);
    } else if (values !== undefined && values.length > 0) {
      const valueSelect = document.createElement("select");
      valueSelect.setAttribute("id", "value");
      valueSelect.classList.add("settings-table-input");
      valueSelect.classList.add("composer-select");
      valueSelect.classList.add("composer-select-100");

      for (const val of values) {
        const option = document.createElement("option");
        option.value = val;
        option.textContent = val;
        valueSelect.appendChild(option);
      }
      valueSelect.addEventListener("change", () => {
        saveCodegenComposerState();
      });

      const valueCell = document.createElement("td");
      valueCell.appendChild(valueSelect);
      newRow.appendChild(valueCell);
    } else {
      nameCell.setAttribute("colspan", "2");
    }

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "x";
    deleteButton.addEventListener("click", () => {
      newRow.remove();
      onRowNumberChange();
    });
    const deleteCell = document.createElement("td");
    deleteCell.appendChild(deleteButton);
    newRow.appendChild(deleteCell);

    return newRow;
  }

  function onRowNumberChange() {
    const envVarTableRows = document.getElementsByClassName("cgcRow");
    if (envVarTableRows.length === 0) {
      const noOptionsRow = document.querySelector("#noOptionsRow");
      if (noOptionsRow) {
        return;
      }

      const newEmptyRow = createRow();
      codegenContainerTable?.appendChild(newEmptyRow);
    } else {
      const noOptionsRow = document.querySelector("#noOptionsRow");
      if (noOptionsRow) {
        noOptionsRow.remove();
      }
    }
    saveCodegenComposerState();
  }

  function addErrorRow(errorMessage) {
    const errorRow = document.querySelector("#noOptionsRow");
    if (errorRow) {
      errorRow.remove();
    }
    const newRow = createRow(undefined, undefined, undefined, `🛑 ${errorMessage}`);
    codegenContainerTable?.appendChild(newRow);
  }

  function formatDescription(obj, html = true) {
    let fullDescription = `
  ${obj.description}
    `;

    if (obj.possibleValues) {
      if (html) {
        fullDescription += `<br><br><b>Possible values:</b><br>`;
      } else {
        fullDescription += "Possible values: ";
      }
      fullDescription += obj.possibleValues.join(", ");
    }
    return fullDescription;
  }
})();
