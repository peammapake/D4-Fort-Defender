var game = new Phaser.Game(600, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });
	function preload() {
		game.load.image('background', 'assets/images/background1.png');
		game.load.spritesheet('wizard','assets/images/aniwizard.png',1580,1580);
		game.load.image('fireball','assets/images/pinkball.png');
		//game.load.image('monster1','assets/images/mon1.png',453,433);
		//game.load.spritesheet('monster1','assets/images/animon1.png',1100,1200);
		game.load.spritesheet('monster1','assets/images/animon1-2.png',970,848);
		game.load.image('wall','assets/images/wall.png');
		game.load.spritesheet('firewall','assets/images/firewall.png',2480,1139);
		game.load.image('heart','assets/images/heart.png',1969,1829);
	}

	var sprite;
	var fireballs;
	var monsters;
	var wall;
	var stateText;
	var fireRate = 1000;
	var nextFire = 0;
	var nextSpawn =0;
	var spawnTime = 1500;
	var score = 0;
	var killed = 0;
	var scoreTime =0;
	var health;
	var hearts;
	var temp;
	var run =1;

	function create() {
		game.add.sprite(0, 0, 'background');

		walls = game.add.group();
		walls.enableBody = true;
		walls.physicsBodyType = Phaser.Physics.ARCADE;

		walls.createMultiple(6,'wall');
		walls.setAll('checkWorldBounds',true);

		wall = walls.getFirstExists(false);
		wall.reset(300 , 745);
		wall.anchor.set(0.5);
		wall.scale.x = 0.25;
		wall.scale.y = 0.22;
		
		fireballs = game.add.group();
    	fireballs.enableBody = true;
    	fireballs.physicsBodyType = Phaser.Physics.ARCADE;

    	fireballs.createMultiple(50, 'fireball');
    	fireballs.setAll('checkWorldBounds', true);
    	fireballs.setAll('outOfBoundsKill', true);

    	firewall = game.add.sprite(300,708,'firewall');
    	firewall.anchor.set(0.5);
    	firewall.scale.x = 0.25;
    	firewall.scale.y = 0.25;

    	firewall.animations.add('burn',[0,1],10,true);

    	sprite = game.add.sprite(300, 720, 'wizard');
		sprite.anchor.set(0.5,0.6);
		sprite.scale.x = 0.1;
		sprite.scale.y = 0.1;

		sprite.animations.add('fired',[1,0],2,true);

		monsters = game.add.group();
		monsters.enableBody = true;
		monsters.physicsBodyType = Phaser.Physics.ARCADE;
		monsters.createMultiple(20, 'monster1');
		monsters.setAll('checkWorldBounds', true);
		monsters.setAll('outOfBoundsKill', true);

		game.physics.enable(sprite, Phaser.Physics.ARCADE);

		hearts = game.add.group();
    	game.add.text(game.world.width -550, 10, 'Lives : ', { font: '34px Arial', fill: '#fff' });
    	stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff'});
    	stateText.anchor.setTo(0.5, 0.5);
    	stateText.visible = false;
		for (var i = 0; i < 5; i++) {
	        var health = hearts.create(290 - (30 * i), 35, 'heart');
	        health.anchor.setTo(0.5, 0.5);
	        health.scale.x = 0.01;
	        health.scale.y = 0.01;
	        //health.angle = 90;
	        health.alpha = 0.4;
    	}
	}
	function update() {
		game.physics.arcade.overlap(fireballs, monsters, collisionHandler, null, this);
		game.physics.arcade.collide(wall, monsters, collisionHandler2, null, this);
		sprite.rotation = game.physics.arcade.angleToPointer(sprite)+(Math.PI/2);
		if (run == 1 ) {
			sprite.animations.play('fired');
	       	fire();
	       	spawn();
	       	firewall.animations.play('burn');
	        firewall.visible = false;
	       	if(game.time.now>scoreTime){
	       		score+=1;
	       		scoreTime = game.time.now+300;
	       	}
	    }
	    if (run == 0){
	    	firewall.visible = true;
	       	        }
		game.debug.text('Score : '+score,450,32);
		game.debug.text('killed : '+killed,450,64);
		//game.debug.text('monsters : '+monsters.countDead(),200,96);
		//game.debug.text('health : '+health,450,92);
	}
	function fire() {
	    if (game.time.now > nextFire && fireballs.countDead() > 0)
	    {
	        nextFire = game.time.now + fireRate;

	        var fireball = fireballs.getFirstDead();
	        fireball.scale.x = 0.04;
			fireball.scale.y = 0.04;
			fireball.rotation = game.physics.arcade.angleToPointer(sprite)+(Math.PI/2);
	        fireball.reset(sprite.x - 30, sprite.y-30);

	        game.physics.arcade.moveToPointer(fireball, 600);
	    }

	} 
	function collisionHandler (fireball, monster) {

	    fireball.kill();
	    monster.kill();
	    killed+=1;

	}

	function collisionHandler2 (wall, monster) {

	    monster.kill();
	    wall.reset(300 , 745);
		wall.anchor.set(0.5);
		wall.scale.x = 0.25;
		wall.scale.y = 0.22;

		heart = hearts.getFirstAlive();
		if(heart){
			heart.kill();
		}
		if (hearts.countLiving() == 0){
			//sprite.kill();
			//monsters.callAll('kill');
	     	sprite.kill();
	     	monsters.callAll('kill');
	     	fireballs.callAll('kill');
	     	sprite.animations.stop(null,true);
	     	run = 0;
	   
	        stateText.text=" GAME OVER \n SCORE:"+score+" \nClick to restart";
	        stateText.visible = true;


	        //the "click to restart" handler
	        game.input.onTap.addOnce(restart,this);
	    }
	    //health-=1;

	}

	function spawn(){
		//var frameNames = Phaser.Animation.generateFrameNames('animon1', 0, 1, '', 1);
		//monsters.callAll('animations.add', 'animations', 'walking', frameNames, 30, true, false);
		//monsters.callAll('play', null, 'walking');
		if (game.time.now > nextSpawn && monsters.countDead() > 0) {
			var monster = monsters.getFirstDead();
			if (monster){
				monster.reset(game.rnd.integerInRange(0,600),0);
				monster.anchor.set(0.5);
				monster.scale.x = 0.1;
				monster.scale.y = 0.1;
				monster.body.velocity.y = 150;
				nextSpawn = game.time.now +spawnTime;
				monsters.callAll('animations.add','animations','moving',[0,1,2,1,0],10,true);
				monsters.callAll('play',null,'moving');
			}
		}
	}
	function processHandler (wall,monster) {
	    return true;
	}
	function restart () {

    //  A new level starts
    
    //resets the life count
   	hearts.callAll('revive');

    //revives the player
    sprite.revive();
    run = 1;
    //fire();
    

    //hides the text
    stateText.visible = false;
    score = 0;
	killed = 0;
	scoreTime =0;
}