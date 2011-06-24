function invokeQuasiHandler(quasiHandler, literalParts, values) {
  return quasiHandler.apply(
      null,
      [{
         raw: literalParts,
         expanded: literalParts.map(expandEscapeSequences)
       }].concat(values));
}


function testSafeHtmlGoodInputs() {
  var template = [
      '<a href="', '?q=', '" onclick=alert(', ') style="color: ', '">', '</a>'];
  var values = [
      'http://www.google.com/search',
      'Hello World',
      'Hello World',
      'red',
      'Hello & Goodbye'];
  assertEquals(
      '<a href="http://www.google.com/search?q=Hello%20World"'
      + ' onclick=alert(&#39;Hello&#32;World&#39;)'
      + ' style="color: red">Hello &amp; Goodbye</a>',
      invokeQuasiHandler(safehtml, template, values).toString());
}


function testSafeHtmlBadInputs() {
  var template = [
      '<a href="', '?q=', '" onclick=alert(', ') style="color: ', '">', '</a>'];
  var values = [
      'javascript:alert(1337)//',
      '"><script>alert(13)</script>',
      '"Hello World',
      'expression(alert(1337))',
      '<script>alert(1337)</script>'];
  assertEquals(
      '<a href="#zSafehtmlz?q=%22%3E%3Cscript%3Ealert%2813%29%3C%2Fscript%3E"'
      + ' onclick=alert(&#39;\\x22Hello&#32;World&#39;)'
      + ' style="color: zSafehtmlz">&lt;script&gt;alert(1337)&lt;/script&gt;</a>',
      invokeQuasiHandler(safehtml, template, values).toString());
}
