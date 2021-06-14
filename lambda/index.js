// This skill was based of https://github.com/alexa/alexa-skills-kit-sdk-for-java/tree/2.0.x/samples/helloworld.
// Copyright Onder Secen - onder.secen@gmail.com


const Alexa = require('ask-sdk-core');
const persistenceAdapter = require('ask-sdk-s3-persistence-adapter');
const verses = require('./verses');


const TITLE = `Yallah Inspire Me`;
const BY = `By Onder Secen\n\n Verses from 'Yahiya Emerick'\n 'The Meaning of the Holy Qur'an for School Children'`;
const WELCOME_SHORT = `Welcome to ${TITLE}. Say "Yallah help" for help.`;
const WELCOME = `Welcome to ${TITLE}.
                You can listen to selected verses from Quran using Yahya Emerick's translation and arabic recitation'.`;

const GENERAL_HELP = `Say 'Yallah' followed by 'details' for details, 'listen' for arabic, 'repeat to repeat, 'save' to save as favorite or 'inspire me' for a new one.`;
const GENERAL_HELP_SHORT = `Say Yallah 'details','listen', 'repeat', 'save', 'inspire me' or 'help' `;
const BUCKET_PATH = 'https://yallahskillbucket.s3.amazonaws.com/';
const AUDIO_FOLDER = 'audio/';
const IMAGE_FOLDER = 'image/';
const AUDI0_FILE_EXT = '.mp3';
const IMAGE_FILE_EXT = '.png';
const IMAGE_FILE_EXT_SMALL = '_small.png';
const COVER_SMALL = BUCKET_PATH+IMAGE_FOLDER+'book_title_small.png';
const COVER_LARGE = BUCKET_PATH+IMAGE_FOLDER+'book_title_large.png';

function getVerseTranslation(verseIndex){
    var verseObject = verses[verseIndex];
    var verseTranslation = verseObject[Object.keys(verseObject)[0]];
    return verseTranslation;
}
// Return the chapter and verse number as string with leading 0's
function getVerseDetails(verseIndex){
    let index = verseIndex;
    // check boundaries
    if ( index < 0 || index > verses.length-1)
        index = Math.floor(Math.random()*(verses.length));

    const verseObject = verses[verseIndex];
    const chID = verseObject[Object.keys(verseObject)[1]];
    const verseID = verseObject[Object.keys(verseObject)[2]];

    return [chID,verseID];
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        
        let speakOutput= WELCOME_SHORT;
        const promptOutput= GENERAL_HELP_SHORT;

        // set session attributes
        const attributesManager = handlerInput.attributesManager;
        const indexes = {
                "favoriteIndex": -1,
                "verseIndex": -1   
            };
            attributesManager.setSessionAttributes(indexes);


        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withStandardCard(TITLE,BY, COVER_SMALL, COVER_LARGE)
            .reprompt(promptOutput)
            .getResponse();
    }
};

const FavoriteVerseHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'FavoriteVerseIntent';
    },
    handle(handlerInput) {
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const favoriteIndex= sessionAttributes.favoriteIndex;
        const currentVerseIndex = sessionAttributes.verseIndex;

        let verseIndex;
        if (favoriteIndex> -1 && favoriteIndex < verses.length){
            // we have a favorite verse in memory, use that one
            verseIndex = favoriteIndex;
        } else {
            // we need to read the favorite verse from the persistent memory
            sessionAttributes = handlerInput.attributesManager.getPersistentAttributes() || {};
            verseIndex = sessionAttributes.hasOwnProperty('favoriteIndex') ? sessionAttributes.verseIndex : -1;
            // to be safe, if we could not load favorite from memory, repeat the previous verse if exists
            // or play a new verse
            if ( verseIndex == -1){
                    verseIndex = currentVerseIndex;
            }
            if ( verseIndex == -1){
                verseIndex = Math.floor(Math.random()*(verses.length));
                // save for this session
                sessionAttributes.verseIndex = verseIndex;
            }
        }
        // update the current verse index
        handlerInput.attributesManager.getSessionAttributes().verseIndex = verseIndex;
        const translation = getVerseTranslation(verseIndex); 
        const speakOutput =  translation;
        const promptOutput= GENERAL_HELP_SHORT;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withSimpleCard(TITLE, translation)
            .reprompt(promptOutput)
            .getResponse();
    }
};

const NewVerseIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NewVerseIntent';
    },
    handle(handlerInput) {
        const verseIndex = Math.floor(Math.random()*(verses.length));
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.verseIndex = verseIndex;
       // handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        const translation = getVerseTranslation(verseIndex); 
        const speakOutput =  translation;
        const promptOutput= GENERAL_HELP_SHORT;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withSimpleCard(TITLE, translation)
            .reprompt(promptOutput)
            .getResponse();
    }
};

const SaveVerseIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SaveVerseIntent';
    },
     async handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const verseIndex = sessionAttributes.verseIndex;
        sessionAttributes.favoriteIndex = verseIndex;

        const attributesManager = handlerInput.attributesManager;
        const savedAttributes = {
            "favoriteIndex": verseIndex  
        };
        // save to persistent memory
        attributesManager.setPersistentAttributes(savedAttributes);
        await attributesManager.savePersistentAttributes();    

        const speakOutput = `Verse saved`;
        const promptOutput= GENERAL_HELP_SHORT;
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(promptOutput)
            .getResponse();
    }

};

const ArabicVerseIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ArabicVerseIntent';
    },
    handle(handlerInput) {

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const verseIndex = sessionAttributes.verseIndex;
        const [chID, verseID] = getVerseDetails(verseIndex);
        const audioFileURL = BUCKET_PATH+AUDIO_FOLDER+chID+verseID+AUDI0_FILE_EXT;
        const imageFileURL = BUCKET_PATH+IMAGE_FOLDER+parseInt(chID)+'_'+parseInt(verseID)+IMAGE_FILE_EXT;
        const imageFileSmallURL = BUCKET_PATH+IMAGE_FOLDER+parseInt(chID)+'_'+parseInt(verseID)+IMAGE_FILE_EXT_SMALL;

        const speakOutput = `<audio src="${audioFileURL}"/>`;     
        const promptOutput= GENERAL_HELP_SHORT;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withStandardCard('','', imageFileSmallURL, imageFileURL)            
            .reprompt(promptOutput)
            .getResponse();
    }
};

const RepeatVerseIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RepeatVerseIntent';
    },
    handle(handlerInput) {

        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const verseIndex = sessionAttributes.verseIndex;
        const speakOutput = getVerseTranslation(verseIndex);     
       
        const promptOutput= GENERAL_HELP_SHORT;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(promptOutput)
            .getResponse();
    }
};

const VerseDetailsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'VerseDetailsIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const verseIndex = sessionAttributes.verseIndex;
        const [chID, verseID] = getVerseDetails(verseIndex);
        const speakOutput = `Chapter number : ${parseInt(chID)}\nVerse number : ${parseInt(verseID)} `;
      
        const promptOutput= GENERAL_HELP_SHORT;
                
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .withSimpleCard(TITLE, speakOutput)
            .reprompt(promptOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = WELCOME + GENERAL_HELP;
        const promptOutput= GENERAL_HELP_SHORT;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(promptOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'See you in another inspiration!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .withPersistenceAdapter(
        new persistenceAdapter.S3PersistenceAdapter({bucketName:process.env.S3_PERSISTENCE_BUCKET})
    )
    .addRequestHandlers(
        LaunchRequestHandler,
        NewVerseIntentHandler,
        RepeatVerseIntentHandler,
        ArabicVerseIntentHandler,
        VerseDetailsIntentHandler,
        SaveVerseIntentHandler,
        FavoriteVerseHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler,
    )
    .addErrorHandlers(
        ErrorHandler,
    )

    .withApiClient(new Alexa.DefaultApiClient())
    .lambda();
