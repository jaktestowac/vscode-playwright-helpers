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

  const MAX_VISIBLE_VALUES = 10;

  restoreCodegenComposerState(codegenComposerState);
  onRowNumberChange();
  onDropDownOptionChange(optionsDropdown);

  function updateCodegenComposerState(codegenComposerState) {
    vscode.setState({ codegenComposerState });
  }

  function restoreCodegenComposerState(codegenComposerState) {
    const codegenContainerTable = document.querySelector("#codegenContainerTable");
    if (codegenContainerTable) {
      for (const row of codegenComposerState) {
        
        // Get the possible values from the dropdown
        const optionsDropdown = document.querySelector("#optionsDropdown");
        const selectedOption = optionsDropdown?.querySelector(`option[value="${row.key}"]`);
        const objRaw = selectedOption?.getAttribute("obj");
        let possibleValues;
        
        if (objRaw) {
          const obj = JSON.parse(objRaw.replace(/\$\$/g, '"'));
          possibleValues = obj.possibleValues;
        }
  
        // Create row with possible values to properly handle display/value pairs
        const newRow = createRow(row.key, row.value, possibleValues, row.description);
        
        // Set the initial selected value
        if (possibleValues && row.value) {
          const valueSelect = newRow.querySelector("#value");
          if (valueSelect) {
            // @ts-ignore
            valueSelect.value = row.value;
          }
        }
        
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

        if (key === "url" && (!value || value.trim() === "")) {
          emptyErrors.push("url");
          continue;
        }

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
        if (value !== undefined) {
          mergedParams += `${key}=${value} `;
        } else {
          mergedParams += `${key} `;
        }
      }
      for (const value of endValues) {
        mergedParams += ` ${value} `;
      }
      params["mergedParams"] = mergedParams;

      vscode.postMessage({
        type: "prepareCommand",
        params,
      });
      onRowNumberChange();
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
    onDropDownOptionChange(optionsDropdown);
  });

  function onDropDownOptionChange(optionsDropdown) {
    if (!optionsDropdown) {
      optionsDropdown = document.querySelector("#optionsDropdown");
    }

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
      optionDescription.innerHTML = formatDescription(obj, true);
    }
  }

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
        if (typeof val === 'object' && 'value' in val) {
          option.value = val.value;
          option.textContent = val.display;
        } else {
          option.value = val;
          option.textContent = val;
        }
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
        noOptionsRow.remove();
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
    let fullDescription = `${obj.description}`.trim();
    fullDescription = fullDescription.charAt(0).toUpperCase() + fullDescription.slice(1);

    if (obj.possibleValues) {
      if (html) {
        fullDescription += `<br><b>Possible values:</b><br>`;

        const allValues = obj.possibleValues.map((val) => 
          typeof val === 'object' ? `<code>${val.display}</code>` : `<code>${val}</code>`
        );
        
        if (allValues.length > MAX_VISIBLE_VALUES) {
          const initialValues = allValues.slice(0, MAX_VISIBLE_VALUES);
          const remainingValues = allValues.slice(MAX_VISIBLE_VALUES);
          fullDescription += `<div class="values-container">`;
          fullDescription += initialValues.join(", ");
          fullDescription += `<span class="hidden-by-default"> , ${remainingValues.join(", ")}</span>`;
          fullDescription += `<button class="show-more-btn">Show more</button>`;
          fullDescription += `</div>`;
        } else {
          fullDescription += allValues.join(", ");
        }
      } else {
        fullDescription += "\nPossible values:\n";
        
        const values = obj.possibleValues.map(val => 
          typeof val === 'object' ? val.display : val
        ).slice(0, MAX_VISIBLE_VALUES);
        fullDescription += values.join(", ");
        if (obj.possibleValues.length > MAX_VISIBLE_VALUES) {
          fullDescription += "...";
        }
      }
    }

    if (obj.sampleValues) {
      if (html) {
        fullDescription += `<br><b>Sample values:</b><br>`;
      } else {
        fullDescription += "\nSample values:\n";
      }

      if (html) {
        fullDescription += obj.sampleValues.join("<br>");
      } else {
        fullDescription += obj.sampleValues.join("\n");
      }
    }

    if (html) {
      fullDescription = `<i>${fullDescription}</i>`;
    }

    if (html) {
      fullDescription = fullDescription.replace(/`([^`]+)`/g, "<code>$1</code>");
      fullDescription = fullDescription.replace(/'([^']+)'/g, "<code>$1</code>");
    }
    return fullDescription;
  }

  document.addEventListener('click', function(e) {
    if (e.target && e.target instanceof HTMLElement && e.target.classList.contains('show-more-btn')) {
      const hiddenValues = /** @type {HTMLElement} */ (e.target.previousElementSibling);
      if (hiddenValues) {
        hiddenValues.style.display = 'inline';
        e.target.style.display = 'none';
      }
    }
  });
})();
