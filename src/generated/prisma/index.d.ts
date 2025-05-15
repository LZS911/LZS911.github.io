
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model StorageMetadata
 * 
 */
export type StorageMetadata = $Result.DefaultSelection<Prisma.$StorageMetadataPayload>
/**
 * Model StorageContent
 * 
 */
export type StorageContent = $Result.DefaultSelection<Prisma.$StorageContentPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more StorageMetadata
 * const storageMetadata = await prisma.storageMetadata.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more StorageMetadata
   * const storageMetadata = await prisma.storageMetadata.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
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
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

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
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

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
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


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
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.storageMetadata`: Exposes CRUD operations for the **StorageMetadata** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StorageMetadata
    * const storageMetadata = await prisma.storageMetadata.findMany()
    * ```
    */
  get storageMetadata(): Prisma.StorageMetadataDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.storageContent`: Exposes CRUD operations for the **StorageContent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StorageContents
    * const storageContents = await prisma.storageContent.findMany()
    * ```
    */
  get storageContent(): Prisma.StorageContentDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

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
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.7.0
   * Query Engine version: 3cff47a7f5d65c3ea74883f1d736e41d68ce91ed
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

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

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

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
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
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
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
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
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    StorageMetadata: 'StorageMetadata',
    StorageContent: 'StorageContent'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "storageMetadata" | "storageContent"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      StorageMetadata: {
        payload: Prisma.$StorageMetadataPayload<ExtArgs>
        fields: Prisma.StorageMetadataFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StorageMetadataFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageMetadataPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StorageMetadataFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageMetadataPayload>
          }
          findFirst: {
            args: Prisma.StorageMetadataFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageMetadataPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StorageMetadataFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageMetadataPayload>
          }
          findMany: {
            args: Prisma.StorageMetadataFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageMetadataPayload>[]
          }
          create: {
            args: Prisma.StorageMetadataCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageMetadataPayload>
          }
          createMany: {
            args: Prisma.StorageMetadataCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StorageMetadataCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageMetadataPayload>[]
          }
          delete: {
            args: Prisma.StorageMetadataDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageMetadataPayload>
          }
          update: {
            args: Prisma.StorageMetadataUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageMetadataPayload>
          }
          deleteMany: {
            args: Prisma.StorageMetadataDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StorageMetadataUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StorageMetadataUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageMetadataPayload>[]
          }
          upsert: {
            args: Prisma.StorageMetadataUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageMetadataPayload>
          }
          aggregate: {
            args: Prisma.StorageMetadataAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStorageMetadata>
          }
          groupBy: {
            args: Prisma.StorageMetadataGroupByArgs<ExtArgs>
            result: $Utils.Optional<StorageMetadataGroupByOutputType>[]
          }
          count: {
            args: Prisma.StorageMetadataCountArgs<ExtArgs>
            result: $Utils.Optional<StorageMetadataCountAggregateOutputType> | number
          }
        }
      }
      StorageContent: {
        payload: Prisma.$StorageContentPayload<ExtArgs>
        fields: Prisma.StorageContentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StorageContentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageContentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StorageContentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageContentPayload>
          }
          findFirst: {
            args: Prisma.StorageContentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageContentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StorageContentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageContentPayload>
          }
          findMany: {
            args: Prisma.StorageContentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageContentPayload>[]
          }
          create: {
            args: Prisma.StorageContentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageContentPayload>
          }
          createMany: {
            args: Prisma.StorageContentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StorageContentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageContentPayload>[]
          }
          delete: {
            args: Prisma.StorageContentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageContentPayload>
          }
          update: {
            args: Prisma.StorageContentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageContentPayload>
          }
          deleteMany: {
            args: Prisma.StorageContentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StorageContentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StorageContentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageContentPayload>[]
          }
          upsert: {
            args: Prisma.StorageContentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StorageContentPayload>
          }
          aggregate: {
            args: Prisma.StorageContentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStorageContent>
          }
          groupBy: {
            args: Prisma.StorageContentGroupByArgs<ExtArgs>
            result: $Utils.Optional<StorageContentGroupByOutputType>[]
          }
          count: {
            args: Prisma.StorageContentCountArgs<ExtArgs>
            result: $Utils.Optional<StorageContentCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
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
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    storageMetadata?: StorageMetadataOmit
    storageContent?: StorageContentOmit
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
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

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
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model StorageMetadata
   */

  export type AggregateStorageMetadata = {
    _count: StorageMetadataCountAggregateOutputType | null
    _avg: StorageMetadataAvgAggregateOutputType | null
    _sum: StorageMetadataSumAggregateOutputType | null
    _min: StorageMetadataMinAggregateOutputType | null
    _max: StorageMetadataMaxAggregateOutputType | null
  }

  export type StorageMetadataAvgAggregateOutputType = {
    timestamp: number | null
    expiresAt: number | null
  }

  export type StorageMetadataSumAggregateOutputType = {
    timestamp: bigint | null
    expiresAt: bigint | null
  }

  export type StorageMetadataMinAggregateOutputType = {
    id: string | null
    type: string | null
    timestamp: bigint | null
    expiresAt: bigint | null
    contentType: string | null
    extension: string | null
    originalName: string | null
  }

  export type StorageMetadataMaxAggregateOutputType = {
    id: string | null
    type: string | null
    timestamp: bigint | null
    expiresAt: bigint | null
    contentType: string | null
    extension: string | null
    originalName: string | null
  }

  export type StorageMetadataCountAggregateOutputType = {
    id: number
    type: number
    timestamp: number
    expiresAt: number
    contentType: number
    extension: number
    originalName: number
    _all: number
  }


  export type StorageMetadataAvgAggregateInputType = {
    timestamp?: true
    expiresAt?: true
  }

  export type StorageMetadataSumAggregateInputType = {
    timestamp?: true
    expiresAt?: true
  }

  export type StorageMetadataMinAggregateInputType = {
    id?: true
    type?: true
    timestamp?: true
    expiresAt?: true
    contentType?: true
    extension?: true
    originalName?: true
  }

  export type StorageMetadataMaxAggregateInputType = {
    id?: true
    type?: true
    timestamp?: true
    expiresAt?: true
    contentType?: true
    extension?: true
    originalName?: true
  }

  export type StorageMetadataCountAggregateInputType = {
    id?: true
    type?: true
    timestamp?: true
    expiresAt?: true
    contentType?: true
    extension?: true
    originalName?: true
    _all?: true
  }

  export type StorageMetadataAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StorageMetadata to aggregate.
     */
    where?: StorageMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StorageMetadata to fetch.
     */
    orderBy?: StorageMetadataOrderByWithRelationInput | StorageMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StorageMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StorageMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StorageMetadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StorageMetadata
    **/
    _count?: true | StorageMetadataCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StorageMetadataAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StorageMetadataSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StorageMetadataMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StorageMetadataMaxAggregateInputType
  }

  export type GetStorageMetadataAggregateType<T extends StorageMetadataAggregateArgs> = {
        [P in keyof T & keyof AggregateStorageMetadata]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStorageMetadata[P]>
      : GetScalarType<T[P], AggregateStorageMetadata[P]>
  }




  export type StorageMetadataGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StorageMetadataWhereInput
    orderBy?: StorageMetadataOrderByWithAggregationInput | StorageMetadataOrderByWithAggregationInput[]
    by: StorageMetadataScalarFieldEnum[] | StorageMetadataScalarFieldEnum
    having?: StorageMetadataScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StorageMetadataCountAggregateInputType | true
    _avg?: StorageMetadataAvgAggregateInputType
    _sum?: StorageMetadataSumAggregateInputType
    _min?: StorageMetadataMinAggregateInputType
    _max?: StorageMetadataMaxAggregateInputType
  }

  export type StorageMetadataGroupByOutputType = {
    id: string
    type: string
    timestamp: bigint
    expiresAt: bigint
    contentType: string | null
    extension: string | null
    originalName: string | null
    _count: StorageMetadataCountAggregateOutputType | null
    _avg: StorageMetadataAvgAggregateOutputType | null
    _sum: StorageMetadataSumAggregateOutputType | null
    _min: StorageMetadataMinAggregateOutputType | null
    _max: StorageMetadataMaxAggregateOutputType | null
  }

  type GetStorageMetadataGroupByPayload<T extends StorageMetadataGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StorageMetadataGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StorageMetadataGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StorageMetadataGroupByOutputType[P]>
            : GetScalarType<T[P], StorageMetadataGroupByOutputType[P]>
        }
      >
    >


  export type StorageMetadataSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    timestamp?: boolean
    expiresAt?: boolean
    contentType?: boolean
    extension?: boolean
    originalName?: boolean
    content?: boolean | StorageMetadata$contentArgs<ExtArgs>
  }, ExtArgs["result"]["storageMetadata"]>

  export type StorageMetadataSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    timestamp?: boolean
    expiresAt?: boolean
    contentType?: boolean
    extension?: boolean
    originalName?: boolean
  }, ExtArgs["result"]["storageMetadata"]>

  export type StorageMetadataSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    timestamp?: boolean
    expiresAt?: boolean
    contentType?: boolean
    extension?: boolean
    originalName?: boolean
  }, ExtArgs["result"]["storageMetadata"]>

  export type StorageMetadataSelectScalar = {
    id?: boolean
    type?: boolean
    timestamp?: boolean
    expiresAt?: boolean
    contentType?: boolean
    extension?: boolean
    originalName?: boolean
  }

  export type StorageMetadataOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "type" | "timestamp" | "expiresAt" | "contentType" | "extension" | "originalName", ExtArgs["result"]["storageMetadata"]>
  export type StorageMetadataInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    content?: boolean | StorageMetadata$contentArgs<ExtArgs>
  }
  export type StorageMetadataIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type StorageMetadataIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $StorageMetadataPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StorageMetadata"
    objects: {
      content: Prisma.$StorageContentPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: string
      timestamp: bigint
      expiresAt: bigint
      contentType: string | null
      extension: string | null
      originalName: string | null
    }, ExtArgs["result"]["storageMetadata"]>
    composites: {}
  }

  type StorageMetadataGetPayload<S extends boolean | null | undefined | StorageMetadataDefaultArgs> = $Result.GetResult<Prisma.$StorageMetadataPayload, S>

  type StorageMetadataCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StorageMetadataFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StorageMetadataCountAggregateInputType | true
    }

  export interface StorageMetadataDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StorageMetadata'], meta: { name: 'StorageMetadata' } }
    /**
     * Find zero or one StorageMetadata that matches the filter.
     * @param {StorageMetadataFindUniqueArgs} args - Arguments to find a StorageMetadata
     * @example
     * // Get one StorageMetadata
     * const storageMetadata = await prisma.storageMetadata.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StorageMetadataFindUniqueArgs>(args: SelectSubset<T, StorageMetadataFindUniqueArgs<ExtArgs>>): Prisma__StorageMetadataClient<$Result.GetResult<Prisma.$StorageMetadataPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StorageMetadata that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StorageMetadataFindUniqueOrThrowArgs} args - Arguments to find a StorageMetadata
     * @example
     * // Get one StorageMetadata
     * const storageMetadata = await prisma.storageMetadata.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StorageMetadataFindUniqueOrThrowArgs>(args: SelectSubset<T, StorageMetadataFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StorageMetadataClient<$Result.GetResult<Prisma.$StorageMetadataPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StorageMetadata that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageMetadataFindFirstArgs} args - Arguments to find a StorageMetadata
     * @example
     * // Get one StorageMetadata
     * const storageMetadata = await prisma.storageMetadata.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StorageMetadataFindFirstArgs>(args?: SelectSubset<T, StorageMetadataFindFirstArgs<ExtArgs>>): Prisma__StorageMetadataClient<$Result.GetResult<Prisma.$StorageMetadataPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StorageMetadata that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageMetadataFindFirstOrThrowArgs} args - Arguments to find a StorageMetadata
     * @example
     * // Get one StorageMetadata
     * const storageMetadata = await prisma.storageMetadata.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StorageMetadataFindFirstOrThrowArgs>(args?: SelectSubset<T, StorageMetadataFindFirstOrThrowArgs<ExtArgs>>): Prisma__StorageMetadataClient<$Result.GetResult<Prisma.$StorageMetadataPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StorageMetadata that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageMetadataFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StorageMetadata
     * const storageMetadata = await prisma.storageMetadata.findMany()
     * 
     * // Get first 10 StorageMetadata
     * const storageMetadata = await prisma.storageMetadata.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const storageMetadataWithIdOnly = await prisma.storageMetadata.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StorageMetadataFindManyArgs>(args?: SelectSubset<T, StorageMetadataFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorageMetadataPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StorageMetadata.
     * @param {StorageMetadataCreateArgs} args - Arguments to create a StorageMetadata.
     * @example
     * // Create one StorageMetadata
     * const StorageMetadata = await prisma.storageMetadata.create({
     *   data: {
     *     // ... data to create a StorageMetadata
     *   }
     * })
     * 
     */
    create<T extends StorageMetadataCreateArgs>(args: SelectSubset<T, StorageMetadataCreateArgs<ExtArgs>>): Prisma__StorageMetadataClient<$Result.GetResult<Prisma.$StorageMetadataPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StorageMetadata.
     * @param {StorageMetadataCreateManyArgs} args - Arguments to create many StorageMetadata.
     * @example
     * // Create many StorageMetadata
     * const storageMetadata = await prisma.storageMetadata.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StorageMetadataCreateManyArgs>(args?: SelectSubset<T, StorageMetadataCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StorageMetadata and returns the data saved in the database.
     * @param {StorageMetadataCreateManyAndReturnArgs} args - Arguments to create many StorageMetadata.
     * @example
     * // Create many StorageMetadata
     * const storageMetadata = await prisma.storageMetadata.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StorageMetadata and only return the `id`
     * const storageMetadataWithIdOnly = await prisma.storageMetadata.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StorageMetadataCreateManyAndReturnArgs>(args?: SelectSubset<T, StorageMetadataCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorageMetadataPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StorageMetadata.
     * @param {StorageMetadataDeleteArgs} args - Arguments to delete one StorageMetadata.
     * @example
     * // Delete one StorageMetadata
     * const StorageMetadata = await prisma.storageMetadata.delete({
     *   where: {
     *     // ... filter to delete one StorageMetadata
     *   }
     * })
     * 
     */
    delete<T extends StorageMetadataDeleteArgs>(args: SelectSubset<T, StorageMetadataDeleteArgs<ExtArgs>>): Prisma__StorageMetadataClient<$Result.GetResult<Prisma.$StorageMetadataPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StorageMetadata.
     * @param {StorageMetadataUpdateArgs} args - Arguments to update one StorageMetadata.
     * @example
     * // Update one StorageMetadata
     * const storageMetadata = await prisma.storageMetadata.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StorageMetadataUpdateArgs>(args: SelectSubset<T, StorageMetadataUpdateArgs<ExtArgs>>): Prisma__StorageMetadataClient<$Result.GetResult<Prisma.$StorageMetadataPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StorageMetadata.
     * @param {StorageMetadataDeleteManyArgs} args - Arguments to filter StorageMetadata to delete.
     * @example
     * // Delete a few StorageMetadata
     * const { count } = await prisma.storageMetadata.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StorageMetadataDeleteManyArgs>(args?: SelectSubset<T, StorageMetadataDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StorageMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageMetadataUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StorageMetadata
     * const storageMetadata = await prisma.storageMetadata.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StorageMetadataUpdateManyArgs>(args: SelectSubset<T, StorageMetadataUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StorageMetadata and returns the data updated in the database.
     * @param {StorageMetadataUpdateManyAndReturnArgs} args - Arguments to update many StorageMetadata.
     * @example
     * // Update many StorageMetadata
     * const storageMetadata = await prisma.storageMetadata.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StorageMetadata and only return the `id`
     * const storageMetadataWithIdOnly = await prisma.storageMetadata.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StorageMetadataUpdateManyAndReturnArgs>(args: SelectSubset<T, StorageMetadataUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorageMetadataPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StorageMetadata.
     * @param {StorageMetadataUpsertArgs} args - Arguments to update or create a StorageMetadata.
     * @example
     * // Update or create a StorageMetadata
     * const storageMetadata = await prisma.storageMetadata.upsert({
     *   create: {
     *     // ... data to create a StorageMetadata
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StorageMetadata we want to update
     *   }
     * })
     */
    upsert<T extends StorageMetadataUpsertArgs>(args: SelectSubset<T, StorageMetadataUpsertArgs<ExtArgs>>): Prisma__StorageMetadataClient<$Result.GetResult<Prisma.$StorageMetadataPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StorageMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageMetadataCountArgs} args - Arguments to filter StorageMetadata to count.
     * @example
     * // Count the number of StorageMetadata
     * const count = await prisma.storageMetadata.count({
     *   where: {
     *     // ... the filter for the StorageMetadata we want to count
     *   }
     * })
    **/
    count<T extends StorageMetadataCountArgs>(
      args?: Subset<T, StorageMetadataCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StorageMetadataCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StorageMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageMetadataAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends StorageMetadataAggregateArgs>(args: Subset<T, StorageMetadataAggregateArgs>): Prisma.PrismaPromise<GetStorageMetadataAggregateType<T>>

    /**
     * Group by StorageMetadata.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageMetadataGroupByArgs} args - Group by arguments.
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
      T extends StorageMetadataGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StorageMetadataGroupByArgs['orderBy'] }
        : { orderBy?: StorageMetadataGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, StorageMetadataGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStorageMetadataGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StorageMetadata model
   */
  readonly fields: StorageMetadataFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StorageMetadata.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StorageMetadataClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    content<T extends StorageMetadata$contentArgs<ExtArgs> = {}>(args?: Subset<T, StorageMetadata$contentArgs<ExtArgs>>): Prisma__StorageContentClient<$Result.GetResult<Prisma.$StorageContentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StorageMetadata model
   */
  interface StorageMetadataFieldRefs {
    readonly id: FieldRef<"StorageMetadata", 'String'>
    readonly type: FieldRef<"StorageMetadata", 'String'>
    readonly timestamp: FieldRef<"StorageMetadata", 'BigInt'>
    readonly expiresAt: FieldRef<"StorageMetadata", 'BigInt'>
    readonly contentType: FieldRef<"StorageMetadata", 'String'>
    readonly extension: FieldRef<"StorageMetadata", 'String'>
    readonly originalName: FieldRef<"StorageMetadata", 'String'>
  }
    

  // Custom InputTypes
  /**
   * StorageMetadata findUnique
   */
  export type StorageMetadataFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageMetadata
     */
    select?: StorageMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageMetadata
     */
    omit?: StorageMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageMetadataInclude<ExtArgs> | null
    /**
     * Filter, which StorageMetadata to fetch.
     */
    where: StorageMetadataWhereUniqueInput
  }

  /**
   * StorageMetadata findUniqueOrThrow
   */
  export type StorageMetadataFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageMetadata
     */
    select?: StorageMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageMetadata
     */
    omit?: StorageMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageMetadataInclude<ExtArgs> | null
    /**
     * Filter, which StorageMetadata to fetch.
     */
    where: StorageMetadataWhereUniqueInput
  }

  /**
   * StorageMetadata findFirst
   */
  export type StorageMetadataFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageMetadata
     */
    select?: StorageMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageMetadata
     */
    omit?: StorageMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageMetadataInclude<ExtArgs> | null
    /**
     * Filter, which StorageMetadata to fetch.
     */
    where?: StorageMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StorageMetadata to fetch.
     */
    orderBy?: StorageMetadataOrderByWithRelationInput | StorageMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StorageMetadata.
     */
    cursor?: StorageMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StorageMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StorageMetadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StorageMetadata.
     */
    distinct?: StorageMetadataScalarFieldEnum | StorageMetadataScalarFieldEnum[]
  }

  /**
   * StorageMetadata findFirstOrThrow
   */
  export type StorageMetadataFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageMetadata
     */
    select?: StorageMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageMetadata
     */
    omit?: StorageMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageMetadataInclude<ExtArgs> | null
    /**
     * Filter, which StorageMetadata to fetch.
     */
    where?: StorageMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StorageMetadata to fetch.
     */
    orderBy?: StorageMetadataOrderByWithRelationInput | StorageMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StorageMetadata.
     */
    cursor?: StorageMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StorageMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StorageMetadata.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StorageMetadata.
     */
    distinct?: StorageMetadataScalarFieldEnum | StorageMetadataScalarFieldEnum[]
  }

  /**
   * StorageMetadata findMany
   */
  export type StorageMetadataFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageMetadata
     */
    select?: StorageMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageMetadata
     */
    omit?: StorageMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageMetadataInclude<ExtArgs> | null
    /**
     * Filter, which StorageMetadata to fetch.
     */
    where?: StorageMetadataWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StorageMetadata to fetch.
     */
    orderBy?: StorageMetadataOrderByWithRelationInput | StorageMetadataOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StorageMetadata.
     */
    cursor?: StorageMetadataWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StorageMetadata from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StorageMetadata.
     */
    skip?: number
    distinct?: StorageMetadataScalarFieldEnum | StorageMetadataScalarFieldEnum[]
  }

  /**
   * StorageMetadata create
   */
  export type StorageMetadataCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageMetadata
     */
    select?: StorageMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageMetadata
     */
    omit?: StorageMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageMetadataInclude<ExtArgs> | null
    /**
     * The data needed to create a StorageMetadata.
     */
    data: XOR<StorageMetadataCreateInput, StorageMetadataUncheckedCreateInput>
  }

  /**
   * StorageMetadata createMany
   */
  export type StorageMetadataCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StorageMetadata.
     */
    data: StorageMetadataCreateManyInput | StorageMetadataCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StorageMetadata createManyAndReturn
   */
  export type StorageMetadataCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageMetadata
     */
    select?: StorageMetadataSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StorageMetadata
     */
    omit?: StorageMetadataOmit<ExtArgs> | null
    /**
     * The data used to create many StorageMetadata.
     */
    data: StorageMetadataCreateManyInput | StorageMetadataCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StorageMetadata update
   */
  export type StorageMetadataUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageMetadata
     */
    select?: StorageMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageMetadata
     */
    omit?: StorageMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageMetadataInclude<ExtArgs> | null
    /**
     * The data needed to update a StorageMetadata.
     */
    data: XOR<StorageMetadataUpdateInput, StorageMetadataUncheckedUpdateInput>
    /**
     * Choose, which StorageMetadata to update.
     */
    where: StorageMetadataWhereUniqueInput
  }

  /**
   * StorageMetadata updateMany
   */
  export type StorageMetadataUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StorageMetadata.
     */
    data: XOR<StorageMetadataUpdateManyMutationInput, StorageMetadataUncheckedUpdateManyInput>
    /**
     * Filter which StorageMetadata to update
     */
    where?: StorageMetadataWhereInput
    /**
     * Limit how many StorageMetadata to update.
     */
    limit?: number
  }

  /**
   * StorageMetadata updateManyAndReturn
   */
  export type StorageMetadataUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageMetadata
     */
    select?: StorageMetadataSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StorageMetadata
     */
    omit?: StorageMetadataOmit<ExtArgs> | null
    /**
     * The data used to update StorageMetadata.
     */
    data: XOR<StorageMetadataUpdateManyMutationInput, StorageMetadataUncheckedUpdateManyInput>
    /**
     * Filter which StorageMetadata to update
     */
    where?: StorageMetadataWhereInput
    /**
     * Limit how many StorageMetadata to update.
     */
    limit?: number
  }

  /**
   * StorageMetadata upsert
   */
  export type StorageMetadataUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageMetadata
     */
    select?: StorageMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageMetadata
     */
    omit?: StorageMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageMetadataInclude<ExtArgs> | null
    /**
     * The filter to search for the StorageMetadata to update in case it exists.
     */
    where: StorageMetadataWhereUniqueInput
    /**
     * In case the StorageMetadata found by the `where` argument doesn't exist, create a new StorageMetadata with this data.
     */
    create: XOR<StorageMetadataCreateInput, StorageMetadataUncheckedCreateInput>
    /**
     * In case the StorageMetadata was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StorageMetadataUpdateInput, StorageMetadataUncheckedUpdateInput>
  }

  /**
   * StorageMetadata delete
   */
  export type StorageMetadataDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageMetadata
     */
    select?: StorageMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageMetadata
     */
    omit?: StorageMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageMetadataInclude<ExtArgs> | null
    /**
     * Filter which StorageMetadata to delete.
     */
    where: StorageMetadataWhereUniqueInput
  }

  /**
   * StorageMetadata deleteMany
   */
  export type StorageMetadataDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StorageMetadata to delete
     */
    where?: StorageMetadataWhereInput
    /**
     * Limit how many StorageMetadata to delete.
     */
    limit?: number
  }

  /**
   * StorageMetadata.content
   */
  export type StorageMetadata$contentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageContent
     */
    select?: StorageContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageContent
     */
    omit?: StorageContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageContentInclude<ExtArgs> | null
    where?: StorageContentWhereInput
  }

  /**
   * StorageMetadata without action
   */
  export type StorageMetadataDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageMetadata
     */
    select?: StorageMetadataSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageMetadata
     */
    omit?: StorageMetadataOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageMetadataInclude<ExtArgs> | null
  }


  /**
   * Model StorageContent
   */

  export type AggregateStorageContent = {
    _count: StorageContentCountAggregateOutputType | null
    _min: StorageContentMinAggregateOutputType | null
    _max: StorageContentMaxAggregateOutputType | null
  }

  export type StorageContentMinAggregateOutputType = {
    id: string | null
    content: Uint8Array | null
  }

  export type StorageContentMaxAggregateOutputType = {
    id: string | null
    content: Uint8Array | null
  }

  export type StorageContentCountAggregateOutputType = {
    id: number
    content: number
    _all: number
  }


  export type StorageContentMinAggregateInputType = {
    id?: true
    content?: true
  }

  export type StorageContentMaxAggregateInputType = {
    id?: true
    content?: true
  }

  export type StorageContentCountAggregateInputType = {
    id?: true
    content?: true
    _all?: true
  }

  export type StorageContentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StorageContent to aggregate.
     */
    where?: StorageContentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StorageContents to fetch.
     */
    orderBy?: StorageContentOrderByWithRelationInput | StorageContentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StorageContentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StorageContents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StorageContents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StorageContents
    **/
    _count?: true | StorageContentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StorageContentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StorageContentMaxAggregateInputType
  }

  export type GetStorageContentAggregateType<T extends StorageContentAggregateArgs> = {
        [P in keyof T & keyof AggregateStorageContent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStorageContent[P]>
      : GetScalarType<T[P], AggregateStorageContent[P]>
  }




  export type StorageContentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StorageContentWhereInput
    orderBy?: StorageContentOrderByWithAggregationInput | StorageContentOrderByWithAggregationInput[]
    by: StorageContentScalarFieldEnum[] | StorageContentScalarFieldEnum
    having?: StorageContentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StorageContentCountAggregateInputType | true
    _min?: StorageContentMinAggregateInputType
    _max?: StorageContentMaxAggregateInputType
  }

  export type StorageContentGroupByOutputType = {
    id: string
    content: Uint8Array
    _count: StorageContentCountAggregateOutputType | null
    _min: StorageContentMinAggregateOutputType | null
    _max: StorageContentMaxAggregateOutputType | null
  }

  type GetStorageContentGroupByPayload<T extends StorageContentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StorageContentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StorageContentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StorageContentGroupByOutputType[P]>
            : GetScalarType<T[P], StorageContentGroupByOutputType[P]>
        }
      >
    >


  export type StorageContentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    metadata?: boolean | StorageMetadataDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["storageContent"]>

  export type StorageContentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    metadata?: boolean | StorageMetadataDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["storageContent"]>

  export type StorageContentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    metadata?: boolean | StorageMetadataDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["storageContent"]>

  export type StorageContentSelectScalar = {
    id?: boolean
    content?: boolean
  }

  export type StorageContentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "content", ExtArgs["result"]["storageContent"]>
  export type StorageContentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    metadata?: boolean | StorageMetadataDefaultArgs<ExtArgs>
  }
  export type StorageContentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    metadata?: boolean | StorageMetadataDefaultArgs<ExtArgs>
  }
  export type StorageContentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    metadata?: boolean | StorageMetadataDefaultArgs<ExtArgs>
  }

  export type $StorageContentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StorageContent"
    objects: {
      metadata: Prisma.$StorageMetadataPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      content: Uint8Array
    }, ExtArgs["result"]["storageContent"]>
    composites: {}
  }

  type StorageContentGetPayload<S extends boolean | null | undefined | StorageContentDefaultArgs> = $Result.GetResult<Prisma.$StorageContentPayload, S>

  type StorageContentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StorageContentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StorageContentCountAggregateInputType | true
    }

  export interface StorageContentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StorageContent'], meta: { name: 'StorageContent' } }
    /**
     * Find zero or one StorageContent that matches the filter.
     * @param {StorageContentFindUniqueArgs} args - Arguments to find a StorageContent
     * @example
     * // Get one StorageContent
     * const storageContent = await prisma.storageContent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StorageContentFindUniqueArgs>(args: SelectSubset<T, StorageContentFindUniqueArgs<ExtArgs>>): Prisma__StorageContentClient<$Result.GetResult<Prisma.$StorageContentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StorageContent that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StorageContentFindUniqueOrThrowArgs} args - Arguments to find a StorageContent
     * @example
     * // Get one StorageContent
     * const storageContent = await prisma.storageContent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StorageContentFindUniqueOrThrowArgs>(args: SelectSubset<T, StorageContentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StorageContentClient<$Result.GetResult<Prisma.$StorageContentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StorageContent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageContentFindFirstArgs} args - Arguments to find a StorageContent
     * @example
     * // Get one StorageContent
     * const storageContent = await prisma.storageContent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StorageContentFindFirstArgs>(args?: SelectSubset<T, StorageContentFindFirstArgs<ExtArgs>>): Prisma__StorageContentClient<$Result.GetResult<Prisma.$StorageContentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StorageContent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageContentFindFirstOrThrowArgs} args - Arguments to find a StorageContent
     * @example
     * // Get one StorageContent
     * const storageContent = await prisma.storageContent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StorageContentFindFirstOrThrowArgs>(args?: SelectSubset<T, StorageContentFindFirstOrThrowArgs<ExtArgs>>): Prisma__StorageContentClient<$Result.GetResult<Prisma.$StorageContentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StorageContents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageContentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StorageContents
     * const storageContents = await prisma.storageContent.findMany()
     * 
     * // Get first 10 StorageContents
     * const storageContents = await prisma.storageContent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const storageContentWithIdOnly = await prisma.storageContent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StorageContentFindManyArgs>(args?: SelectSubset<T, StorageContentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorageContentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StorageContent.
     * @param {StorageContentCreateArgs} args - Arguments to create a StorageContent.
     * @example
     * // Create one StorageContent
     * const StorageContent = await prisma.storageContent.create({
     *   data: {
     *     // ... data to create a StorageContent
     *   }
     * })
     * 
     */
    create<T extends StorageContentCreateArgs>(args: SelectSubset<T, StorageContentCreateArgs<ExtArgs>>): Prisma__StorageContentClient<$Result.GetResult<Prisma.$StorageContentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StorageContents.
     * @param {StorageContentCreateManyArgs} args - Arguments to create many StorageContents.
     * @example
     * // Create many StorageContents
     * const storageContent = await prisma.storageContent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StorageContentCreateManyArgs>(args?: SelectSubset<T, StorageContentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StorageContents and returns the data saved in the database.
     * @param {StorageContentCreateManyAndReturnArgs} args - Arguments to create many StorageContents.
     * @example
     * // Create many StorageContents
     * const storageContent = await prisma.storageContent.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StorageContents and only return the `id`
     * const storageContentWithIdOnly = await prisma.storageContent.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StorageContentCreateManyAndReturnArgs>(args?: SelectSubset<T, StorageContentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorageContentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StorageContent.
     * @param {StorageContentDeleteArgs} args - Arguments to delete one StorageContent.
     * @example
     * // Delete one StorageContent
     * const StorageContent = await prisma.storageContent.delete({
     *   where: {
     *     // ... filter to delete one StorageContent
     *   }
     * })
     * 
     */
    delete<T extends StorageContentDeleteArgs>(args: SelectSubset<T, StorageContentDeleteArgs<ExtArgs>>): Prisma__StorageContentClient<$Result.GetResult<Prisma.$StorageContentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StorageContent.
     * @param {StorageContentUpdateArgs} args - Arguments to update one StorageContent.
     * @example
     * // Update one StorageContent
     * const storageContent = await prisma.storageContent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StorageContentUpdateArgs>(args: SelectSubset<T, StorageContentUpdateArgs<ExtArgs>>): Prisma__StorageContentClient<$Result.GetResult<Prisma.$StorageContentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StorageContents.
     * @param {StorageContentDeleteManyArgs} args - Arguments to filter StorageContents to delete.
     * @example
     * // Delete a few StorageContents
     * const { count } = await prisma.storageContent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StorageContentDeleteManyArgs>(args?: SelectSubset<T, StorageContentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StorageContents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageContentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StorageContents
     * const storageContent = await prisma.storageContent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StorageContentUpdateManyArgs>(args: SelectSubset<T, StorageContentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StorageContents and returns the data updated in the database.
     * @param {StorageContentUpdateManyAndReturnArgs} args - Arguments to update many StorageContents.
     * @example
     * // Update many StorageContents
     * const storageContent = await prisma.storageContent.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StorageContents and only return the `id`
     * const storageContentWithIdOnly = await prisma.storageContent.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StorageContentUpdateManyAndReturnArgs>(args: SelectSubset<T, StorageContentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StorageContentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StorageContent.
     * @param {StorageContentUpsertArgs} args - Arguments to update or create a StorageContent.
     * @example
     * // Update or create a StorageContent
     * const storageContent = await prisma.storageContent.upsert({
     *   create: {
     *     // ... data to create a StorageContent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StorageContent we want to update
     *   }
     * })
     */
    upsert<T extends StorageContentUpsertArgs>(args: SelectSubset<T, StorageContentUpsertArgs<ExtArgs>>): Prisma__StorageContentClient<$Result.GetResult<Prisma.$StorageContentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StorageContents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageContentCountArgs} args - Arguments to filter StorageContents to count.
     * @example
     * // Count the number of StorageContents
     * const count = await prisma.storageContent.count({
     *   where: {
     *     // ... the filter for the StorageContents we want to count
     *   }
     * })
    **/
    count<T extends StorageContentCountArgs>(
      args?: Subset<T, StorageContentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StorageContentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StorageContent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageContentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends StorageContentAggregateArgs>(args: Subset<T, StorageContentAggregateArgs>): Prisma.PrismaPromise<GetStorageContentAggregateType<T>>

    /**
     * Group by StorageContent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StorageContentGroupByArgs} args - Group by arguments.
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
      T extends StorageContentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StorageContentGroupByArgs['orderBy'] }
        : { orderBy?: StorageContentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
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
    >(args: SubsetIntersection<T, StorageContentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStorageContentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StorageContent model
   */
  readonly fields: StorageContentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StorageContent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StorageContentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    metadata<T extends StorageMetadataDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StorageMetadataDefaultArgs<ExtArgs>>): Prisma__StorageMetadataClient<$Result.GetResult<Prisma.$StorageMetadataPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StorageContent model
   */
  interface StorageContentFieldRefs {
    readonly id: FieldRef<"StorageContent", 'String'>
    readonly content: FieldRef<"StorageContent", 'Bytes'>
  }
    

  // Custom InputTypes
  /**
   * StorageContent findUnique
   */
  export type StorageContentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageContent
     */
    select?: StorageContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageContent
     */
    omit?: StorageContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageContentInclude<ExtArgs> | null
    /**
     * Filter, which StorageContent to fetch.
     */
    where: StorageContentWhereUniqueInput
  }

  /**
   * StorageContent findUniqueOrThrow
   */
  export type StorageContentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageContent
     */
    select?: StorageContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageContent
     */
    omit?: StorageContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageContentInclude<ExtArgs> | null
    /**
     * Filter, which StorageContent to fetch.
     */
    where: StorageContentWhereUniqueInput
  }

  /**
   * StorageContent findFirst
   */
  export type StorageContentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageContent
     */
    select?: StorageContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageContent
     */
    omit?: StorageContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageContentInclude<ExtArgs> | null
    /**
     * Filter, which StorageContent to fetch.
     */
    where?: StorageContentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StorageContents to fetch.
     */
    orderBy?: StorageContentOrderByWithRelationInput | StorageContentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StorageContents.
     */
    cursor?: StorageContentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StorageContents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StorageContents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StorageContents.
     */
    distinct?: StorageContentScalarFieldEnum | StorageContentScalarFieldEnum[]
  }

  /**
   * StorageContent findFirstOrThrow
   */
  export type StorageContentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageContent
     */
    select?: StorageContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageContent
     */
    omit?: StorageContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageContentInclude<ExtArgs> | null
    /**
     * Filter, which StorageContent to fetch.
     */
    where?: StorageContentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StorageContents to fetch.
     */
    orderBy?: StorageContentOrderByWithRelationInput | StorageContentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StorageContents.
     */
    cursor?: StorageContentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StorageContents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StorageContents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StorageContents.
     */
    distinct?: StorageContentScalarFieldEnum | StorageContentScalarFieldEnum[]
  }

  /**
   * StorageContent findMany
   */
  export type StorageContentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageContent
     */
    select?: StorageContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageContent
     */
    omit?: StorageContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageContentInclude<ExtArgs> | null
    /**
     * Filter, which StorageContents to fetch.
     */
    where?: StorageContentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StorageContents to fetch.
     */
    orderBy?: StorageContentOrderByWithRelationInput | StorageContentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StorageContents.
     */
    cursor?: StorageContentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StorageContents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StorageContents.
     */
    skip?: number
    distinct?: StorageContentScalarFieldEnum | StorageContentScalarFieldEnum[]
  }

  /**
   * StorageContent create
   */
  export type StorageContentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageContent
     */
    select?: StorageContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageContent
     */
    omit?: StorageContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageContentInclude<ExtArgs> | null
    /**
     * The data needed to create a StorageContent.
     */
    data: XOR<StorageContentCreateInput, StorageContentUncheckedCreateInput>
  }

  /**
   * StorageContent createMany
   */
  export type StorageContentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StorageContents.
     */
    data: StorageContentCreateManyInput | StorageContentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StorageContent createManyAndReturn
   */
  export type StorageContentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageContent
     */
    select?: StorageContentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StorageContent
     */
    omit?: StorageContentOmit<ExtArgs> | null
    /**
     * The data used to create many StorageContents.
     */
    data: StorageContentCreateManyInput | StorageContentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageContentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * StorageContent update
   */
  export type StorageContentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageContent
     */
    select?: StorageContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageContent
     */
    omit?: StorageContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageContentInclude<ExtArgs> | null
    /**
     * The data needed to update a StorageContent.
     */
    data: XOR<StorageContentUpdateInput, StorageContentUncheckedUpdateInput>
    /**
     * Choose, which StorageContent to update.
     */
    where: StorageContentWhereUniqueInput
  }

  /**
   * StorageContent updateMany
   */
  export type StorageContentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StorageContents.
     */
    data: XOR<StorageContentUpdateManyMutationInput, StorageContentUncheckedUpdateManyInput>
    /**
     * Filter which StorageContents to update
     */
    where?: StorageContentWhereInput
    /**
     * Limit how many StorageContents to update.
     */
    limit?: number
  }

  /**
   * StorageContent updateManyAndReturn
   */
  export type StorageContentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageContent
     */
    select?: StorageContentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StorageContent
     */
    omit?: StorageContentOmit<ExtArgs> | null
    /**
     * The data used to update StorageContents.
     */
    data: XOR<StorageContentUpdateManyMutationInput, StorageContentUncheckedUpdateManyInput>
    /**
     * Filter which StorageContents to update
     */
    where?: StorageContentWhereInput
    /**
     * Limit how many StorageContents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageContentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * StorageContent upsert
   */
  export type StorageContentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageContent
     */
    select?: StorageContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageContent
     */
    omit?: StorageContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageContentInclude<ExtArgs> | null
    /**
     * The filter to search for the StorageContent to update in case it exists.
     */
    where: StorageContentWhereUniqueInput
    /**
     * In case the StorageContent found by the `where` argument doesn't exist, create a new StorageContent with this data.
     */
    create: XOR<StorageContentCreateInput, StorageContentUncheckedCreateInput>
    /**
     * In case the StorageContent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StorageContentUpdateInput, StorageContentUncheckedUpdateInput>
  }

  /**
   * StorageContent delete
   */
  export type StorageContentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageContent
     */
    select?: StorageContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageContent
     */
    omit?: StorageContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageContentInclude<ExtArgs> | null
    /**
     * Filter which StorageContent to delete.
     */
    where: StorageContentWhereUniqueInput
  }

  /**
   * StorageContent deleteMany
   */
  export type StorageContentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StorageContents to delete
     */
    where?: StorageContentWhereInput
    /**
     * Limit how many StorageContents to delete.
     */
    limit?: number
  }

  /**
   * StorageContent without action
   */
  export type StorageContentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StorageContent
     */
    select?: StorageContentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StorageContent
     */
    omit?: StorageContentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StorageContentInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const StorageMetadataScalarFieldEnum: {
    id: 'id',
    type: 'type',
    timestamp: 'timestamp',
    expiresAt: 'expiresAt',
    contentType: 'contentType',
    extension: 'extension',
    originalName: 'originalName'
  };

  export type StorageMetadataScalarFieldEnum = (typeof StorageMetadataScalarFieldEnum)[keyof typeof StorageMetadataScalarFieldEnum]


  export const StorageContentScalarFieldEnum: {
    id: 'id',
    content: 'content'
  };

  export type StorageContentScalarFieldEnum = (typeof StorageContentScalarFieldEnum)[keyof typeof StorageContentScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    


  /**
   * Reference to a field of type 'Bytes'
   */
  export type BytesFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Bytes'>
    


  /**
   * Reference to a field of type 'Bytes[]'
   */
  export type ListBytesFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Bytes[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type StorageMetadataWhereInput = {
    AND?: StorageMetadataWhereInput | StorageMetadataWhereInput[]
    OR?: StorageMetadataWhereInput[]
    NOT?: StorageMetadataWhereInput | StorageMetadataWhereInput[]
    id?: StringFilter<"StorageMetadata"> | string
    type?: StringFilter<"StorageMetadata"> | string
    timestamp?: BigIntFilter<"StorageMetadata"> | bigint | number
    expiresAt?: BigIntFilter<"StorageMetadata"> | bigint | number
    contentType?: StringNullableFilter<"StorageMetadata"> | string | null
    extension?: StringNullableFilter<"StorageMetadata"> | string | null
    originalName?: StringNullableFilter<"StorageMetadata"> | string | null
    content?: XOR<StorageContentNullableScalarRelationFilter, StorageContentWhereInput> | null
  }

  export type StorageMetadataOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    timestamp?: SortOrder
    expiresAt?: SortOrder
    contentType?: SortOrderInput | SortOrder
    extension?: SortOrderInput | SortOrder
    originalName?: SortOrderInput | SortOrder
    content?: StorageContentOrderByWithRelationInput
  }

  export type StorageMetadataWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StorageMetadataWhereInput | StorageMetadataWhereInput[]
    OR?: StorageMetadataWhereInput[]
    NOT?: StorageMetadataWhereInput | StorageMetadataWhereInput[]
    type?: StringFilter<"StorageMetadata"> | string
    timestamp?: BigIntFilter<"StorageMetadata"> | bigint | number
    expiresAt?: BigIntFilter<"StorageMetadata"> | bigint | number
    contentType?: StringNullableFilter<"StorageMetadata"> | string | null
    extension?: StringNullableFilter<"StorageMetadata"> | string | null
    originalName?: StringNullableFilter<"StorageMetadata"> | string | null
    content?: XOR<StorageContentNullableScalarRelationFilter, StorageContentWhereInput> | null
  }, "id">

  export type StorageMetadataOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    timestamp?: SortOrder
    expiresAt?: SortOrder
    contentType?: SortOrderInput | SortOrder
    extension?: SortOrderInput | SortOrder
    originalName?: SortOrderInput | SortOrder
    _count?: StorageMetadataCountOrderByAggregateInput
    _avg?: StorageMetadataAvgOrderByAggregateInput
    _max?: StorageMetadataMaxOrderByAggregateInput
    _min?: StorageMetadataMinOrderByAggregateInput
    _sum?: StorageMetadataSumOrderByAggregateInput
  }

  export type StorageMetadataScalarWhereWithAggregatesInput = {
    AND?: StorageMetadataScalarWhereWithAggregatesInput | StorageMetadataScalarWhereWithAggregatesInput[]
    OR?: StorageMetadataScalarWhereWithAggregatesInput[]
    NOT?: StorageMetadataScalarWhereWithAggregatesInput | StorageMetadataScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StorageMetadata"> | string
    type?: StringWithAggregatesFilter<"StorageMetadata"> | string
    timestamp?: BigIntWithAggregatesFilter<"StorageMetadata"> | bigint | number
    expiresAt?: BigIntWithAggregatesFilter<"StorageMetadata"> | bigint | number
    contentType?: StringNullableWithAggregatesFilter<"StorageMetadata"> | string | null
    extension?: StringNullableWithAggregatesFilter<"StorageMetadata"> | string | null
    originalName?: StringNullableWithAggregatesFilter<"StorageMetadata"> | string | null
  }

  export type StorageContentWhereInput = {
    AND?: StorageContentWhereInput | StorageContentWhereInput[]
    OR?: StorageContentWhereInput[]
    NOT?: StorageContentWhereInput | StorageContentWhereInput[]
    id?: StringFilter<"StorageContent"> | string
    content?: BytesFilter<"StorageContent"> | Uint8Array
    metadata?: XOR<StorageMetadataScalarRelationFilter, StorageMetadataWhereInput>
  }

  export type StorageContentOrderByWithRelationInput = {
    id?: SortOrder
    content?: SortOrder
    metadata?: StorageMetadataOrderByWithRelationInput
  }

  export type StorageContentWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: StorageContentWhereInput | StorageContentWhereInput[]
    OR?: StorageContentWhereInput[]
    NOT?: StorageContentWhereInput | StorageContentWhereInput[]
    content?: BytesFilter<"StorageContent"> | Uint8Array
    metadata?: XOR<StorageMetadataScalarRelationFilter, StorageMetadataWhereInput>
  }, "id">

  export type StorageContentOrderByWithAggregationInput = {
    id?: SortOrder
    content?: SortOrder
    _count?: StorageContentCountOrderByAggregateInput
    _max?: StorageContentMaxOrderByAggregateInput
    _min?: StorageContentMinOrderByAggregateInput
  }

  export type StorageContentScalarWhereWithAggregatesInput = {
    AND?: StorageContentScalarWhereWithAggregatesInput | StorageContentScalarWhereWithAggregatesInput[]
    OR?: StorageContentScalarWhereWithAggregatesInput[]
    NOT?: StorageContentScalarWhereWithAggregatesInput | StorageContentScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StorageContent"> | string
    content?: BytesWithAggregatesFilter<"StorageContent"> | Uint8Array
  }

  export type StorageMetadataCreateInput = {
    id: string
    type: string
    timestamp: bigint | number
    expiresAt: bigint | number
    contentType?: string | null
    extension?: string | null
    originalName?: string | null
    content?: StorageContentCreateNestedOneWithoutMetadataInput
  }

  export type StorageMetadataUncheckedCreateInput = {
    id: string
    type: string
    timestamp: bigint | number
    expiresAt: bigint | number
    contentType?: string | null
    extension?: string | null
    originalName?: string | null
    content?: StorageContentUncheckedCreateNestedOneWithoutMetadataInput
  }

  export type StorageMetadataUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    timestamp?: BigIntFieldUpdateOperationsInput | bigint | number
    expiresAt?: BigIntFieldUpdateOperationsInput | bigint | number
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    extension?: NullableStringFieldUpdateOperationsInput | string | null
    originalName?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StorageContentUpdateOneWithoutMetadataNestedInput
  }

  export type StorageMetadataUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    timestamp?: BigIntFieldUpdateOperationsInput | bigint | number
    expiresAt?: BigIntFieldUpdateOperationsInput | bigint | number
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    extension?: NullableStringFieldUpdateOperationsInput | string | null
    originalName?: NullableStringFieldUpdateOperationsInput | string | null
    content?: StorageContentUncheckedUpdateOneWithoutMetadataNestedInput
  }

  export type StorageMetadataCreateManyInput = {
    id: string
    type: string
    timestamp: bigint | number
    expiresAt: bigint | number
    contentType?: string | null
    extension?: string | null
    originalName?: string | null
  }

  export type StorageMetadataUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    timestamp?: BigIntFieldUpdateOperationsInput | bigint | number
    expiresAt?: BigIntFieldUpdateOperationsInput | bigint | number
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    extension?: NullableStringFieldUpdateOperationsInput | string | null
    originalName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StorageMetadataUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    timestamp?: BigIntFieldUpdateOperationsInput | bigint | number
    expiresAt?: BigIntFieldUpdateOperationsInput | bigint | number
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    extension?: NullableStringFieldUpdateOperationsInput | string | null
    originalName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StorageContentCreateInput = {
    content: Uint8Array
    metadata: StorageMetadataCreateNestedOneWithoutContentInput
  }

  export type StorageContentUncheckedCreateInput = {
    id: string
    content: Uint8Array
  }

  export type StorageContentUpdateInput = {
    content?: BytesFieldUpdateOperationsInput | Uint8Array
    metadata?: StorageMetadataUpdateOneRequiredWithoutContentNestedInput
  }

  export type StorageContentUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: BytesFieldUpdateOperationsInput | Uint8Array
  }

  export type StorageContentCreateManyInput = {
    id: string
    content: Uint8Array
  }

  export type StorageContentUpdateManyMutationInput = {
    content?: BytesFieldUpdateOperationsInput | Uint8Array
  }

  export type StorageContentUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: BytesFieldUpdateOperationsInput | Uint8Array
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type StorageContentNullableScalarRelationFilter = {
    is?: StorageContentWhereInput | null
    isNot?: StorageContentWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type StorageMetadataCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    timestamp?: SortOrder
    expiresAt?: SortOrder
    contentType?: SortOrder
    extension?: SortOrder
    originalName?: SortOrder
  }

  export type StorageMetadataAvgOrderByAggregateInput = {
    timestamp?: SortOrder
    expiresAt?: SortOrder
  }

  export type StorageMetadataMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    timestamp?: SortOrder
    expiresAt?: SortOrder
    contentType?: SortOrder
    extension?: SortOrder
    originalName?: SortOrder
  }

  export type StorageMetadataMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    timestamp?: SortOrder
    expiresAt?: SortOrder
    contentType?: SortOrder
    extension?: SortOrder
    originalName?: SortOrder
  }

  export type StorageMetadataSumOrderByAggregateInput = {
    timestamp?: SortOrder
    expiresAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type BytesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel>
    in?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel>
    notIn?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel>
    not?: NestedBytesFilter<$PrismaModel> | Uint8Array
  }

  export type StorageMetadataScalarRelationFilter = {
    is?: StorageMetadataWhereInput
    isNot?: StorageMetadataWhereInput
  }

  export type StorageContentCountOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
  }

  export type StorageContentMaxOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
  }

  export type StorageContentMinOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
  }

  export type BytesWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel>
    in?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel>
    notIn?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel>
    not?: NestedBytesWithAggregatesFilter<$PrismaModel> | Uint8Array
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBytesFilter<$PrismaModel>
    _max?: NestedBytesFilter<$PrismaModel>
  }

  export type StorageContentCreateNestedOneWithoutMetadataInput = {
    create?: XOR<StorageContentCreateWithoutMetadataInput, StorageContentUncheckedCreateWithoutMetadataInput>
    connectOrCreate?: StorageContentCreateOrConnectWithoutMetadataInput
    connect?: StorageContentWhereUniqueInput
  }

  export type StorageContentUncheckedCreateNestedOneWithoutMetadataInput = {
    create?: XOR<StorageContentCreateWithoutMetadataInput, StorageContentUncheckedCreateWithoutMetadataInput>
    connectOrCreate?: StorageContentCreateOrConnectWithoutMetadataInput
    connect?: StorageContentWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type StorageContentUpdateOneWithoutMetadataNestedInput = {
    create?: XOR<StorageContentCreateWithoutMetadataInput, StorageContentUncheckedCreateWithoutMetadataInput>
    connectOrCreate?: StorageContentCreateOrConnectWithoutMetadataInput
    upsert?: StorageContentUpsertWithoutMetadataInput
    disconnect?: StorageContentWhereInput | boolean
    delete?: StorageContentWhereInput | boolean
    connect?: StorageContentWhereUniqueInput
    update?: XOR<XOR<StorageContentUpdateToOneWithWhereWithoutMetadataInput, StorageContentUpdateWithoutMetadataInput>, StorageContentUncheckedUpdateWithoutMetadataInput>
  }

  export type StorageContentUncheckedUpdateOneWithoutMetadataNestedInput = {
    create?: XOR<StorageContentCreateWithoutMetadataInput, StorageContentUncheckedCreateWithoutMetadataInput>
    connectOrCreate?: StorageContentCreateOrConnectWithoutMetadataInput
    upsert?: StorageContentUpsertWithoutMetadataInput
    disconnect?: StorageContentWhereInput | boolean
    delete?: StorageContentWhereInput | boolean
    connect?: StorageContentWhereUniqueInput
    update?: XOR<XOR<StorageContentUpdateToOneWithWhereWithoutMetadataInput, StorageContentUpdateWithoutMetadataInput>, StorageContentUncheckedUpdateWithoutMetadataInput>
  }

  export type StorageMetadataCreateNestedOneWithoutContentInput = {
    create?: XOR<StorageMetadataCreateWithoutContentInput, StorageMetadataUncheckedCreateWithoutContentInput>
    connectOrCreate?: StorageMetadataCreateOrConnectWithoutContentInput
    connect?: StorageMetadataWhereUniqueInput
  }

  export type BytesFieldUpdateOperationsInput = {
    set?: Uint8Array
  }

  export type StorageMetadataUpdateOneRequiredWithoutContentNestedInput = {
    create?: XOR<StorageMetadataCreateWithoutContentInput, StorageMetadataUncheckedCreateWithoutContentInput>
    connectOrCreate?: StorageMetadataCreateOrConnectWithoutContentInput
    upsert?: StorageMetadataUpsertWithoutContentInput
    connect?: StorageMetadataWhereUniqueInput
    update?: XOR<XOR<StorageMetadataUpdateToOneWithWhereWithoutContentInput, StorageMetadataUpdateWithoutContentInput>, StorageMetadataUncheckedUpdateWithoutContentInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBytesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel>
    in?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel>
    notIn?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel>
    not?: NestedBytesFilter<$PrismaModel> | Uint8Array
  }

  export type NestedBytesWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Uint8Array | BytesFieldRefInput<$PrismaModel>
    in?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel>
    notIn?: Uint8Array[] | ListBytesFieldRefInput<$PrismaModel>
    not?: NestedBytesWithAggregatesFilter<$PrismaModel> | Uint8Array
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBytesFilter<$PrismaModel>
    _max?: NestedBytesFilter<$PrismaModel>
  }

  export type StorageContentCreateWithoutMetadataInput = {
    content: Uint8Array
  }

  export type StorageContentUncheckedCreateWithoutMetadataInput = {
    content: Uint8Array
  }

  export type StorageContentCreateOrConnectWithoutMetadataInput = {
    where: StorageContentWhereUniqueInput
    create: XOR<StorageContentCreateWithoutMetadataInput, StorageContentUncheckedCreateWithoutMetadataInput>
  }

  export type StorageContentUpsertWithoutMetadataInput = {
    update: XOR<StorageContentUpdateWithoutMetadataInput, StorageContentUncheckedUpdateWithoutMetadataInput>
    create: XOR<StorageContentCreateWithoutMetadataInput, StorageContentUncheckedCreateWithoutMetadataInput>
    where?: StorageContentWhereInput
  }

  export type StorageContentUpdateToOneWithWhereWithoutMetadataInput = {
    where?: StorageContentWhereInput
    data: XOR<StorageContentUpdateWithoutMetadataInput, StorageContentUncheckedUpdateWithoutMetadataInput>
  }

  export type StorageContentUpdateWithoutMetadataInput = {
    content?: BytesFieldUpdateOperationsInput | Uint8Array
  }

  export type StorageContentUncheckedUpdateWithoutMetadataInput = {
    content?: BytesFieldUpdateOperationsInput | Uint8Array
  }

  export type StorageMetadataCreateWithoutContentInput = {
    id: string
    type: string
    timestamp: bigint | number
    expiresAt: bigint | number
    contentType?: string | null
    extension?: string | null
    originalName?: string | null
  }

  export type StorageMetadataUncheckedCreateWithoutContentInput = {
    id: string
    type: string
    timestamp: bigint | number
    expiresAt: bigint | number
    contentType?: string | null
    extension?: string | null
    originalName?: string | null
  }

  export type StorageMetadataCreateOrConnectWithoutContentInput = {
    where: StorageMetadataWhereUniqueInput
    create: XOR<StorageMetadataCreateWithoutContentInput, StorageMetadataUncheckedCreateWithoutContentInput>
  }

  export type StorageMetadataUpsertWithoutContentInput = {
    update: XOR<StorageMetadataUpdateWithoutContentInput, StorageMetadataUncheckedUpdateWithoutContentInput>
    create: XOR<StorageMetadataCreateWithoutContentInput, StorageMetadataUncheckedCreateWithoutContentInput>
    where?: StorageMetadataWhereInput
  }

  export type StorageMetadataUpdateToOneWithWhereWithoutContentInput = {
    where?: StorageMetadataWhereInput
    data: XOR<StorageMetadataUpdateWithoutContentInput, StorageMetadataUncheckedUpdateWithoutContentInput>
  }

  export type StorageMetadataUpdateWithoutContentInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    timestamp?: BigIntFieldUpdateOperationsInput | bigint | number
    expiresAt?: BigIntFieldUpdateOperationsInput | bigint | number
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    extension?: NullableStringFieldUpdateOperationsInput | string | null
    originalName?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type StorageMetadataUncheckedUpdateWithoutContentInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    timestamp?: BigIntFieldUpdateOperationsInput | bigint | number
    expiresAt?: BigIntFieldUpdateOperationsInput | bigint | number
    contentType?: NullableStringFieldUpdateOperationsInput | string | null
    extension?: NullableStringFieldUpdateOperationsInput | string | null
    originalName?: NullableStringFieldUpdateOperationsInput | string | null
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