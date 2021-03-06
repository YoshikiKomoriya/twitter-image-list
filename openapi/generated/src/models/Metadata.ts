/* tslint:disable */
/* eslint-disable */
/**
 * sample
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 検索用の付随情報（ツイート単体）
 * @export
 * @interface Metadata
 */
export interface Metadata {
    /**
     * 
     * @type {string}
     * @memberof Metadata
     */
    iso_language_code?: string;
    /**
     * 
     * @type {string}
     * @memberof Metadata
     */
    result_type?: string;
}

export function MetadataFromJSON(json: any): Metadata {
    return MetadataFromJSONTyped(json, false);
}

export function MetadataFromJSONTyped(json: any, ignoreDiscriminator: boolean): Metadata {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'iso_language_code': !exists(json, 'iso_language_code') ? undefined : json['iso_language_code'],
        'result_type': !exists(json, 'result_type') ? undefined : json['result_type'],
    };
}

export function MetadataToJSON(value?: Metadata | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'iso_language_code': value.iso_language_code,
        'result_type': value.result_type,
    };
}


