// A very simple quasi handler that acts like r'...' strings in python.

function raw(callSiteId, sve) {
  var rawStrs = callSiteId.rawLP;
  var out = [];
  for (var i = 0, k = -1, n = rawStrs.length; i < n;) {
    out[++k] = rawStrs[i];
    out[++k] = arguments[++i];
  }
  return out.join('');
}
