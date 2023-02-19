"use strict";

function main() {
  var HelloWorld, hello_world;
  return regeneratorRuntime.async(function main$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(ethers.getContractFactory("SimpleEvent"));

        case 2:
          HelloWorld = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(HelloWorld.deploy(["a", "b"], [1, 1], [1, 1], "nice", "02021200", "capitol", 1, 1, "yo"));

        case 5:
          hello_world = _context.sent;
          console.log("Contract deployed to address:", hello_world.address);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}

main().then(function () {
  return process.exit(0);
})["catch"](function (error) {
  console.error(error);
  process.exit(1);
});