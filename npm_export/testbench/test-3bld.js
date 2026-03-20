/**
 * Tests for the 3BLD corner commutator scramble feature.
 *
 * Tests 1 & 2 are self-contained pure-logic tests (no build needed).
 * Test 3 is an integration test — run `make module` first to build cstimer_module.js.
 */

var passed = 0;
var failed = 0;

function assert(condition, message) {
	if (condition) {
		console.log('  PASS:', message);
		passed++;
	} else {
		console.error('  FAIL:', message);
		failed++;
	}
}

// ---------------------------------------------------------------------------
// Shared logic extracted from scramble_333_edit.js (lines 765-800)
// ---------------------------------------------------------------------------

function buildBld3cByCat() {
	function sN(v, p, n) { var s = p * 4; return (v & ~(0xf << s)) | ((n & 0xf) << s); }
	function st(pos, co) {
		if (pos < 4) {
			if (co === 0) return 0;
			if (co === 2 && (pos === 1 || pos === 3)) return 2;
			return 1;
		}
		return co === 0 ? 4 : 3;
	}
	function cat(s1, s2) {
		if (s1 <= 2 && s2 <= 2) return 2;
		if (s1 === 2 || s2 === 2) return 5;
		var a = Math.min(s1, s2), b = Math.max(s1, s2);
		if (a === 0 && b === 3) return 1;
		if (a === 0) return 4;
		if (a === 1) return 0;
		if (b === 3) return 3;
		if (a === 3) return 6;
		return 7;
	}
	var bld3cByCat = [[], [], [], [], [], [], [], []];
	for (var t1 = 1; t1 <= 7; t1++) {
		for (var t2 = 1; t2 <= 7; t2++) {
			if (t2 === t1) continue;
			for (var oa = 0; oa < 3; oa++) {
				for (var ob = 0; ob < 3; ob++) {
					var oc = (6 - oa - ob) % 3;
					var cp = 0x76543210;
					cp = sN(cp, 0, t1); cp = sN(cp, t1, t2); cp = sN(cp, t2, 0);
					var co = 0;
					co = sN(co, 0, oa); co = sN(co, t1, ob); co = sN(co, t2, oc);
					bld3cByCat[cat(st(t1, ob), st(t2, oc))].push([cp, co]);
				}
			}
		}
	}
	return bld3cByCat;
}

// ---------------------------------------------------------------------------
// Test 1: Category population — 378 total cases, all 8 categories non-empty
// ---------------------------------------------------------------------------
// 7 choices for t1 × 6 remaining choices for t2 × 9 orientation combos (3×3) = 378
// Each of the 8 sticker-type categories must contain at least one case.

console.log('\nTest 1: Category population (378 cases across 8 categories)');

var bld3cByCat = buildBld3cByCat();
var total = bld3cByCat.reduce(function(sum, cat) { return sum + cat.length; }, 0);
assert(total === 378, 'Total case count is 378 (got ' + total + ')');
for (var i = 0; i < 8; i++) {
	assert(bld3cByCat[i].length > 0, 'Category ' + i + ' is non-empty (' + bld3cByCat[i].length + ' cases)');
}

// ---------------------------------------------------------------------------
// Test 2: Uniqueness — no two cases share the same [cp, co] pair
// ---------------------------------------------------------------------------
// Every (corner permutation, corner orientation) pair encodes a distinct cube
// state, so no duplicate case should appear anywhere across all categories.

console.log('\nTest 2: All 378 [cp, co] pairs are unique');

var seen = {};
var duplicates = 0;
for (var c = 0; c < bld3cByCat.length; c++) {
	for (var j = 0; j < bld3cByCat[c].length; j++) {
		var key = bld3cByCat[c][j][0] + ',' + bld3cByCat[c][j][1];
		if (seen[key]) duplicates++;
		seen[key] = true;
	}
}
assert(duplicates === 0, 'No duplicate [cp, co] pairs (found ' + duplicates + ')');
assert(Object.keys(seen).length === 378, 'Unique pair count matches total (378)');

// ---------------------------------------------------------------------------
// Test 3: Integration — getScramble returns a valid WCA move string
// ---------------------------------------------------------------------------
// Requires cstimer_module.js to be built first: run `make module` in the repo root.
// Tests all 8 single-cycle types (3bldc0–7) and all 8 multi-cycle types (3bldmc0–7).

console.log('\nTest 3: Integration — scramble output is a valid WCA move string');

var WCA_MOVE = /^([URFDLB][2']?\s*)+$/;
var SINGLE_CYCLE_TYPES = ['3bldc0','3bldc1','3bldc2','3bldc3','3bldc4','3bldc5','3bldc6','3bldc7'];
var MULTI_CYCLE_TYPES  = ['3bldmc0','3bldmc1','3bldmc2','3bldmc3','3bldmc4','3bldmc5','3bldmc6','3bldmc7'];

try {
	var cstimer = require('../cstimer_module');
	cstimer.setSeed('42');

	SINGLE_CYCLE_TYPES.forEach(function(type) {
		var scramble = cstimer.getScramble(type);
		assert(typeof scramble === 'string' && scramble.length > 0,
			type + ' returns a non-empty string');
		assert(WCA_MOVE.test(scramble.trim()),
			type + ' output contains only valid WCA moves ("' + scramble.trim() + '")');
	});

	MULTI_CYCLE_TYPES.forEach(function(type) {
		var scramble = cstimer.getScramble(type);
		assert(typeof scramble === 'string' && scramble.length > 0,
			type + ' returns a non-empty string');
		assert(WCA_MOVE.test(scramble.trim()),
			type + ' output contains only valid WCA moves ("' + scramble.trim() + '")');
	});

} catch (e) {
	if (e.code === 'MODULE_NOT_FOUND') {
		console.log('  SKIP: cstimer_module.js not found — run `make module` in the repo root first');
	} else {
		throw e;
	}
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log('\n--- Results: ' + passed + ' passed, ' + failed + ' failed ---\n');
if (failed > 0) process.exit(1);
