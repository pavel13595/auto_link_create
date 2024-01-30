let buttonCount = 0;
let buttonsCreated = false;

// Функция для обновления количества вставленных ссылок и проверки дублей
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
  linkCountElement.textContent = links.length + ". ";

  // Устанавливаем зеленый цвет текста, если дублей нет, и красный в противном случае
  linkCountElement.style.color = duplicateRanges.length > 0 ? "red" : "green";

  const duplicateSpan = document.createElement("span");
  duplicateSpan.textContent = duplicateText;

  // Добавляем класс для строки с информацией о дубликатах ссылок
  duplicateSpan.classList.add("duplicate-info");

  linkCountElement.appendChild(duplicateSpan);
}

// Функция для извлечения ссылок из текста
function extractLinks(text) {
  const lines = text.split("\n");
  const urls = [];

  lines.forEach((line) => {
    if (isValidURL(line.trim())) {
      urls.push(line.trim());
    }
  });

  return urls;
}

// Функция для поиска дублирующихся ссылок и возвращения диапазонов повторяющихся индексов
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

// Привязываем функцию к событию input
document.getElementById("linksTextarea").addEventListener("input", function () {
  updateLinkCount();
  // Проверяем, если текстовое поле пустое, то очищаем кнопки
  if (this.value.trim() === "") {
    clearButtons();
  }
});

// Функция для очистки кнопок при удалении всех ссылок из текстового поля
function clearButtons() {
  const buttonsContainer = document.getElementById("buttonsContainer");
  buttonsContainer.innerHTML = "";
  buttonCount = 0;
  buttonsCreated = false;
}

// Функция для создания кнопок на основе введенных ссылок
function createButtons() {
  const linksTextarea = document.getElementById("linksTextarea");
  const links = extractLinks(linksTextarea.value);

  // Очистим контейнер с кнопками перед созданием новых
  const buttonsContainer = document.getElementById("buttonsContainer");
  buttonsContainer.innerHTML = "";

  // Создадим кнопки для каждой ссылки
  links.forEach((link, index) => {
    const button = document.createElement("button");
    button.textContent = "Ссылка " + ++buttonCount;
    button.className = "button";
    button.onclick = createButtonClickHandler(index);

    buttonsContainer.appendChild(button);
  });

  // Обновляем количество ссылок после создания кнопок
  updateLinkCount();

  // Автоматически увеличиваем высоту textarea в зависимости от количества введенного текста
  //const rows = linksTextarea.value.split("\n").length;
  // const minRows = 12;
  // const maxRows = 30;
  // linksTextarea.rows = Math.min(Math.max(rows, minRows), maxRows);

  // Помечаем, что кнопки уже созданы
  buttonsCreated = true;

  // Меняем текст кнопки
  const createButtonsButton = document.querySelector(".createButtons");
  createButtonsButton.textContent = "Пересоздать";
}

// Функция для проверки валидности URL
function isValidURL(url) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // протокол
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // доменное имя
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // или IP (v4) адрес
      "(\\:\\d+)?(\\/[-a-z\\d%@_.~+]*)*" + // порт и путь
      "(\\?[;&a-z\\d%@_.,~+=-]*)?" + // параметры запроса
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // фрагмент
  return pattern.test(url);
}

// Функция для создания обработчика события для каждой кнопки
function createButtonClickHandler(index) {
  return function () {
    // Проверяем, был ли уже нажат этот элемент
    if (!this.classList.contains("clicked")) {
      this.classList.add("clicked"); // Добавляем класс
      this.style.backgroundColor = "red"; // Меняем цвет на красный
      openLink(index);
    }
  };
}

// Функция для отображения ссылок при нажатии на кнопки
function openLink(buttonNumber) {
  const linksTextarea = document.getElementById("linksTextarea");
  const links = extractLinks(linksTextarea.value);

  // Проверка наличия ссылки перед открытием
  if (buttonNumber < links.length) {
    const linkToOpen = links[buttonNumber];
    window.open(linkToOpen, "_blank");
  } else {
    alert("Ссылка не найдена!");
  }
}

// Функция для очистки окна с ссылками
function clearLinks() {
  document.getElementById("linksTextarea").value = "";
  document.getElementById("buttonsContainer").innerHTML = "";
  buttonCount = 0; // Сбрасываем счетчик кнопок
  buttonsCreated = false; // Сбрасываем флаг, что кнопки уже созданы
  updateLinkCount(); // Обновляем количество ссылок

  // Сбрасываем текст кнопки на "Создать кнопки"
  const createButtonsButton = document.querySelector(".createButtons");
  createButtonsButton.textContent = "Создать кнопки";
}
