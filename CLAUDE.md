# Cozy Core Pack (the modpack)

A Modrinth modpack for Minecraft 26.3 on Fabric, built around Cozy Core (with Nightfall Clock,
Not Now Shield, Pocket List and Spawn Gazebo): cozy, builder-friendly survival on an everyday PC.
This repo is the pack list and the scripts that build the `.mrpack`; the mods themselves are
downloaded from Modrinth.

## Layout

- `pack.json`: the mods, shaders and resource packs, and which are optional or needed on a
  server; `retired` names our own former jars that the installers move out of `mods/`.
  `pack.lock.json`: the exact version of every one.
- `overrides/`: files every install gets: the Cozy Core (Fabric), Spawn Gazebo and Not Now Shield
  jars in `overrides/mods/`, and first-run settings under `overrides/config/yosbr/` (the MakeUp
  shader switched on, FallingTree, Mod Menu). `client-overrides/`: players' games only (the
  Nightfall Clock and Pocket List jars).
- `build-pack.js`, `install-test.js`, `install-server.js` (both built on `pack-files.js`),
  `scan-mixins.js`, `zip.js`, `rules-test.js`.

## Build and test

- `node build-pack.js`: builds `dist/Cozy Core Pack-<version>.mrpack` from the lock. `--outdated`
  lists newer builds; `--update` takes them and rewrites the lock.
- `node install-test.js test-instance`: installs the pack like a launcher would, for a test game
  (files already there with the right hash are kept, so only new ones download).
- `node scan-mixins.js test-instance/mods`: other mods patching the classes our mods hook.
- CI (`.github/workflows/build.yml`) builds the pack from the lock on every push and checks
  every mod is pinned, our own jars are inside, and BOP has TerraBlender and no Biolith mods. It
  can't play the pack: test a change by installing it and opening a new world.
- `node rules-test.js test-instance`: with a test game open (its MCPFabric bridge with
  commands on), checks Cozy Core's creeper, fire and Hearth Lantern rules
  inside the whole pack, each with a proof run. Run it after any mod is added or updated.

## Gotchas

- **The jars in `overrides/mods/` and `client-overrides/mods/` are built from the mods' own
  repos.** Build them from a clean, committed `main` of that repo and say which commit in the
  commit message. First versions: cozy-core a706695 (0.2.0), spawn-gazebo a15452d (1.1.1),
  not-now-shield a6ad07e (1.1.2, the `public` branch = public/main), nightfall-clock 0.2.1,
  pocket-list 0.1.0.
- Biomes O' Plenty needs TerraBlender, which its Modrinth dependency list doesn't name: it's
  listed in `pack.json` by hand. Don't add Wilder Wild or Promenade: their Biolith crashes with
  TerraBlender on 26.3.
- Lithium and Puzzles Lib (needed by Easy Anvils and Easy Magic) patch mob spawning and
  explosions, and Spawn Gazebo patches fire and explosions: the same code as Cozy Core's rules.
  `rules-test.js` is what proves they still work together.
- The default shader is switched on by file name in `overrides/config/yosbr/config/iris.properties`;
  `build-pack.js` stops if an update renames it.
- Checked by hand, not by script: Carry On (its Shift "carry" key can't be pressed by the test
  bridge, and its reach is 2.5 blocks), and frame rate (Dynamic FPS throttles an unfocused test
  game to ~1 FPS). The stonecutter screen can be checked with the bridge's `container.open`,
  `container.click` (quick_move the logs in) and a screenshot.
- Zoomify's NeoForge helper (KotlinLangForge) is skipped on purpose; on Fabric it uses Fabric
  Language Kotlin.

## Working on Gabby's mods (the same in every repo)

Gabby makes these mods with help from Claude. Several Claude sessions work on them: one on her
computer and others in the cloud. These rules keep their work fitting together.

**One session per repo at a time.**
- A cloud session works on a `claude/...` branch and never pushes to `main`. Gabby's local
  session reviews the branch, runs its tests and merges it as one commit.
- Start from the latest `main` (`git pull`), and say in the branch's last commit or a short note
  what is finished and what isn't.

**Commits.**
- Author and committer are always `gabmaybelle <211247938+gabmaybelle@users.noreply.github.com>`:
  `git -c user.name=gabmaybelle -c user.email=211247938+gabmaybelle@users.noreply.github.com commit ...`.
  Never a personal email, and never `Claude <noreply@anthropic.com>` as the author. Claude goes in
  a `Co-Authored-By:` line at the end of the message.
- Ask Gabby before committing or pushing when she's around. Finish the build and the tests first.
- Commit messages say what changed for players, in plain sentences.

**Privacy.** These repos are public. Don't add personal email addresses, real names other than
"Gabby", or anything about her other private projects and modpacks: not in code, docs, commits
or test names. Check the diff for these before every push.

**Tests.**
- `./gradlew build` and `./gradlew runClientGameTest` (where the repo has one) must pass before
  a commit. The game test opens a real game window for a minute or two.
- A new or changed check should fail with the feature switched off: run it that way once, then
  put the code back. A check that compares against the setting it tests proves nothing.
- On Linux without a screen, run game tests under `xvfb-run -a`. 26.3 also needs
  `SDL_VIDEO_FORCE_EGL=1` with `libegl1 libegl-mesa0` installed, or the game hangs at startup.

**Writing.**
- README and CHANGELOG are for players: plain, friendly, no jargon. New player-facing changes
  go in the CHANGELOG's newest section.
- Keep the credit line: "made by Gabby with help from Claude, an AI assistant".
- Gabby publishes on Modrinth herself. Don't upload anything there.

**Minecraft.** Fabric on Minecraft 26.3 (Mojang names; Loom 1.18.4, Java 25). Vanilla names
changed a lot in 26.x: check the merged jar rather than older docs (for example `iron_chain`,
`pink_petals[flower_amount=N]`, timelines instead of `time query daytime`).
