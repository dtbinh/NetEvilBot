/**
 * Created by jbr134 on 16/12/14.
 */


var brain = require("brain");
/**
 * The class person describes one person in the network.
 * Each person has it's own "brain". By interacting with the other people in the network
 * the person learns how others call words.
 * @param {string} myName The name of the person
 * @constructor
 */
var Person = function (myName) {
    this.myName = myName;
    this.training = [];
    this.myBrain = new brain.NeuralNetwork();

    /**
     * Train the person.
     * It's important to notice that the neural network is recreated each time the person
     * is trained. The reason is that the system I use (npm install brain) does it in this way.
     * @param {string} image Name of the image
     * @param {string} partnerName The partners name
     * @param {string} partnerImageName How the partner names the image
     */
    this.addTraining = function(image, partnerName, partnerImageName){
        var o = {};
        o[partnerImageName] = 1;
        var i = {};
        i[image] = 1;
        i[partnerName] = 1;

        var t = {input: i, output: o};
        //console.log(t);

        this.training.push(t);
        this.myBrain = new brain.NeuralNetwork(); //This system uses BULK training. Sorry ;(
        this.myBrain.train(this.training);
    };

    /**
     * The persons guess what it's partner used for an image.
     * Returns an array with probabilities.
     * @param {string} image Name of the image
     * @param {string} partnerName The partners name
     * @return {array} A list of word probabilities
     */
    this.guess = function(image, partnerName){
        var i = {};
        i[image] = 1;
        i[partnerName] = 1;
        return this.myBrain.run(i);
    };


    /**
     * The persons guess what it's partner used for an image.
     * Returns only the name of the world with highest guess
     * @param {string} image Name of the image
     * @param {string} partnerName The partners name
     * @return {string} the most probable word
     */
    this.guessFirst = function(image, partnerName){
        var probs = this.guess(image, partnerName);

        //find highest probable word
        var word = null;
        var probablity = null;
        for(var pr in probs){

            if(word == null){
                word = pr;
                probablity = probs[pr];
            }else{
                if(probs[pr] > probablity){
                    word = pr;
                    probablity = probs[pr];
                }
            }
        }

        return(word);
    }

    /**
     * This will create the first initialisation of the network.
     * All use data will be removed. So only neighbors are included
     * This needs to be executed after the person was cloned.
     */
    this.init = function(){
        this.myBrain = new brain.NeuralNetwork(); //This system uses BULK training. Sorry ;(

        //remove training against itself
        var newTrain = [];
        for(tr in this.training){
            if(Object.keys(this.training[tr].input)[1] != this.myName){
                var randConf = (Math.floor(Math.random() * 6) + 1);
                for(i = 0; i < randConf; i++) {
                    newTrain.push(this.training[tr]);
                }
            }
        }

        this.training = newTrain;

        this.myBrain.train(this.training);
    }
};

module.exports = Person;