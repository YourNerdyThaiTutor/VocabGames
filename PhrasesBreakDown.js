var consonants =["ก","จ","ด","ต","บ","ป","อ"]; //middle consonants

var div = document.getElementById("answers");
var part_choices =[];
var choices = [];
var correct ="";
var corr ="";
var correct_def ="";
var correct_list = [];
var words = [];
var score = 0;
var alreadyWrong = false;
var streak = 0;
var answer_map = null;
var limit_choices = null;
var correctIndex = 0;
var sentenseStructure;
var structures;
var orders=[];
var categories=[];
var definitions;
var part_folder = "";
var part = 0;
var outOf = 0;
var yourPhrase = "";
function generateChoiceButton(answer){
    var x = document.createElement("BUTTON");
    var t = document.createTextNode(answer);
    x.appendChild(t);
    x.id = answer;
    x.onclick = function(){checkAnswer(answer);};
    div.appendChild(x);
}

function generateAnswerChoices(){
    var p = part+1;
    document.getElementById("part").innerHTML="part: "+p+"/"+outOf;
    var partIndex = orders.findIndex(checkCurrentPart);
    var group = categories[partIndex];
    corr = correct_list[partIndex];
    
    var d = definitions[group].definitions;
    correct_def = d[corr];
    
    part_folder = definitions[group].folder;
    while (div.firstChild) {
        div.firstChild.remove();//clear answer choices from previous round
    }
    choices = [];
    part_choices =  Object.values(d);
    var l = Object.keys(d);
    correctIndex = l.findIndex(checkCorrectIndex);
    if(limit_choices===null){
        for(let i=0; i< part_choices.length; i++){
        var word = part_choices[i];
        choices.push(word);
        generateChoiceButton(word);
        }
    }
    else{
        if(part_choices.length<limit_choices){
            
            for(let i=0; i< part_choices.length; i++){
                
                var w = part_choices[i];
                choices.push(w);
                generateChoiceButton(w);
            }
            
        }
        else{
            //document.body.innerHTML+="generating buttons";
            RandomizeChoices();
            for(let i=0; i< choices.length; i++){
                var wo = choices[i];
                generateChoiceButton(wo);
            }
        
        }
    
    }
    
}
function checkCorrectIndex(s) {
  return s == corr;
}
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
function RandomizeChoices(){
    var r = Math.floor(Math.random() * part_choices.length/limit_choices + 1);
    for(let i = 0; i<limit_choices;i++){
        choices.push(part_choices[(correctIndex+(i*r))%part_choices.length]);
    }
    shuffleArray(choices);
    
    
}

function checkAnswer(txt){
    
    
    if(txt === correct_def){
        //var t = document.createTextNode("correct");
        //document.body.appendChild(t);
        document.getElementById(txt).style.background='#00ff00';
        if(!alreadyWrong){
            score ++;
            streak ++;
            document.getElementById("score").textContent = "Score: "+score;
            document.getElementById("streak").textContent = "Streak: "+streak;
        }
        else{
            streak = 0;
            document.getElementById("streak").textContent = "Streak: "+streak;
        }
        alreadyWrong = false;
        part++;
        yourPhrase += correct_def+" ";
        document.getElementById("yourPhrase").textContent = yourPhrase;
        
        if(part===outOf){
            part = 0;
            yourPhrase = "";
            setTimeout(() => startGame(),700);
            
        }
        else{
            
            setTimeout(() => generateAnswerChoices(),700);
        }
        
        current_tone = 0;
        document.getElementById("helper").textContent = "click here to hear each word separately";
    }
    else{
        //var ti = document.createTextNode("wrong");
        //document.body.appendChild(ti);
        document.getElementById(txt).style.background='#ff3333';
        alreadyWrong = true;
    }
}
function createQuestion(){
    var _correctIndex = Math.floor(Math.random() * consonants.length);
    correct = consonants[_correctIndex];
    correct_list = correct.split("#");
    var s = correct.replaceAll("#", "");
    src = folder+s+".mp3";
    //var t = document.createTextNode(correct_list);
    //document.body.appendChild(t);
    var audio = document.getElementById('audio');

    var source = document.getElementById('audioSource');
    source.src = src;
    audio.load();
    audio.play();
    
}
function processStructure(){
    sentenseStructure = structures[0];
    orders = sentenseStructure.order;
    categories = sentenseStructure.categories;
    var count = 0 ;
    for(let i = 0; i < orders.length; i++){
        if(orders[i]!=null){
            count++;
        }
    }
    outOf = count;
    //document.body.innerHTML+= orders;
    
    
}
function startGame(){
    //
    createQuestion();
    generateAnswerChoices();
    document.getElementById("yourPhrase").textContent = yourPhrase;
    //document.body.innerHTML+= "1";
    
}

var current_tone = 0;
function playAllTones(){
    
    document.getElementById("helper").textContent = "play next";
    var button = correct_list[current_tone];
    //document.getElementById(button).style.background='#00a5f6';
    var group = categories[current_tone];
    var _folder = definitions[group].folder;
    src = _folder+button+".mp3";
    var audio = document.getElementById('helper_audio');
    var source = document.getElementById('helper_audioSource');
    source.src = src;
    audio.load();
    audio.play();
    current_tone ++;
    if(current_tone===correct_list.length){
        current_tone = 0;
        document.getElementById("helper").textContent = "click here to hear each word separately";
    }
    
}


function checkCurrentPart(structure) {
  return structure == part;
}

function setupGame(_folder, _list_of_choices, _structures, _def, _limit_choices = null){
    folder = _folder;
    consonants = _list_of_choices;  
    structures = _structures;
    processStructure();
    definitions = _def;
    limit_choices = _limit_choices;
    startGame();
}

//document.getElementById("helper").onclick = function(){playAllTones();};