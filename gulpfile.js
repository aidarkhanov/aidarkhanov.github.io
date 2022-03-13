const buffer = require("vinyl-buffer")
const del = require("del")
const fs = require("fs")
const gulp = require("gulp")
const paths = require("vinyl-paths")
const postcss = require("gulp-postcss")
const replace = require("gulp-replace")
const rev = require("gulp-rev")
const rewrite = require("gulp-rev-rewrite")
const rollup = require("rollup-stream")
const source = require("vinyl-source-stream")
const terser = require("gulp-terser")

gulp.task("styles", () =>
  gulp
    .src("dist/styles/{screen,print}.css")
    .pipe(postcss([
      require("postcss-import"),
      require("postcss-csso")
    ]))
    .pipe(gulp.dest("dist/styles"))
)

gulp.task("scripts", () =>
  rollup({ input: "dist/scripts/main.js", format: "es" })
    .pipe(source("main.js"))
    .pipe(buffer())
    .pipe(terser())
    .pipe(gulp.dest("dist/scripts"))
)

gulp.task("cache:hash", () =>
  gulp
    .src([
      "dist/fonts/*.woff2",
      "dist/images/**/*.{svg,png,jpg}",
      "dist/scripts/main.js",
      "dist/styles/*.css",
      "dist/manifest.json"
    ], { base: "dist" })
    .pipe(paths(del))
    .pipe(rev())
    .pipe(gulp.dest("dist"))
    .pipe(rev.manifest("rev.json"))
    .pipe(gulp.dest("dist"))
)

gulp.task("cache:replace", () => {
  const manifest = fs.readFileSync("dist/rev.json");

  return gulp
    .src([
      "dist/**/*.{html,css}",
      "dist/manifest-*.json"
    ])
    .pipe(rewrite({ manifest }))
    .pipe(gulp.dest("dist"))
})

gulp.task("cache", gulp.series("cache:hash", "cache:replace"))

gulp.task("clean", () =>
  del([
    "dist/styles/**/*",
    "!dist/styles/{screen,print}-*.css",
    "dist/scripts/**/*",
    "!dist/scripts/main-*.js",
    "dist/rev.json"
  ])
)

gulp.task("build", gulp.series(
  "styles",
  "scripts",
  "cache",
  "clean"
))
