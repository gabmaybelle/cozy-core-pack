// Play-tests Cozy Core's rules inside the whole pack, where other mods (Lithium, Puzzles Lib,
// Spawn Gazebo...) patch the same game code: creeper explosions, fire and the Hearth Lantern,
// each checked with the rule on its default and again switched the other way (the proof run).
//   node rules-test.js "<test game folder>" [player name]
// Needs a running test game whose MCPFabric bridge has commands on, and the bridge's
// command-line client, mcf.js: set the MCF environment variable to its path.
// Builds far from spawn (x 400), away from Spawn Gazebo's protected area.
const path = require('path'), { execFileSync } = require('child_process');

const [folder, player = 'GrabbyTM'] = process.argv.slice(2);
const MCF = process.env.MCF;
if (!MCF) {
	console.error('set MCF to the path of the MCPFabric bridge command-line client (mcf.js)');
	process.exit(1);
}
const run = command => {
	const out = execFileSync(process.execPath, [MCF, folder, 'command.run', JSON.stringify({ command })], { encoding: 'utf8' });
	return ((out.replace(/\n/g, '').match(/"output": \[\s*"([^"]*)/) || [])[1] || '');
};
const pause = ms => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const count = reply => Number((reply.match(/(\d+) block|Count: (\d+)/) || []).slice(1).find(Boolean) || 0);
const sprint = ticks => {
	run(`tick sprint ${ticks}`);
	for (let i = 0; i < 60 && !/normally/.test(run('tick query')); i++) pause(3000);
	pause(2000);
};

const results = [];
const check = (name, ok, detail) => { results.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}: ${detail}`); };

if (!folder) throw new Error('usage: node rules-test.js "<test game folder>" [player]');
run(`gamemode creative ${player}`);
run(`tp ${player} 400 230 380`);
pause(3000);
run('setblock 400 229 380 glass');
run('forceload add 368 268 432 492');
run('weather clear 100000');
run('difficulty normal');

// Creepers: a solid 11x5x11 block of planks, a creeper going off on top.
const creeper = () => {
	run('fill 393 149 393 407 157 407 air');
	run('fill 395 150 395 405 154 405 oak_planks');
	run('summon creeper 400 155 400 {ignited:1b,Fuse:1s}');
	pause(3000);
	return count(run('fill 395 150 395 405 154 405 spruce_planks replace oak_planks'));
};
const c1 = creeper();
run('gamerule cozy_core:mob_explosions_break_blocks true');
const c2 = creeper();
run('gamerule cozy_core:mob_explosions_break_blocks false');
check('creeper spares blocks', c1 === 605 && c2 < 605, `${c1}/605 planks kept; ${c2}/605 with the rule on`);

// Fire: a plank floor with fire on it, 1200 ticks.
const fire = () => {
	run('fill 390 149 390 410 160 410 air');
	run('fill 395 150 395 405 151 405 oak_planks');
	run('fill 396 152 396 404 152 404 fire');
	sprint(1200);
	const left = count(run('fill 395 150 395 405 151 405 spruce_planks replace oak_planks'));
	run('fill 390 149 390 410 160 410 air replace fire');
	return left;
};
const f1 = fire();
run('gamerule cozy_core:fire_burns_blocks true');
const f2 = fire();
run('gamerule cozy_core:fire_burns_blocks false');
check('fire spares blocks', f1 === 242 && f2 < 200, `${f1}/242 planks kept; ${f2}/242 with the rule on`);

// Hearth Lantern: two dark rooms with the same light, one with a Hearth Lantern (room small
// enough to be all within 32 blocks), one with a plain lantern. Bats are ambient, not monsters.
run('fill 368 199 268 432 205 332 air');
run('fill 378 200 278 422 204 322 stone hollow');
run('setblock 400 201 300 cozy_core:hearth_lantern');
run('fill 370 200 430 430 204 490 stone hollow');
run('setblock 400 201 460 minecraft:lantern');
const rooms = () => {
	run('kill @e[type=!player,x=370,y=195,z=270,dx=60,dy=12,dz=60]');
	run('kill @e[type=!player,x=370,y=200,z=430,dx=60,dy=4,dz=60]');
	sprint(6000);
	return [count(run('execute if entity @e[type=!player,type=!bat,x=378,y=200,z=278,dx=44,dy=4,dz=44]')),
		count(run('execute if entity @e[type=!player,type=!bat,x=370,y=200,z=430,dx=60,dy=4,dz=60]'))];
};
const [h1, p1] = rooms();
run('gamerule cozy_core:hearth_lantern_radius 0');
const [h2, p2] = rooms();
run('gamerule cozy_core:hearth_lantern_radius 32');
check('Hearth Lantern stops monster spawns', h1 === 0 && p1 > 10 && h2 > 0,
	`${h1} monsters in the Hearth room vs ${p1} in the plain room; with radius 0: ${h2} vs ${p2}`);

// run() keeps only the reply's first line; the speed is further down, so read the whole reply.
const tick = execFileSync(process.execPath, [MCF, folder, 'command.run', JSON.stringify({ command: 'tick query' })], { encoding: 'utf8' });
console.log(`server speed: ${(tick.match(/Average time per tick: [\d.]+ms/) || ['?'])[0]} (budget 50ms)`);
console.log(`${results.filter(Boolean).length}/${results.length} passed`);
process.exit(results.every(Boolean) ? 0 : 1);
