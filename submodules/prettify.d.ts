/**
 * Find all the {@code <pre>} and {@code <code>} tags in the DOM with
 * {@code class=prettyprint} and prettify them.
 *
 * @param {Function} opt_whenDone called when prettifying is done.
 * @param {HTMLElement|HTMLDocument} opt_root an element or document
 *   containing all the elements to pretty print.
 *   Defaults to {@code document.body}.
 */
declare function prettyPrint(opt_whenDone?: Function, opt_root?: Node): void;

/**
 * Pretty print a chunk of code.
 * @param sourceCodeHtml {string} The HTML to pretty print.
 * @param opt_langExtension {string} The language name to use.
 *     Typically, a filename extension like 'cpp' or 'java'.
 * @param opt_numberLines {number|boolean} True to number lines,
 *     or the 1-indexed number of the first line in sourceCodeHtml.
 */
declare function prettyPrintOne(sourceCodeHTML: string, opt_langExtension?: string, opt_numberLines?: any): void;