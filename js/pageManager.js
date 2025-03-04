// Create or load a page (including login)
function createPage() {
    const pageName = document.getElementById("pageName").value.trim();
    const userCode = document.getElementById("userCode").value.trim();

    if (!pageName || !userCode) {
        alert("Please enter a valid page name and unique code.");
        return;
    }

    const pageKey = `${pageName}_${userCode}`;
    const savedPage = loadPage(pageName, userCode);

    if (savedPage) {
        // Page exists - validate user and load content
        document.getElementById("editorContainer").innerHTML = savedPage.content;
        document.getElementById("pageName").value = pageName;
        document.getElementById("userCode").value = userCode;
        document.getElementById("pageCreator").style.display = "none";
        document.getElementById("editorContainer").style.display = "flex"; // Show the editor container
        alert("Welcome back! Your page has been loaded.");
    } else {
        // No saved page, create a new one
        if (localStorage.getItem(pageKey)) {
            alert("This page name and user code are already taken. Please enter a different combination.");
            return;
        }

        // Proceed with creating a new page
        document.getElementById("pageCreator").style.display = "none";
        document.getElementById("editorContainer").style.display = "flex";
        initCanvas(); // Assuming this initializes the canvas or editor
        alert("New page created successfully!");
    }
}

function savePage() {
    const pageName = document.getElementById("pageName").value.trim();
    const userCode = document.getElementById("userCode").value.trim();
    const pageContent = document.getElementById("editorContainer").innerHTML;

    if (!pageName || !userCode) {
        alert("Please enter a valid page name and user code.");
        return;
    }

    const pageKey = `${pageName}_${userCode}`;
    const existingPage = loadPage(pageName, userCode);

    if (existingPage) {
        // Confirm before overwriting
        if (!confirm("A page with this name already exists. Do you want to overwrite it?")) {
            return;
        }
    }

    const pageData = {
        pageName: pageName,
        userCode: userCode,
        content: pageContent,
        lastSaved: new Date().toISOString() // Store timestamp for tracking
    };

    localStorage.setItem(pageKey, JSON.stringify(pageData));
    alert("Page saved successfully!");
}


function loadPage(pageName, userCode) {
    const pageKey = `${pageName}_${userCode}`;
    const savedData = localStorage.getItem(pageKey);

    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            
            // Ensure it contains valid properties
            if (parsedData.pageName && parsedData.userCode && parsedData.content) {
                return parsedData;
            } else {
                console.error("Invalid data format for:", pageKey);
                return null;
            }
        } catch (error) {
            console.error("Error parsing page data:", error);
            return null;
        }
    }
    return null; // No saved page found
}

function publishPage() {
    const pageName = document.getElementById("pageName").value.trim();
    const userCode = document.getElementById("userCode").value.trim();

    if (!pageName || !userCode) {
        alert("Please enter a valid page name and user code.");
        return;
    }

    const savedPage = loadPage(pageName, userCode);
    if (!savedPage) {
        alert("No saved page found for this name and code.");
        return;
    }

    // Set the editor content to view-only
    document.getElementById("editorContainer").innerHTML = savedPage.content;

    // Disable all editable content
    document.querySelectorAll(".editable").forEach(element => {
        element.contentEditable = "false";
    });

    // Remove resize handles and delete buttons from elements
    document.querySelectorAll(".resize-handle, .delete-button").forEach(element => {
        element.remove();
    });

    // Hide customization bar
    const customizationBar = document.getElementById("customizationBar");
    if (customizationBar) customizationBar.style.display = "none";

    // Allow user to view the published page before redirecting
    setTimeout(() => {
        alert("Page published successfully! Redirecting to login...");
        window.location.href = "drawble.html"; // Change to your actual login page
    }, 2000); // 2-second delay before redirection
}
