
var stash = require('stash');
var Kind = stash.Kind;
var Entity = stash.Entity;

describe('stash', function () {
  after(function () {
    window.localStorage.clear();
  });
  it('should set entities and refs', function (done) {
    var k = Kind('k1');
    var e = Entity(k, 'e1', 'v');
    e
    .add_reference('r1')
    .add_reference('r2')
    .save();
    (window.localStorage.getItem('s/k1/e1')).should.eql('v');
    (window.localStorage.getItem('sr/k1/r1')).should.eql('s/k1/e1');
    (window.localStorage.getItem('sr/k1/r2')).should.eql('s/k1/e1');
    done();
  });
  it('should limit refs', function (done) {
    var k = Kind('k2', {max_refs: 2});
    var e = Entity(k, 'e1', 'v');
    e
    .add_reference('r1')
    .add_reference('r2')
    .add_reference('r3')
    .add_reference('r4')
    .save();
    (window.localStorage.getItem('s/k2/r1')==null).should.be.true;
    (window.localStorage.getItem('s/k2/r2')==null).should.be.true;
    (window.localStorage.getItem('sr/k2/r3')).should.eql('s/k2/e1');
    (window.localStorage.getItem('sr/k2/r4')).should.eql('s/k2/e1');
    done();
  });
  it('should remove dangling refs', function (done) {
    var k = Kind('k2', {max_refs: 2});
    var e = Entity(k, 'e2', 'v');
    e
    .add_reference('r3')
    .add_reference('r4')
    .save();
    (window.localStorage.getItem('sr/k2/r3')).should.eql('s/k2/e2');
    (window.localStorage.getItem('sr/k2/r4')).should.eql('s/k2/e2');
    e
    .add_reference('r1')
    .add_reference('r2')
    .save();
    (window.localStorage.getItem('s/k2/r3')==null).should.be.true;
    (window.localStorage.getItem('s/k2/r4')==null).should.be.true;
    (window.localStorage.getItem('sr/k2/r1')).should.eql('s/k2/e2');
    (window.localStorage.getItem('sr/k2/r2')).should.eql('s/k2/e2');
    done();
  });
  it('should get entities by refs', function (done) {
    var k = Kind('k3');
    var e = Entity(k, 'e1', 'v');
    e.add_reference('r').save();
    var res = stash.get('k3', 'r');
    res.should.be.an.instanceOf(Entity);
    Object.getOwnPropertyNames(res).forEach(function (prop) {
      e[prop].should.eql(res[prop]);
    });
    done();
  });
});
