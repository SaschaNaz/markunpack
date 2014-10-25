/*
* TODO:
*
* Use JSZip, replace local image URLs to blob URLs
* Bootstrap?
*/
var MarkUnpack;
(function (MarkUnpack) {
    var stylesheets = {
        monokai: downloadStylesheet("submodules/highlightjs/monokai_sublime.css"),
        markstyle: downloadStylesheet("markstyledark.css")
    };

    function addStylesheet(dom, stylename) {
        return stylesheets[stylename].then(function (sheet) {
            return dom.head.appendChild((new DOMLiner(dom)).element("style", null, sheet));
        });
    }
    function downloadStylesheet(src) {
        return XMLHttpRequestExtensions.request("GET", src, "text");
    }

    function highlightCodes(dom) {
        Array.prototype.forEach.call(dom.querySelectorAll("pre > code[class^=lang]"), function (code) {
            return hljs.highlightBlock(code);
        });
        return dom;
    }

    function markup(markdown, resources) {
        var markHTML = marked(markdown, { gfm: true });
        var dom = (new DOMParser()).parseFromString(markHTML, "text/html");
        highlightCodes(dom);

        var sequence = Promise.resolve();
        if (resources)
            sequence = sequence.then(function () {
                return insertImageDataURL(dom, resources);
            });
        return sequence.then(function () {
            return addStylesheet(dom, "monokai");
        }).then(function () {
            return addStylesheet(dom, "markstyle");
        }).then(function () {
            return dom.documentElement.innerHTML;
        });
    }
    function unseal(blob) {
        return FileReaderExtensions.read(blob, "text").then(function (text) {
            return markup(text);
        });
    }
    MarkUnpack.unseal = unseal;
    function unpack(blob) {
        return FileReaderExtensions.read(blob, "arraybuffer").then(function (arraybuffer) {
            var jszip = new JSZip(arraybuffer);
            var main = jszip.file("index.md");
            if (!main)
                throw new Error("No index.md file in this markpack.");
            return markup(main.asText(), jszip.folder("resources"));
        });
    }
    MarkUnpack.unpack = unpack;

    function insertImageDataURL(dom, resources) {
        var promises = [];
        Array.prototype.forEach.call(dom.querySelectorAll("img[src^='resources/']"), function (img) {
            var resource = resources.file(img.getAttribute("src").replace(/^resources\//, ''));
            if (resource)
                promises.push(FileReaderExtensions.read(new Blob([resource.asArrayBuffer()]), "dataurl").then(function (dataurl) {
                    img.src = dataurl;
                }));
        });
        return Promise.all(promises).then();
    }
})(MarkUnpack || (MarkUnpack = {}));
//# sourceMappingURL=markunpack.js.map
