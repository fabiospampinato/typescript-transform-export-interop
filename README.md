# Typescript Transform Export Interop

TypeScript transform for exporting a module that can be easily imported both from TypeScript and from Node.js.

## Install

```sh
npm install --save-dev typescript-transform-export-interop
```

## Usage

Ideally you should export your TypeScript modules in a way that importing them is a painless experience for your users, that means supporting all these kinds of imports:

```typescript
// TypeScript
import Foo from 'foo';
import * as Foo from 'foo';
// Node.js
const Foo = require ( 'foo' );
```

In order to do this your code must be exported in a particular, super-ugly, [way](https://github.com/Microsoft/TypeScript/issues/28335#event-1955245818), or you could just use this module:

1. Export your modules as `export default Foo`, if you need multiple exports don't export a default one.

2. Add `tstei` to your compilation chain: `tsc && tstei`.

## Notes

#### Type Exporting

Sometimes, if you'll export the type of a module exported using `typescript-transform-export-interop`, you'll have to explicitly import its type this way:

```typescript
import Foo, {type as FooType} from 'foo';

class Bar {
  foo: FooType
}

export default Bar;
```

Unfortunately there's no cleaner way of doing this while still supporting clean, interoperable, importing.

#### Safety

This module uses regexes for transforming your export, instead of modifying the AST (there isn't a Babel equivalent for TypeScript declarations, is there?) so you should be careful not to write weird things like strings containing `export default Foo`, they will throw off this module.

In any case if this module detects that the transformation is not safe to make an error will be thrown.

## License

MIT © Fabio Spampinato
