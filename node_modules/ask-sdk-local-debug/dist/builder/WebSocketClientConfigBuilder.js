"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketClientConfigBuilder = void 0;
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
const WebSocketClientConfig_1 = require("../config/WebSocketClientConfig");
const Constants_1 = require("../constants/Constants");
class WebSocketClientConfigBuilder {
    withSkillId(skillId) {
        this._skillId = skillId;
        return this;
    }
    withRegion(region) {
        this._region = region;
        return this;
    }
    withAccessToken(accessToken) {
        this._headers = { authorization: accessToken };
        return this;
    }
    get webSocketServerUri() {
        console.log(`Region chosen: ${this._region}`);
        return `wss://${Constants_1.RegionEndpointMapping.get(this._region)}/v1/skills/${this._skillId}/stages/development/connectCustomDebugEndpoint`;
    }
    get headers() {
        return this._headers;
    }
    build() {
        return new WebSocketClientConfig_1.WebSocketClientConfig(this);
    }
}
exports.WebSocketClientConfigBuilder = WebSocketClientConfigBuilder;
//# sourceMappingURL=WebSocketClientConfigBuilder.js.map