// Function to add a new image
function addNewImage() {
    const imageUrl = prompt("Enter the image URL:");
    if (imageUrl) {
        addImage(imageUrl);
    }
}

// Function to add the image element with drag and resize features
function addImage(src) {
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-box");
    imageContainer.style.width = "150px"; // Default width
    imageContainer.style.height = "150px"; // Default height
    imageContainer.style.position = "absolute"; // Allow free positioning on the page
    imageContainer.style.left = "50px"; // Default position (can be adjusted)
    imageContainer.style.top = "50px"; // Default position (can be adjusted)

    // Create the image element
    const image = document.createElement("img");
    image.src = src;
    image.classList.add("custom-image");

    // Add the resize handle to the image container
    const resizeHandle = document.createElement("div");
    resizeHandle.classList.add("resize-handle");

    // Add delete button
    addDeleteButton(imageContainer);

    // Append image and resize handle to the container
    imageContainer.appendChild(image);
    imageContainer.appendChild(resizeHandle);

    // Append image container to the body (not inside any custom section)
    document.body.appendChild(imageContainer);

    // Make the image container draggable and resizable
    makeDraggable(imageContainer);
    makeResizable(imageContainer);
}

// Function to make the image container draggable
function makeDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;

    element.addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("resize-handle") || e.target.classList.contains("delete-button")) return;

        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;

        element.style.cursor = "grabbing"; // Change cursor to indicate dragging

        const onMouseMove = (e) => {
            if (!isDragging) return;
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        };

        const onMouseUp = () => {
            isDragging = false;
            element.style.cursor = "grab";
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });
}

// Function to make the image container resizable
function makeResizable(element) {
    const resizeHandle = element.querySelector(".resize-handle");

    let isResizing = false;
    let startWidth, startHeight, startX, startY;

    resizeHandle.addEventListener("mousedown", (e) => {
        e.preventDefault();
        isResizing = true;
        startWidth = element.offsetWidth;
        startHeight = element.offsetHeight;
        startX = e.clientX;
        startY = e.clientY;

        const onMouseMove = (e) => {
            if (!isResizing) return;
            const width = Math.max(startWidth + e.clientX - startX, 50); // Minimum width
            const height = Math.max(startHeight + e.clientY - startY, 50); // Minimum height

            element.style.width = `${width}px`;
            element.style.height = `${height}px`;
        };

        const onMouseUp = () => {
            isResizing = false;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });
}

// Function to add a delete button to the image container
function addDeleteButton(element) {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerText = "✖"; // Cross button to delete

    deleteButton.addEventListener("click", () => {
        element.remove();
    });

    element.appendChild(deleteButton);
}

// Function to add a social media icon based on the URL entered by the user
function addSocialMediaIcon() {
    const url = prompt("Enter your social media profile URL:");

    if (url) {
        let iconContainer = createSocialMediaIcon(url);
        document.body.appendChild(iconContainer);

        // Make the icon draggable and resizable
        makeDraggable(iconContainer);
        makeResizable(iconContainer);
    }
}

// Function to create a social media icon button
function createSocialMediaIcon(url) {
    const iconContainer = document.createElement("div");
    iconContainer.classList.add("social-icon-container");
    iconContainer.style.position = "absolute";  // Allow free positioning on the screen
    iconContainer.style.top = "100px"; // Default top position (can be adjusted)
    iconContainer.style.left = "100px"; // Default left position (can be adjusted)

    // Identify the platform based on the URL and create the corresponding icon
    const icon = document.createElement("a");
    icon.href = url;
    icon.target = "_blank"; // Open the link in a new tab

    let platformIcon = "";
    let platformImage = "";

    // Platform-specific settings
    if (url.includes("facebook.com")) {
        platformIcon = "facebook-icon";
        platformImage = "image/Facebook_logo_(square).png";  // Add the path to your Facebook image
    } else if (url.includes("x.com")) {
        platformIcon = "twitter-icon";
        platformImage = "image/twitterx.png";  // Add the path to your Twitter image
    } else if (url.includes("instagram.com")) {
        platformIcon = "instagram-icon";
        platformImage = "path/to/instagram-icon.png";  // Add the path to your Instagram image
    } else if (url.includes("linkedin.com")) {
        platformIcon = "linkedin-icon";
        platformImage = "/image/7a791a7183478843b347a5d17fc79e13.png";  // Add the path to your LinkedIn image
    } else {
        platformIcon = "default-icon"; // Default icon if platform is unknown
        platformImage = "path/to/default-icon.png";  // Add the path to your default icon image
    }

    // Set the platform image
    const img = document.createElement("img");
    img.src = platformImage;
    img.alt = `${platformIcon} logo`;
    img.classList.add("social-media-image");

    icon.appendChild(img);
    iconContainer.appendChild(icon);

    // Add a delete button to remove the social media icon
    addDeleteButton(iconContainer);

    return iconContainer;
}

// Function to add a delete button for each social media icon
function addDeleteButton(element) {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerText = "✖"; // Cross button to delete

    deleteButton.addEventListener("click", () => {
        element.remove();
    });

    element.appendChild(deleteButton);
}

// Function to make elements draggable
function makeDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;

    element.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - element.getBoundingClientRect().left;
        offsetY = e.clientY - element.getBoundingClientRect().top;

        element.classList.add('dragging');

        const onMouseMove = (e) => {
            if (!isDragging) return;
            element.style.position = 'absolute';
            element.style.left = `${e.clientX - offsetX}px`;
            element.style.top = `${e.clientY - offsetY}px`;
        };

        const onMouseUp = () => {
            isDragging = false;
            element.classList.remove('dragging');
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}

// Function to make elements resizable
function makeResizable(element) {
    const resizeHandle = document.createElement("div");
    resizeHandle.classList.add("resize-handle");
    element.appendChild(resizeHandle);

    let isResizing = false;
    let startWidth, startHeight, startX, startY;

    resizeHandle.addEventListener("mousedown", (e) => {
        e.preventDefault();

        isResizing = true;
        startWidth = element.offsetWidth;
        startHeight = element.offsetHeight;
        startX = e.clientX;
        startY = e.clientY;

        element.style.cursor = 'se-resize'; // Change cursor to resize

        const onMouseMove = (e) => {
            if (!isResizing) return;

            const width = Math.max(startWidth + e.clientX - startX, 100); // Minimum width
            const height = Math.max(startHeight + e.clientY - startY, 50); // Minimum height

            element.style.width = `${width}px`;
            element.style.height = `${height}px`;
        };

        const onMouseUp = () => {
            isResizing = false;
            element.style.cursor = 'move'; // Change cursor back to move
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });
}
