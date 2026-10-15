# Cozy Core Pack

*Put the kettle on and build.*

A cozy, builder-friendly survival modpack for Minecraft 26.3 on Fabric. Your builds stay safe, decorating takes fewer trips back to the crafting table, and the world looks lovely from the first launch. It's made to run well on an ordinary PC.

## Getting started

1. Download the `.mrpack` from the [Releases page](https://github.com/gabmaybelle/cozy-core-pack/releases) and import it into the Modrinth app, Prism Launcher, ATLauncher or CurseForge. The launcher sets up Minecraft 26.3 and Fabric for you. (0.1.0 is a pre-release: the pack hasn't had a long play test yet.)
2. Give the game 4 GB of memory if your PC has it. Launchers often start at 2 GB, which stutters once you explore.
3. Start a new world. The pack switches on a light shader (MakeUp UltraFast) for you.

## What's inside

**Building**
- [Cozy Core](https://github.com/gabmaybelle/cozy-core): creepers can't break your builds, endermen leave blocks alone, fire never burns a block, no phantoms, and you keep your hotbar when you die. Its Hearth Lantern keeps monsters from spawning near your build site. Wood goes in the stonecutter at cheap rates, and you can re-dye blocks.
- Beautify and Ecologics for more to build with, and Clumps to tidy up experience orbs.
- FallingTree to fell a whole tree in one go.

**Starting out**
- [Spawn Gazebo](https://github.com/gabmaybelle/spawn-gazebo): you start in a little gazebo with a starter chest.
- Universal Graves: when you die, everything you didn't keep waits in a grave where you fell.
- Traveler's Backpack and Waystones for carrying and getting around.

**The world**
- Biomes O' Plenty for more varied land.
- Nature's Compass, Explorer's Compass, and Xaero's World Map and Minimap, for finding your way.

**Handy extras**
- [Nightfall Clock](https://github.com/gabmaybelle/nightfall-clock): the day and time above your hotbar.
- [Pocket List](https://github.com/gabmaybelle/pocket-list): press K for a checklist of what you're gathering.
- [Not Now, Shield](https://github.com/gabmaybelle/not-now-shield): tools change blocks even with a shield in your off-hand, and your shield is drawn lower.
- JEI for recipes, Jade for what you're looking at, Zoomify, Mouse Tweaks and inventory sorting, durability and enchantment descriptions on hover, AppleSkin, Shulker Box Tooltip, Carry On, Right Click Harvest, Sit, Easy Anvils, Easy Magic, and Mod Menu.

**Looks and speed**
- A light shader (MakeUp UltraFast) is on from the start, through Iris.
- Sodium, Lithium, FerriteCore, ModernFix, ImmediatelyFast, Entity Culling and Dynamic FPS keep it running smoothly, and LambDynamicLights lights up the world around held torches.
- Chunky is there if you want to build the land around you ahead of time.

## Servers

Everything the server needs is marked in the pack, so a launcher that sets up servers installs the right files. Nightfall Clock and Pocket List are client-side and stay off a server.

## Building the pack

The mods are downloaded from Modrinth, and our own five mods (the ones linked above) from their GitHub releases, each pinned to an exact version and file hash. `node build-pack.js` builds the `.mrpack` (needs Node 22 or newer); CI does it on every push and checks that every mod is pinned and every release link still works.

## Licence

The pack list and scripts are under [CC BY-NC-SA 4.0](LICENSE). The mods in the pack keep their own licences.

Made by Gabby with help from Claude, an AI assistant.
