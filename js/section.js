class Section {
    static selected = null;
    static libraries = new Set(); 

    constructor(parent = null, id = null, title = null, config = null, content = null, subsections = [], button = null, dropdown = null, div = null) {
        // The section's parent
        this.parent = parent;

        // The string used to identify this section
        this.id = id;

        // Whether or not the title's been parsed
        this.title_parsed = false;
        // The title of the section
        this.title = title;

        // The config of section
        this.config = config;

        // Whether or not the content's been parsed
        this.content_parsed = false;
        // The section's content
        this.content = content;

        // The section's subsections
        this.subsections = subsections;

        // The section's button 
        this.button = button;

        // The section's dropdown
        this.dropdown = dropdown;

        // The section's div (what all of the other HTML elements of the section are contained in)
        this.div = div;
    }

    fromTxt(txt, subsections = [], button = null, dropdown = null, div = null) {
        // Whether or not the title's been parsed
        this.title_parsed = false;
        // Get the title
        const title_end = txt.indexOf(nl);
        this.title = txt.slice(0, title_end);

        // Get the config
        const config_start_str = "~\n";
        const after_title_end = title_end + nl.length;
        const config_start = after_title_end + config_start_str.length;
        const config_end_str = "\n~\n";
        // Config end is null unless there is a config
        let config_end = null;
        // Check whether or not there's a config
        if (txt.slice(after_title_end, config_start) == config_start_str) {
            // Set config end when there's a config
            config_end = txt.indexOf(config_end_str, config_start);

            // Get the config data
            const config_data = txt.slice(config_start, config_end);
            // Parse the config data into a JSON string
            const config_json = `{${ config_data }}`;
            // Parse the config data into an object
            this.config = JSON.parse(config_json);
        }

        // Whether or not the content's been parsed
        this.content_parsed = false;
        // Get the content
        const content_start = config_end == null ? after_title_end : config_end + config_end_str.length;
        this.content = txt.slice(content_start);

        // The section's subsections
        this.subsections = subsections;

        // The section's div (what all of the other HTML elements of the section are contained in)
        this.div = div == null ? this.generate_div() : div;
        // The section's button
        this.button = button == null ? this.generate_button() : button;
        // The section's dropdown
        this.dropdown = dropdown;

        // Return the object itself
        return this;
    }

    // Add a subsection that inherits from this one
    add_subsection(subsection) {
        // Check whether or not a dropdown's already been generated
        if (this.subsections.length == 0 && this.dropdown == null)
            this.dropdown = this.generate_dropdown();

        // Add the subsection to the subsections list
        this.subsections.push(subsection);

        // Append to the dropdown element
        const li = document.createElement("li");
        // Add the div to a list item element
        li.appendChild(subsection.div);
        // Add the list item element to the dropdown
        this.dropdown.appendChild(li);
    }

    // Parses and returns the title if it hasn't already been parsed
    parsed_title() {
        if (!this.title_parsed)
            this.title = marked.parse(this.title);
        this.title_parsed = true;

        return this.title;
    }

    // Get the title as raw text
    get_title_text() {
        if (this.title_text == undefined && this.button != undefined)
            this.title_text = this.button.innerText;
        return this.title_text;
    }

    // Parses and returns the content if it hasn't already been parsed
    parsed_content() {
        if (!this.content_parsed)
            this.content = marked.parse(this.content);
        this.content_parsed = true;

        return this.content;
    }

    // Generates and returns the ID for the a specific specified element for the section
    generate_id(element_name) {
        return `${ this.id }${ element_name }`;
    }

    // Generates and returns the ID for the section's div
    generate_div_id() {
        return this.generate_id("div");
    }

    // Generates and returns the ID for the section's button
    generate_button_id() {
        return this.generate_id("button");
    }

    // Generates and returns the ID for the section's search result
    generate_search_result_id() {
        return this.generate_id("search-result");
    }

    // Generates and returns the ID for the section's dropdown
    generate_dropdown_id() {
        return this.generate_id("dropdown");
    }

    // Generates and returns the section's div
    generate_div() {
        this.div = document.createElement("div");
        this.div.id = this.generate_div_id();

        // Return the div
        return this.div;
    }

    // Generates and returns the section's button
    generate_button() {
        // Create the button
        this.button = document.createElement("button");
        this.button.id = this.generate_button_id();
        this.button.type = "button";
        this.button.className = 
            "flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700";

        // Create the span containing the title
        const span = document.createElement("span");
        span.className = "flex-1 text-left rtl:text-right"
        span.innerHTML = this.parsed_title();
        // Add the span to the button
        this.button.appendChild(span);

        // If the button isn't a dropdown display the section's contents when clicked
        this.button.onclick = () => this.apply_combined();

        // Add the button
        this.div.appendChild(this.button);
        
        // Return the button
        return this.button;
    }

    // Generates and returns the section's search result
    generate_search_result() {
        // Create the search result
        const search_result = document.createElement("button");
        search_result.id = this.generate_search_result_id();
        search_result.type = "button";
        search_result.className = 
            "flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700";

        // Create the span containing the title
        const span = document.createElement("span");
        span.className = "flex-1 text-left rtl:text-right"
        span.innerHTML = this.parsed_title();
        // Add the span to the button
        search_result.appendChild(span);

        // If the button isn't a dropdown display the section's contents when clicked
        search_result.onclick = () => { 
            this.apply_combined();
            search_results_container.classList.add("hidden");
        }
        // Make it select the chosen element
        
        // Return the button
        return search_result;
    }

    // Generates and returns the section's dropdown
    generate_dropdown() {
        // Create the dropdown
        this.dropdown = document.createElement("ul");
        this.dropdown.id = this.generate_dropdown_id();
        this.dropdown.className = "hidden py-2 space-y-2 pl-4";

        // Add the SVG to the button representing the fact that there's a dropdown
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("class", "w-3 h-3 rotate-90");
        svg.setAttribute("aria-hidden", true);
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("fill", "none");
        svg.setAttribute("viewBox", "0 0 10 6");
        // The path for the SVG
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("stroke", "currentColor");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");
        path.setAttribute("stroke-width", 2);
        path.setAttribute("d", "m1 1 4 4 4-4");
        // Add the path to the SVG
        svg.appendChild(path);
        
        // Add the SVG to the button
        this.button.appendChild(svg);
        
        // Add the dropdown
        this.div.appendChild(this.dropdown);

        // Set the attributes of the button needed to toggle the dropdown
        this.button.onclick = () => {
            this.dropdown.classList.toggle("hidden");
            svg.classList.toggle("rotate-90");
        };
        this.button.setAttribute("aria-controls", this.dropdown.id);

        // Return the dropdown
        return this.dropdown;
    }

    // Applies the section and everything it's inherited (content & config) combined to the article section
    apply_combined() {
        // Clear the content
        Section.clear_article_content();

        // Change the link's path
        this.set_path_link();

        // The lambda for toggling the button's visuals for whether or not it's selected
        const toggle_selection = (button) => {
            button.classList.toggle("bg-gray-100");
            button.classList.toggle("dark:bg-gray-700");
        };

        // Unhighlight previous button
        if (Section.selected != undefined)
            toggle_selection(Section.selected);

        // Highlight the button to display that it's been selected
        Section.selected = this.button;
        toggle_selection(this.button);

        // These will contain the combined results (the results from this section and the sections it inherits from)
        let content = this.parsed_content();
        let config = this.config;
        // Execute the javascript
        this.execute_js();
        for (let node = this.parent; node != null; node = node.parent) {
            // Prepend the stuff from the sections this section inherits from
            content = node.parsed_content() + content;
            // Add the attributes from the node only if they don't already exist in the current config
            config = { ...node.config, ...config };
            // Execute the javascript by appending elements containing the code
            node.execute_js();
        }
        Section.apply_content(content);
        Section.apply_config(config);
    }

    // Set's the path's link
    set_path_link() {
        const id_header = "section-";
        const path = 
            this.parent == null ?
                "" :
                this.id
                    .slice(id_header.length)
                    .replaceAll('-', '/');
        window.history.pushState({}, "", `#v1/"${ doc_url }"/${ path }`);
    }

    // Execute the javascript
    execute_js() {
        // If there's no config don't execute the rest
        if (this.config == null)
            return;

        // Import all the libraries
        const libraries = this.config.libraries;
        if (libraries != undefined)
            for (const library of libraries)
                if (!Section.libraries.has(library)) {
                    // Append the script to the list so that it doesn't get reimported
                    Section.libraries.add(library);

                    // Create and append the script
                    const script_element = document.createElement("script");
                    script_element.src = library;
                    document.head.appendChild(script_element);
                }

        // Import all of the scripts
        const scripts = this.config.scripts;
        if (scripts != undefined)
            for (const script of scripts) {
                const script_element = document.createElement("script");
                script_element.src = script;
                article.appendChild(script_element);
            }
    }

    // Search for specific text
    search(search) {
        // Lowercase it since everything will be compared in lowercase mode
        search = search.toLowerCase();

        // If the button isn't defined then there isn't a title
        if (this.button != undefined) {
            // Get the raw text of the title
            const title_text = this.get_title_text().toLowerCase();

            // If you find the text display it in the dropdown
            if (title_text.includes(search))
                search_results.appendChild(this.generate_search_result());
            // Check for meta tags (the parent's don't count)
            else if (this.parent != null && this.config != null && this.config.meta != undefined)
                for (const keyphrase of this.config.meta) {
                    if (!keyphrase.toLowerCase().includes(search))
                        continue;
                    search_results.appendChild(this.generate_search_result());
                    return;
                }
        }

        // Search down the tree
        for (const subsection of this.subsections)
            subsection.search(search);
    }

    // Checks whether or not it's a dropdown
    is_dropdown() {
        return this.subsections.length > 0;
    }

    // Applies the content
    apply_content() {
        Section.apply_content(this.content);
    }

    // Applies the config
    apply_config() {
        Section.apply_config(this.config);
    }

    // Clear content
    static clear_article_content() {
        article.innerHTML = "";
    }

    // Applies content
    static apply_content(content) {
        article.innerHTML += content;
    }

    // Applies config
    static apply_config(config) {
        // If there's no config don't execute the rest
        if (config == null)
            return;

        // Set the icon
        if (config.icon != undefined) {
            icon.href = config.icon;
            sidebar_icon.src = config.icon;
        }

        // Set the title
        if (config.title != undefined) {
            title.innerHTML = config.title;
            sidebar_title.innerHTML = config.title;
        }

        // Set the description
        if (config.description != undefined) {
            sidebar_description.innerHTML = config.description;
        }
    }
}