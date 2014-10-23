/*
* TODO:
*
* Use JSZip, replace local image URLs to blob URLs
* Bootstrap?
*/
var MarkUnpack;
(function (MarkUnpack) {
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
    function unseal(blob) {
        return readFileAsText(blob).then(function (text) {
            return marked(text, { gfm: true });
        });
    }
    MarkUnpack.unseal = unseal;
    function unpack(blob) {
        return readFileAsArrayBuffer(blob).then(function (arraybuffer) {
            var jszip = new JSZip(arraybuffer);
            var main = jszip.file("index.md");
            if (!main)
                throw new Error("No index.md file in this markpack.");
            return marked(main.asText(), { gfm: true });
        });
    }
    MarkUnpack.unpack = unpack;
})(MarkUnpack || (MarkUnpack = {}));
//# sourceMappingURL=markunpack.js.map
