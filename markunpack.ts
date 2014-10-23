/*
 * TODO:
 * 
 * Use JSZip, replace local image URLs to blob URLs
 * Bootstrap?
 */

module MarkUnpack {
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
    export function unseal(blob: Blob): Promise<string> {
        return readFileAsText(blob)
            .then((text) => {
                return marked(text, { gfm: true });
            });
    }
    export function unpack(blob: Blob): Promise<string> {
        return readFileAsArrayBuffer(blob)
            .then((arraybuffer) => {
                var jszip = new JSZip(arraybuffer);
                var main = jszip.file("index.md");
                if (!main)
                    throw new Error("No index.md file in this markpack.");
                return marked(main.asText(), { gfm: true });
            });
    }
}