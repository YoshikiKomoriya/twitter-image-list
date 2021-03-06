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


import * as runtime from '../runtime';
import {
    ResponseAuthenticationLogout,
    ResponseAuthenticationLogoutFromJSON,
    ResponseAuthenticationLogoutToJSON,
} from '../models';

export interface CallbackRequest {
    oauth_token: string;
    oauth_verifier: string;
}

/**
 * 
 */
export class AuthenticationApi extends runtime.BaseAPI {

    /**
     * Twitterの認証画面へ遷移する
     * Twitter認証
     */
    async authenticationRaw(initOverrides?: RequestInit): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/authentication`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Twitterの認証画面へ遷移する
     * Twitter認証
     */
    async authentication(initOverrides?: RequestInit): Promise<void> {
        await this.authenticationRaw(initOverrides);
    }

    /**
     * Twitterの認証結果を検証する
     * Twitter認証後のコールバック
     */
    async callbackRaw(requestParameters: CallbackRequest, initOverrides?: RequestInit): Promise<runtime.ApiResponse<void>> {
        if (requestParameters.oauth_token === null || requestParameters.oauth_token === undefined) {
            throw new runtime.RequiredError('oauth_token','Required parameter requestParameters.oauth_token was null or undefined when calling callback.');
        }

        if (requestParameters.oauth_verifier === null || requestParameters.oauth_verifier === undefined) {
            throw new runtime.RequiredError('oauth_verifier','Required parameter requestParameters.oauth_verifier was null or undefined when calling callback.');
        }

        const queryParameters: any = {};

        if (requestParameters.oauth_token !== undefined) {
            queryParameters['oauth_token'] = requestParameters.oauth_token;
        }

        if (requestParameters.oauth_verifier !== undefined) {
            queryParameters['oauth_verifier'] = requestParameters.oauth_verifier;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/authentication/callback`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Twitterの認証結果を検証する
     * Twitter認証後のコールバック
     */
    async callback(requestParameters: CallbackRequest, initOverrides?: RequestInit): Promise<void> {
        await this.callbackRaw(requestParameters, initOverrides);
    }

    /**
     * ログアウト処理を実施する
     * ログアウト
     */
    async logoutRaw(initOverrides?: RequestInit): Promise<runtime.ApiResponse<ResponseAuthenticationLogout>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/authentication/logout`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseAuthenticationLogoutFromJSON(jsonValue));
    }

    /**
     * ログアウト処理を実施する
     * ログアウト
     */
    async logout(initOverrides?: RequestInit): Promise<ResponseAuthenticationLogout> {
        const response = await this.logoutRaw(initOverrides);
        return await response.value();
    }

}
