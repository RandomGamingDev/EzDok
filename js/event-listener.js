addEventListener("hashchange", (event) => {
    const [new_api_version, new_doc_url, new_path] = get_url_data();

    // If any of these don't match it's a whole different project's documentation so we refresh
    if (new_api_version != api_version || new_doc_url != doc_url)
        window.location.reload();

    // Render the section specified by the path or default path
    const node = GetSection(new_path);
    node.apply_combined();
});

function Search() {
    search_results.innerHTML = "";
    search_results_container.classList.remove("hidden");
    const search = searchbar.value;
    section_tree.search(search);
    return false;
}

function SearchTyped() {
    const search = searchbar.value;
    if (search.length == 0) {
        clear_search_button.classList.add("hidden");
        search_results_container.classList.add("hidden");
    }
    else
        clear_search_button.classList.remove("hidden");
}
SearchTyped();

function ClearSearch() {
    searchbar.value = "";
    search_results_container.classList.add("hidden");
}