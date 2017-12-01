var game = new Phaser.Game(600, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });
	function preload() {
		game.load.image('background', 'assets/images/background1.png');
		game.load.spritesheet('wizard','assets/images/aniwizard.png',1580,1580);
		game.load.image('fireball','assets/images/fireball.png');
		game.load.spritesheet('monster1','assets/images/animon1.png',1100,1200);
		game.load.image('wall','assets/images/wall.png');
	}

	var sprite;
	var fireballs;
	var monsters;
	var wall;

	var fireRate = 1000;
	var nextFire = 0;
	var spawnTime = 0;
	var score = 0;
	var killed = 0;
	var scoreTime =0;
	var health = 5;
	var temp;

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

		

		game.physics.enable(sprite, Phaser.Physics.ARCADE);

		// sprite.body.allowRotation = false;
	}
	function update() {
		game.physics.arcade.overlap(fireballs, monsters, collisionHandler, null, this);
		game.physics.arcade.collide(wall, monsters, collisionHandler2, null, this);
		sprite.rotation = game.physics.arcade.angleToPointer(sprite)+(Math.PI/2);
		sprite.animations.play('fired');
		
		
       	fire();
       	spawn();
       	if(game.time.now>scoreTime){
       		score+=1;
       		scoreTime = game.time.now+300;
       	}
		game.debug.text('Score : '+score,450,32);
		game.debug.text('killed : '+killed,450,64);
		game.debug.text('health : '+health,450,92);
	}
	function fire() {
	    if (game.time.now > nextFire && fireballs.countDead() > 0)
	    {
	        nextFire = game.time.now + fireRate;

	        var fireball = fireballs.getFirstDead();
	        
	        fireball.scale.x = 0.05;
			fireball.scale.y = 0.05;

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
	    health-=1;

	}

	function spawn(){
		var frameNames = Phaser.Animation.generateFrameNames('animon1', 0, 1, '', 1);
		monsters.callAll('animations.add', 'animations', 'walking', frameNames, 30, true, false);
		monsters.callAll('play', null, 'walking');
		if (game.time.now > spawnTime) {
			var monster = monsters.getFirstExists(false);
			if (monster){
				monster.reset(game.rnd.integerInRange(0,600),0);
				monster.anchor.set(0.5);
				monster.scale.x = 0.15;
				monster.scale.y = 0.15;
				monster.body.velocity.y = 150;
				spawnTime = game.time.now +1500;
			}
		}
	}
	function processHandler (wall,monster) {

	    return true;

	}