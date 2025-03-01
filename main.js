const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

const controls = document.querySelector(".controls");
const brushSizeInput = document.getElementById("brushSize");
const brushValueDisplay = document.getElementById("brushValue");
const colorPicker = document.getElementById("colorPicker");
const clearButton = document.getElementById("clearCanvas");

let brushSize = parseInt(brushSizeInput.value);
let brushColor = colorPicker.value;
let canvasOffset = { top: 0 };

// Устанавливаем холст на весь экран
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let isDrawing = false;
let lastX = 0, lastY = 0;

// Функция получения координат с учетом смещения
function getCoordinates(event) {
    const [x, y] = event.touches ? 
        [event.touches[0].clientX, event.touches[0].clientY] : 
        [event.clientX, event.clientY];

    return [x, y - canvasOffset.top]; // Компенсация смещения из-за панели
}

// Изменение толщины кисти
brushSizeInput.addEventListener("input", () => {
    brushSize = parseInt(brushSizeInput.value);
    brushValueDisplay.textContent = brushSize;
});

// Изменение цвета кисти
colorPicker.addEventListener("input", () => {
    brushColor = colorPicker.value;
});

// Очистка холста
clearButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Переключение панели управления
controls.addEventListener("click", () => {
    controls.classList.toggle("controls__active");

    // Обновляем смещение canvas, если панель открыта
    if (controls.classList.contains("controls__active")) {
        canvasOffset.top = controls.offsetHeight + 10; // +10px отступ
    } else {
        canvasOffset.top = 0;
    }
});

// Начало рисования
function startDrawing(event) {
    isDrawing = true;
    [lastX, lastY] = getCoordinates(event);
}

// Рисование
function draw(event) {
    if (!isDrawing) return;
    event.preventDefault(); // Отключаем скролл на сенсорных устройствах

    const [x, y] = getCoordinates(event);

    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = brushColor;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = brushColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    [lastX, lastY] = [x, y];
}

// Остановка рисования
function stopDrawing() {
    isDrawing = false;
}

// Обработчики событий
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);
canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", stopDrawing);
