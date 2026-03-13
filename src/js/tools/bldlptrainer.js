var bldlptrainer = execMain(function() {
	// Speffz letter -> [corner_index, co]
	// corner order: 0=URF(buffer), 1=UFL, 2=ULB, 3=UBR, 4=DFR, 5=DLF, 6=DBL, 7=DBR
	var letterToCorner = {};
	var speffzCorners = ['CJM', 'DIF', 'ARE', 'BQN', 'VKP', 'ULG', 'XSH', 'WTO'];
	for (var ci = 0; ci < 8; ci++) {
		for (var ori = 0; ori < 3; ori++) {
			letterToCorner[speffzCorners[ci][ori]] = [ci, ori];
		}
	}

	function sN(v, p, n) { return (v & ~(0xf << p * 4)) | ((n & 0xf) << p * 4); }

	function parsePairs(input) {
		var pairs = [];
		var tokens = input.toUpperCase().replace(/[^A-X]/g, ' ').trim().split(/\s+/);
		for (var i = 0; i < tokens.length; i++) {
			var tok = tokens[i];
			if (tok.length !== 2) continue;
			var m1 = letterToCorner[tok[0]];
			var m2 = letterToCorner[tok[1]];
			if (!m1 || !m2) continue;
			if (m1[0] === 0 || m2[0] === 0) continue; // skip buffer corner (URF = C/J/M)
			if (m1[0] === m2[0]) continue;             // same corner
			pairs.push([m1[0], m1[1], m2[0], m2[1]]);
		}
		return pairs;
	}

	var currentPairs = parsePairs(kernel.getProp('bldlpPairs', ''));

	// --- dialog UI (reused across calls) ---
	var dialogInput = $('<textarea style="width:100%;height:8em;box-sizing:border-box;resize:vertical" placeholder="e.g. AF BL XK RU">');
	var dialogStatus = $('<div style="margin-top:4px">');
	var dialogDiv = $('<div style="padding:4px">').append(
		TOOLS_BLDLPTRAINER + ' (Speffz, space-separated):', $('<br>'),
		dialogInput, dialogStatus
	);

	dialogInput.on('input', function() {
		var n = parsePairs(dialogInput.val()).length;
		dialogStatus.html(n + ' pair' + (n !== 1 ? 's' : '') + ' in pool');
	});

	function showInputDialog() {
		dialogInput.val(kernel.getProp('bldlpPairs', ''));
		dialogInput.trigger('input');
		kernel.showDialog([dialogDiv, dialogOK, null], 'input', TOOLS_BLDLPTRAINER);
	}

	function dialogOK() {
		var val = dialogInput.val();
		kernel.setProp('bldlpPairs', val);
		currentPairs = parsePairs(val);
		kernel.pushSignal('ctrl', ['scramble', 'next']);
	}

	// --- scramble generator ---
	function generateScramble() {
		if (currentPairs.length === 0) {
			showInputDialog();
			return '';
		}
		var available = currentPairs.slice();
		for (var i = available.length - 1; i > 0; i--) {
			var j = mathlib.rn(i + 1);
			var tmp = available[i]; available[i] = available[j]; available[j] = tmp;
		}
		var used = {};
		var cpResult = 0x76543210, coResult = 0x00000000;
		var usedAny = false;
		for (var i = 0; i < available.length; i++) {
			var p = available[i];
			var t1 = p[0], ob = p[1], t2 = p[2], oc = p[3];
			if (used[t1] || used[t2]) continue;
			used[t1] = used[t2] = true;
			var oa = (6 - ob - oc) % 3;
			var cp = 0x76543210;
			cp = sN(cp, 0, t1); cp = sN(cp, t1, t2); cp = sN(cp, t2, 0);
			var co = 0;
			co = sN(co, 0, oa); co = sN(co, t1, ob); co = sN(co, t2, oc);
			var comp = scramble_333.composeCycles(cpResult, coResult, cp, co);
			cpResult = comp[0]; coResult = comp[1];
			usedAny = true;
		}
		if (!usedAny) return scramble_333.getRandomScramble();
		return scramble_333.getAnyScramble(0xba9876543210, 0x000000000000, cpResult, coResult, 0);
	}

	scrMgr.reg('nocache_333bldlp', generateScramble);

	// --- tool panel (wrench icon) for editing pairs after initial setup ---
	function execFunc(fdiv) {
		if (!fdiv) return;
		if (!tools.isPuzzle('333')) {
			fdiv.html(IMAGE_UNAVAILABLE);
			return;
		}
		var inp = $('<textarea style="width:100%;height:6em;box-sizing:border-box;resize:vertical" placeholder="e.g. AF BL XK RU">');
		inp.val(kernel.getProp('bldlpPairs', ''));
		var st = $('<div>');
		function updateTool() {
			var val = inp.val();
			currentPairs = parsePairs(val);
			kernel.setProp('bldlpPairs', val);
			kernel.setProp('scrType', 'nocache_333bldlp');
			st.html(currentPairs.length + ' pair' + (currentPairs.length !== 1 ? 's' : '') + ' in pool');
		}
		inp.on('input', updateTool);
		updateTool();
		fdiv.empty().append(
			$('<div style="padding:4px">').append(
				TOOLS_BLDLPTRAINER + ':', $('<br>'), inp, st
			)
		);
	}

	tools.regTool('bldlptrainer', TOOLS_BLDLPTRAINER, execFunc);
});
