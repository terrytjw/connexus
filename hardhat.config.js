/**
* @type import('hardhat/config').HardhatUserConfig
*/

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

// To deploy again : https://docs.alchemy.com/docs/hello-world-smart-contract 
module.exports = {
   solidity: "0.8.9",
   defaultNetwork: "polygon_mumbai",
   networks: {
      hardhat: {},
      polygon_mumbai: {
         url: "https://polygon-mumbai.g.alchemy.com/v2/3oE8BGNsfXndWYJbZxEkLCsZZ6STLO2R",
         accounts: [`0x${"3340e2f92064b7494823da63fcaa1dd1515e87e72aaa2d18e461238ce4133cf9"}`]
      }
   },
}