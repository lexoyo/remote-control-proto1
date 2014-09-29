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

class Main
{
	var game:Game;
	var player: Player;
	var platforms: Group;
	var cursors: Dynamic;
	var socket: Dynamic;
	var keys: Dynamic;

	static function main(){
		new Main();
		socket = untyped io();
		socket.emit('init', 'screen');
		socket.on('keydown', function(id, key){
			trace('keydown', id, key);
		});
		keys = {
			left: false,
			right: false,
			up: false
		};
	}

	public function new ()
	{
		game = new Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
		player = new Player(game);
	}


	function preload()
	{
		game.load.image('background','assets/misc/starfield.jpg');
		//game.load.image('ground', 'assets/sprites/platform.png');
		game.load.image('ground', 'assets/tilemaps/tiles/ground_1x1.png');
		player.preload();
	}

	function create()
	{
		var worldWidth = 4000;
		var worldHeight = 4000;
		game.physics.startSystem(Physics.ARCADE);
		//game.stage.backgroundColor = '#2d2d2d';

		game.world.setBounds(0, 0, worldWidth, worldHeight);
		game.add.tileSprite(0, 0, worldWidth, worldHeight, cast 'background', 0);

		platforms = game.add.group();
		platforms.enableBody = true;

		var w = 32;
		var deltaY = 0;
		for (i in 0...100){
			var ground = platforms.create((i * w), deltaY + (game.world.height / 2) - w, 'ground');
			deltaY += Math.round((Math.random() - .5) * 100);
			//ground.angle = -2;
			ground.body.immovable = true;
		}
		player.create();
		game.camera.follow(player.sprite);
		game.physics.arcade.collide(player.sprite, platforms);

		cursors = game.input.keyboard.createCursorKeys();

	}

	function update() {
		function checkKey(key){
		    if (cursors[key].isDown !== keys[key])
		    {
				keys[key] = cursors[key].isDown;
				io.emit('key', key, keys[key]);
		    }
		};
		checkKey('left');
		checkKey('right');
		checkKey('up');

		player.update(keys, platforms);
	}
}
