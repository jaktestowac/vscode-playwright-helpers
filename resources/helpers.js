function autocomplete(input, arr) {
  let currentFocus;
  input.addEventListener("input", function (e) {
    let allItemsDiv;

    let inputValue = this.value;

    closeAllLists();
    if (!inputValue) {
      return false;
    }

    currentFocus = -1;
    allItemsDiv = document.createElement("div");
    allItemsDiv.setAttribute("id", this.id + "autocomplete-list");
    allItemsDiv.setAttribute("class", "autocomplete-items");

    this.parentNode.appendChild(allItemsDiv);

    for (let i = 0; i < arr.length; i++) {
      //   if (arr[i].toLowerCase().startsWith(inputValue.toLowerCase())) {
      if (arr[i].toLowerCase().includes(inputValue.toLowerCase())) {
        let matchingElementDiv = document.createElement("div");
        matchingElementDiv.innerHTML = arr[i];
        matchingElementDiv.addEventListener("click", function (e) {
          input.value = matchingElementDiv.innerHTML;
          closeAllLists();
        });
        allItemsDiv.appendChild(matchingElementDiv);
      }
    }
  });

  input.addEventListener("keydown", function (e) {
    let autocompleteListElements = document.getElementById(this.id + "autocomplete-list");

    if (autocompleteListElements) {
      autocompleteListElements = autocompleteListElements.getElementsByTagName("div");
    }
    if (e.keyCode === 40) {
      // down
      currentFocus++;
      addActive(autocompleteListElements);
    } else if (e.keyCode === 38) {
      // up
      currentFocus--;
      addActive(autocompleteListElements);
    } else if (e.keyCode === 13) {
      // enter
      if (currentFocus > -1) {
        if (autocompleteListElements) {
          autocompleteListElements[currentFocus].click();
        }
      }
    }
  });

  function addActive(autocompleteListElements) {
    if (!autocompleteListElements) {
      return false;
    }
    removeActive(autocompleteListElements);
    if (currentFocus >= autocompleteListElements.length) {
      currentFocus = 0;
    }
    if (currentFocus < 0) {
      currentFocus = autocompleteListElements.length - 1;
    }
    autocompleteListElements[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(autocompleteListElements) {
    for (let i = 0; i < autocompleteListElements.length; i++) {
      autocompleteListElements[i].classList.remove("autocomplete-active");
    }
  }

  function closeAllLists(element) {
    var autocompleteItems = document.getElementsByClassName("autocomplete-items");
    for (let i = 0; i < autocompleteItems.length; i++) {
      if (element !== autocompleteItems[i] && element !== input) {
        autocompleteItems[i].parentNode.removeChild(autocompleteItems[i]);
      }
    }
  }

  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}
