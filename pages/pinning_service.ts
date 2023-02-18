/*
After user clicks mint -> metadata assembled -> pin -> returns the link containing ipfs hash 
-> this is the tokenURI added as a tokenURI param for user to store in the token

*/
var axios = require('axios');
var data = JSON.stringify({
  "pinataOptions": {
    "cidVersion": 1
  },
  "pinataMetadata": {
    "name": "testing",
    "keyvalues": {
      "customKey": "customValue",
      "customKey2": "customValue2"
    }
  },
  "pinataContent": {
    "somekey": "somevalue"
  }
});

var config = {
  method: 'post',
  url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzNWRhMWQzNS0xZjc0LTRhNTUtODBlMC04NTMwNzE2OGU5Y2EiLCJlbWFpbCI6ImNjd2hoOThAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjQwOWY4MTEzZWExNmM4YTkyYjJlIiwic2NvcGVkS2V5U2VjcmV0IjoiYjczMGY0NDQzYzU3NjdmOTIxOWQ2YmFiNmQ5YzRlOWI5MTRlMmNmMDYyNDA2ZmJmZTA1OTJlZTAwOGYzNjEyNyIsImlhdCI6MTY3NjU5Njk3Mn0.cHoK9KdtC1YM7lWJKYShAgW61mRiwpXVCbjPBwfjfD8'
  },
  data : data
};

const res = await axios(config);

console.log(res.data);

/*
Output: 
{
    IpfsHash: This is the IPFS multi-hash (CID) provided back for your content,
    PinSize: This is how large (in bytes) the content you just pinned is,
    Timestamp: This is the timestamp for your content pinning (represented in ISO 8601 format)
}
*/



//
var metadata_data = JSON.stringify({
  "pinataOptions": {
    "cidVersion": 1
  },
  "pinataMetadata": {
    "name": "testing",
    "keyvalues": {
      "customKey": "customValue",
      "customKey2": "customValue2"
    }
  },
  "pinataContent": { //this is the metadata being stored 
    "somekey": "somevalue"
  }
});

const pinataApiKey = "be74f69d81d8435228e2";
const pinataSecretApiKey=  "9556c5997d472165edae4fd15461a8bac3d454bd73088101a95ae45657ea4bdf";
const JWT= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzNWRhMWQzNS0xZjc0LTRhNTUtODBlMC04NTMwNzE2OGU5Y2EiLCJlbWFpbCI6ImNjd2hoOThAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImJlNzRmNjlkODFkODQzNTIyOGUyIiwic2NvcGVkS2V5U2VjcmV0IjoiOTU1NmM1OTk3ZDQ3MjE2NWVkYWU0ZmQxNTQ2MWE4YmFjM2Q0NTRiZDczMDg4MTAxYTk1YWU0NTY1N2VhNGJkZiIsImlhdCI6MTY3NjYwMzU2Nn0.kGTRDcG0Xe0Be8yfzT9A4Vuc2jkxs32JqjJF0XqOOmY";

const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
//we gather a local file from the API for this example, but you can gather the file from anywhere
await axios.post(url,
  metadata_data,
    {
        headers: {
          'Content-Type': 'application/json', 
            'pinata_api_key': pinataApiKey,
            'pinata_secret_api_key': pinataSecretApiKey
        }, 
    }
).then(function (response) {
    //handle response here
    console.log(response.data);
    /*  
    Returns the IPFS hash  
    https://gateway.pinata.cloud/ipfs/QmY8vLqisQKUQPYxmX4ufxpFCp9gMjCRByRsCNmqUTMakE 
    //set tokenURI for the mint function when user wants to mint the ticket 


    */
}).catch(function (error) {
    //handle error here
});
