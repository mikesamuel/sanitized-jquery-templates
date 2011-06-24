/**
 * @fileoverview
 * A utility for converting JavaScript with syntactic sugar to one
 * without.
 */

// Requires contextUpdate.js for its regex lexical prediction function.

var SLOTTED = false;

var JS_TOKEN_RE = new RegExp("^(?:" + [
      // Space
      "[\\s\ufeff]+",
      // A block comment
      "/\\*(?:[^*]|\\*+[^*/])*\\*+/",
      // A line comment
      "//.*",
      // A string
      "\'(?:[^\\\\\'\\r\\n\\u2028\\u2029]|\\\\(?:\\r\\n|[\\s\\S]))*\'",
      "\"(?:[^\\\\\"\\r\\n\\u2028\\u2029]|\\\\(?:\\r\\n|[\\s\\S]))*\"",
      // Number
      // (before punctuation to prevent breaking around decimal point)
      "0x[0-9a-f]+",
      "(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:e[+-]?\\d+)?",
      // IdentifierName (ignoring non-Latin letters)
      "[_$a-z][\\w$]*",
      // Punctuation
      [ ".", "[", "]", "(", ")", "++", "--", "!", "~", "+", "-",
        "*", "%", "+", "-", "<<", ">>", ">>>", "<", "<=", ">", ">=",
        "==", "!=", "===", "!==", "&", "^", "|", "&&", "||", "?",
        ":", "=", "+=", "-=", "*=", "%=", "<<=", ">>=", ">>>=",
        "&=", "^=", "|=", "&=", ",", "{", "}", ";", "/", "/=" ]
        // Sort longest first so that we can join on | to get a
        // regular expression that matches the longest punctuation token
        // possible.
        .sort(function (a, b) { return b.length - a.length; })
        // Escape for RegExp syntax.
        .map(function (x) { return x.replace(/./g, "\\$&"); })
        .join("|")]
      .join("|") + ")",
      "i");

var JS_REGEXP_RE = new RegExp(
    '^/(?:' +
      // Any char except the start of an escape sequence or charset or an end
      // delimiter,
      '[^/\\\\[]' +
      // or an escape sequence,
      '|\\\\[^\\r\\n\\u2028\\u2029\\/]' +
      // or a character set
      '|\\[(?:[^\\]\\\\\\r\\n\\u2028\\u2029]|\\\\.)*\\]' +
      // one (since // is not a regex) or more times, ended by a slash, and
      // with an optional flag set.
    ')+/[gim]*');


function tokenizeNoQuasis(source, allowRegexp) {
  var match = source.match(
      allowRegexp && /^\/[^*/]/.test(source)
      ? JS_REGEXP_RE
      : JS_TOKEN_RE);
  if (!match) {
    throw new Error("No token at start of " + source.substring(0, 20));
  }
  return match[0];
}


/**
 * Desugars JavaScript code converting JavaScript + quasi syntax to regular
 * JavaScript.
 * This does not deal with non-Latin letters or digits in identifiers.
 */
function desugar(sugaryJs) {

  var inLiteralPortion = false;

  var closesInnermostSubstitution = [];

  var lastToken = null;

  function tokenize(source) {
    var tokenLen,
        tokenIsLiteralPortion = false;

    for (var i = 0, n = source.length; i < n; ++i) {
      var ch = source.charAt(i);

      if (inLiteralPortion && ch === '`') {
        inLiteralPortion = false;
        tokenIsLiteralPortion = true;
        tokenLen = i + 1;
        break;

      } else if (inLiteralPortion && ch == '\\') {
        if (++i === n) { throw Error(); }

      } else if (inLiteralPortion && ch === '$'
                 && source.charAt(i + 1) === '{') {
        if (i) {  // Emit the literal portion parsed thus far.
          tokenLen = i;
          tokenIsLiteralPortion = true;
          break;
        }
        inLiteralPortion = false;
        closesInnermostSubstitution.push(1);
        tokenLen = i + 2;
        break;

      } else if (inLiteralPortion) {
        // Let for-loop increment i.

      } else if (ch === '{') {
        closesInnermostSubstitution.push(0);

      } else if (ch === '}') {
        inLiteralPortion = !!closesInnermostSubstitution.pop();
        tokenLen = i + 1;
        break;

      } else if (ch === '`') {
        inLiteralPortion = true;

      } else {
        tokenLen = tokenizeNoQuasis(
            source,
            !lastToken
            || (/^\/|`$/.test(lastToken) ? /^\/=?$/.test(lastToken)
                : isRegexPreceder(lastToken))
            ).length;
        break;
      }
    }
    if (!tokenLen) { throw Error('No valid token at the start of ' + source); }
    var token = source.substring(0, tokenLen);

    // Keep track of the last non-comment, non-whitespace token so we can
    // use it to determine when a slash starts a regex literal.
    if (!/^(?:\s|\/[*/])/.test(token)) {
      lastToken = token;
    }

    return [token, source.substring(tokenLen), tokenIsLiteralPortion];
  }


  // Given an input like
  //   var x = `foo$bar`, y = f`baz${boo.far}faz`;
  // produce an AST like
  //   ['var', 'x', '=',
  //     ['foo',
  //       ['bar'],
  //      ''],
  //     ',', 'y', '=', 'f',
  //     ['baz',
  //       ['boo', '.', 'far'],
  //      'faz'],
  //     ';']
  // where leaf strings in arrays at even levels are
  // expression tokens and leaf string in arrays at odd
  // levels are raw literal portions.

  var root = [], top = root;
  var stack = [root];

  var toLex = sugaryJs;
  while (toLex) {
    var tokenizeResult = tokenize(toLex);
    var token = tokenizeResult[0];
    toLex = tokenizeResult[1];
    var isLiteralPortion = tokenizeResult[2];

    if (isLiteralPortion) {
      var ends = !inLiteralPortion;
      if (ends) {
        if (token.charAt(token.length - 1) !== '`') { throw new Error; }
        token = token.substring(0, token.length - 1);
      }
      var starts = token.charAt(0) === '`';
      if (starts) {
        var quasiNode = [];
        top.push(quasiNode);
        stack.push(top = quasiNode);
        token = token.substring(1);
      } else {
        top = stack[--stack.length - 1];
      }
      if ((stack.length & 1)) {
        throw new Error;
      }

      // "foo $bar baz" -> ["foo ", "bar", " baz"];
      var lastSplit = 0, tokenlen = token.length;
      for (var i = 0; i < tokenlen;) {
        var ch = token.charAt(i);
        if (ch === '\\') {
          i += 2;
        } else if (ch === '$') {
          var match = token.substring(i + 1).match(/^[a-z_$][\w$]*/i);
          if (match) {
            // Emit the literal portion between the last abbreviated $foo
            // style interpolation and this one, and an embedded parse tree
            // node like ["${", identifier, "}"].
            top.push(token.substring(lastSplit, i), ["${", match[0], "}"]);
            lastSplit = i += match[0].length + 1;
          } else {
            ++i;
          }
        } else {
          ++i;
        }
      }
      top.push(token.substring(lastSplit));

      if (ends) {
        top = stack[--stack.length - 1];
      }
    } else {
      if (!(stack.length & 1)) {
        var substitutionNode = [];
        top.push(substitutionNode);
        stack.push(top = substitutionNode);
      }
      top.push(token);
    }
  }

  // Walk the tree to desugar in-situ, a function call, and to create a hoisted
  // declaration.
  var hoistedDeclarations = [];
  // Declarations that should appear at the top of the module.
  var moduleContents = [];  // An array of output tokens.
  var callSiteIdCounter = -1;
  var priorInModule = '';

  function walkParseTree(node, isLiteralPortion) {
    var literalPortions, callSiteId;
    if (isLiteralPortion) {
      literalPortions = [];
      callSiteId = '$$callSite' + (++callSiteIdCounter);
      if (!/^[$a-z+]/i.test(priorInModule)) {
        if (moduleContents.length
            && /\w$/.test(moduleContents[moduleContents.length - 1])) {
          moduleContents.push(" ");
        }
        moduleContents.push("String", ".", "interp");
      }
      moduleContents.push("(", callSiteId);
    }
    for (var i = 0, n = node.length; i < n; ++i) {
      var child = node[i];
      if ('string' === typeof child) {
        if (isLiteralPortion) {
          // Normalize newlines per
          // http://wiki.ecmascript.org/doku.php?id=proposals:line_terminator_normalization
          literalPortions.push(child.replace(/\r\n/g, "\n"));
          priorInModule = '`';
        } else {
          // Make sure that for substitutions, the token sequence
          //   ${ x + y }
          // is emitted as
          //   ( x + y )
          if ('${' === node[0]) {
            if (i === 0) {
              if (SLOTTED) {
                moduleContents.push(
                    "(", "function", "(", ")", "{", "return", " ");
                if (node[1] === "=") {
                  moduleContents.push("arguments", ".", "length", "?", "(");
                  priorInModule = "(";
                  walkParseTree(node.slice(2, node.length - 1), false);
                  moduleContents.push(
                      ")", "=", "arguments", "[", "0", "]", ":", "(");
                }
                ++i;
                continue;
              } else {
                child = "(";
              }
            } else if (i === n - 1 && child === '}') {
              if (SLOTTED) {
                moduleContents.push(")", ";", "}");
              }
              child = ")";
            }
          }
          moduleContents.push(child);
          if (!/^(?:\s|\/[/*])/.test(child)) {
            priorInModule = child;
          }
        }
      } else {
        if (isLiteralPortion) {
          // Separate substitution expressions in argument list.
          // The call site id is always the first actual, so we
          // can reliably assume that a comma followed by an expression
          // is valid on moduleContents.
          moduleContents.push(",", " ");
        }
        walkParseTree(child, !isLiteralPortion);
      }
    }
    if (isLiteralPortion) {
      moduleContents.push(")");
      hoistedDeclarations.push(
          "var " + callSiteId
          + " = Object.freeze({\n    raw: Object.freeze("
          + JSON.stringify(literalPortions)
          + "),\n    cooked: Object.freeze("
          + JSON.stringify(literalPortions.map(expandEscapeSequences))
          + ")\n  });\n");
    }
  }
  walkParseTree(root, false);

  // Don't hoist the declarations above the directive prologue.
  var moduleDeclarationStart = 0;
  for (var i = 0; i < moduleContents.length; ++i) {
    // If token is not a comment, whitespace, string, or semi then exit.
    if (!/^(?:\/[/*]|\s|["';])/.test(moduleContents[i])) {
      break;
    }
    // The module declarations start after the last semicolon ending the
    // directive prologue.
    if (moduleContents[i] === ';') {
      moduleDeclarationStart = i + 1;
    }
  }

  return moduleContents.slice(0, moduleDeclarationStart).join('')
      + (moduleDeclarationStart ? '\n' : '')
      + hoistedDeclarations.join('')
      + moduleContents.slice(moduleDeclarationStart).join('');
}

String.interp = function (callSiteId, sve) {
  var rawStrs = callSiteId['cooked'];
  var out = [];
  for (var i = 0, k = -1, n = rawStrs.length; i < n;) {
    out[++k] = rawStrs[i];
    out[++k] = arguments[++i];
  }
  return out.join('');
};
