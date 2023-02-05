
/**
 * Client
**/

import * as runtime from './runtime/index';
declare const prisma: unique symbol
export interface PrismaPromise<A> extends Promise<A> {[prisma]: true}
type UnwrapPromise<P extends any> = P extends Promise<infer R> ? R : P
type UnwrapTuple<Tuple extends readonly unknown[]> = {
  [K in keyof Tuple]: K extends `${number}` ? Tuple[K] extends PrismaPromise<infer X> ? X : UnwrapPromise<Tuple[K]> : UnwrapPromise<Tuple[K]>
};


/**
 * Model Event
 * 
 */
export type Event = {
  eventId: number
  title: string
  category: CategoryType
  location: string
  eventDurationType: DurationType
  startDate: Date
  endDate: Date
  images: string[]
  summary: string
  description: string
  visibilityType: VisibilityType
  privacyType: PrivacyType
}

/**
 * Model Ticket
 * 
 */
export type Ticket = {
  ticketId: number
  name: string
  quantity: number
  price: number
  startDate: Date
  endDate: Date
  description: string
  eventId: number
}

/**
 * Model Promotion
 * 
 */
export type Promotion = {
  promotionId: number
  name: string
  promotionType: PromotionType
  promotionValue: number
  quantity: number
  startDate: Date
  endDate: Date
  ticketId: number
}


/**
 * Enums
 */

// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

export const CategoryType: {
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
};

export type CategoryType = (typeof CategoryType)[keyof typeof CategoryType]


export const DurationType: {
  SINGLE: 'SINGLE',
  RECURRING: 'RECURRING'
};

export type DurationType = (typeof DurationType)[keyof typeof DurationType]


export const PrivacyType: {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE'
};

export type PrivacyType = (typeof PrivacyType)[keyof typeof PrivacyType]


export const PromotionType: {
  LIMITED: 'LIMITED',
  UNLIMITED: 'UNLIMITED'
};

export type PromotionType = (typeof PromotionType)[keyof typeof PromotionType]


export const VisibilityType: {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED'
};

export type VisibilityType = (typeof VisibilityType)[keyof typeof VisibilityType]


/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Events
 * const events = await prisma.event.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  GlobalReject extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined = 'rejectOnNotFound' extends keyof T
    ? T['rejectOnNotFound']
    : false
      > {
    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Events
   * const events = await prisma.event.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends (U | 'beforeExit')>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : V extends 'beforeExit' ? () => Promise<void> : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): Promise<void>;

  /**
   * Add a middleware
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Prisma.TransactionClient) => Promise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): Promise<R>

      /**
   * `prisma.event`: Exposes CRUD operations for the **Event** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Events
    * const events = await prisma.event.findMany()
    * ```
    */
  get event(): Prisma.EventDelegate<GlobalReject>;

  /**
   * `prisma.ticket`: Exposes CRUD operations for the **Ticket** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tickets
    * const tickets = await prisma.ticket.findMany()
    * ```
    */
  get ticket(): Prisma.TicketDelegate<GlobalReject>;

  /**
   * `prisma.promotion`: Exposes CRUD operations for the **Promotion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Promotions
    * const promotions = await prisma.promotion.findMany()
    * ```
    */
  get promotion(): Prisma.PromotionDelegate<GlobalReject>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket


  /**
   * Prisma Client JS version: 4.9.0
   * Query Engine version: ceb5c99003b99c9ee2c1d2e618e359c14aef2ea5
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }
  type HasSelect = {
    select: any
  }
  type HasInclude = {
    include: any
  }
  type CheckSelect<T, S, U> = T extends SelectAndInclude
    ? 'Please either choose `select` or `include`'
    : T extends HasSelect
    ? U
    : T extends HasInclude
    ? U
    : S

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => Promise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;

  export function validator<V>(): <S>(select: runtime.Types.Utils.LegacyExact<S, V>) => S;

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but with an array
   */
  type PickArray<T, K extends Array<keyof T>> = Prisma__Pick<T, TupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>

  class PrismaClientFetcher {
    private readonly prisma;
    private readonly debug;
    private readonly hooks?;
    constructor(prisma: PrismaClient<any, any>, debug?: boolean, hooks?: Hooks | undefined);
    request<T>(document: any, dataPath?: string[], rootField?: string, typeName?: string, isList?: boolean, callsite?: string): Promise<T>;
    sanitizeMessage(message: string): string;
    protected unpack(document: any, data: any, path: string[], rootField?: string, isList?: boolean): any;
  }

  export const ModelName: {
    Event: 'Event',
    Ticket: 'Ticket',
    Promotion: 'Promotion'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  export type DefaultPrismaClient = PrismaClient
  export type RejectOnNotFound = boolean | ((error: Error) => Error)
  export type RejectPerModel = { [P in ModelName]?: RejectOnNotFound }
  export type RejectPerOperation =  { [P in "findUnique" | "findFirst"]?: RejectPerModel | RejectOnNotFound } 
  type IsReject<T> = T extends true ? True : T extends (err: Error) => Error ? True : False
  export type HasReject<
    GlobalRejectSettings extends Prisma.PrismaClientOptions['rejectOnNotFound'],
    LocalRejectSettings,
    Action extends PrismaAction,
    Model extends ModelName
  > = LocalRejectSettings extends RejectOnNotFound
    ? IsReject<LocalRejectSettings>
    : GlobalRejectSettings extends RejectPerOperation
    ? Action extends keyof GlobalRejectSettings
      ? GlobalRejectSettings[Action] extends RejectOnNotFound
        ? IsReject<GlobalRejectSettings[Action]>
        : GlobalRejectSettings[Action] extends RejectPerModel
        ? Model extends keyof GlobalRejectSettings[Action]
          ? IsReject<GlobalRejectSettings[Action][Model]>
          : False
        : False
      : False
    : IsReject<GlobalRejectSettings>
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'

  export interface PrismaClientOptions {
    /**
     * Configure findUnique/findFirst to throw an error if the query returns null. 
     * @deprecated since 4.0.0. Use `findUniqueOrThrow`/`findFirstOrThrow` methods instead.
     * @example
     * ```
     * // Reject on both findUnique/findFirst
     * rejectOnNotFound: true
     * // Reject only on findFirst with a custom error
     * rejectOnNotFound: { findFirst: (err) => new Error("Custom Error")}
     * // Reject on user.findUnique with a custom error
     * rejectOnNotFound: { findUnique: {User: (err) => new Error("User not found")}}
     * ```
     */
    rejectOnNotFound?: RejectOnNotFound | RejectPerOperation
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources

    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat

    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: Array<LogLevel | LogDefinition>
  }

  export type Hooks = {
    beforeRequest?: (options: { query: string, path: string[], rootField?: string, typeName?: string, document: any }) => any
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findMany'
    | 'findFirst'
    | 'create'
    | 'createMany'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => Promise<T>,
  ) => Promise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type EventCountOutputType
   */


  export type EventCountOutputType = {
    tickets: number
  }

  export type EventCountOutputTypeSelect = {
    tickets?: boolean
  }

  export type EventCountOutputTypeGetPayload<S extends boolean | null | undefined | EventCountOutputTypeArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? EventCountOutputType :
    S extends undefined ? never :
    S extends { include: any } & (EventCountOutputTypeArgs)
    ? EventCountOutputType 
    : S extends { select: any } & (EventCountOutputTypeArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof EventCountOutputType ? EventCountOutputType[P] : never
  } 
      : EventCountOutputType




  // Custom InputTypes

  /**
   * EventCountOutputType without action
   */
  export type EventCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the EventCountOutputType
     */
    select?: EventCountOutputTypeSelect | null
  }



  /**
   * Count Type TicketCountOutputType
   */


  export type TicketCountOutputType = {
    promotion: number
  }

  export type TicketCountOutputTypeSelect = {
    promotion?: boolean
  }

  export type TicketCountOutputTypeGetPayload<S extends boolean | null | undefined | TicketCountOutputTypeArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? TicketCountOutputType :
    S extends undefined ? never :
    S extends { include: any } & (TicketCountOutputTypeArgs)
    ? TicketCountOutputType 
    : S extends { select: any } & (TicketCountOutputTypeArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
    P extends keyof TicketCountOutputType ? TicketCountOutputType[P] : never
  } 
      : TicketCountOutputType




  // Custom InputTypes

  /**
   * TicketCountOutputType without action
   */
  export type TicketCountOutputTypeArgs = {
    /**
     * Select specific fields to fetch from the TicketCountOutputType
     */
    select?: TicketCountOutputTypeSelect | null
  }



  /**
   * Models
   */

  /**
   * Model Event
   */


  export type AggregateEvent = {
    _count: EventCountAggregateOutputType | null
    _avg: EventAvgAggregateOutputType | null
    _sum: EventSumAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  export type EventAvgAggregateOutputType = {
    eventId: number | null
  }

  export type EventSumAggregateOutputType = {
    eventId: number | null
  }

  export type EventMinAggregateOutputType = {
    eventId: number | null
    title: string | null
    category: CategoryType | null
    location: string | null
    eventDurationType: DurationType | null
    startDate: Date | null
    endDate: Date | null
    summary: string | null
    description: string | null
    visibilityType: VisibilityType | null
    privacyType: PrivacyType | null
  }

  export type EventMaxAggregateOutputType = {
    eventId: number | null
    title: string | null
    category: CategoryType | null
    location: string | null
    eventDurationType: DurationType | null
    startDate: Date | null
    endDate: Date | null
    summary: string | null
    description: string | null
    visibilityType: VisibilityType | null
    privacyType: PrivacyType | null
  }

  export type EventCountAggregateOutputType = {
    eventId: number
    title: number
    category: number
    location: number
    eventDurationType: number
    startDate: number
    endDate: number
    images: number
    summary: number
    description: number
    visibilityType: number
    privacyType: number
    _all: number
  }


  export type EventAvgAggregateInputType = {
    eventId?: true
  }

  export type EventSumAggregateInputType = {
    eventId?: true
  }

  export type EventMinAggregateInputType = {
    eventId?: true
    title?: true
    category?: true
    location?: true
    eventDurationType?: true
    startDate?: true
    endDate?: true
    summary?: true
    description?: true
    visibilityType?: true
    privacyType?: true
  }

  export type EventMaxAggregateInputType = {
    eventId?: true
    title?: true
    category?: true
    location?: true
    eventDurationType?: true
    startDate?: true
    endDate?: true
    summary?: true
    description?: true
    visibilityType?: true
    privacyType?: true
  }

  export type EventCountAggregateInputType = {
    eventId?: true
    title?: true
    category?: true
    location?: true
    eventDurationType?: true
    startDate?: true
    endDate?: true
    images?: true
    summary?: true
    description?: true
    visibilityType?: true
    privacyType?: true
    _all?: true
  }

  export type EventAggregateArgs = {
    /**
     * Filter which Event to aggregate.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: Enumerable<EventOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Events
    **/
    _count?: true | EventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EventAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EventSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EventMaxAggregateInputType
  }

  export type GetEventAggregateType<T extends EventAggregateArgs> = {
        [P in keyof T & keyof AggregateEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEvent[P]>
      : GetScalarType<T[P], AggregateEvent[P]>
  }




  export type EventGroupByArgs = {
    where?: EventWhereInput
    orderBy?: Enumerable<EventOrderByWithAggregationInput>
    by: EventScalarFieldEnum[]
    having?: EventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EventCountAggregateInputType | true
    _avg?: EventAvgAggregateInputType
    _sum?: EventSumAggregateInputType
    _min?: EventMinAggregateInputType
    _max?: EventMaxAggregateInputType
  }


  export type EventGroupByOutputType = {
    eventId: number
    title: string
    category: CategoryType
    location: string
    eventDurationType: DurationType
    startDate: Date
    endDate: Date
    images: string[]
    summary: string
    description: string
    visibilityType: VisibilityType
    privacyType: PrivacyType
    _count: EventCountAggregateOutputType | null
    _avg: EventAvgAggregateOutputType | null
    _sum: EventSumAggregateOutputType | null
    _min: EventMinAggregateOutputType | null
    _max: EventMaxAggregateOutputType | null
  }

  type GetEventGroupByPayload<T extends EventGroupByArgs> = PrismaPromise<
    Array<
      PickArray<EventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EventGroupByOutputType[P]>
            : GetScalarType<T[P], EventGroupByOutputType[P]>
        }
      >
    >


  export type EventSelect = {
    eventId?: boolean
    title?: boolean
    category?: boolean
    location?: boolean
    eventDurationType?: boolean
    startDate?: boolean
    endDate?: boolean
    images?: boolean
    summary?: boolean
    description?: boolean
    visibilityType?: boolean
    privacyType?: boolean
    tickets?: boolean | Event$ticketsArgs
    _count?: boolean | EventCountOutputTypeArgs
  }


  export type EventInclude = {
    tickets?: boolean | Event$ticketsArgs
    _count?: boolean | EventCountOutputTypeArgs
  }

  export type EventGetPayload<S extends boolean | null | undefined | EventArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? Event :
    S extends undefined ? never :
    S extends { include: any } & (EventArgs | EventFindManyArgs)
    ? Event  & {
    [P in TruthyKeys<S['include']>]:
        P extends 'tickets' ? Array < TicketGetPayload<S['include'][P]>>  :
        P extends '_count' ? EventCountOutputTypeGetPayload<S['include'][P]> :  never
  } 
    : S extends { select: any } & (EventArgs | EventFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
        P extends 'tickets' ? Array < TicketGetPayload<S['select'][P]>>  :
        P extends '_count' ? EventCountOutputTypeGetPayload<S['select'][P]> :  P extends keyof Event ? Event[P] : never
  } 
      : Event


  type EventCountArgs = 
    Omit<EventFindManyArgs, 'select' | 'include'> & {
      select?: EventCountAggregateInputType | true
    }

  export interface EventDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

    /**
     * Find zero or one Event that matches the filter.
     * @param {EventFindUniqueArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends EventFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, EventFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Event'> extends True ? Prisma__EventClient<EventGetPayload<T>> : Prisma__EventClient<EventGetPayload<T> | null, null>

    /**
     * Find one Event that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {EventFindUniqueOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends EventFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, EventFindUniqueOrThrowArgs>
    ): Prisma__EventClient<EventGetPayload<T>>

    /**
     * Find the first Event that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends EventFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, EventFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Event'> extends True ? Prisma__EventClient<EventGetPayload<T>> : Prisma__EventClient<EventGetPayload<T> | null, null>

    /**
     * Find the first Event that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindFirstOrThrowArgs} args - Arguments to find a Event
     * @example
     * // Get one Event
     * const event = await prisma.event.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends EventFindFirstOrThrowArgs>(
      args?: SelectSubset<T, EventFindFirstOrThrowArgs>
    ): Prisma__EventClient<EventGetPayload<T>>

    /**
     * Find zero or more Events that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Events
     * const events = await prisma.event.findMany()
     * 
     * // Get first 10 Events
     * const events = await prisma.event.findMany({ take: 10 })
     * 
     * // Only select the `eventId`
     * const eventWithEventIdOnly = await prisma.event.findMany({ select: { eventId: true } })
     * 
    **/
    findMany<T extends EventFindManyArgs>(
      args?: SelectSubset<T, EventFindManyArgs>
    ): PrismaPromise<Array<EventGetPayload<T>>>

    /**
     * Create a Event.
     * @param {EventCreateArgs} args - Arguments to create a Event.
     * @example
     * // Create one Event
     * const Event = await prisma.event.create({
     *   data: {
     *     // ... data to create a Event
     *   }
     * })
     * 
    **/
    create<T extends EventCreateArgs>(
      args: SelectSubset<T, EventCreateArgs>
    ): Prisma__EventClient<EventGetPayload<T>>

    /**
     * Create many Events.
     *     @param {EventCreateManyArgs} args - Arguments to create many Events.
     *     @example
     *     // Create many Events
     *     const event = await prisma.event.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends EventCreateManyArgs>(
      args?: SelectSubset<T, EventCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Event.
     * @param {EventDeleteArgs} args - Arguments to delete one Event.
     * @example
     * // Delete one Event
     * const Event = await prisma.event.delete({
     *   where: {
     *     // ... filter to delete one Event
     *   }
     * })
     * 
    **/
    delete<T extends EventDeleteArgs>(
      args: SelectSubset<T, EventDeleteArgs>
    ): Prisma__EventClient<EventGetPayload<T>>

    /**
     * Update one Event.
     * @param {EventUpdateArgs} args - Arguments to update one Event.
     * @example
     * // Update one Event
     * const event = await prisma.event.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends EventUpdateArgs>(
      args: SelectSubset<T, EventUpdateArgs>
    ): Prisma__EventClient<EventGetPayload<T>>

    /**
     * Delete zero or more Events.
     * @param {EventDeleteManyArgs} args - Arguments to filter Events to delete.
     * @example
     * // Delete a few Events
     * const { count } = await prisma.event.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends EventDeleteManyArgs>(
      args?: SelectSubset<T, EventDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Events
     * const event = await prisma.event.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends EventUpdateManyArgs>(
      args: SelectSubset<T, EventUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Event.
     * @param {EventUpsertArgs} args - Arguments to update or create a Event.
     * @example
     * // Update or create a Event
     * const event = await prisma.event.upsert({
     *   create: {
     *     // ... data to create a Event
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Event we want to update
     *   }
     * })
    **/
    upsert<T extends EventUpsertArgs>(
      args: SelectSubset<T, EventUpsertArgs>
    ): Prisma__EventClient<EventGetPayload<T>>

    /**
     * Count the number of Events.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventCountArgs} args - Arguments to filter Events to count.
     * @example
     * // Count the number of Events
     * const count = await prisma.event.count({
     *   where: {
     *     // ... the filter for the Events we want to count
     *   }
     * })
    **/
    count<T extends EventCountArgs>(
      args?: Subset<T, EventCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EventAggregateArgs>(args: Subset<T, EventAggregateArgs>): PrismaPromise<GetEventAggregateType<T>>

    /**
     * Group by Event.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EventGroupByArgs['orderBy'] }
        : { orderBy?: EventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Event.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__EventClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    tickets<T extends Event$ticketsArgs= {}>(args?: Subset<T, Event$ticketsArgs>): PrismaPromise<Array<TicketGetPayload<T>>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Event base type for findUnique actions
   */
  export type EventFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EventInclude | null
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput
  }

  /**
   * Event findUnique
   */
  export interface EventFindUniqueArgs extends EventFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Event findUniqueOrThrow
   */
  export type EventFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EventInclude | null
    /**
     * Filter, which Event to fetch.
     */
    where: EventWhereUniqueInput
  }


  /**
   * Event base type for findFirst actions
   */
  export type EventFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EventInclude | null
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: Enumerable<EventOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: Enumerable<EventScalarFieldEnum>
  }

  /**
   * Event findFirst
   */
  export interface EventFindFirstArgs extends EventFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Event findFirstOrThrow
   */
  export type EventFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EventInclude | null
    /**
     * Filter, which Event to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: Enumerable<EventOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Events.
     */
    distinct?: Enumerable<EventScalarFieldEnum>
  }


  /**
   * Event findMany
   */
  export type EventFindManyArgs = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EventInclude | null
    /**
     * Filter, which Events to fetch.
     */
    where?: EventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Events to fetch.
     */
    orderBy?: Enumerable<EventOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Events.
     */
    cursor?: EventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Events from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Events.
     */
    skip?: number
    distinct?: Enumerable<EventScalarFieldEnum>
  }


  /**
   * Event create
   */
  export type EventCreateArgs = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EventInclude | null
    /**
     * The data needed to create a Event.
     */
    data: XOR<EventCreateInput, EventUncheckedCreateInput>
  }


  /**
   * Event createMany
   */
  export type EventCreateManyArgs = {
    /**
     * The data used to create many Events.
     */
    data: Enumerable<EventCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Event update
   */
  export type EventUpdateArgs = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EventInclude | null
    /**
     * The data needed to update a Event.
     */
    data: XOR<EventUpdateInput, EventUncheckedUpdateInput>
    /**
     * Choose, which Event to update.
     */
    where: EventWhereUniqueInput
  }


  /**
   * Event updateMany
   */
  export type EventUpdateManyArgs = {
    /**
     * The data used to update Events.
     */
    data: XOR<EventUpdateManyMutationInput, EventUncheckedUpdateManyInput>
    /**
     * Filter which Events to update
     */
    where?: EventWhereInput
  }


  /**
   * Event upsert
   */
  export type EventUpsertArgs = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EventInclude | null
    /**
     * The filter to search for the Event to update in case it exists.
     */
    where: EventWhereUniqueInput
    /**
     * In case the Event found by the `where` argument doesn't exist, create a new Event with this data.
     */
    create: XOR<EventCreateInput, EventUncheckedCreateInput>
    /**
     * In case the Event was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EventUpdateInput, EventUncheckedUpdateInput>
  }


  /**
   * Event delete
   */
  export type EventDeleteArgs = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EventInclude | null
    /**
     * Filter which Event to delete.
     */
    where: EventWhereUniqueInput
  }


  /**
   * Event deleteMany
   */
  export type EventDeleteManyArgs = {
    /**
     * Filter which Events to delete
     */
    where?: EventWhereInput
  }


  /**
   * Event.tickets
   */
  export type Event$ticketsArgs = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TicketInclude | null
    where?: TicketWhereInput
    orderBy?: Enumerable<TicketOrderByWithRelationInput>
    cursor?: TicketWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<TicketScalarFieldEnum>
  }


  /**
   * Event without action
   */
  export type EventArgs = {
    /**
     * Select specific fields to fetch from the Event
     */
    select?: EventSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: EventInclude | null
  }



  /**
   * Model Ticket
   */


  export type AggregateTicket = {
    _count: TicketCountAggregateOutputType | null
    _avg: TicketAvgAggregateOutputType | null
    _sum: TicketSumAggregateOutputType | null
    _min: TicketMinAggregateOutputType | null
    _max: TicketMaxAggregateOutputType | null
  }

  export type TicketAvgAggregateOutputType = {
    ticketId: number | null
    quantity: number | null
    price: number | null
    eventId: number | null
  }

  export type TicketSumAggregateOutputType = {
    ticketId: number | null
    quantity: number | null
    price: number | null
    eventId: number | null
  }

  export type TicketMinAggregateOutputType = {
    ticketId: number | null
    name: string | null
    quantity: number | null
    price: number | null
    startDate: Date | null
    endDate: Date | null
    description: string | null
    eventId: number | null
  }

  export type TicketMaxAggregateOutputType = {
    ticketId: number | null
    name: string | null
    quantity: number | null
    price: number | null
    startDate: Date | null
    endDate: Date | null
    description: string | null
    eventId: number | null
  }

  export type TicketCountAggregateOutputType = {
    ticketId: number
    name: number
    quantity: number
    price: number
    startDate: number
    endDate: number
    description: number
    eventId: number
    _all: number
  }


  export type TicketAvgAggregateInputType = {
    ticketId?: true
    quantity?: true
    price?: true
    eventId?: true
  }

  export type TicketSumAggregateInputType = {
    ticketId?: true
    quantity?: true
    price?: true
    eventId?: true
  }

  export type TicketMinAggregateInputType = {
    ticketId?: true
    name?: true
    quantity?: true
    price?: true
    startDate?: true
    endDate?: true
    description?: true
    eventId?: true
  }

  export type TicketMaxAggregateInputType = {
    ticketId?: true
    name?: true
    quantity?: true
    price?: true
    startDate?: true
    endDate?: true
    description?: true
    eventId?: true
  }

  export type TicketCountAggregateInputType = {
    ticketId?: true
    name?: true
    quantity?: true
    price?: true
    startDate?: true
    endDate?: true
    description?: true
    eventId?: true
    _all?: true
  }

  export type TicketAggregateArgs = {
    /**
     * Filter which Ticket to aggregate.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: Enumerable<TicketOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tickets
    **/
    _count?: true | TicketCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TicketAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TicketSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TicketMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TicketMaxAggregateInputType
  }

  export type GetTicketAggregateType<T extends TicketAggregateArgs> = {
        [P in keyof T & keyof AggregateTicket]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTicket[P]>
      : GetScalarType<T[P], AggregateTicket[P]>
  }




  export type TicketGroupByArgs = {
    where?: TicketWhereInput
    orderBy?: Enumerable<TicketOrderByWithAggregationInput>
    by: TicketScalarFieldEnum[]
    having?: TicketScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TicketCountAggregateInputType | true
    _avg?: TicketAvgAggregateInputType
    _sum?: TicketSumAggregateInputType
    _min?: TicketMinAggregateInputType
    _max?: TicketMaxAggregateInputType
  }


  export type TicketGroupByOutputType = {
    ticketId: number
    name: string
    quantity: number
    price: number
    startDate: Date
    endDate: Date
    description: string
    eventId: number
    _count: TicketCountAggregateOutputType | null
    _avg: TicketAvgAggregateOutputType | null
    _sum: TicketSumAggregateOutputType | null
    _min: TicketMinAggregateOutputType | null
    _max: TicketMaxAggregateOutputType | null
  }

  type GetTicketGroupByPayload<T extends TicketGroupByArgs> = PrismaPromise<
    Array<
      PickArray<TicketGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TicketGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TicketGroupByOutputType[P]>
            : GetScalarType<T[P], TicketGroupByOutputType[P]>
        }
      >
    >


  export type TicketSelect = {
    ticketId?: boolean
    name?: boolean
    quantity?: boolean
    price?: boolean
    startDate?: boolean
    endDate?: boolean
    description?: boolean
    event?: boolean | EventArgs
    eventId?: boolean
    promotion?: boolean | Ticket$promotionArgs
    _count?: boolean | TicketCountOutputTypeArgs
  }


  export type TicketInclude = {
    event?: boolean | EventArgs
    promotion?: boolean | Ticket$promotionArgs
    _count?: boolean | TicketCountOutputTypeArgs
  }

  export type TicketGetPayload<S extends boolean | null | undefined | TicketArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? Ticket :
    S extends undefined ? never :
    S extends { include: any } & (TicketArgs | TicketFindManyArgs)
    ? Ticket  & {
    [P in TruthyKeys<S['include']>]:
        P extends 'event' ? EventGetPayload<S['include'][P]> :
        P extends 'promotion' ? Array < PromotionGetPayload<S['include'][P]>>  :
        P extends '_count' ? TicketCountOutputTypeGetPayload<S['include'][P]> :  never
  } 
    : S extends { select: any } & (TicketArgs | TicketFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
        P extends 'event' ? EventGetPayload<S['select'][P]> :
        P extends 'promotion' ? Array < PromotionGetPayload<S['select'][P]>>  :
        P extends '_count' ? TicketCountOutputTypeGetPayload<S['select'][P]> :  P extends keyof Ticket ? Ticket[P] : never
  } 
      : Ticket


  type TicketCountArgs = 
    Omit<TicketFindManyArgs, 'select' | 'include'> & {
      select?: TicketCountAggregateInputType | true
    }

  export interface TicketDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

    /**
     * Find zero or one Ticket that matches the filter.
     * @param {TicketFindUniqueArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends TicketFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, TicketFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Ticket'> extends True ? Prisma__TicketClient<TicketGetPayload<T>> : Prisma__TicketClient<TicketGetPayload<T> | null, null>

    /**
     * Find one Ticket that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {TicketFindUniqueOrThrowArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends TicketFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, TicketFindUniqueOrThrowArgs>
    ): Prisma__TicketClient<TicketGetPayload<T>>

    /**
     * Find the first Ticket that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindFirstArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends TicketFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, TicketFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Ticket'> extends True ? Prisma__TicketClient<TicketGetPayload<T>> : Prisma__TicketClient<TicketGetPayload<T> | null, null>

    /**
     * Find the first Ticket that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindFirstOrThrowArgs} args - Arguments to find a Ticket
     * @example
     * // Get one Ticket
     * const ticket = await prisma.ticket.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends TicketFindFirstOrThrowArgs>(
      args?: SelectSubset<T, TicketFindFirstOrThrowArgs>
    ): Prisma__TicketClient<TicketGetPayload<T>>

    /**
     * Find zero or more Tickets that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tickets
     * const tickets = await prisma.ticket.findMany()
     * 
     * // Get first 10 Tickets
     * const tickets = await prisma.ticket.findMany({ take: 10 })
     * 
     * // Only select the `ticketId`
     * const ticketWithTicketIdOnly = await prisma.ticket.findMany({ select: { ticketId: true } })
     * 
    **/
    findMany<T extends TicketFindManyArgs>(
      args?: SelectSubset<T, TicketFindManyArgs>
    ): PrismaPromise<Array<TicketGetPayload<T>>>

    /**
     * Create a Ticket.
     * @param {TicketCreateArgs} args - Arguments to create a Ticket.
     * @example
     * // Create one Ticket
     * const Ticket = await prisma.ticket.create({
     *   data: {
     *     // ... data to create a Ticket
     *   }
     * })
     * 
    **/
    create<T extends TicketCreateArgs>(
      args: SelectSubset<T, TicketCreateArgs>
    ): Prisma__TicketClient<TicketGetPayload<T>>

    /**
     * Create many Tickets.
     *     @param {TicketCreateManyArgs} args - Arguments to create many Tickets.
     *     @example
     *     // Create many Tickets
     *     const ticket = await prisma.ticket.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends TicketCreateManyArgs>(
      args?: SelectSubset<T, TicketCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Ticket.
     * @param {TicketDeleteArgs} args - Arguments to delete one Ticket.
     * @example
     * // Delete one Ticket
     * const Ticket = await prisma.ticket.delete({
     *   where: {
     *     // ... filter to delete one Ticket
     *   }
     * })
     * 
    **/
    delete<T extends TicketDeleteArgs>(
      args: SelectSubset<T, TicketDeleteArgs>
    ): Prisma__TicketClient<TicketGetPayload<T>>

    /**
     * Update one Ticket.
     * @param {TicketUpdateArgs} args - Arguments to update one Ticket.
     * @example
     * // Update one Ticket
     * const ticket = await prisma.ticket.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends TicketUpdateArgs>(
      args: SelectSubset<T, TicketUpdateArgs>
    ): Prisma__TicketClient<TicketGetPayload<T>>

    /**
     * Delete zero or more Tickets.
     * @param {TicketDeleteManyArgs} args - Arguments to filter Tickets to delete.
     * @example
     * // Delete a few Tickets
     * const { count } = await prisma.ticket.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends TicketDeleteManyArgs>(
      args?: SelectSubset<T, TicketDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tickets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tickets
     * const ticket = await prisma.ticket.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends TicketUpdateManyArgs>(
      args: SelectSubset<T, TicketUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Ticket.
     * @param {TicketUpsertArgs} args - Arguments to update or create a Ticket.
     * @example
     * // Update or create a Ticket
     * const ticket = await prisma.ticket.upsert({
     *   create: {
     *     // ... data to create a Ticket
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Ticket we want to update
     *   }
     * })
    **/
    upsert<T extends TicketUpsertArgs>(
      args: SelectSubset<T, TicketUpsertArgs>
    ): Prisma__TicketClient<TicketGetPayload<T>>

    /**
     * Count the number of Tickets.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketCountArgs} args - Arguments to filter Tickets to count.
     * @example
     * // Count the number of Tickets
     * const count = await prisma.ticket.count({
     *   where: {
     *     // ... the filter for the Tickets we want to count
     *   }
     * })
    **/
    count<T extends TicketCountArgs>(
      args?: Subset<T, TicketCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TicketCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Ticket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TicketAggregateArgs>(args: Subset<T, TicketAggregateArgs>): PrismaPromise<GetTicketAggregateType<T>>

    /**
     * Group by Ticket.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TicketGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TicketGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TicketGroupByArgs['orderBy'] }
        : { orderBy?: TicketGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TicketGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTicketGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Ticket.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__TicketClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    event<T extends EventArgs= {}>(args?: Subset<T, EventArgs>): Prisma__EventClient<EventGetPayload<T> | Null>;

    promotion<T extends Ticket$promotionArgs= {}>(args?: Subset<T, Ticket$promotionArgs>): PrismaPromise<Array<PromotionGetPayload<T>>| Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Ticket base type for findUnique actions
   */
  export type TicketFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TicketInclude | null
    /**
     * Filter, which Ticket to fetch.
     */
    where: TicketWhereUniqueInput
  }

  /**
   * Ticket findUnique
   */
  export interface TicketFindUniqueArgs extends TicketFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Ticket findUniqueOrThrow
   */
  export type TicketFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TicketInclude | null
    /**
     * Filter, which Ticket to fetch.
     */
    where: TicketWhereUniqueInput
  }


  /**
   * Ticket base type for findFirst actions
   */
  export type TicketFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TicketInclude | null
    /**
     * Filter, which Ticket to fetch.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: Enumerable<TicketOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tickets.
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tickets.
     */
    distinct?: Enumerable<TicketScalarFieldEnum>
  }

  /**
   * Ticket findFirst
   */
  export interface TicketFindFirstArgs extends TicketFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Ticket findFirstOrThrow
   */
  export type TicketFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TicketInclude | null
    /**
     * Filter, which Ticket to fetch.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: Enumerable<TicketOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tickets.
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tickets.
     */
    distinct?: Enumerable<TicketScalarFieldEnum>
  }


  /**
   * Ticket findMany
   */
  export type TicketFindManyArgs = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TicketInclude | null
    /**
     * Filter, which Tickets to fetch.
     */
    where?: TicketWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tickets to fetch.
     */
    orderBy?: Enumerable<TicketOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tickets.
     */
    cursor?: TicketWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tickets from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tickets.
     */
    skip?: number
    distinct?: Enumerable<TicketScalarFieldEnum>
  }


  /**
   * Ticket create
   */
  export type TicketCreateArgs = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TicketInclude | null
    /**
     * The data needed to create a Ticket.
     */
    data: XOR<TicketCreateInput, TicketUncheckedCreateInput>
  }


  /**
   * Ticket createMany
   */
  export type TicketCreateManyArgs = {
    /**
     * The data used to create many Tickets.
     */
    data: Enumerable<TicketCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Ticket update
   */
  export type TicketUpdateArgs = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TicketInclude | null
    /**
     * The data needed to update a Ticket.
     */
    data: XOR<TicketUpdateInput, TicketUncheckedUpdateInput>
    /**
     * Choose, which Ticket to update.
     */
    where: TicketWhereUniqueInput
  }


  /**
   * Ticket updateMany
   */
  export type TicketUpdateManyArgs = {
    /**
     * The data used to update Tickets.
     */
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyInput>
    /**
     * Filter which Tickets to update
     */
    where?: TicketWhereInput
  }


  /**
   * Ticket upsert
   */
  export type TicketUpsertArgs = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TicketInclude | null
    /**
     * The filter to search for the Ticket to update in case it exists.
     */
    where: TicketWhereUniqueInput
    /**
     * In case the Ticket found by the `where` argument doesn't exist, create a new Ticket with this data.
     */
    create: XOR<TicketCreateInput, TicketUncheckedCreateInput>
    /**
     * In case the Ticket was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TicketUpdateInput, TicketUncheckedUpdateInput>
  }


  /**
   * Ticket delete
   */
  export type TicketDeleteArgs = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TicketInclude | null
    /**
     * Filter which Ticket to delete.
     */
    where: TicketWhereUniqueInput
  }


  /**
   * Ticket deleteMany
   */
  export type TicketDeleteManyArgs = {
    /**
     * Filter which Tickets to delete
     */
    where?: TicketWhereInput
  }


  /**
   * Ticket.promotion
   */
  export type Ticket$promotionArgs = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PromotionInclude | null
    where?: PromotionWhereInput
    orderBy?: Enumerable<PromotionOrderByWithRelationInput>
    cursor?: PromotionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: Enumerable<PromotionScalarFieldEnum>
  }


  /**
   * Ticket without action
   */
  export type TicketArgs = {
    /**
     * Select specific fields to fetch from the Ticket
     */
    select?: TicketSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: TicketInclude | null
  }



  /**
   * Model Promotion
   */


  export type AggregatePromotion = {
    _count: PromotionCountAggregateOutputType | null
    _avg: PromotionAvgAggregateOutputType | null
    _sum: PromotionSumAggregateOutputType | null
    _min: PromotionMinAggregateOutputType | null
    _max: PromotionMaxAggregateOutputType | null
  }

  export type PromotionAvgAggregateOutputType = {
    promotionId: number | null
    promotionValue: number | null
    quantity: number | null
    ticketId: number | null
  }

  export type PromotionSumAggregateOutputType = {
    promotionId: number | null
    promotionValue: number | null
    quantity: number | null
    ticketId: number | null
  }

  export type PromotionMinAggregateOutputType = {
    promotionId: number | null
    name: string | null
    promotionType: PromotionType | null
    promotionValue: number | null
    quantity: number | null
    startDate: Date | null
    endDate: Date | null
    ticketId: number | null
  }

  export type PromotionMaxAggregateOutputType = {
    promotionId: number | null
    name: string | null
    promotionType: PromotionType | null
    promotionValue: number | null
    quantity: number | null
    startDate: Date | null
    endDate: Date | null
    ticketId: number | null
  }

  export type PromotionCountAggregateOutputType = {
    promotionId: number
    name: number
    promotionType: number
    promotionValue: number
    quantity: number
    startDate: number
    endDate: number
    ticketId: number
    _all: number
  }


  export type PromotionAvgAggregateInputType = {
    promotionId?: true
    promotionValue?: true
    quantity?: true
    ticketId?: true
  }

  export type PromotionSumAggregateInputType = {
    promotionId?: true
    promotionValue?: true
    quantity?: true
    ticketId?: true
  }

  export type PromotionMinAggregateInputType = {
    promotionId?: true
    name?: true
    promotionType?: true
    promotionValue?: true
    quantity?: true
    startDate?: true
    endDate?: true
    ticketId?: true
  }

  export type PromotionMaxAggregateInputType = {
    promotionId?: true
    name?: true
    promotionType?: true
    promotionValue?: true
    quantity?: true
    startDate?: true
    endDate?: true
    ticketId?: true
  }

  export type PromotionCountAggregateInputType = {
    promotionId?: true
    name?: true
    promotionType?: true
    promotionValue?: true
    quantity?: true
    startDate?: true
    endDate?: true
    ticketId?: true
    _all?: true
  }

  export type PromotionAggregateArgs = {
    /**
     * Filter which Promotion to aggregate.
     */
    where?: PromotionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Promotions to fetch.
     */
    orderBy?: Enumerable<PromotionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PromotionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Promotions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Promotions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Promotions
    **/
    _count?: true | PromotionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PromotionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PromotionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PromotionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PromotionMaxAggregateInputType
  }

  export type GetPromotionAggregateType<T extends PromotionAggregateArgs> = {
        [P in keyof T & keyof AggregatePromotion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePromotion[P]>
      : GetScalarType<T[P], AggregatePromotion[P]>
  }




  export type PromotionGroupByArgs = {
    where?: PromotionWhereInput
    orderBy?: Enumerable<PromotionOrderByWithAggregationInput>
    by: PromotionScalarFieldEnum[]
    having?: PromotionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PromotionCountAggregateInputType | true
    _avg?: PromotionAvgAggregateInputType
    _sum?: PromotionSumAggregateInputType
    _min?: PromotionMinAggregateInputType
    _max?: PromotionMaxAggregateInputType
  }


  export type PromotionGroupByOutputType = {
    promotionId: number
    name: string
    promotionType: PromotionType
    promotionValue: number
    quantity: number
    startDate: Date
    endDate: Date
    ticketId: number
    _count: PromotionCountAggregateOutputType | null
    _avg: PromotionAvgAggregateOutputType | null
    _sum: PromotionSumAggregateOutputType | null
    _min: PromotionMinAggregateOutputType | null
    _max: PromotionMaxAggregateOutputType | null
  }

  type GetPromotionGroupByPayload<T extends PromotionGroupByArgs> = PrismaPromise<
    Array<
      PickArray<PromotionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PromotionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PromotionGroupByOutputType[P]>
            : GetScalarType<T[P], PromotionGroupByOutputType[P]>
        }
      >
    >


  export type PromotionSelect = {
    promotionId?: boolean
    name?: boolean
    promotionType?: boolean
    promotionValue?: boolean
    quantity?: boolean
    startDate?: boolean
    endDate?: boolean
    ticket?: boolean | TicketArgs
    ticketId?: boolean
  }


  export type PromotionInclude = {
    ticket?: boolean | TicketArgs
  }

  export type PromotionGetPayload<S extends boolean | null | undefined | PromotionArgs> =
    S extends { select: any, include: any } ? 'Please either choose `select` or `include`' :
    S extends true ? Promotion :
    S extends undefined ? never :
    S extends { include: any } & (PromotionArgs | PromotionFindManyArgs)
    ? Promotion  & {
    [P in TruthyKeys<S['include']>]:
        P extends 'ticket' ? TicketGetPayload<S['include'][P]> :  never
  } 
    : S extends { select: any } & (PromotionArgs | PromotionFindManyArgs)
      ? {
    [P in TruthyKeys<S['select']>]:
        P extends 'ticket' ? TicketGetPayload<S['select'][P]> :  P extends keyof Promotion ? Promotion[P] : never
  } 
      : Promotion


  type PromotionCountArgs = 
    Omit<PromotionFindManyArgs, 'select' | 'include'> & {
      select?: PromotionCountAggregateInputType | true
    }

  export interface PromotionDelegate<GlobalRejectSettings extends Prisma.RejectOnNotFound | Prisma.RejectPerOperation | false | undefined> {

    /**
     * Find zero or one Promotion that matches the filter.
     * @param {PromotionFindUniqueArgs} args - Arguments to find a Promotion
     * @example
     * // Get one Promotion
     * const promotion = await prisma.promotion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends PromotionFindUniqueArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args: SelectSubset<T, PromotionFindUniqueArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findUnique', 'Promotion'> extends True ? Prisma__PromotionClient<PromotionGetPayload<T>> : Prisma__PromotionClient<PromotionGetPayload<T> | null, null>

    /**
     * Find one Promotion that matches the filter or throw an error  with `error.code='P2025'` 
     *     if no matches were found.
     * @param {PromotionFindUniqueOrThrowArgs} args - Arguments to find a Promotion
     * @example
     * // Get one Promotion
     * const promotion = await prisma.promotion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends PromotionFindUniqueOrThrowArgs>(
      args?: SelectSubset<T, PromotionFindUniqueOrThrowArgs>
    ): Prisma__PromotionClient<PromotionGetPayload<T>>

    /**
     * Find the first Promotion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionFindFirstArgs} args - Arguments to find a Promotion
     * @example
     * // Get one Promotion
     * const promotion = await prisma.promotion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends PromotionFindFirstArgs,  LocalRejectSettings = T["rejectOnNotFound"] extends RejectOnNotFound ? T['rejectOnNotFound'] : undefined>(
      args?: SelectSubset<T, PromotionFindFirstArgs>
    ): HasReject<GlobalRejectSettings, LocalRejectSettings, 'findFirst', 'Promotion'> extends True ? Prisma__PromotionClient<PromotionGetPayload<T>> : Prisma__PromotionClient<PromotionGetPayload<T> | null, null>

    /**
     * Find the first Promotion that matches the filter or
     * throw `NotFoundError` if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionFindFirstOrThrowArgs} args - Arguments to find a Promotion
     * @example
     * // Get one Promotion
     * const promotion = await prisma.promotion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends PromotionFindFirstOrThrowArgs>(
      args?: SelectSubset<T, PromotionFindFirstOrThrowArgs>
    ): Prisma__PromotionClient<PromotionGetPayload<T>>

    /**
     * Find zero or more Promotions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionFindManyArgs=} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Promotions
     * const promotions = await prisma.promotion.findMany()
     * 
     * // Get first 10 Promotions
     * const promotions = await prisma.promotion.findMany({ take: 10 })
     * 
     * // Only select the `promotionId`
     * const promotionWithPromotionIdOnly = await prisma.promotion.findMany({ select: { promotionId: true } })
     * 
    **/
    findMany<T extends PromotionFindManyArgs>(
      args?: SelectSubset<T, PromotionFindManyArgs>
    ): PrismaPromise<Array<PromotionGetPayload<T>>>

    /**
     * Create a Promotion.
     * @param {PromotionCreateArgs} args - Arguments to create a Promotion.
     * @example
     * // Create one Promotion
     * const Promotion = await prisma.promotion.create({
     *   data: {
     *     // ... data to create a Promotion
     *   }
     * })
     * 
    **/
    create<T extends PromotionCreateArgs>(
      args: SelectSubset<T, PromotionCreateArgs>
    ): Prisma__PromotionClient<PromotionGetPayload<T>>

    /**
     * Create many Promotions.
     *     @param {PromotionCreateManyArgs} args - Arguments to create many Promotions.
     *     @example
     *     // Create many Promotions
     *     const promotion = await prisma.promotion.createMany({
     *       data: {
     *         // ... provide data here
     *       }
     *     })
     *     
    **/
    createMany<T extends PromotionCreateManyArgs>(
      args?: SelectSubset<T, PromotionCreateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Delete a Promotion.
     * @param {PromotionDeleteArgs} args - Arguments to delete one Promotion.
     * @example
     * // Delete one Promotion
     * const Promotion = await prisma.promotion.delete({
     *   where: {
     *     // ... filter to delete one Promotion
     *   }
     * })
     * 
    **/
    delete<T extends PromotionDeleteArgs>(
      args: SelectSubset<T, PromotionDeleteArgs>
    ): Prisma__PromotionClient<PromotionGetPayload<T>>

    /**
     * Update one Promotion.
     * @param {PromotionUpdateArgs} args - Arguments to update one Promotion.
     * @example
     * // Update one Promotion
     * const promotion = await prisma.promotion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends PromotionUpdateArgs>(
      args: SelectSubset<T, PromotionUpdateArgs>
    ): Prisma__PromotionClient<PromotionGetPayload<T>>

    /**
     * Delete zero or more Promotions.
     * @param {PromotionDeleteManyArgs} args - Arguments to filter Promotions to delete.
     * @example
     * // Delete a few Promotions
     * const { count } = await prisma.promotion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends PromotionDeleteManyArgs>(
      args?: SelectSubset<T, PromotionDeleteManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Update zero or more Promotions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Promotions
     * const promotion = await prisma.promotion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends PromotionUpdateManyArgs>(
      args: SelectSubset<T, PromotionUpdateManyArgs>
    ): PrismaPromise<BatchPayload>

    /**
     * Create or update one Promotion.
     * @param {PromotionUpsertArgs} args - Arguments to update or create a Promotion.
     * @example
     * // Update or create a Promotion
     * const promotion = await prisma.promotion.upsert({
     *   create: {
     *     // ... data to create a Promotion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Promotion we want to update
     *   }
     * })
    **/
    upsert<T extends PromotionUpsertArgs>(
      args: SelectSubset<T, PromotionUpsertArgs>
    ): Prisma__PromotionClient<PromotionGetPayload<T>>

    /**
     * Count the number of Promotions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionCountArgs} args - Arguments to filter Promotions to count.
     * @example
     * // Count the number of Promotions
     * const count = await prisma.promotion.count({
     *   where: {
     *     // ... the filter for the Promotions we want to count
     *   }
     * })
    **/
    count<T extends PromotionCountArgs>(
      args?: Subset<T, PromotionCountArgs>,
    ): PrismaPromise<
      T extends _Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PromotionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Promotion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PromotionAggregateArgs>(args: Subset<T, PromotionAggregateArgs>): PrismaPromise<GetPromotionAggregateType<T>>

    /**
     * Group by Promotion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PromotionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PromotionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PromotionGroupByArgs['orderBy'] }
        : { orderBy?: PromotionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends TupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PromotionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPromotionGroupByPayload<T> : PrismaPromise<InputErrors>

  }

  /**
   * The delegate class that acts as a "Promise-like" for Promotion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export class Prisma__PromotionClient<T, Null = never> implements PrismaPromise<T> {
    [prisma]: true;
    private readonly _dmmf;
    private readonly _fetcher;
    private readonly _queryType;
    private readonly _rootField;
    private readonly _clientMethod;
    private readonly _args;
    private readonly _dataPath;
    private readonly _errorFormat;
    private readonly _measurePerformance?;
    private _isList;
    private _callsite;
    private _requestPromise?;
    constructor(_dmmf: runtime.DMMFClass, _fetcher: PrismaClientFetcher, _queryType: 'query' | 'mutation', _rootField: string, _clientMethod: string, _args: any, _dataPath: string[], _errorFormat: ErrorFormat, _measurePerformance?: boolean | undefined, _isList?: boolean);
    readonly [Symbol.toStringTag]: 'PrismaClientPromise';

    ticket<T extends TicketArgs= {}>(args?: Subset<T, TicketArgs>): Prisma__TicketClient<TicketGetPayload<T> | Null>;

    private get _document();
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): Promise<T>;
  }



  // Custom InputTypes

  /**
   * Promotion base type for findUnique actions
   */
  export type PromotionFindUniqueArgsBase = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PromotionInclude | null
    /**
     * Filter, which Promotion to fetch.
     */
    where: PromotionWhereUniqueInput
  }

  /**
   * Promotion findUnique
   */
  export interface PromotionFindUniqueArgs extends PromotionFindUniqueArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findUniqueOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Promotion findUniqueOrThrow
   */
  export type PromotionFindUniqueOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PromotionInclude | null
    /**
     * Filter, which Promotion to fetch.
     */
    where: PromotionWhereUniqueInput
  }


  /**
   * Promotion base type for findFirst actions
   */
  export type PromotionFindFirstArgsBase = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PromotionInclude | null
    /**
     * Filter, which Promotion to fetch.
     */
    where?: PromotionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Promotions to fetch.
     */
    orderBy?: Enumerable<PromotionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Promotions.
     */
    cursor?: PromotionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Promotions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Promotions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Promotions.
     */
    distinct?: Enumerable<PromotionScalarFieldEnum>
  }

  /**
   * Promotion findFirst
   */
  export interface PromotionFindFirstArgs extends PromotionFindFirstArgsBase {
   /**
    * Throw an Error if query returns no results
    * @deprecated since 4.0.0: use `findFirstOrThrow` method instead
    */
    rejectOnNotFound?: RejectOnNotFound
  }
      

  /**
   * Promotion findFirstOrThrow
   */
  export type PromotionFindFirstOrThrowArgs = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PromotionInclude | null
    /**
     * Filter, which Promotion to fetch.
     */
    where?: PromotionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Promotions to fetch.
     */
    orderBy?: Enumerable<PromotionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Promotions.
     */
    cursor?: PromotionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Promotions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Promotions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Promotions.
     */
    distinct?: Enumerable<PromotionScalarFieldEnum>
  }


  /**
   * Promotion findMany
   */
  export type PromotionFindManyArgs = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PromotionInclude | null
    /**
     * Filter, which Promotions to fetch.
     */
    where?: PromotionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Promotions to fetch.
     */
    orderBy?: Enumerable<PromotionOrderByWithRelationInput>
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Promotions.
     */
    cursor?: PromotionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Promotions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Promotions.
     */
    skip?: number
    distinct?: Enumerable<PromotionScalarFieldEnum>
  }


  /**
   * Promotion create
   */
  export type PromotionCreateArgs = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PromotionInclude | null
    /**
     * The data needed to create a Promotion.
     */
    data: XOR<PromotionCreateInput, PromotionUncheckedCreateInput>
  }


  /**
   * Promotion createMany
   */
  export type PromotionCreateManyArgs = {
    /**
     * The data used to create many Promotions.
     */
    data: Enumerable<PromotionCreateManyInput>
    skipDuplicates?: boolean
  }


  /**
   * Promotion update
   */
  export type PromotionUpdateArgs = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PromotionInclude | null
    /**
     * The data needed to update a Promotion.
     */
    data: XOR<PromotionUpdateInput, PromotionUncheckedUpdateInput>
    /**
     * Choose, which Promotion to update.
     */
    where: PromotionWhereUniqueInput
  }


  /**
   * Promotion updateMany
   */
  export type PromotionUpdateManyArgs = {
    /**
     * The data used to update Promotions.
     */
    data: XOR<PromotionUpdateManyMutationInput, PromotionUncheckedUpdateManyInput>
    /**
     * Filter which Promotions to update
     */
    where?: PromotionWhereInput
  }


  /**
   * Promotion upsert
   */
  export type PromotionUpsertArgs = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PromotionInclude | null
    /**
     * The filter to search for the Promotion to update in case it exists.
     */
    where: PromotionWhereUniqueInput
    /**
     * In case the Promotion found by the `where` argument doesn't exist, create a new Promotion with this data.
     */
    create: XOR<PromotionCreateInput, PromotionUncheckedCreateInput>
    /**
     * In case the Promotion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PromotionUpdateInput, PromotionUncheckedUpdateInput>
  }


  /**
   * Promotion delete
   */
  export type PromotionDeleteArgs = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PromotionInclude | null
    /**
     * Filter which Promotion to delete.
     */
    where: PromotionWhereUniqueInput
  }


  /**
   * Promotion deleteMany
   */
  export type PromotionDeleteManyArgs = {
    /**
     * Filter which Promotions to delete
     */
    where?: PromotionWhereInput
  }


  /**
   * Promotion without action
   */
  export type PromotionArgs = {
    /**
     * Select specific fields to fetch from the Promotion
     */
    select?: PromotionSelect | null
    /**
     * Choose, which related nodes to fetch as well.
     */
    include?: PromotionInclude | null
  }



  /**
   * Enums
   */

  // Based on
  // https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

  export const EventScalarFieldEnum: {
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
  };

  export type EventScalarFieldEnum = (typeof EventScalarFieldEnum)[keyof typeof EventScalarFieldEnum]


  export const PromotionScalarFieldEnum: {
    promotionId: 'promotionId',
    name: 'name',
    promotionType: 'promotionType',
    promotionValue: 'promotionValue',
    quantity: 'quantity',
    startDate: 'startDate',
    endDate: 'endDate',
    ticketId: 'ticketId'
  };

  export type PromotionScalarFieldEnum = (typeof PromotionScalarFieldEnum)[keyof typeof PromotionScalarFieldEnum]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const TicketScalarFieldEnum: {
    ticketId: 'ticketId',
    name: 'name',
    quantity: 'quantity',
    price: 'price',
    startDate: 'startDate',
    endDate: 'endDate',
    description: 'description',
    eventId: 'eventId'
  };

  export type TicketScalarFieldEnum = (typeof TicketScalarFieldEnum)[keyof typeof TicketScalarFieldEnum]


  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  /**
   * Deep Input Types
   */


  export type EventWhereInput = {
    AND?: Enumerable<EventWhereInput>
    OR?: Enumerable<EventWhereInput>
    NOT?: Enumerable<EventWhereInput>
    eventId?: IntFilter | number
    title?: StringFilter | string
    category?: EnumCategoryTypeFilter | CategoryType
    location?: StringFilter | string
    eventDurationType?: EnumDurationTypeFilter | DurationType
    startDate?: DateTimeFilter | Date | string
    endDate?: DateTimeFilter | Date | string
    images?: StringNullableListFilter
    summary?: StringFilter | string
    description?: StringFilter | string
    visibilityType?: EnumVisibilityTypeFilter | VisibilityType
    privacyType?: EnumPrivacyTypeFilter | PrivacyType
    tickets?: TicketListRelationFilter
  }

  export type EventOrderByWithRelationInput = {
    eventId?: SortOrder
    title?: SortOrder
    category?: SortOrder
    location?: SortOrder
    eventDurationType?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    images?: SortOrder
    summary?: SortOrder
    description?: SortOrder
    visibilityType?: SortOrder
    privacyType?: SortOrder
    tickets?: TicketOrderByRelationAggregateInput
  }

  export type EventWhereUniqueInput = {
    eventId?: number
  }

  export type EventOrderByWithAggregationInput = {
    eventId?: SortOrder
    title?: SortOrder
    category?: SortOrder
    location?: SortOrder
    eventDurationType?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    images?: SortOrder
    summary?: SortOrder
    description?: SortOrder
    visibilityType?: SortOrder
    privacyType?: SortOrder
    _count?: EventCountOrderByAggregateInput
    _avg?: EventAvgOrderByAggregateInput
    _max?: EventMaxOrderByAggregateInput
    _min?: EventMinOrderByAggregateInput
    _sum?: EventSumOrderByAggregateInput
  }

  export type EventScalarWhereWithAggregatesInput = {
    AND?: Enumerable<EventScalarWhereWithAggregatesInput>
    OR?: Enumerable<EventScalarWhereWithAggregatesInput>
    NOT?: Enumerable<EventScalarWhereWithAggregatesInput>
    eventId?: IntWithAggregatesFilter | number
    title?: StringWithAggregatesFilter | string
    category?: EnumCategoryTypeWithAggregatesFilter | CategoryType
    location?: StringWithAggregatesFilter | string
    eventDurationType?: EnumDurationTypeWithAggregatesFilter | DurationType
    startDate?: DateTimeWithAggregatesFilter | Date | string
    endDate?: DateTimeWithAggregatesFilter | Date | string
    images?: StringNullableListFilter
    summary?: StringWithAggregatesFilter | string
    description?: StringWithAggregatesFilter | string
    visibilityType?: EnumVisibilityTypeWithAggregatesFilter | VisibilityType
    privacyType?: EnumPrivacyTypeWithAggregatesFilter | PrivacyType
  }

  export type TicketWhereInput = {
    AND?: Enumerable<TicketWhereInput>
    OR?: Enumerable<TicketWhereInput>
    NOT?: Enumerable<TicketWhereInput>
    ticketId?: IntFilter | number
    name?: StringFilter | string
    quantity?: IntFilter | number
    price?: FloatFilter | number
    startDate?: DateTimeFilter | Date | string
    endDate?: DateTimeFilter | Date | string
    description?: StringFilter | string
    event?: XOR<EventRelationFilter, EventWhereInput>
    eventId?: IntFilter | number
    promotion?: PromotionListRelationFilter
  }

  export type TicketOrderByWithRelationInput = {
    ticketId?: SortOrder
    name?: SortOrder
    quantity?: SortOrder
    price?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    description?: SortOrder
    event?: EventOrderByWithRelationInput
    eventId?: SortOrder
    promotion?: PromotionOrderByRelationAggregateInput
  }

  export type TicketWhereUniqueInput = {
    ticketId?: number
  }

  export type TicketOrderByWithAggregationInput = {
    ticketId?: SortOrder
    name?: SortOrder
    quantity?: SortOrder
    price?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    description?: SortOrder
    eventId?: SortOrder
    _count?: TicketCountOrderByAggregateInput
    _avg?: TicketAvgOrderByAggregateInput
    _max?: TicketMaxOrderByAggregateInput
    _min?: TicketMinOrderByAggregateInput
    _sum?: TicketSumOrderByAggregateInput
  }

  export type TicketScalarWhereWithAggregatesInput = {
    AND?: Enumerable<TicketScalarWhereWithAggregatesInput>
    OR?: Enumerable<TicketScalarWhereWithAggregatesInput>
    NOT?: Enumerable<TicketScalarWhereWithAggregatesInput>
    ticketId?: IntWithAggregatesFilter | number
    name?: StringWithAggregatesFilter | string
    quantity?: IntWithAggregatesFilter | number
    price?: FloatWithAggregatesFilter | number
    startDate?: DateTimeWithAggregatesFilter | Date | string
    endDate?: DateTimeWithAggregatesFilter | Date | string
    description?: StringWithAggregatesFilter | string
    eventId?: IntWithAggregatesFilter | number
  }

  export type PromotionWhereInput = {
    AND?: Enumerable<PromotionWhereInput>
    OR?: Enumerable<PromotionWhereInput>
    NOT?: Enumerable<PromotionWhereInput>
    promotionId?: IntFilter | number
    name?: StringFilter | string
    promotionType?: EnumPromotionTypeFilter | PromotionType
    promotionValue?: FloatFilter | number
    quantity?: IntFilter | number
    startDate?: DateTimeFilter | Date | string
    endDate?: DateTimeFilter | Date | string
    ticket?: XOR<TicketRelationFilter, TicketWhereInput>
    ticketId?: IntFilter | number
  }

  export type PromotionOrderByWithRelationInput = {
    promotionId?: SortOrder
    name?: SortOrder
    promotionType?: SortOrder
    promotionValue?: SortOrder
    quantity?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    ticket?: TicketOrderByWithRelationInput
    ticketId?: SortOrder
  }

  export type PromotionWhereUniqueInput = {
    promotionId?: number
  }

  export type PromotionOrderByWithAggregationInput = {
    promotionId?: SortOrder
    name?: SortOrder
    promotionType?: SortOrder
    promotionValue?: SortOrder
    quantity?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    ticketId?: SortOrder
    _count?: PromotionCountOrderByAggregateInput
    _avg?: PromotionAvgOrderByAggregateInput
    _max?: PromotionMaxOrderByAggregateInput
    _min?: PromotionMinOrderByAggregateInput
    _sum?: PromotionSumOrderByAggregateInput
  }

  export type PromotionScalarWhereWithAggregatesInput = {
    AND?: Enumerable<PromotionScalarWhereWithAggregatesInput>
    OR?: Enumerable<PromotionScalarWhereWithAggregatesInput>
    NOT?: Enumerable<PromotionScalarWhereWithAggregatesInput>
    promotionId?: IntWithAggregatesFilter | number
    name?: StringWithAggregatesFilter | string
    promotionType?: EnumPromotionTypeWithAggregatesFilter | PromotionType
    promotionValue?: FloatWithAggregatesFilter | number
    quantity?: IntWithAggregatesFilter | number
    startDate?: DateTimeWithAggregatesFilter | Date | string
    endDate?: DateTimeWithAggregatesFilter | Date | string
    ticketId?: IntWithAggregatesFilter | number
  }

  export type EventCreateInput = {
    title: string
    category: CategoryType
    location: string
    eventDurationType: DurationType
    startDate: Date | string
    endDate: Date | string
    images?: EventCreateimagesInput | Enumerable<string>
    summary: string
    description: string
    visibilityType: VisibilityType
    privacyType: PrivacyType
    tickets?: TicketCreateNestedManyWithoutEventInput
  }

  export type EventUncheckedCreateInput = {
    eventId?: number
    title: string
    category: CategoryType
    location: string
    eventDurationType: DurationType
    startDate: Date | string
    endDate: Date | string
    images?: EventCreateimagesInput | Enumerable<string>
    summary: string
    description: string
    visibilityType: VisibilityType
    privacyType: PrivacyType
    tickets?: TicketUncheckedCreateNestedManyWithoutEventInput
  }

  export type EventUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    category?: EnumCategoryTypeFieldUpdateOperationsInput | CategoryType
    location?: StringFieldUpdateOperationsInput | string
    eventDurationType?: EnumDurationTypeFieldUpdateOperationsInput | DurationType
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: EventUpdateimagesInput | Enumerable<string>
    summary?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    visibilityType?: EnumVisibilityTypeFieldUpdateOperationsInput | VisibilityType
    privacyType?: EnumPrivacyTypeFieldUpdateOperationsInput | PrivacyType
    tickets?: TicketUpdateManyWithoutEventNestedInput
  }

  export type EventUncheckedUpdateInput = {
    eventId?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    category?: EnumCategoryTypeFieldUpdateOperationsInput | CategoryType
    location?: StringFieldUpdateOperationsInput | string
    eventDurationType?: EnumDurationTypeFieldUpdateOperationsInput | DurationType
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: EventUpdateimagesInput | Enumerable<string>
    summary?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    visibilityType?: EnumVisibilityTypeFieldUpdateOperationsInput | VisibilityType
    privacyType?: EnumPrivacyTypeFieldUpdateOperationsInput | PrivacyType
    tickets?: TicketUncheckedUpdateManyWithoutEventNestedInput
  }

  export type EventCreateManyInput = {
    eventId?: number
    title: string
    category: CategoryType
    location: string
    eventDurationType: DurationType
    startDate: Date | string
    endDate: Date | string
    images?: EventCreateimagesInput | Enumerable<string>
    summary: string
    description: string
    visibilityType: VisibilityType
    privacyType: PrivacyType
  }

  export type EventUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    category?: EnumCategoryTypeFieldUpdateOperationsInput | CategoryType
    location?: StringFieldUpdateOperationsInput | string
    eventDurationType?: EnumDurationTypeFieldUpdateOperationsInput | DurationType
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: EventUpdateimagesInput | Enumerable<string>
    summary?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    visibilityType?: EnumVisibilityTypeFieldUpdateOperationsInput | VisibilityType
    privacyType?: EnumPrivacyTypeFieldUpdateOperationsInput | PrivacyType
  }

  export type EventUncheckedUpdateManyInput = {
    eventId?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    category?: EnumCategoryTypeFieldUpdateOperationsInput | CategoryType
    location?: StringFieldUpdateOperationsInput | string
    eventDurationType?: EnumDurationTypeFieldUpdateOperationsInput | DurationType
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: EventUpdateimagesInput | Enumerable<string>
    summary?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    visibilityType?: EnumVisibilityTypeFieldUpdateOperationsInput | VisibilityType
    privacyType?: EnumPrivacyTypeFieldUpdateOperationsInput | PrivacyType
  }

  export type TicketCreateInput = {
    name: string
    quantity: number
    price: number
    startDate: Date | string
    endDate: Date | string
    description: string
    event: EventCreateNestedOneWithoutTicketsInput
    promotion?: PromotionCreateNestedManyWithoutTicketInput
  }

  export type TicketUncheckedCreateInput = {
    ticketId?: number
    name: string
    quantity: number
    price: number
    startDate: Date | string
    endDate: Date | string
    description: string
    eventId: number
    promotion?: PromotionUncheckedCreateNestedManyWithoutTicketInput
  }

  export type TicketUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    event?: EventUpdateOneRequiredWithoutTicketsNestedInput
    promotion?: PromotionUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateInput = {
    ticketId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    eventId?: IntFieldUpdateOperationsInput | number
    promotion?: PromotionUncheckedUpdateManyWithoutTicketNestedInput
  }

  export type TicketCreateManyInput = {
    ticketId?: number
    name: string
    quantity: number
    price: number
    startDate: Date | string
    endDate: Date | string
    description: string
    eventId: number
  }

  export type TicketUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
  }

  export type TicketUncheckedUpdateManyInput = {
    ticketId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    eventId?: IntFieldUpdateOperationsInput | number
  }

  export type PromotionCreateInput = {
    name: string
    promotionType: PromotionType
    promotionValue: number
    quantity: number
    startDate: Date | string
    endDate: Date | string
    ticket: TicketCreateNestedOneWithoutPromotionInput
  }

  export type PromotionUncheckedCreateInput = {
    promotionId?: number
    name: string
    promotionType: PromotionType
    promotionValue: number
    quantity: number
    startDate: Date | string
    endDate: Date | string
    ticketId: number
  }

  export type PromotionUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    promotionType?: EnumPromotionTypeFieldUpdateOperationsInput | PromotionType
    promotionValue?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    ticket?: TicketUpdateOneRequiredWithoutPromotionNestedInput
  }

  export type PromotionUncheckedUpdateInput = {
    promotionId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    promotionType?: EnumPromotionTypeFieldUpdateOperationsInput | PromotionType
    promotionValue?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    ticketId?: IntFieldUpdateOperationsInput | number
  }

  export type PromotionCreateManyInput = {
    promotionId?: number
    name: string
    promotionType: PromotionType
    promotionValue: number
    quantity: number
    startDate: Date | string
    endDate: Date | string
    ticketId: number
  }

  export type PromotionUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    promotionType?: EnumPromotionTypeFieldUpdateOperationsInput | PromotionType
    promotionValue?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromotionUncheckedUpdateManyInput = {
    promotionId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    promotionType?: EnumPromotionTypeFieldUpdateOperationsInput | PromotionType
    promotionValue?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    ticketId?: IntFieldUpdateOperationsInput | number
  }

  export type IntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type StringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringFilter | string
  }

  export type EnumCategoryTypeFilter = {
    equals?: CategoryType
    in?: Enumerable<CategoryType>
    notIn?: Enumerable<CategoryType>
    not?: NestedEnumCategoryTypeFilter | CategoryType
  }

  export type EnumDurationTypeFilter = {
    equals?: DurationType
    in?: Enumerable<DurationType>
    notIn?: Enumerable<DurationType>
    not?: NestedEnumDurationTypeFilter | DurationType
  }

  export type DateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type StringNullableListFilter = {
    equals?: Enumerable<string> | null
    has?: string | null
    hasEvery?: Enumerable<string>
    hasSome?: Enumerable<string>
    isEmpty?: boolean
  }

  export type EnumVisibilityTypeFilter = {
    equals?: VisibilityType
    in?: Enumerable<VisibilityType>
    notIn?: Enumerable<VisibilityType>
    not?: NestedEnumVisibilityTypeFilter | VisibilityType
  }

  export type EnumPrivacyTypeFilter = {
    equals?: PrivacyType
    in?: Enumerable<PrivacyType>
    notIn?: Enumerable<PrivacyType>
    not?: NestedEnumPrivacyTypeFilter | PrivacyType
  }

  export type TicketListRelationFilter = {
    every?: TicketWhereInput
    some?: TicketWhereInput
    none?: TicketWhereInput
  }

  export type TicketOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type EventCountOrderByAggregateInput = {
    eventId?: SortOrder
    title?: SortOrder
    category?: SortOrder
    location?: SortOrder
    eventDurationType?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    images?: SortOrder
    summary?: SortOrder
    description?: SortOrder
    visibilityType?: SortOrder
    privacyType?: SortOrder
  }

  export type EventAvgOrderByAggregateInput = {
    eventId?: SortOrder
  }

  export type EventMaxOrderByAggregateInput = {
    eventId?: SortOrder
    title?: SortOrder
    category?: SortOrder
    location?: SortOrder
    eventDurationType?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    summary?: SortOrder
    description?: SortOrder
    visibilityType?: SortOrder
    privacyType?: SortOrder
  }

  export type EventMinOrderByAggregateInput = {
    eventId?: SortOrder
    title?: SortOrder
    category?: SortOrder
    location?: SortOrder
    eventDurationType?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    summary?: SortOrder
    description?: SortOrder
    visibilityType?: SortOrder
    privacyType?: SortOrder
  }

  export type EventSumOrderByAggregateInput = {
    eventId?: SortOrder
  }

  export type IntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type StringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type EnumCategoryTypeWithAggregatesFilter = {
    equals?: CategoryType
    in?: Enumerable<CategoryType>
    notIn?: Enumerable<CategoryType>
    not?: NestedEnumCategoryTypeWithAggregatesFilter | CategoryType
    _count?: NestedIntFilter
    _min?: NestedEnumCategoryTypeFilter
    _max?: NestedEnumCategoryTypeFilter
  }

  export type EnumDurationTypeWithAggregatesFilter = {
    equals?: DurationType
    in?: Enumerable<DurationType>
    notIn?: Enumerable<DurationType>
    not?: NestedEnumDurationTypeWithAggregatesFilter | DurationType
    _count?: NestedIntFilter
    _min?: NestedEnumDurationTypeFilter
    _max?: NestedEnumDurationTypeFilter
  }

  export type DateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type EnumVisibilityTypeWithAggregatesFilter = {
    equals?: VisibilityType
    in?: Enumerable<VisibilityType>
    notIn?: Enumerable<VisibilityType>
    not?: NestedEnumVisibilityTypeWithAggregatesFilter | VisibilityType
    _count?: NestedIntFilter
    _min?: NestedEnumVisibilityTypeFilter
    _max?: NestedEnumVisibilityTypeFilter
  }

  export type EnumPrivacyTypeWithAggregatesFilter = {
    equals?: PrivacyType
    in?: Enumerable<PrivacyType>
    notIn?: Enumerable<PrivacyType>
    not?: NestedEnumPrivacyTypeWithAggregatesFilter | PrivacyType
    _count?: NestedIntFilter
    _min?: NestedEnumPrivacyTypeFilter
    _max?: NestedEnumPrivacyTypeFilter
  }

  export type FloatFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatFilter | number
  }

  export type EventRelationFilter = {
    is?: EventWhereInput
    isNot?: EventWhereInput
  }

  export type PromotionListRelationFilter = {
    every?: PromotionWhereInput
    some?: PromotionWhereInput
    none?: PromotionWhereInput
  }

  export type PromotionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TicketCountOrderByAggregateInput = {
    ticketId?: SortOrder
    name?: SortOrder
    quantity?: SortOrder
    price?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    description?: SortOrder
    eventId?: SortOrder
  }

  export type TicketAvgOrderByAggregateInput = {
    ticketId?: SortOrder
    quantity?: SortOrder
    price?: SortOrder
    eventId?: SortOrder
  }

  export type TicketMaxOrderByAggregateInput = {
    ticketId?: SortOrder
    name?: SortOrder
    quantity?: SortOrder
    price?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    description?: SortOrder
    eventId?: SortOrder
  }

  export type TicketMinOrderByAggregateInput = {
    ticketId?: SortOrder
    name?: SortOrder
    quantity?: SortOrder
    price?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    description?: SortOrder
    eventId?: SortOrder
  }

  export type TicketSumOrderByAggregateInput = {
    ticketId?: SortOrder
    quantity?: SortOrder
    price?: SortOrder
    eventId?: SortOrder
  }

  export type FloatWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedFloatFilter
    _min?: NestedFloatFilter
    _max?: NestedFloatFilter
  }

  export type EnumPromotionTypeFilter = {
    equals?: PromotionType
    in?: Enumerable<PromotionType>
    notIn?: Enumerable<PromotionType>
    not?: NestedEnumPromotionTypeFilter | PromotionType
  }

  export type TicketRelationFilter = {
    is?: TicketWhereInput
    isNot?: TicketWhereInput
  }

  export type PromotionCountOrderByAggregateInput = {
    promotionId?: SortOrder
    name?: SortOrder
    promotionType?: SortOrder
    promotionValue?: SortOrder
    quantity?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    ticketId?: SortOrder
  }

  export type PromotionAvgOrderByAggregateInput = {
    promotionId?: SortOrder
    promotionValue?: SortOrder
    quantity?: SortOrder
    ticketId?: SortOrder
  }

  export type PromotionMaxOrderByAggregateInput = {
    promotionId?: SortOrder
    name?: SortOrder
    promotionType?: SortOrder
    promotionValue?: SortOrder
    quantity?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    ticketId?: SortOrder
  }

  export type PromotionMinOrderByAggregateInput = {
    promotionId?: SortOrder
    name?: SortOrder
    promotionType?: SortOrder
    promotionValue?: SortOrder
    quantity?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    ticketId?: SortOrder
  }

  export type PromotionSumOrderByAggregateInput = {
    promotionId?: SortOrder
    promotionValue?: SortOrder
    quantity?: SortOrder
    ticketId?: SortOrder
  }

  export type EnumPromotionTypeWithAggregatesFilter = {
    equals?: PromotionType
    in?: Enumerable<PromotionType>
    notIn?: Enumerable<PromotionType>
    not?: NestedEnumPromotionTypeWithAggregatesFilter | PromotionType
    _count?: NestedIntFilter
    _min?: NestedEnumPromotionTypeFilter
    _max?: NestedEnumPromotionTypeFilter
  }

  export type EventCreateimagesInput = {
    set: Enumerable<string>
  }

  export type TicketCreateNestedManyWithoutEventInput = {
    create?: XOR<Enumerable<TicketCreateWithoutEventInput>, Enumerable<TicketUncheckedCreateWithoutEventInput>>
    connectOrCreate?: Enumerable<TicketCreateOrConnectWithoutEventInput>
    createMany?: TicketCreateManyEventInputEnvelope
    connect?: Enumerable<TicketWhereUniqueInput>
  }

  export type TicketUncheckedCreateNestedManyWithoutEventInput = {
    create?: XOR<Enumerable<TicketCreateWithoutEventInput>, Enumerable<TicketUncheckedCreateWithoutEventInput>>
    connectOrCreate?: Enumerable<TicketCreateOrConnectWithoutEventInput>
    createMany?: TicketCreateManyEventInputEnvelope
    connect?: Enumerable<TicketWhereUniqueInput>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumCategoryTypeFieldUpdateOperationsInput = {
    set?: CategoryType
  }

  export type EnumDurationTypeFieldUpdateOperationsInput = {
    set?: DurationType
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type EventUpdateimagesInput = {
    set?: Enumerable<string>
    push?: string | Enumerable<string>
  }

  export type EnumVisibilityTypeFieldUpdateOperationsInput = {
    set?: VisibilityType
  }

  export type EnumPrivacyTypeFieldUpdateOperationsInput = {
    set?: PrivacyType
  }

  export type TicketUpdateManyWithoutEventNestedInput = {
    create?: XOR<Enumerable<TicketCreateWithoutEventInput>, Enumerable<TicketUncheckedCreateWithoutEventInput>>
    connectOrCreate?: Enumerable<TicketCreateOrConnectWithoutEventInput>
    upsert?: Enumerable<TicketUpsertWithWhereUniqueWithoutEventInput>
    createMany?: TicketCreateManyEventInputEnvelope
    set?: Enumerable<TicketWhereUniqueInput>
    disconnect?: Enumerable<TicketWhereUniqueInput>
    delete?: Enumerable<TicketWhereUniqueInput>
    connect?: Enumerable<TicketWhereUniqueInput>
    update?: Enumerable<TicketUpdateWithWhereUniqueWithoutEventInput>
    updateMany?: Enumerable<TicketUpdateManyWithWhereWithoutEventInput>
    deleteMany?: Enumerable<TicketScalarWhereInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TicketUncheckedUpdateManyWithoutEventNestedInput = {
    create?: XOR<Enumerable<TicketCreateWithoutEventInput>, Enumerable<TicketUncheckedCreateWithoutEventInput>>
    connectOrCreate?: Enumerable<TicketCreateOrConnectWithoutEventInput>
    upsert?: Enumerable<TicketUpsertWithWhereUniqueWithoutEventInput>
    createMany?: TicketCreateManyEventInputEnvelope
    set?: Enumerable<TicketWhereUniqueInput>
    disconnect?: Enumerable<TicketWhereUniqueInput>
    delete?: Enumerable<TicketWhereUniqueInput>
    connect?: Enumerable<TicketWhereUniqueInput>
    update?: Enumerable<TicketUpdateWithWhereUniqueWithoutEventInput>
    updateMany?: Enumerable<TicketUpdateManyWithWhereWithoutEventInput>
    deleteMany?: Enumerable<TicketScalarWhereInput>
  }

  export type EventCreateNestedOneWithoutTicketsInput = {
    create?: XOR<EventCreateWithoutTicketsInput, EventUncheckedCreateWithoutTicketsInput>
    connectOrCreate?: EventCreateOrConnectWithoutTicketsInput
    connect?: EventWhereUniqueInput
  }

  export type PromotionCreateNestedManyWithoutTicketInput = {
    create?: XOR<Enumerable<PromotionCreateWithoutTicketInput>, Enumerable<PromotionUncheckedCreateWithoutTicketInput>>
    connectOrCreate?: Enumerable<PromotionCreateOrConnectWithoutTicketInput>
    createMany?: PromotionCreateManyTicketInputEnvelope
    connect?: Enumerable<PromotionWhereUniqueInput>
  }

  export type PromotionUncheckedCreateNestedManyWithoutTicketInput = {
    create?: XOR<Enumerable<PromotionCreateWithoutTicketInput>, Enumerable<PromotionUncheckedCreateWithoutTicketInput>>
    connectOrCreate?: Enumerable<PromotionCreateOrConnectWithoutTicketInput>
    createMany?: PromotionCreateManyTicketInputEnvelope
    connect?: Enumerable<PromotionWhereUniqueInput>
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EventUpdateOneRequiredWithoutTicketsNestedInput = {
    create?: XOR<EventCreateWithoutTicketsInput, EventUncheckedCreateWithoutTicketsInput>
    connectOrCreate?: EventCreateOrConnectWithoutTicketsInput
    upsert?: EventUpsertWithoutTicketsInput
    connect?: EventWhereUniqueInput
    update?: XOR<EventUpdateWithoutTicketsInput, EventUncheckedUpdateWithoutTicketsInput>
  }

  export type PromotionUpdateManyWithoutTicketNestedInput = {
    create?: XOR<Enumerable<PromotionCreateWithoutTicketInput>, Enumerable<PromotionUncheckedCreateWithoutTicketInput>>
    connectOrCreate?: Enumerable<PromotionCreateOrConnectWithoutTicketInput>
    upsert?: Enumerable<PromotionUpsertWithWhereUniqueWithoutTicketInput>
    createMany?: PromotionCreateManyTicketInputEnvelope
    set?: Enumerable<PromotionWhereUniqueInput>
    disconnect?: Enumerable<PromotionWhereUniqueInput>
    delete?: Enumerable<PromotionWhereUniqueInput>
    connect?: Enumerable<PromotionWhereUniqueInput>
    update?: Enumerable<PromotionUpdateWithWhereUniqueWithoutTicketInput>
    updateMany?: Enumerable<PromotionUpdateManyWithWhereWithoutTicketInput>
    deleteMany?: Enumerable<PromotionScalarWhereInput>
  }

  export type PromotionUncheckedUpdateManyWithoutTicketNestedInput = {
    create?: XOR<Enumerable<PromotionCreateWithoutTicketInput>, Enumerable<PromotionUncheckedCreateWithoutTicketInput>>
    connectOrCreate?: Enumerable<PromotionCreateOrConnectWithoutTicketInput>
    upsert?: Enumerable<PromotionUpsertWithWhereUniqueWithoutTicketInput>
    createMany?: PromotionCreateManyTicketInputEnvelope
    set?: Enumerable<PromotionWhereUniqueInput>
    disconnect?: Enumerable<PromotionWhereUniqueInput>
    delete?: Enumerable<PromotionWhereUniqueInput>
    connect?: Enumerable<PromotionWhereUniqueInput>
    update?: Enumerable<PromotionUpdateWithWhereUniqueWithoutTicketInput>
    updateMany?: Enumerable<PromotionUpdateManyWithWhereWithoutTicketInput>
    deleteMany?: Enumerable<PromotionScalarWhereInput>
  }

  export type TicketCreateNestedOneWithoutPromotionInput = {
    create?: XOR<TicketCreateWithoutPromotionInput, TicketUncheckedCreateWithoutPromotionInput>
    connectOrCreate?: TicketCreateOrConnectWithoutPromotionInput
    connect?: TicketWhereUniqueInput
  }

  export type EnumPromotionTypeFieldUpdateOperationsInput = {
    set?: PromotionType
  }

  export type TicketUpdateOneRequiredWithoutPromotionNestedInput = {
    create?: XOR<TicketCreateWithoutPromotionInput, TicketUncheckedCreateWithoutPromotionInput>
    connectOrCreate?: TicketCreateOrConnectWithoutPromotionInput
    upsert?: TicketUpsertWithoutPromotionInput
    connect?: TicketWhereUniqueInput
    update?: XOR<TicketUpdateWithoutPromotionInput, TicketUncheckedUpdateWithoutPromotionInput>
  }

  export type NestedIntFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntFilter | number
  }

  export type NestedStringFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringFilter | string
  }

  export type NestedEnumCategoryTypeFilter = {
    equals?: CategoryType
    in?: Enumerable<CategoryType>
    notIn?: Enumerable<CategoryType>
    not?: NestedEnumCategoryTypeFilter | CategoryType
  }

  export type NestedEnumDurationTypeFilter = {
    equals?: DurationType
    in?: Enumerable<DurationType>
    notIn?: Enumerable<DurationType>
    not?: NestedEnumDurationTypeFilter | DurationType
  }

  export type NestedDateTimeFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeFilter | Date | string
  }

  export type NestedEnumVisibilityTypeFilter = {
    equals?: VisibilityType
    in?: Enumerable<VisibilityType>
    notIn?: Enumerable<VisibilityType>
    not?: NestedEnumVisibilityTypeFilter | VisibilityType
  }

  export type NestedEnumPrivacyTypeFilter = {
    equals?: PrivacyType
    in?: Enumerable<PrivacyType>
    notIn?: Enumerable<PrivacyType>
    not?: NestedEnumPrivacyTypeFilter | PrivacyType
  }

  export type NestedIntWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedIntWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedIntFilter
    _min?: NestedIntFilter
    _max?: NestedIntFilter
  }

  export type NestedFloatFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatFilter | number
  }

  export type NestedStringWithAggregatesFilter = {
    equals?: string
    in?: Enumerable<string>
    notIn?: Enumerable<string>
    lt?: string
    lte?: string
    gt?: string
    gte?: string
    contains?: string
    startsWith?: string
    endsWith?: string
    not?: NestedStringWithAggregatesFilter | string
    _count?: NestedIntFilter
    _min?: NestedStringFilter
    _max?: NestedStringFilter
  }

  export type NestedEnumCategoryTypeWithAggregatesFilter = {
    equals?: CategoryType
    in?: Enumerable<CategoryType>
    notIn?: Enumerable<CategoryType>
    not?: NestedEnumCategoryTypeWithAggregatesFilter | CategoryType
    _count?: NestedIntFilter
    _min?: NestedEnumCategoryTypeFilter
    _max?: NestedEnumCategoryTypeFilter
  }

  export type NestedEnumDurationTypeWithAggregatesFilter = {
    equals?: DurationType
    in?: Enumerable<DurationType>
    notIn?: Enumerable<DurationType>
    not?: NestedEnumDurationTypeWithAggregatesFilter | DurationType
    _count?: NestedIntFilter
    _min?: NestedEnumDurationTypeFilter
    _max?: NestedEnumDurationTypeFilter
  }

  export type NestedDateTimeWithAggregatesFilter = {
    equals?: Date | string
    in?: Enumerable<Date> | Enumerable<string>
    notIn?: Enumerable<Date> | Enumerable<string>
    lt?: Date | string
    lte?: Date | string
    gt?: Date | string
    gte?: Date | string
    not?: NestedDateTimeWithAggregatesFilter | Date | string
    _count?: NestedIntFilter
    _min?: NestedDateTimeFilter
    _max?: NestedDateTimeFilter
  }

  export type NestedEnumVisibilityTypeWithAggregatesFilter = {
    equals?: VisibilityType
    in?: Enumerable<VisibilityType>
    notIn?: Enumerable<VisibilityType>
    not?: NestedEnumVisibilityTypeWithAggregatesFilter | VisibilityType
    _count?: NestedIntFilter
    _min?: NestedEnumVisibilityTypeFilter
    _max?: NestedEnumVisibilityTypeFilter
  }

  export type NestedEnumPrivacyTypeWithAggregatesFilter = {
    equals?: PrivacyType
    in?: Enumerable<PrivacyType>
    notIn?: Enumerable<PrivacyType>
    not?: NestedEnumPrivacyTypeWithAggregatesFilter | PrivacyType
    _count?: NestedIntFilter
    _min?: NestedEnumPrivacyTypeFilter
    _max?: NestedEnumPrivacyTypeFilter
  }

  export type NestedFloatWithAggregatesFilter = {
    equals?: number
    in?: Enumerable<number>
    notIn?: Enumerable<number>
    lt?: number
    lte?: number
    gt?: number
    gte?: number
    not?: NestedFloatWithAggregatesFilter | number
    _count?: NestedIntFilter
    _avg?: NestedFloatFilter
    _sum?: NestedFloatFilter
    _min?: NestedFloatFilter
    _max?: NestedFloatFilter
  }

  export type NestedEnumPromotionTypeFilter = {
    equals?: PromotionType
    in?: Enumerable<PromotionType>
    notIn?: Enumerable<PromotionType>
    not?: NestedEnumPromotionTypeFilter | PromotionType
  }

  export type NestedEnumPromotionTypeWithAggregatesFilter = {
    equals?: PromotionType
    in?: Enumerable<PromotionType>
    notIn?: Enumerable<PromotionType>
    not?: NestedEnumPromotionTypeWithAggregatesFilter | PromotionType
    _count?: NestedIntFilter
    _min?: NestedEnumPromotionTypeFilter
    _max?: NestedEnumPromotionTypeFilter
  }

  export type TicketCreateWithoutEventInput = {
    name: string
    quantity: number
    price: number
    startDate: Date | string
    endDate: Date | string
    description: string
    promotion?: PromotionCreateNestedManyWithoutTicketInput
  }

  export type TicketUncheckedCreateWithoutEventInput = {
    ticketId?: number
    name: string
    quantity: number
    price: number
    startDate: Date | string
    endDate: Date | string
    description: string
    promotion?: PromotionUncheckedCreateNestedManyWithoutTicketInput
  }

  export type TicketCreateOrConnectWithoutEventInput = {
    where: TicketWhereUniqueInput
    create: XOR<TicketCreateWithoutEventInput, TicketUncheckedCreateWithoutEventInput>
  }

  export type TicketCreateManyEventInputEnvelope = {
    data: Enumerable<TicketCreateManyEventInput>
    skipDuplicates?: boolean
  }

  export type TicketUpsertWithWhereUniqueWithoutEventInput = {
    where: TicketWhereUniqueInput
    update: XOR<TicketUpdateWithoutEventInput, TicketUncheckedUpdateWithoutEventInput>
    create: XOR<TicketCreateWithoutEventInput, TicketUncheckedCreateWithoutEventInput>
  }

  export type TicketUpdateWithWhereUniqueWithoutEventInput = {
    where: TicketWhereUniqueInput
    data: XOR<TicketUpdateWithoutEventInput, TicketUncheckedUpdateWithoutEventInput>
  }

  export type TicketUpdateManyWithWhereWithoutEventInput = {
    where: TicketScalarWhereInput
    data: XOR<TicketUpdateManyMutationInput, TicketUncheckedUpdateManyWithoutTicketsInput>
  }

  export type TicketScalarWhereInput = {
    AND?: Enumerable<TicketScalarWhereInput>
    OR?: Enumerable<TicketScalarWhereInput>
    NOT?: Enumerable<TicketScalarWhereInput>
    ticketId?: IntFilter | number
    name?: StringFilter | string
    quantity?: IntFilter | number
    price?: FloatFilter | number
    startDate?: DateTimeFilter | Date | string
    endDate?: DateTimeFilter | Date | string
    description?: StringFilter | string
    eventId?: IntFilter | number
  }

  export type EventCreateWithoutTicketsInput = {
    title: string
    category: CategoryType
    location: string
    eventDurationType: DurationType
    startDate: Date | string
    endDate: Date | string
    images?: EventCreateimagesInput | Enumerable<string>
    summary: string
    description: string
    visibilityType: VisibilityType
    privacyType: PrivacyType
  }

  export type EventUncheckedCreateWithoutTicketsInput = {
    eventId?: number
    title: string
    category: CategoryType
    location: string
    eventDurationType: DurationType
    startDate: Date | string
    endDate: Date | string
    images?: EventCreateimagesInput | Enumerable<string>
    summary: string
    description: string
    visibilityType: VisibilityType
    privacyType: PrivacyType
  }

  export type EventCreateOrConnectWithoutTicketsInput = {
    where: EventWhereUniqueInput
    create: XOR<EventCreateWithoutTicketsInput, EventUncheckedCreateWithoutTicketsInput>
  }

  export type PromotionCreateWithoutTicketInput = {
    name: string
    promotionType: PromotionType
    promotionValue: number
    quantity: number
    startDate: Date | string
    endDate: Date | string
  }

  export type PromotionUncheckedCreateWithoutTicketInput = {
    promotionId?: number
    name: string
    promotionType: PromotionType
    promotionValue: number
    quantity: number
    startDate: Date | string
    endDate: Date | string
  }

  export type PromotionCreateOrConnectWithoutTicketInput = {
    where: PromotionWhereUniqueInput
    create: XOR<PromotionCreateWithoutTicketInput, PromotionUncheckedCreateWithoutTicketInput>
  }

  export type PromotionCreateManyTicketInputEnvelope = {
    data: Enumerable<PromotionCreateManyTicketInput>
    skipDuplicates?: boolean
  }

  export type EventUpsertWithoutTicketsInput = {
    update: XOR<EventUpdateWithoutTicketsInput, EventUncheckedUpdateWithoutTicketsInput>
    create: XOR<EventCreateWithoutTicketsInput, EventUncheckedCreateWithoutTicketsInput>
  }

  export type EventUpdateWithoutTicketsInput = {
    title?: StringFieldUpdateOperationsInput | string
    category?: EnumCategoryTypeFieldUpdateOperationsInput | CategoryType
    location?: StringFieldUpdateOperationsInput | string
    eventDurationType?: EnumDurationTypeFieldUpdateOperationsInput | DurationType
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: EventUpdateimagesInput | Enumerable<string>
    summary?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    visibilityType?: EnumVisibilityTypeFieldUpdateOperationsInput | VisibilityType
    privacyType?: EnumPrivacyTypeFieldUpdateOperationsInput | PrivacyType
  }

  export type EventUncheckedUpdateWithoutTicketsInput = {
    eventId?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    category?: EnumCategoryTypeFieldUpdateOperationsInput | CategoryType
    location?: StringFieldUpdateOperationsInput | string
    eventDurationType?: EnumDurationTypeFieldUpdateOperationsInput | DurationType
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    images?: EventUpdateimagesInput | Enumerable<string>
    summary?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    visibilityType?: EnumVisibilityTypeFieldUpdateOperationsInput | VisibilityType
    privacyType?: EnumPrivacyTypeFieldUpdateOperationsInput | PrivacyType
  }

  export type PromotionUpsertWithWhereUniqueWithoutTicketInput = {
    where: PromotionWhereUniqueInput
    update: XOR<PromotionUpdateWithoutTicketInput, PromotionUncheckedUpdateWithoutTicketInput>
    create: XOR<PromotionCreateWithoutTicketInput, PromotionUncheckedCreateWithoutTicketInput>
  }

  export type PromotionUpdateWithWhereUniqueWithoutTicketInput = {
    where: PromotionWhereUniqueInput
    data: XOR<PromotionUpdateWithoutTicketInput, PromotionUncheckedUpdateWithoutTicketInput>
  }

  export type PromotionUpdateManyWithWhereWithoutTicketInput = {
    where: PromotionScalarWhereInput
    data: XOR<PromotionUpdateManyMutationInput, PromotionUncheckedUpdateManyWithoutPromotionInput>
  }

  export type PromotionScalarWhereInput = {
    AND?: Enumerable<PromotionScalarWhereInput>
    OR?: Enumerable<PromotionScalarWhereInput>
    NOT?: Enumerable<PromotionScalarWhereInput>
    promotionId?: IntFilter | number
    name?: StringFilter | string
    promotionType?: EnumPromotionTypeFilter | PromotionType
    promotionValue?: FloatFilter | number
    quantity?: IntFilter | number
    startDate?: DateTimeFilter | Date | string
    endDate?: DateTimeFilter | Date | string
    ticketId?: IntFilter | number
  }

  export type TicketCreateWithoutPromotionInput = {
    name: string
    quantity: number
    price: number
    startDate: Date | string
    endDate: Date | string
    description: string
    event: EventCreateNestedOneWithoutTicketsInput
  }

  export type TicketUncheckedCreateWithoutPromotionInput = {
    ticketId?: number
    name: string
    quantity: number
    price: number
    startDate: Date | string
    endDate: Date | string
    description: string
    eventId: number
  }

  export type TicketCreateOrConnectWithoutPromotionInput = {
    where: TicketWhereUniqueInput
    create: XOR<TicketCreateWithoutPromotionInput, TicketUncheckedCreateWithoutPromotionInput>
  }

  export type TicketUpsertWithoutPromotionInput = {
    update: XOR<TicketUpdateWithoutPromotionInput, TicketUncheckedUpdateWithoutPromotionInput>
    create: XOR<TicketCreateWithoutPromotionInput, TicketUncheckedCreateWithoutPromotionInput>
  }

  export type TicketUpdateWithoutPromotionInput = {
    name?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    event?: EventUpdateOneRequiredWithoutTicketsNestedInput
  }

  export type TicketUncheckedUpdateWithoutPromotionInput = {
    ticketId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    eventId?: IntFieldUpdateOperationsInput | number
  }

  export type TicketCreateManyEventInput = {
    ticketId?: number
    name: string
    quantity: number
    price: number
    startDate: Date | string
    endDate: Date | string
    description: string
  }

  export type TicketUpdateWithoutEventInput = {
    name?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    promotion?: PromotionUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateWithoutEventInput = {
    ticketId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
    promotion?: PromotionUncheckedUpdateManyWithoutTicketNestedInput
  }

  export type TicketUncheckedUpdateManyWithoutTicketsInput = {
    ticketId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    quantity?: IntFieldUpdateOperationsInput | number
    price?: FloatFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    description?: StringFieldUpdateOperationsInput | string
  }

  export type PromotionCreateManyTicketInput = {
    promotionId?: number
    name: string
    promotionType: PromotionType
    promotionValue: number
    quantity: number
    startDate: Date | string
    endDate: Date | string
  }

  export type PromotionUpdateWithoutTicketInput = {
    name?: StringFieldUpdateOperationsInput | string
    promotionType?: EnumPromotionTypeFieldUpdateOperationsInput | PromotionType
    promotionValue?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromotionUncheckedUpdateWithoutTicketInput = {
    promotionId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    promotionType?: EnumPromotionTypeFieldUpdateOperationsInput | PromotionType
    promotionValue?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PromotionUncheckedUpdateManyWithoutPromotionInput = {
    promotionId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    promotionType?: EnumPromotionTypeFieldUpdateOperationsInput | PromotionType
    promotionValue?: FloatFieldUpdateOperationsInput | number
    quantity?: IntFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}