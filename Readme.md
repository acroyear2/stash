# stash

get/set local storage entities with persistent references.

## usage

```js
var kind = stash.Kind('butterflies', { max_refs: 2 });

var entity = stash.Entity(kind, 'swallowtail', 
  { family: 'papillion', wings: 2 })
  .add_reference('spicebush')
  .add_reference('lime')
  .save();

// later on... browsers are closed, things happened
stash.get('butterflies', 'lime'); // yayy
```

## api

Exposes `Kind`, `Entity` and `get`.

### get(kind, ref_key)

Given a `Kind` object and a reference key, this will construct and return an `Entity` instance if it is available on local storage.

`kind` should be of type `Kind` preferably, if you pass a string instead it will be cast into a `Kind` with default options.

### Kind(name, opts)

`opts` object currently accepts only `max_refs` defined which is the maximum number of allowed references of an `Entity` of this particular `Kind`. (default `max_refs`: 3)

### Entity(kind, key, val)

An `Entity` will be persisted into local storage upon a `save` along with its refs.

If `max_refs` is reached, this will act like a lifo queue and remove old references.

Note that `Entity` methods are chainable.

### .add_reference(key)

### .save()

## License

The MIT License (MIT)

Copyright (c) 2014 Onur Gunduz ogunduz@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.