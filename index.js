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
	"hidden": false,
	"pulse": false,
	"pulse_m": 0,  // magnitude
	"gravity": "down",
	"force": 0,
	"lock": false,  // can move?
	// sans
	"sans1_hidden": false,
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
}
var texture = {
	// options data
	"opt_xm": 0,  // x multiplier
	"opt_y": 0,
	"opt_w": 0,
	"opt_xo": 0,  // x offset
	"opt_h": 0,
}
var audio = {
	"impact": null,
	"theme0": null,
}
var command = []


// system
function manage_fps(){
	// set frames
	s["frame"] ++;
	s["timeframe"].push(+new Date());
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


// GUI
function canvas_text(text, pos, size, color, font, alignment="center") {
	// define canvas
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");
	// draw title
	ctx.font = `${size}px ${font}`;
	ctx.textAlign = alignment;
	ctx.fillStyle = color;
	ctx.fillText(text, pos[0], pos[1]);
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


// game functions
function manage_box() {
	// draw box
	if (box["hidden"] == false) {
		box["hlw"] = box["line_w"] / 2  // half line width
		canvas_rect([box["x"] - box["hlw"] + s["x_shake"], box["y"] - box["hlw"] + s["y_shake"], box["line_w"], box["h"]], "white");
		canvas_rect([box["x"] - box["hlw"] + box["line_w"] + s["x_shake"], box["y"] - box["hlw"] + s["y_shake"], box["w"], box["line_w"]], "white");
		canvas_rect([box["x"] - box["hlw"] + box["w"] + s["x_shake"], box["y"] - box["hlw"] + box["line_w"] + s["y_shake"], box["line_w"], box["h"]], "white");
		canvas_rect([box["x"] - box["hlw"] + s["x_shake"], box["y"] - box["hlw"] + box["h"] + s["y_shake"], box["w"], box["line_w"]], "white");
	}
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
			con.innerHTML += `sans.id${command[i]["id"]}\n`
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
					if (s["fps_avg"] == 60) {
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
						s["x"] = box["x"] + (box["w"] / 2) - (s["w"] / 2)
						s["y"] = box["y"] + (box["h"] / 2) - (s["h"] / 2)
					}
				}
				// finish task
				command.shift()
			} else if (command[0]["name"] == "box") {
				// apply values
				box["preset"] = command[0]["preset"]
				box["hidden"] = command[0]["hidden"]
				// finish task
				command.shift()
			} else if (command[0]["name"] == "soul") {
				// apply values
				s["m"] = command[0]["mode"]
				s["gravity"] = command[0]["gravity"]
				s["force"] = command[0]["force"] * s["s"]
				s["pulse"] = command[0]["pulse"]
				s["hidden"] = command[0]["hidden"]
				// reset gravity
				s["up_enabled"] = false;
				s["down_enabled"] = false;
				// finish task
				command.shift()
			} else if (command[0]["name"] == "audio") {
				// play audio
				audio[command[0]["file"]].play()
				// finish task
				command.shift()
			} else if (command[0]["name"] == "animate") {
				// push animation
				obj = {
					"name": command[0]["preset"],
					"frame": 0,
				}
				s["animation"].push(obj)
				// finish task
				command.shift()
			} else if (command[0]["name"] == "sans") {
				// apply values
				s[`sans${command[0]["id"]}_hidden`] = command[0]["hidden"]
				// finish task
				command.shift()
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
			percent = Math.round((s["animation"][i]["frame"] / 2) * 100)
			con.innerHTML += `${percent}% - title\n`
		} else if (s["animation"][i]["name"] == "sans_intro") {
			con.innerHTML += "sans_intro\n"
		} else if (s["animation"][i]["name"] == "box_down") {
			percent = Math.round(s["animation"][i]["frame"] * 100)
			con.innerHTML += `${percent}% - box_down\n`
		} else if (s["animation"][i]["name"] == "sans1_fadein") {
			percent = Math.round(s["animation"][i]["frame"] * 100)
			con.innerHTML += `${percent}% - sans1_fadein\n`
		}
	}
	// execute animations
	for (let i = 0; i < s["animation"].length; i ++) {
		// title fade in/out
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
		// box down
		} else if (s["animation"][i]["name"] == "box_down") {
			// animate
			s["animation"][i]["frame"] += 0.005
			box["preset"] = "custom"
			// calculate target values
			let dist = box["bottom"] - (canvas_height / 2)
			let w = s["w"]
			let h = s["h"]
			let x = (canvas_width / 2) - (w / 2)
			let y = (canvas_height / 2) + (dist * s["animation"][i]["frame"])
			// apply animation
			box["w"] = w
			box["h"] = h
			box["x"] = x
			box["y"] = y
			// end animation
			if (s["animation"][i]["frame"] > 1) {
				s["animation"].splice(i, 1)
			}
		// sans1 (last breath) intro
		} else if (s["animation"][i]["name"] == "sans1_fadein") {
			// animate
			s["animation"][i]["frame"] += 0.005;
			// draw sans
			let w = canvas_width / 6.3
			let h = (w * 75) / 49
			let x0 = (canvas_width / 2) - (w / 2)
			let x1 = (canvas_width / 2) - (w * 2)
			let y = canvas_height / 40
			// fade in at center of screen
			if (s["animation"][i]["frame"] < 1) {
				canvas_img(texture["sans1_still"], [x0 + s["x_shake"], y + s["y_shake"], w, h], 0,
				s["animation"][i]["frame"]);
			// move to correct position
			} else if (s["animation"][i]["frame"] < 2) {
				s["animation"][i]["frame"] += 0.005;
				let dist = (x0 - (x1 + w)) * (1 - s["animation"][i]["frame"])
				canvas_img(texture["sans1_still"], [x0 + dist + s["x_shake"], y + s["y_shake"], w, h]);
			// end animation
			} else if (s["animation"][i]["frame"] > 2) {
				s["animation"].splice(i, 1)
				s["sans1_hidden"] = false;
			}
		}
	}
}


function manage_sans() {
	// positions
	let w = canvas_width / 6.3;
		let h = (w * 75) / 49;
		let x = (canvas_width / 2) - (w * 2);
		let y = canvas_height / 40;
	// sans0 (error)
	canvas_img(texture["sans1_still"], [x + s["x_shake"], y + s["y_shake"], w, h]);
	// draw sans1 (last breath)
	if (s["sans1_hidden"] == false) {
		canvas_img(texture["sans1_still"], [x + w + s["x_shake"], y + s["y_shake"], w, h]);
	}
	// draw sans2
	canvas_img(texture["sans1_still"], [x + w * 2 +  + s["x_shake"], y + s["y_shake"], w, h]);
	// draw sans3
	canvas_img(texture["sans1_still"], [x + w * 3 +  + s["x_shake"], y + s["y_shake"], w, h]);
}


// main loop
function run() {
	canvas_rect([0, 0, canvas_width, canvas_height], "black");
	canvas_text(`FPS: ${s["fps"]}`, [5, 20], 20, "lime", "Courier", "left");
	canvas_text(`avg: ${s["fps_avg"]}`, [5, 40], 20, "lime", "Courier", "left");
	canvas_text(`FTO: ${Math.round(s["timeout"])}`, [5, 60], 20, "lime", "Courier", "left");
	// draw sans
	manage_sans();
	// draw options
	canvas_img(texture["fight0"],
		[texture["opt_xo"] + s["x_shake"], texture["opt_y"] + s["y_shake"],  texture["opt_w"], texture["opt_h"]])
	canvas_img(texture["act0"],
		[texture["opt_xm"] + texture["opt_xo"] + s["x_shake"], texture["opt_y"] + s["y_shake"], texture["opt_w"], texture["opt_h"]])
	canvas_img(texture["item0"], 
		[texture["opt_xm"] * 2 + texture["opt_xo"] + s["x_shake"], texture["opt_y"] + s["y_shake"], texture["opt_w"], texture["opt_h"]])
	canvas_img(texture["mercy0"],
		[texture["opt_xm"] * 3 + texture["opt_xo"] + s["x_shake"], texture["opt_y"] + s["y_shake"], texture["opt_w"], texture["opt_h"]])
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
				audio["impact"].play()
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
				audio["impact"].play()
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
				audio["impact"].play()
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
				audio["impact"].play()
				s["x_shake"] += (Math.random() * s["force"]) - (Math.random() * s["force"])
				s["y_shake"] += (Math.random() * s["force"]) - (Math.random() * s["force"])
			}
			s["down_enabled"] = true
			s["force"] = 1
		}
	}
	// box
	manage_box();
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
	let impact = new Audio("https://github.com/Mynameisevanbro/FallBackTimeQuartet.io/blob/main/audio/impact.mp3?raw=true")
	impact.type = 'audio/mp3';
	impact.loop = false;
	audio["impact"] = impact
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