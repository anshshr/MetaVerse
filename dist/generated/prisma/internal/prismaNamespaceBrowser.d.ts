import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly User: "User";
    readonly Space: "Space";
    readonly spaceElements: "spaceElements";
    readonly Element: "Element";
    readonly Map: "Map";
    readonly mapElements: "mapElements";
    readonly Avatar: "Avatar";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly username: "username";
    readonly password: "password";
    readonly role: "role";
    readonly avatarId: "avatarId";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const SpaceScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly width: "width";
    readonly height: "height";
    readonly thumbnail: "thumbnail";
    readonly creatorId: "creatorId";
    readonly mapId: "mapId";
};
export type SpaceScalarFieldEnum = (typeof SpaceScalarFieldEnum)[keyof typeof SpaceScalarFieldEnum];
export declare const SpaceElementsScalarFieldEnum: {
    readonly id: "id";
    readonly elementId: "elementId";
    readonly spaceId: "spaceId";
    readonly x: "x";
    readonly y: "y";
};
export type SpaceElementsScalarFieldEnum = (typeof SpaceElementsScalarFieldEnum)[keyof typeof SpaceElementsScalarFieldEnum];
export declare const ElementScalarFieldEnum: {
    readonly id: "id";
    readonly width: "width";
    readonly height: "height";
    readonly imageUrl: "imageUrl";
};
export type ElementScalarFieldEnum = (typeof ElementScalarFieldEnum)[keyof typeof ElementScalarFieldEnum];
export declare const MapScalarFieldEnum: {
    readonly id: "id";
    readonly width: "width";
    readonly height: "height";
    readonly name: "name";
};
export type MapScalarFieldEnum = (typeof MapScalarFieldEnum)[keyof typeof MapScalarFieldEnum];
export declare const MapElementsScalarFieldEnum: {
    readonly id: "id";
    readonly x: "x";
    readonly y: "y";
    readonly mapId: "mapId";
    readonly elementId: "elementId";
};
export type MapElementsScalarFieldEnum = (typeof MapElementsScalarFieldEnum)[keyof typeof MapElementsScalarFieldEnum];
export declare const AvatarScalarFieldEnum: {
    readonly id: "id";
    readonly imageUrl: "imageUrl";
    readonly name: "name";
};
export type AvatarScalarFieldEnum = (typeof AvatarScalarFieldEnum)[keyof typeof AvatarScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map