// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol"; //for ipfs


contract DigitalBadge is  Ownable, ReentrancyGuard, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address payable organizer = payable(msg.sender); 
    string eventName;

    string eventSymbol;
    string[] categories; 

    mapping(uint256 => Badge) public badgeIDs; 

    struct Badge{
        address organizer;
        address badgeOwner; 
        string category; //category within ticket 

    }   


    event badgeMinted(uint256 tokenId, address recipient); 
    string baseURI = ""; 


    constructor ( string[] memory _categories, string memory _eventName, uint256 _commission, string memory _eventSymbol) ERC721(_eventName, _eventSymbol) public payable{
        eventName = _eventName; 
        eventSymbol = _eventSymbol;
        categories = _categories; 
    } 


    function mint(string memory category, address owner, string memory tokenURI) public virtual payable returns(uint256){
        Badge memory newBadge = Badge( 
            organizer,owner, category
        ); 

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(owner, newItemId);
        _setTokenURI(newItemId, tokenURI); 
        badgeIDs[newItemId]= newBadge;
        emit badgeMinted(newItemId, owner);

        return newItemId;  //get the newItemId
    }

    function getBadgeDetails(uint256 tokenId) public view returns(Badge memory badge){ 
        return badgeIDs[tokenId];

    }



}