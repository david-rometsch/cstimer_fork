## git log fuer zbll
```sh
commit d4297f83580b91d53bc6ff545588d88e9f6afbdd
Author: cs0x7f <cs0x7f@gmail.com>
Date:   Fri Feb 3 18:42:16 2017 +0800

    fix zbll

commit 35765249a79cbdffa8e66fcb2f31eb405b805e10
Author: cs0x7f <cs0x7f@gmail.com>
Date:   Fri Feb 3 18:32:40 2017 +0800

    add zbll filter

commit 4a07c426b2e77e8ab40bc48f6f8a3464408adaad
Author: cs0x7f <cs0x7f@gmail.com>
Date:   Fri Feb 3 15:56:31 2017 +0800

    prepare for scramble filter
```

## preexisting special  cases using fix mapped elements. 
## zbll old version hat noch alle definitions
```js
-	function getZBLLScramble() {
-		return getAnyScramble(0xf, 0, 0xf, 0xf);
+	var zbll_map = [
+		[[0, 1, 2, 3, 4, 5, 6, 7], [1, 2, 1, 2, 0, 0, 0, 0]], // H-BBFF [cp-global, co-global] eo solved, op generated randomly
+		[[2, 1, 0, 3, 4, 5, 6, 7], [1, 2, 1, 2, 0, 0, 0, 0]], // H-FBFB
+		[[0, 2, 1, 3, 4, 5, 6, 7], [1, 2, 1, 2, 0, 0, 0, 0]], // H-RFLF
+		[[1, 0, 2, 3, 4, 5, 6, 7], [1, 2, 1, 2, 0, 0, 0, 0]], // H-RLFF

```
this contains the information how to map the corner permutation and orientation, but notthing about mapping edges, since their randomly

so ep is missing, but i can find it in pll:
	## edge mapping in PLL
```js
	var pll_map = [
		// [0x1032, 0x3210, 1, 'H'],   // [ep, cp] - confirmed
		// [0x1032, 0x2301, 1, 'H'],   // my-case: 2 mal 2 corner swapped -> e-perm 
		[0x0123, 0x3210, 1, 'H'],   // my-case: 
		// [0x3102, 0x3210, 4, 'Ua'],

```

so the full cube definition would be: 
```js
var my_full_map = [
	[[0, 1, 2, 3, 4, 5, 6, 7], [1, 2, 1, 2, 0, 0, 0, 0],]
```

## old pll versionwith full edge definition
```js
+	var pll_map = [
+		[0xba9876541032, 0x76543210], // H
    0x -> hexnotation: 12 stellen -> 12 edges. index 0-11 (11=b)
+		[0xba9876543102, 0x76543210], // Ua

```

here it is visible how ep ist defined. 

0xba9876541032, 0x76543210], //  
0x -> hexnotation: 12 stellen -> 12 edges. index 0-11 (11=b)

#### build the case for mathlib 

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

### daraus folgender aqufruf fuer 3bld
example fuer solved cube
```js
var cubeState = {
  corners: [0x76543210], 
  cornerOri: [0x00000000],
  edges: [0xba9876543210], 
  edgeOri: [0x000000000000] 
  variant: 0,   // vermutlich AUF
};
```

oder direkter aufruf in mathib