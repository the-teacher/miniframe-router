const esbuild = require("esbuild");

// Check if watch flag is present in command line arguments
const isWatch = process.argv.includes("--watch");

/** @type {import('esbuild').BuildOptions} */
const config = {
  entryPoints: ["src.ts/index.ts"],
  bundle: true,
  outdir: "src",
  platform: "node",
  target: "node18",
  format: "cjs",
  sourcemap: true,
  external: ["express"], // Exclude express from bundle
};

if (isWatch) {
  // Start watch mode for development
  esbuild.context(config).then((ctx) => {
    ctx.watch();
    console.log("Watching for changes...");
  });
} else {
  // Run single build
  esbuild.build(config).then(() => {
    console.log("Build complete");
  });
}
