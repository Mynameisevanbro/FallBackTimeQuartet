// varables
var canvas_width;
var canvas_height;
var s = {
	// main + screen
	"run": false,
	"loaded": false,
	"x_shake": 0,
	"y_shake": 0,
	"animation": [],
	// player
	"x": 0,
	"y": 0,
	"w": 0,
	"h": 0,
	"s": 0,  // speed
	"a": 360,  // angle
	"m": "red",  // mode
	"hp": 92, // health
	"hidden": false,
	"pulse": false,
	"pulse_m": 0,  // magnitude
	"gravity": "down",
	"force": 0,
	"lock": false,  // can move?
	// (all) sans
	"sans_size": 1,  // number multiplied by original file size
	"sans_formation": 0,  // positions: 0-3 = single; 4 = all
	"sans_hidden": [1, 1, 1, 1],  // 0 = hidden; 1 = shown (in order from left to right)
	// error sans
	"sans0_hidden": true,  
	// last breath
	"sans1_x": 0,
	"sans1_y": 0,
	"sans1_w": 0,
	"sans1_hidden": false,
	"sans1_animation": "still",
	"sans1_animation_x": 0,
	"sans1_animation_x_direction": "left",
	"sans1_animation_y": 0,
	"sans1_animation_y_direction": "up",
	"sans1_head": "sans1_head",
	// attacks
	"sans1_bone": [],
	// controls
	"left": false,
	"left_enabled": false,
	"right": false,
	"right_enabled": false,
	"up": false,
	"up_enabled": false,
	"down": false,
	"down_enabled": false,
	// FPS
	"frame": 0,
	"timeframe": [],
	"fps_set": 60,
	"fps": 0,
	"fps_avg_arrary": [9999999],
	"fps_avg": 0,
	"timeout": 20,
}
var box = {
	"preset": "square",
	"hidden": false,
	"bottom": 0,
	"x": 0,
	"y": 0,
	"w": 0,
	"h": 0,
	"line_w" : 0,
	"hlw": 0,  // half line width
	"c": "white",
}
var texture = {
	// options data
	"opt_hidden": false,
	"opt_xm": 0,  // x multiplier
	"opt_y": 0,
	"opt_w": 0,
	"opt_xo": 0,  // x offset
	"opt_h": 0,
}
var audio = {
	"impact": [],
	"impact_len": 700,
	"impact_channel": [0, 0, 0, 0, 0],
	"theme0": null,
	"theme0_len": 30000,
	"theme0_channel": [0],
}
var command = []


// system
function current_time() {
	return +new Date()
}


function manage_fps(){
	// set frames
	s["frame"] ++;
	s["timeframe"].push(current_time());
	s["fps"] = s["timeframe"].length;
	// fps average
	s["fps_avg_arrary"].push(s["fps"])
	if (s["fps_avg_arrary"].length > s["fps_set"] * 2) {
		s["fps_avg_arrary"].shift();
	}
	s["fps_avg"] = Math.round(s["fps_avg_arrary"].reduce((a, b) => a + b, 0) / (s["fps_set"] * 2));
	// remove old time frames
	let timeframe_range = s["timeframe"].at(-1) - s["timeframe"][0];
	while (timeframe_range >= 1000) {
		s["timeframe"].shift();
		timeframe_range = s["timeframe"].at(-1) - s["timeframe"][0];
	}
	// adjust frame rate timeout
	if (s["fps"] > s["fps_set"] * 2) {
		s["timeout"] += 0.1;
	}else if (s["fps"] > s["fps_set"]) {
		s["timeout"] += 0.05;
	} else if (s["fps"] < s["fps_set"]) {
		s["timeout"] -= 0.05;
	}
}


function manage_audio(file, volume=1) {
	let played = false
	// audio is playing?
	for (let i = 0; i < audio[`${file}_channel`].length; i ++) {
		// is audio playing?
		if (audio[`${file}_channel`][i] != 0) {
			// has audio finished playing?
			if (current_time() - audio[`${file}_channel`][i] >= audio[`${file}_len`]) {
				// reset audio channel
				audio[`${file}_channel`][i] = 0
			}
		}
	}
	// play audio
	for (let i = 0; i < audio[`${file}_channel`].length; i ++) {
		// is audio channel available?
		if (audio[`${file}_channel`][i] == 0) {
			// play audio
			audio[file][i].volume = volume
			audio[file][i].play()
			played = true
			// set channel as busy
			audio[`${file}_channel`][i] = current_time()
			break
		}
	}
	// error log
	if (played == false) {
		console.log("Audio Error: Not enough channels")
	}
}


// GUI
function canvas_text(text, pos, size, color, font, alignment="center", opacity=1) {
	// define canvas
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");
	// draw title
	ctx.globalAlpha = opacity
	ctx.font = `${size}px ${font}`;
	ctx.textAlign = alignment;
	ctx.fillStyle = color;
	ctx.fillText(text, pos[0], pos[1]);
	ctx.globalAlpha = 1
}


function canvas_rect(rect, color) {
	// define canvas
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");
	// draw title
	ctx.fillStyle = color;
	ctx.fillRect(rect[0], rect[1], rect[2], rect[3]);
}


function canvas_img(image, rect, angle=0, opacity=1) {
	// define canvas
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");
	// draw image
	ctx.translate(rect[0] + rect[2] / 2, rect[1] + rect[3] / 2)
	ctx.rotate(angle * Math.PI / 180)
	ctx.globalAlpha = opacity
	try {
		ctx.drawImage(image, -(rect[2] / 2), -(rect[3] / 2), rect[2], rect[3]);
	} catch {
		canvas_rect(rect, "red")
	}
	ctx.rotate(-angle * Math.PI / 180)
	ctx.translate(-(rect[0] + rect[2] / 2), -(rect[1] + rect[3] / 2))
	ctx.globalAlpha = 1
	
}


function canvas_line(x1, y1, x2, y2, color, width=1) {
	// define canvas
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");
	// draw line
	ctx.strokeStyle = color
	ctx.beginPath(); 
	ctx.moveTo(x1, y1);
	ctx.lineWidth = width;
	ctx.lineTo(x2, y2);
	ctx.stroke();	
}


// game functions
function manage_box() {
	// box color
	if (box["hidden"]) {
		box["c"] = "black";
	} else {
		box["c"] = "white";
	}
	// draw box
	box["hlw"] = box["line_w"] / 2  // half line width
	canvas_rect([box["x"] - box["hlw"] + s["x_shake"], box["y"] - box["hlw"] + s["y_shake"], box["line_w"], box["h"]], box["c"]);
	canvas_rect([box["x"] - box["hlw"] + box["line_w"] + s["x_shake"], box["y"] - box["hlw"] + s["y_shake"], box["w"], box["line_w"]], box["c"]);
	canvas_rect([box["x"] - box["hlw"] + box["w"] + s["x_shake"], box["y"] - box["hlw"] + box["line_w"] + s["y_shake"], box["line_w"], box["h"]], box["c"]);
	canvas_rect([box["x"] - box["hlw"] + s["x_shake"], box["y"] - box["hlw"] + box["h"] + s["y_shake"], box["w"], box["line_w"]], box["c"]);
	// update dimensions
	let w_tar = box["w"]
	let h_tar = box["h"]
	let x_tar = box["x"]
	let y_tar = box["y"]
	if (box["preset"] == "square") {
		// calculate target values
		w_tar = canvas_width / 3.5
		h_tar = w_tar
		x_tar = (canvas_width / 2) - (w_tar / 2)
		y_tar = box["bottom"] - h_tar
	} else if (box["preset"] == "rectangle") {
		// calculate target values
		w_tar = canvas_width / 1.5
		h_tar = (canvas_width / 3.5) / 1.2
		x_tar = (canvas_width / 2) - (w_tar / 2)
		y_tar = box["bottom"] - h_tar
	}
	// apply dimensions
	let x_diff = Math.abs(box["x"] - x_tar) / 4
	if (box["x"] > x_tar) {
		box["x"] -= x_diff
	} else if (box["h"] < x_tar) {
		box["x"] += x_diff
	}
	let y_diff = Math.abs(box["y"] - y_tar) / 4
	if (box["y"] > y_tar) {
		box["y"] -= y_diff
	} else if (box["h"] < y_tar) {
		box["y"] += y_diff
	}
	let w_diff = Math.abs(box["w"] - w_tar) / 4
	if (box["w"] > w_tar) {
		box["w"] -= w_diff
	} else if (box["w"] < w_tar) {
		box["w"] += w_diff
	}
	let h_diff = Math.abs(box["h"] - h_tar) / 4
	if (box["h"] > h_tar) {
		box["h"] -= h_diff
	} else if (box["h"] < h_tar) {
		box["h"] += h_diff
	}
	// fix jittering
	if (Math.abs(x_tar - box["x"]) < 2) {
		box["x"] = x_tar
	}
	if (Math.abs(y_tar - box["y"]) < 2) {
		box["y"] = y_tar
	}
	if (Math.abs(w_tar - box["w"]) < 2) {
		box["w"] = w_tar
	}
	if (Math.abs(w_tar - box["h"]) < 2) {
		box["h"] = w_tar
	}
}


function manage_command() {
	// output console commands
	let con = document.getElementById("console")
	con.innerHTML = ""
	for (let i = 0;i < command.length; i ++) {
		if (command[i]["name"] == "wait") {
			con.innerHTML += `wait.${command[i]["until"]}.${command[i]["time"]}\n`
		}
		if (command[i]["name"] == "position") {
			con.innerHTML += `position.${command[i]["preset_name"]}.${command[i]["x"]}.${command[i]["y"]}\n`
		}
		if (command[i]["name"] == "box") {
			con.innerHTML += `box.${command[i]["preset"]}.${command[i]["hidden"]}\n`
		}
		if (command[i]["name"] == "soul") {
			con.innerHTML += `soul.${command[i]["mode"]}.${command[i]["gravity"]}\n`
		}
		if (command[i]["name"] == "audio") {
			con.innerHTML += `audio.${command[i]["file"]}\n`
		}
		if (command[i]["name"] == "animate") {
			con.innerHTML += `animate.${command[i]["preset"]}\n`
		}
		if (command[i]["name"] == "sans") {
			con.innerHTML += `sans.id${command[i]["id"]}.${command[i]["hidden"]}\n`
		}
		if (command[i]["name"] == "option") {
			con.innerHTML += `option.${command[i]["hidden"]}\n`
		}
		if (command[i]["name"] == "attack_bone") {
			con.innerHTML += `bone attack\n`
		}
		// prevent lag by limiting number of commands shown
		if (i >= 9) {
			con.innerHTML += `+ ${command.length} commands`
			break
		}
	}
	// run through & execute commands
	for (let i = 0; i < command.length; i ++) {
		// execute commands
		try {
			if (command[0]["name"] == "wait") {
				// wait type load (wait until program fully loads)
				if (command[0]["until"] == "load") {
					// detect if loaded, if not loaded, wait
					if (s["fps_avg"] <= s["fps_set"]) {
						// finish task
						command.shift()
					} else {
						break
					}
				// wait type time (wait until time is up)
				} else if (command[0]["until"] == "time") {
					// detect if loaded, if not loaded, wait
					if (command[0]["time"] <= 0) {
						// finish task
						command.shift()
					} else {
						command[0]["time"] -= 1
						break
					}
				}
			} else if (command[0]["name"] == "position") {
				// position preset
				if (command[0]["preset"] == true) {
					// center
					if (command[0]["preset_name"] == "center") {
						s["x"] = box["x"] + (box["w"] / 2) - (s["w"] / 2);
						s["y"] = box["y"] + (box["h"] / 2) - (s["h"] / 2);
					}
				}
				// finish task
				command.shift();
			} else if (command[0]["name"] == "box") {
				// apply values
				box["preset"] = command[0]["preset"];
				box["hidden"] = command[0]["hidden"];
				// finish task
				command.shift();
			} else if (command[0]["name"] == "soul") {
				// apply values
				s["m"] = command[0]["mode"];
				s["gravity"] = command[0]["gravity"];
				s["force"] = command[0]["force"] * s["s"];
				s["pulse"] = command[0]["pulse"];
				s["hidden"] = command[0]["hidden"];
				// reset gravity
				s["up_enabled"] = false;
				s["down_enabled"] = false;
				// animate
				if (s["m"] == "blue") {
					s["sans1_animation_x"] = 0;
					s["sans1_animation_y"] = 0;
					if (s["gravity"] == "left" || s["gravity"] == "right") {
						s["sans1_animation"] = "side";
					} else if (s["gravity"] == "up") {
						s["sans1_animation"] = "up";
					} else if (s["gravity"] == "down") {
						s["sans1_animation"] = "down";
					}
				}
				// finish task
				command.shift();
			} else if (command[0]["name"] == "audio") {
				// play audio
				audio[command[0]["file"]].play();
				// finish task
				command.shift();
			} else if (command[0]["name"] == "animate") {
				// push animation
				obj = {
					"name": command[0]["preset"],
					"frame": 0,
				}
				s["animation"].push(obj);
				// finish task
				command.shift();
			} else if (command[0]["name"] == "sans") {
				// hidden?
				let output = 0;
				if (command[0]["hidden"]) {
					output = 1;
				}
				s["sans_hidden"][command[0]["id"]] = output;
				// apply head texture
				s[`sans${command[0]["id"]}_head`] = command[0]["head"];
				// finish task
				command.shift();
			}
			else if (command[0]["name"] == "option") {
				// apply values
				texture["opt_hidden"] = command[0]["hidden"];
				// finish task
				command.shift();
			}
			else if (command[0]["name"] == "attack_bone") {
				// add preset bones
				if (command[0]["preset"] == "test") {
					obj = {
						"x": box["x"],
						"y": box["y"] + (box["h"] / 2),
						"a": 0,
						"w": canvas_width / 90,
						"h": box["h"],
						"vx": 0.5,  // velocity x
						"vy": 0,  // velocity y
					}
					s["sans1_bone"].push(obj)
				} else if (command[0]["preset"] == "intro") {
					for (let i = 0; i < 40; i ++) {
						// left
						obj = {
							"x": box["x"] + (box["w"] / 9),
							"y": box["y"] - (i * 60),
							"a": 0,
							"w": canvas_width / 90,
							"h": box["h"] / 6,
							"vx": 0,  // velocity x
							"vy": s["s"],  // velocity y
						}
						s["sans1_bone"].push(obj)
						// right
						obj = {
							"x": box["x"] + box["w"] - (box["h"] / 9),
							"y": box["y"] + box["h"] + (i * 60),
							"a": 0,
							"w": canvas_width / 90,
							"h": box["h"] / 6,
							"vx": 0,  // velocity x
							"vy": -s["s"],  // velocity y
						}
						s["sans1_bone"].push(obj)
						// top
						obj = {
							"x": box["x"] + box["h"] + (i * 60),
							"y": box["y"] + (box["h"] / 9),
							"a": 90,
							"w": canvas_width / 90,
							"h": box["h"] / 6,
							"vx": -s["s"],  // velocity x
							"vy": 0,  // velocity y
						}
						s["sans1_bone"].push(obj)
						// bottom
						obj = {
							"x": box["x"] - (i * 60),
							"y": box["y"] + box["h"] - (box["h"] / 9),
							"a": 90,
							"w": canvas_width / 90,
							"h": box["h"] / 6,
							"vx": s["s"],  // velocity x
							"vy": 0,  // velocity y
						}
						s["sans1_bone"].push(obj)
					}
				}
				// finish task
				command.shift();
			}
		} catch {

		}
	}
}


function manage_movement() {
	if (s["m"] == "red") {
		// angle
		let diff = Math.abs(s["a"])
		if (s["a"] > 0) {
			s["a"] -= diff / 10
		}
		// movement
		if (s["left"]) {
			s["x"] -= s["s"];
		}
		if (s["right"]) {
			s["x"] += s["s"];
		}
		if (s["up"]) {
			s["y"] -= s["s"];
		}
		if (s["down"]) {
			s["y"] += s["s"];
		}
	} else if (s["m"] == "blue") {
		// gravity down
		if (s["gravity"] == "down") {
			// angle
			let diff = Math.abs(s["a"])
			if (s["a"] > 0) {
				s["a"] -= diff / 10
			}
			if (s["a"] < 0) {
				s["a"] += diff / 10
			}
			if (Math.abs(s["a"]) < 5) {
				s["a"] = 0
			}
			// force
			s["force"] *= 1.05
			if (s["left"]) {
				s["x"] -= s["s"];
			}
			if (s["right"]) {
				s["x"] += s["s"];
			}
			s["y"] += s["force"]
			if (s["down_enabled"]) {
				if (s["up"]) {
					s["y"] -= s["s"] * 2;
				} else {
					s["down_enabled"] = false
				}
			}
		}
		// gravity up
		if (s["gravity"] == "up") {
			// angle
			let diff = Math.abs(s["a"] - 180)
			if (s["a"] > 180) {
				s["a"] -= diff / 10
			}
			if (s["a"] < 180) {
				s["a"] += diff / 10
			}
			if (Math.abs(s["a"] - 180) < 5) {
				s["a"] = 180
			}
			// force
			s["force"] *= 1.05
			if (s["left"]) {
				s["x"] -= s["s"];
			}
			if (s["right"]) {
				s["x"] += s["s"];
			}
			s["y"] -= s["force"]
			if (s["up_enabled"]) {
				if (s["down"]) {
					s["y"] += s["s"] * 2;
				} else {
					s["up_enabled"] = false
				}
			}
		}
		// gravity left
		if (s["gravity"] == "left") {
			// angle
			let diff = Math.abs(s["a"] - 90)
			if (s["a"] > 90) {
				s["a"] -= diff / 10
			}
			if (s["a"] < 90) {
				s["a"] += diff / 10
			}
			if (Math.abs(s["a"] - 90) < 5) {
				s["a"] = 90
			}
			// force
			s["force"] *= 1.05
			if (s["up"]) {
				s["y"] -= s["s"];
			}
			if (s["down"]) {
				s["y"] += s["s"];
			}
			s["x"] -= s["force"]
			if (s["left_enabled"]) {
				if (s["right"]) {
					s["x"] += s["s"] * 2;
				} else {
					s["left_enabled"] = false
				}
			}
		}
		// gravity right
		if (s["gravity"] == "right") {
			// angle
			let diff = Math.abs(s["a"] - 270)
			if (s["a"] > 270) {
				s["a"] -= diff / 10
			}
			if (s["a"] < 270) {
				s["a"] += diff / 10
			}
			if (Math.abs(s["a"] - 270) < 5) {
				s["a"] = 270
			}
			// force
			s["force"] *= 1.05
			if (s["up"]) {
				s["y"] -= s["s"];
			}
			if (s["down"]) {
				s["y"] += s["s"];
			}
			s["x"] += s["force"]
			if (s["right_enabled"]) {
				if (s["left"]) {
					s["x"] -= s["s"] * 2;
				} else {
					s["right_enabled"] = false
				}
			}
		}
	}
}


function manage_animation() {
	// output console animation commands
	let con = document.getElementById("console_animation");
	con.innerHTML = "";
	let percent = 0;
	for (let i = 0; i < s["animation"].length; i ++) {
		if (s["animation"][i]["name"] == "title") {
			percent = Math.round(s["animation"][i]["frame"] * 50)
			con.innerHTML += `${percent}% - title\n`
		} else if (s["animation"][i]["name"] == "title_phase1") {
			percent = Math.round(s["animation"][i]["frame"] * 16.6)
			con.innerHTML += `${percent}% - title_phase1\n`
		} else if (s["animation"][i]["name"] == "box_down") {
			percent = Math.round(s["animation"][i]["frame"] * 100)
			con.innerHTML += `${percent}% - box_down\n`
		} else if (s["animation"][i]["name"] == "sans_intro") {
				percent = Math.round(s["animation"][i]["frame"] * 5.78)
				con.innerHTML += `${percent}% - sans_intro\n`
		}
	}
	// execute animations
	for (let i = 0; i < s["animation"].length; i ++) {
		if (s["animation"][i]["name"] == "title") {
			// animate
			s["animation"][i]["frame"] += 0.01;
			// define positions
			let y = canvas_height / 2;
			let w = canvas_width / 2;
			let x = (canvas_width / 2) - (w / 2);
			let h = (w * 53) / 170;
			// fade in
			if (s["animation"][i]["frame"] < 1) {
				canvas_img(texture["title"], [x, y, w, h], 0, s["animation"][i]["frame"]);
			// fade out
			} else if (s["animation"][i]["frame"] < 2){
				canvas_img(texture["title"], [x, y, w, h], 0, 2 - s["animation"][i]["frame"]);
			// end animation
			} else if (s["animation"][i]["frame"] > 2){
				s["animation"].splice(i, 1)
			}
		// title phase 1
		} else if (s["animation"][i]["name"] == "title_phase1") {
			// animate
			s["animation"][i]["frame"] += 0.01;
			// define positions
			let y0 = canvas_height / 2;
			let y1 = (canvas_height / 2) - (canvas_height / 10);
			let w = canvas_width / 2;
			let x = (canvas_width / 2) - (w / 2);
			let h = (w * 53) / 170;
			// fade in
			if (s["animation"][i]["frame"] < 1) {
				canvas_img(texture["title"], [x, y0, w, h], 0, s["animation"][i]["frame"]);
			// go up
			} else if (s["animation"][i]["frame"] < 2){
				let dist = (y1 - y0) * (s["animation"][i]["frame"] - 1)
				canvas_img(texture["title"], [x, y0 + dist, w, h]);
			// phase 1 message fade in
			} else if (s["animation"][i]["frame"] < 5){
				// draw phase 1 text
				let y_text = (canvas_height / 1.5)
				canvas_text("-=[Phase 1]=-", [w, y_text], 30, "red", "sans-serif", "center",
					s["animation"][i]["frame"] - 2);
				// draw title image
				canvas_img(texture["title"], [x, y1, w, h]);
			// draw sub text
			} else if (s["animation"][i]["frame"] < 6){
				// draw phase 1 text
				let y_text = (canvas_height / 1.5)
				canvas_text("-=[Phase 1]=-", [w, y_text], 30, "red", "sans-serif", "center");
				// draw subtext
				y_text = (canvas_height / 1.4)
				canvas_text("Slackers Nevermore", [w, y_text], 20, "white", "sans-serif", "center",
					s["animation"][i]["frame"] - 5);
				// draw title image
				canvas_img(texture["title"], [x, y1, w, h]);
			// end animation
			} else if (s["animation"][i]["frame"] > 6){
				s["animation"].splice(i, 1)
			}
		} else if (s["animation"][i]["name"] == "box_down") {
			// animate
			s["animation"][i]["frame"] += 0.005;
			box["preset"] = "custom";
			// calculate target values
			let dist = box["bottom"] - (canvas_height / 2);
			let w = s["w"] + s["w"] / 5;
			let h = s["h"] + s["w"] / 5;
			let x = (canvas_width / 2) - (w / 2);
			let y = (canvas_height / 2) + (dist * s["animation"][i]["frame"]);
			// apply animation
			box["w"] = w;
			box["h"] = h;
			box["x"] = x;
			box["y"] = y;
			// end animation
			if (s["animation"][i]["frame"] > 1) {
				s["animation"].splice(i, 1);
			}
		} else if (s["animation"][i]["name"] == "sans_intro") {
			// animate
			s["animation"][i]["frame"] += 0.01;
			// draw sans
			let w = s["sans_size"] * 49
			let h = s["sans_size"] * 75
			let sans0_x = (canvas_width / 2) - (w * 2)
			let sans1_x = (canvas_width / 2) - w
			let sans2_x = canvas_width / 2
			let sans3_x = (canvas_width / 2) + w
			let y = canvas_height / 40
			if (s["animation"][i]["frame"] < 1) {
				// sans1 (last breath) fade in
				canvas_img(texture["sans1_still"], [sans1_x, y, w, h], 0, s["animation"][i]["frame"]);
			} else if (s["animation"][i]["frame"] < 2) {
				// sans1 (last breath) fade out
				canvas_img(texture["sans1_still"], [sans1_x, y, w, h], 0, 2 - s["animation"][i]["frame"]);
				s["animation"][i]["frame"] += 0.01;
			} else if (s["animation"][i]["frame"] < 3) {
				// sans2 (slacker) fade in
				canvas_img(texture["sans1_still"], [sans2_x, y, w, h], 0, s["animation"][i]["frame"] - 2);
			} else if (s["animation"][i]["frame"] < 4) {
				// sans2 (slacker) fade out
				canvas_img(texture["sans1_still"], [sans2_x, y, w, h], 0, 4 - s["animation"][i]["frame"]);
				s["animation"][i]["frame"] += 0.008;
			} else if (s["animation"][i]["frame"] < 5) {
				// sans0 (error) fade in
				canvas_img(texture["sans1_still"], [sans0_x, y, w, h], 0, s["animation"][i]["frame"] - 4);
			} else if (s["animation"][i]["frame"] < 6) {
				// sans0 (error) fade out
				canvas_img(texture["sans1_still"], [sans0_x, y, w, h], 0, 6 - s["animation"][i]["frame"]);
				s["animation"][i]["frame"] += 0.02;
			} else if (s["animation"][i]["frame"] < 7) {
				// sans3 (sudden changes) fade in
				canvas_img(texture["sans1_still"], [sans3_x, y, w, h], 0, s["animation"][i]["frame"] - 6);
			} else if (s["animation"][i]["frame"] < 8) {
				// sans3 (sudden changes) fade out
				canvas_img(texture["sans1_still"], [sans3_x, y, w, h], 0, 8 - s["animation"][i]["frame"]);
				s["animation"][i]["frame"] += 0.01;
			} else if (s["animation"][i]["frame"] < 9) {
				// all sans fade in
				canvas_img(texture["sans1_still"], [sans0_x, y, w, h], 0, s["animation"][i]["frame"] - 8);
				canvas_img(texture["sans1_still"], [sans1_x, y, w, h], 0, s["animation"][i]["frame"] - 8);
				canvas_img(texture["sans1_still"], [sans2_x, y, w, h], 0, s["animation"][i]["frame"] - 8);
				canvas_img(texture["sans1_still"], [sans3_x, y, w, h], 0, s["animation"][i]["frame"] - 8);
			} else if (s["animation"][i]["frame"] < 17.3) {
				// all sans
				canvas_img(texture["sans1_still"], [sans0_x, y, w, h]);
				canvas_img(texture["sans1_still"], [sans1_x, y, w, h]);
				canvas_img(texture["sans1_still"], [sans2_x, y, w, h]);
				canvas_img(texture["sans1_still"], [sans3_x, y, w, h]);
			} else if (s["animation"][i]["frame"] > 17.3) {
				// draw last frame
				canvas_img(texture["sans1_still"], [sans0_x, y, w, h]);
				canvas_img(texture["sans1_still"], [sans1_x, y, w, h]);
				canvas_img(texture["sans1_still"], [sans2_x, y, w, h]);
				canvas_img(texture["sans1_still"], [sans3_x, y, w, h]);
				// end animation
				s["animation"].splice(i, 1)
			}
		// sans 2 (slackertale) intro
		} else if (s["animation"][i]["name"] == "sans2_intro") {
			// animate
			s["animation"][i]["frame"] += 0.01;
			// draw sans
			let w = canvas_width / 6.3
			let h = (w * 75) / 49
			let x = canvas_width / 2
			let y = canvas_height / 40
			// fade in
			if (s["animation"][i]["frame"] < 1) {
				canvas_img(texture["sans1_still"], [x, y, w, h], 0, s["animation"][i]["frame"]);
			// end animation
			} else if (s["animation"][i]["frame"] > 1) {
				s["animation"].splice(i, 1)
				s["sans2_hidden"] = false;
			}
		// sans 3 (sudden changes) intro
		} else if (s["animation"][i]["name"] == "sans3_intro") {
			// animate
			s["animation"][i]["frame"] += 0.01;
			// draw sans
			let w = canvas_width / 6.3
			let h = (w * 75) / 49
			let x = (canvas_width / 2) + w
			let y = canvas_height / 40
			// slide left to position
			if (s["animation"][i]["frame"] < 1) {
				canvas_img(texture["sans1_still"], [x, y, w, h], 0, s["animation"][i]["frame"]);
			// end animation
			} else if (s["animation"][i]["frame"] > 1) {
				s["animation"].splice(i, 1)
				s["sans3_hidden"] = false;
			}
		}
	}
}


function manage_sans() {
	// positions
	let w = 0;
	let h = 0;
	let x = (canvas_width / 2) - (w * 2);
	let y = canvas_height / 40;
	// formation
	if (s["sans_formation"] == 0) {
		s["sans1_x"] = (canvas_width / 2) - (s["sans_size"] * 24.5);
		s["sans1_y"] = canvas_height / 40;
		s["sans1_w"] = s["sans_size"] * 49;
	}
	// sans0 (error)
	if (s["sans_hidden"][0] == 0) {
		w = s["sans_size"] * 49
		canvas_img(texture["sans1_still"], [x + s["x_shake"], y + s["y_shake"], w, h]);
	}
	// draw sans1 (last breath)
	if (s["sans_hidden"][1] == 0) {
		if (s["sans1_animation"] == "still") {
			// legs
			w = s["sans_size"] * 36;
			h = s["sans_size"] * 20;
			x = (s["sans1_w"] / 2) - (w / 2);
			y = s["sans_size"] * 55;
			canvas_img(texture["sans1_legs"], [s["sans1_x"] + s["x_shake"] + x, s["sans1_y"] + s["y_shake"] + y, w, h]);
			// body
			w = s["sans1_w"];
			h = s["sans_size"] * 31;
			y = s["sans_size"] * 25;
			canvas_img(texture["sans1_torso"], [
				s["sans1_x"] + s["x_shake"] + s["sans1_animation_x"],
				s["sans1_y"] + s["y_shake"] + y + s["sans1_animation_y"],
				w, h]);
			// head
			w = s["sans_size"] * 31;
			h = s["sans_size"] * 31;
			x = (s["sans1_w"] / 2) - (w / 2);
			y = s["sans_size"] * 0.5;
			canvas_img(texture[s["sans1_head"]], [
					s["sans1_x"] + s["x_shake"] + x + s["sans1_animation_x"],
					s["sans1_y"] + s["y_shake"] + y + s["sans1_animation_x"],
					w, h]);
		} else if (s["sans1_animation"] == "idle") {
			// legs
			w = s["sans_size"] * 36;
			h = s["sans_size"] * 20;
			x = (s["sans1_w"] / 2) - (w / 2);
			y = s["sans_size"] * 55;
			canvas_img(texture["sans1_legs"], [s["sans1_x"] + s["x_shake"] + x, s["sans1_y"] + s["y_shake"] + y, w, h]);
			// animate body
			if (s["sans1_animation_x_direction"] == "left") {
				s["sans1_animation_x"] -= s["sans1_w"] / 1600;
				if (s["sans1_animation_x"] < -s["sans1_w"] / 80) {
					s["sans1_animation_x_direction"] = "right";
				}
			} else if (s["sans1_animation_x_direction"] == "right") {
				s["sans1_animation_x"] += s["sans1_w"] / 1600;
				if (s["sans1_animation_x"] > s["sans1_w"] / 80) {
					s["sans1_animation_x_direction"] = "left";
				}
			}
			if (s["sans1_animation_y_direction"] == "up") {
				s["sans1_animation_y"] -= s["sans1_w"] / 800;
				if (s["sans1_animation_y"] < -s["sans1_w"] / 80) {
					s["sans1_animation_y_direction"] = "down";
				}
			} else if (s["sans1_animation_y_direction"] == "down") {
				s["sans1_animation_y"] += s["sans1_w"] / 800;
				if (s["sans1_animation_y"] > s["sans1_w"] / 80) {
					s["sans1_animation_y_direction"] = "up";
				}
			}
			// body
			w = s["sans1_w"];
			h = s["sans_size"] * 31;
			y = s["sans_size"] * 25;
			canvas_img(texture["sans1_torso"], [
				s["sans1_x"] + s["x_shake"] + s["sans1_animation_x"],
				s["sans1_y"] + s["y_shake"] + y + s["sans1_animation_y"],
				w, h]);
			// head
			w = s["sans_size"] * 31;
			h = s["sans_size"] * 31;
			x = (s["sans1_w"] / 2) - (w / 2);
			y = s["sans_size"] * 0.5;
			canvas_img(texture[s["sans1_head"]], [
					s["sans1_x"] + s["x_shake"] + x + s["sans1_animation_x"],
					s["sans1_y"] + s["y_shake"] + y + s["sans1_animation_x"],
					w, h]);
		} else if (s["sans1_animation"] == "side") {
			// legs
			w = s["sans_size"] * 36;
			h = s["sans_size"] * 20;
			x = (s["sans1_w"] / 2) - (w / 2);
			y = s["sans_size"] * 55;
			canvas_img(texture["sans1_legs"], [s["sans1_x"] + s["x_shake"] + x, s["sans1_y"] + s["y_shake"] + y, w, h]);
			// body
			s["sans1_animation_x"] ++;
			if (s["sans1_animation_x"] < 4) {
				w = s["sans_size"] * 49;
				h = s["sans_size"] * 33;
				y = s["sans_size"] * 25;
				canvas_img(texture["sans1_torso_armh0"], [s["sans1_x"] + s["x_shake"], s["sans1_y"] + s["y_shake"] + y, w, h]);
			} else if (s["sans1_animation_x"] < 8) {
				w = s["sans_size"] * 69;
				h = s["sans_size"] * 33;
				y = s["sans_size"] * 25;
				canvas_img(texture["sans1_torso_armh1"], [s["sans1_x"] + s["x_shake"], s["sans1_y"] + s["y_shake"] + y, w, h]);
			} else if (s["sans1_animation_x"] < 38) {
				w = s["sans_size"] * 72;
				h = s["sans_size"] * 33;
				y = s["sans_size"] * 25;
				canvas_img(texture["sans1_torso_armh2"], [s["sans1_x"] + s["x_shake"], s["sans1_y"] + s["y_shake"] + y, w, h]);
			} else if (s["sans1_animation_x"] < 42) {
				w = s["sans_size"] * 69;
				h = s["sans_size"] * 33;
				y = s["sans_size"] * 25;
				canvas_img(texture["sans1_torso_armh1"], [s["sans1_x"] + s["x_shake"], s["sans1_y"] + s["y_shake"] + y, w, h]);
			} else if (s["sans1_animation_x"] < 46) {
				w = s["sans_size"] * 49;
				h = s["sans_size"] * 33;
				y = s["sans_size"] * 25;
				canvas_img(texture["sans1_torso_armh0"], [s["sans1_x"] + s["x_shake"], s["sans1_y"] + s["y_shake"] + y, w, h]);
			} else if (s["sans1_animation_x"] >= 46) {
				// draw last frame
				w = s["sans_size"] * 49;
				h = s["sans_size"] * 33;
				y = s["sans_size"] * 25;
				canvas_img(texture["sans1_torso_armh0"], [s["sans1_x"] + s["x_shake"], s["sans1_y"] + s["y_shake"] + y, w, h]);
				// change animation
				s["sans1_animation_x"] = 0;
				s["sans1_animation_y"] = 0;
				s["sans1_animation"] = "idle";
			} 
			// head
			w = s["sans_size"] * 31;
			h = s["sans_size"] * 31;
			x = (s["sans1_w"] / 2) - (w / 2);
			y = s["sans_size"] * 0.5;
			canvas_img(texture[s["sans1_head"]], [
					s["sans1_x"] + s["x_shake"] + x,
					s["sans1_y"] + s["y_shake"] + y,
					w, h]);
		} else if (s["sans1_animation"] == "up") {
			// legs
			w = s["sans_size"] * 36;
			h = s["sans_size"] * 20;
			x = (s["sans1_w"] / 2) - (w / 2);
			y = s["sans_size"] * 55;
			canvas_img(texture["sans1_legs"], [s["sans1_x"] + s["x_shake"] + x, s["sans1_y"] + s["y_shake"] + y, w, h]);
			// body
			s["sans1_animation_x"] ++;
			if (s["sans1_animation_x"] < 4) {
				w = s["sans_size"] * 56;
				h = s["sans_size"] * 35;
				y = s["sans_size"] * 25;
				canvas_img(texture["sans1_torso_armv0"], [s["sans1_x"] + s["x_shake"], s["sans1_y"] + s["y_shake"] + y, w, h]);
			} else if (s["sans1_animation_x"] < 8) {
				w = s["sans_size"] * 63;
				h = s["sans_size"] * 43;
				y = s["sans_size"] * 15;
				canvas_img(texture["sans1_torso_armv1"], [s["sans1_x"] + s["x_shake"], s["sans1_y"] + s["y_shake"] + y, w, h]);
			} else if (s["sans1_animation_x"] < 38) {
				w = s["sans_size"] * 61;
				h = s["sans_size"] * 43;
				y = s["sans_size"] * 15;
				canvas_img(texture["sans1_torso_armv2"], [s["sans1_x"] + s["x_shake"], s["sans1_y"] + s["y_shake"] + y, w, h]);
			} else if (s["sans1_animation_x"] < 40) {
				w = s["sans_size"] * 63;
				h = s["sans_size"] * 43;
				y = s["sans_size"] * 15;
				canvas_img(texture["sans1_torso_armv1"], [s["sans1_x"] + s["x_shake"], s["sans1_y"] + s["y_shake"] + y, w, h]);
			} else if (s["sans1_animation_x"] < 42) {
				w = s["sans_size"] * 56;
				h = s["sans_size"] * 35;
				y = s["sans_size"] * 25;
				canvas_img(texture["sans1_torso_armv0"], [s["sans1_x"] + s["x_shake"], s["sans1_y"] + s["y_shake"] + y, w, h]);
			} else if (s["sans1_animation_x"] >= 42) {
				// draw last frame
				w = s["sans_size"] * 56;
				h = s["sans_size"] * 35;
				y = s["sans_size"] * 25;
				// change animation
				s["sans1_animation_x"] = 0;
				s["sans1_animation_y"] = 0;
				s["sans1_animation"] = "idle";
			} 
			// head
			let head;
			let stage = s["sans1_animation_x"]
			while (stage > 20) {
				stage -= 20
			}
			if (stage >= 10) {
				head = texture["sans1_head_blue"]
			} else {
				head = texture["sans1_head_yellow"]
			}
			w = s["sans_size"] * 31;
			h = s["sans_size"] * 31;
			x = (s["sans1_w"] / 2) - (w / 2);
			y = s["sans_size"] * 0.5;
			canvas_img(head, [ s["sans1_x"] + s["x_shake"] + x, s["sans1_y"] + s["y_shake"] + y, w, h]);
		} else if (s["sans1_animation"] == "down") {
			// legs
			w = s["sans_size"] * 36;
			h = s["sans_size"] * 20;
			x = (s["sans1_w"] / 2) - (w / 2);
			y = s["sans_size"] * 55;
			canvas_img(texture["sans1_legs"], [s["sans1_x"] + s["x_shake"] + x, s["sans1_y"] + s["y_shake"] + y, w, h]);
			// body
			s["sans1_animation_x"] ++;
			if (s["sans1_animation_x"] < 2) {
				w = s["sans_size"] * 56;
				h = s["sans_size"] * 35;
				y = s["sans_size"] * 25;
				canvas_img(texture["sans1_torso_armv0"], [s["sans1_x"] + s["x_shake"], s["sans1_y"] + s["y_shake"] + y, w, h]);
			} else if (s["sans1_animation_x"] < 4) {
				w = s["sans_size"] * 63;
				h = s["sans_size"] * 43;
				y = s["sans_size"] * 15;
				canvas_img(texture["sans1_torso_armv1"], [s["sans1_x"] + s["x_shake"], s["sans1_y"] + s["y_shake"] + y, w, h]);
			} else if (s["sans1_animation_x"] < 6) {
				w = s["sans_size"] * 61;
				h = s["sans_size"] * 43;
				y = s["sans_size"] * 15;
				canvas_img(texture["sans1_torso_armv2"], [s["sans1_x"] + s["x_shake"], s["sans1_y"] + s["y_shake"] + y, w, h]);
			} else if (s["sans1_animation_x"] < 10) {
				w = s["sans_size"] * 63;
				h = s["sans_size"] * 43;
				y = s["sans_size"] * 15;
				canvas_img(texture["sans1_torso_armv1"], [s["sans1_x"] + s["x_shake"], s["sans1_y"] + s["y_shake"] + y, w, h]);
			} else if (s["sans1_animation_x"] < 40) {
				w = s["sans_size"] * 56;
				h = s["sans_size"] * 35;
				y = s["sans_size"] * 25;
				canvas_img(texture["sans1_torso_armv0"], [s["sans1_x"] + s["x_shake"], s["sans1_y"] + s["y_shake"] + y, w, h]);
			} else if (s["sans1_animation_x"] >= 40) {
				// draw last frame
				w = s["sans_size"] * 56;
				h = s["sans_size"] * 35;
				y = s["sans_size"] * 25;
				canvas_img(texture["sans1_torso_armv0"], [s["sans1_x"] + s["x_shake"], s["sans1_y"] + s["y_shake"] + y, w, h]);
				// change animation
				s["sans1_animation_x"] = 0;
				s["sans1_animation_y"] = 0;
				s["sans1_animation"] = "idle";
			} 
			// head
			w = s["sans_size"] * 31;
			h = s["sans_size"] * 31;
			x = (s["sans1_w"] / 2) - (w / 2);
			y = s["sans_size"] * 0.5;
			let head;
			let stage = s["sans1_animation_x"]
			while (stage > 20) {
				stage -= 20
			}
			if (stage >= 10) {
				head = texture["sans1_head_blue"]
			} else {
				head = texture["sans1_head_yellow"]
			}
			canvas_img(head, [ s["sans1_x"] + s["x_shake"] + x, s["sans1_y"] + s["y_shake"] + y, w, h]);
		}
		
	}
	// draw sans2 (slackertale)
	if (s["sans_hidden"][2] == 0) {
		w = s["sans_size"] * 49
		h = s["sans_size"] * 75
		canvas_img(texture["sans1_still"], [x + w * 2 + s["x_shake"], y + s["y_shake"], w, h]);
	}
	// draw sans3 (sudden changes)
	if (s["sans_hidden"][3] == 0) {
		w = s["sans_size"] * 49
		h = s["sans_size"] * 75
		canvas_img(texture["sans1_still"], [x + w * 3 + s["x_shake"], y + s["y_shake"], w, h]);
	}
}

function manage_attack() {
	for (let i = 0; i < s["sans1_bone"].length; i ++) {
		let bone = s["sans1_bone"][i]
		// draw bone
		const canvas = document.getElementById("canvas");
		const ctx = canvas.getContext("2d");
		let x = Math.cos(((Math.PI / 180) * bone["a"])) * (bone["h"] / 2)
		let y = Math.sin(((Math.PI / 180) * bone["a"])) * (bone["h"] / 2)	
		canvas_line(bone["x"] + s["x_shake"], bone["y"] + s["y_shake"], bone["x"] + x + s["x_shake"], bone["y"] + y + s["y_shake"], "white", bone["w"])
		canvas_img(texture["sans1_attack_bone"],
			[bone["x"] + x - ((bone["w"] * 1.55) / 2) + s["x_shake"], bone["y"] + y - (bone["w"] / 2) + s["y_shake"], bone["w"] * 1.55, bone["w"] * 1], bone["a"] + 90)
		x = Math.cos(((Math.PI / 180) * (bone["a"] + 180))) * (bone["h"] / 2)
		y = Math.sin(((Math.PI / 180) * (bone["a"] + 180))) * (bone["h"] / 2)
		canvas_line(bone["x"] + s["x_shake"], bone["y"] + s["y_shake"], bone["x"] + x + s["x_shake"], bone["y"] + y + s["y_shake"], "white", bone["w"])
		canvas_img(texture["sans1_attack_bone"],
			[bone["x"] + x - ((bone["w"] * 1.55) / 2) + s["x_shake"], bone["y"] + y - (bone["w"] / 2) + s["y_shake"], bone["w"] * 1.55, bone["w"] * 1], bone["a"] - 90)
		// direction
		bone["x"] += bone["vx"];
		bone["y"] += bone["vy"];
		// remove bone
		if (bone["vx"] > 0) {
			if (bone["x"] > canvas_width) {
				s["sans1_bone"].splice(i, 1);
			}
		} else if (bone["vx"] < 0) {
			if (bone["x"] < 0) {
				s["sans1_bone"].splice(i, 1);
			}
		}
		if (bone["vy"] > 0) {
			if (bone["y"] > canvas_height) {
				s["sans1_bone"].splice(i, 1);
			}
		} else if (bone["vy"] < 0) {
			if (bone["y"] < 0) {
				s["sans1_bone"].splice(i, 1);
			}
		}
		
	}
}


// main loop
function run() {
	// clear box
	canvas_rect([box["x"], box["y"], box["w"], box["h"]], "black");
	// manage attacks
	manage_attack();
	// clear background (excluding box)
	canvas_rect([0, 0, canvas_width, box["y"]], "black");
	canvas_rect([0, box["y"], (canvas_width - box["w"]) / 2, box["h"]], "black");
	canvas_rect([canvas_width - ((canvas_width - box["w"]) / 2), box["y"], (canvas_width - box["w"]) / 2, box["h"]], "black");
	canvas_rect([0, box["y"] + box["h"], canvas_width, canvas_height - (box["y"] + box["h"])], "black");
	// information
	canvas_text(`FPS: ${s["fps"]}`, [5, 20], 20, "lime", "Courier", "left");
	canvas_text(`avg: ${s["fps_avg"]}`, [5, 40], 20, "lime", "Courier", "left");
	canvas_text(`FTO: ${Math.round(s["timeout"])}`, [5, 60], 20, "lime", "Courier", "black");
	// draw sans
	manage_sans();
	// draw options
	if (texture["opt_hidden"] == false) {
		// draw health bar
		hp_w = canvas_width / 5
		hp_x = (canvas_width / 2) - (hp_w / 2)
		canvas_rect([hp_x, canvas_height * 0.8, hp_w, canvas_height / 18], "red")
		// draw options
		canvas_img(texture["fight0"],
			[texture["opt_xo"] + s["x_shake"], texture["opt_y"] + s["y_shake"],  texture["opt_w"], texture["opt_h"]])
		canvas_img(texture["act0"],
			[texture["opt_xm"] + texture["opt_xo"] + s["x_shake"], texture["opt_y"] + s["y_shake"], texture["opt_w"], texture["opt_h"]])
		canvas_img(texture["item0"], 
			[texture["opt_xm"] * 2 + texture["opt_xo"] + s["x_shake"], texture["opt_y"] + s["y_shake"], texture["opt_w"], texture["opt_h"]])
		canvas_img(texture["mercy0"],
			[texture["opt_xm"] * 3 + texture["opt_xo"] + s["x_shake"], texture["opt_y"] + s["y_shake"], texture["opt_w"], texture["opt_h"]])
	}
	// box
	manage_box();
	// draw soul pulse
	if (s["hidden"] == false) {
		if (s["pulse"]) {
			s["pulse_m"] += s["w"] / 20
			if (s["pulse_m"] > s["w"] * 3.5) {
				s["pulse_m"] = 0
			}
			let o = (s["pulse_m"] - s["w"]) / 2  // offset
			let opacity = 1 - (s["pulse_m"] / (s["w"] * 3.5))
			canvas_img(texture[`soul_${s["m"]}`],
				[s["x"] - o + s["x_shake"], s["y"] - o + s["y_shake"], s["pulse_m"] , s["pulse_m"] ], s["a"], opacity)
		}
	}
	// draw soul
	if (s["hidden"] == false) {
		canvas_img(texture[`soul_${s["m"]}`], [s["x"] + s["x_shake"], s["y"] + s["y_shake"], s["w"], s["h"]], s["a"])
	}
	// screen shake
	if (s["x_shake"] > 0) {
		s["x_shake"] -= Math.random() * (Math.abs(s["x_shake"] * 3))
	} else if (s["x_shake"] < 0) {
		s["x_shake"] += Math.random() * (Math.abs(s["x_shake"] * 3))
	}
	if (s["y_shake"] > 0) {
		s["y_shake"] -= Math.random() * (Math.abs(s["y_shake"] * 3))
	} else if (s["y_shake"] < 0) {
		s["y_shake"] += Math.random() * (Math.abs(s["y_shake"] * 3))
	}
	if (Math.abs(s["x_shake"] < 2)) {
		s["x_shake"] == 0
	}
	if (Math.abs(s["y_shake"] < 2)) {
		s["y_shake"] == 0
	}
	// commands
	manage_command();
	// movement
	manage_movement();
	// animation
	manage_animation();
	// wall collision
	if (s["x"] < box["x"] + box["hlw"]) {
		s["x"] = box["x"] + box["hlw"]
		// reset gravity
		if (s["gravity"] == "left") {
			if (s["force"] > 19) {
				manage_audio("impact")
				s["x_shake"] += (Math.random() * s["force"]) - (Math.random() * s["force"])
				s["y_shake"] += (Math.random() * s["force"]) - (Math.random() * s["force"])
			}
			s["left_enabled"] = true
			s["force"] = 1
		}
	}
	if (s["x"] + s["w"] > box["x"] - box["hlw"] + box["w"]) {
		s["x"] = box["x"] - box["hlw"] + box["w"] - s["w"]
		// reset gravity
		if (s["gravity"] == "right") {
			if (s["force"] > 19) {
				manage_audio("impact")
				s["x_shake"] += (Math.random() * s["force"]) - (Math.random() * s["force"])
				s["y_shake"] += (Math.random() * s["force"]) - (Math.random() * s["force"])
			}
			s["right_enabled"] = true
			s["force"] = 1
		}
	}
	if (s["y"] < box["y"] + box["hlw"]) {
		s["y"] = box["y"] + box["hlw"]
		// reset gravity
		if (s["gravity"] == "up") {
			if (s["force"] > 19) {
				manage_audio("impact")
				s["x_shake"] += (Math.random() * s["force"]) - (Math.random() * s["force"])
				s["y_shake"] += (Math.random() * s["force"]) - (Math.random() * s["force"])
			}
			s["up_enabled"] = true
			s["force"] = 1
		}
	}
	if (s["y"] + s["h"] > box["y"] - box["hlw"] + box["h"]) {
		s["y"] = box["y"] - box["hlw"] + box["h"] - s["h"]
		// reset gravity
		if (s["gravity"] == "down") {
			if (s["force"] > 19) {
				manage_audio("impact")
				s["x_shake"] += (Math.random() * s["force"]) - (Math.random() * s["force"])
				s["y_shake"] += (Math.random() * s["force"]) - (Math.random() * s["force"])
			}
			s["down_enabled"] = true
			s["force"] = 1
		}
	}
	// manage FPS
	manage_fps();
	// loop?
	if (s["run"] == true) {
		setTimeout(run, s["timeout"]);
	}
}


// start up
function reset() {
	// adjust canvas to 4:3 scale
	const canvas = document.getElementById("canvas");
	const console = document.getElementById("console");
	const console_animation = document.getElementById("console_animation");
	canvas_width = window.innerHeight;
	canvas_height = (window.innerHeight / 4) * 3;
	canvas.width = canvas_width;
	canvas.height = canvas_height;
	// adjust console
	console.style.height = `${canvas_height}px`;
	console_animation.style.height = `${canvas_height}px`;
	// adjust box
	box["line_w"] = canvas_width / 125;
	box["bottom"] = canvas_height / 1.3
	// adjust soul
	s["w"] = canvas_width / 35;
	s["h"] = canvas_width / 35;
	s["s"] = canvas_width / 250;
	// adjust sans
	s["sans_size"] = (canvas_width / 6.3) / 49
	// adjust options
	texture["opt_xm"] = canvas_width / 4
	texture["opt_y"] = canvas_height / 1.14
	texture["opt_w"] = canvas_width / 5
	texture["opt_xo"] = (texture["opt_xm"] - texture["opt_w"]) / 2
	texture["opt_h"] = (texture["opt_w"] * 40) / 113
	// load textures
	let url = "https://raw.githubusercontent.com/Mynameisevanbro/FallBackTimeQuartet.io/main/texture/"
	sprites = [
		"title",
		// sans
		"sans1_still",
		"sans1_head",
		"sans1_head_blue",
		"sans1_head_yellow",
		"sans1_head_eyeless0",
		"sans1_head_eyeless1",
		"sans1_head_eyesclosed",
		"sans1_head_eyessmall",
		"sans1_head_wink",
		"sans1_head_wink_eyeless",
		"sans1_legs",
		"sans1_torso",
		"sans1_torso_armh0",
		"sans1_torso_armh1",
		"sans1_torso_armh2",
		"sans1_torso_armv0",
		"sans1_torso_armv1",
		"sans1_torso_armv2",
		"sans1_torso_shrug",
		// attacks
		"sans1_attack_bone",
		// soul
		"soul_red",
		"soul_blue",
		// options
		"fight0",
		"act0",
		"item0",
		"mercy0",
	]
	for (let i = 0; i < sprites.length; i ++) {
		let img = new Image();
		img.src = `${url}${sprites[i]}.png`;
		texture[sprites[i]] = img;
	}
	// load audio
	let impact;
	for (i = 0; i < audio["impact_channel"].length; i ++) {
		impact = new Audio("https://github.com/Mynameisevanbro/FallBackTimeQuartet.io/blob/main/audio/impact.mp3?raw=true")
		impact.type = 'audio/mp3';
		impact.loop = false;
		audio["impact"].push(impact)
	}
	// load music
	let theme0 = new Audio("https://github.com/Mynameisevanbro/FallBackTimeQuartet.io/blob/main/audio/theme0.mp3?raw=true")
	theme0.type = 'audio/mp3';
	theme0.loop = false;
	audio["theme0"] = theme0
	// run
	if (s["run"] != true) {
		s["run"] = true;
		run();
	}
}

// event listeners
window.addEventListener('load', ()=>{reset()});
window.addEventListener('resize', ()=>{reset()});
window.addEventListener('keydown', function(event) {
		const key = event.key;
		if (key == "ArrowLeft" || key.toUpperCase() == "A") {
			s["left"] = true;
			if (s["right"]) {
				s["right"] = null;
			}
		}
		if (key == "ArrowRight" || key.toUpperCase() == "D") {
			s["right"] = true;
			if (s["left"]) {
				s["left"] = null;
			}
		}
		if (key == "ArrowUp" || key.toUpperCase() == "W") {
			s["up"] = true;
			if (s["down"]) {
				s["down"] = null;
			}
		}
		if (key == "ArrowDown" || key.toUpperCase() == "S") {
			s["down"] = true;
			if (s["up"]) {
				s["up"] = null;
			}
		}
});
window.addEventListener('keyup', function(event) {
	const key = event.key;
	if (key == "ArrowLeft" || key.toUpperCase() == "A") {
		s["left"] = false;
		if (s["right"] == null) {
			s["right"] = true;
		}
	}
	if (key == "ArrowRight" || key.toUpperCase() == "D") {
		s["right"] = false;
		if (s["left"] == null) {
			s["left"] = true;
		}
	}
	if (key == "ArrowUp" || key.toUpperCase() == "W") {
		s["up"] = false;
		if (s["down"] == null) {
			s["down"] = true;
		}
	}
	if (key == "ArrowDown" || key.toUpperCase() == "S") {
		s["down"] = false;
		if (s["up"] == null) {
			s["up"] = true;
		}
		
	}
});