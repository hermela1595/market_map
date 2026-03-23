// CommonJS bootstrap for hosting environments that load app entry with require().
// It forwards startup to the ESM server implementation in server.js.
(function bootstrap() {
  var dynamicImport;

  try {
    dynamicImport = new Function("modulePath", "return import(modulePath)");
  } catch (error) {
    console.error(
      "Failed to create dynamic import function:",
      error && error.message ? error.message : error,
    );
    process.exit(1);
    return;
  }

  dynamicImport("./server.js").catch(function (error) {
    console.error("Failed to start ESM server from server.js");
    console.error(error && error.stack ? error.stack : error);
    console.error(
      "Use Node.js 18+ and set startup file to server.cjs (or run npm start).",
    );
    process.exit(1);
  });
})();
