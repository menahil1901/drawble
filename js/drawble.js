let drawing = false;
let ctx = null;
let canvas = null;

// Create or load a page
function createPage() {
    const pageName = document.getElementById("pageName").value.trim();
    const userCode = document.getElementById("userCode").value.trim();

    if (!pageName || !userCode) {
        alert("Please enter a valid page name and unique code.");
        return;
    }

    document.getElementById("pageCreator").style.display = "none";
    document.getElementById("editorContainer").style.display = "flex";

    initCanvas();
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

// Utility function to make sections draggable
function makeDraggable(section) {
    let isDragging = false;
    let offsetX, offsetY;

    section.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('section-text') || e.target.classList.contains('resize-handle')) return;

        isDragging = true;
        offsetX = e.clientX - section.getBoundingClientRect().left;
        offsetY = e.clientY - section.getBoundingClientRect().top;

        section.classList.add('dragging');

        const onMouseMove = (e) => {
            if (!isDragging) return;
            section.style.position = 'absolute';
            section.style.left = `${e.clientX - offsetX}px`;
            section.style.top = `${e.clientY - offsetY}px`;
        };

        const onMouseUp = () => {
            isDragging = false;
            section.classList.remove('dragging');
            updateWindowSize();
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}


// Make sections resizable
function makeResizable(section) {
    const resizeHandle = section.querySelector(".resize-handle");

    let isResizing = false;
    let startWidth, startHeight, startX, startY;

    resizeHandle.addEventListener("mousedown", (e) => {
        e.preventDefault();

        isResizing = true;
        startWidth = section.offsetWidth;
        startHeight = section.offsetHeight;
        startX = e.clientX;
        startY = e.clientY;

        section.style.cursor = 'se-resize';

        const onMouseMove = (e) => {
            if (!isResizing) return;

            const width = Math.max(startWidth + e.clientX - startX, 100); // Minimum width of 100px
            const height = Math.max(startHeight + e.clientY - startY, 50); // Minimum height of 50px

            section.style.width = `${width}px`;
            section.style.height = `${height}px`;

            updateWindowSize();
        };

        const onMouseUp = () => {
            isResizing = false;
            section.style.cursor = 'move';
            makeDraggable(section); // Re-enable dragging
            updateWindowSize();
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });
}

// Function to handle section click and set it as active
function setActiveSection(section) {
    // Remove "active" class from any other section
    const allSections = document.querySelectorAll(".section-box");
    allSections.forEach(s => s.classList.remove("active"));

    // Add "active" class to the clicked section
    section.classList.add("active");
}

// Apply text color to the active section's text
function applyTextColor() {
    const color = document.getElementById("textColorPicker").value;
    const activeSection = document.querySelector(".section-box.active");

    if (activeSection) {
        const editableText = activeSection.querySelector(".section-text");
        editableText.style.color = color;
    }
}

// Apply background color to the active section
function applyBackgroundColor() {
    const color = document.getElementById("bgColorPicker").value;
    const activeSection = document.querySelector(".section-box.active");

    if (activeSection) {
        // If the selected color is transparent
        if (color === "#ffffff" && document.getElementById("bgColorPicker").value === "#ffffff") {
            activeSection.style.backgroundColor = 'transparent';
        } else {
            activeSection.style.backgroundColor = color;
        }
    }
}

// Add event listener for the transparent button inside the background color picker wrapper
document.getElementById("transparentButton").addEventListener("click", function () {
    const activeSection = document.querySelector(".section-box.active");
    if (activeSection) {
        activeSection.style.backgroundColor = "transparent";  // Set background to transparent
        document.getElementById("bgColorPicker").value = "#ffffff";  // Reset color picker to default white
    }
});

// Apply text formatting to the active section's text
function applyTextFormatting(format) {
    const activeSection = document.querySelector(".section-box.active");

    if (activeSection) {
        const sectionText = activeSection.querySelector(".section-text");
        if (window.getSelection) {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const span = document.createElement("span");

            switch (format) {
                case "bold":
                    span.style.fontWeight = "bold";
                    break;
                case "italic":
                    span.style.fontStyle = "italic";
                    break;
                case "underline":
                    span.style.textDecoration = "underline";
                    break;
                default:
                    return;
            }

            span.textContent = selection.toString();
            range.deleteContents();
            range.insertNode(span);
        }
    }
}

// Make each section independently customizable
function makeSectionClickable(section) {
    section.addEventListener('click', () => {
        setActiveSection(section);  // Set clicked section as active
    });
}


// Function to add custom section
function addCustomSection() {
    const customSectionsContainer = document.getElementById("customSections");

    const sectionContainer = document.createElement("div");
    sectionContainer.classList.add("section-box");
    sectionContainer.setAttribute("id", `section-${customSectionsContainer.children.length}`);

    const sectionTextDiv = document.createElement("div");
    sectionTextDiv.classList.add("section-text");
    sectionTextDiv.contentEditable = "true";
    sectionTextDiv.innerText = "Write something here...";
    sectionTextDiv.style.color = "#aaa"; // Placeholder color

    sectionTextDiv.addEventListener("focus", () => {
        if (sectionTextDiv.innerText === "Write something here...") {
            sectionTextDiv.innerText = "";
            sectionTextDiv.style.color = "#000"; // Change to black text color
        }
    });

    sectionTextDiv.addEventListener("blur", () => {
        if (sectionTextDiv.innerText.trim() === "") {
            sectionTextDiv.innerText = "Write something here...";
            sectionTextDiv.style.color = "#aaa"; // Set color back to gray
        }
    });

    sectionContainer.appendChild(sectionTextDiv);

    const resizeHandle = document.createElement("div");
    resizeHandle.classList.add("resize-handle");
    sectionContainer.appendChild(resizeHandle);

    // Add delete button
    addDeleteButton(sectionContainer);

    customSectionsContainer.appendChild(sectionContainer);

    // Ensure the window size is updated after the first custom section
    updateWindowSize();

    makeDraggable(sectionContainer);
    makeResizable(sectionContainer);

    // Make the section clickable
    makeSectionClickable(sectionContainer);
}

// Add a delete button (cross) to each section
function addDeleteButton(sectionContainer) {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerText = "✖";  // Cross button

    deleteButton.addEventListener("click", () => {
        sectionContainer.remove();
        updateWindowSize(); // Recalculate the window size after deleting the section
    });

    sectionContainer.appendChild(deleteButton);
}

// Update window size based on the custom sections
function updateWindowSize() {
    const customSections = document.querySelectorAll(".section-box");
    const windowElement = document.querySelector(".win95-window");
    const contentElement = document.querySelector(".win95-content");

    const baseHeight = 300; // A larger base height to make sure the first section expands the window more
    const sectionHeight = 160; // Height per section

    const totalHeight = baseHeight + (customSections.length * sectionHeight);

    contentElement.style.minHeight = `${totalHeight}px`;
    windowElement.style.minHeight = `${totalHeight}px`;

    contentElement.style.paddingTop = "50px";
}


// Save the page data to localStorage or a backend
function savePage() {
    const pageName = document.getElementById("pageName").value.trim();
    const pageContent = document.getElementById("editorContainer").innerHTML;

    if (!pageName) {
        alert("Please enter a valid page name");
        return;
    }

    localStorage.setItem(pageName, pageContent);
    alert("Page saved successfully!");
}

// Publish the page (for demo purposes, let's log it)
function publishPage() {
    const pageName = document.getElementById("pageName").value.trim();

    if (!pageName) {
        alert("Please enter a valid page name");
        return;
    }

    console.log("Page published: ", pageName);
    alert("Page published successfully!");
}
