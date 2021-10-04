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
    SearchMetadata,
    SearchMetadataFromJSON,
    SearchMetadataFromJSONTyped,
    SearchMetadataToJSON,
    Tweet,
    TweetFromJSON,
    TweetFromJSONTyped,
    TweetToJSON,
} from './';

/**
 * 
 * @export
 * @interface ResponseSearchTweets
 */
export interface ResponseSearchTweets {
    /**
     * ツイート群
     * @type {Array<Tweet>}
     * @memberof ResponseSearchTweets
     */
    statuses: Array<Tweet>;
    /**
     * 
     * @type {SearchMetadata}
     * @memberof ResponseSearchTweets
     */
    search_metadata: SearchMetadata;
}

export function ResponseSearchTweetsFromJSON(json: any): ResponseSearchTweets {
    return ResponseSearchTweetsFromJSONTyped(json, false);
}

export function ResponseSearchTweetsFromJSONTyped(json: any, ignoreDiscriminator: boolean): ResponseSearchTweets {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'statuses': ((json['statuses'] as Array<any>).map(TweetFromJSON)),
        'search_metadata': SearchMetadataFromJSON(json['search_metadata']),
    };
}

export function ResponseSearchTweetsToJSON(value?: ResponseSearchTweets | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'statuses': ((value.statuses as Array<any>).map(TweetToJSON)),
        'search_metadata': SearchMetadataToJSON(value.search_metadata),
    };
}


