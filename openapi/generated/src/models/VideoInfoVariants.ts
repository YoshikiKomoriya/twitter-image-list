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
 * 
 * @export
 * @interface VideoInfoVariants
 */
export interface VideoInfoVariants {
    /**
     * 
     * @type {number}
     * @memberof VideoInfoVariants
     */
    bitrate?: number;
    /**
     * 
     * @type {string}
     * @memberof VideoInfoVariants
     */
    content_type: string;
    /**
     * 
     * @type {string}
     * @memberof VideoInfoVariants
     */
    url: string;
}

export function VideoInfoVariantsFromJSON(json: any): VideoInfoVariants {
    return VideoInfoVariantsFromJSONTyped(json, false);
}

export function VideoInfoVariantsFromJSONTyped(json: any, ignoreDiscriminator: boolean): VideoInfoVariants {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'bitrate': !exists(json, 'bitrate') ? undefined : json['bitrate'],
        'content_type': json['contentType'],
        'url': json['url'],
    };
}

export function VideoInfoVariantsToJSON(value?: VideoInfoVariants | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'bitrate': value.bitrate,
        'contentType': value.content_type,
        'url': value.url,
    };
}


