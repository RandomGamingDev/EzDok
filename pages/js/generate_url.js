// Create the generator
document.getElementById("ezdok-url-generator").innerHTML = `
    <form class="w-full max-w-md">
        <div class="flex">
            <div class="inline-block relative w-16">
                <select id="version-dropdown" onchange="GenerateEzDokURL();" class="outline-none border-none appearance-none bg-transparent w-16 rounded-lg text-gray-700 dark:text-white mr-3 py-1 px-2 focus:outline-none focus:ring-0 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <option>v1</option>
                </select>
            </div>
            <div class="flex items-center border-b border-teal-500">
                <input id="doc-url-input" onkeyup="GenerateEzDokURL()" class="outline-none border-none appearance-none bg-transparent w-full text-gray-700 dark:text-white mr-3 px-2 leading-tight focus:outline-none focus:ring-0" type="text" placeholder="URL to DOK file" aria-label="URL to DOK file">
            </div>
            <div class="px-2">
            </div>
            <div class="flex items-center border-b border-teal-500">
                <input id="doc-path-input" onkeyup="GenerateEzDokURL()" class="outline-none border-none appearance-none bg-transparent w-full text-gray-700 dark:text-white mr-3 px-2 leading-tight focus:outline-none focus:ring-0" type="text" placeholder="Path to Section" aria-label="Path to Section">
            </div>
        </div>
    </form>
    <div class="pt-8 py-2 text-lg">
        EzDok URL:
        <div id="test" class="select-all inline-block inline-flex text-center bg-white text-slate-900 rounded-lg px-2 dark:bg-slate-800 dark:text-slate-200">
        </div>
    </div>
    <iframe id="ezdok-iframe" src="" title="EzDok Generated URL Result" class="min-w-full min-h-screen"></iframe>
`

function GenerateEzDokURL() {
    const window_url = window.location.href;
    const url_base = window_url.slice(0, window_url.indexOf('#'));

    const version = document.getElementById("version-dropdown");
    const doc_url = document.getElementById("doc-url-input");
    const doc_path = document.getElementById("doc-path-input");

    const iframe_url = `${ url_base }#${ version.options[version.selectedIndex].text }/"${ doc_url.value }"/${ doc_path.value }`;

    const url_display = document.getElementById("test");
    url_display.innerHTML = iframe_url;

    const ezdok_iframe = document.getElementById("ezdok-iframe");
    ezdok_iframe.src = iframe_url;

    return false;
}