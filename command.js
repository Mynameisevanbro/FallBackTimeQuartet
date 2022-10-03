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
			"id": 0,
			"hidden": true,
			"animation": "idle",
			"head": "sans1_head_eyeless0"
		},
		{
			"name": "sans",
			"id": 1,
			"hidden": false,
			"animation": "idle",
			"head": "sans1_head_eyeless0"
		},
		{
			"name": "sans",
			"id": 2,
			"hidden": true,
			"animation": "idle",
			"head": "sans1_head_eyeless0"
		},
		{
			"name": "sans",
			"id": 3,
			"hidden": true,
			"animation": "idle",
			"head": "sans1_head_eyeless0"
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
			"gravity": "left",
			"force": 8,
		},
		{
			"name": "wait",
			"until": "time",
			"time": 100,
		},
		{
			"name": "soul",
			"mode": "blue",
			"pulse": false,
			"hidden": false,
			"gravity": "right",
			"force": 8,
		},
		{
			"name": "wait",
			"until": "time",
			"time": 100,
		},
		{
			"name": "soul",
			"mode": "blue",
			"pulse": false,
			"hidden": false,
			"gravity": "up",
			"force": 8,
		},
		{
			"name": "wait",
			"until": "time",
			"time": 100,
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
			"preset": "title_phase1",
		},
		{
			"name": "animate",
			"preset": "box_down",
		},
		{
			"name": "animate",
			"preset": "sans_intro",
		}
	)
}


function load_command_lmao() {
	command.push(
		{
			"name": "box",
			"preset": "square",
			"hidden": false,
		},
		{
			"name": "soul",
			"mode": "blue",
			"pulse": false,
			"hidden": false,
			"gravity": "up",
			"force": 10,
		},
		{
			"name": "wait",
			"until": "time",
			"time": 10,
		},{
			"name": "soul",
			"mode": "blue",
			"pulse": false,
			"hidden": false,
			"gravity": "left",
			"force": 10,
		},
		{
			"name": "wait",
			"until": "time",
			"time": 10,
		},
		{
			"name": "soul",
			"mode": "blue",
			"pulse": false,
			"hidden": false,
			"gravity": "right",
			"force": 10,
		},
		{
			"name": "wait",
			"until": "time",
			"time": 10,
		},
		{
			"name": "soul",
			"mode": "blue",
			"pulse": false,
			"hidden": false,
			"gravity": "down",
			"force": 10,
		},
		{
			"name": "wait",
			"until": "time",
			"time": 10,
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
		// play music
		{
			"name": "wait",
			"until": "load",
			"time": 0,
		},
		{
			"name": "audio",
			"file": "theme0",
		},
		// sans(es) enter animation
		{
			"name": "animate",
			"preset": "sans_intro",
		},
		{
			"name": "wait",
			"until": "time",
			"time": 150,
		},
		{
			"name": "wait",
			"until": "time",
			"time": 150,
		},
		{
			"name": "wait",
			"until": "time",
			"time": 75,
		},
		{
			"name": "animate",
			"preset": "title",
		},
		{
			"name": "wait",
			"until": "time",
			"time": 75,
		},
		// animate box down
		{
			"name": "wait",
			"until": "time",
			"time": 110,
		},
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
		// show phase 1
		{
			"name": "wait",
			"until": "time",
			"time": 100,
		},
		{
			"name": "animate",
			"preset": "title_phase1",
		},
		// flash
		{
			"name": "wait",
			"until": "time",
			"time": 600,
		},
		{
			"name": "soul",
			"mode": "red",
			"pulse": true,
			"hidden": true,
			"gravity": "down",
			"force": 1,
		},
	)
}
