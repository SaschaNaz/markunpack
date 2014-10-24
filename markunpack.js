/*
* TODO:
*
* Use JSZip, replace local image URLs to blob URLs
* Bootstrap?
*/
var MarkUnpack;
(function (MarkUnpack) {
    var stylesheets = {
        monokai: downloadStylesheet("submodules/google-prettify-monokai-theme/prettify.css"),
        markstyle: downloadStylesheet("markstyledark.css")
    };

    function readFileAsArrayBuffer(blob) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function () {
                return resolve(reader.result);
            };
            reader.onerror = function (ev) {
                return reject(ev);
            };
            reader.readAsArrayBuffer(blob);
        });
    }
    function readFileAsText(blob) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function () {
                return resolve(reader.result);
            };
            reader.onerror = function (ev) {
                return reject(ev);
            };
            reader.readAsText(blob);
        });
    }
    function prettifyCodes(markHTML) {
        var dom = (new DOMParser()).parseFromString(markHTML, "text/html");
        Array.prototype.forEach.call(dom.querySelectorAll("pre > code[class^=lang]"), function (code) {
            return code.classList.add("prettyprint");
        });
        return addStylesheet(dom, "monokai").then(function () {
            return addStylesheet(dom, "markstyle");
        }).then(function () {
            return new Promise(function (resolve, reject) {
                prettyPrint(function () {
                    return resolve(dom.documentElement.innerHTML);
                }, dom);
            });
        });
    }
    function addStylesheet(dom, stylename) {
        return stylesheets[stylename].then(function (sheet) {
            return dom.head.appendChild((new DOMLiner(dom)).element("style", null, sheet));
        });
    }
    function downloadStylesheet(src) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.onload = function () {
                return resolve(xhr.responseText);
            };
            xhr.onerror = function (e) {
                return reject(e);
            };
            xhr.open("GET", src);
            xhr.responseType = "text";
            xhr.send();
        });
    }
    function markup(markdown) {
        return prettifyCodes(marked(markdown, { gfm: true }));
    }
    function unseal(blob) {
        return readFileAsText(blob).then(function (text) {
            return markup(text);
        });
    }
    MarkUnpack.unseal = unseal;
    function unpack(blob) {
        return readFileAsArrayBuffer(blob).then(function (arraybuffer) {
            var jszip = new JSZip(arraybuffer);
            var main = jszip.file("index.md");
            if (!main)
                throw new Error("No index.md file in this markpack.");
            return markup(main.asText());
        });
    }
    MarkUnpack.unpack = unpack;
})(MarkUnpack || (MarkUnpack = {}));
//# sourceMappingURL=markunpack.js.map
