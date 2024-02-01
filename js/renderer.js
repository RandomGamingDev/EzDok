fetch(doc_url, { cache: "reload" })
    .then(res => res.text())
    // Get the imports from the preimport text (We only support imports from the parent dok itself)
    .then(preimport_text => {
        // Add this to make sure that everything that uses \n for things like ranges work
        preimport_text += nl;

        // Imports
        const imports = [];

        // Parse the imports
        const import_start_str = "\n!";
        for (let i = preimport_text.indexOf(import_start_str); i != -1; i = preimport_text.indexOf(import_start_str, i + 1)) {
            // Get the start of the range
            const range_start = i + 1;

            // Get the import URL and fetch from it
            const import_start = range_start + import_start_str.length;
            const import_end = preimport_text.indexOf(nl, import_start);
            const import_url = preimport_text.slice(import_start, import_end);
            const import_promise =
                fetch(import_url)
                    .then(res => res.text());
            imports.push(Promise.all([[range_start, import_end], import_promise]));
        }

        // The preimport text and imports to combine with it
        const to_combine = [preimport_text, Promise.all(imports)];
        return Promise.all(to_combine);
    })
    // Combine the results from the imports
    .then(to_combine => {
        // The text which will be modified to include the imports
        let text = to_combine[0];
        // The offset after replacing
        let offset = 0;
        // Importing all the imports
        const imports = to_combine[1];
        for (const to_import of imports) {
            // Get the ranges to replace
            const location_range = to_import[0];
            // Get the text we're importing to replace it with
            const import_text = to_import[1];

            // Replace it
            const before_text = text.slice(0, offset + location_range[0]);
            const after_text = text.slice(offset + location_range[1]);
            text = `${ before_text }${ import_text }${ after_text }`;

            // Get the offset to add
            const to_replace_length = location_range[1] - location_range[0];
            offset += import_text.length - to_replace_length;
        }

        return text;
    })
    .then(text => {
        // Divide the sections
        let sections = text.split("\n@");

        // Parse the sections into a tree
        section_tree =
            new Section(null, "sections-container")
                .fromTxt(`\n${sections.shift()}`, [],
                    undefined, sections_container, undefined);
        // The current section being operated upon and its depth
        let cursor_depth = 0;
        let cursor_nodes = [];
        let cursor = section_tree;
        for (const section of sections) {
            // Calculate the depth of the section
            let depth = 1;
            for (const char of section) {
                if (char == '@')
                    depth++;
                else
                    break;
            }

            // The depth cannot be 3+ greater so report an error and try to compensate by just appending
            const invalid_depth = depth > cursor_depth + 2;

            // Make the cursor climb up the tree
            for (; cursor_depth >= depth; cursor_depth--)
                cursor = cursor.parent;
            // Make the cursor climb down the tree (it can only do so 1 layer at a time)
            if (depth == cursor_depth + 2) {
                const subsections = cursor.subsections;
                cursor = subsections[subsections.length - 1];
                cursor_depth++;
            }

            // Current layer's node
            const cur_node = cursor.subsections.length;
            if (depth - 1 < cursor_nodes.length)
                cursor_nodes[depth - 1] = cur_node;
            else
                cursor_nodes.push(cur_node);

            // Generate the id
            let id = "section-";
            for (let i = 0; i < depth && i < cursor_nodes.length; i++)
                id += `${cursor_nodes[i]}-`;

            // Report Invalid Depth
            if (invalid_depth)
                console.log(`Invalid Depth for ${ id }`);

            // The section without the @ symbols
            const just_section = section.slice(depth - 1);
            cursor.add_subsection(new Section(cursor, id).fromTxt(just_section));
        }

        // Render the section specified by the path or default path
        const node = GetSection(path);
        node.apply_combined();
    });
