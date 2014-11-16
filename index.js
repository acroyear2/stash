
exports.get = get;
exports.set = set;

var store = require('store');

var prefix = 's';
var storeopts = { persist: true };

function get (type, k, v) {
  var pfx = prefix + '/' + type.key + '/';
  var key = pfx + k + '/' + v;
  var i = store.get(key);
  if (i && i != null) {
    var res = store.get(i);
    if (res && res != null)
      return res;
  }
};

function set (type, val, key, refs) {
  var pfx = prefix + '/' + type.key + '/';
  var key = store.set(val, pfx + key, { persist: true });
  var ck = Object.keys(refs).map(function (k) {
    return store.set(key, pfx + k + '/' + refs[k], storeopts);
  });
  ck = ck.concat(key).join('$');
  var ixk = pfx + 'ix';
  var ix = store.get(ixk);
  if (!ix)
    store.set([ck], ixk, storeopts);
  else {
    if (ix.length >= type.max) {
      var keys = ix.shift();
      keys.split('$').forEach(function (key) {
        store.remove(key, storeopts);
      });
    }
    ix.push(ck);
    store.set(ix, ixk, storeopts);
  }
};