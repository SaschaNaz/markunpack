/*
 * TODO:
 * 
 * Use JSZip, replace local image URLs to blob URLs
 * Bootstrap?
 */

module MarkUnpack {
    var stylesheets: { [key: string]: Promise<string> } = {
        monokai: downloadStylesheet("submodules/highlightjs/monokai_sublime.css"),
        markstyle: downloadStylesheet("markstyledark.css")
    };

    function addStylesheet(dom: Document, stylename: string) {
        return stylesheets[stylename]
            .then((sheet) => dom.head.appendChild((new DOMLiner(dom)).element("style", null, sheet)))
    }
    function downloadStylesheet(src: string) {
        return XMLHttpRequestExtensions.request("GET", src, "text");
    }

    function highlightCodes(dom: Document) {
        Array.prototype.forEach.call(
            dom.querySelectorAll("pre > code[class^=lang]"),
            (code: HTMLElement) => hljs.highlightBlock(code));
        return dom;
    }

    function markup(markdown: string, resources?: JSZip) {
        var markHTML = marked(markdown, { gfm: true });
        var dom = (new DOMParser()).parseFromString(markHTML, "text/html")
        highlightCodes(dom);

        var sequence = Promise.resolve<any>();
        if (resources)
            sequence = sequence.then(() => insertImageDataURL(dom, resources))
        return sequence
            .then(() => addStylesheet(dom, "monokai"))
            .then(() => addStylesheet(dom, "markstyle"))
            .then(() => dom.documentElement.innerHTML);
    }
    export function unseal(blob: Blob): Promise<string> {
        return FileReaderExtensions.read(blob, "text")
            .then((text) => {
                return markup(text);
            });
    }
    export function unpack(blob: Blob): Promise<string> {
        return FileReaderExtensions.read(blob, "arraybuffer")
            .then((arraybuffer) => {
                var jszip = new JSZip(arraybuffer);
                var main = jszip.file("index.md");
                if (!main)
                    throw new Error("No index.md file in this markpack.");
                return markup(main.asText(), jszip.folder("resources"));
            });
    }

    function insertImageDataURL(dom: Document, resources: JSZip) {
        var promises: Promise<void>[] = [];
        Array.prototype.forEach.call(dom.querySelectorAll("img[src^='resources/']"), (img: HTMLImageElement) => {
            var resource = resources.file(img.getAttribute("src").replace(/^resources\//, ''));
            if (resource)
                promises.push(
                    FileReaderExtensions.read(new Blob([resource.asArrayBuffer()]), "dataurl")
                        .then((dataurl) => { img.src = dataurl; }));
        });
        return Promise.all(promises).then<void>();
    }
}