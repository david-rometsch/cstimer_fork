in node_modules>chstimer_module>cstimer_module.d.ts:

```js
export function getScramble(type: string, length: number=0, ...args: any[]): string;

```

und in scr/js>worker.js

```js
		getScramble: function() {
			var scrambler = scrMgr.scramblers[arguments[0]];
			var scramble = scrambler.apply(scrambler, arguments);
			if (!ISCSTIMER) {
				scramble = scrMgr.toTxt(scramble);
			}
			return scramble;
		},
		setSeed: function(seed) {
			mathlib.setSeed(256, seed.toString());
		},
		setGlobal: function(key, value) {
			self.kernel.setProp(key, value);
		},
		getImage: function(scramble, type) {
			var ret = image.draw([type || '333', scramble]);
			return ret && ret.render();
		}
```

-> getScramble is a wrapper of the actual scramble-object `scrMgr`
scrMgr lies in scr/js>scramble/scramble.js:

```js

```

In worker there is this line `func.apply(context, argsArray)` which works like this:  
`func.apply(context, argsArray)` it calls a function from the class scrMgr, named.

- func → eine Funktion, die aufgerufen werden soll
- context → Wert von this innerhalb der Funktion
- argsArray → Argumente

=> the actual scramble function from the module scrMgr is called `scrambler`

aufruf in my-test.js

```js
// generate scramble
const scrStr = cstimer.getScramble("333");
console.log(scrStr);
```

### example PLL

i use this, becase it is simliar to my case.
herre there is a cubestate definition in src/js/scramble/sscramble_333_edit.js:

```js
var pll_map = [
  [0x1032, 0x3210, 1, "H"],  # used as example here.
  [0x3102, 0x3210, 4, "Ua"],
  [0x3021, 0x3210, 4, "Ub"],
  # ...,
  # ...,
];
```

### translation between state definition and scrambler mathlib.js:

H-PLL speichert keine Corner-Orientierungen, während andere Cases wie COLL oder CML das tun. Trotzdem erwartet mathlib.permToMoves ein konsistentes Format. Deshalb muss csTimer diese Unterschiede vereinheitlichen, bevor es die Moves berechnet.

in the example of H-PLL, there are no corner rotation given, since in pll it equals always "0". But the mathlib function still needs its standartized arguments like:

```js
{
  corners: [...],
  cornerOri: [...],
  edges: [...],
  edgeOri: [...],
  variant: ...
}
```

### preprocessiong/mapping

#### missing information is included

function call has default values. for cornerrotations it is [0,0,0,0,0,0,0,0]

#### build the case

```js
var cubeState = {
  corners: decodePerm(pllCase.corners),
  cornerOri: decodeOri(pllCase.cornerOri || 0),
  edges: decodePerm(pllCase.edges),
  edgeOri: decodeOri(pllCase.edgeOri || 0),
  variant: pllCase.variant,   // vermutlich AUF

};
```

#### actual scrambler Call

```js
var moves = mathlib.permToMoves(cubeState);
```

##### more detaild mathlib call

###### cubeState: das Bindeglied zwischen Case-Definition und mathlib

var cubeState = {
corners: [0,1,2,3,4,5,6,7], // Corner-Permutation
cornerOri: undefined, // H-PLL: keine explizite Orientation
edges: [0,1,2,3,4,5,6,7,8,9,10,11], // Edge-Permutation
edgeOri: undefined, // Default Orientation
variant: 1 // Rotation / Spiegelung
};

###### Aufruf der entscheidenden mathlib-Funktion

var moves = mathlib.permToMoves(
cubeState.corners,
cubeState.cornerOri || [0,0,0,0,0,0,0,0],
cubeState.edges,
cubeState.edgeOri || [0,0,0,0,0,0,0,0,0,0,0,0],
cubeState.variant
);
kurz: mathlib.permToMoves(corners, cornerOri, edges, edgeOri, variant)

cornerOri / edgeOri: Default wird genommen, wenn undefined (H-PLL)

variant: steuert Rotation / Spiegelung

2️⃣ Beispiel: H-PLL
var cubeStateH = {
corners: [3,2,1,0,4,5,6,7], // Corner-Permutation für H-PLL
cornerOri: undefined, // implizit alle 0
edges: [0,1,3,2,4,5,6,7,8,9,10,11], // Edge-Permutation für H-PLL
edgeOri: undefined,
variant: 1
};

var movesH = mathlib.permToMoves(
cubeStateH.corners,
cubeStateH.cornerOri || [0,0,0,0,0,0,0,0],
cubeStateH.edges,
cubeStateH.edgeOri || [0,0,0,0,0,0,0,0,0,0,0,0],
cubeStateH.variant
);

console.log(movesH);

Output (Beispiel, je nach csTimer-Version):

["R", "U", "R'", "U", "R", "U2", "R'", "U"]

### neuer approach: scrMgr nutzen fuer testing.

Für reine Move-Generierung reichen scrMgr + mathlib + scrdata
viele dependencies kommen erst mbeid er browservariante ins spiel.

var scr = scrMgr.getScramble('333'); // gibt String zurück
var moves = scrMgr.toMoves(scr); // optional Array


in node_modules>chstimer_module>cstimer_module.d.ts:

```js
export function getScramble(type: string, length: number=0, ...args: any[]): string;

```

und in scr/js>worker.js

```js
		getScramble: function() {
			var scrambler = scrMgr.scramblers[arguments[0]];
			var scramble = scrambler.apply(scrambler, arguments);
			if (!ISCSTIMER) {
				scramble = scrMgr.toTxt(scramble);
			}
			return scramble;
		},
		setSeed: function(seed) {
			mathlib.setSeed(256, seed.toString());
		},
		setGlobal: function(key, value) {
			self.kernel.setProp(key, value);
		},
		getImage: function(scramble, type) {
			var ret = image.draw([type || '333', scramble]);
			return ret && ret.render();
		}
```

-> getScramble is a wrapper of the actual scramble-object `scrMgr`
scrMgr lies in scr/js>scramble/scramble.js:

```js

```

In worker there is this line `func.apply(context, argsArray)` which works like this:  
`func.apply(context, argsArray)` it calls a function from the class scrMgr, named.

- func → eine Funktion, die aufgerufen werden soll
- context → Wert von this innerhalb der Funktion
- argsArray → Argumente

=> the actual scramble function from the module scrMgr is called `scrambler`

aufruf in my-test.js

```js
// generate scramble
const scrStr = cstimer.getScramble("333");
console.log(scrStr);
```

### example PLL

i use this, becase it is simliar to my case.
herre there is a cubestate definition in src/js/scramble/sscramble_333_edit.js:

```js
var pll_map = [
  [0x1032, 0x3210, 1, "H"],  # used as example here.
  [0x3102, 0x3210, 4, "Ua"],
  [0x3021, 0x3210, 4, "Ub"],
  # ...,
  # ...,
];
```

### translation between state definition and scrambler mathlib.js:

H-PLL speichert keine Corner-Orientierungen, während andere Cases wie COLL oder CML das tun. Trotzdem erwartet mathlib.permToMoves ein konsistentes Format. Deshalb muss csTimer diese Unterschiede vereinheitlichen, bevor es die Moves berechnet.

in the example of H-PLL, there are no corner rotation given, since in pll it equals always "0". But the mathlib function still needs its standartized arguments like:

```js
{
  corners: [...],
  cornerOri: [...],
  edges: [...],
  edgeOri: [...],
  variant: ...
}
```

### preprocessiong/mapping

#### missing information is included

function call has default values. for cornerrotations it is [0,0,0,0,0,0,0,0]

#### build the case

```js
var cubeState = {
  corners: decodePerm(pllCase.corners),
  cornerOri: decodeOri(pllCase.cornerOri || 0),
  edges: decodePerm(pllCase.edges),
  edgeOri: decodeOri(pllCase.edgeOri || 0),
  variant: pllCase.variant,
};
```

#### actual scrambler Call

```js
var moves = mathlib.permToMoves(cubeState);
```

##### more detaild mathlib call

###### cubeState: das Bindeglied zwischen Case-Definition und mathlib

var cubeState = {
corners: [0,1,2,3,4,5,6,7], // Corner-Permutation
cornerOri: undefined, // H-PLL: keine explizite Orientation
edges: [0,1,2,3,4,5,6,7,8,9,10,11], // Edge-Permutation
edgeOri: undefined, // Default Orientation
variant: 1 // Rotation / Spiegelung
};

###### Aufruf der entscheidenden mathlib-Funktion

var moves = mathlib.permToMoves(
cubeState.corners,
cubeState.cornerOri || [0,0,0,0,0,0,0,0],
cubeState.edges,
cubeState.edgeOri || [0,0,0,0,0,0,0,0,0,0,0,0],
cubeState.variant
);
kurz: mathlib.permToMoves(corners, cornerOri, edges, edgeOri, variant)

cornerOri / edgeOri: Default wird genommen, wenn undefined (H-PLL)

variant: steuert Rotation / Spiegelung

2️⃣ Beispiel: H-PLL
var cubeStateH = {
corners: [3,2,1,0,4,5,6,7], // Corner-Permutation für H-PLL
cornerOri: undefined, // implizit alle 0
edges: [0,1,3,2,4,5,6,7,8,9,10,11], // Edge-Permutation für H-PLL
edgeOri: undefined,
variant: 1
};

var movesH = mathlib.permToMoves(
cubeStateH.corners,
cubeStateH.cornerOri || [0,0,0,0,0,0,0,0],
cubeStateH.edges,
cubeStateH.edgeOri || [0,0,0,0,0,0,0,0,0,0,0,0],
cubeStateH.variant
);

console.log(movesH);

Output (Beispiel, je nach csTimer-Version):

["R", "U", "R'", "U", "R", "U2", "R'", "U"]

### neuer approach: scrMgr nutzen fuer testing.

Für reine Move-Generierung reichen scrMgr + mathlib + scrdata
viele dependencies kommen erst mbeid er browservariante ins spiel.

var scr = scrMgr.getScramble('333'); // gibt String zurück
var moves = scrMgr.toMoves(scr); // optional Array

## testing
cstimer has an own testing module "cstimer_module" in the toplevel of the project.
there is an example test called "test.js", but i can also generate my own tests.
Thests can be rune like this:

```sh
node test.js  # name of my testfile
```

simple example for 3x3 scramble:

```js
const cstimer = require("cstimer_module");

// set deterministic seed
cstimer.setSeed("42");

// generate scramble
const scrStr = cstimer.getScramble("333");
console.log(scrStr);
```

fields in official test:

| fields  | display_name | scramble_type | scramble_length |
| ------- | ------------ | ------------- | --------------- |
| example | 3x3x3        | 333           | 20              |

the seed is importand for the testing, because it forces the scramble to be non-random: The result will bealways the same scramble, so the test can be veryfied.

Whithout this line, the scrambles are randomly different each time, as it should be in the usecase.