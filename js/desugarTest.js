function assertDesugarsToSelf(js) {
  assertEquals(js, desugar(js));
}

function testSimpleJs() {
  assertDesugarsToSelf('');
  assertDesugarsToSelf('42');
  assertDesugarsToSelf('-1.0');
  assertDesugarsToSelf('-.333');
  assertDesugarsToSelf('1e6');
  assertDesugarsToSelf('1e-6');
  assertDesugarsToSelf('"foo bar"');
  assertDesugarsToSelf("'foo bar'");
  assertDesugarsToSelf(
      "for (var i = 0; i < 10; ++i) { alert('I love to \\'count\\''); }");
  assertDesugarsToSelf("foo");
}

function testBackquotesInStringsAndRegexs() {
  assertDesugarsToSelf("'`'");
  assertDesugarsToSelf("'\\`'");
  assertDesugarsToSelf('"`"');
  assertDesugarsToSelf('"\\`"');
  assertDesugarsToSelf('/`/');
  assertDesugarsToSelf('1, /`/');
  assertDesugarsToSelf('1, /[`]/');
  assertDesugarsToSelf('n /= /`/i');
}

function testEmptyQuasi() {
  assertEquals(
      [
        'var $$callSite0 = Object.freeze({',
        '    raw: Object.freeze([""]),',
        '    cooked: Object.freeze([""])',
        '  });',
        'var x = String.interp($$callSite0)'].join('\n'),
      desugar('var x = ``'));
  assertEquals(
      [
        'var $$callSite0 = Object.freeze({',
        '    raw: Object.freeze([""]),',
        '    cooked: Object.freeze([""])',
        '  });',
        'foo($$callSite0)'].join('\n'),
      desugar('foo``'));
}

function testSimpleQuasi() {
  assertEquals(
      [
        'var $$callSite0 = Object.freeze({',
        '    raw: Object.freeze(["foo"]),',
        '    cooked: Object.freeze(["foo"])',
        '  });',
        'foo($$callSite0)'
        ].join('\n'),
    desugar('foo`foo`'));
}

function testQuasiOneInterp() {
  var golden = [
      'var $$callSite0 = Object.freeze({',
      '    raw: Object.freeze(["foo "," bar"]),',
      '    cooked: Object.freeze(["foo "," bar"])',
      '  });',
      'foo($$callSite0, (x))'].join('\n');
  assertEquals(golden, desugar('foo`foo ${x} bar`'));
  assertEquals(golden, desugar('foo`foo $x bar`'));
}

function testQuasiEscape() {
  assertEquals(
      [
        'var $$callSite0 = Object.freeze({',
        '    raw: Object.freeze(["foo ","\\\\nbar"]),',
        '    cooked: Object.freeze(["foo ","\\nbar"])',
        '  });',
        'foo($$callSite0, (x))'
      ].join('\n'),
      desugar('foo`foo ${x}\\nbar`')
      // There are multiple legal ways to encode a quasi quote.
      .replace('\\u000a', '\\n'));
}

function testBracketsInQuasiInterp() {
  assertEquals(
      [
        'var $$callSite0 = Object.freeze({',
        '    raw: Object.freeze(["foo "," bar"]),',
        '    cooked: Object.freeze(["foo "," bar"])',
        '  });',
        'foo($$callSite0, (f({a: b})))'
      ].join('\n'),
      desugar('foo`foo ${f({a: b})} bar`'));
}

function testStringInQuasiInterp() {
  assertEquals(
      [
        'var $$callSite0 = Object.freeze({',
        '    raw: Object.freeze(["foo "," bar"]),',
        '    cooked: Object.freeze(["foo "," bar"])',
        '  });',
        'foo($$callSite0, (f("`")))'
      ].join('\n'),
      desugar('foo`foo ${f("`")} bar`'));
}

function testLineTerminatorNormalization() {
  assertEquals(
      [
        'var $$callSite0 = Object.freeze({',
        '    raw: Object.freeze(["-\\\\\\n-\\n-"]),',
        '    cooked: Object.freeze(["--\\n-"])',
        '  });',
        'foo($$callSite0)'
      ].join('\n'),
      desugar('foo`-\\\r\n-\r\n-`'));
}

function testNestedQuasi() {
  assertEquals(
      [
        'var $$callSite1 = Object.freeze({',
        '    raw: Object.freeze(["-","-"]),',
        '    cooked: Object.freeze(["-","-"])',
        '  });',
        'var $$callSite0 = Object.freeze({',
        '    raw: Object.freeze(["foo "," bar"]),',
        '    cooked: Object.freeze(["foo "," bar"])',
        '  });',
        'foo($$callSite0, (f(bar($$callSite1, (x)))))'
      ].join('\n'),
      desugar('foo`foo ${f(bar`-${x}-`)} bar`'));
}

function testAssignableQuasiHole() {
  SLOTTED = true;
  try {
    assertEquals(
        [
          'var $$callSite0 = Object.freeze({',
          '    raw: Object.freeze(["foo "," bar"]),',
          '    cooked: Object.freeze(["foo "," bar"])',
          '  });',
          'foo($$callSite0, ' +
            '(function(){' +
            'return arguments.length?(x.y)=arguments[0]:(x.y);' +
            '}))'].join('\n'),
        desugar('foo`foo ${=x.y} bar`'));
  } finally {
    SLOTTED = false;
  }
}
