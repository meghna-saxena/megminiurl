const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav");
const url = document.querySelector(".shorten__input");
const shortenButton = document.querySelector(".shorten button.btn");
const shortenForm = document.querySelector(".shorten");
const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
const error = document.querySelectorAll(".shorten span");
const links = [];

const toggleMobileMenu = function() {
  nav.classList.toggle("active");
};

const validateURL = function(input) {
  if (expression.test(input)) {
    shortenForm.classList.remove("error");
    return true;
  } else {
    shortenForm.classList.add("error");
    return false;
  }
};

const clearInput = function() {
  url.value = "";
};

const createTextArea = function(textToCopy) {
  const textArea = document.createElement("textarea");
  textArea.value = textToCopy;
  textArea.style.position = "abolute";
  textArea.style.left = "-9999px";
  textArea.setAttribute("readonly", "");
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
};

const copyToClipboard = function(e) {
  const copyButtons = document.querySelectorAll(
    ".shorten__result-actions button"
  );
  copyButtons.forEach(function(button) {
    button.textContent = "Copy";
    button.classList.remove("copied");
  });
  if (e.target.parentElement.classList.contains("shorten__result-actions")) {
    const copyText = e.target.previousSibling;
    createTextArea(copyText.textContent);
    e.target.classList.add("copied");
    e.target.textContent = "Copied!";
  }
};

const getLocalStorage = function() {
  if (localStorage.getItem("links")) {
    const data = JSON.parse(localStorage.getItem("links"));
    data.forEach(function(link) {
      links.push(link);
    });
  } else {
    links.length = 0;
    return;
  }
  links.forEach(function(link) {
    shortenForm.insertAdjacentHTML("afterend", link);
  });
};

const setLocalStorage = function(link) {
  links.push(link);
  localStorage.setItem("links", JSON.stringify(links));
};

const shortenLink = function() {
  const urlToShorten = url.value;
  if (validateURL(urlToShorten)) {
    fetch(`https://rel.ink/api/links/`, {
      method: "POST",
      body: JSON.stringify({
        url: urlToShorten
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        let html = `
      <div class="shorten__result">
        <p class="shorten__result-link">${urlToShorten}</p>
        <div class="shorten__result-actions">
          <a href="${data.url}">https://rel.ink/${data.hashid}</a><button class="btn btn--squared">Copy</button>
        </div>
      </div>
    `;
        shortenForm.insertAdjacentHTML("afterend", html);
        clearInput();
        setLocalStorage(html);
      })
      .catch(error => {
        console.log(error);
      });
  } else {
    console.log("Nothing Happened");
  }
};

burger.addEventListener("click", toggleMobileMenu);
shortenButton.addEventListener("click", shortenLink);
window.addEventListener("keydown", function(e) {
  if (e.keyCode === 13 || e.which === 13) {
    shortenLink();
  }
});
document.addEventListener("click", copyToClipboard);
window.addEventListener("load", getLocalStorage);
