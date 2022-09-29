// varables
var canvas_width;
var canvas_height;
var s = {
	// main + screen
	"run": false,
	"loaded": false,
	"x_shake": 0,
	"y_shake": 0,
	// player
	"x": 0,
	"y": 0,
	"w": 0,
	"h": 0,
	"s": 0,  // speed
	"a": 360,  // angle
	"m": "red",  // mode
	"gravity": "down",
	"force": 0,
	"lock": false,  // can move?
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
	"fps_avg_arrary": [99999999],
	"fps_avg": 0,
	"timeout": 0,
}
var box = {
	"preset": "square",
	"hidden": true,
	"x": 0,
	"y": 0,
	"w": 0,
	"h": 0,
	"line_w" : 0,
	"hlw": 0,  // half line width
}
var sprite = {
	"soul_red": null,
	"soul_blue": null,
}
var command = [
	{
		"name": "wait",
		"until": "load",
		"time": 0,
	},
	{
		"name": "box",
		"preset": "square",
		"hidden": false,
	},
	{
		"name": "position",
		"preset": true,  // use coordinates or present?
		"preset_name": "center",
		"x": 0,
		"y": 0,
	},
	{
		"name": "soul",
		"mode": "blue",
		"gravity": "down",
		"force": 5,
	},
	{
		"name": "wait",
		"until": "time",
		"time": 100,
	},
	{
		"name": "soul",
		"mode": "blue",
		"gravity": "up",
		"force": 5,
	},
	{
		"name": "wait",
		"until": "time",
		"time": 100,
	},
	{
		"name": "soul",
		"mode": "blue",
		"gravity": "left",
		"force": 5,
	},
	{
		"name": "wait",
		"until": "time",
		"time": 100,
	},
	{
		"name": "soul",
		"mode": "blue",
		"gravity": "right",
		"force": 5,
	},
	{
		"name": "wait",
		"until": "time",
		"time": 100,
	},
	{
		"name": "soul",
		"mode": "blue",
		"gravity": "up",
		"force": 5,
	},
	{
		"name": "wait",
		"until": "time",
		"time": 25,
	},
	{
		"name": "soul",
		"mode": "blue",
		"gravity": "down",
		"force": 5,
	},
	{
		"name": "soul",
		"mode": "red",
		"gravity": "down",
		"force": 1,
	},
	
]


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


function canvas_img(image, rect, angle=0) {
	// define canvas
	const canvas = document.getElementById("canvas");
	const ctx = canvas.getContext("2d");
	// draw image
	ctx.translate(rect[0] + rect[2] / 2, rect[1] + rect[3] / 2)
	ctx.rotate(angle * Math.PI / 180)
	try {
		ctx.drawImage(image, -(rect[2] / 2), -(rect[3] / 2), rect[2], rect[3]);
	} catch {
		canvas_rect(rect, "red")
	}
	ctx.rotate(-angle * Math.PI / 180)
	ctx.translate(-(rect[0] + rect[2] / 2), -(rect[1] + rect[3] / 2))
	
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
	let bottom = canvas_height / 1.2
	let w_tar = 0
	let h_tar = 0
	let x_tar = 0
	let y_tar = 0
	if (box["preset"] == "square") {
		// calculate target values
		w_tar = canvas_width / 3.5
		h_tar = w_tar
		x_tar = (canvas_width / 2) - (w_tar / 2)
		y_tar = bottom - h_tar
	} else if (box["preset"] == "rectangle") {
		// calculate target values
		w_tar = canvas_width / 1.5
		h_tar = (canvas_width / 3.5) / 1.2
		x_tar = (canvas_width / 2) - (w_tar / 2)
		y_tar = bottom - h_tar
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


// main loop
function run() {
	canvas_rect([0, 0, canvas_width, canvas_height], "black");
	canvas_text(`FPS: ${s["fps"]}`, [5, 20], 20, "lime", "Courier", "left");
	canvas_text(`avg: ${s["fps_avg"]}`, [5, 40], 20, "lime", "Courier", "left");
	canvas_text(`FTO: ${Math.round(s["timeout"])}`, [5, 60], 20, "lime", "Courier", "left");
	// draw soul
	if (s["m"] == "red") {
		canvas_img(sprite["soul_red"], [s["x"] + s["x_shake"], s["y"] + s["y_shake"], s["w"], s["h"]])
	} else if (s["m"] == "blue") {
		canvas_img(sprite["soul_blue"], [s["x"] + s["x_shake"], s["y"] + s["y_shake"], s["w"], s["h"]], s["a"])
		
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
			con.innerHTML += `box.${command[i]["present"]}.${command[i]["hidden"]}\n`
		}
		if (command[i]["name"] == "soul") {
			con.innerHTML += `soul.${command[i]["mode"]}.${command[i]["gravity"]}\n`
		}
	}
	// commands
	for (let i = 0; i < command.length; i ++) {
		try {
			// execute
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
				}
				// wait type time (wait until time is up)
				if (command[0]["until"] == "time") {
					// detect if loaded, if not loaded, wait
					if (command[0]["time"] <= 0) {
						// finish task
						command.shift()
					} else {
						command[0]["time"] -= 1
						break
					}
				}
			}
			if (command[0]["name"] == "position") {
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
			}
			if (command[0]["name"] == "box") {
				// apply values
				box["preset"] = command[0]["preset"]
				box["hidden"] = command[0]["hidden"]
				// finish task
				command.shift()
			}
			if (command[0]["name"] == "soul") {
				// apply values
				s["m"] = command[0]["mode"]
				s["gravity"] = command[0]["gravity"]
				s["force"] = command[0]["force"] * s["s"]
				// reset gravity
				s["up_enabled"] = false;
				s["down_enabled"] = false;
				// finish task
				command.shift()
			}
		} catch {

		}
	}
	// movement
	if (s["m"] == "red") {
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
	
	// wall collision
	if (s["x"] < box["x"] + box["hlw"]) {
		s["x"] = box["x"] + box["hlw"]
		// reset gravity
		if (s["gravity"] == "left") {
			if (s["force"] > 19) {
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
	canvas_width = window.innerHeight;
	canvas_height = (window.innerHeight / 4) * 3;
	canvas.width = canvas_width;
	canvas.height = canvas_height;
	// adjust console
	console.style.height = `${canvas_height}px`;
	//
	box["line_w"] = canvas_width / 125;
	s["w"] = canvas_width / 35;
	s["h"] = canvas_width / 35;
	s["s"] = canvas_width / 250;
	// load image
	let soul_red = new Image();
	soul_red.src = "https://raw.githubusercontent.com/Mynameisevanbro/FallBackTimeQuartet/main/soul_red.png";
	sprite["soul_red"] = soul_red;
	let soul_blue = new Image();
	soul_blue.src = "https://raw.githubusercontent.com/Mynameisevanbro/FallBackTimeQuartet/main/soul_blue.png";
	sprite["soul_blue"] = soul_blue;
	// run main loop
	if (s["run"] == false) {
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