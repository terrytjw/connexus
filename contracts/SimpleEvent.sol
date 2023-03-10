//Alchemy Key : https://polygon-mumbai.g.alchemy.com/v2/3oE8BGNsfXndWYJbZxEkLCsZZ6STLO2R 

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol"; //for ipfs

//each event has an array of tickets 
//for any public member to mint
//building minting platform for users to create their tickets 

contract SimpleEvent is  Ownable, ReentrancyGuard, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address payable organizer = payable(msg.sender); 
    address payable platform; //create our own wallet to collect
    uint256 ticketSupply; 
    uint256 currentTicketSupply; 
    string eventName;
    string company; 
    string dateTime; 
    string venue; 
    uint256 commission; 
    uint256 maxTicketsPerAddress;
    uint256 mintingPlatformFee = 0.02 ether;
    address protocolRecipient = 0xdD870fA1b7C4700F2BD7f44238821C26f7392148; //arbitray address

    string eventSymbol;
    mapping(string => Category) idToCategoryDetails;

    struct Category{
        string category;
        uint256 price; 
        uint256 maxNumber; 
        uint256 currentSupply;

    }

    mapping(uint256 => Ticket) public ticketIDs; 
    mapping(address => uint256) public ticketsPerOwner; 

   
    enum ticketStatus{ CREATED, SALE, EXPIRED, CANCELLED } //if organizer decides to cancel the event  -> all tickets nullified

    struct Ticket{
        address organizer;
        address ticketOwner; 
        Category category; //category within ticket 
        uint256 currentPrice; 
        ticketStatus _ticketStatus;  //enum 
        bool ticketListing;
        bool checkIn; 

    }   

    modifier isTicketOwner(uint256 ticketId){
        require(ticketIDs[ticketId].ticketOwner == msg.sender, "Not authorized");
        _;
    }

    modifier isOrganizer(){
        require(organizer == msg.sender, "Not authorized to adjust sale");
        _;
    }

    string[] categories; 
    uint256[] categoryPrices; 
    uint256[] categoryLimits;

    event userMints(address user);
    event ticketMinted(uint256 tokenId, address recipient); 
    event ticketListed(uint256 tokenId, address user, uint256 price); 
    event ticketUnlisted(uint256 tokenId, address user);
    event checkedIn(uint256 tokenId, address user); 

    //need to add in refunds if there is excess payment 

    constructor ( string[] memory _categories, uint256[] memory _categoryPrices, uint256[] memory _categoryLimits,  string memory _eventName, string memory _dateTime, string memory  _venue, uint256 _commission, uint256  _maxTicketPerAddress, string memory _eventSymbol) ERC721(_eventName, _eventSymbol) public payable{
        //
        categories = _categories; 
        categoryPrices = _categoryPrices; 
        categoryLimits = _categoryLimits;
        
        eventName = _eventName; 
        dateTime = _dateTime; 
        venue = _venue; 
        eventSymbol = _eventSymbol;
        commission = _commission; //as a percentage
        maxTicketsPerAddress = _maxTicketPerAddress;
        currentTicketSupply = 0 ; 
    

        require(categories.length == categoryPrices.length, "Please key in again"); 
        require(categories.length == categoryLimits.length, "Please key in again");
        ticketSupply = 0;
        for(uint i = 0 ; i < categories.length; i ++){
            Category memory category_details = Category(
            categories[i], categoryPrices[i], categoryLimits[i], 0 );
            idToCategoryDetails[categories[i]] = category_details;
            ticketSupply += categoryLimits[i];
        }


    } 

    function changeCategories(string[] memory new_categories, uint256[] memory new_categoryPrices, uint256[] memory new_categoryLimits) isOrganizer() public {
        require(new_categories.length == new_categoryPrices.length, "Please key in again"); 
        require(new_categories.length == new_categoryLimits.length, "Please key in again");
        ticketSupply = 0 ; 
        for(uint i = 0 ; i < categories.length; i ++){
            uint256 existingSupply = 0 ; 
            if(keccak256(abi.encodePacked( idToCategoryDetails[categories[i]].category))  == keccak256(abi.encodePacked(new_categories[i]))){
                existingSupply = idToCategoryDetails[categories[i]].currentSupply;
                require(existingSupply < new_categoryLimits[i], "Max supply insufficient, need higher limit");
                
            }
            Category memory new_category_details = Category(
            new_categories[i], new_categoryPrices[i], new_categoryLimits[i], existingSupply );
            idToCategoryDetails[categories[i]] = new_category_details;
            ticketSupply += categoryLimits[i];
        }
    }

    function setNewTokenURI(uint256 tokenId, string memory tokenURI) public{
       _setTokenURI(tokenId, tokenURI);

    }

    function getTokenSupply() public view returns(uint256){ 
        return currentTicketSupply;
    }


    function mint(string memory category, string memory tokenURI) public virtual payable returns(uint256){
        emit userMints(msg.sender); //event emitted
        //script should capture the event 

        require(ticketsPerOwner[msg.sender] < maxTicketsPerAddress, "Exceeded Max Minting");    
        require(idToCategoryDetails[category].currentSupply < idToCategoryDetails[category].maxNumber, "Exceeded Category minting");
        require(msg.value >= (idToCategoryDetails[category].price * (1 + (commission/100))), "Not enough ETH");
        //if all conditions met, create the ticket, update category numbers
        idToCategoryDetails[category].currentSupply = idToCategoryDetails[category].currentSupply + 1; 
        ticketSupply += 1; 
        Ticket memory newTicket = Ticket( 
            organizer, msg.sender, idToCategoryDetails[category],idToCategoryDetails[category].price, ticketStatus.CREATED, false, false
        ); 

        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI); 


        ticketsPerOwner[msg.sender] += 1;
        ticketIDs[newItemId] = newTicket;
        currentTicketSupply += 1;
        emit ticketMinted(newItemId, msg.sender);

        return newItemId;  //get the newItemId
    }

    function getTicketDetails(uint256 tokenId) public view returns(Ticket memory ticket){ 
        return ticketIDs[tokenId];

    }

    function getCategoryInformation(string memory category) public view returns (uint256 _price, uint256 _maxNumber, uint256 _currentSupply){
        return (idToCategoryDetails[category].price, idToCategoryDetails[category].maxNumber, idToCategoryDetails[category].currentSupply) ;
    }

    function getCommission() public view returns(uint256){
        return commission; 
    }


    function checkIn(uint256 tokenId) isTicketOwner(tokenId) public{
        require(ticketIDs[tokenId].checkIn == false, "Ticket already checked in ");
        //also need to check that the ticket event date is not over on FE
        ticketIDs[tokenId].checkIn = true;
        emit checkedIn( tokenId, msg.sender);
    }

    function expiredTicket(uint256 tokenId) public{
        //Auto expire -> front end change to send in parameter
        ticketIDs[tokenId]._ticketStatus = ticketStatus.EXPIRED;
    }

    function eventCancelled() isOrganizer() public{ 
        for (uint i = 0 ; i < currentTicketSupply; i ++){
            ticketIDs[i]._ticketStatus = ticketStatus.CANCELLED;
        }
        //stop all minting on the FE to block and update ticket 
    }



}