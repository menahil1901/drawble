// Initialize canvas for drawing
function initCanvas() {
    canvas = document.getElementById("drawingCanvas");
    ctx = canvas.getContext("2d");

    ctx.strokeStyle = "#000"; // Black color by default
    ctx.lineWidth = 2;

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseout", stopDrawing);
}

// Start drawing on the canvas
function startDrawing(e) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

// Draw on the canvas
function draw(e) {
    if (!drawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
}

// Stop drawing
function stopDrawing() {
    drawing = false;
}

// Reset the canvas
function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    drawing = false;
}

// Send anonymous message
function sendMessage() {
    const message = document.getElementById("messageInput").value.trim();

    if (!message) {
        alert("Please enter a message");
        return;
    }

    const messageElement = document.createElement("div");
    messageElement.classList.add("message-bubble");
    messageElement.innerText = message;

    document.getElementById("messagesContainer").appendChild(messageElement);
    document.getElementById("messageInput").value = "";
}
