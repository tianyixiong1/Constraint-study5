// Add custom CSS for sliders updated at Sep29
const style = document.createElement("style");
style.innerHTML = `
/* WebKit browsers (Chrome, Safari, Edge) */
input[type="range"]::-webkit-slider-runnable-track {
  background: #ddd;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  background: #000;
  cursor: pointer;
}
/* Firefox */
input[type="range"]::-moz-range-track {
  background: #ddd;
}
input[type="range"]::-moz-range-progress {
  background: #ddd; /* removes the colored bar */
}
input[type="range"]::-moz-range-thumb {
  width: 15px;
  height: 15px;
  background: #000;
  cursor: pointer;
}
`;
// Define global variables
// This is updated at Sep 20
let timeline = [];

// jsPsych initialization
const jsPsych = initJsPsych({
  use_webaudio: false,
  display_element: 'jspsych-target',
  auto_preload: true,
  show_progress_bar: true,
  default_iti: 0,
  on_finish: function (data) {
    jsPsych.data.displayData('csv');
  }
});

const participantId = jsPsych.data.getURLVariable('PROLIFIC_PID');
const studyId = jsPsych.data.getURLVariable('STUDY_ID');
const sessionId = jsPsych.data.getURLVariable('SESSION_ID');

const filename = `${participantId}_${studyId}_${sessionId}.csv`;

let genderCondition = jsPsych.randomization.sampleWithoutReplacement(['male', 'female'], 1)[0];

jsPsych.data.addProperties({
  participantId: participantId,
  studyId: studyId,
  sessionId: sessionId,
  genderCondition: genderCondition
});

// Enter fullscreen
const enterFullscreen = {
  type: jsPsychFullscreen,
  name: 'enter_fullscreen',
  fullscreen_mode: true,
  delay_after: 0
};
timeline.push(enterFullscreen);

// Consent form Updated Sep 19
const consentForm = {
  type: jsPsychSurveyMultiChoice,
  preamble: '<h2 style="text-align:center"><strong>Consent Form</strong></h2>',
  questions: [
    {
      name: 'consent',
      prompt: `
        <div style="text-align:left; max-width:800px; margin:auto;">
          <p>Please consider this information carefully before deciding whether to participate in this research.</p>

          <p>The purpose of this research is to examine which factors influence social judgment and decision-making.
          You will be asked to make judgments about individuals and actions in social scenarios. We are simply interested
          in your judgment. The study will take less than 15 minutes to complete, and you will receive 
          <strong>$2.30 through Prolific</strong>. There are no anticipated risks associated with participating in this study.
          The effects of participating should be comparable to those you would ordinarily experience from viewing a computer 
          monitor and using a mouse or keyboard for a similar amount of time. At the end of the study, we will provide an 
          explanation of the questions that motivate this line of research and will describe the potential implications.</p>

          <p>Your participation in this study is completely voluntary and you may refuse to participate or you may 
          choose to withdraw at any time without penalty or loss of benefits to which you are otherwise entitled.
          Your participation in this study will remain confidential. No personally identifiable information will be
          associated with your data. Also, all analyses of the data will be averaged across all the participants, so 
          your individual responses will never be specifically analyzed.</p>

          <p>If you have questions or concerns about your participation or payment or want to request a summary of 
          research findings, please contact the research manager: Jordan Wylie, 
          <a href="mailto:jordan.wylie@cornell.edu">jordan.wylie@cornell.edu</a>.</p>

          <p>For questions, concerns, suggestions, or complaints that have not been or cannot be addressed by the researcher,
          or to report research-related harm, please contact the Committee on the Use of Human Subjects in Research at Cornell University.</p>

          <p>Please print or save a copy of this form for your records.</p>

          <p><strong>Agreement:</strong><br>
          The nature and purpose of this research have been sufficiently explained and I agree to participate in this study. 
          I understand that I am free to withdraw at any time without incurring any penalty.</p>

          <p>If you agree to the statements above and agree to participate in this study,
          please select the “Consent given” button below to continue. Otherwise, please exit the study at this time.</p>
        </div>
      `,
      options: ["Consent not given", "Consent given"],
      horizontal: true,
      required: true
    }
  ],
  on_finish: function (data) {
    const resp = jsPsych.data.get().last(1).values()[0].response.consent;
    if (resp === "Consent not given") {
      jsPsych.endExperiment(`
        <p class="jspsych-center">
          You did not consent to participate in this study.<br>
          Please return this study in Prolific.
        </p>
      `);
    }
  }
};
// Instruction updated at Sep 26
const instruction = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div style="max-width:800px; margin:auto; text-align:left;">
      <h2 style="text-align:center">Welcome to our study!</h2>
      <p>In this experiment, we are interested in how you think about the kinds of things someone might do.</p>
      <p>You will read scenarios that describe a situation, an action taken by a person, and an outcome that follows. Afterward, you will be asked to rate how much the agent should be blamed for the downstream consequences.</p>
    </div>
  `,
  choices: ['Continue']
};


timeline.push(consentForm);
timeline.push(instruction);

const politicalResponses = [
  "1 (Extremely liberal)",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7 (Extremely conservative)",
];

// attention check
const attention_scale = [
  "1 = No, I didnt pay close attention. You should not use my data",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7 = Yes, I paid full attention. You should use my data",
];

// Scenario Stimuli
const scenarioStimuli = [
  { 
    id: 1,
    female_agent: "Heike’s husband has recently fallen ill and needs an expensive medication that is not covered by his medical insurance. They don’t have the money needed to purchase the expensive prescription, but they know that it’s vital for him to have it if he is going to recover.",
    male_agent: "Heinz’s wife has recently fallen ill and needs an expensive medication that is not covered by her medical insurance. They don’t have the money needed to purchase the expensive prescription, but they know that it’s vital for her to have it if she is going to recover.",
    context_2nd: "Your spouse has recently fallen ill and needs an expensive medication that is not covered by your medical insurance. You don’t have the money needed to purchase the expensive prescription, but you know that it’s vital for them to have it if they are going to recover.",
    female_name: "Heike",
    male_name: "Heinz",
    actions_f: [
      "commit credit card fraud",
      "go on strike for better wages",
      "search for the medication on the black market",
      "start a fundraiser",
      "switch insurance plans",
      "take out a loan" ],
    actions_m: [
      "commit credit card fraud",
      "go on strike for better wages",
      "search for the medication on the black market",
      "start a fundraiser",
      "switch insurance plans",
      "take out a loan"],
    outcome_f: "After doing this, Heike gets into serious financial trouble. Her husband has to go without medication, and he soon gets more ill.",
    outcome_m: "After doing this, Heinz gets into serious financial trouble. His wife has to go without medication, and she soon gets more ill.",
    causal_f: "Heike caused her husband to get more ill",
    causal_m: "Heinz caused his wife to get more ill",
    causalcertain_f: " her husband was going to get more ill.",
    causalcertain_m: "his wife was going to get more ill.",
    counter_m:"his wife wouldn't have gotten more ill.",
    counter_f: "her husband wouldn't have gotten more ill.",
    blame_f:"Heike should be blamed for her husband getting sicker.",
    blame_m:"Heinz should be blamed for his wife getting sicker."
  },
  {
    id: 2,
    female_agent: "Josie is on the way to the airport to catch a flight to a hunting safari in Africa. She leaves with plenty of time to make it there, but her car breaks down on the highway. Now Josie is sitting in her car near a busy intersection, and knows she needs to get to the airport soon if she is going to catch her flight.",
    male_agent: "Josh is on the way to the airport to catch a flight to a hunting safari in Africa. He leaves with plenty of time to make it there, but his car breaks down on the highway. Now Josh is sitting in his car near a busy intersection, and knows he needs to get to the airport soon if he is going to catch his flight.",
    context_2nd: "You are on the way to the airport to catch a flight to a hunting safari in Africa. You leave with plenty of time to make it there, but your car breaks down on the highway. Now you are sitting in your car near a busy intersection, and know you need to get to the airport soon if you are going to catch your flight.",
    female_name: "Josie",
    male_name: "Josh",
    actions_f: [
      "call a taxi",
      "demand that the airline delays the flight",
      "reschedule for a later flight",
      "steal a passing driver's car",
      "take a public bus",
      "try to convince a passing driver to trade cars"],
    actions_m: [
      "call a taxi",
      "demand that the airline delays the flight",
      "reschedule for a later flight",
      "steal a passing driver's car",
      "take a public bus",
      "try to convince a passing driver to trade cars"],
    outcome_f: "Josie does not make her originally scheduled flight, so other people going on the safari have to wait for her.",
    outcome_m: "Josh does not make his originally scheduled flight, so other people going on the safari have to wait for him.",
    causal_f: "Josie caused the safari to be delayed.",
    causal_m: "Josh caused the safari to be delayed.",
    causalcertain_f: "the safari was going to be delayed.",
    causalcertain_m: "the safari was going to be delayed.",
    counter_m:"the safari wouldn't have been delayed.",
    counter_f: "the safari wouldn't have been delayed.",
    blame_f:"Josie should be blamed for the safari being delayed.",
    blame_m:"Josh should be blamed for the safari being delayed."
  },

  {
    id: 3,
    female_agent: "Brianna is the evening manager at a bakery. Near the end of the day, she realizes that $50.75 is missing from the register and that she is responsible for accounting for the money at the end of the day. Brianna knows she has to make sure the register is balanced or she might lose her job.",
    male_agent: "Brian is the evening manager at a bakery. Near the end of the day, he realizes that $50.75 is missing from the register and that he is responsible for accounting for the money at the end of the day. Brian knows he has to make sure the register is balanced or he might lose his job.",
    context_2nd: "You are the evening manager at a bakery. Near the end of the day, you realize that $50.75 is missing from the register and that you are responsible for accounting for the money at the end of the day. You know you have to make sure the register is balanced or you might lose your job.",
    female_name: "Brianna",
    male_name: "Brian",
    actions_f: [
      "explain the situation to her boss",
      "get an advance payday loan",
      "overcharge the next customers",
      "pay the money from her own wallet",
      "sell one of her kidneys",
      "stage a robbery"],
    actions_m: [
      "explain the situation to his boss",
      "get an advance payday loan",
      "overcharge the next customers",
      "pay the money from his own wallet",
      "sell one of his kidneys",
      "stage a robbery"],
    outcome_f: "After the owner of the bakery finds out what happened, she fires the entire staff working that day.",
    outcome_m: "After the owner of the bakery finds out what happened, she fires the entire staff working that day.",
    causal_f: "Brianna caused the bakery staff to be fired.",
    causal_m: "Brian caused the bakery staff to be fired.",
    causalcertain_f: "the staff was going to be fired.",
    causalcertain_m: "the staff was going to be fired.",
    counter_m:"the staff wouldn't have been fired.",
    counter_f: "the staff wouldn't have been fired.",
    blame_f:"Brianna should be blamed for bakery staff being fired.",
    blame_m:"Brian should be blamed for bakery staff being fired."
  },
  {
    id: 4,
    female_agent: "Liz decides to go to the gym on her lunch break to play a game of racquetball with a friend. When she gets to the gym, she realizes that her membership has expired since she last went. Since she left her phone at her desk in the office, she has no way of letting her friend know.",
    male_agent: "Leo decides to go to the gym on his lunch break to play a game of racquetball with a friend. When he gets to the gym, he realizes that his membership has expired since he last went. Since he left his phone at his desk in the office, he has no way of letting his friend know.",
    context_2nd: "You decide to go to the gym on your lunch break to play a game of racquetball with a friend. When you get to the gym, you realize that your membership has expired since you last went. Since you left your phone at your desk in the office, you have no way of letting your friend know.",
    female_name: "Liz",
    male_name: "Leo",
    actions_f: [
      "borrow someone's phone",
      "crawl past the front desk",
      "lie that she left her card inside",
      "pay for a day-pass to the gym",
      "pull the fire alarm",
      "renew her membership"],
    actions_m: [
      "borrow someone's phone",
      "crawl past the front desk",
      "lie that he left his card inside",
      "pay for a day-pass to the gym",
      "pull the fire alarm",
      "renew his membership"],
    outcome_f: "Despite doing this, Liz cannot get into the gym, and she misses the racquetball game with her friends. Without Liz, her friends do not have enough players and must cancel the game.",
    outcome_m: "Despite doing this, Leo cannot get into the gym, and he misses the racquetball game with his friends. Without Leo, his friends do not have enough players and must cancel the game.",
    causal_f: "Liz caused the racquetball game to be cancelled.",
    causal_m: "Leo caused the racquetball game to be cancelled.",
    causalcertain_f: "the racquetball game was going to be cancelled.",
    causalcertain_m: "the racquetball game was going to be cancelled.",
    counter_m:"the racquetball game wouldn't have been cancelled.",
    counter_f: "the racquetball game wouldn't have been cancelled.",
    blame_f:"Liz should be blamed for the racquetball game being cancelled.",
    blame_m:"Leo should be blamed for the racquetball game being cancelled."
  },
  {
    id: 5,
    female_agent: "Mary is about to go to her final class of the day when she remembers that there is a homework assignment that is due. Mary’s mom accidentally took her homework assignment out of her backpack when she was making room for her lunch. Now Mary has nothing to turn in for credit.",
    male_agent: "Mark is about to go to his final class of the day when he remembers that there is a homework assignment that is due. Mark’s mom accidentally took his homework assignment out of his backpack when he was making room for his lunch. Now Mary has nothing to turn in for credit.",
    context_2nd: "You are an elementary school student about to go to your final class of the day when you remember that there is a homework assignment that is due. Your mom accidentally took your homework assignment out of your backpack when she was making room for your lunch. Now you have nothing to turn in for credit.",
    female_name: "Mary",
    male_name: "Mark",
    actions_f: [
      "bring in the assignment the next day",
      "call her mom",
      "copy a friend's assignment",
      "hypnotize the teacher",
      "lie that her house burnt down",
      "quickly try to redo the assignment"],
    actions_m: [
      "bring in the assignment the next day",
      "call his mom",
      "copy a friend's assignment",
      "hypnotize the teacher",
      "lie that his house burnt down",
      "quickly try to redo the assignment"],
    outcome_f: "After Mary does this, her teacher gives her a zero as her grade for the assignment.",
    outcome_m: "After Mark does this, his teacher gives him a zero as his grade for the assignment.",
    causal_f: "Mary caused herself to get a zero.",
    causal_m: "Mark caused himself to get a zero.",
    causalcertain_f: "she was going to get a zero for the assignment.",
    causalcertain_m: "he was going to get a zero for the assignment.",
    counter_m:"he wouldn't have gotten a zero for the assignment.",
    counter_f: "she wouldn't have gotten a zero for the assignment.",
    blame_f:"Mary should be blamed for getting a zero on the assignment.",
    blame_m:"Mark should be blamed for getting a zero on the assignment."
  },

    {
    id: 6,
    female_agent: "Brooke and some friends are hiking through the mountains in the Canadian wilderness. A couple of days into their hike, Brad realizes that they are lost. She knows that a rescue crew could arrive before long, but it is extremely cold and they don’t have much food or water left.",
    male_agent: "Brad and some friends are hiking through the mountains in the Canadian wilderness. A couple of days into their hike, Brad realizes that they are lost. He knows that a rescue crew could arrive before long, but it is extremely cold and they don’t have much food or water left.",
    context_2nd: "You are hiking with some friends through the mountains in the Canadian wilderness. A couple of days into your hike, you realize that you are lost. You know that a rescue crew could arrive before long, but it is extremely cold and you don’t have much food or water left.",
    female_name: "Brooke",
    male_name: "Brad",
    actions_f: [
      "boost morale with a three-legged race",
      "collect wood to start a fire",
      "huddle to conserve energy",
      "search for a water source",
      "steal all of the food and water",
      "throw away all of the food"],
    actions_m: [
      "boost morale with a three-legged race",
      "collect wood to start a fire",
      "huddle to conserve energy",
      "search for a water source",
      "steal all of the food and water",
      "throw away all of the food" ],
    outcome_f: "After Brooke does this, she and her friends spend several days lost in the woods, cold, hungry, and thirsty.",
    outcome_m: "After Brad does this, he and his friends spend several days lost in the woods, cold, hungry, and thirsty.",
    causal_f: "Brooke caused her friends to remain lost.",
    causal_m: "Brad caused his friends to remain lost.",
    causalcertain_f: "she and her friends were going to remain lost.",
    causalcertain_m: "he and his friends were going to remain lost.",
    counter_m:"he and his friends wouldn't have remained lost.",
    counter_f: "she and her friends wouldn't have remained lost.",
    blame_f:"Brooke should be blamed for her friends remaining lost.",
    blame_m:"Brad should be blamed for his friends remaining lost."
  },
    

    {
    id: 7,
    female_agent: "Darya is on her way to a concert with her friends. As they approach the entrance her friend Ted realizes he forgot his ticket at his house. The concert is about to start and Ted would likely miss most of the concert if he returned to his house for his ticket.",
    male_agent: "David is on his way to a concert with her friends. As they approach the entrance his friend Ted realizes he forgot his ticket at his house. The concert is about to start and Ted would likely miss most of the concert if he returned to his house for his ticket.",
    context_2nd: "You are on your way to a concert with your friends. As you approach the entrance your friend Ted realizes he forgot his ticket at his house. The concert is about to start and Ted would likely miss most of the concert if he returns to his house for his ticket.",
    female_name: "Darya",
    male_name: "David",
    actions_f: [
      "give her ticket to Ted",
      "go without Ted",
      "pretend they are conjoined twins",
      "steal someone else's ticket",
      "teleport into the concert",
      "try to buy a ticket off another person"],
    actions_m: [
      "give his ticket to Ted",
      "go without Ted",
      "pretend they are conjoined twins",
      "steal someone else's ticket",
      "teleport into the concert",
      "try to buy a ticket off another person"],
    outcome_f: "After Darya does this, the concert staff at the entrance become suspicious of Darya and her friends and refuse to let them in.",
    outcome_m: "After David does this, the concert staff at the entrance become suspicious of David and his friends and refuse to let them in.",
    causal_f: "Darya caused her friends to miss the concert.",
    causal_m: "David caused his friends to miss the concert.",
    causalcertain_f: "her friends were going to miss the concert.",
    causalcertain_m: "his friends were going to miss the concert.",
    counter_m:"his friends wouldn't have missed the concert.",
    counter_f: "her friends wouldn't have missed the concert.",
    blame_f:"Darya should be blamed for her friends missing the concert.",
    blame_m:"David should be blamed for his friends missing the concert."},
    
    {
    id: 8,
    female_agent: "Eunice is sunbathing at the beach next to a family with young children. When the family is playing in the water, she sees a teenager begin to go through their belongings but she isn’t sure whether or not he’s part of the family.",
    male_agent: "Ethan is sunbathing at the beach next to a family with young children. When the family is playing in the water, he sees a teenager begin to go through their belongings but he isn’t sure whether or not he’s part of the family.",
    context_2nd: "You are sunbathing at the beach next to a family with young children. When the family is playing in the water, you see a teenager begin to go through their belongings but you're not sure whether or not he’s part of the family.",
    female_name: "Eunice",
    male_name: "Ethan",
    actions_f: [
      "ask the parents if they know him",
      "keep an eye on him",
      "make cat noises at him until he leaves",
      "read his mind",
      "tackle him and hold him down",
      "wave to the parents"],
    actions_m: [
      "ask the parents if they know him",
      "keep an eye on him",
      "make cat noises at him until he leaves",
      "read his mind",
      "tackle him and hold him down",
      "wave to the parents"],
    outcome_f: "After Eunice does this, the family begins to feel uncomfortable about Eunice’s behavior and decides to leave the beach for the day.",
    outcome_m: "After Ethan does this, the family begins to feel uncomfortable about Ethan’s behavior and decides to leave the beach for the day.",
    causal_f: "Eunice caused the family to leave the beach.",
    causal_m: "Ethan caused the family to leave the beach.",
    causalcertain_f: "the family was going to leave the beach.",
    causalcertain_m: "the family was going to leave the beach.",
    counter_m:"the family wouldn't have left the beach.",
    counter_f: "the family wouldn't have left the beach.",
    blame_f:"Eunice should be blamed for the family leaving the beach.",
    blame_m:"Ethan should be blamed for the family leaving the beach."},

    {
    id: 9,
    female_agent: "Emma is driving home on a two-lane road and thinks the driver ahead of her is intoxicated. The car has been slowly drifting between the two lanes and is currently driving in the middle of road.",
    male_agent: "Eamon is driving home on a two-lane road and thinks the driver ahead of him is intoxicated. The car has been slowly drifting between the two lanes and is currently driving in the middle of road.",
    context_2nd: "You are driving home on a two-lane road and think the driver ahead of you is intoxicated. The car has been slowly drifting between the two lanes and is currently driving in the middle of road.",
    female_name: "Emma",
    male_name: "Eamon",
    actions_f: [
      "honk an angry message in Morse code",
      "honk at the driver until they pull over",
      "pull over and call 911",
      "ram into the car",
      "tailgate the car",
      "take a detour at the next exit"],
    actions_m: [
      "honk an angry message in Morse code",
      "honk at the driver until they pull over",
      "pull over and call 911",
      "ram into the car",
      "tailgate the car",
      "take a detour at the next exit"],
    outcome_f: "After Emma does this, she drifting car crashes into another car, resulting in a pileup accident.",
    outcome_m: "After Eamon does this, he drifting car crashes into another car, resulting in a pileup accident.",
    causal_f: "Emma caused the accident.",
    causal_m: "Eamon caused the accident.",
    causalcertain_f: "the accident was going to occur.",
    causalcertain_m: "the accident was going to occur.",
    counter_m:"the accident wouldn't have occurred.",
    counter_f: "the accident wouldn't have occurred.",
    blame_f:"Emma should be blamed for the accident.",
    blame_m:"Eamon should be blamed for the accident."},
   
    {
    id: 10,
    female_agent: "Chloe is filling up her car at a gas station on her way home from work when a woman approaches her to ask for a ride to a nearby city. The city is in the same direction as her house but it’s 10 miles further than she planned to go.",
    male_agent: "Cameron is filling up his car at a gas station on his way home from work when a woman approaches him to ask for a ride to a nearby city. The city is in the same direction as his house but it’s 10 miles further than he planned to go.",
    context_2nd: "You are filling up your car at a gas station on your way home from work when a woman approaches you to ask for a ride to a nearby city. The city is in the same direction as your house but it’s 10 miles further than you planned to go.",
    female_name: "Chole",
    male_name: "Cameron",
    actions_f: [
      "call her a cab",
      "refuse to drive her",
      "steal whatever she has on her",
      "take her to his house but no further",
      "turn invisible",
      "yell in gibberish until she leaves"],
    actions_m: [
      "call her a cab",
      "refuse to drive her",
      "steal whatever she has on her",
      "take her to his house but no further",
      "turn invisible",
      "yell in gibberish until she leaves"],
    outcome_f: "After Chloe tries to do this, the woman attempts to walk all the way to her destination. As a result, the woman is late.",
    outcome_m: "After Cameron tries to do this, the woman attempts to walk all the way to her destination. As a result, the woman is late.",
    causal_f: "Chloe caused the woman to be late to her destination.",
    causal_m: "Cameron caused the woman to be late to her destination.",
    causalcertain_f: "the woman was going to be late to her destination.",
    causalcertain_m: "the woman was going to be late to her destination.",
    counter_m:"the woman wouldn't have been late to her destination.",
    counter_f: "the woman wouldn't have been late to her destination.",
    blame_f:"Chole should be blamed for the woman being late to her destination.",
    blame_m:"Cameron should be blamed for the woman being late to her destination."},

    {
    id: 11,
    female_agent: "Erica is leaving the mall on a hot summer day. In the parking lot, she notices a dog in the back of a car without any of its windows open. The dog is panting heavily and looks tired.",
    male_agent: "Eric is leaving the mall on a hot summer day. In the parking lot, he notices a dog in the back of a car without any of its windows open. The dog is panting heavily and looks tired.",
    female_name: "Erica",
    male_name: "Eric",
    context_2nd: "You are leaving the mall on a hot summer day. In the parking lot, you notice a dog in the back of a car without any of its windows open. The dog is panting heavily and looks tired.",
    
    actions_f: [
      "ask to use the mall's loudspeaker",
      "call emergency services",
      "check that the doors are locked	",
      "light a fire under the car",
      "pour water on the car to cool it",
      "slash the tires"],
    actions_m: [
      "ask to use the mall's loudspeaker",
      "call emergency services",
      "check that the doors are locked	",
      "light a fire under the car",
      "pour water on the car to cool it",
      "slash the tires"],
    outcome_f: "The dog dies inside the car before anyone else arrives to help.",
    outcome_m: "The dog dies inside the car before anyone else arrives to help.",
    causal_f: "Erica caused the dog to die.",
    causal_m: "Eric caused the dog to die.",
    causalcertain_f: "the dog was going to die.",
    causalcertain_m: "the dog was going to die.",
    counter_m:"the dog wouldn't have died.",
    counter_f: "the dog wouldn't have died.",
    blame_f:"Erica should be blamed for the dog dying.",
    blame_m:"Eric should be blamed for the dog dying."},

    {
    id: 12,
    female_agent: "Carla is a chef on her way to a food festival in Chicago. She is in line to go through security at the airport when she realizes she accidentally brought a large knife in her bag.",
    male_agent: "Carl is a chef on his way to a food festival in Chicago. He is in line to go through security at the airport when he realizes he accidentally brought a large knife in his bag.",
    context_2nd: "You are a chef on your way to a food festival in Chicago. You are in line to go through security at the airport when you realize you accidentally brought a large knife in your bag.",
    female_name: "Carla",
    male_name: "Carl",
    actions_f: [
      "ask to check the knife",
      "hide the knife in someone else's bag",
      "pretend the knife is part of a hip replacement",
      "store the knife in an airport locker",
      "take a train instead",
      "threaten security with the knife"],
    actions_m: [
      "ask to check the knife",
      "hide the knife in someone else's bag",
      "pretend the knife is part of a hip replacement",
      "store the knife in an airport locker",
      "take a train instead",
      "threaten security with the knife"],
    outcome_f: "The airport security becomes suspicious of Carla, so they take her in custody and she ends up missing the festival.",
    outcome_m: "The airport security becomes suspicious of Carl, so they take him in custody and he ends up missing the festival.",
    causal_f: "Carla caused herself to miss the festival.",
    causal_m: "Carl caused himself to miss the festival.",
    causalcertain_f: "she was going to miss the festival.",
    causalcertain_m: "he was going to miss the festival.",
    counter_m:"he wouldn't have missed the festival.",
    counter_f: "she wouldn't have missed the festival.",
    blame_f:"Carla should be blamed for missing the festival.",
    blame_m:"Carl should be blamed for missing the festival."},

    {
    id: 13,
    female_agent: "Diana is the ring bearer at her sister’s wedding. 10 minutes into the ceremony, she reaches into her pocket but the ring isn’t there. She realizes her left it on the seat next to her in the taxi.",
    male_agent: "Daniel is the ring bearer at his sister’s wedding. 10 minutes into the ceremony, he reaches into his pocket but the ring isn’t there. He realizes he left it on the seat next to him in the taxi.",
    context_2nd: "You are the ring bearer at your sister’s wedding. 10 minutes into the ceremony, you reach into your pocket but the ring isn’t there. You realize you left it on the seat next to you in the taxi.",
    female_name: "Diana",
    male_name: "Daniel",
    actions_f: [
      "blame it on the maid of honor",
      "borrow their mom’s wedding ring",
      "call the taxi company",
      "run away",
      "steal someone else’s ring",
      "tell her sister as soon as possible"],
    actions_m: [
      "blame it on the maid of honor",
      "borrow their mom’s wedding ring",
      "call the taxi company",
      "run away",
      "steal someone else’s ring",
      "tell her sister as soon as possible"],
    outcome_f: "When her sister finds out her ring is missing, she is disappointed and decides to cancel the wedding.",
    outcome_m: "When his sister finds out her ring is missing, she is disappointed and decides to cancel the wedding.",
    causal_f: "Diana caused the wedding to be cancelled.",
    causal_m: "Daniel caused the wedding to be cancelled.",
    causalcertain_f: "the wedding was going to be cancelled.",
    causalcertain_m: "the wedding was going to be cancelled.",
    counter_m:"the wedding wouldn't have been cancelled.",
    counter_f: "the wedding wouldn't have been cancelled.",
    blame_f:"Diana should be blamed for the wedding being cancelled.",
    blame_m:"Daniel should be blamed for the wedding being cancelled."},
    
    {
    id: 14,
    female_agent: "Andrea’s mother just died and without her, her father is unable to take care of himself. Andrea can’t afford to put her father in a retirement home and her apartment has barely enough room for one person.",
    male_agent: "Andy’s mother just died and without her, his father is unable to take care of himself. Andy can’t afford to put his father in a retirement home and his apartment has barely enough room for one person.",
    context_2nd: "Your mother just died and, without her, your father is unable to take care of himself. You can’t afford to put him in a retirement home and your apartment has barely enough room for one person.",
    female_name: "Andrea",
    male_name: "Andy",
    actions_f: [
      "abandon her father",
      "buy her father a tent",
      "check in on her father daily",
      "get another job",
      "move into her father’s apartment",
      "pitch her situation to a reality TV network"],
    actions_m: [
      "abandon his father",
      "buy his father a tent",
      "check in on his father daily",
      "get another job",
      "move into his father’s apartment",
      "pitch his situation to a reality TV network"
    ],
    outcome_f: "After Andrea does this, her father’s mental and physical health quickly deteriorates.",
    outcome_m: "After Andy does this, his father’s mental and physical health quickly deteriorates.",
    causal_f: "Andrea caused his father's condition to get worse.",
    causal_m: "Andy caused his father's condition to get worse.",
    causalcertain_f: "her father's condition was going to get worse.",
    causalcertain_m: "his father's condition was going to get worse.",
    counter_m:"his father's condition wouldn't have gotten worse.",
    counter_f: "her father's condition wouldn't have gotten worse.",
    blame_f:"Andrea should be blamed for his father's condition getting worse.",
    blame_m:"Andy should be blamed for his father's condition getting worse."},

    {
    id: 15,
    female_agent: "Amanda is the captain of a 50-passenger cruise ship. Four days into their trip they get caught in a storm and the engine breaks under the pressure. They are now stranded at sea. A rescue boat is on its way but might not arrive for a week. Their food supplies are quickly dwindling and Amanda isn’t sure what to instruct the passengers and crew.",
    male_agent: "Ahmed is the captain of a 50-passenger cruise ship. Four days into their trip they get caught in a storm and the engine breaks under the pressure. They are now stranded at sea. A rescue boat is on its way but might not arrive for a week. Their food supplies are quickly dwindling and Ahmed isn’t sure what to instruct the passengers and crew.",
    context_2nd: "You are the captain of a 50-passenger cruise ship. Four days into your trip, you get caught in a storm and the engine breaks under the pressure. You are now stranded at sea. A rescue boat is on its way but might not arrive for a week. The food supplies are quickly dwindling and you aren't sure what to instruct the passengers and crew.",
    female_name: "Amanda",
    male_name: "Ahmed",
    actions_f: [
      "organize a fishing crew",
      "ration their food",
      "request supplies to be airdropped",
      "sell all the food to the highest bidder",
      "serve engine fuel to the passengers",
      "throw disobedient passengers off the boat"],
    actions_m: [
      "organize a fishing crew",
      "ration their food",
      "request supplies to be airdropped",
      "sell all the food to the highest bidder",
      "serve engine fuel to the passengers",
      "throw disobedient passengers off the boat"],
    outcome_f: "After Amanda tries this, several passengers suffer injuries from heatstroke and dehydration.",
    outcome_m: "After Ahmed tries this, several passengers suffer injuries from heatstroke and dehydration.",
    causal_f: "Amanda caused his passengers' injuries.",
    causal_m: "Ahmed caused his passengers' injuries.",
    causalcertain_f: "the passengers were going to suffer injuries.",
    causalcertain_m: "the passengers were going to suffer injuries.",
    counter_m:"the passengers wouldn't have suffered injuries.",
    counter_f: "the passengers wouldn't have suffered injuries.",
    blame_f:"Amanda should be blamed for his passengers' injuries.",
    blame_m:"Ahmed should be blamed for his passengers' injuries."},

    {
    id: 16,
    female_agent: "Eva and Todd are on a mountain climbing trip in Arizona. In the middle of their longest day Todd slips and gets his arm trapped in a crevice. Eva tries calling 911 but she has no service. The sun is beating down on them and Eva is worried that she might be getting dehydrated as she unsuccessfully tries to get his arm out of the rock.",
    male_agent: "Evan and Todd are on a mountain climbing trip in Arizona. In the middle of their longest day Todd slips and gets his arm trapped in a crevice. Evan tries calling 911 but he has no service. The sun is beating down on them and Evan is worried that he might be getting dehydrated as he unsuccessfully tries to get Todd’s arm out of the rock.",
    context_2nd: "You and your friend Todd are on a mountain climbing trip in Arizona. In the middle of your longest day Todd slips and gets his arm trapped in a crevice. You try calling 911 but you have no service. The sun is beating down on you and you're worried that you might be getting dehydrated as you unsuccessfully try to get Todd's arm out of the rock.",
    female_name: "Eva",
    male_name: "Evan",
    actions_f: [
      "get her arm stuck in solidarity",
      "give Todd her water",
      "hike until she finds cell service",
      "leave Todd to save herself",
      "saw Todd’s arm off",
      "yell at Todd for getting stuck"],
    actions_m: [
      "get his arm stuck in solidarity",
      "give Todd his water",
      "hike until he finds cell service",
      "leave Todd to save himself",
      "saw Todd’s arm off",
      "yell at Todd for getting stuck"],
    outcome_f: "After Eva does this, Todd dies.",
    outcome_m: "After Evan does this, Todd dies.",
    causal_f: "Eva caused Todd to die.",
    causal_m: "Evan caused Todd to die.",
    causalcertain_f: "Todd was going to die.",
    causalcertain_m: "Todd was going to die.",
    counter_m:"Todd wouldn't have died.",
    counter_f: "Todd wouldn't have died.",
    blame_f:"Eva should be blamed for Todd's death.",
    blame_m:"Evan should be blamed for Todd's death."},

    {
    id: 17,
    female_agent: "Jess works the night shift at a 24/7 convenience store. Every day at 7am the owner of the store, Jess's boss, takes over for the morning shift. Today, Jess has an important court appointment at 8am but her boss hasn't shown up yet and isn't returning her calls.",
    male_agent: "Jeff works the night shift at a 24/7 convenience store. Every day at 7am the owner of the store, Jeff's boss, takes over for the morning shift. Today, Jeff has an important court appointment at 8am but his boss hasn't shown up yet and isn't returning his calls.",
    context_2nd: "You work the night shift at a 24/7 convenience store. Every day at 7am the owner of the store, your boss, takes over for the morning shift. Today, you have an important court appointment at 8am but your boss hasn't shown up yet and isn't returning his calls.",
    female_name: "Jess",
    male_name: "Jeff",
    actions_f: [
      "ask a friend to take over",
      "call her lawyer",
      "leave the store unattended",
      "lock up the store",
      "stage a break-in at the store",
      "tell her lawyer that she’s sick"],
    actions_m: [
      "ask a friend to take over",
      "call his lawyer",
      "leave the store unattended",
      "lock up the store",
      "stage a break-in at the store",
      "tell his lawyer that he’s sick"],
    outcome_f: "After the owner returns, she fires her.",
    outcome_m: "After the owner returns, she fires him.",
    causal_f: "Jess caused herself to be fired.",
    causal_m: "Jeff caused himself to be fired.",
    causalcertain_f: "she was going get fired.",
    causalcertain_m: "he was going get fired.",
    counter_m:"he wouldn't have gotten fired.",
    counter_f: "she wouldn't have gotten fired.",
    blame_f:"Jess should be blamed for getting fired.",
    blame_m:"Jeff should be blamed for getting fired."},

    {
    id: 18,
    female_agent: "Shania is competing in a 100-mile dogsledding race in Minnesota. She hopes to come in first and use the prize money to pay for her college tuition. Halfway through the race she finds one of her competitors lying unconscious next to his crashed sled.",
    male_agent: "Simon is competing in a 100-mile dogsledding race in Minnesota. He hopes to come in first and use the prize money to pay for his college tuition. Halfway through the race he finds one of his competitors lying unconscious next to his crashed sled.",
    context_2nd: "You are competing in a 100-mile dogsledding race in Minnesota. You hope to come in first and use the prize money to pay for your college tuition. Halfway through the race you find one of your competitors lying unconscious next to their crashed sled.",
    female_name: "Shania",
    male_name: "Simon",
    actions_f: [
      "call for help",
      "carry her competitor on her sled",
      "finish the race",
      "hide him in the snow",
      "leave her dogs with him",
      "steal his dogs for extra speed"],
    actions_m: [
      "call for help",
      "carry his competitor on his sled",
      "finish the race",
      "hide him in the snow",
      "leave his dogs with him",
      "steal his dogs for extra speed"],
    outcome_f: "When the competition judges find out what happened, they cancel the race and no one wins the prize money.",
    outcome_m: "When the competition judges find out what happened, they cancel the race and no one wins the prize money.",
    causal_f: "Shania caused the race to be cancelled.",
    causal_m: "Simon caused the race to be cancelled.",
    causalcertain_f: "the race was going to be cancelled..",
    causalcertain_m: "the race was going to be cancelled.",
    counter_m:"the race wouldn't have been cancelled.",
    counter_f: "the race wouldn't have been cancelled.",
    blame_f:"Shania should be blamed for the race being cancelled.",
    blame_m:"Simon should be blamed for the race being cancelled."}


];

// Experiment trails
// Study 6: Blame Judgment
const shuffledScenarios = jsPsych.randomization.shuffle(scenarioStimuli);
const selectedScenarios = shuffledScenarios.slice(0, 12);

// 6 female + 6 male
let genderAssignments = Array(6).fill('female_agent').concat(Array(6).fill('male_agent'));
genderAssignments = jsPsych.randomization.shuffle(genderAssignments);

const ratingTrials = selectedScenarios.map((scenario, idx) => {

  const genderKey   = genderAssignments[idx];
  const agentName   = (genderKey === 'female_agent') ? scenario.female_name : scenario.male_name;
  const actionsKey  = (genderKey === 'female_agent') ? 'actions_f' : 'actions_m';
  const outcomeKey  = (genderKey === 'female_agent') ? 'outcome_f' : 'outcome_m';
  const blameKey    = (genderKey === 'female_agent') ? 'blame_f' : 'blame_m';

  const chosenAction = jsPsych.randomization.sampleWithoutReplacement(
    scenario[actionsKey], 1
  )[0];

  const scenarioText  = scenario[genderKey];
  const outcomeText   = scenario[outcomeKey];
  const blameText     = scenario[blameKey];

  return {
    type: jsPsychSurveyHtmlForm,
    preamble: `
      <div style="text-align:left;margin-bottom:15px;">
        <p><strong>Please read the following scenario:</strong></p>
        <p>${scenarioText}</p>
        <p>${agentName} decides to ${chosenAction}.</p>
        <p>${outcomeText}</p>
      </div>
      <div style="text-align:left;margin-bottom:10px;">
        <p><strong>Please rate how much you agree with the following statement:</strong></p>
        <p>"${blameText}"</p>
      </div>
    `,
    html: `
      <div style="width:100%; text-align:center;">
        <div style="display:flex;justify-content:space-between;font-size:12px;width:70%;margin:0 auto;">
          ${[0,10,20,30,40,50,60,70,80,90,100].map(v=>`<span>${v}</span>`).join('')}
        </div>
        <input type="range" name="blame" min="0" max="100" step="10" value="50"
               style="width:70%; display:block; margin:4px auto;">
        <div style="display:flex;justify-content:space-between;margin-top:4px;width:70%;margin:0 auto;">
          <span>Completely disagree</span>
          <span>Completely agree</span>
        </div>
      </div>
    `,
    button_label: "Continue",
    data: {
      study: "study6_blame",
      scenario_id: scenario.id,
      gender: genderKey,
      agent: agentName,
      action_text: chosenAction,
      outcome_text: outcomeText,
      blame_statement: blameText
    }
  };
});

timeline.push(...ratingTrials);

// attention check question

var attentioncheck = {
  type: jsPsychSurveyLikert,
  questions: [
    {prompt: "Did you pay attention while completing this study?", name: 'attentioncheck', labels: attention_scale, required: true},
  ],
  preamble:"Please answer the following question honestly. Your response will NOT affect whether or not you get paid.",
  randomize_question_order: true,
  required: true,
  on_finish: function(data) {
    let attentionData = data.response;

    attentionData = {
      attention_check: attentionData['attentioncheck']
    };

    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(attentionData);
  }
};

timeline.push(attentioncheck);

// DEMOGRAPHICS
const demographicsQuestions = {
  type: jsPsychSurveyHtmlForm,
  preamble: `<p class="jspsych-survey-multi-choice-preamble">
      Using the scales provided, please respond to each question about you as an individual:
    </p>`,
  html: `
        <!-- Age -->
        <div class="jspsych-survey-multi-choice-question">
          <label for="age">How old are you?</label><br>
          <input type="number" id="age" name="age" min="18" max="100" style="padding: 5px; width: 40px;" class="incomplete" oninput="this.classList.remove('incomplete');">
        </div>
        
        <!-- Race/Ethnicity -->
        <div class="jspsych-survey-multi-choice-question">
          <legend>Please indicate how you identify yourself:</legend>
          <div class="jspsych-survey-multi-choice-option">
            <input type="checkbox" id="race-ethnicity-indigenous" name="race-ethnicity-indigenous" value="Indigenous American or Alaskan Native" class="demographics-race-ethnicity incomplete" onclick="this.classList.remove('incomplete');">
            <label for="race-ethnicity-indigenous">Indigenous American or Alaskan Native</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="checkbox" id="race-ethnicity-asian" name="race-ethnicity-asian" value="Asian or Asian-American" class="demographics-race-ethnicity incomplete" onclick="this.classList.remove('incomplete');">
            <label for="race-ethnicity-asian">Asian or Asian-American</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="checkbox" id="race-ethnicity-black" name="race-ethnicity-black" value="African or African-American" class="demographics-race-ethnicity incomplete" onclick="this.classList.remove('incomplete');">
            <label for="race-ethnicity-black">African or African-American</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="checkbox" id="race-ethnicity-native" name="race-ethnicity-native" value="Native Hawaiian or other Pacific Islander" class="demographics-race-ethnicity incomplete" onclick="this.classList.remove('incomplete');">
            <label for="race-ethnicity-native">Native Hawaiian or other Pacific Islander</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="checkbox" id="race-ethnicity-white" name="race-ethnicity-white" value="White" class="demographics-race-ethnicity incomplete" onclick="this.classList.remove('incomplete');">
            <label for="race-ethnicity-white">White</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="checkbox" id="race-ethnicity-hispanic" name="race-ethnicity-hispanic" value="Hispanic/Latino/a/e/x" class="demographics-race-ethnicity incomplete" onclick="this.classList.remove('incomplete');">
            <label for="race-ethnicity-hispanic">Hispanic/Latino/a/e/x</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="checkbox" id="race-ethnicity-other" name="race-ethnicity-other" value="Other" class="demographics-race-ethnicity incomplete" onclick="this.classList.remove('incomplete');">
            <label for="race-ethnicity-other">Other</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="checkbox" id="race-ethnicity-prefer-not" name="race-ethnicity-prefer-not" value="Prefer not to disclose" class="demographics-race-ethnicity incomplete" onclick="this.classList.remove('incomplete');">
            <label for="race-ethnicity-prefer-not">Prefer not to disclose</label>
          </div>
        </div>

        <!-- Gender -->
        <div class="jspsych-survey-multi-choice-question">
          <legend>With which gender do you most closely identify?</legend>
          <div class="jspsych-survey-multi-choice-option">
            <input type="radio" id="gender-man" name="gender" value="Man" class="demographics-gender incomplete" onclick="this.classList.remove('incomplete');">
            <label for="gender-man">Man</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="radio" id="gender-woman" name="gender" value="Woman" class="demographics-gender incomplete" onclick="this.classList.remove('incomplete');">
            <label for="gender-woman">Woman</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="radio" id="gender-non-binary" name="gender" value="Non-binary" class="demographics-gender incomplete" onclick="this.classList.remove('incomplete');">
            <label for="gender-non-binary">Non-binary</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="radio" id="gender-other" name="gender" value="Other" class="demographics-gender incomplete" onclick="this.classList.remove('incomplete');">
            <label for="gender-other">Other</label>
          </div>
          <div class="jspsych-survey-multi-choice-option">
            <input type="radio" id="gender-prefer-not" name="gender" value="Prefer not to disclose" class="demographics-gender incomplete" onclick="this.classList.remove('incomplete');">
            <label for="gender-prefer-not">Prefer not to disclose</label>
          </div>
        </div>
        
        <style id="jspsych-survey-multi-choice-css">
          .jspsych-survey-multi-choice-question { 
            margin-top: 2em; 
            margin-bottom: 2em; 
            text-align: left; 
          } .jspsych-survey-multi-choice-option { 
            font-size: 10pt; 
            line-height: 2; 
          } .jspsych-survey-multi-choice-horizontal 
            .jspsych-survey-multi-choice-option { 
            display: inline-block; 
            margin-left: 1em; 
            margin-right: 1em; 
            vertical-align: top; 
            text-align: center; 
          } label.jspsych-survey-multi-choice-text input[type='radio'] {
            margin-right: 1em;
          }
        </style>
      `,
  button_label: 'Next',
  on_finish: function (data) {
    let demographicsData = data.response;

    // Age
    const age = Number(demographicsData['age']);

    // Gender
    let gender = demographicsData['gender'] || '';

    // Create a new object with the formatted data
    demographicsData = {
      age: age,
      race_ethnicity_indigenous: demographicsData['race-ethnicity-indigenous'] || '',
      race_ethnicity_asian: demographicsData['race-ethnicity-asian'] || '',
      race_ethnicity_black: demographicsData['race-ethnicity-black'] || '',
      race_ethnicity_native: demographicsData['race-ethnicity-native'] || '',
      race_ethnicity_white: demographicsData['race-ethnicity-white'] || '',
      race_ethnicity_hispanic: demographicsData['race-ethnicity-hispanic'] || '',
      race_ethnicity_other: demographicsData['race-ethnicity-other'] || '',
      race_ethnicity_na: demographicsData['race-ethnicity-prefer-not'] || '',
      gender: gender,
    };
    jsPsych.data
    .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
    .addToAll(demographicsData);
  }
};

timeline.push(demographicsQuestions);

const politicsQuestions = {
  type: jsPsychSurveyMultiChoice,
  questions: [
    {
      name: 'political-ideology-economic',
      prompt: `
            <p class="jspsych-survey-multi-choice-question">
              Which response best captures your political beliefs surrounding <strong>economic</strong> issues?
            </p>`,
      options: politicalResponses,
      horizontal: true
    },
    {
      name: 'political-ideology-social',
      prompt: `
            <p class="jspsych-survey-multi-choice-question">
              Which response best captures your political beliefs surrounding <strong>social</strong> issues?
            </p>`,
      options: politicalResponses,
      horizontal: true
    },
    {
      name: 'political-ideology-overall',
      prompt: `
            <p class="jspsych-survey-multi-choice-question">
              Which response best captures your <strong>overall</strong> political beliefs?
            </p>`,
      options: politicalResponses,
      horizontal: true
    }
  ],
  preamble: `
        <p class="jspsych-survey-multi-choice-preamble">
          Please answer the following questions about your political ideology:
        </p>`,
  request_response: true,
  on_finish: function (data) {
    let politicalData = data.response;

    politicalData = {
      political_ideology_economic: politicalData['political-ideology-economic'],
      political_ideology_social: politicalData['political-ideology-social'],
      political_ideology_overall: politicalData['political-ideology-overall']
    };

    jsPsych.data
      .getDataByTimelineNode(jsPsych.getCurrentTimelineNodeID())
      .addToAll(politicalData);
  }
};

timeline.push(politicsQuestions);

// DataPipe conclude data collection
const save_data = {
   type: jsPsychPipe,
   action: "save",
   experiment_id: "LIYfnXa5y6zU", //updated as of Sep 18
   filename: filename,
   data_string: () => jsPsych.data.get().csv(),
   on_finish: function (data) {
     function countdown(start, end) {
       const timer = setInterval(function() {
         if (start <= end) {
           clearInterval(timer);
         } else {
           start--;
           document.getElementById("countdown").innerHTML = start;
        }
      }, 1000);
     }
    
     countdown(5, 0);

     jsPsych.endExperiment(
      `<p class="jspsych-center">
         Thanks for participating! You will be redirected in <span id="countdown">5</span> second </p>
         <p> DO NOT CLOSE OUT OF THIS PAGE BEFORE YOU ARE REDIRECTED.
       </p>`
     );
     setTimeout(function () {
       window.location.href = "https://app.prolific.com/submissions/complete?cc=C15ADLI3"; //this is updated as of sep 18
     }, 5000)
   }
 };

timeline.push(save_data);

// Run experiment
jsPsych.run(timeline);