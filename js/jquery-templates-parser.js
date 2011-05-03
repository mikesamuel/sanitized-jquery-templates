//-*- mode: js2-mode; indent-tabs-mode: t; tab-width: 2; -*-

/**
 * The frontend of the JQuery template compiler
 * based on http://wiki.jqueryui.com/w/page/37898666/Template
 *
 * @author Mike Samuel <mikesamuel@gmail.com>
 */

/**
 * Guess, conservatively for well-formed templates, the set of
 * directives that require an end-marker.
 *
 * @param {string} templateText
 */
function guessBlockDirectives( templateText ) {
	var blockDirectives = {};
	// For each token like {{/foo}} put "foo" into the block directives map.
	templateText.replace(
			TOKEN,
			function ( tok ) {
				var match = tok.match( /^\{\{\/(=|[a-z][a-z0-9]*)[\s\S]*\}\}$/i );
				if ( match ) {
					blockDirectives[ match[ 1 ] ] = TRUTHY;
				}
			});
	return blockDirectives;
}

/**
 * Parse a template to a parse tree.
 * Parse trees come in two forms:
 * <ul>
 *   <li>{@code "string"} : a snippet of HTML text.</li>
 *   <li>{@code ["name", "content", ...]} where {@code "name"}
 *      is a directive name like {@code "if"} or the string {@code "="} for
 *      substitutions.  The content is the string after the name in the open
 *      marker, so for <code>{{if foo==bar}}Yes{{/if}}</code>, the content is
 *      {@code " foo==bar"}.  The "..." above is filled with child parse trees
 *      of the form described here.</li>
 * </ul>
 * <p>
 * For example, the parse tree for
 * <pre>
 * &lt;b&gt;{{if sayHello}}Hello{{else}}Goodbye{{/if}}&lt;/b&gt;, ${world}!
 * </pre>
 * is
 * <pre>
 * [
 *  "",               // Name of root is blank.
 *  "",               // Content of root is blank.
 *  "&lt;b&gt;",      // Zero-th child is a snippet of HTML.
 *  [                 // An embedded directive is an array.
 *   "if",            // Name comes first
 *   " sayHello",     // Content of {{if}}
 *   "Hello",         // A snippet of HTML.
 *   ["else", ""],    // {{else}} is an inline directive inside {{if}}.
 *   "Goodbye"
 *  ],                // End of the {{if ...}}...{{/if}}.
 *  "&lt;/b&gt;, ",   // Another snippet of HTML.
 *  ["=", "world"],   // A substitution.
 *  "!"
 * ]
 * </pre>
 *
 * @param {string} templateText The text to parse.
 * @param {Object.<number>} blockDirectives Maps directive names such as
 *     {@code "if"} to {link #TRUTHY} if they require/allow an end marker.
 * @return {Array.<string|Array>|string} A parse tree node.
 */
function parseTemplate( templateText, blockDirectives ) {
	// The root of the parse tree.
	var root = [ "", "" ],
			// A stack of nodes which have been entered but not yet exited.
			stack = [ root ],
			// The topmost element of the stack
			top = root;
	$.each(
			templateText.match( TOKEN ) || [],
			function ( _, token ) {
				var m = token.match( /^\{\{(\/?)(=|[a-z][a-z0-9]*)([\s\S]*)\}\}$/i );
				if ( m ) {  // A marker.
					// "/" in group 1 if a close.  Name in group 2.  Content in group 3.
					if ( m[ 1 ] ) {  // An end marker
						if ( DEBUG && top[ 0 ] !== m[ 2 ] ) {
							throw new Error( "Misplaced " + token + " in " + templateText );
						}
						top = stack[ --stack.length - 1 ];
					} else {  // A start marker.
						var node = [ m[ 2 ], m[ 3 ] ];
						if ( DEBUG && m[ 2 ] === "=" ) {
							try {
								// For some reason, on Safari,
								//     Function("(i + (j)")
								// fails with a SyntaxError as expected, but
								//     Function("return (i + (j)")
								// does not.
								// Filed as https://bugs.webkit.org/show_bug.cgi?id=59795
								Function( "(" + m[ 3 ] + ")" );
							} catch ( e1 ) {
								throw new Error( "Invalid template substitution: " + m[ 3 ] );
							}
						}
						top.push( node );
						if ( blockDirectives[ m[ 2 ] ] === TRUTHY ) {
							stack.push( top = node );
						}
					}
				} else if ( token.substring( 0, 2 ) === "${" ) {  // A substitution.
					top.push( [ "=", token.substring( 2, token.length - 1 ) ] );
					if ( DEBUG ) {
						var content = top[ top.length - 1 ][ 1 ];
						try {
							// See notes on {{=...}} sanity check above.
							Function( "(" + content + ")" );
						} catch ( e2 ) {
							throw new Error( "Invalid template substitution: " + content );
						}
					}
				} else {  // An HTML snippet.
					top.push( token );
				}
			});
	if ( DEBUG && stack.length > 1 ) {
		throw new Error(
				"Unclosed block directives "
				+ stack.slice( 1 ).map( function ( x ) { return x[ 0 ]; } ) + " in "
				+ templateText );
	}
	return root;
}


// Utilities for debugging parser plugins.

/**
 * Given a template parse tree, returns source text that would parse to that
 * parse tree.  This can be useful for debugging but not required.
 *
 * @param {Array.<string|Array>|string} parseTree as produced by
 *     {@link #parseTemplate}.
 * @param {Object.<Number>} opt_blockDirectives.
 */
function renderParseTree( parseTree, opt_blockDirectives ) {
	var buffer = [];
	( function render( _, parseTree ) {
		 if ( typeof parseTree === "string" ) {
			 buffer.push( parseTree );
		 } else {
			 var name = parseTree[ 0 ], n = parseTree.length;
			 buffer.push( "{{", name, parseTree[ 1 ], "}}" );
			 $.each( parseTree.slice( 2 ), render );
			 if ( n !== 2 || !opt_blockDirectives
					  || opt_blockDirectives[ name ] === TRUTHY ) {
				 buffer.push( "{{/", name, "}}" );
			 }
		 }
	 }( 2, parseTree ) );
	return buffer.join( "" );
}