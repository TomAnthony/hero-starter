/* 

  The only function that is required in this file is the "move" function

  You MUST export the move function, in order for your code to run
  So, at the bottom of this code, keep the line that says:

  module.exports = move;

  The "move" function must return "North", "South", "East", "West", or "Stay"
  (Anything else will be interpreted by the game as "Stay")
  
  The "move" function should accept two arguments that the website will be passing in: 
    - a "gameData" object which holds all information about the current state
      of the battle

    - a "helpers" object, which contains useful helper functions
      - check out the helpers.js file to see what is available to you

    (the details of these objects can be found on javascriptbattle.com/rules)

  This file contains four example heroes that you can use as is, adapt, or
  take ideas from and implement your own version. Simply uncomment your desired
  hero and see what happens in tomorrow's battle!

  Such is the power of Javascript!!!

*/

//TL;DR: If you are new, just uncomment the 'move' function that you think sounds like fun!
//       (and comment out all the other move functions)


// // The "Northerner"
// // This hero will walk North.  Always.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   return 'North';
// };

// // The "Blind Man"
// // This hero will walk in a random direction each turn.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   var choices = ['North', 'South', 'East', 'West'];
//   return choices[Math.floor(Math.random()*4)];
// };

// // The "Priest"
// // This hero will heal nearby friendly champions.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   if (myHero.health < 60) {
//     return helpers.findNearestHealthWell(gameData);
//   } else {
//     return helpers.findNearestTeamMember(gameData);
//   }
// };

// // The "Unwise Assassin"
// // This hero will attempt to kill the closest enemy hero. No matter what.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   if (myHero.health < 30) {
//     return helpers.findNearestHealthWell(gameData);
//   } else {
//     return helpers.findNearestEnemy(gameData);
//   }
// };

// // The "Careful Assassin"
// // This hero will attempt to kill the closest weaker enemy hero.
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;
//   if (myHero.health < 50) {
//     return helpers.findNearestHealthWell(gameData);
//   } else {
//     return helpers.findNearestWeakerEnemy(gameData);
//   }
// };

// // The "Safe Diamond Miner"
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;

//   //Get stats on the nearest health well
//   var healthWellStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
//     if (boardTile.type === 'HealthWell') {
//       return true;
//     }
//   });
//   var distanceToHealthWell = healthWellStats.distance;
//   var directionToHealthWell = healthWellStats.direction;
  

//   if (myHero.health < 40) {
//     //Heal no matter what if low health
//     return directionToHealthWell;
//   } else if (myHero.health < 100 && distanceToHealthWell === 1) {
//     //Heal if you aren't full health and are close to a health well already
//     return directionToHealthWell;
//   } else {
//     //If healthy, go capture a diamond mine!
//     return helpers.findNearestNonTeamDiamondMine(gameData);
//   }
// };

// // The "Selfish Diamond Miner"
// // This hero will attempt to capture diamond mines (even those owned by teammates).
// var move = function(gameData, helpers) {
//   var myHero = gameData.activeHero;

//   //Get stats on the nearest health well
//   var healthWellStats = helpers.findNearestObjectDirectionAndDistance(gameData.board, myHero, function(boardTile) {
//     if (boardTile.type === 'HealthWell') {
//       return true;
//     }
//   });

//   var distanceToHealthWell = healthWellStats.distance;
//   var directionToHealthWell = healthWellStats.direction;

//   if (myHero.health < 40) {
//     //Heal no matter what if low health
//     return directionToHealthWell;
//   } else if (myHero.health < 100 && distanceToHealthWell === 1) {
//     //Heal if you aren't full health and are close to a health well already
//     return directionToHealthWell;
//   } else {
//     //If healthy, go capture a diamond mine!
//     return helpers.findNearestUnownedDiamondMine(gameData);
//   }
// };

// // The "Coward"
// // This hero will try really hard not to die.
// var move = function(gameData, helpers) {
//   return helpers.findNearestHealthWell(gameData);
// }

// "Healer Tom"
// This hero will attempt to heal teammates, or heal themselves, whilst avoiding enemies.
var move = function(gameData, helpers) {
  var myHero = gameData.activeHero;

  //Get stats on the nearest health well, enemy and comrade
  nearestHealthWell = helpers.nearestHealthWell(gameData);
  nearestTeamMember = helpers.nearestTeamMember(gameData);
  nearestTeamMemberWeakerThanClosest = helpers.nearestTeamMember(gameData, nearestTeamMember.health);
  nearestEnemy = helpers.nearestEnemy(gameData);

  var distanceToHealthWell = nearestHealthWell.distance;
  var directionToHealthWell = nearestHealthWell.direction;

  // If the nearest teammate we found has more health than another friend at the same distance then prioritise the weaker friend.
  if (nearestTeamMember.distance == nearestTeamMemberWeakerThanClosest.distance)
  {
    nearestTeamMember = nearestTeamMemberWeakerThanClosest;
  }

  // Who is the next nearest teammember - we want options.
  nextNearestTeamMember = helpers.nearestTeamMemberWhoIsNot(gameData, nearestTeamMember);

  // // Healing the closest friend won't have maximum impact, so see if someone else is within same distance
  // if (nearestTeamMember.health > 60)
  // {

  // }


  function tryToFindHealing() {
    // Is is safe to go to the nearest health well?
    if ((nearestHealthWell.direction != nearestEnemy.direction) || (nearestEnemy.distance > nearestHealthWell.distance))
    {
      return nearestHealthWell.direction;
    
    }else{ // It isn't safe to go to the well, so lets see if there is a friend nearby - they may heal us but also might fight off the enemy if they chase us.

      if ((nearestTeamMember.direction != nearestEnemy.direction) || (nearestEnemy.distance > nearestTeamMember.distance))
      {
        return nearestTeamMember.direction;
      }else{ // No friends nearby, so just flee the enemy.
        return oppositeDirection(nearestEnemy.direction);
      }
    }
  }

  function oppositeDirection(direction) {
          if (nearestEnemy.direction === 'North') {
            return 'South';
          } else if (direction === 'East') {
            return 'West';
          } else if (direction === 'South') {
            return 'North';
          } else if (direction === 'West') {
            return 'East';
          } else {
            return false;
          }
  }

  // What to do?
  // If I'm ill then work out if nearest health well is safe (no enemies in that direction/distnance).
  // If I'm unwell then go towards health well if it is a lot closer than friends.
  // If I'm healthy then head towards nearest friend who needs help.
  // If there nearest friend is more than 8 steps, then just head towards the nearest safe well.

  // TODO:
  // If I am next to an enemy then I need to weigh up moving, if they are weaker than me I should stay put, otherwise
  // I give them the chance to deal additional damage to me (I move away, they chase and deal me 20). If they are next to me I should actually attach (unless I can hit a well or heal a friend). Should I really heal a friend rather than fight? it is overall the bigger plus for the team but relies on that friend helping me.

  // Also need to fix that it gives directions that can't be moved into - or does it....

  if (myHero.health <= 40) {
    return tryToFindHealing();
  }

  if (myHero.health <= 60) {

    // If the nearestHealthWell is a lot closer than friends investigating going to heal instead.
    if ((nearestTeamMember.distance - nearestHealthWell.distance) > 3)
    {
      return tryToFindHealing();
    }
    
    // Ok - so there is no well a lot closer, so we pass through and proceed as though healthy.
    
  }

  if (nearestTeamMember.distance > 8)
  {
    // My friends are a long way away, so I'm going to head towards a well, provided that isn't going towards an enemy.

    if (nearestHealthWell.direction != nearestEnemy.direction)
        return nearestHealthWell.direction;
  }

  // Ok, so I'm healthy (or not that unhealthy), and there are friends nearby.
  if (nearestTeamMember.direction != nearestEnemy.direction)
  {
    return nearestTeamMember.direction;
  }else{
    return nextNearestTeamMember.direction;
  }

  return 'Stay';

};



// Export the move function here
module.exports = move;
