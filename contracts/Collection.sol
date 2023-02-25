// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol"; //for ipfs

contract Collection is  Ownable, ReentrancyGuard, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address payable collectionOwner = payable(msg.sender); 
    address payable platform; //create our own wallet to collect
    uint256 collectionSupply; 
    string collectionName;
    uint256 commission; 
    string description;
    uint256 maxMerchPerAddress = 1 ;
    uint256 mintingPlatformFee = 0.02 ether;
    address protocolRecipient = 0xdD870fA1b7C4700F2BD7f44238821C26f7392148; //arbitray address

    string collectionSymbol;
    
    mapping(string => MerchType) idToMerchTypeDetails;

    struct MerchType{
        string merchType;
        uint256 price; 
        uint256 maxMerchSupply; 
        uint256 currentMerchSupply;

    }

    mapping(uint256 => Merchandise) public merchIDs; 
    mapping(address => uint256) public merchPerOwner; 

   
    enum collectionStatus {FEATURED, ON_SALE, SOLD}


    struct Merchandise{
        address collectionOwner;
        address merchOwner; 
        MerchType merchType;  
        uint256 currentPrice; 
        collectionStatus _collectionStatus;  //enum 

    }   
    modifier isMerchOwner(uint256 id){
        require(merchIDs[id].merchOwner == msg.sender, "Not authorized");
        _;
    }

    modifier isCollectionOwner(){
        require(collectionOwner == msg.sender, "Not authorized to adjust sale");
        _;
    }

    string[] merchCategories; 
    uint256[] merchCategoryPrices; 
    uint256[] merchCategoryLimits;

    event userMints(address user);
    event merchMinted(uint256 tokenId, address recipient);

    constructor ( string[] memory _categories, uint256[] memory _categoryPrices, uint256[] memory _categoryLimits,  string memory _collectionName, string memory _description,  uint256 _commission,  string memory _collectionSymbol) ERC721(_collectionName, _collectionSymbol) public payable{
        //
        merchCategories = _categories; 
        merchCategoryPrices = _categoryPrices; 
        merchCategoryLimits = _categoryLimits;
        
        collectionName = _collectionName; 
        description = _description; 
        collectionSymbol = _collectionSymbol;
        commission = _commission; //as a percentage
    

        require(merchCategories.length == merchCategoryPrices.length, "Please key in again"); 
        require(merchCategories.length == merchCategoryLimits.length, "Please key in again");
        collectionSupply = 0;
        for(uint i = 0 ; i < merchCategories.length; i ++){
            MerchType memory merch_details = MerchType(
            merchCategories[i], merchCategoryPrices[i], merchCategoryLimits[i], 0 );
            idToMerchTypeDetails[merchCategories[i]] = merch_details;
            collectionSupply += merchCategoryLimits[i];
        }


    } 

    function changeCategories(string[] memory new_categories, uint256[] memory new_categoryPrices, uint256[] memory new_categoryLimits) isCollectionOwner() public {
        require(new_categories.length == new_categoryPrices.length, "Please key in again"); 
        require(new_categories.length == new_categoryLimits.length, "Please key in again");
        collectionSupply = 0 ; 
        for(uint i = 0 ; i < new_categories.length; i ++){
            //checks will be done in the db 
            MerchType memory merch_details = MerchType(
            merchCategories[i], merchCategoryPrices[i], merchCategoryLimits[i], 0 );
            idToMerchTypeDetails[merchCategories[i]] = merch_details;
            collectionSupply += new_categoryLimits[i];
        }
    }

    function setNewTokenURI(uint256 tokenId, string memory tokenURI) public{
       _setTokenURI(tokenId, tokenURI);

    }


    function mint(string memory merchCategory, string memory tokenURI) public virtual payable returns(uint256){
        emit userMints(msg.sender); //event emitted
        //script should capture the event 

        require(merchPerOwner[msg.sender] < maxMerchPerAddress, "Exceeded Max Minting");    
        require(idToMerchTypeDetails[merchCategory].currentMerchSupply < idToMerchTypeDetails[merchCategory].maxMerchSupply, "Exceeded Category minting");
        require(msg.value >= (idToMerchTypeDetails[merchCategory].price * (1 + (commission/100))), "Not enough ETH");
        idToMerchTypeDetails[merchCategory].currentMerchSupply = idToMerchTypeDetails[merchCategory].currentMerchSupply + 1; 
        Merchandise memory newMerchandise = Merchandise( 
            collectionOwner, msg.sender, idToMerchTypeDetails[merchCategory],idToMerchTypeDetails[merchCategory].price, collectionStatus.ON_SALE
        );  

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI); 

        merchPerOwner[msg.sender] += 1;
        merchIDs[newItemId] = newMerchandise;
        emit merchMinted(newItemId, msg.sender);

        return newItemId;  //get the newItemId
    }

    function getMerchDetails(uint256 tokenId) public view returns(Merchandise memory merchandise){ 
        return merchIDs[tokenId];

    }

    function getMerchinformation(string memory category) public view returns (uint256 _price, uint256 _maxNumber, uint256 _currentSupply){
        return (idToMerchTypeDetails[category].price, idToMerchTypeDetails[category].maxMerchSupply, idToMerchTypeDetails[category].currentMerchSupply) ;
    }

    function getCommission() public view returns(uint256){
        return commission; 
    }



}