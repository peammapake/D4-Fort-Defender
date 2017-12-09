//var game = new Phaser.Game(600, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });
game = new Phaser.Game(screen.width , screen.height , Phaser.AUTO, 'gameArea',{ preload: preload, create: create, update: update });
	//var scaleRatio = window.devicePixelRatio / 3;
	//myAsset.scale.setTo(scaleRatio, scaleRatio);
	function preload() {
		game.load.image('background', 'assets/images/BG.png');
		game.load.spritesheet('wizard','assets/images/aniwizard.png',1580,1580);
		game.load.image('fireball','assets/images/pinkball.png');
		//game.load.image('monster1','assets/images/mon1.png',453,433);
		//game.load.spritesheet('monster1','assets/images/animon1.png',1100,1200);
		game.load.spritesheet('monster1','assets/images/animon1-2.png',970,848);
		game.load.spritesheet('monster2','assets/images/bluenimon.png',970,848);
		game.load.image('wall','assets/images/wall.png');
		game.load.spritesheet('firewall','assets/images/firewall.png',2480,1139);
		game.load.image('heart','assets/images/heart.png',1969,1829);
	}
	var BG ;
	var wide = screen.width
	var sprite;
	var fireballs;
	var monsters;
	var wall;
	var stateText;
	var fireRate = 1000;
	var nextFire = 0;
	var nextSpawn =0;
	var nextSpawn2 =0;
	var spawnTime = 1500;
	var score = 0;
	var killed = 0;
	var scoreTime =0;
	var health;
	var hearts;
	var temp;
	var run =1;
	var spawnTime2 = 5000;

	function create() {
		BG = game.add.sprite(game.world.centerX, 0, 'background');
		BG.anchor.set(0.5,0);
		BG.scale.x=screen.width/2480;
		BG.scale.y=screen.height/3507;

		walls = game.add.group();
		walls.enableBody = true;
		walls.physicsBodyType = Phaser.Physics.ARCADE;

		walls.createMultiple(6,'wall');
		walls.setAll('checkWorldBounds',true);

		wall = walls.getFirstExists(false);
		wall.reset(game.world.centerX,screen.height-200);
		wall.anchor.set(0.5,0.2);
		wall.scale.x = screen.width/2480;
		wall.scale.y = screen.width/2480;
		
		fireballs = game.add.group();
    	fireballs.enableBody = true;
    	fireballs.physicsBodyType = Phaser.Physics.ARCADE;

    	fireballs.createMultiple(50, 'fireball');
    	fireballs.setAll('checkWorldBounds', true);
    	fireballs.setAll('outOfBoundsKill', true);

    	firewall = game.add.sprite(game.world.centerX,screen.height-200,'firewall');
    	firewall.anchor.set(0.5,0.4555);
    	firewall.scale.x = screen.width/2480;
    	firewall.scale.y = screen.width/2480;

    	firewall.animations.add('burn',[0,1],10,true);

    	sprite = game.add.sprite(game.world.centerX, (game.world.height-200), 'wizard');
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

		monsters2 = game.add.group();
		monsters2.enableBody = true;
		monsters2.physicsBodyType = Phaser.Physics.ARCADE;
		monsters2.createMultiple(20,'monster2');
		monsters2.setAll('checkWorldBounds',true);
		monsters2.setAll('outOfBoundsKill',true);

		game.physics.enable(sprite, Phaser.Physics.ARCADE);

    	game.add.text(game.world.width - (game.world.width*9.5/10), game.world.height -(game.world.height*9.5/10), 'Lives : ', { font: '34px Arial', fill: '#fff' });
    	stateText = game.add.text(game.world.centerX,game.world.centerY-(game.world.centerY*1/5),' ', { font: '21px Arial', fill: '#fff'});
    	stateText.anchor.setTo(0.5, 0.5);
    	stateText.visible = false;

    	hearts = game.add.group();
		for (var i = 0; i < 5; i++) {
	        var health = hearts.create((game.world.width - (game.world.width*9.5/10)+150)- (30 * i), game.world.height -(game.world.height*9.5/10) , 'heart');
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
		game.physics.arcade.overlap(fireballs,monsters2, collisionHandler3,null, this);
		game.physics.arcade.collide(wall, monsters2, collisionHandler4, null, this);
		sprite.rotation = game.physics.arcade.angleToPointer(sprite)+(Math.PI/2);
		if (run == 1 ) {
			sprite.animations.play('fired');
	       	fire();
	       	spawn();
	       	spawn2();
	       	firewall.animations.play('burn');
	        firewall.kill();
	       	if(game.time.now>scoreTime){
	       		score+=1;
	       		scoreTime = game.time.now+300;
	       	}
	    }
	    if (run == 0){
	    	firewall.revive();
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
	    wall.reset(game.world.centerX,screen.height-200);
		wall.anchor.set(0.5,0.2);
		wall.scale.x = screen.width/2480;
		wall.scale.y = screen.width/2480;

		heart = hearts.getFirstAlive();
		if(heart){
			heart.kill();
		}
		if (hearts.countLiving() == 0){
			//sprite.kill();
			//monsters.callAll('kill');
	     	sprite.kill();
	     	monsters.callAll('kill');
	     	monsters2.callAll('kill');
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
	function collisionHandler3 (fireball, monster2) {

	    fireball.kill();
	    monster2.kill();
	    killed+=1;

	}


	function collisionHandler4 (wall, monster2) {

	    monster2.kill();
	    wall.reset(game.world.centerX,screen.height-200);
		wall.anchor.set(0.5,0.2);
		wall.scale.x = screen.width/2480;
		wall.scale.y = screen.width/2480;

		heart = hearts.getFirstAlive();
		if(heart){
			heart.kill();
		}
		if (hearts.countLiving() == 0){
			//sprite.kill();
			//monsters.callAll('kill');
	     	sprite.kill();
	     	monsters.callAll('kill');
	     	monsters2.callAll('kill');
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
				monster.reset(game.rnd.integerInRange(1,screen.width),0);
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
	function spawn2(){
		//var frameNames = Phaser.Animation.generateFrameNames('animon1', 0, 1, '', 1);
		//monsters.callAll('animations.add', 'animations', 'walking', frameNames, 30, true, false);
		//monsters.callAll('play', null, 'walking');
		if (game.time.now > nextSpawn2 && monsters2.countDead() > 0) {
			var monster2 = monsters2.getFirstDead();
			if (monster2){
				monster2.reset(game.rnd.integerInRange(1,screen.width),0);
				monster2.anchor.set(0.5);
				monster2.scale.x = 0.1;
				monster2.scale.y = 0.1;
				monster2.body.velocity.y = 100;
				nextSpawn2 = game.time.now +spawnTime2;
				monsters2.callAll('animations.add','animations','moving',[0,1,2,1,0],10,true);
				monsters2.callAll('play',null,'moving');
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