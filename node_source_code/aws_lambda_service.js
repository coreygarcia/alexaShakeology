'use strict';

// var JSONPath = require('JSONPath');

/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */


// --------------- Recipe Data --------------------------------------------------


var recipes = 
[
    {
      "id": "1",
      "title": "Mocha Chiller",
      "flavor": "chocolate",
      "addons": [
        {
          "ingredient": "cooled coffee",
          "amount": "1 cup"
        },
        {
          "ingredient": "almond extract (optional)",
          "amount": "1/8 teaspoon"
        }
      ]
    },
    {
      "id": "2",
      "title": "Chocolate Bananas Foster",
      "flavor": "chocolate",
      "addons": [
        {
          "ingredient": "milk",
          "amount": "1 cup"
        },
        {
          "ingredient": "banana",
          "amount": "1 medium"
        },
        {
          "ingredient": "cinnamon",
          "amount": "1/2 teaspoon"
        },
        {
          "ingredient": "rum extract",
          "amount": "1/8 teaspoon"
        }
      ]
    },
    {
      "id": "3",
      "title": "Chocolate Cherry-Licious",
      "flavor": "chocolate",
      "addons": [
        {
          "ingredient": "milk or almond milk",
          "amount": "1 cup"
        },
        {
          "ingredient": "cherries",
          "amount": "1/2 cup"
        }
      ]
    },
    {
      "id": "4",
      "title": "Chocolate Banana Nutter",
      "flavor": "chocolate",
      "addons": [
        {
          "ingredient": "water",
          "amount": "1 cup"
        },
        {
          "ingredient": "banana",
          "amount": "1 medium"
        },
        {
          "ingredient": "peanut butter",
          "amount": "1 tablespoon"
        }
      ]
    },
    {
      "id": "5",
      "title": "Strawberry Avocado Dream",
      "flavor": "strawberry",
      "addons": [
        {
          "ingredient": "milk or almond milk",
          "amount": "1 cup"
        },
        {
          "ingredient": "mashed avocado",
          "amount": "1/4 cup"
        }
      ]
    },
    {
      "id": "6",
      "title": "Orange Julius",
      "flavor": "vanilla",
      "addons": [
        {
          "ingredient": "orange juice",
          "amount": "1/2 cup"
        },
        {
          "ingredient": "milk",
          "amount": "1/2 cup"
        },
        {
          "ingredient": "grated orange peel",
          "amount": "1/2 teaspoon"
        }
      ]
    },
    {
      "id": "7",
      "title": "Maple Coffee Shakeology",
      "flavor": "café latte",
      "addons": [
        {
          "ingredient": "almond milk",
          "amount": "1 cup"
        },
        {
          "ingredient": "maple syrup",
          "amount": "2 teaspoons"
        }
      ]
    },
    {
      "id": "8",
      "title": "Sweet and Spicy",
      "flavor": "chocolate vegan",
      "addons": [
        {
          "ingredient": "milk or rice milk",
          "amount": "1 cup"
        },
        {
          "ingredient": "honey",
          "amount": "2 teaspoons"
        },
        {
          "ingredient": "cayenne pepper",
          "amount": "1/2 teaspoon"
        }
      ]
    },
    {
      "id": "9",
      "title": "Blueberry Wave",
      "flavor": "tropical strawberry vegan",
      "addons": [
        {
          "ingredient": "milk or rice milk",
          "amount": "1 cup"
        },
        {
          "ingredient": "blueberries",
          "amount": "1/2 cup fresh or frozen"
        }
      ]
    },
    {
      "id": "10",
      "title": "Mojito Lemonade",
      "flavor": "greenberry",
      "addons": [
        {
          "ingredient": "lemonade",
          "amount": "one cup"
        },
        {
          "ingredient": "fresh mint or basil",
          "amount": "2 tablespoons chopped"
        }
      ]
    },
    {
      "id": "11",
      "title": "Vanilla Delight",
      "flavor": "vanilla",
      "addons": [
        {
          "ingredient": "banana",
          "amount": "1 medium"
        },
        {
          "ingredient": "milk",
          "amount": "1 cup"
        },
        {
          "ingredient": "almonds",
          "amount": "1/4 cup chopped"
        }
      ]
    }
 ];

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(speechOutput, cardJSON, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: speechOutput,
        },
        card: cardJSON,
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}

//main function to find recipe by
//@param flavorDesired (ie. "chocolate")
//@param ingredientDesired (ie. "banana")
//@param unwantedRecipeIds (arary of uwanted recipeIds)
function findRecipe(flavorDesired, ingredientDesired, unwantedRecipeIds){ 
    var recipeIds = [];
    for(var i = 0; i < recipes.length; i++){
        var recipeId = recipes[i].id;
        if(recipes[i].flavor == flavorDesired){
            if(ingredientDesired !== undefined){
                for(var j = 0; j < recipes[i].addons.length; j++){
                    if(recipes[i].addons[j].ingredient == ingredientDesired){
                        if(!containsRecipeId(unwantedRecipeIds, recipeId)){
                            recipeIds.push(recipes[i].id); 
                        }                          
                    }
                }
            } else {
                if(!containsRecipeId(unwantedRecipeIds, recipeId)){
                    recipeIds.push(recipes[i].id); 
                }  
            }   
        }   
    }
    return randomizeRecipe(recipeIds); 
}

//helper functions to check if the selected recipeId exists in the unwantedRecipeIds array
function containsRecipeId(unwantedRecipeIds, recipeId){
    if(unwantedRecipeIds === undefined || unwantedRecipeIds.length === 0){
        return false;
    }
    for(var i = 0; i < unwantedRecipeIds.length; i++) {
        if(unwantedRecipeIds[i] == recipeId){
            return true;
        }
    }
    return false;    
}

//helper function to randomize the returned recipeId from the recipes that fit the user's selection
function randomizeRecipe(recipeIds){ 
    if(recipeIds === undefined || recipeIds.length === 0){
        return undefined;
    }
    for (var i = recipeIds.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = recipeIds[i];
        recipeIds[i] = recipeIds[j];
        recipeIds[j] = temp;
    }
    return recipes[parseInt(recipeIds)-1];
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    // TODO: change back to full, better welcome message
    const speechOutput = 'Welcome';
    //const speechOutput = 'Welcome to the Shakeology Recipe Finder. ' +
    //    'Please tell me what flavor of Shakeology you want me to use.';
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = 'Please tell me a Shakeology flavor. For example, Chocolate';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(speechOutput, null, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    const speechOutput = 'Enjoy your Shakeology!';
    // Setting this to true ends the session and exits the skill.
    const shouldEndSession = true;

    callback({}, buildSpeechletResponse(speechOutput, null, null, shouldEndSession));
}

function createAttributes(flavor, ingredient, visitedRecipeIds, recipeJSON) {
    return {
        "flavor": flavor,
        "ingredient" : ingredient,
        "visitedRecipeIds" : visitedRecipeIds,
        "currentRecipe" : recipeJSON
    };
}

function getRecipeCardJSON(recipeJSON) {
  const recipeTitle = recipeJSON.title;
    let content = `\tOne scoop ${recipeJSON.flavor} Shakeology\n`;
    for (var i = 0; i < recipeJSON.addons.length; i++) {
      var addon = recipeJSON.addons[i];
      content += `\t${addon.amount} ${addon.ingredient}\n`;
    }
    // TODO: check if there are any such further recipes before asking.
    content += "\nFor the best taste experience, use a blender and add ice. The more ice, the thicker it gets.\n";
    content += "\nFind more recipes at http://shakeology.com/shake-recipes";
    
    let cardJSON = 
        {
          "type": "Simple",
          "title": `${recipeTitle}`,
          "content": content
        };    
  return cardJSON;
}

/**
 * Get the summary spoken recipe, omitting amounts and instructions.
 */
function getRecipeSummarySpeech(recipeJSON) {
    var speechOutput = `Here is a recipe called ${recipeJSON.title}. It contains ${recipeJSON.flavor} Shakeology,`;
    for (var i = 0; i < recipeJSON.addons.length; i++) {
      var addon = recipeJSON.addons[i];
      if (i == (recipeJSON.addons.length - 1)) {
          speechOutput += ' and';
      }
      speechOutput += ` ${addon.ingredient},`;
    }
  return speechOutput;
}

/**
 * Get the complete spoken recipe, with amounts and basic instructions
 */
function getCompleteRecipeSpeech(recipeJSON) {
    var speechOutput = `Here is the complete recipe for ${recipeJSON.title}. Add one scoop ${recipeJSON.flavor} Shakeology. `;
    for (var i = 0; i < recipeJSON.addons.length; i++) {
      var addon = recipeJSON.addons[i];
      speechOutput += `${addon.amount} ${addon.ingredient}. `;
    }
    speechOutput += "Blend and enjoy! I am also sending the recipe to your Alexa app. Goodbye!";
  return speechOutput;
}

function getSpeechNextStep(flavor, ingredient, visitedRecipeIds){
    let speechNextStep = ". Do you like it? Say, Use This Recipe, or, ";

    if(findRecipe(flavor, ingredient, visitedRecipeIds) === undefined){
        speechNextStep += "Start Over";
    } else {
        speechNextStep += "Hear Another";
    }
    return speechNextStep;
}

/**
 * Sets the flavor in the session and prepares the speech to reply to the user.
 */
function handleShakeologyIntent(intent, session, callback) {
    const flavorSlot = intent.slots.Flavor;
    const ingredient = intent.slots.Ingredient ? intent.slots.Ingredient.value : undefined;
    
    let repromptText = ''; // text to send if the user doesn't provide any response
    let sessionAttributes = {};
    let shouldEndSession = false;
    let speechOutput = '';

    if (flavorSlot) {
        const flavor = flavorSlot.value;
        console.log(`flavor=${flavor}`);
        
    let recipeJSON = findRecipe(flavor, ingredient, []);
    
    if (!recipeJSON) { 
       if (ingredient && (ingredient.includes("donut") || ingredient.includes("energy"))) {
           speechOutput = "I'm sorry, I cannot support that behavior. Please find someone who is not " +
           "an engineer to take you grocery shopping. Goodbye.";
           shouldEndSession = true;
       } else {
           speechOutput = "I'm sorry, I don't have any recipe that matches your request. Please give me another request.";
       }
    } else { 
        
            const visitedRecipeIds = [ recipeJSON.id ];
            
            sessionAttributes = createAttributes(flavor, ingredient, visitedRecipeIds, recipeJSON);
            speechOutput = getRecipeSummarySpeech(recipeJSON);
            
            //calls findRecipe() to check if more recipes exist and appends to speechOutput depending on result
            speechOutput += getSpeechNextStep(flavor, ingredient, visitedRecipeIds);
    }    
        repromptText = speechOutput;
        // repromptText = "You can ask me a recipe by telling me a Shakeology flavor.";
    } else {
        speechOutput = "I'm not sure what your flavor choice was. Please try again.";
        repromptText = speechOutput; // Is this correct?
    }

    callback(sessionAttributes,
         buildSpeechletResponse(speechOutput, null, repromptText, shouldEndSession));
}

function handleUseThisRecipe(intent, session, callback) {
    const sessionAttributes = session.attributes;
    const recipeJSON = sessionAttributes.currentRecipe;
    let speechOutput = getCompleteRecipeSpeech(recipeJSON);
    const cardJSON = getRecipeCardJSON(recipeJSON);
    let repromptText = speechOutput;
    const shouldEndSession = true;
    callback(sessionAttributes,
         buildSpeechletResponse(speechOutput, cardJSON, repromptText, shouldEndSession));
}

/**
 * Sends another recipe with 
 */
function handleWantAnotherRecipe(intent, session, callback) {
    const sessionAttributes = session.attributes;
    const flavor = sessionAttributes.flavor;
    const ingredient = sessionAttributes.ingredient;
  const visitedRecipeIds = sessionAttributes.visitedRecipeIds;
  const recipeJSON = findRecipe(flavor, ingredient, visitedRecipeIds);
  sessionAttributes.visitedRecipeIds.push(recipeJSON.id);
  let speechOutput = getRecipeSummarySpeech(recipeJSON);
  
  //calls findRecipe() to check if more recipes exist and appends to speechOutput depending on result
    speechOutput += getSpeechNextStep(flavor, ingredient, visitedRecipeIds);

  const repromptText = speechOutput;
  const shouldEndSession = false;
  callback(sessionAttributes,
         buildSpeechletResponse(speechOutput, null, repromptText, shouldEndSession)); 
}


/*
function getFlavorFromSession(intent, session, callback) {
    let flavor;
    const repromptText = null;
    const sessionAttributes = {};
    let shouldEndSession = false;
    let speechOutput = '';

    if (session.attributes) {
        flavor = session.attributes.flavor;
    }

    if (flavor) {
        speechOutput = `Your flavor is ${flavor}. Goodbye.`;
        shouldEndSession = true;
    } else {
        speechOutput = "I'm not sure what your favorite color is, you can say, my favorite color " +
            ' is red';
    }

    // Setting repromptText to null signifies that we do not want to reprompt the user.
    // If the user does not respond or says something that is not understood, the session
    // will end.
    callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}
*/

// --------------- Events -----------------------

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log(`onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}`);

    const intent = intentRequest.intent;
    const intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if (intentName === 'ShakeologyIntent') {
        handleShakeologyIntent(intent, session, callback);
    } else if (intentName === 'HearAnotherRecipeIntent') {
      handleWantAnotherRecipe(intent, session, callback);
    } else if (intentName === 'UseThisRecipeIntent') {
      handleUseThisRecipe(intent, session, callback);
    } else if (intentName === 'AMAZON.HelpIntent' || intentName === 'AMAZON.StartOverIntent') {
        getWelcomeResponse(callback);
    } else if (intentName === 'AMAZON.StopIntent' || intentName === 'AMAZON.CancelIntent') {
        handleSessionEndRequest(callback);
    } else {
        throw new Error('Invalid intent');
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}


// --------------- Main handler -----------------------

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = (event, context, callback) => {
    try {
        console.log(`event.session.application.applicationId=${event.session.application.applicationId}`);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.amzn1.ask.skill.4960aa34-2b08-4371-974c-66e9003836b1') {
        // amzn1.ask.skill.4960aa34-2b08-4371-974c-66e9003836b1
             callback('Invalid Application ID');
        }
        */


        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};
