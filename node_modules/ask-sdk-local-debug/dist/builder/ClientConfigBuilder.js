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
exports.ClientConfigBuilder = void 0;
const ClientConfig_1 = require("../config/ClientConfig");
class ClientConfigBuilder {
    withSkillEntryFile(skillEntryFile) {
        this._skillEntryFile = skillEntryFile;
        return this;
    }
    withHandlerName(handlerName) {
        this._handlerName = handlerName;
        return this;
    }
    withAccessToken(accessToken) {
        this._accessToken = accessToken;
        return this;
    }
    withSkillId(skillId) {
        this._skillId = skillId;
        return this;
    }
    withRegion(region) {
        this._region = region;
        return this;
    }
    get skillEntryFile() {
        return this._skillEntryFile;
    }
    get handlerName() {
        return this._handlerName;
    }
    get accessToken() {
        return this._accessToken;
    }
    get skillId() {
        return this._skillId;
    }
    get region() {
        return this._region;
    }
    build() {
        return new ClientConfig_1.ClientConfig(this);
    }
}
exports.ClientConfigBuilder = ClientConfigBuilder;
//# sourceMappingURL=ClientConfigBuilder.js.map