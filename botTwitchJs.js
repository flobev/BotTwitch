const reactions = require('./reaction.js')

const tmi = require('tmi.js');
const prefix = "!";

const tmiConfig = {
    options: {
        debug: true
    },
    connection: {
        reconnect: true
    },
    identity: {
        username: "flo_bev",
        password: "a2a5s0dd1cplii4ykwnlw8pg3sutvk"
    },
    channels: [
        "drustygw"
    ]
};

let client = new tmi.client(tmiConfig)

client.connect();

client.on('connected', (adress,port) =>{
    console.log(client.getUsername() + "s'est connecté sur : " + adress + ", port : " + port);
    client.say("drustygw", "Hello Twitch ! I'm a real human KappaPride");
});

/**
 * Fonctions
 * @param {*} message 
 */

function commandParser(message){
    let prefixEscaped = prefix.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    let regex = new RegExp("^" + prefixEscaped + "([a-zA-Z]+)\s?(.*)");
    return regex.exec(message);
}



client.on('chat', (channel, user, message, isSelf) => {
    if (isSelf) return;

    function isSubscriber(user){
        return user.subscriber;
    }
    
    function isModerator(user){
        return user.mod;
    }
    
    function isBroadcaster(user){
        return user.badges.broadcaster == '1';
    }

    let fullCommand = commandParser(message);
    
    if(fullCommand){
        let command = fullCommand[1];
        let param = fullCommand[2];
        
        switch(command){
            case "bonjour":
                if(isModerator(user)){
                    client.say(channel, "Bonjour " + user['display-name'] + ", mon rôle de Bot est de t'assister sur cette chaine !");
                } else if(isBroadcaster(user)){
                    client.say(channel, "Bonjour " + user['display-name'] + ", je suis content que tu m'ai installé sur ta chaine !");
                } else if(isSubscriber(user)){
                    client.say(channel, "Bonjour " + user['display-name'] + ", merci d'avoir souscris à cette chaine !");
                } 
                
            default :
                    client.say(channel, "Bonjour à toi " + user['display-name'] + ", sois le bienvenu !");
            break;
        }
    }
    else{
        let words = message.split(" ");
        for (let word of words) {
            let reaction = reactions[word];
            if (reaction){
                client.say(channel, reaction);
            }
        }
    }

    /* Function users roles */

    
});



