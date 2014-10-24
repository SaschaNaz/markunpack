/*
 * TODO:
 * 
 * Use JSZip, replace local image URLs to blob URLs
 * Bootstrap?
 */

module MarkUnpack {
    var stylesheets: { [key: string]: Promise<string> } = {
        monokai: downloadStylesheet("submodules/google-prettify-monokai-theme/prettify.css"),
        markstyle: downloadStylesheet("markstyledark.css")
    };

    function readFileAsArrayBuffer(blob: Blob) {
        return new Promise<ArrayBuffer>((resolve, reject) => {
            var reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (ev) => reject(ev);
            reader.readAsArrayBuffer(blob);
        });
    }
    function readFileAsText(blob: Blob) {
        return new Promise<string>((resolve, reject) => {
            var reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (ev) => reject(ev);
            reader.readAsText(blob);
        });
    }
    function prettifyCodes(markHTML: string): Promise<string> {
        var dom = (new DOMParser()).parseFromString(markHTML, "text/html");
        Array.prototype.forEach.call(
            dom.querySelectorAll("pre > code[class^=lang]"),
            (code: HTMLElement) => code.classList.add("prettyprint"));
        return addStylesheet(dom, "monokai")
            .then(() => addStylesheet(dom, "markstyle"))
            .then(() => new Promise<string>((resolve, reject) => {
                prettyPrint(() => resolve(dom.documentElement.innerHTML), dom);
            }));
    }
    function addStylesheet(dom: Document, stylename: string) {
        return stylesheets[stylename]
            .then((sheet) => dom.head.appendChild((new DOMLiner(dom)).element("style", null, sheet)))
    }
    function downloadStylesheet(src: string) {
        return new Promise<string>((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.onload = () => resolve(xhr.responseText);
            xhr.onerror = (e) => reject(e);
            xhr.open("GET", src);
            xhr.responseType = "text";
            xhr.send();
        });
    }
    function markup(markdown: string) {
        return prettifyCodes(marked(markdown, { gfm: true }));
    }
    export function unseal(blob: Blob): Promise<string> {
        return readFileAsText(blob)
            .then((text) => {
                return markup(text);
            });
    }
    export function unpack(blob: Blob): Promise<string> {
        return readFileAsArrayBuffer(blob)
            .then((arraybuffer) => {
                var jszip = new JSZip(arraybuffer);
                var main = jszip.file("index.md");
                if (!main)
                    throw new Error("No index.md file in this markpack.");
                return markup(main.asText());
            });
    }
}