var ESCAPE_SEQUENCE = new RegExp(
    '\\\\(?:' +  // $\
      'u([0-9A-Fa-f]{4})' +  // Unicode escape with hex in group 1
      '|x([0-9A-Fa-f]{2})' +  // Hex pair escape with hex in group 2
      '|([0-3][0-7]{1,2}|[4-7][0-7]?)' + // Octal escape with octal in group 3
      '|(\r\n?|[\u2028\u2029\n])' +  // Line continuation in group 4
      '|(.)' +  // Single characer escape in group 5
    ')',
    'g');

function expandEscapeSequences(raw) {
  return raw.replace(
      ESCAPE_SEQUENCE,
      function (_, hex, hex2, octal, lineCont, single) {
        hex = hex || hex2;
        if (hex) { return parseInt(hex, 16); }
        if (octal) { return parseInt(octal, 8); }
        if (lineCont) { return ''; }
        switch (single) {
          case 'n': return '\n';
          case 'r': return '\r';
          case 't': return '\t';
          case 'v': return '\x08';
          case 'f': return '\f';
          case 'b': return '\b';
          default: return single;
        }
      });
}
