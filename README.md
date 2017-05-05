# ng2-movable

Demo: [https://spali.github.io/ng2-movable/](https://spali.github.io/ng2-movable/)

__Features__
-   Optionally enable and disable functionality by `movableEnabled` attribute binding.
-   Optionally specify an element (directive `movableHandle`) which is responsible for moving another element (directive `movable`).
-   Supports nesting of multiple movables.
-   Support for detailed styling of movable and handle element by classes depending on the states.
-   by default won't left the visible viewport (can be disabled by setting `movableConstrained` to `false`).
-   support to be constrained to an element which the movable can't leave by setting `movableConstraint` to the id of the element.
-   by default movable uses `relative` positioning if nothing else or `static` is specified. This can be overriden by css to anything else (except `static`). For `fixed` and `absolute` you have to pay attention for the initial positioning, especially if you have constrained the movable to an element, you have to make sure the initial position is within the element the movable is constrained to.

## How to install

```bash
$ npm install ng2-movable --save
```

## Usage

See the demo code for usage. Also checkout how the classes on the element's changes to make use for advanced styling.

## How to demo

```bash
$ git clone https://github.com/spali/ng2-movable.git
$ cd ng2-movable
$ npm install
$ npm start
```

## License

MIT
