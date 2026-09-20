# Changelog

All notable changes to this project are documented here. This project follows
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Gradient edge mask matching the web version, with `maskHeight` and `maskWidth`
  props mirroring its `--number-flow-mask-*` CSS variables.
- ESLint, Prettier and a CI workflow running lint, format, typecheck, tests and
  a packaging check.

### Changed

- `lineHeight` is pinned to `fontSize`, matching the web's `line-height: 1`, so a
  digit travels the same distance per step as it does on the web.
- The masked container animates its width on the transform timing instead of
  snapping while its contents slide.
- Reanimated layout, entering and exiting animations are built per component.
  The builders are mutable, so sharing one instance let digits clobber each
  other's configuration.

### Fixed

- `useCanAnimate` is called unconditionally, so toggling `animated` no longer
  changes hook order.
- Builds emit CommonJS and run on install, so installing straight from a git
  remote resolves `main` and `types`.

## [0.1.0]

- Initial release.
