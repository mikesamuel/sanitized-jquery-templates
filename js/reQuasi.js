// A quasi handler for building regular expressions.

function re(callSiteId) {
  var lp = callSiteId['raw'];
  var buffer = [];
  var n = lp.length - 1;
  var lastPart = lp[n];
  var flags = lastPart.match(/:([gim]+)$/);
  if (flags) {
    lastPart = lastPart.substring(
        0, lastPart.length - flags[0].length);
    flags = flags[1];
  }
  // TODO: maybe fake the 's' flag by rewriting '.'.
  var specials = /[^A-Za-z0-9\s]/g;

  var i = 0, k = -1;
  while (i < n) {
    buffer[++k] = lp[i++];
    var substitution = arguments[i];
    if (substitution instanceof RegExp) {
      var patternText = substitution.toString();
      substitution = patternText.substring(1, patternText.lastIndexOf('/'));
      // TODO: if substitution flags includes i and flags does not, then expand
      // all letters to character classes.
    } else {
      substitution = String(substitution).replace(specials, '\\$&');
    }
    buffer[++k] = substitution;
  }
  buffer[++k] = lastPart;
  return new RegExp(buffer.join(''), flags);
}
