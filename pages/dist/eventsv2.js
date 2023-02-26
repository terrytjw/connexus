"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var client_1 = require("@prisma/client");
var swr_1 = require("swr");
var axios_1 = require("axios");
var react_1 = require("react");
var ethers_1 = require("ethers");
var constants_1 = require("../lib/constants");
var BigNumber = require("bignumber.js");
//Smart Contract Stuff:
var contract = require("../artifacts/contracts/SimpleEvent.sol/SimpleEvent.json");
var provider = new ethers_1.ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/3oE8BGNsfXndWYJbZxEkLCsZZ6STLO2R");
var abi = contract.abi;
var bytecode = contract.bytecode;
var signer = new ethers_1.ethers.Wallet(constants_1.smartContract.privateKey, provider);
var EventsPage = function (props) {
    function fetchEvents(url) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].get(url)];
                    case 1:
                        response = _a.sent();
                        data = response.data;
                        return [2 /*return*/, data];
                }
            });
        });
    }
    function createEvent() {
        return __awaiter(this, void 0, void 0, function () {
            var Event_contract, address, eventImage, eventBannerPicture, eventName, date, ticket_categories, categories, category_quantity, category_price, i, cat, input, event_contract, event, response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Event_contract = new ethers_1.ethers.ContractFactory(abi, bytecode, signer);
                        address = {
                            address1: "123 Main St",
                            address2: "Apt 1",
                            locationName: "Tenderloin",
                            postalCode: "31231"
                        };
                        eventImage = ;
                        eventBannerPicture = "https://images.ctfassets.net/q5ulk4bp65r7/4v5Y0WDMQ7sUY5OKZvmCuA/47116f107532fb0d1acebc3e0d4e172f/ape_coin.png?w=768&fm=png";
                        eventName = "Connexus";
                        date = new Date();
                        ticket_categories = [
                            {
                                name: "General Admission",
                                totalTicketSupply: 100,
                                price: 1,
                                startDate: new Date(),
                                endDate: new Date(),
                                description: "General Admission"
                            },
                            {
                                name: "VIP Pass",
                                totalTicketSupply: 100,
                                price: 1,
                                startDate: new Date(),
                                endDate: new Date(),
                                description: "This is a VIP Pass"
                            },
                        ];
                        categories = [];
                        category_quantity = [];
                        category_price = [];
                        for (i = 0; i < ticket_categories.length; i++) {
                            cat = ticket_categories[i];
                            categories.push(cat.name);
                            category_quantity.push(cat.totalTicketSupply);
                            input = cat.price;
                            category_price.push(input);
                            /* issues with big number
                            if (input < 0.1){
                              category_price.push(input * 10**(18));
                            } else{
                              category_price.push(ethers.BigNumber.from(input).mul(BigNumber.from(10).pow(18)));
                            } */
                            //rounds off to 1 matic bcos bigint > float
                        }
                        console.log(category_price);
                        return [4 /*yield*/, Event_contract.deploy(categories, category_price, category_quantity, eventName, date, address.locationName, 1, 100, eventName)];
                    case 1:
                        event_contract = _a.sent();
                        console.log("Contract successfully deployed => ", event_contract.address);
                        event = {
                            eventId: 1,
                            eventName: "This is a new event",
                            category: [client_1.CategoryType.AUTO_BOAT_AIR],
                            address: {
                                create: {
                                    address1: address.address1,
                                    address2: address.address2,
                                    locationName: address.locationName,
                                    postalCode: address.postalCode
                                }
                            },
                            startDate: new Date(),
                            endDate: new Date(),
                            images: [],
                            summary: "This is just a summary",
                            description: "This is just a description",
                            visibilityType: client_1.VisibilityType.DRAFT,
                            privacyType: client_1.PrivacyType.PUBLIC,
                            publishStartDate: new Date(),
                            scAddress: event_contract.address,
                            ticketURIs: [],
                            publishType: "NOW",
                            tickets: ticket_categories
                        };
                        return [4 /*yield*/, axios_1["default"].post("http://localhost:3000/api/events", event)];
                    case 2:
                        response = _a.sent();
                        data = response.data;
                        console.log("Event Created");
                        return [2 /*return*/];
                }
            });
        });
    }
    function deleteEvent() {
        return __awaiter(this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"]["delete"]("http://localhost:3000/api/events/3")];
                    case 1:
                        response = _a.sent();
                        data = response.data;
                        console.log("Event Deleted");
                        return [2 /*return*/];
                }
            });
        });
    }
    function mintOnChain(eventInfo, ticket_category) {
        return __awaiter(this, void 0, void 0, function () {
            var eventName, addressId, startDate, endDate, response_location, metaData, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(ticket_category);
                        eventName = eventInfo.eventName, addressId = eventInfo.addressId, startDate = eventInfo.startDate, endDate = eventInfo.endDate;
                        return [4 /*yield*/, axios_1["default"].get("http://localhost:3000/api/addresses/" + addressId)];
                    case 1:
                        response_location = _a.sent();
                        metaData = JSON.stringify({
                            pinataOptions: {
                                cidVersion: 1
                            },
                            pinataMetadata: {
                                name: "testing",
                                keyvalues: {
                                    customKey: "customValue",
                                    customKey2: "customValue2"
                                }
                            },
                            pinataContent: {
                                event: eventName,
                                location: response_location.data.locationName,
                                startDate: startDate,
                                endDate: endDate,
                                category: ticket_category
                            }
                        });
                        url = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
                        return [2 /*return*/, axios_1["default"].post(url, metaData, {
                                headers: {
                                    "Content-Type": "application/json",
                                    pinata_api_key: constants_1.smartContract.pinataApiKey,
                                    pinata_secret_api_key: constants_1.smartContract.pinataSecretApiKey
                                }
                            })];
                }
            });
        });
    }
    function mintTicket() {
        return __awaiter(this, void 0, void 0, function () {
            var userId, eventId, ticket_category, response, eventInfo, scAddress, ticketURIs, tickets, user_response, userInfo, user_tickets, ipfsHash, link, event_contract, category_info, price_needed, mint_ticket, j, ticket, response_tickets, updated_user, user_update, updated_event, updated_response, updated_data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = 1;
                        eventId = 2;
                        ticket_category = "VIP Pass";
                        return [4 /*yield*/, axios_1["default"].get("http://localhost:3000/api/events/" + eventId.toString())];
                    case 1:
                        response = _a.sent();
                        eventInfo = response.data;
                        scAddress = eventInfo.scAddress, ticketURIs = eventInfo.ticketURIs, tickets = eventInfo.tickets;
                        return [4 /*yield*/, axios_1["default"].get("http://localhost:3000/api/users/" + userId.toString())];
                    case 2:
                        user_response = _a.sent();
                        userInfo = user_response.data;
                        user_tickets = userInfo.tickets;
                        return [4 /*yield*/, mintOnChain(eventInfo, ticket_category)];
                    case 3:
                        //Mint + IPFS
                        response = _a.sent();
                        ipfsHash = response.data.IpfsHash;
                        console.log(ipfsHash);
                        if (ipfsHash == "")
                            return [2 /*return*/];
                        link = "https://gateway.pinata.cloud/ipfs/" + ipfsHash;
                        console.log("IPFS Hash Link  : ", link);
                        event_contract = new ethers_1.ethers.Contract(scAddress, abi, signer);
                        console.log(scAddress);
                        return [4 /*yield*/, event_contract.getCategoryInformation(ticket_category)];
                    case 4:
                        category_info = _a.sent();
                        price_needed = category_info._price._hex;
                        console.log(price_needed);
                        console.log("output : ", parseInt(price_needed, 16));
                        return [4 /*yield*/, event_contract.mint(ticket_category, link, {
                                gasLimit: 2100000,
                                value: price_needed
                            })];
                    case 5:
                        mint_ticket = _a.sent();
                        console.log(mint_ticket.hash);
                        j = 0;
                        _a.label = 6;
                    case 6:
                        if (!(j < tickets.length)) return [3 /*break*/, 10];
                        if (!(tickets[j].name == ticket_category)) return [3 /*break*/, 9];
                        console.log(tickets[j].currentTicketSupply);
                        ticket = {
                            ticketId: tickets[j].ticketId,
                            name: tickets[j].name,
                            totalTicketSupply: tickets[j].totalTicketSupply,
                            currentTicketSupply: tickets[j].currentTicketSupply + 1,
                            price: tickets[j].price,
                            startDate: tickets[j].startDate,
                            endDate: tickets[j].endDate,
                            description: tickets[j].description
                        };
                        return [4 /*yield*/, axios_1["default"].post("http://localhost:3000/api/tickets/" + tickets[j].ticketId.toString(), ticket)];
                    case 7:
                        response_tickets = _a.sent();
                        user_tickets.push(tickets[j]);
                        updated_user = __assign(__assign({}, userInfo), { tickets: user_tickets });
                        console.log(updated_user);
                        return [4 /*yield*/, axios_1["default"].post("http://localhost:3000/api/users/" + userId.toString(), updated_user)];
                    case 8:
                        user_update = _a.sent();
                        console.log(user_update);
                        return [3 /*break*/, 10];
                    case 9:
                        j++;
                        return [3 /*break*/, 6];
                    case 10:
                        ticketURIs.push(link);
                        updated_event = {
                            eventName: eventInfo.eventName,
                            addressId: eventInfo.addressId,
                            category: eventInfo.category,
                            startDate: eventInfo.startDate,
                            endDate: eventInfo.endDate,
                            images: eventInfo.images,
                            summary: eventInfo.summary,
                            description: eventInfo.description,
                            visibilityType: eventInfo.visibilityType,
                            privacyType: eventInfo.privacyType,
                            publishStartDate: eventInfo.publishStartDate,
                            ticketURIs: ticketURIs,
                            publishType: eventInfo.publishType
                        };
                        console.log(updated_event);
                        return [4 /*yield*/, axios_1["default"].post("http://localhost:3000/api/events/" + eventId.toString(), updated_event)];
                    case 11:
                        updated_response = _a.sent();
                        updated_data = updated_response.data;
                        console.log("Data uploaded for both event + user");
                        return [2 /*return*/];
                }
            });
        });
    }
    function getTicket(ipfs_link) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1["default"].get(ipfs_link, {
                            headers: {
                                Accept: "text/plain"
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        console.log(response);
                        return [2 /*return*/, response];
                }
            });
        });
    }
    function updateEvent() {
        return __awaiter(this, void 0, void 0, function () {
            var event_id, response_event, eventInfo, scAddress, ticketURIs, tickets, ticket_categories, map, updatedTickets, k, new_ticket, ticket, updatedTicketName, j, categories, category_quantity, category_price, i, cat, input, event_contract, category_info, newticketURIs, updated_event, i, ticketURI, response_metadata, existing_user_ticket_category, new_user_ticket_category, category_chosen, event_contract_1, response_pinning, ipfsHash, link, changeTokenURI, updated_event_withuri, updated_response, updated_data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        event_id = 2;
                        return [4 /*yield*/, axios_1["default"].get("http://localhost:3000/api/events/" + event_id.toString())];
                    case 1:
                        response_event = _a.sent();
                        eventInfo = response_event.data;
                        scAddress = eventInfo.scAddress, ticketURIs = eventInfo.ticketURIs, tickets = eventInfo.tickets;
                        console.log(eventInfo);
                        ticket_categories = [
                            {
                                name: "Genera",
                                totalTicketSupply: 100,
                                price: 1,
                                startDate: new Date(),
                                endDate: new Date(),
                                description: "General Admission"
                            },
                            {
                                name: "VI",
                                totalTicketSupply: 1,
                                price: 1,
                                startDate: new Date(),
                                endDate: new Date(),
                                description: "This is a VIP Pass"
                            },
                            {
                                name: "Club Pengu",
                                totalTicketSupply: 0,
                                price: 1,
                                startDate: new Date(),
                                endDate: new Date(),
                                description: ""
                            },
                        ];
                        map = {};
                        updatedTickets = __spreadArrays(tickets);
                        k = 0;
                        _a.label = 2;
                    case 2:
                        if (!(k < ticket_categories.length)) return [3 /*break*/, 7];
                        if (!(k > tickets.length - 1)) return [3 /*break*/, 4];
                        //create new ticket category
                        console.log(tickets);
                        new_ticket = {
                            name: ticket_categories[k].name,
                            totalTicketSupply: ticket_categories[k].totalTicketSupply,
                            currentTicketSupply: 0,
                            price: ticket_categories[k].price,
                            startDate: ticket_categories[k].startDate,
                            endDate: ticket_categories[k].endDate,
                            description: ticket_categories[k].description,
                            eventId: event_id
                        };
                        updatedTickets.push(new_ticket);
                        return [4 /*yield*/, axios_1["default"].post("http://localhost:3000/api/tickets", new_ticket)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        if (tickets[k].currentTicketSupply >=
                            ticket_categories[k].totalTicketSupply) {
                            console.log("Not allowed to change");
                            //return ""
                        }
                        ticket = {
                            ticketId: tickets[k].ticketId,
                            name: ticket_categories[k].name,
                            totalTicketSupply: ticket_categories[k].totalTicketSupply,
                            currentTicketSupply: tickets[k].currentTicketSupply,
                            price: ticket_categories[k].price,
                            startDate: ticket_categories[k].startDate,
                            endDate: ticket_categories[k].endDate,
                            description: ticket_categories[k].description
                        };
                        return [4 /*yield*/, axios_1["default"].post("http://localhost:3000/api/tickets/" + tickets[k].ticketId.toString(), ticket)];
                    case 5:
                        _a.sent();
                        console.log(ticket);
                        console.log("Updated existing");
                        if (updatedTickets[k].name !== undefined) {
                            updatedTicketName = updatedTickets[k].name;
                            map[updatedTicketName] = ticket_categories[k].name;
                        }
                        _a.label = 6;
                    case 6:
                        k++;
                        return [3 /*break*/, 2];
                    case 7:
                        console.log("updating tickets");
                        if (!(ticket_categories.length < tickets.length)) return [3 /*break*/, 12];
                        j = ticket_categories.length - 1;
                        _a.label = 8;
                    case 8:
                        if (!(j <= tickets.length)) return [3 /*break*/, 12];
                        if (!(tickets[j].currentTicketSupply > 0)) return [3 /*break*/, 9];
                        console.log("Not allowed to change");
                        return [3 /*break*/, 11];
                    case 9: return [4 /*yield*/, axios_1["default"]["delete"]("http://localhost:3000/api/tickets/" +
                            tickets[j].ticketId.toString())];
                    case 10:
                        _a.sent();
                        _a.label = 11;
                    case 11:
                        j++;
                        return [3 /*break*/, 8];
                    case 12:
                        categories = [];
                        category_quantity = [];
                        category_price = [];
                        for (i = 0; i < ticket_categories.length; i++) {
                            cat = ticket_categories[i];
                            categories.push(cat.name);
                            category_quantity.push(cat.totalTicketSupply);
                            input = cat.price;
                            category_price.push(input);
                            /* issues with big number
                            if (input < 0.1){
                              category_price.push(input * 10**(18));
                            } else{
                              category_price.push(ethers.BigNumber.from(input).mul(BigNumber.from(10).pow(18)));
                            } */
                            //rounds off to 1 matic bcos bigint > float
                        }
                        event_contract = new ethers_1.ethers.Contract(scAddress, abi, signer);
                        return [4 /*yield*/, event_contract.changeCategories(categories, category_price, category_quantity, {
                                gasLimit: 2100000
                            })];
                    case 13:
                        category_info = _a.sent();
                        console.log("Contract for ticket categories updated");
                        //Updating Event Information + repin all ipfs links again
                        console.log("Event Info");
                        newticketURIs = [];
                        updated_event = {
                            //whatever the updated ticket details are
                            eventName: "This is a new event",
                            addressId: eventInfo.addressId,
                            category: [client_1.CategoryType.AUTO_BOAT_AIR],
                            startDate: new Date(),
                            endDate: new Date(),
                            images: [],
                            summary: "This is just a summary",
                            description: "This is just a description",
                            visibilityType: client_1.VisibilityType.DRAFT,
                            privacyType: client_1.PrivacyType.PUBLIC,
                            publishStartDate: new Date(),
                            ticketURIs: [],
                            publishType: "NOW"
                        };
                        if (!(ticketURIs.length > 0)) return [3 /*break*/, 21];
                        i = 0;
                        _a.label = 14;
                    case 14:
                        if (!(i < ticketURIs.length)) return [3 /*break*/, 19];
                        ticketURI = ticketURIs[i];
                        console.log(ticketURI);
                        return [4 /*yield*/, getTicket(ticketURI)];
                    case 15:
                        response_metadata = _a.sent();
                        console.log(response_metadata.data);
                        existing_user_ticket_category = response_metadata.data.category;
                        new_user_ticket_category = map[existing_user_ticket_category];
                        category_chosen = new_user_ticket_category;
                        console.log(category_chosen);
                        event_contract_1 = new ethers_1.ethers.Contract(scAddress, abi, signer);
                        return [4 /*yield*/, mintOnChain(updated_event, category_chosen)];
                    case 16:
                        response_pinning = _a.sent();
                        ipfsHash = response_pinning.data.IpfsHash;
                        console.log(ipfsHash);
                        if (ipfsHash == "")
                            return [2 /*return*/];
                        link = "https://gateway.pinata.cloud/ipfs/" + ipfsHash;
                        console.log("IPFS Hash Link  : ", link);
                        return [4 /*yield*/, event_contract_1.setNewTokenURI(i, link, {
                                gasLimit: 2100000
                            })];
                    case 17:
                        changeTokenURI = _a.sent();
                        console.log("Changed for Token ", i);
                        newticketURIs.push(link);
                        _a.label = 18;
                    case 18:
                        i++;
                        return [3 /*break*/, 14];
                    case 19:
                        console.log("Updated Tickets => ", tickets);
                        updated_event_withuri = {
                            eventName: "This is a new event",
                            addressId: eventInfo.addressId,
                            category: [client_1.CategoryType.AUTO_BOAT_AIR],
                            startDate: new Date(),
                            endDate: new Date(),
                            images: [],
                            summary: "This is just a summary",
                            description: "This is just a description",
                            visibilityType: client_1.VisibilityType.DRAFT,
                            privacyType: client_1.PrivacyType.PUBLIC,
                            publishStartDate: new Date(),
                            ticketURIs: newticketURIs,
                            publishType: "NOW"
                        };
                        console.log("updated event:");
                        console.log(updated_event_withuri);
                        return [4 /*yield*/, axios_1["default"].post("http://localhost:3000/api/events/" + event_id.toString(), updated_event_withuri)];
                    case 20:
                        updated_response = _a.sent();
                        updated_data = updated_response.data;
                        console.log("Data uploaded");
                        return [3 /*break*/, 22];
                    case 21:
                        console.log("Nothing to update for tokenURIs in event");
                        _a.label = 22;
                    case 22: return [2 /*return*/];
                }
            });
        });
    }
    var _a = swr_1["default"]("http://localhost:3000/api/events", fetchEvents), data = _a.data, error = _a.error, isLoading = _a.isLoading;
    console.log(data);
    return (react_1["default"].createElement("div", null,
        "EventsPage",
        react_1["default"].createElement("br", null),
        react_1["default"].createElement("button", { onClick: updateEvent }, "Click me to update"),
        ";",
        react_1["default"].createElement("br", null),
        react_1["default"].createElement("button", { onClick: createEvent }, "Click me to create"),
        ";",
        react_1["default"].createElement("br", null),
        react_1["default"].createElement("button", { onClick: deleteEvent }, "Click me to delete"),
        ";",
        react_1["default"].createElement("br", null),
        react_1["default"].createElement("br", null),
        react_1["default"].createElement("br", null),
        react_1["default"].createElement("button", { onClick: mintTicket }, "Click me to mint tickets"),
        ";",
        react_1["default"].createElement("br", null)));
};
exports["default"] = EventsPage;
