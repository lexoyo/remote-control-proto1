(function () { "use strict";
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var IMap = function() { };
IMap.__name__ = true;
Math.__name__ = true;
var Player = function(game) {
	this.game = game;
	this.keys = new haxe.ds.StringMap();
	this.keys.set("left",false);
	this.keys.set("right",false);
	this.keys.set("up",false);
	this.create();
};
Player.__name__ = true;
Player.prototype = {
	create: function() {
		this.sprite = this.game.add.sprite(32,this.game.world.height / 2 - 150,"dude");
		this.game.physics.arcade.enable(this.sprite);
		this.sprite.body.gravity.y = 300;
		this.sprite.body.collideWorldBounds = true;
		this.sprite.animations.add("left",[0,1,2,3],10,true);
		this.sprite.animations.add("right",[5,6,7,8],10,true);
	}
	,update: function(platforms) {
		this.game.physics.arcade.collide(this.sprite,platforms);
		this.sprite.body.velocity.x = 0;
		if(this.keys.get("left")) {
			this.sprite.body.velocity.x = -150;
			this.sprite.animations.play("left");
		} else if(this.keys.get("right")) {
			this.sprite.body.velocity.x = 150;
			this.sprite.body.y += -.5;
			this.sprite.animations.play("right");
		} else {
			this.sprite.animations.stop();
			this.sprite.frame = 4;
		}
		if(this.keys.get("up") && this.sprite.body.touching.down) this.sprite.body.velocity.y = -200;
	}
	,dispose: function() {
		this.sprite.destroy(true);
	}
};
var ScreenApp = function() {
	var _g = this;
	this.game = new Phaser.Game(800,600,Phaser.AUTO,"",{ preload : $bind(this,this.preload), create : $bind(this,this.create), update : $bind(this,this.update)});
	this.players = new haxe.ds.StringMap();
	this.socket = io();
	haxe.Timer.delay(function() {
	},2000);
	this.socket.on("key",function(id,key,isDown) {
		var player = _g.players.get(id);
		player.keys.set(key,isDown);
		_g.update();
	});
	this.socket.on("connection.close",function(id1) {
		haxe.Log.trace("close connection",{ fileName : "ScreenApp.hx", lineNumber : 43, className : "ScreenApp", methodName : "new", customParams : [id1]});
		var player1 = _g.players.get(id1);
		if(player1 != null) {
			_g.players.remove(id1);
			player1.dispose();
		}
	});
	this.socket.on("connection.open",function(id2,type) {
		haxe.Log.trace("new connection",{ fileName : "ScreenApp.hx", lineNumber : 51, className : "ScreenApp", methodName : "new", customParams : [id2,type]});
		var player2 = _g.players.get(id2);
		if(player2 == null) {
			player2 = new Player(_g.game);
			_g.players.set(id2,player2);
		}
		player2.sprite.animations.add("right",[5,6,7,8],10,true);
	});
};
ScreenApp.__name__ = true;
ScreenApp.main = function() {
	new ScreenApp();
};
ScreenApp.prototype = {
	preload: function() {
		this.game.load.image("background","assets/misc/starfield.jpg");
		this.game.load.image("ground","assets/tilemaps/tiles/ground_1x1.png");
		this.game.load.spritesheet("dude","assets/games/starstruck/dude.png",32,48);
	}
	,create: function() {
		var worldWidth = 4000;
		var worldHeight = 4000;
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.world.setBounds(0,0,worldWidth,worldHeight);
		this.game.add.tileSprite(0,0,worldWidth,worldHeight,"background",0);
		this.platforms = this.game.add.group();
		this.platforms.enableBody = true;
		var w = 32;
		var deltaY = 0;
		var _g = 0;
		while(_g < 100) {
			var i = _g++;
			var ground = this.platforms.create(i * w,deltaY + this.game.world.height / 2 - w,"ground");
			deltaY += Math.round((Math.random() - .5) * 100);
			ground.body.immovable = true;
		}
	}
	,update: function() {
		var numMoving = 0;
		var sumX = 0;
		var sumY = 0;
		var $it0 = this.players.iterator();
		while( $it0.hasNext() ) {
			var player = $it0.next();
			player.update(this.platforms);
			if(player.sprite.body.velocity.x) {
				numMoving++;
				sumX += player.sprite.x;
				sumY += player.sprite.y;
			}
		}
		if(numMoving > 0) {
			haxe.Log.trace("moving",{ fileName : "ScreenApp.hx", lineNumber : 109, className : "ScreenApp", methodName : "update", customParams : [numMoving,Math.round(sumX / numMoving)]});
			this.game.camera.x = Math.round(sumX / numMoving) - 400;
			this.game.camera.y = Math.round(sumY / numMoving) - 300;
		}
	}
};
var haxe = {};
haxe.Log = function() { };
haxe.Log.__name__ = true;
haxe.Log.trace = function(v,infos) {
	js.Boot.__trace(v,infos);
};
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = true;
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe.Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
};
haxe.ds = {};
haxe.ds.StringMap = function() {
	this.h = { };
};
haxe.ds.StringMap.__name__ = true;
haxe.ds.StringMap.__interfaces__ = [IMap];
haxe.ds.StringMap.prototype = {
	set: function(key,value) {
		this.h["$" + key] = value;
	}
	,get: function(key) {
		return this.h["$" + key];
	}
	,remove: function(key) {
		key = "$" + key;
		if(!this.h.hasOwnProperty(key)) return false;
		delete(this.h[key]);
		return true;
	}
	,keys: function() {
		var a = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) a.push(key.substr(1));
		}
		return HxOverrides.iter(a);
	}
	,iterator: function() {
		return { ref : this.h, it : this.keys(), hasNext : function() {
			return this.it.hasNext();
		}, next : function() {
			var i = this.it.next();
			return this.ref["$" + i];
		}};
	}
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = true;
js.Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js.Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js.Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js.Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js.Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
};
String.__name__ = true;
Array.__name__ = true;
ScreenApp.main();
})();

//# sourceMappingURL=screen.js.map