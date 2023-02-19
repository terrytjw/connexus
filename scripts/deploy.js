async function main() {
  const HelloWorld = await ethers.getContractFactory("SimpleEvent");

  // Start deployment, returning a promise that resolves to a contract object
  const hello_world = await HelloWorld.deploy(["a","b"], [1,1], [1,1], "nice", "02021200", "capitol", 1, 1, "yo");   


  console.log("Contract deployed to address:", hello_world.address);
}

main()
 .then(() => process.exit(0))
 .catch(error => {
   console.error(error);
   process.exit(1);
 });

