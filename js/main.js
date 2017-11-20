var game = new Phaser.Game(600, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });
	function preload() {
		game.load.image('background', 'assets/images/rsz_1background.png');
		game.load.image('wizard','assets/images/wizard1.png');
		game.load.image('fireball','assets/images/fireball.png');
	}

	var sprite;
	var fireballs;

	var fireRate = 500;
	var nextFire = 0;

	function create() {
		game.add.sprite(0, 0, 'background');

		fireballs = game.add.group();
    	fireballs.enableBody = true;
    	fireballs.physicsBodyType = Phaser.Physics.ARCADE;

    	fireballs.createMultiple(50, 'fireball');
    	fireballs.setAll('checkWorldBounds', true);
    	fireballs.setAll('outOfBoundsKill', true);

    	sprite = game.add.sprite(300, 700, 'wizard');
		sprite.anchor.set(0.5);
		sprite.scale.x = 0.4;
		sprite.scale.y = 0.4;

		game.physics.enable(sprite, Phaser.Physics.ARCADE);

		// sprite.body.allowRotation = false;
	}
	function update() {
		sprite.rotation = game.physics.arcade.angleToPointer(sprite) + Math.PI/2;
       		fire();
	}
	function fire() {
	    if (game.time.now > nextFire && fireballs.countDead() > 0)
	    {
	        nextFire = game.time.now + fireRate;

	        var fireball = fireballs.getFirstDead();
	        
	        fireball.scale.x = 0.1;
			fireball.scale.y = 0.1;

	        fireball.reset(sprite.x - 29, sprite.y-30);

	        game.physics.arcade.moveToPointer(fireball, 300);
	    }

	} 
