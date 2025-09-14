# Projekttagebuch – JPEGme

- 2025-09-14: Architektur festgelegt: TypeScript Monorepo (pnpm), Core mit sharp/libvips, zuerst CLI, dann Electron-Desktop-UI (Drag & Drop). Defaults: Qualität 85 (stufenlos), sRGB an, EXIF/ICC an, GPS entfernen standardmäßig aus, Konflikte: Umbenennen, Ausgabeordner: Windows Downloads. RAW: Standard schnell (eingebettete Vorschau), Fallback präzise (Best Effort). Mehrsprachig (DE/EN), Dark/Light-Mode. Änderungen werden vor Implementierung gemäß Direktive D‑02 geprüft.

## Chronologie Fehler & Lösungen (bis aktueller Stand)

- Packaging/Build – pnpm approve-builds Blocker (sharp/electron)
  - Problem: pnpm v10 blockiert Postinstall-Skripte (sharp/electron). Interaktive Freigabe führte zu Hängern.
  - Lösung: Explizite Freigabe via `pnpm approve-builds` und später Skript `postinstall: electron-builder install-app-deps` im Desktop-Paket. Zusätzlich Rebuild-Schritt für Electron integriert.

- CLI – Pfadfehler bei nicht existierenden Eingaben
  - Problem: CLI brach mit Stacktrace ab, wenn Pfade nicht existierten.
  - Lösung: Vorvalidierung (stat) und freundliche Fehlermeldung, ExitCode=1 statt Stacktrace.

- Desktop – `window.jpegme` undefined (Preload)
  - Problem: Preload wurde nicht korrekt geladen; `convertFiles` war undefined.
  - Ursache: ESM/`__dirname` in Electron, falscher Preload-Pfad und fehlende Context-Isolation-Konfiguration.
  - Lösung: `fileURLToPath` + `appDir`, `contextIsolation: true`, `nodeIntegration: false`, Preload exportiert `jpegme` API. Preload in `dist/preload.js` generiert und korrekt referenziert.

- AVIF/HEIF Unterstützung
  - Problem: `sharp` Build ohne AVIF/HEIF Decoder → Decoder-Fehler.
  - Entscheidung: Option A (vorerst Hinweis). UI-Banner „AVIF wird derzeit nicht unterstützt“. Capability-Check in Core.

- WEBP/BMP Decoder
  - Problem: Zu strikte Capability-Checks blockierten WEBP/BMP.
  - Lösung: Checks entfernt; Fehlerbehandlung über try/catch. BMP-Fallback via `bmp-js` implementiert (Decode → sharp raw → JPEG).

- Electron Packaging – Portable/Installer hängt („output file is locked“)
  - Problem: 7zip/NSIS/Unpack von Electron wurde durch Windows Defender/Indexing gelockt.
  - Maßnahmen: Prozesse killen (electron/7za/app-builder), Defender-Ausschlüsse für `release`/`dist`/`C:\JPEGme_build`, Bauen in externem Ordner `C:\JPEGme_build`, erneutes Ausführen bei Lock.

- `sharp` Laufzeitfehler (win32-x64 runtime)
  - Problem: ABI-/Binary-Mismatch zwischen Electron (31.7.7) und `sharp` Binary; teils doppelte `sharp`-Instanz (im Core und im Desktop), fehlende Plattformpakete.
  - Lösungen:
    - `@jpegme/core`: `sharp` aus Dependencies entfernt → als `peerDependency` definiert; eine zentrale Instanz im Desktop.
    - Desktop: `sharp@^0.33.5` + `@img/sharp-win32-x64` installiert; `electron-rebuild -f -w sharp` im Buildprozess.
    - Entpackte Builds (`dir`) genutzt, um asar/Unpack-Probleme zu umgehen; testweise `asar: false` gesetzt.

- Übergröße der EXE (~1.3 GB)
  - Problem: Zu weite `files`-Whitelist (gesamtes `node_modules`) + alle Chromium-Sprachen → sehr große Artefakte.
  - Lösung: Whitelist reduziert (nur benötigte Module), `electronLanguages` auf `de`/`en-US`, `compression: maximum`. Portable-EXE wird künftig dadurch deutlich kleiner. (Hinweis: Erst nach erfolgreichem stabilen Lauf reaktiv.)

- Renderer-Validierung/A11y
  - Problem: Inline-Styles und fehlende Slider-Attribute führten zu Lint/Accessibility-Hinweisen.
  - Lösung: Banner-Styles in `styles.css` ausgelagert; `role="status"`/`aria-live="polite"`; Slider `step`/`aria-labelledby` ergänzt.

## Offene Punkte / Risiken

- AVIF/HEIF bleiben als Hinweis bis ein `sharp`/libheif-Build verfügbar ist oder ein alternativer Fallback integriert wird.
- Windows Defender kann Builds/Packaging weiterhin sporadisch blockieren; empfohlen: Ausschlüsse beibehalten, Build in frischen Output-Ordnern.
- Installer (NSIS) erst nach stabilen Portable-Builds finalisieren; aktuell `dir`/portable bevorzugt.

## Aktueller Stand

- CLI einsatzfähig (PNG/JPEG/WEBP/TIFF/BMP mit Fallback), Desktop-UI lauffähig (Drag&Drop, Qualität, sRGB, EXIF/ICC, Banner), Portable entpackt (`win-unpacked`) startbar. Packaging in `C:\JPEGme_build*` verlagert. Weitere Hardening-Schritte für `sharp`-Runtime aktiv.
