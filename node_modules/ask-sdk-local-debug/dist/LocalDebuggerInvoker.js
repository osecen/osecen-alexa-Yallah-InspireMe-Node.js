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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const ClientConfigBuilder_1 = require("./builder/ClientConfigBuilder");
const SkillInvokerConfigBuilder_1 = require("./builder/SkillInvokerConfigBuilder");
const WebSocketClientConfigBuilder_1 = require("./builder/WebSocketClientConfigBuilder");
const LocalDebugClient_1 = require("./client/LocalDebugClient");
const ArgsParserUtils_1 = require("./util/ArgsParserUtils");
const { argv } = ArgsParserUtils_1.argsParser();
const clientConfig = new ClientConfigBuilder_1.ClientConfigBuilder()
    .withAccessToken(argv.accessToken)
    .withHandlerName(argv.handlerName)
    .withSkillEntryFile(argv.skillEntryFile)
    .withSkillId(argv.skillId)
    .withRegion(argv.region)
    .build();
const skillInvokerConfig = new SkillInvokerConfigBuilder_1.SkillInvokerConfigBuilder()
    .withHandler(ArgsParserUtils_1.getHandlerFunction(clientConfig.skillEntryFile, clientConfig.handlerName))
    .build();
const webSocketClientConfig = new WebSocketClientConfigBuilder_1.WebSocketClientConfigBuilder()
    .withSkillId(clientConfig.skillId)
    .withAccessToken(clientConfig.accessToken)
    .withRegion(clientConfig.region)
    .build();
const webSocketClient = new ws_1.default(webSocketClientConfig.webSocketServerUri, {
    headers: webSocketClientConfig.headers,
});
const client = new LocalDebugClient_1.LocalDebugClient(webSocketClient, skillInvokerConfig);
//# sourceMappingURL=LocalDebuggerInvoker.js.map