// Function to add a custom section
function addCustomSection() {
    const customSectionsContainer = document.getElementById("customSections");
    const win95Window = document.getElementById("win95Window");

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
            sectionTextDiv.style.color = "#000"; // Change text color to black
        }
    });

    sectionTextDiv.addEventListener("blur", () => {
        if (sectionTextDiv.innerText.trim() === "") {
            sectionTextDiv.innerText = "Write something here...";
            sectionTextDiv.style.color = "#aaa"; // Reset to gray
        }
    });

    sectionContainer.appendChild(sectionTextDiv);

    // Resize handle
    const resizeHandle = document.createElement("div");
    resizeHandle.classList.add("resize-handle");
    sectionContainer.appendChild(resizeHandle);

    // Add delete button
    addDeleteButton(sectionContainer);

    // Add click event to make the section active
    makeSectionClickable(sectionContainer);

    customSectionsContainer.appendChild(sectionContainer);

    // Apply new drag & resize functions
    enableDragging(sectionContainer);
    enableResizing(sectionContainer);

    // Update the window size dynamically
    updateWindowSize();
}

// Function to mark a section as active
function setActiveSection(section) {
    // Remove the 'active' class from all sections
    const sections = document.querySelectorAll('.section-box');
    sections.forEach(sec => sec.classList.remove('active'));

    // Add the 'active' class to the clicked section
    section.classList.add('active');
}

// Improved Dragging Function (Keeps sections in flow, no overlap or shrinking)
function enableDragging(element) {
    let isDragging = false, offsetX = 0, offsetY = 0;

    // Listen for mousedown event
    element.addEventListener("mousedown", (e) => {
        // Ignore clicks on the resize handle and delete button
        if (e.target.classList.contains("resize-handle") || e.target.classList.contains("delete-button")) return;

        isDragging = true;
        // Calculate the offset of the click relative to the section's position
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;

        // Set the section's position to 'relative' for smooth dragging
        element.style.position = "relative";

        document.addEventListener("mousemove", onDrag);
        document.addEventListener("mouseup", onStopDrag);
    });

    function onDrag(e) {
        if (!isDragging) return;

        // Calculate the new position based on the mouse movement
        const newX = e.clientX - offsetX;
        const newY = e.clientY - offsetY;

        // Ensure the element is following the mouse pointer correctly (no excess space)
        element.style.left = `${newX}px`;
        element.style.top = `${newY}px`;

        // Optionally, add a small buffer to smooth the movement
        // For example, slightly adjust the top/left positions to center the drag position better.
        element.style.transform = "translate(-50%, -50%)";
    }

    function onStopDrag() {
        isDragging = false;
        document.removeEventListener("mousemove", onDrag);
        document.removeEventListener("mouseup", onStopDrag);
    }
}


// Improved Resizing Function
function enableResizing(element) {
    const resizeHandle = element.querySelector(".resize-handle");
    let isResizing = false, startX, startY, startWidth, startHeight;

    resizeHandle.addEventListener("mousedown", (e) => {
        e.preventDefault();
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = element.offsetWidth;
        startHeight = element.offsetHeight;

        document.addEventListener("mousemove", onResize);
        document.addEventListener("mouseup", onStopResize);
    });

    function onResize(e) {
        if (!isResizing) return;
        const newWidth = Math.max(100, startWidth + e.clientX - startX);
        const newHeight = Math.max(50, startHeight + e.clientY - startY);
        element.style.width = `${newWidth}px`;
        element.style.height = `${newHeight}px`;

        // Only update window size on resizing, not dragging
        updateWindowSize();
    }

    function onStopResize() {
        isResizing = false;
        document.removeEventListener("mousemove", onResize);
        document.removeEventListener("mouseup", onStopResize);
    }
}

// Delete Button Function (Shrinks window only when a section is deleted)
function addDeleteButton(element) {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerText = "✖"; 

    deleteButton.addEventListener("click", () => {
        element.remove();
        shrinkWindowIfNeeded(); // Shrinks the window only if needed
    });

    element.appendChild(deleteButton);
}

// Function to apply text formatting (bold, italic, underline)
function applyTextFormatting(format) {
    const activeSection = document.querySelector(".section-box.active");

    if (activeSection) {
        const sectionText = activeSection.querySelector(".section-text");
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        if (range.toString()) {
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

// Function to make the section clickable and set as active
function makeSectionClickable(section) {
    section.addEventListener('click', () => {
        setActiveSection(section);  // Set clicked section as active
    });
}

// Function to apply text color to the active section's text
function applyTextColor() {
    const color = document.getElementById("textColorPicker").value;
    const activeSection = document.querySelector(".section-box.active");

    if (activeSection) {
        const editableText = activeSection.querySelector(".section-text");
        editableText.style.color = color;
    }
}

// Function to apply background color to the active section
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

// Apply transparent background to the active section
document.getElementById("transparentButton").addEventListener("click", function () {
    const activeSection = document.querySelector(".section-box.active");
    if (activeSection) {
        activeSection.style.backgroundColor = "transparent";  // Set background to transparent
        document.getElementById("bgColorPicker").value = "#ffffff";  // Reset color picker to default white
    }
});

