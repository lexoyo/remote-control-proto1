/**
 * @author       @lexoyo
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
package;

import js.Lib;
import phaser.Phaser;
import phaser.core.Game;
import phaser.gameobjects.Events;
import phaser.gameobjects.Text;
import phaser.gameobjects.Sprite;
import phaser.core.Group;
import phaser.physics.Physics;
import phaser.tilemap.Tilemap;

class Player
{
	public var sprite: Sprite;
	public var keys: Map<String, Bool>;
	var game: Game;

	public function new (game: Game)
	{
		this.game = game;
		keys = new Map();
		keys.set('left', false);
		keys.set('right', false);
		keys.set('up', false);
		create();
	}

	public function create()
	{
		sprite = game.add.sprite(32, (game.world.height / 2) - 150, 'dude');
	    game.physics.arcade.enable(sprite);
		sprite.body.gravity.y = 300;

		//sprite.body.bounce.y = 0.2;
		//sprite.body.gravity.y = 300;
		sprite.body.collideWorldBounds = true;
		sprite.animations.add('left', [0, 1, 2, 3], 10, true);
		sprite.animations.add('right', [5, 6, 7, 8], 10, true);
	}

	public function update(platforms: Group) {
		game.physics.arcade.collide(sprite, platforms);
	
		sprite.body.velocity.x = 0;

	    if (keys.get('left'))
	    {
	        //  Move to the left
	        sprite.body.velocity.x = -150;

	        sprite.animations.play('left');
	    }
	    else if (keys.get('right'))
	    {
	        //  Move to the right
	        sprite.body.velocity.x = 150;
	        sprite.body.y += -.5;
	
	        sprite.animations.play('right');
	    }
	    else
	    {
	        //  Stand still
	        sprite.animations.stop();

	        sprite.frame = 4;
	    }

	    //  Allow the sprite to jump if they are touching the ground.
	    if (keys.get('up') && sprite.body.touching.down)
	    {
	        sprite.body.velocity.y = -200;
	    }
	}
	public function dispose(){
		sprite.destroy(true);
	}
}
