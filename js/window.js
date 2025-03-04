function updateWindowSize() {
    const win95Window = document.getElementById("win95Window");
    const customSectionsContainer = document.getElementById("customSections");

    const baseHeight = 300; // Base height for the window
    const sectionHeight = 160; // Height per custom section

    // Calculate the new window height based on the number of sections
    const totalHeight = baseHeight + (customSectionsContainer.children.length * sectionHeight);

    // Adjust the content and window height accordingly
    win95Window.style.height = `${totalHeight}px`;

    // Calculate the margin to make the expansion occur from the middle
    const currentHeight = win95Window.offsetHeight;
    const heightDifference = totalHeight - currentHeight;
    win95Window.style.marginTop = `${-heightDifference / 2}px`; // Moves the window from the center
}
