function load_command_test() {
	command.push(
		{
			"name": "option",
			"hidden": false,
		},
		{
			"name": "wait",
			"until": "load",
			"time": 0,
		},
		{
			"name": "sans",
			"id": 1,
			"hidden": false,
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
			"pulse": false,
			"hidden": false,
			"gravity": "down",
			"force": 5,
		},
		{
			"name": "wait",
			"until": "time",
			"time": 50,
		},
		{
			"name": "soul",
			"mode": "red",
			"pulse": true,
			"hidden": false,
			"gravity": "down",
			"force": 1,
		},
		{
			"name": "box",
			"preset": "rectangle",
			"hidden": false,
			"hidden": false,
		},
	)
}


function load_command_animation_test() {
	command.push(
		{
			"name": "option",
			"hidden": false,
		},
		{
			"name": "wait",
			"until": "load",
			"time": 0,
		},
		{
			"name": "sans",
			"id": 0,
			"hidden": true,
		},
		{
			"name": "sans",
			"id": 1,
			"hidden": true,
		},
		{
			"name": "sans",
			"id": 2,
			"hidden": true,
		},
		{
			"name": "sans",
			"id": 3,
			"hidden": true,
		},
		{
			"name": "animate",
			"preset": "title",
		},
		{
			"name": "animate",
			"preset": "box_down",
		},
		{
			"name": "animate",
			"preset": "sans0_intro",
		},
		{
			"name": "animate",
			"preset": "sans1_intro",
		},
		{
			"name": "animate",
			"preset": "sans2_intro",
		},
		{
			"name": "animate",
			"preset": "sans3_intro",
		},
	)
}


function load_command_lmao() {
	command.push(
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
			"pulse": false,
			"hidden": false,
			"gravity": "down",
			"force": 2,
		},
		{
			"name": "wait",
			"until": "time",
			"time": 15,
		},
		{
			"name": "soul",
			"mode": "blue",
			"pulse": false,
			"hidden": false,
			"gravity": "up",
			"force": 4,
		},
		{
			"name": "wait",
			"until": "time",
			"time": 15,
		},
		{
			"name": "soul",
			"mode": "blue",
			"pulse": false,
			"hidden": false,
			"gravity": "down",
			"force": 8,
		},
		{
			"name": "wait",
			"until": "time",
			"time": 15,
		},
		{
			"name": "soul",
			"mode": "blue",
			"pulse": false,
			"hidden": false,
			"gravity": "up",
			"force": 16,
		},
		{
			"name": "wait",
			"until": "time",
			"time": 15,
		},
		{
			"name": "soul",
			"mode": "blue",
			"pulse": false,
			"hidden": false,
			"gravity": "down",
			"force": 32,
		},
		{
			"name": "wait",
			"until": "time",
			"time": 15,
		},
		{
			"name": "soul",
			"mode": "blue",
			"pulse": false,
			"hidden": false,
			"gravity": "up",
			"force": 64,
		},
		{
			"name": "wait",
			"until": "time",
			"time": 15,
		},
		{
			"name": "soul",
			"mode": "blue",
			"pulse": false,
			"hidden": false,
			"gravity": "down",
			"force": 128,
		},
		{
			"name": "wait",
			"until": "time",
			"time": 15,
		},
		{
			"name": "soul",
			"mode": "blue",
			"pulse": false,
			"hidden": false,
			"gravity": "up",
			"force": 64,
		},
		{
			"name": "wait",
			"until": "time",
			"time": 15,
		},
		{
			"name": "soul",
			"mode": "blue",
			"pulse": false,
			"hidden": false,
			"gravity": "down",
			"force": 512,
		},
		{
			"name": "wait",
			"until": "time",
			"time": 15,
		},
		{
			"name": "soul",
			"mode": "blue",
			"pulse": false,
			"hidden": false,
			"gravity": "up",
			"force": 99999999,
		},
	)
}


function load_command_intro() {
	command.push(
		// hide soul, box, sans, option
		{
			"name": "box",
			"preset": "square",
			"hidden": true,
		},
		{
			"name": "option",
			"hidden": true,
		},
		{
			"name": "soul",
			"mode": "red",
			"pulse": false,
			"hidden": true,
			"gravity": "down",
			"force": 1,
		},
		{
			"name": "sans",
			"id": 0,
			"hidden": true,
		},
		{
			"name": "sans",
			"id": 1,
			"hidden": true,
		},
		{
			"name": "sans",
			"id": 2,
			"hidden": true,
		},
		{
			"name": "sans",
			"id": 3,
			"hidden": true,
		},
		// wait until loaded to keep music synced
		{
			"name": "wait",
			"until": "load",
			"time": 0,
		},
		// play music
		{
			"name": "audio",
			"file": "theme0",
		},
		// animate box down
		{
			"name": "animate",
			"preset": "box_down",
		},
		// show soul
		{
			"name": "wait",
			"until": "time",
			"time": 15,
		},
		{
			"name": "soul",
			"mode": "red",
			"pulse": false,
			"hidden": false,
			"gravity": "down",
			"force": 1,
		},
		// make soul pulse
		{
			"name": "wait",
			"until": "time",
			"time": 200,
		},
		{
			"name": "soul",
			"mode": "red",
			"pulse": true,
			"hidden": false,
			"gravity": "down",
			"force": 1,
		},
		// pulse title
		{
			"name": "animate",
			"preset": "title",
		},
		{
			"name": "wait",
			"until": "time",
			"time": 200,
		},
		{
			"name": "animate",
			"preset": "title",
		},
		// sans(es) enter animation
		{
			"name": "wait",
			"until": "time",
			"time": 100,
		},
		{
			"name": "animate",
			"preset": "sans1_intro",
		},
		{
			"name": "wait",
			"until": "time",
			"time": 300,
		},
		{
			"name": "animate",
			"preset": "sans2_intro",
		},
		{
			"name": "wait",
			"until": "time",
			"time": 250,
		},
		{
			"name": "animate",
			"preset": "sans0_intro",
		},
		{
			"name": "wait",
			"until": "time",
			"time": 200,
		},
		{
			"name": "animate",
			"preset": "sans3_intro",
		},
		{
			"name": "wait",
			"until": "time",
			"time": 100,
		},
		{
			"name": "animate",
			"preset": "title",
		},
		// flash
		{
			"name": "wait",
			"until": "time",
			"time": 200,
		},
		{
			"name": "soul",
			"mode": "red",
			"pulse": true,
			"hidden": true,
			"gravity": "down",
			"force": 1,
		},
		{
			"name": "sans",
			"id": 0,
			"hidden": true,
		},
		{
			"name": "sans",
			"id": 1,
			"hidden": true,
		},
		{
			"name": "sans",
			"id": 2,
			"hidden": true,
		},
		{
			"name": "sans",
			"id": 3,
			"hidden": true,
		},
	)
}
