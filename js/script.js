let buttonCount = 0;
let buttonsCreated = false;

function updateLinkCount() {
  const linksTextarea = document.getElementById("linksTextarea");
  const text = linksTextarea.value;
  const links = extractLinks(text);
  const duplicateRanges = findDuplicateRanges(links);

  const duplicateText =
    duplicateRanges.length > 0
      ? "Дубль ссылок: " + duplicateRanges.join(", ")
      : "Дублей нет.";

  const linkCountElement = document.getElementById("linkCount");
  linkCountElement.textContent = links.length + "";

  linkCountElement.style.color =
    duplicateRanges.length > 0 ? "#D82621" : "#34db06";

  linksTextarea.style.border =
    text.trim() === ""
      ? "2px solid black"
      : duplicateRanges.length > 0
      ? "2px solid #D82621"
      : "2px solid #34db06";

  const duplicateSpan = document.createElement("span");
  duplicateSpan.textContent = duplicateText;
  duplicateSpan.classList.add("duplicate-info");
  linkCountElement.appendChild(duplicateSpan);

  const statusIcon = document.getElementById("statusIcon");
  statusIcon.src =
    links.length > 0 && duplicateRanges.length > 0
      ? "./svg/stop.svg"
      : "./svg/done.svg";
}

function extractLinks(text) {
  const lines = text.split("\n");
  const urls = [];

  lines.forEach((line) => {
    if (line.trim() !== "") {
      if (isValidURL(line.trim())) {
        urls.push(line.trim());
      }
    }
  });

  return urls;
}

function findDuplicateRanges(array) {
  const duplicates = {};
  const duplicateRanges = [];

  array.forEach((item, index) => {
    if (array.indexOf(item) !== index) {
      if (!(item in duplicates)) {
        duplicates[item] = true;
        const startRange = array.indexOf(item) + 1;
        const endRange = array.lastIndexOf(item) + 1;
        duplicateRanges.push(`${startRange}-${endRange}`);
      }
    }
  });

  return duplicateRanges;
}

document.getElementById("linksTextarea").addEventListener("input", function () {
  updateLinkCount();
  if (this.value.trim() === "") {
    clearButtons();
    const createButtonsButton = document.querySelector(".createButtons");
    createButtonsButton.textContent = "Создать";
  }
});

function clearButtons() {
  const buttonsContainer = document.getElementById("buttonsContainer");
  buttonsContainer.innerHTML = "";
  buttonCount = 0;
  buttonsCreated = false;
  document.getElementById("notCreatedText").innerHTML = "";
}

function createButtons() {
  clearButtons();
  const linksTextarea = document.getElementById("linksTextarea");
  const text = linksTextarea.value;
  const notCreatedTextElement = document.getElementById("notCreatedText");
  const buttonsContainer = document.getElementById("buttonsContainer");
  buttonCount = 0;

  const lines = text.split("\n");
  let missingLinksSpanCreated = false;

  lines.forEach((line) => {
    if (line.trim() !== "") {
      if (isValidURL(line.trim())) {
        const button = document.createElement("button");
        button.textContent = "Ссылка " + ++buttonCount;
        button.className = "button";
        button.onclick = createButtonClickHandler(line.trim());
        buttonsContainer.appendChild(button);
        showNotification_create();
      } else {
        if (!missingLinksSpanCreated) {
          const missingLinksSpan = document.createElement("span");
          missingLinksSpan.textContent = "Пропущенный текст:";
          missingLinksSpan.classList.add("missing-links-span");
          notCreatedTextElement.appendChild(missingLinksSpan);
          missingLinksSpanCreated = true;
        }

        const listItem = document.createElement("li");
        listItem.textContent = `—  ${line}`;
        listItem.classList.add("notCreatedTextEl");
        notCreatedTextElement.appendChild(listItem);
      }
    }
  });

  notCreatedTextElement.style.borderRadius = "5px";
  notCreatedTextElement.style.border = "1px solid #ccc";

  updateLinkCount();
  buttonsCreated = true;

  const createButtonsButton = document.querySelector(".createButtons");
  createButtonsButton.textContent = "Пересоздать";
}

function isValidURL(url) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" +
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
      "((\\d{1,3}\\.){3}\\d{1,3}))" +
      "(\\:\\d+)?(\\/[-a-z\\d%@_.~+]*)*" +
      "(\\?[;&a-z\\d%@_.,~+=-]*)?" +
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return pattern.test(url);
}

function createButtonClickHandler(link) {
  return function () {
    if (!this.classList.contains("clicked")) {
      this.classList.add("clicked");
      this.style.backgroundColor = "red";
      openLink(link);
    }
  };
}

function openLink(link) {
  window.open(link, "_blank");
}

function clearLinks() {
  document.getElementById("linksTextarea").value = "";
  clearButtons();
  updateLinkCount();
  showNotification_del();
  const createButtonsButton = document.querySelector(".createButtons");
  createButtonsButton.textContent = "Создать";
}

function showNotification(notificationId) {
  var notification = document.getElementById(notificationId);
  notification.classList.add("show");

  setTimeout(function () {
    notification.classList.remove("show");
  }, 2000);
}

function showNotification_copy() {
  showNotification("copyNotification");
}

function showNotification_del() {
  showNotification("clearNotification");
}

function showNotification_create() {
  showNotification("createNotification");
}

function copyText() {
  var textarea = document.getElementById("linksTextarea");

  if (textarea.value.trim() !== "") {
    textarea.select();
    document.execCommand("copy");
    showNotification_copy();
  } else {
    console.log("Нет текста для копирования.");
  }
}

function refreshPage() {
  location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
  const themeIcon = document.getElementById("themeIcon");
  const body = document.body;
  const currentTime = new Date().getHours();

  if (currentTime >= 7 && currentTime < 19) {
    body.classList.remove("dark-theme");
    themeIcon.src = "./svg/sun.svg";
    themeIcon.alt = "Солнце";
  } else {
    body.classList.add("dark-theme");
    themeIcon.src = "./svg/moon.svg";
    themeIcon.alt = "Луна";
  }
});

function toggleTheme() {
  const body = document.body;
  const themeIcon = document.getElementById("themeIcon");
  body.classList.toggle("dark-theme");

  if (body.classList.contains("dark-theme")) {
    themeIcon.src = "./svg/moon.svg";
    themeIcon.alt = "Луна";
  } else {
    themeIcon.src = "./svg/sun.svg";
    themeIcon.alt = "Солнце";
  }
}

function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const clockElement = document.getElementById("clock");
  clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Вызываем функцию один раз, чтобы часы обновились сразу после загрузки страницы
updateClock();

// Обновляем часы каждую секунду
setInterval(updateClock, 1000);
