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
import {
    MediaSize,
    MediaSizeFromJSON,
    MediaSizeFromJSONTyped,
    MediaSizeToJSON,
} from './';

/**
 * 
 * @export
 * @interface MediaSizes
 */
export interface MediaSizes {
    /**
     * 
     * @type {MediaSize}
     * @memberof MediaSizes
     */
    small: MediaSize;
    /**
     * 
     * @type {MediaSize}
     * @memberof MediaSizes
     */
    medium: MediaSize;
    /**
     * 
     * @type {MediaSize}
     * @memberof MediaSizes
     */
    large: MediaSize;
    /**
     * 
     * @type {MediaSize}
     * @memberof MediaSizes
     */
    thumb: MediaSize;
}

export function MediaSizesFromJSON(json: any): MediaSizes {
    return MediaSizesFromJSONTyped(json, false);
}

export function MediaSizesFromJSONTyped(json: any, ignoreDiscriminator: boolean): MediaSizes {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'small': MediaSizeFromJSON(json['small']),
        'medium': MediaSizeFromJSON(json['medium']),
        'large': MediaSizeFromJSON(json['large']),
        'thumb': MediaSizeFromJSON(json['thumb']),
    };
}

export function MediaSizesToJSON(value?: MediaSizes | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'small': MediaSizeToJSON(value.small),
        'medium': MediaSizeToJSON(value.medium),
        'large': MediaSizeToJSON(value.large),
        'thumb': MediaSizeToJSON(value.thumb),
    };
}


