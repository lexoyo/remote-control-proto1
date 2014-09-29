/**
 * @author       @lexoyo
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
package;

import js.Lib;
import js.Browser;
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
		Browser.window.addEventListener('load', onLoad);
	}
	function onLoad(e){
		function checkKey(key: String){
			trace('check', key, Browser.document.querySelector('.' + key));
			trace(Browser.document.getElementsByClassName(key));
			function onMouseDown(e){
				if (!keys[key])
				{
					keys[key] = true;
					socket.emit('key', key, keys[key]);
				}
			};
			function onMouseUp(e){
				if (keys[key])
				{
					keys[key] = false;
					socket.emit('key', key, keys[key]);
				}
			};
			Browser.document.getElementsByClassName(key)[0]
				.addEventListener('mousedown', onMouseDown); 
			Browser.document.getElementsByClassName(key)[0]
				.addEventListener('mouseup', onMouseUp);
		}
		checkKey('left');
		checkKey('right');
		checkKey('up');
		(Browser.window.top.document.body != null ? Browser.window.top.document.body : Browser.document.body)
			.addEventListener('keydown', function(e){
				function onKeyDown(key){
					if (!keys[key]){
						keys[key] = true;
						socket.emit('key', key, keys[key]);
					}
				}
				switch(e.keyCode){
					case 37: onKeyDown('left');
					case 38: onKeyDown('up');
					case 39: onKeyDown('right');
				}
			});
		(Browser.window.top.document.body != null ? Browser.window.top.document.body : Browser.document.body)
			.addEventListener('keyup', function(e){
				function onKeyDown(key){
					if (keys[key]){
						keys[key] = false;
						socket.emit('key', key, keys[key]);
					}
				}
				switch(e.keyCode){
					case 37: onKeyDown('left');
					case 38: onKeyDown('up');
					case 39: onKeyDown('right');
				}
			}); 
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
