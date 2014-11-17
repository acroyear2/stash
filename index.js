
exports.Kind = Kind;
exports.Entity = Entity;
exports.get = get;

var store = require('store');

function get (kind, ref_key) {
  if (!(kind instanceof Kind))
    kind = Kind(kind);
  var key = store.get(ref_path_(kind, ref_key));
  if (key && key != null) {
    var res = store.get(key);
    if (res && res != null)
      key = key.split('/');
      return Entity(kind, key[key.length-1], res);
  }
}

function ref_path_ (kind, key) {
  return ['sr', kind.name, key].join('/');
}

function Kind (name, opts) {
  if (!(this instanceof Kind))
    return new Kind(name, opts);
  opts || (opts = { max_refs: 3 });
  this.name = name;
  this.opts = opts;
  this.path = ['s', name].join('/');
}

function Entity (kind, key, val) {
  if (!(this instanceof Entity))
    return new Entity(kind, key, val);
  this.kind = kind;
  this.key = key;
  this.val = val;
  this.path = [kind.path, key].join('/');
  this.ix_path_ = [this.path, 'ix'].join('/');
  store.remove(this.ix_path_);
  var ix = store.get(this.ix_path_);
  this.refs = ix || [];
}

Entity.prototype.add_reference = function (key) {
  if (this.refs.length >= this.kind.opts.max_refs)
    this.refs.shift();
  this.refs.push(key);
  return this;
};

var s_opts = {persist: true};

Entity.prototype.save = function () {
  var path = store.set(this.val, this.path, s_opts);

  if (!this.refs.length)
    return this;

  var kind = this.kind;
  
  // might have been cached in an old state
  store.remove(this.ix_path_);

  var ix = store.get(this.ix_path_);
  if (ix) {
    if (ix.length >= kind.opts.max_refs) {
      ix.forEach(function (key) {
        store.remove(ref_path_(kind, key), s_opts);
      });
    }
  }

  this.refs.forEach(function (key) {
    store.set(path, ref_path_(kind, key), s_opts)
  });
  store.set(this.refs, this.ix_path_, s_opts);

  return this;
};


