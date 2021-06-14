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
exports.getHandlerFunction = exports.argsParser = void 0;
const yargs_1 = require("yargs");
const fs_1 = require("fs");
const ask_sdk_core_1 = require("ask-sdk-core");
const Constants_1 = require("../constants/Constants");
function argsParser() {
    return yargs_1.option({
        accessToken: {
            type: 'string',
            description: 'Access Token of the profile being used to debug skill.',
            demandOption: true,
            requiresArg: true,
        },
        skillId: {
            type: 'string',
            description: 'Skill id of the skill being debugged.',
            demandOption: true,
            requiresArg: true,
        },
        handlerName: {
            type: 'string',
            description: 'Name of the handler function that will be invoked to run the skill code.',
            demandOption: true,
            requiresArg: true,
        },
        skillEntryFile: {
            type: 'string',
            description: 'Path of the file in the skill code package where the handler function is located.',
            demandOption: true,
            requiresArg: true,
        },
        region: {
            type: 'string',
            description: 'Region of the developer account. TODO:: dev documentation link.',
        },
    })
        .check((argv) => {
        if (argv.accessToken == null) {
            console.error('Access Token cannot be null or empty.');
            return false;
        }
        return true;
    })
        .check((argv) => {
        if (argv.skillId == null) {
            console.error('Skill Id cannot be null or empty.');
            return false;
        }
        return true;
    })
        .check((argv) => {
        if (argv.handlerName == null) {
            console.error('Handler name cannot be null or empty.');
            return false;
        }
        return true;
    })
        .check((argv) => {
        if (argv.skillEntryFile == null) {
            console.error('Skill entry file cannot be null or empty.');
            return false;
        }
        if (!fs_1.existsSync(argv.skillEntryFile)) {
            console.error('Skill entry file does not  exist.');
            return false;
        }
        return true;
    })
        .check((argv) => {
        if (argv.region != null && !Constants_1.RegionEndpointMapping.has(argv.region)) {
            const errorMessage = `Invalid region - ${argv.region}. Please ensure that the region value is one of - ${Constants_1.RegionEndpointMapping.keySeq().toArray()}`;
            console.error(errorMessage);
            return false;
        }
        return true;
    })
        .default('region', Constants_1.DefaultRegion, 'The region will default to NA(North America).');
}
exports.argsParser = argsParser;
function getHandlerFunction(skillEntryFile, handlerName) {
    const handlerFunction = require(skillEntryFile)[handlerName];
    if (typeof handlerFunction !== 'function') {
        const errorMessage = `Handler function does not exist. Make sure that the skill entry file path:${skillEntryFile} and the handler name:${handlerName} are correct.`;
        throw ask_sdk_core_1.createAskSdkError('LocalDebug.ArgsParse', errorMessage);
    }
    return handlerFunction;
}
exports.getHandlerFunction = getHandlerFunction;
//# sourceMappingURL=ArgsParserUtils.js.map