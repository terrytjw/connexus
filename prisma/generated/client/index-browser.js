
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum
} = require('./runtime/index-browser')


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

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
)}
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

/**
 * Create the Client
 */
class PrismaClient {
  constructor() {
    throw new Error(
      `PrismaClient is unable to be run in the browser.
In case this error is unexpected for you, please report it in https://github.com/prisma/prisma/issues`,
    )
  }
}
exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
