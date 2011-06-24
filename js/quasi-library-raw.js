// A very simple quasi handler that acts like r'...' strings in python.

function raw(callSiteId, sve) {
  var rawStrs = callSiteId['raw'];
  var n = rawStrs.length;
  if (n === 1) { return rawStrs[0]; }
  var out = [];
  for (var i = 0, k = -1; i < n;) {
    out[++k] = rawStrs[i];
    out[++k] = arguments[++i];
  }
  return out.join('');
}
