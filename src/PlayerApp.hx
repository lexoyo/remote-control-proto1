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

class PlayerApp
{
	var game: Game;
	var cursors: Dynamic;
	var socket: Dynamic;
	var keys: Map<String, Bool>;

	static function main(){
		new PlayerApp();
	}

	public function new ()
	{
		game = new Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
		socket = untyped io();
		haxe.Timer.delay(function(){
			socket.emit('init', 'screen');
		}, 2000);
		socket.on('key', function(id, key, isDown){
			trace('key', id, key, isDown);
//			Reflect.setField(keys, key, isDown);
		});
		socket.on('connection.close', function(id){
			trace('close connection', id);
		});	
		socket.on('connection.open', function(id, type){
			trace('new connection', id, type);
		});
		keys = new Map();
		keys['left'] = false;
		keys['right'] = false;
		keys['up'] = false;
	}


	function preload()
	{
		game.load.image('background','assets/misc/starfield.jpg');
		game.load.image('ground', 'assets/tilemaps/tiles/ground_1x1.png');
	}

	function create()
	{
		cursors = game.input.keyboard.createCursorKeys();

	}

	function update() {
		function checkKey(key: String){
			var isDown = Reflect.field(cursors, key) != null
				&& Reflect.field(cursors, key).isDown;
		    if (isDown != keys[key])
		    {
				keys[key] = isDown;
				socket.emit('key', key, keys[key]);
				trace('isdown', isDown);
		    }
		};
		checkKey('left');
		checkKey('right');
		checkKey('up');
	}
}
