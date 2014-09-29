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

class ScreenApp
{
	var game:Game;
	var player: Player;
	var platforms: Group;
	var socket: Dynamic;
	var players: Map<String, Player>;

	static function main(){
		new ScreenApp();
	}

	public function new ()
	{
		game = new Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
		players = new Map();
		socket = untyped io();
		haxe.Timer.delay(function(){
			//socket.emit('init', 'screen');
		}, 2000);
		socket.on('key', function(id, key, isDown){
			var player = players.get(id);
			player.keys.set(key, isDown);
			update();
		});
		socket.on('connection.close', function(id){
			trace('close connection', id);
			var player = players.get(id);
			if (player != null){
				players.remove(id);
				player.dispose();
			}
		});
		socket.on('connection.open', function(id, type){
			trace('new connection', id, type);
			var player = players.get(id);
			if(player == null) {
				player = new Player(game);
				players.set(id, player);
			}
			//game.camera.follow(player.sprite);
			player.sprite.animations.add('right', [5, 6, 7, 8], 10, true);
		});
	}


	function preload()
	{
		game.load.image('background','assets/misc/starfield.jpg');
		//game.load.image('ground', 'assets/sprites/platform.png');
		game.load.image('ground', 'assets/tilemaps/tiles/ground_1x1.png');
		//player.preload();

		game.load.spritesheet('dude', 'assets/games/starstruck/dude.png', 32, 48);
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
	}

	function update() {
		var numMoving = 0;
		var sumX: Float = 0;
		var sumY: Float = 0;
		for (player in players){
			player.update(platforms);
			var isMoving = (player.sprite.body.velocity.x != 0)
				|| (player.sprite.body.velocity.y != 0);
			if(isMoving){
				numMoving++;
				sumX += player.sprite.x;
				sumY += player.sprite.y;
			}
		}
		if(numMoving > 0){
			trace('moving', numMoving, Math.round(sumX/numMoving));
			game.camera.x = Math.round(sumX/numMoving) - 400;
			game.camera.y = Math.round(sumY/numMoving) - 300;
		}
		
	}
}
