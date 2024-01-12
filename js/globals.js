// Shorthand for the line divider (in this case newline)
const nl = '\n';

const get_url_data = 
    () => {
        // Get the static path (everything after the # in the URL)
        const url = window.location.href;
        const rLoc = url.indexOf('#');

        // Get the possible path and check whether or not it's empty and if it is use the default info before creating the static path
        const possible_static_path = rLoc == -1 ? "" : decodeURIComponent(url.slice(rLoc + 1));
        const static_path = possible_static_path.length == 0 ? "v1/\"pages/InvalidPath.dok\"" : possible_static_path;

        // Get the api version
        const api_version_end = static_path.indexOf('/');
        const api_version = static_path.slice(0, api_version_end);

        if (api_version != "v1")
            window.location.replace("");

        // Get the document URL
        const doc_url_start = api_version_end + 1;

        // Loop until a valid ending " without a \ before it is found
        let i;
        for (
            i = doc_url_start + 1;
            i >= 0 && i < static_path.length && !(static_path[i] == '"' && static_path[i - 1] != '\\');
            i = static_path.indexOf('"', i + 1)
        );
        const doc_url_end = i + 1
        const doc_url = JSON.parse(static_path.slice(doc_url_start, doc_url_end));

        // Get the path
        const preparsed_path = 
            static_path[doc_url_end] == '/' ?
                static_path.slice(doc_url_end + 1).split('/') :
                [""];
        const path = 
            preparsed_path.length == 1 ?
                [] :
                preparsed_path.slice(0, preparsed_path.length - 1).map((val) => Number(val));

        // Return it all
        return [api_version, doc_url, path];
    };

// Get the URL to the file containing the document and the path to the active directory
const [api_version, doc_url, path] = get_url_data();

// The <article> that will contain the currently viewed content
const article = document.getElementById("content");

// The title & icon
const title = document.getElementById("title");
const icon = document.getElementById("icon");
const sidebar = document.getElementById("separator-sidebar");
const searchbar = document.getElementById("default-search");
const search_results_container = document.getElementById("search-results-container");
const search_results = document.getElementById("search-results");
const clear_search_button = document.getElementById("clear-search-button");
const sections_container = document.getElementById("sections-container");
const sidebar_icon = document.getElementById("sidebar-icon");
const sidebar_title = document.getElementById("sidebar-title");
const sidebar_description = document.getElementById("sidebar-description");

let section_tree;