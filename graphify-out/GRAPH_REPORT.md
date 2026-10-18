# Graph Report - image-to-jpeg  (2026-10-18)

## Corpus Check
- 9 files · ~1,154 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 4)

## Summary
- 83 nodes · 81 edges · 9 communities (7 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c2458b7c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- core/package.json
- package.json
- index.ts
- compilerOptions
- devDependencies
- tsconfig.json
- projekttagebuch.md
- bmp-js.d.ts
- README.md

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 11 edges
2. `convertFile()` - 4 edges
3. `compilerOptions` - 4 edges
4. `scripts` - 3 edges
5. `scripts` - 3 edges
6. `bmp-js` - 2 edges
7. `sharp` - 2 edges
8. `peerDependenciesMeta` - 2 edges
9. `sharp` - 2 edges
10. `ensureDir()` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (9 total, 2 thin omitted)

### Community 0 - "core/package.json"
Cohesion: 0.12
Nodes (16): dependencies, bmp-js, main, name, peerDependencies, sharp, peerDependenciesMeta, sharp (+8 more)

### Community 1 - "package.json"
Cohesion: 0.12
Nodes (15): name, private, scripts, build, dev:cli, version, workspaces, eslint (+7 more)

### Community 2 - "index.ts"
Cohesion: 0.21
Nodes (9): convertFile(), ensureDir(), nextAvailablePath(), supported, targetPath(), CollisionStrategy, ConvertOptions, bmp-js (+1 more)

### Community 3 - "compilerOptions"
Cohesion: 0.17
Nodes (11): compilerOptions, declaration, esModuleInterop, forceConsistentCasingInFileNames, module, moduleResolution, outDir, resolveJsonModule (+3 more)

### Community 4 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, eslint, jest, prettier, ts-jest, ts-node, @types/jest, @types/node (+1 more)

### Community 5 - "tsconfig.json"
Cohesion: 0.25
Nodes (7): compilerOptions, outDir, rootDir, typeRoots, extends, include, ../../tsconfig.base.json

### Community 6 - "projekttagebuch.md"
Cohesion: 0.50
Nodes (3): Aktueller Stand, Chronologie Fehler & Lösungen (bis aktueller Stand), Offene Punkte / Risiken

## Knowledge Gaps
- **9 isolated node(s):** `@types/jest`, `@types/node`, `eslint`, `jest`, `prettier` (+4 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 61 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **What connects `@types/jest`, `@types/node`, `eslint` to the rest of the system?**
  _9 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `core/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Why does `bmp-js` connect `index.ts` to `core/package.json`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Why does `sharp` connect `index.ts` to `core/package.json`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._