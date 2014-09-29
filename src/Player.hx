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
	var game: Game;

	public function new (game: Game)
	{
		this.game = game;
	}


	public function preload()
	{
		game.load.spritesheet('dude', 'assets/games/starstruck/dude.png', 32, 48);
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

	public function update(cursors: Dynamic, platforms: Group) {

	game.physics.arcade.collide(sprite, platforms);
    
	
	sprite.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        sprite.body.velocity.x = -150;

        sprite.animations.play('left');
    }
    else if (cursors.right.isDown)
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
    if (cursors.up.isDown && sprite.body.touching.down)
    {
        sprite.body.velocity.y = -200;
    }
	}
}
