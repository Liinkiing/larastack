import type { FieldPolicy, FieldReadFunction, TypePolicies, TypePolicy } from '@apollo/client/cache';
export type QueryKeySpecifier = ('viewer' | QueryKeySpecifier)[];
export type QueryFieldPolicy = {
	viewer?: FieldPolicy<any> | FieldReadFunction<any>
};
export type TimestampableKeySpecifier = ('createdAt' | 'updatedAt' | TimestampableKeySpecifier)[];
export type TimestampableFieldPolicy = {
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserKeySpecifier = ('abilities' | 'avatarUrl' | 'createdAt' | 'email' | 'id' | 'name' | 'updatedAt' | UserKeySpecifier)[];
export type UserFieldPolicy = {
	abilities?: FieldPolicy<any> | FieldReadFunction<any>,
	avatarUrl?: FieldPolicy<any> | FieldReadFunction<any>,
	createdAt?: FieldPolicy<any> | FieldReadFunction<any>,
	email?: FieldPolicy<any> | FieldReadFunction<any>,
	id?: FieldPolicy<any> | FieldReadFunction<any>,
	name?: FieldPolicy<any> | FieldReadFunction<any>,
	updatedAt?: FieldPolicy<any> | FieldReadFunction<any>
};
export type UserAbilitiesKeySpecifier = ('viewApp' | UserAbilitiesKeySpecifier)[];
export type UserAbilitiesFieldPolicy = {
	viewApp?: FieldPolicy<any> | FieldReadFunction<any>
};
export type StrictTypedTypePolicies = {
	Query?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | QueryKeySpecifier | (() => undefined | QueryKeySpecifier),
		fields?: QueryFieldPolicy,
	},
	Timestampable?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | TimestampableKeySpecifier | (() => undefined | TimestampableKeySpecifier),
		fields?: TimestampableFieldPolicy,
	},
	User?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserKeySpecifier | (() => undefined | UserKeySpecifier),
		fields?: UserFieldPolicy,
	},
	UserAbilities?: Omit<TypePolicy, "fields" | "keyFields"> & {
		keyFields?: false | UserAbilitiesKeySpecifier | (() => undefined | UserAbilitiesKeySpecifier),
		fields?: UserAbilitiesFieldPolicy,
	}
};
export type TypedTypePolicies = StrictTypedTypePolicies & TypePolicies;