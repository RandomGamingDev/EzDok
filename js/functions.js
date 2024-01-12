function GetSection(path) {
    // Display the section specified in the path
    let node = section_tree;

    // If there is a predefined path go down that
    if (path.length != 0)
        for (const i of path) {
            // Make sure that it doesn't close any parents that are already open
            if (node.dropdown != null && node.dropdown.classList.contains("hidden"))
                node.button.onclick();

            // Make sure that it goes down an actual path
            if (i < node.subsections.length)
                node = node.subsections[i];
            else {
                article.innerHTML = "Invalid Path";
                break;
            }
        }
    else
        for (; node.is_dropdown(); node = node.subsections[0])
            if (node.button.onclick != undefined)
                node.button.onclick();

    return node;
}