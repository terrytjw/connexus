
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  decompressFromBase64,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions
} = require('./runtime/index')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 4.9.0
 * Query Engine version: ceb5c99003b99c9ee2c1d2e618e359c14aef2ea5
 */
Prisma.prismaVersion = {
  client: "4.9.0",
  engine: "ceb5c99003b99c9ee2c1d2e618e359c14aef2ea5"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = () => (val) => val


/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}


  const path = require('path')

const { findSync } = require('./runtime')
const fs = require('fs')

// some frameworks or bundlers replace or totally remove __dirname
const hasDirname = typeof __dirname !== 'undefined' && __dirname !== '/'

// will work in most cases, ie. if the client has not been bundled
const regularDirname = hasDirname && fs.existsSync(path.join(__dirname, 'schema.prisma')) && __dirname

// if the client has been bundled, we need to look for the folders
const foundDirname = !regularDirname && findSync(process.cwd(), [
    "prisma/generated/client",
    "generated/client",
], ['d'], ['d'], 1)[0]

const dirname = regularDirname || foundDirname || __dirname

/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) { return x; }

exports.Prisma.EventScalarFieldEnum = makeEnum({
  eventId: 'eventId',
  title: 'title',
  category: 'category',
  location: 'location',
  eventDurationType: 'eventDurationType',
  startDate: 'startDate',
  endDate: 'endDate',
  images: 'images',
  summary: 'summary',
  description: 'description',
  visibilityType: 'visibilityType',
  privacyType: 'privacyType'
});

exports.Prisma.PromotionScalarFieldEnum = makeEnum({
  promotionId: 'promotionId',
  name: 'name',
  promotionType: 'promotionType',
  promotionValue: 'promotionValue',
  quantity: 'quantity',
  startDate: 'startDate',
  endDate: 'endDate',
  ticketId: 'ticketId'
});

exports.Prisma.QueryMode = makeEnum({
  default: 'default',
  insensitive: 'insensitive'
});

exports.Prisma.SortOrder = makeEnum({
  asc: 'asc',
  desc: 'desc'
});

exports.Prisma.TicketScalarFieldEnum = makeEnum({
  ticketId: 'ticketId',
  name: 'name',
  quantity: 'quantity',
  price: 'price',
  startDate: 'startDate',
  endDate: 'endDate',
  description: 'description',
  eventId: 'eventId'
});

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});
exports.CategoryType = makeEnum({
  AUTO_BOAT_AIR: 'AUTO_BOAT_AIR',
  BUSINESS_PROFESSIONAL: 'BUSINESS_PROFESSIONAL',
  CHARITY_CAUSES: 'CHARITY_CAUSES',
  COMMUNITY_CULTURE: 'COMMUNITY_CULTURE',
  FAMILY_EDUCATION: 'FAMILY_EDUCATION',
  FASHION_BEAUTY: 'FASHION_BEAUTY',
  FILM_MEDIA_ENTERTAINMENT: 'FILM_MEDIA_ENTERTAINMENT',
  FOOD_DRINK: 'FOOD_DRINK',
  GOVERNMENT_POLITICS: 'GOVERNMENT_POLITICS',
  HEALTH_WELLNESS: 'HEALTH_WELLNESS',
  HOBBIES_SPECIAL_INTEREST: 'HOBBIES_SPECIAL_INTEREST',
  HOME_LIFESTYLE: 'HOME_LIFESTYLE',
  PERFORMING_VISUAL_ARTS: 'PERFORMING_VISUAL_ARTS',
  RELIGION_SPIRITUALITY: 'RELIGION_SPIRITUALITY',
  SCHOOL_ACTIVITIES: 'SCHOOL_ACTIVITIES',
  SCIENCE_TECHNOLOGY: 'SCIENCE_TECHNOLOGY',
  SEASONAL_HOLIDAY: 'SEASONAL_HOLIDAY',
  SPORTS_FITNESS: 'SPORTS_FITNESS',
  TRAVEL_OUTDOOR: 'TRAVEL_OUTDOOR'
});

exports.DurationType = makeEnum({
  SINGLE: 'SINGLE',
  RECURRING: 'RECURRING'
});

exports.PrivacyType = makeEnum({
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE'
});

exports.PromotionType = makeEnum({
  LIMITED: 'LIMITED',
  UNLIMITED: 'UNLIMITED'
});

exports.VisibilityType = makeEnum({
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED'
});

exports.Prisma.ModelName = makeEnum({
  Event: 'Event',
  Ticket: 'Ticket',
  Promotion: 'Promotion'
});

const dmmfString = "{\"datamodel\":{\"enums\":[{\"name\":\"CategoryType\",\"values\":[{\"name\":\"AUTO_BOAT_AIR\",\"dbName\":null},{\"name\":\"BUSINESS_PROFESSIONAL\",\"dbName\":null},{\"name\":\"CHARITY_CAUSES\",\"dbName\":null},{\"name\":\"COMMUNITY_CULTURE\",\"dbName\":null},{\"name\":\"FAMILY_EDUCATION\",\"dbName\":null},{\"name\":\"FASHION_BEAUTY\",\"dbName\":null},{\"name\":\"FILM_MEDIA_ENTERTAINMENT\",\"dbName\":null},{\"name\":\"FOOD_DRINK\",\"dbName\":null},{\"name\":\"GOVERNMENT_POLITICS\",\"dbName\":null},{\"name\":\"HEALTH_WELLNESS\",\"dbName\":null},{\"name\":\"HOBBIES_SPECIAL_INTEREST\",\"dbName\":null},{\"name\":\"HOME_LIFESTYLE\",\"dbName\":null},{\"name\":\"PERFORMING_VISUAL_ARTS\",\"dbName\":null},{\"name\":\"RELIGION_SPIRITUALITY\",\"dbName\":null},{\"name\":\"SCHOOL_ACTIVITIES\",\"dbName\":null},{\"name\":\"SCIENCE_TECHNOLOGY\",\"dbName\":null},{\"name\":\"SEASONAL_HOLIDAY\",\"dbName\":null},{\"name\":\"SPORTS_FITNESS\",\"dbName\":null},{\"name\":\"TRAVEL_OUTDOOR\",\"dbName\":null}],\"dbName\":null},{\"name\":\"DurationType\",\"values\":[{\"name\":\"SINGLE\",\"dbName\":null},{\"name\":\"RECURRING\",\"dbName\":null}],\"dbName\":null},{\"name\":\"VisibilityType\",\"values\":[{\"name\":\"DRAFT\",\"dbName\":null},{\"name\":\"PUBLISHED\",\"dbName\":null}],\"dbName\":null},{\"name\":\"PrivacyType\",\"values\":[{\"name\":\"PUBLIC\",\"dbName\":null},{\"name\":\"PRIVATE\",\"dbName\":null}],\"dbName\":null},{\"name\":\"PromotionType\",\"values\":[{\"name\":\"LIMITED\",\"dbName\":null},{\"name\":\"UNLIMITED\",\"dbName\":null}],\"dbName\":null}],\"models\":[{\"name\":\"Event\",\"dbName\":null,\"fields\":[{\"name\":\"eventId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"category\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CategoryType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"location\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"eventDurationType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DurationType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"images\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"summary\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"visibilityType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"VisibilityType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"privacyType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PrivacyType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tickets\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Ticket\",\"relationName\":\"EventToTicket\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"Ticket\",\"dbName\":null,\"fields\":[{\"name\":\"ticketId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quantity\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"price\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"event\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Event\",\"relationName\":\"EventToTicket\",\"relationFromFields\":[\"eventId\"],\"relationToFields\":[\"eventId\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"eventId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"promotion\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Promotion\",\"relationName\":\"PromotionToTicket\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},{\"name\":\"Promotion\",\"dbName\":null,\"fields\":[{\"name\":\"promotionId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"promotionType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PromotionType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"promotionValue\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quantity\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"endDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ticket\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Ticket\",\"relationName\":\"PromotionToTicket\",\"relationFromFields\":[\"ticketId\"],\"relationToFields\":[\"ticketId\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ticketId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}],\"types\":[]},\"mappings\":{\"modelOperations\":[{\"model\":\"Event\",\"plural\":\"events\",\"findUnique\":\"findUniqueEvent\",\"findUniqueOrThrow\":\"findUniqueEventOrThrow\",\"findFirst\":\"findFirstEvent\",\"findFirstOrThrow\":\"findFirstEventOrThrow\",\"findMany\":\"findManyEvent\",\"create\":\"createOneEvent\",\"createMany\":\"createManyEvent\",\"delete\":\"deleteOneEvent\",\"update\":\"updateOneEvent\",\"deleteMany\":\"deleteManyEvent\",\"updateMany\":\"updateManyEvent\",\"upsert\":\"upsertOneEvent\",\"aggregate\":\"aggregateEvent\",\"groupBy\":\"groupByEvent\"},{\"model\":\"Ticket\",\"plural\":\"tickets\",\"findUnique\":\"findUniqueTicket\",\"findUniqueOrThrow\":\"findUniqueTicketOrThrow\",\"findFirst\":\"findFirstTicket\",\"findFirstOrThrow\":\"findFirstTicketOrThrow\",\"findMany\":\"findManyTicket\",\"create\":\"createOneTicket\",\"createMany\":\"createManyTicket\",\"delete\":\"deleteOneTicket\",\"update\":\"updateOneTicket\",\"deleteMany\":\"deleteManyTicket\",\"updateMany\":\"updateManyTicket\",\"upsert\":\"upsertOneTicket\",\"aggregate\":\"aggregateTicket\",\"groupBy\":\"groupByTicket\"},{\"model\":\"Promotion\",\"plural\":\"promotions\",\"findUnique\":\"findUniquePromotion\",\"findUniqueOrThrow\":\"findUniquePromotionOrThrow\",\"findFirst\":\"findFirstPromotion\",\"findFirstOrThrow\":\"findFirstPromotionOrThrow\",\"findMany\":\"findManyPromotion\",\"create\":\"createOnePromotion\",\"createMany\":\"createManyPromotion\",\"delete\":\"deleteOnePromotion\",\"update\":\"updateOnePromotion\",\"deleteMany\":\"deleteManyPromotion\",\"updateMany\":\"updateManyPromotion\",\"upsert\":\"upsertOnePromotion\",\"aggregate\":\"aggregatePromotion\",\"groupBy\":\"groupByPromotion\"}],\"otherOperations\":{\"read\":[],\"write\":[\"executeRaw\",\"queryRaw\"]}}}"
const dmmf = JSON.parse(dmmfString)
exports.Prisma.dmmf = JSON.parse(dmmfString)

/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "/Users/shengliang/Desktop/creator-economy/prisma/generated/client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "linux-arm64-openssl-1.1.x"
      }
    ],
    "previewFeatures": [],
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": "../../../.env",
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../..",
  "clientVersion": "4.9.0",
  "engineVersion": "ceb5c99003b99c9ee2c1d2e618e359c14aef2ea5",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "dataProxy": false
}
config.document = dmmf
config.dirname = dirname




const { warnEnvConflicts } = require('./runtime/index')

warnEnvConflicts({
    rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(dirname, config.relativeEnvPaths.rootEnvPath),
    schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(dirname, config.relativeEnvPaths.schemaEnvPath)
})

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

path.join(__dirname, "libquery_engine-linux-arm64-openssl-1.1.x.so.node");
path.join(process.cwd(), "prisma/generated/client/libquery_engine-linux-arm64-openssl-1.1.x.so.node")
path.join(__dirname, "schema.prisma");
path.join(process.cwd(), "prisma/generated/client/schema.prisma")
