/*********************************
* INITIALIZATION
**********************************/
// Dramatis personae
characters = [
    {
      "id"      : 0,
      "name"    : "Floki",
      "hp"      : 100,
      "damage"  : 12,
      "dmgInc"  : 12,
      "avatar"  : "./assets/images/floki3.jpg"
    },
    {
      "id"      : 1,
      "name"    : "Ragnar",
      "hp"      : 110,
      "damage"  : 10,
      "dmgInc"  : 8,
      "avatar"  : "./assets/images/ragnar3.jpg"
    },
    {
      "id"      : 2,
      "name"    : "Bjorn",
      "hp"      : 130,
      "damage"  : 11,
      "dmgInc"  : 8,
      "avatar"  : "./assets/images/bjorn3.jpg"
    },
    {
      "id"      : 3,
      "name"    : "Ivar",
      "hp"      : 180,
      "damage"  : 18,
      "dmgInc"  : 5,
      "avatar"  : "./assets/images/ivar3.jpg"
    }
    ];
    
    // Array of character objects
    // var characters = [c1, c2, c3, c4];
    // User's character choice
    var player;
    // Current opponent (chosen by user)
    var opponent;
    // Victory boost
    var damageBoost = 20;
    
    // Manage various modes of gameplay
    // Options: choosePlayer, chooseOpp, attack, gameOver
    var state = "choosePlayer";
    var curScreen;
    
    /*********************************
    * FUNCTIONS
    **********************************/
    /**
    * Updates instructions text
    */
    function instruct(s) {
      $("#instructions").text(s);
    }
    /**
    * Switches game modes and handles transitions
    * Args: s = state, w (optional) = win?
    */
    function stateSwitcher(s, w) {
      if(s==="attack") {
        state = "attack";
        renderArena();
        transTo("screen1");
      } else if (s==="chooseOpp") {
        state = "chooseOpp";
        transTo("screen0");
      } else if (s==="gameOver") {
        renderGameOver(w);
        state = "gameOver";
        transTo("screen2");
      }
      console.log("Current state: "+state);
    }
    /**
    * Displays characters as "cards" on screen
    */
    function renderCards(){
      for(var i=0; i < characters.length; i++) {
        var card = $("<div>");
        var avatar = "<img src='"+characters[i].avatar+"'>";
        var name = "<h3>"+characters[i].name+"</h3>";
        var hp = "<h4 class='hp'>"+characters[i].hp+" HP</h4>";
        card.addClass("card");
        card.attr("id", i);
        card.html(name);
        card.append(avatar);
        card.append(hp);
        $("#characters").append(card);
      }
    }
    /**
    * Populates the arena with dueling characters
    */
    function renderArena() {
      // Clear out battles messages
      $("#arena #status").empty();
      // If player card doesn't already exist...
      if ($("#duel .player").length === 0) {
        $("#characters #"+player.id).clone().appendTo("#duel");
      }
      // If opponent card doesn't already exist...
      if ($("#duel .opponent").length === 0) {
        $("#characters #"+opponent.id).clone().appendTo("#duel");
      } else {
        $("#duel .opponent").replaceWith($("#characters #"+opponent.id).clone());
      }
      // Enable attack button// Disable attack button
      $("#attack").removeClass("disabled");
      console.log("Arena rendered");
    }
    /**
    * Renders the game over screen
    */
    function renderGameOver(w) {
      if ($("#showcase .card").length===0) {
        $("#characters #"+player.id).clone().appendTo("#showcase");
      }
      if(w) {
        $("#showcase h4.hp").text("WINNER!");
        $("#gameOver #message").html("You defeated everyone. You win!");
      } else {
        $("#gameOver #message").html("You were defeated by " + opponent.name + ". Try again.");
      }
      console.log("Game Over rendered");
    }
    /**
    * Handles the selection of characters
    */
    function chooseCharacter(c){
      var id = $(c).attr("id");
      if (state === "choosePlayer") {
        player = "";
        player = characters[id];
        // Don't allow any more clicking on that card...
        $(c).addClass("disable player");
        console.log("You chose " + player.name);
        // switch states...
        stateSwitcher("chooseOpp");
        instruct("Choose your opponent");
      } else if (state === "chooseOpp") {
        opponent = characters[id];
        // Don't allow any more clicking on that card...
        $(c).addClass("disable opponent");
        console.log("For your opponent, you chose " + opponent.name);
        // switch states...
        stateSwitcher("attack");
      }
    }
    /**
    * Transition to a target screen (t)
    */
    function transTo(t) {
      // If we're on the correct screen, don't transition
      if(curScreen !== t) {
        console.log("Transitioning to " + t);
        $("html, body").animate({
            scrollTop: $("#"+t).offset().top
        }, 1000, "easeInOutCubic", function(){
          console.log("Transition complete");
        });
      }
      curScreen = t;
      // console.log("Current screen = " + t);
    }
    /**
    * Attack sequence
    */
    function attack() {
      if(state === "attack") {
        // console.log("Starting player HP: " + player.hp);
        // console.log("Starting opponent HP: " + opponent.hp);
        opponent.hp = opponent.hp - player.damage;
        player.hp = player.hp - opponent.damage;
        // Update HP display
        if (player.hp > 0) {
          $(".player .hp").html(player.hp + " HP");
        } else {
          $(".player .hp").text("DEFEATED");
        }
        if (opponent.hp > 0) {
          $(".opponent .hp").html(opponent.hp + " HP");
        } else {
          $(".opponent .hp").text("DEFEATED");
        }
        $("#arena #status").html("You attacked for "+player.damage+" damage.<br>");
        $("#arena #status").append(opponent.name +" attacked for "+opponent.damage+" damage.");
        // console.log("You attacked for " + player.damage + " damage.");
        // console.log("Your opponent attacked for " + opponent.damage + " damage.");
        // Increase player attack power by dmgInc amount
        player.damage += player.dmgInc;
        // Opponent defeated?
        if(opponent.hp <= 0) {
          roundVictory();
        } else if (player.hp <= 0) {
          gameLose();
        }
      }
    
    }
    /**
    * Round victory sequence
    */
    function roundVictory() {
      // Player gets boost to damange
      player.damage += damageBoost;
      $("#arena #status").append("<br>You defeated "+opponent.name + "!");
      // Add defeated class to opponent in character selection screen
      $("#characters .opponent").addClass("defeated");
      // Disable attack button
      $("#attack").addClass("disabled");
      // console.log("You won the round!");
      $("#duel .opponent").animate({
          opacity: 0
      }, 1000, "easeInOutCubic", function(){
        console.log("Fade out complete");
        // Are there more opponents left?
        // Count character cards with a "disabled" class
        // If equal to total number of characters, no one's left to fight
        console.log("Number of disabled cards: " + $("#characters .disable").length);
        if($("#characters .disable").length===characters.length) {
          console.log("There are no more opponents.");
          gameWin();
        } else {
          console.log("There are more opponents to duel.");
          stateSwitcher("chooseOpp");
        }
      });
    
    }
    /**
    * Game over sequence - Losing outcome
    */
    function gameLose() {
      console.log("You died. Game over.");
      stateSwitcher("gameOver", false);
    }
    /**
    * Game over sequence - Winning outcome
    */
    function gameWin() {
      console.log("You win!");
      stateSwitcher("gameOver", true);
    }
    /*********************************
    * DOCUMENT READY
    **********************************/
    $(document).ready(function(){
    
      transTo("screen0");
      renderCards();
    
      // Fade in entire page contents
      $("#wrap").fadeIn( "slow", function() {
        // Hide loading message
        $("#loader").css("display", "none");
      });
    
      $(".card").click(function(){
        chooseCharacter(this);
      });
    
      $("#attack").click(function(){
        attack();
      });
    
      $("#reset").click(function(){
        $("html, body").fadeOut( "slow", function() {
          location.reload();
        });
      });
    
    });