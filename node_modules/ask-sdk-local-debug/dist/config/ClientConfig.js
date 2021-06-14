"use strict";
/*
 * Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License').
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the 'license' file accompanying this file. This file is distributed
 * on an 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientConfig = void 0;
class ClientConfig {
    constructor(clientConfigBuilder) {
        this._skillEntryFile = clientConfigBuilder.skillEntryFile;
        this._handlerName = clientConfigBuilder.handlerName;
        this._accessToken = clientConfigBuilder.accessToken;
        this._skillId = clientConfigBuilder.skillId;
        this._region = clientConfigBuilder.region;
    }
    get skillEntryFile() {
        return this._skillEntryFile;
    }
    get skillId() {
        return this._skillId;
    }
    get handlerName() {
        return this._handlerName;
    }
    get accessToken() {
        return this._accessToken;
    }
    get region() {
        return this._region;
    }
}
exports.ClientConfig = ClientConfig;
//# sourceMappingURL=ClientConfig.js.map