// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// ==/ClosureCompiler==


/** Outside an HTML tag, directive, or comment.  (Parsed character data). */
var STATE_HTML_PCDATA = 0;

/**
 * Inside an element whose content is RCDATA where text and entities can appear but where nested
 * elements cannot.
 * The content of {@code <title>} and {@code <textarea>} fall into this category since they
 * cannot contain nested elements in HTML.
 */
var STATE_HTML_RCDATA = 1;

/** Just before a tag name. */
var STATE_HTML_BEFORE_TAG_NAME = 2;

/** Inside a tag name. */
var STATE_HTML_TAG_NAME = 3;

/** Before an HTML attribute or the end of a tag. */
var STATE_HTML_TAG = 4;

/** Inside an HTML attribute name. */
var STATE_HTML_ATTRIBUTE_NAME = 5;

/** Following an equals sign (<tt>=</tt>) after an attribute name in an HTML tag. */
var STATE_HTML_BEFORE_ATTRIBUTE_VALUE = 6;

/** Inside an HTML comment. */
var STATE_HTML_COMMENT = 7;

/** Inside a normal (non-CSS, JS, or URI) HTML attribute value. */
var STATE_HTML_NORMAL_ATTR_VALUE = 8;

/** In CSS content outside a comment, string, or URI. */
var STATE_CSS = 9;

/** In CSS inside a comment. */
var STATE_CSS_COMMENT = 10;

/** In CSS inside a double quoted string. */
var STATE_CSS_DQ_STRING = 11;

/** In CSS inside a single quoted string. */
var STATE_CSS_SQ_STRING = 12;

/** In CSS in a URI terminated by the first close parenthesis. */
var STATE_CSS_URI = 13;

/** In CSS in a URI terminated by the first double quote. */
var STATE_CSS_DQ_URI = 14;

/** In CSS in a URI terminated by the first single quote. */
var STATE_CSS_SQ_URI = 15;

/** In JavaScript, outside a comment, string, or Regexp literal. */
var STATE_JS = 16;

/** In JavaScript inside a line comment. */
var STATE_JS_LINE_COMMENT = 17;

/** In JavaScript inside a block comment. */
var STATE_JS_BLOCK_COMMENT = 18;

/** In JavaScript inside a double quoted string. */
var STATE_JS_DQ_STRING = 19;

/** In JavaScript inside a single quoted string. */
var STATE_JS_SQ_STRING = 20;

/** In JavaScript inside a regular expression literal. */
var STATE_JS_REGEX = 21;

/** In an HTML attribute whose content is a URI. */
var STATE_URI = 22;

/** Not inside any valid HTML/CSS/JS construct. */
var STATE_ERROR = 23;

var STATE_ALL = 31;
function stateOf(context) { return context & STATE_ALL; }


/** A type of HTML element. */

/** No element. */
var ELEMENT_TYPE_NONE = 0;

/** A script element whose content is raw JavaScript. */
var ELEMENT_TYPE_SCRIPT = 1 << 5;

/** A style element whose content is raw CSS. */
var ELEMENT_TYPE_STYLE = 2 << 5;

/** A textarea element whose content is encoded HTML but which cannot contain elements. */
var ELEMENT_TYPE_TEXTAREA = 3 << 5;

/** A title element whose content is encoded HTML but which cannot contain elements. */
var ELEMENT_TYPE_TITLE = 4 << 5;

/** A listing element whose content is raw CDATA. */
var ELEMENT_TYPE_LISTING = 5 << 5;

/** An XMP element whose content is raw CDATA. */
var ELEMENT_TYPE_XMP = 6 << 5;

/** An element whose content is normal mixed PCDATA and child elements. */
var ELEMENT_TYPE_NORMAL = 7 << 5;

var ELEMENT_TYPE_ALL = 7 << 5;
function elementTypeOf(context) { return context & ELEMENT_TYPE_ALL; }


/** Describes the content of an HTML attribute. */

/** No attribute. */
var ATTR_TYPE_NONE = 0;

/** Mime-type text/javascript. */
var ATTR_TYPE_SCRIPT = 1 << 8;

/** Mime-type text/css. */
var ATTR_TYPE_STYLE = 2 << 8;

/** A URI or URI reference. */
var ATTR_TYPE_URI = 3 << 8;

/** Other content.  Human readable or other non-structured plain text or keyword values. */
var ATTR_TYPE_PLAIN_TEXT = 4 << 8;

var ATTR_TYPE_ALL = 7 << 8;
function attrTypeOf(context) { return context & ATTR_TYPE_ALL; }


/**
 * Describes the content that will end the current HTML attribute.
 */

/** Not in an attribute. */
var DELIM_TYPE_NONE = 0;

/** {@code "}  */
var DELIM_TYPE_DOUBLE_QUOTE = 1 << 11;

/** {@code '} */
var DELIM_TYPE_SINGLE_QUOTE = 2 << 11;

/** A space or {@code >} symbol. */
var DELIM_TYPE_SPACE_OR_TAG_END = 3 << 11;

var DELIM_TYPE_ALL = 3 << 11;
function delimTypeOf(context) { return context & DELIM_TYPE_ALL; }


/**
 * Describes what a slash ({@code /}) means when parsing JavaScript source code.
 * A slash that is not followed by another slash or an asterisk (<tt>*</tt>) can either start a
 * regular expression literal or start a division operator.
 * This determination is made based on the full grammar, but Waldemar defined a very close to
 * accurate grammar for a JavaScript 1.9 draft based purely on a regular lexical grammar which is
 * what we use in the autoescaper.
 *
 * @see #isRegexPreceder
 */

/** Not in JavaScript. */
var JS_FOLLOWING_SLASH_NONE = 0;

/** A slash as the next token would start a regular expression literal. */
var JS_FOLLOWING_SLASH_REGEX = 1 << 13;

/** A slash as the next token would start a division operator. */
var JS_FOLLOWING_SLASH_DIV_OP = 2 << 13;

/**
 * We do not know what a slash as the next token would start so it is an error for the next
 * token to be a slash.
 */
var JS_FOLLOWING_SLASH_UNKNOWN = 3 << 13;

var JS_FOLLOWING_SLASH_ALL = 3 << 13;
function jsFollowingSlashOf(context) { return context & JS_FOLLOWING_SLASH_ALL; }


/**
 * Describes the part of a URI reference that the context point is in.
 *
 * <p>
 * We need to distinguish these so that we can<ul>
 *   <li>normalize well-formed URIs that appear before the query,</li>
 *   <li>encode raw values interpolated as query parameters or keys,</li>
 *   <li>filter out values that specify a scheme like {@code javascript:}.
 * </ul>
 */

/** Not in a URI. */
var URI_PART_NONE = 0;

/** Where a scheme might be seen.  At ^ in {@code ^http://host/path?k=v#frag}. */
var URI_PART_START = 1 << 15;

/** In the scheme, authority, or path.  Between ^s in {@code h^ttp://host/path^?k=v#frag}. */
var URI_PART_PRE_QUERY = 2 << 15;

/** In the query portion.  Between ^s in {@code http://host/path?^k=v^#frag}*/
var URI_PART_QUERY = 3 << 15;

/** In the fragment.  After ^ in {@code http://host/path?k=v#^frag}*/
var URI_PART_FRAGMENT = 4 << 15;

/** Not {@link #NONE} or {@link #FRAGMENT}, but unknown.  Used to join different contexts. */
var URI_PART_UNKNOWN_PRE_FRAGMENT = 5 << 15;

/** Not {@link #NONE}, but unknown.  Used to join different contexts. */
var URI_PART_UNKNOWN = 6 << 15;

var URI_PART_ALL = 7 << 15;
function uriPartOf(context) { return context & URI_PART_ALL; }


var DELIM_TEXT = {};
DELIM_TEXT[DELIM_TYPE_DOUBLE_QUOTE] = '"';
DELIM_TEXT[DELIM_TYPE_SINGLE_QUOTE] = '\'';
DELIM_TEXT[DELIM_TYPE_SPACE_OR_TAG_END] = '';

/** Encodes HTML special characters. */
var ESC_MODE_ESCAPE_HTML = 0;

/** Like {@link #ESCAPE_HTML} but normalizes known safe HTML since RCDATA can't contain tags. */
var ESC_MODE_ESCAPE_HTML_RCDATA = 1;

/**
 * Encodes HTML special characters, including quotes, so that the value can appear as part of a
 * quoted attribute value.
 * This differs from {@link #ESCAPE_HTML} in that it strips tags from known safe HTML.
 */
var ESC_MODE_ESCAPE_HTML_ATTRIBUTE = 2;

/**
 * Encodes HTML special characters and spaces so that the value can appear as part of an unquoted
 * attribute.
 */
var ESC_MODE_ESCAPE_HTML_ATTRIBUTE_NOSPACE = 3;

/**
 * Only allow a valid identifier - letters, numbers, dashes, and underscores.
 * Throw a runtime exception otherwise.
 */
var ESC_MODE_FILTER_HTML_IDENT = 4;

/**
 * Encode all HTML special characters and quotes, and JS newlines as if to allow them to appear
 * literally in a JS string.
 */
var ESC_MODE_ESCAPE_JS_STRING = 5;

/**
 * If a number or boolean, output as a JS literal.  Otherwise surround in quotes and escape.
 * Make sure all HTML and space characters are quoted.
 */
var ESC_MODE_ESCAPE_JS_VALUE = 6;

/**
 * Like {@link #ESCAPE_JS_STRING} but additionally escapes RegExp specials like
 * <code>.+*?$^[](){}</code>.
 */
var ESC_MODE_ESCAPE_JS_REGEX = 7;

/**
 * Must escape all quotes, newlines, and the close parenthesis using {@code \} followed by hex
 * followed by a space.
 */
var ESC_MODE_ESCAPE_CSS_STRING = 8;

/**
 * If the value is numeric, renders it as a numeric value so that <code>{$n}px</code> works as
 * expected, otherwise if it is a valid CSS identifier, outputs it without escaping, otherwise
 * surrounds in quotes and escapes like {@link #ESCAPE_CSS_STRING}.
 */
var ESC_MODE_FILTER_CSS_VALUE = 9;

/**
 * Percent encode all URI special characters and characters that cannot appear unescaped in a URI
 * such as spaces.  Make sure to encode pluses and parentheses.
 * This corresponds to the JavaScript function {@code encodeURIComponent}.
 */
var ESC_MODE_ESCAPE_URI = 10;

/**
 * Percent encode non-URI characters that cannot appear unescaped in a URI such as spaces, and
 * encode characters that are not special in URIs that are special in languages that URIs are
 * embedded in such as parentheses and quotes.
 * This corresponds to the JavaScript function {@code encodeURI} but additionally encodes quotes
 * parentheses, and percent signs that are not followed by two hex digits.
 */
var ESC_MODE_NORMALIZE_URI = 11;

/**
 * Like {@link #NORMALIZE_URI}, but filters out schemes like {@code javascript:} that load code.
 */
var ESC_MODE_FILTER_NORMALIZE_URI = 12;

/**
 * The explicit rejection of escaping.
 */
var ESC_MODE_NO_AUTOESCAPE = 13;

var IS_ESC_MODE_HTML_EMBEDDABLE = {};
IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_ESCAPE_HTML] = true;
IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_ESCAPE_HTML_RCDATA] = true;
IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_ESCAPE_HTML_ATTRIBUTE] = true;
IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_ESCAPE_HTML_ATTRIBUTE_NOSPACE] = true;
IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_FILTER_HTML_IDENT] = true;
IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_ESCAPE_JS_STRING] = false;
IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_ESCAPE_JS_VALUE] = false;
IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_ESCAPE_JS_REGEX] = false;
IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_ESCAPE_CSS_STRING] = true;
IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_FILTER_CSS_VALUE] = false;
IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_ESCAPE_URI] = true;
IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_NORMALIZE_URI] = false;
IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_FILTER_NORMALIZE_URI] = false;
IS_ESC_MODE_HTML_EMBEDDABLE[ESC_MODE_NO_AUTOESCAPE] = false;

/**
 * A snippet of HTML that does not start or end inside a tag, comment, entity,
 * or DOCTYPE; and that does not contain any executable code
 * (JS, {@code <object>}s, etc.) from a different trust domain.
 */
var CONTENT_KIND_HTML = 0;

/**
 * A sequence of code units that can appear between quotes (either kind) in a
 * JS program without causing a parse error, and without causing any side
 * effects.
 * <p>
 * The content should not contain unescaped quotes, newlines, or anything else
 * that would cause parsing to fail or to cause a JS parser to finish the
 * string its parsing inside the content.
 * <p>
 * The content must also not end inside an escape sequence ; no partial octal
 * escape sequences or odd number of '{@code \}'s at the end.
 */
var CONTENT_KIND_JS_STR_CHARS = 1;

/** A properly encoded portion of a URI. */
var CONTENT_KIND_URI = 2;


var CONTENT_KIND_FOR_ESC_MODE = [];
CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_ESCAPE_HTML] = CONTENT_KIND_HTML;
//CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_ESCAPE_HTML_RCDATA] = null;
//CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_ESCAPE_HTML_ATTRIBUTE] = null;
//CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_ESCAPE_HTML_ATTRIBUTE_NOSPACE] = null;
//CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_FILTER_HTML_IDENT] = null;
CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_ESCAPE_JS_STRING] = CONTENT_KIND_JS_STR_CHARS;
CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_NORMALIZE_URI] = CONTENT_KIND_URI;
CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_ESCAPE_URI] = CONTENT_KIND_URI;
//CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_ESCAPE_JS_VALUE] = null;
//CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_ESCAPE_JS_REGEX] = null;
//CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_ESCAPE_CSS_STRING] = null;
//CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_FILTER_CSS_VALUE] = null;
CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_FILTER_NORMALIZE_URI] = CONTENT_KIND_URI;
//CONTENT_KIND_FOR_ESC_MODE[ESC_MODE_NO_AUTOESCAPE] = null;

var ESC_MODE_FOR_STATE = [];
ESC_MODE_FOR_STATE[STATE_HTML_PCDATA] = ESC_MODE_ESCAPE_HTML;
ESC_MODE_FOR_STATE[STATE_HTML_RCDATA] = ESC_MODE_ESCAPE_HTML_RCDATA;
ESC_MODE_FOR_STATE[STATE_HTML_BEFORE_TAG_NAME] = ESC_MODE_FILTER_HTML_IDENT;
ESC_MODE_FOR_STATE[STATE_HTML_TAG_NAME] = ESC_MODE_FILTER_HTML_IDENT;
ESC_MODE_FOR_STATE[STATE_HTML_TAG] = ESC_MODE_FILTER_HTML_IDENT;
ESC_MODE_FOR_STATE[STATE_HTML_ATTRIBUTE_NAME] = ESC_MODE_FILTER_HTML_IDENT;
//ESC_MODE_FOR_STATE[STATE_HTML_BEFORE_ATTRIBUTE_VALUE] = void 0;
ESC_MODE_FOR_STATE[STATE_HTML_COMMENT] = ESC_MODE_ESCAPE_HTML_RCDATA;
ESC_MODE_FOR_STATE[STATE_HTML_NORMAL_ATTR_VALUE] = ESC_MODE_ESCAPE_HTML_ATTRIBUTE;
ESC_MODE_FOR_STATE[STATE_CSS] = ESC_MODE_FILTER_CSS_VALUE;
//ESC_MODE_FOR_STATE[STATE_CSS_COMMENT] = void 0;
ESC_MODE_FOR_STATE[STATE_CSS_DQ_STRING] = ESC_MODE_ESCAPE_CSS_STRING;
ESC_MODE_FOR_STATE[STATE_CSS_SQ_STRING] = ESC_MODE_ESCAPE_CSS_STRING;
ESC_MODE_FOR_STATE[STATE_CSS_URI] = ESC_MODE_NORMALIZE_URI;
ESC_MODE_FOR_STATE[STATE_CSS_DQ_URI] = ESC_MODE_NORMALIZE_URI;
ESC_MODE_FOR_STATE[STATE_CSS_SQ_URI] = ESC_MODE_NORMALIZE_URI;
ESC_MODE_FOR_STATE[STATE_JS] = ESC_MODE_ESCAPE_JS_VALUE;
//ESC_MODE_FOR_STATE[STATE_JS_LINE_COMMENT] = void 0;
//ESC_MODE_FOR_STATE[STATE_JS_BLOCK_COMMENT] = void 0;
ESC_MODE_FOR_STATE[STATE_JS_DQ_STRING] = ESC_MODE_ESCAPE_JS_STRING;
ESC_MODE_FOR_STATE[STATE_JS_SQ_STRING] = ESC_MODE_ESCAPE_JS_STRING;
ESC_MODE_FOR_STATE[STATE_JS_REGEX] = ESC_MODE_ESCAPE_JS_REGEX;
ESC_MODE_FOR_STATE[STATE_URI] = ESC_MODE_ESCAPE_HTML_ATTRIBUTE;

function contextToString(context) {
  var parts = [];
  switch (stateOf(context)) {
  case STATE_HTML_PCDATA: parts.push("HTML_PCDATA"); break;
  case STATE_HTML_RCDATA: parts.push("HTML_RCDATA"); break;
  case STATE_HTML_BEFORE_TAG_NAME: parts.push("HTML_BEFORE_TAG_NAME"); break;
  case STATE_HTML_TAG_NAME: parts.push("HTML_TAG_NAME"); break;
  case STATE_HTML_TAG: parts.push("HTML_TAG"); break;
  case STATE_HTML_ATTRIBUTE_NAME: parts.push("HTML_ATTRIBUTE_NAME"); break;
  case STATE_HTML_BEFORE_ATTRIBUTE_VALUE: parts.push("HTML_BEFORE_ATTRIBUTE_VALUE"); break;
  case STATE_HTML_COMMENT: parts.push("HTML_COMMENT"); break;
  case STATE_HTML_NORMAL_ATTR_VALUE: parts.push("HTML_NORMAL_ATTR_VALUE"); break;
  case STATE_CSS: parts.push("CSS"); break;
  case STATE_CSS_COMMENT: parts.push("CSS_COMMENT"); break;
  case STATE_CSS_DQ_STRING: parts.push("CSS_DQ_STRING"); break;
  case STATE_CSS_SQ_STRING: parts.push("CSS_SQ_STRING"); break;
  case STATE_CSS_URI: parts.push("CSS_URI"); break;
  case STATE_CSS_DQ_URI: parts.push("CSS_DQ_URI"); break;
  case STATE_CSS_SQ_URI: parts.push("CSS_SQ_URI"); break;
  case STATE_JS: parts.push("JS"); break;
  case STATE_JS_LINE_COMMENT: parts.push("JS_LINE_COMMENT"); break;
  case STATE_JS_BLOCK_COMMENT: parts.push("JS_BLOCK_COMMENT"); break;
  case STATE_JS_DQ_STRING: parts.push("JS_DQ_STRING"); break;
  case STATE_JS_SQ_STRING: parts.push("JS_SQ_STRING"); break;
  case STATE_JS_REGEX: parts.push("JS_REGEX"); break;
  case STATE_URI: parts.push("URI"); break;
  case STATE_ERROR: parts.push("ERROR"); break;
  }
  switch (elementTypeOf(context)) {
  case ELEMENT_TYPE_SCRIPT: parts.push("SCRIPT"); break;
  case ELEMENT_TYPE_STYLE: parts.push("STYLE"); break;
  case ELEMENT_TYPE_TEXTAREA: parts.push("TEXTAREA"); break;
  case ELEMENT_TYPE_TITLE: parts.push("TITLE"); break;
  case ELEMENT_TYPE_LISTING: parts.push("LISTING"); break;
  case ELEMENT_TYPE_XMP: parts.push("XMP"); break;
  case ELEMENT_TYPE_NORMAL: parts.push("NORMAL"); break;
  }
  switch (attrTypeOf(context)) {
  case ATTR_TYPE_SCRIPT: parts.push("SCRIPT"); break;
  case ATTR_TYPE_STYLE: parts.push("STYLE"); break;
  case ATTR_TYPE_URI: parts.push("URI"); break;
  case ATTR_TYPE_PLAIN_TEXT: parts.push("PLAIN_TEXT"); break;
  }
  switch (delimTypeOf(context)) {
  case DELIM_TYPE_DOUBLE_QUOTE: parts.push("DOUBLE_QUOTE"); break;
  case DELIM_TYPE_SINGLE_QUOTE: parts.push("SINGLE_QUOTE"); break;
  case DELIM_TYPE_SPACE_OR_TAG_END: parts.push("SPACE_OR_TAG_END"); break;
  }
  switch (jsFollowingSlashOf(context)) {
  case JS_FOLLOWING_SLASH_REGEX: parts.push("REGEX"); break;
  case JS_FOLLOWING_SLASH_DIV_OP: parts.push("DIV_OP"); break;
  case JS_FOLLOWING_SLASH_UNKNOWN: parts.push("UNKNOWN"); break;
  }
  switch (uriPartOf(context)) {
  case URI_PART_START: parts.push("START"); break;
  case URI_PART_PRE_QUERY: parts.push("PRE_QUERY"); break;
  case URI_PART_QUERY: parts.push("QUERY"); break;
  case URI_PART_FRAGMENT: parts.push("FRAGMENT"); break;
  case URI_PART_UNKNOWN_PRE_FRAGMENT: parts.push("UNKNOWN_PRE_FRAGMENT"); break;
  case URI_PART_UNKNOWN: parts.push("UNKNOWN"); break;
  }
  return '[Context ' + parts.join(' ') + ']';
}

var REGEX_PRECEDER_KEYWORDS = {
  "break" : true,
  "case" : true,
  "continue" : true,
  "delete" : true,
  "do" : true,
  "else" : true,
  "finally" : true,
  "instanceof" : true,
  "return" : true,
  "throw" : true,
  "try" : true,
  "typeof": true
};

/**
 * True iff a slash after the given run of non-whitespace tokens starts a regular expression
 * instead of a div operator : (/ or /=).
 * <p>
 * This fails on some valid but nonsensical JavaScript programs like {@code x = ++/foo/i} which is
 * quite different than {@code x++/foo/i}, but is not known to fail on any known useful programs.
 * It is based on the draft
 * <a href="http://www.mozilla.org/js/language/js20-2000-07/rationale/syntax.html">JavaScript 2.0
 * lexical grammar</a> and requires one token of lookbehind.
 *
 * @param {string} jsTokens A run of non-whitespace, non-comment, non string tokens not including
 *     the '/' character.  Non-empty.
 */
function isRegexPreceder(jsTokens) {
  // Tokens that precede a regular expression in JavaScript.
  // "!", "!=", "!==", "#", "%", "%=", "&", "&&", "&&=", "&=", "(", "*", "*=", "+", "+=", ",",
  // "-", "-=", "->", ".", "..", "...", "/", "/=", ":", "::", ";", "<", "<<", "<<=", "<=", "=",
  // "==", "===", ">", ">=", ">>", ">>=", ">>>", ">>>=", "?", "@", "[", "^", "^=", "^^", "^^=",
  // "{", "|", "|=", "||", "||=", "~",
  // "break", "case", "continue", "delete", "do", "else", "finally", "instanceof", "return",
  // "throw", "try", "typeof"

  var jsTokensLen = jsTokens.length;
  var lastChar = jsTokens.charAt(jsTokensLen - 1);
  switch (lastChar) {
  case '=':
  case '#':
  case '%':
  case '&':
  case '(':
  case '*':
  case ',':
  case '<':
  case '>':
  case '?':
  case ':':
  case ';':
  case '^':
  case '{':
  case '|':
  case '}':
  case '~':
  case '[':
    return true;
  case '+':
  case '-':
    // ++ and -- are not
    var signStart = jsTokensLen - 1;
    // Count the number of adjacent dashes or pluses.
    while (signStart > 0 && jsTokens.charAt(signStart - 1) === lastChar) {
      --signStart;
    }
    var numAdjacent = jsTokensLen - signStart;
    // True for odd numbers since "---" is the same as "-- -".
    // False for even numbers since "----" is the same as "-- --" which ends with a decrement,
    // not a minus sign.
    return (numAdjacent & 1) === 1;
  case '.':
    if (jsTokensLen === 1) {
      return true;
    }
    // There is likely to be a .. or ... operator in newer versions of EcmaScript.
    var ch = jsTokens.charAt(jsTokensLen - 2);
    return !('0' <= ch && ch <= '9');
  case '/':  // Match a div op, but not a regexp.
    return jsTokensLen === 1;
  default:
    // Look for one of the keywords above.
    var word = jsTokens.match(/[\w$]+$/);
    return word && REGEX_PRECEDER_KEYWORDS[word[0]] === true;
  }
}

function computeContextAfterAttributeDelimiter(elType, attrType, delim) {
  var state;
  var slash = JS_FOLLOWING_SLASH_NONE;
  var uriPart = URI_PART_NONE;
  switch (attrType) {
  case ATTR_TYPE_PLAIN_TEXT:
    state = STATE_HTML_NORMAL_ATTR_VALUE;
    break;
  case ATTR_TYPE_SCRIPT:
    state = STATE_JS;
    // Start a JS block in a regex state since
    //   /foo/.test(str) && doSideEffect();
    // which starts with a regular expression literal is a valid and possibly
    // useful program, but there is no valid program which starts with a
    // division operator.
    slash = JS_FOLLOWING_SLASH_REGEX;
    break;
  case ATTR_TYPE_STYLE:
    state = STATE_CSS;
    break;
  case ATTR_TYPE_URI:
    state = STATE_URI;
    uriPart = URI_PART_START;
    break;
  // NONE is not a valid AttributeType inside an attribute value.
  default: throw new Error("Unexpected attribute type " + attrType);
  }
  return state | elType | attrType | delim | slash | uriPart;
}

var processRawText = (function () {
  var global = this;

  var HTML_ENTITY_NAME_TO_TEXT = {
    lt: '<',
    gt: '>',
    amp: '&',
    quot: '"',
    apos: "'"
  };

  function unescapeHtml(html) {
    if (html.indexOf('&') < 0) { return html; }  // Fast path for common case.
    return html.replace(
      /&(?:#(?:[xX]([0-9a-fA-F]+)|([0-9]+))|([a-zA-Z][a-zA-Z0-9]+));/g,
      function (entity, hex, decimal, entityName) {
        if (hex) { return String.fromCharCode(parseInt(hex, 16)); }
        if (decimal) { return String.fromCharCode(parseInt(decimal, 10)); }
        // We don't need to escape all entities, just the ones that could be token boundaries.
        var decoded = HTML_ENTITY_NAME_TO_TEXT[entityName]
                      || HTML_ENTITY_NAME_TO_TEXT[entityName.toLowerCase()];
        return (typeof decoded === 'string') ? decoded : entity;
      }
    );
  }


  /**
   * @return The end of the attribute value of -1 if delim indicates we are not in an attribute.
   *     {@code rawText.length} if we are in an attribute but the end does not appear in rawText.
   */
  function findEndOfAttributeValue(rawText, delim) {
    var rawTextLen = rawText.length;
    switch (delim) {
    case DELIM_TYPE_DOUBLE_QUOTE:
    case DELIM_TYPE_SINGLE_QUOTE:
      var quote = rawText.indexOf(DELIM_TEXT[delim]);
      return quote >= 0 ? quote : rawTextLen;

    case DELIM_TYPE_SPACE_OR_TAG_END:
      var match = rawText.match(/[\s>]/);
      return match ? match.index : rawTextLen;

    case DELIM_TYPE_NONE:
      return -1;
    }
    throw new Error("Unrecognized delimiter " + delim);
  }


  function isErrorContext(context) {
    return stateOf(context) === STATE_ERROR;
  }


  /**
   * Encapsulates a grammar production and the context after that production is seen in a chunk of
   * HTML/CSS/JS input.
   * @param {RegExp} pattern
   * @constructor
   */
  function Transition(pattern) {
    /** Matches a token. */
    this.pattern = pattern;
  }

  /**
   * True iff this transition can produce a context after the text in
   * {@code rawText[0:match.index + match[0].length]}.
   * This should not destructively modify the match.
   * Specifically, it should not call {@code find()} again.
   * @param {number} prior The context prior to the token in match.
   * @param {Array.<String>} match The token matched by {@code this.pattern}.
   */
  Transition.prototype.isApplicableTo = function (prior, match) {
    return true;
  };

  /**
   * Computes the context that this production transitions to after
   * {@code rawText[0:match.index + match[].length]}.
   * @param {number} prior The context prior to the token in match.
   * @param {Array.<String>} match The token matched by {@code this.pattern}.
   * @return The context after the given token.
   */
  Transition.prototype.computeNextContext = function (prior, match) {
    throw new Error('IMPLEMENT ME');
  };


  /**
   * A transition to a given context.
   * @param {RegExp} regex
   * @param {number} dest a context.
   * @constructor
   */
  function ToTransition(regex, dest) {
    Transition.call(this, regex);
    this.dest = dest;
  }
  ToTransition.prototype = new Transition(/(?!)/);
  ToTransition.prototype.constructor = ToTransition;
  ToTransition.prototype.computeNextContext = function (prior, match) {
    return this.dest;
  };


  /**
   * A transition to a context in the body of an open tag for the given element.
   * @param {RegExp} regex
   * @constructor
   */
  function ToTagTransition(regex, el) {
    Transition.call(this, regex);
    this.el = el;
  }
  ToTagTransition.prototype = new Transition(/(?!)/);
  ToTagTransition.prototype.constructor = ToTagTransition;
  ToTagTransition.prototype.computeNextContext = function (prior, match) {
    return STATE_HTML_TAG | this.el;
  };

  /**
   * @param {RegExp} regex
   * @constructor
   */
  function TagDoneTransition(regex) {
    Transition.call(this, regex);
  }
  TagDoneTransition.prototype = new Transition(/(?!)/);
  TagDoneTransition.prototype.constructor = TagDoneTransition;
  TagDoneTransition.prototype.computeNextContext = function (prior, match) {
    var elType = elementTypeOf(prior);
    switch (elType) {
    case ELEMENT_TYPE_SCRIPT:
      return STATE_JS | JS_FOLLOWING_SLASH_REGEX;
    case ELEMENT_TYPE_STYLE:
      return STATE_CSS;
    case ELEMENT_TYPE_NORMAL:
      return STATE_HTML_PCDATA;
    case ELEMENT_TYPE_NONE:
      throw new Error();
    case ELEMENT_TYPE_LISTING:
    case ELEMENT_TYPE_TEXTAREA:
    case ELEMENT_TYPE_TITLE:
    case ELEMENT_TYPE_XMP:
      return STATE_HTML_RCDATA | elType;
    }
    throw new Error("Unrecognized state " + elType);
  };


  /**
   * A transition back to a context in the body of an open tag.
   * @param {RegExp} regex
   * @constructor
   */
  function TransitionBackToTag(regex) {
    Transition.call(this, regex);
  }
  TransitionBackToTag.prototype = new Transition(/(?!)/);
  TransitionBackToTag.prototype.constructor = TransitionBackToTag;
  TransitionBackToTag.prototype.computeNextContext = function (prior, match) {
    return STATE_HTML_TAG | elementTypeOf(prior);
  };


  /**
   * Lower case names of attributes whose value is a URI.
   * This does not identify attributes like {@code <meta content>} which is conditionally a URI
   * depending on the value of other attributes.
   * @see <a href="http://www.w3.org/TR/html4/index/attributes.html">HTML4 attrs with type %URI</a>
   */
  var URI_ATTR_NAMES = {
      "action" : true,
      "archive" : true,
      "background" : true,
      "cite" : true,
      "classid" : true,
      "codebase" : true,
      "data" : true,
      "dsync" : true,
      "href" : true,
      "longdesc" : true,
      "src" : true,
      "usemap" : true
    };

  /**
   * A transition to a context in the name of an attribute whose type is determined from its name.
   * @param {RegExp} regex A regular expression whose group 1 is a prefix of an attribute name.
   * @constructor
   */
  function TransitionToAttrName(regex) {
    Transition.call(this, regex);
  }
  TransitionToAttrName.prototype = new Transition(/(?!)/);
  TransitionToAttrName.prototype.constructor = TransitionToAttrName;
  TransitionToAttrName.prototype.computeNextContext = function (prior, match) {
    var attrName = match[1].toLowerCase();
    var attr;
    if ('on' === attrName.substring(0, 2)) {
      attr = ATTR_TYPE_SCRIPT;
    } else if ("style" === attrName) {
      attr = ATTR_TYPE_STYLE;
    } else if (URI_ATTR_NAMES[attrName] === true) {
      attr = ATTR_TYPE_URI;
    } else {
      attr = ATTR_TYPE_PLAIN_TEXT;
    }
    return STATE_HTML_ATTRIBUTE_NAME | elementTypeOf(prior) | attr;
  };

  /**
   * A transition to a context in the name of an attribute of the given type.
   * @param {RegExp} regex
   * @constructor
   */
  function TransitionToAttrValue(regex, delim) {
    Transition.call(this, regex);
    this.delim = delim;
  }
  TransitionToAttrValue.prototype = new Transition(/(?!)/);
  TransitionToAttrValue.prototype.constructor = TransitionToAttrValue;
  TransitionToAttrValue.prototype.computeNextContext = function (prior, match) {
    return computeContextAfterAttributeDelimiter(
        elementTypeOf(prior), attrTypeOf(prior), this.delim);
  };


  /**
   * A transition to the given state.
   * @param {RegExp} regex
   * @constructor
   */
  function TransitionToState(regex, state) {
    Transition.call(this, regex);
    this.state = state;
  }
  TransitionToState.prototype = new Transition(/(?!)/);
  TransitionToState.prototype.constructor = TransitionToState;
  TransitionToState.prototype.computeNextContext = function (prior, match) {
    return (prior & ~(URI_PART_ALL | STATE_ALL)) | this.state;
  };

  /**
   * A transition to the given state.
   * @param {RegExp} regex
   * @constructor
   */
  function TransitionToJsString(regex, state) {
    Transition.call(this, regex);
    this.state = state;
  }
  TransitionToJsString.prototype = new Transition(/(?!)/);
  TransitionToJsString.prototype.constructor = TransitionToJsString;
  TransitionToJsString.prototype.computeNextContext = function (prior, match) {
    return (prior & (ELEMENT_TYPE_ALL | ATTR_TYPE_ALL | DELIM_TYPE_ALL)) | this.state;
  };

  /**
   * @param {RegExp} regex
   * @constructor
   */
  function SlashTransition(regex) {
    Transition.call(this, regex);
  }
  SlashTransition.prototype = new Transition(/(?!)/);
  SlashTransition.prototype.constructor = SlashTransition;
  SlashTransition.prototype.computeNextContext = function (prior, match) {
    switch (jsFollowingSlashOf(prior)) {
    case JS_FOLLOWING_SLASH_DIV_OP:
      return (prior & ~(STATE_ALL | JS_FOLLOWING_SLASH_ALL)) | STATE_JS | JS_FOLLOWING_SLASH_REGEX;
    case JS_FOLLOWING_SLASH_REGEX:
      return (prior & ~(STATE_ALL | JS_FOLLOWING_SLASH_ALL))
          | STATE_JS_REGEX | JS_FOLLOWING_SLASH_NONE;
    default:
      throw new Error(
          "Slash (/) cannot follow an {if}, {switch}, or loop since it is unclear " +
          "whether the slash is a RegExp literal or division operator.  " +
          "Please add parentheses before `" + match[0] + "`"
      );
    }
  };

  /**
   * @param {RegExp} regex
   * @constructor
   */
  function JsPuncTransition(regex) {
    Transition.call(this, regex);
  }
  JsPuncTransition.prototype = new Transition(/(?!)/);
  JsPuncTransition.prototype.constructor = JsPuncTransition;
  JsPuncTransition.prototype.computeNextContext = function (prior, match) {
    return (prior & ~JS_FOLLOWING_SLASH_ALL) | (isRegexPreceder(match[0])
      ? JS_FOLLOWING_SLASH_REGEX : JS_FOLLOWING_SLASH_DIV_OP);
  };

  /**
   * A transition that consumes some content without changing state.
   * @param {RegExp} regex
   * @constructor
   */
  function TransitionToSelf(regex) {
    Transition.call(this, regex);
  }
  TransitionToSelf.prototype = new Transition(/(?!)/);
  TransitionToSelf.prototype.constructor = TransitionToSelf;
  TransitionToSelf.prototype.computeNextContext = function (prior, match) {
    return prior;
  };


  /** Consumes the entire content without change if nothing else matched. */
  var TRANSITION_TO_SELF = new TransitionToSelf(/$/);
  // Matching at the end is lowest possible precedence.

  var URI_PART_TRANSITION = new Transition(/[?#]|$/);
  URI_PART_TRANSITION.computeNextContext = function (prior, match) {
    var uriPart = uriPartOf(prior);
    if (uriPart === URI_PART_START) {
      uriPart = URI_PART_PRE_QUERY;
    }
    if (uriPart !== URI_PART_FRAGMENT) {
      var m0 = match[0];
      if ("?" === m0 && uriPart !== URI_PART_UNKNOWN) {
        uriPart = URI_PART_QUERY;
      } else if ("#" === m0) {
        uriPart = URI_PART_FRAGMENT;
      }
    }
    return (prior & ~URI_PART_ALL) | uriPart;
  };

  /**
   * Matches the end of a special tag like {@code script}.
   * @param {string} tagName
   * @constructor
   */
  function EndTagTransition(tagName) {
    Transition.call(this, new RegExp("</" + tagName + "\\b", 'i'));
  }
  EndTagTransition.prototype = new Transition(/(?!)/);
  EndTagTransition.prototype.constructor = EndTagTransition;
  EndTagTransition.prototype.isApplicableTo = function (prior, match) {
    return attrTypeOf(prior) === ATTR_TYPE_NONE;
  };
  EndTagTransition.prototype.computeNextContext = function (prior, match) {
    return STATE_HTML_TAG | ELEMENT_TYPE_NORMAL;
  };
  // TODO: This transitions to an HTML_TAG state which can accept attributes.
  // So we allow nonsensical constructs like </br foo="bar">.
  // Add another HTML_END_TAG state that just accepts space and >.


  /**
   * @param {RegExp} regex
   * @constructor
   */
  function RcdataEndTagTransition(regex) {
    Transition.call(this, regex);
  }
  RcdataEndTagTransition.prototype = new Transition(/(?!)/);
  RcdataEndTagTransition.prototype.constructor = RcdataEndTagTransition;
  RcdataEndTagTransition.prototype.isApplicableTo = function (prior, match) {
    var tagName = match[1].toUpperCase();
    switch (elementTypeOf(prior)) {
    case ELEMENT_TYPE_TEXTAREA: return tagName === 'TEXTAREA';
    case ELEMENT_TYPE_TITLE: return tagName === 'TITLE';
    case ELEMENT_TYPE_LISTING: return tagName === 'LISTING';
    case ELEMENT_TYPE_XMP: return tagName === 'XMP';
    }
    return false;
  };
  RcdataEndTagTransition.prototype.computeNextContext = function (prior, match) {
    return STATE_HTML_TAG | ELEMENT_TYPE_NORMAL;
  };

  /**
   * Matches the beginning of a CSS URI with the delimiter, if any, in group 1.
   * @param {RegExp} regex
   * @constructor
   */
  function CssUriTransition(regex) {
    Transition.call(this, regex);
  }
  CssUriTransition.prototype = new Transition(/(?!)/);
  CssUriTransition.prototype.constructor = CssUriTransition;
  CssUriTransition.prototype.computeNextContext = function (prior, match) {
    var delim = match[1];
    var state;
    if ('"' === delim) {
      state = STATE_CSS_DQ_URI;
    } else if ("'" === delim) {
      state = STATE_CSS_SQ_URI;
    } else {
      state = STATE_CSS_URI;
    }
    return (prior & ~(STATE_ALL | URI_PART_ALL)) | state | URI_PART_START;
  };

  /**
   * Matches a portion of JavaScript that can precede a division operator.
   * @param {RegExp} regex
   * @constructor
   */
  function DivPreceder(regex) {
    Transition.call(this, regex);
  }
  DivPreceder.prototype = new Transition(/(?!)/);
  DivPreceder.prototype.constructor = DivPreceder;
  DivPreceder.prototype.computeNextContext = function (prior, match) {
    return (prior & ~(STATE_ALL | JS_FOLLOWING_SLASH_ALL)) | STATE_JS | JS_FOLLOWING_SLASH_DIV_OP;
  };

  /** Characters that break a line in JavaScript source suitable for use in a regex charset. */
  var JS_LINEBREAKS = "\r\n\u2028\u2029";

  /**
   * For each state, a group of rules for consuming raw text and how that affects the document
   * context.
   * The rules each have an associated pattern, and the rule whose pattern matches earliest in the
   * text wins.
   */
  var TRANSITIONS = [];
  TRANSITIONS[STATE_HTML_PCDATA] = [
    new TransitionToSelf(/^[^<]+/),
    new ToTransition(/<!--/, STATE_HTML_COMMENT),
    new ToTagTransition(/<script(?=[\s>\/]|$)/i, ELEMENT_TYPE_SCRIPT),
    new ToTagTransition(/<style(?=[\s>\/]|$)/i, ELEMENT_TYPE_STYLE),
    new ToTagTransition(/<textarea(?=[\s>\/]|$)/i, ELEMENT_TYPE_TEXTAREA),
    new ToTagTransition(/<title(?=[\s>\/]|$)/i, ELEMENT_TYPE_TITLE),
    new ToTagTransition(/<xmp(?=[\s>\/]|$)/i, ELEMENT_TYPE_XMP),
    new ToTransition(/<\/?/, STATE_HTML_BEFORE_TAG_NAME)];
  TRANSITIONS[STATE_HTML_BEFORE_TAG_NAME] = [
    new ToTransition(/^[a-zA-Z]+/, STATE_HTML_TAG_NAME),
    new ToTransition(/^(?=[^a-zA-Z])/, STATE_HTML_PCDATA)];
  TRANSITIONS[STATE_HTML_TAG_NAME] = [
    new TransitionToSelf(/^[a-zA-Z0-9:\-]*(?:[a-zA-Z0-9]|$)/),
    new ToTagTransition(/^(?=[\/\s>])/, ELEMENT_TYPE_NORMAL)];
  TRANSITIONS[STATE_HTML_TAG] = [
    // Allows {@code data-foo} and other dashed attribute names, but intentionally disallows
    // "--" as an attribute name so that a tag ending after a value-less attribute named "--"
    // cannot be confused with a HTML comment end ("-->").
    new TransitionToAttrName(/^\s*([a-zA-Z][\w\-]*)/),
    new TagDoneTransition(/^\s*\/?>/),
    new TransitionToSelf(/^\s+$/)];
  TRANSITIONS[STATE_HTML_ATTRIBUTE_NAME] = [
    new TransitionToState(/^\s*=/, STATE_HTML_BEFORE_ATTRIBUTE_VALUE),
    // For a value-less attribute, make an epsilon transition back to the tag body context to
    // look for a tag end or another attribute name.
    new TransitionBackToTag(/^/)];
  TRANSITIONS[STATE_HTML_BEFORE_ATTRIBUTE_VALUE] = [
    new TransitionToAttrValue(/^\s*\"/, DELIM_TYPE_DOUBLE_QUOTE),
    new TransitionToAttrValue(/^\s*\'/, DELIM_TYPE_SINGLE_QUOTE),
    new TransitionToAttrValue(/^(?=[^\"\'\s>])/,  // Matches any unquoted value part.
                              DELIM_TYPE_SPACE_OR_TAG_END),
    // Epsilon transition back if there is an empty value followed by an obvious attribute
    // name or a tag end.
    // The first branch handles the blank value in:
    //    <input value=>
    // and the second handles the blank value in:
    //    <input value= name=foo>
    new TransitionBackToTag(/^(?=>|\s+[\w\-]+\s*=)/),
    new TransitionToSelf(/^\s+/)];
  TRANSITIONS[STATE_HTML_COMMENT] = [
    new ToTransition(/-->/, STATE_HTML_PCDATA),
    TRANSITION_TO_SELF];
  TRANSITIONS[STATE_HTML_NORMAL_ATTR_VALUE] = [
    TRANSITION_TO_SELF];
  // The CSS transitions below are based on http://www.w3.org/TR/css3-syntax/#lexical
  TRANSITIONS[STATE_CSS] = [
    new TransitionToState(/\/\*/, STATE_CSS_COMMENT),
    // TODO: Do we need to support non-standard but widely supported C++ style comments?
    new TransitionToState(/\"/, STATE_CSS_DQ_STRING),
    new TransitionToState(/'/, STATE_CSS_SQ_STRING),
    new CssUriTransition(/\burl\s*\(\s*([\'\"]?)/i),
    new EndTagTransition('style'),
    TRANSITION_TO_SELF];
  TRANSITIONS[STATE_CSS_COMMENT] = [
    new TransitionToState(/\*\//, STATE_CSS),
    new EndTagTransition('style'),
    TRANSITION_TO_SELF];
  TRANSITIONS[STATE_CSS_DQ_STRING] = [
    new TransitionToState(/\"/, STATE_CSS),
    new TransitionToSelf(/\\(?:\r\n?|[\n\f\"])/),  // Line continuation or escape.
    new ToTransition(/[\n\r\f]/, STATE_ERROR),
    new EndTagTransition('style'),  // TODO: Make this an error transition?
    TRANSITION_TO_SELF];
  TRANSITIONS[STATE_CSS_SQ_STRING] = [
    new TransitionToState(/'/, STATE_CSS),
    new TransitionToSelf(/\\(?:\r\n?|[\n\f'])/),  // Line continuation or escape.
    new ToTransition(/[\n\r\f]/, STATE_ERROR),
    new EndTagTransition('style'),  // TODO: Make this an error transition?
    TRANSITION_TO_SELF];
  TRANSITIONS[STATE_CSS_URI] = [
    new TransitionToState(/[\\)\s]/, STATE_CSS),
    URI_PART_TRANSITION,
    new TransitionToState(/[\"']/, STATE_ERROR),
    new EndTagTransition('style')];
  TRANSITIONS[STATE_CSS_SQ_URI] = [
    new TransitionToState(/'/, STATE_CSS),
    URI_PART_TRANSITION,
    new TransitionToSelf(/\\(?:\r\n?|[\n\f'])/),  // Line continuation or escape.
    new ToTransition(/[\n\r\f]/, STATE_ERROR),
    new EndTagTransition('style')];
  TRANSITIONS[STATE_CSS_DQ_URI] = [
    new TransitionToState(/\"/, STATE_CSS),
    URI_PART_TRANSITION,
    new TransitionToSelf(/\\(?:\r\n?|[\n\f\"])/),  // Line continuation or escape.
    new ToTransition(/[\n\r\f]/, STATE_ERROR),
    new EndTagTransition('style')];
  TRANSITIONS[STATE_JS] = [
    new TransitionToState(/\/\*/, STATE_JS_BLOCK_COMMENT),
    new TransitionToState(/\/\//, STATE_JS_LINE_COMMENT),
    new TransitionToJsString(/\"/, STATE_JS_DQ_STRING),
    new TransitionToJsString(/'/, STATE_JS_SQ_STRING),
    new SlashTransition(/\//),
    // Shuffle words, punctuation (besides /), and numbers off to an analyzer which does a
    // quick and dirty check to update isRegexPreceder.
    new JsPuncTransition(/(?:[^<\/\"'\s\\]|<(?!\/script))+/i),
    new TransitionToSelf(/\s+/),  // Space
    new EndTagTransition('script')];
  TRANSITIONS[STATE_JS_BLOCK_COMMENT] = [
    new TransitionToState(/\*\//, STATE_JS),
    new EndTagTransition('script'),
    TRANSITION_TO_SELF];
  // Line continuations are not allowed in line comments.
  TRANSITIONS[STATE_JS_LINE_COMMENT] = [
    new TransitionToState(new RegExp("[" + JS_LINEBREAKS + "]"), STATE_JS),
    new EndTagTransition('script'),
    TRANSITION_TO_SELF];
  TRANSITIONS[STATE_JS_DQ_STRING] = [
    new DivPreceder(/\"/),
    new EndTagTransition('script'),
    new TransitionToSelf(new RegExp(
              "^(?:" +                              // Case-insensitively, from start of string
                "[^\"\\\\" + JS_LINEBREAKS + "<]" + // match any chars except newlines, quotes, \s;
                "|\\\\(?:" +                        // or backslash followed by a
                  "\\r\\n?" +                       // line continuation
                  "|[^\\r<]" +                      // or an escape
                  "|<(?!/script)" +                 // or less-than that doesn't close the script.
                ")" +
                "|<(?!/script)" +
              ")+", 'i'))];
  TRANSITIONS[STATE_JS_SQ_STRING] = [
    new DivPreceder(/'/),
    new EndTagTransition('script'),
    new TransitionToSelf(new RegExp(
              "^(?:" +                              // Case-insensitively, from start of string
                "[^'\\\\" + JS_LINEBREAKS + "<]" +  // match any chars except newlines, quotes, \s;
                "|\\\\(?:" +                        // or a backslash followed by a
                  "\\r\\n?" +                       // line continuation
                  "|[^\\r<]" +                      // or an escape;
                  "|<(?!/script)" +                 // or less-than that doesn't close the script.
                ")" +
                "|<(?!/script)" +
              ")+", 'i'))];
  TRANSITIONS[STATE_JS_REGEX] = [
    new DivPreceder(/\//),
    new EndTagTransition('script'),
    new TransitionToSelf(new RegExp(
              "^(?:" +
                // We have to handle [...] style character sets specially since in /[/]/, the
                // second solidus doesn't end the regular expression.
                "[^\\[\\\\/<" + JS_LINEBREAKS + "]" +      // A non-charset, non-escape token;
                "|\\\\[^" + JS_LINEBREAKS + "]" +          // an escape;
                "|\\\\?<(?!/script)" +
                "|\\[" +                                   // or a character set containing
                  "(?:[^\\]\\\\<" + JS_LINEBREAKS + "]" +  // a normal character,
                  "|\\\\(?:[^" + JS_LINEBREAKS + "]))*" +  // or an escape;
                  "|\\\\?<(?!/script)" +                   // or an angle bracket possibly escaped.
                "\\]" +
              ")+", 'i'))];
      // TODO: Do we need to recognize URI attributes that start with javascript:, data:text/html,
      // etc. and transition to JS instead with a second layer of percent decoding triggered by
      // a protocol in (DATA, JAVASCRIPT, NONE) added to Context?
  TRANSITIONS[STATE_URI] = [URI_PART_TRANSITION];
  TRANSITIONS[STATE_HTML_RCDATA] = [
    new RcdataEndTagTransition(/<\/(\w+)\b/),
    TRANSITION_TO_SELF];


  /** @constructor */
  function RawTextContextUpdater() {
    /** The amount of rawText consumed. */
    this.numCharsConsumed = 0;
    /** The context to which we transition. */
    this.next = 0;
  }

  /**
   * Consume a portion of text and compute the next context.
   * Output is stored in member variables.
   * @param {string} text Non empty.
   */
  RawTextContextUpdater.prototype.processNextToken = function (text, context) {
    if (isErrorContext(context)) {  // The ERROR state is infectious.
      this.numCharsConsumed = text.length;
      this.next = context;
      return;
    }

    // Find the transition whose pattern matches earliest in the raw text.
    var earliestStart = 0x7fffffff;
    var earliestEnd = -1;
    var earliestTransition = null;
    var earliestMatch = null;
    var stateTransitions = TRANSITIONS[stateOf(context)];
    var transition, match, start, end;
    var i, n = stateTransitions.length;
    for (i = 0; i < n; ++i) {
      transition = stateTransitions[i];
      match = text.match(transition.pattern);
      if (match) {
        start = match.index;
        if (start < earliestStart) {
          end = start + match[0].length;
          if (transition.isApplicableTo(context, match)) {
            earliestStart = start;
            earliestEnd = end;
            earliestTransition = transition;
            earliestMatch = match;
          }
        }
      }
    }

    if (earliestTransition !== null) {
      this.next = earliestTransition.computeNextContext(context, earliestMatch);
      this.numCharsConsumed = earliestEnd;
    } else {
      this.next = STATE_ERROR;
      this.numCharsConsumed = text.length;
    }
    if (this.numCharsConsumed === 0 && stateOf(this.next) === stateOf(context)) {
      throw new Error("Infinite loop at `" + text + "` / " +
          // Avoid an explicit dependency on contentToString.  If we're debugging uncompiled,
          // then we get the benefit of it, but the compiler can treat it as dead code.
          (global['contextToString'] ? global['contextToString'](context) : context));
    }
  };


  /**
   * @param {string} rawText A chunk of HTML/CSS/JS.
   * @param {number} context The context before rawText.
   * @return The context after rawText.
   */
  function processRawText(rawText, context) {
    while (rawText) {
      // If we are in an attribute value, then decode rawText (except for the delimiter) up to the
      // next occurrence of delimiter.

      // The end of the section to decode.  Either before a delimiter or > symbol that closes an
      // attribute, at the end of the rawText, or -1 if no decoding needs to happen.
      var attrValueEnd = findEndOfAttributeValue(rawText, delimTypeOf(context));
      if (attrValueEnd === -1) {
        // Outside an attribute value.  No need to decode.
        var cu = new RawTextContextUpdater();
        cu.processNextToken(rawText, context);
        rawText = rawText.substring(cu.numCharsConsumed);
        context = cu.next;

      } else {
        // Inside an attribute value.  Find the end and decode up to it.

        // All of the languages we deal with (HTML, CSS, and JS) use quotes as delimiters.
        // When one language is embedded in the other, we need to decode delimiters before trying
        // to parse the content in the embedded language.
        //
        // For example, in
        //       <a onclick="alert(&quot;Hello {$world}&quot;)">
        // the decoded value of the event handler is
        //       alert("Hello {$world}")
        // so to determine the appropriate escaping convention we decode the attribute value
        // before delegating to processNextToken.
        //
        // We could take the cross-product of two languages to avoid decoding but that leads to
        // either an explosion in the number of states, or the amount of lookahead required.
        var rawTextLen = rawText.length;

        // The end of the attribute value.  At attrValueEnd, or attrValueend + 1 if a delimiter
        // needs to be consumed.
        var attrEnd = attrValueEnd < rawTextLen ?
            attrValueEnd + DELIM_TEXT[delimTypeOf(context)].length : -1;

        // Decode so that the JavaScript rules work on attribute values like
        //     <a onclick='alert(&quot;{$msg}!&quot;)'>
        // If we've already processed the tokens "<a", " onclick='" to get into the
        // single quoted JS attribute context, then we do three things:
        //   (1) This class will decode "&quot;" to "\"" and work below to go from State.JS to
        //       State.JS_DQ_STRING.
        //   (2) Then the caller checks {$msg} and realizes that $msg is part of a JS string.
        //   (3) Then, the above will identify the "'" as the end, and so we reach here with:
        //       r a w T e x t = " ! & q u o t ; ) ' > "
        //                                         ^ ^
        //                              attrValueEnd attrEnd

        // We use this example more in the comments below.

        var attrValueTail = unescapeHtml(rawText.substring(0, attrValueEnd));
        // attrValueTail is "!\")" in the example above.

        // Recurse on the decoded value.
        var attrCu = new RawTextContextUpdater();
        while (attrValueTail.length !== 0) {
          attrCu.processNextToken(attrValueTail, context);
          attrValueTail = attrValueTail.substring(attrCu.numCharsConsumed);
          context = attrCu.next;
        }

        // TODO: Maybe check that context is legal to leave an attribute in.  Throw if the attribute
        // ends inside a quoted string.

        if (attrEnd !== -1) {
          rawText = rawText.substring(attrEnd);
          // rawText is now ">" from the example above.

          // When an attribute ends, we're back in the tag.
          context = STATE_HTML_TAG | elementTypeOf(context);
        } else {
          // Whole tail is part of an unterminated attribute.
          if (attrValueEnd !== rawText.length) {
            throw new Error('Illegal State');
          }
          rawText = "";
        }
      }
    }
    return context;
  }


  // TODO: If we need to deal with untrusted templates, then we need to make sure that tokens like
  // <!--, </script>, etc. are never split with empty strings.
  // We could do this by walking all possible paths through each template (both branches for ifs,
  // each case for switches, and the 0,1, and 2+ iteration case for loops).
  // For each template, tokenize the original's rawText nodes using RawTextContextUpdater and then
  // tokenize one single rawText node made by concatenating all rawText.
  // If one contains a sensitive token, e.g. <!--/ and the other doesn't, then we have a potential
  // splitting attack.
  // That and disallow unquoted attributes, and be paranoid about prints especially in the TAG_NAME
  // productions.

  return processRawText;
}());