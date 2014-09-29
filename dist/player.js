(function () { "use strict";
var IMap = function() { };
IMap.__name__ = true;
var PlayerApp = function() {
	var _g = this;
	this.socket = io();
	haxe.Timer.delay(function() {
		_g.socket.emit("init","screen");
	},2000);
	this.socket.on("key",function(id,key,isDown) {
		haxe.Log.trace("key",{ fileName : "PlayerApp.hx", lineNumber : 36, className : "PlayerApp", methodName : "new", customParams : [id,key,isDown]});
	});
	this.socket.on("connection.close",function(id1) {
		haxe.Log.trace("close connection",{ fileName : "PlayerApp.hx", lineNumber : 40, className : "PlayerApp", methodName : "new", customParams : [id1]});
	});
	this.socket.on("connection.open",function(id2,type) {
		haxe.Log.trace("new connection",{ fileName : "PlayerApp.hx", lineNumber : 43, className : "PlayerApp", methodName : "new", customParams : [id2,type]});
	});
	this.keys = new haxe.ds.StringMap();
	this.keys.set("left",false);
	false;
	this.keys.set("right",false);
	false;
	this.keys.set("up",false);
	false;
	window.addEventListener("load",$bind(this,this.onLoad));
};
PlayerApp.__name__ = true;
PlayerApp.main = function() {
	new PlayerApp();
};
PlayerApp.prototype = {
	onLoad: function(e) {
		var _g = this;
		var checkKey = function(key) {
			haxe.Log.trace("check",{ fileName : "PlayerApp.hx", lineNumber : 53, className : "PlayerApp", methodName : "onLoad", customParams : [key,window.document.querySelector("." + key)]});
			haxe.Log.trace(window.document.getElementsByClassName(key),{ fileName : "PlayerApp.hx", lineNumber : 54, className : "PlayerApp", methodName : "onLoad"});
			var onMouseDown = function(e1) {
				if(!_g.keys.get(key)) {
					_g.keys.set(key,true);
					true;
					_g.socket.emit("key",key,_g.keys.get(key));
				}
			};
			var onMouseUp = function(e2) {
				if(_g.keys.get(key)) {
					_g.keys.set(key,false);
					false;
					_g.socket.emit("key",key,_g.keys.get(key));
				}
			};
			window.document.getElementsByClassName(key)[0].addEventListener("mousedown",onMouseDown);
			window.document.getElementsByClassName(key)[0].addEventListener("mouseup",onMouseUp);
		};
		checkKey("left");
		checkKey("right");
		checkKey("up");
		(window.top.document.body != null?window.top.document.body:window.document.body).addEventListener("keydown",function(e3) {
			var onKeyDown = function(key1) {
				if(!_g.keys.get(key1)) {
					_g.keys.set(key1,true);
					true;
					_g.socket.emit("key",key1,_g.keys.get(key1));
				}
			};
			var _g1 = e3.keyCode;
			switch(_g1) {
			case 37:
				onKeyDown("left");
				break;
			case 38:
				onKeyDown("up");
				break;
			case 39:
				onKeyDown("right");
				break;
			}
		});
		(window.top.document.body != null?window.top.document.body:window.document.body).addEventListener("keyup",function(e4) {
			var onKeyDown1 = function(key2) {
				if(_g.keys.get(key2)) {
					_g.keys.set(key2,false);
					false;
					_g.socket.emit("key",key2,_g.keys.get(key2));
				}
			};
			var _g2 = e4.keyCode;
			switch(_g2) {
			case 37:
				onKeyDown1("left");
				break;
			case 38:
				onKeyDown1("up");
				break;
			case 39:
				onKeyDown1("right");
				break;
			}
		});
	}
	,update: function() {
		var _g = this;
		var checkKey = function(key) {
			var isDown = Reflect.field(_g.cursors,key) != null && Reflect.field(_g.cursors,key).isDown;
			if(isDown != _g.keys.get(key)) {
				_g.keys.set(key,isDown);
				isDown;
				_g.socket.emit("key",key,_g.keys.get(key));
				haxe.Log.trace("isdown",{ fileName : "PlayerApp.hx", lineNumber : 115, className : "PlayerApp", methodName : "update", customParams : [isDown]});
			}
		};
		checkKey("left");
		checkKey("right");
		checkKey("up");
	}
};
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
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
String.__name__ = true;
Array.__name__ = true;
PlayerApp.main();
})();

//# sourceMappingURL=player.js.map