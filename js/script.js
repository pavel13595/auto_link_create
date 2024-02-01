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

  linkCountElement.style.color = duplicateRanges.length > 0 ? "red" : "green";

  linksTextarea.style.border =
    text.trim() === ""
      ? "2px solid black"
      : duplicateRanges.length > 0
      ? "2px solid red"
      : "2px solid #09af4c";

  const duplicateSpan = document.createElement("span");
  duplicateSpan.textContent = duplicateText;
  duplicateSpan.classList.add("duplicate-info");
  linkCountElement.appendChild(duplicateSpan);
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
    createButtonsButton.textContent = "Создать кнопки";
  }
});

function clearButtons() {
  const buttonsContainer = document.getElementById("buttonsContainer");
  buttonsContainer.innerHTML = "";
  buttonCount = 0;
  buttonsCreated = false;
  // Очищаем также элемент <ul> с текстом не созданных ссылок
  document.getElementById("notCreatedText").innerHTML = "";
}

function createButtons() {
  clearButtons(); // Очищаем список перед созданием нового
  const linksTextarea = document.getElementById("linksTextarea");
  const text = linksTextarea.value;
  const notCreatedTextElement = document.getElementById("notCreatedText");

  const buttonsContainer = document.getElementById("buttonsContainer");
  buttonCount = 0;

  const lines = text.split("\n");
  let missingLinksSpanCreated = false; // Флаг для отслеживания создания span для пропущенных ссылок

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
        // Проверяем, создан ли уже span для пропущенных ссылок
        if (!missingLinksSpanCreated) {
          const missingLinksSpan = document.createElement("span");
          missingLinksSpan.textContent = "Пропущенный текст:";
          missingLinksSpan.classList.add("missing-links-span");
          notCreatedTextElement.appendChild(missingLinksSpan);
          missingLinksSpanCreated = true; // Устанавливаем флаг в true, чтобы создать только один span
        }

        const listItem = document.createElement("li");
        listItem.textContent = `—  ${line}`;
        listItem.classList.add("notCreatedTextEl"); // Присваиваем класс
        notCreatedTextElement.appendChild(listItem); // Добавляем элемент <li> в существующий <ul>
      }
    }
  });

  // Добавляем стили к элементу с классом "notCreatedText"
  notCreatedTextElement.style.borderRadius = "5px"; // Добавляем стили для элемента
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
  clearButtons(); // Очищаем список при нажатии на кнопку "Мусорка"
  updateLinkCount();
  showNotification_del();
  const createButtonsButton = document.querySelector(".createButtons");
  createButtonsButton.textContent = "Создать кнопки";
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
