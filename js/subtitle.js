/**
 * @file
 * A JavaScript file for the theme.
 *
 * In order for this JavaScript to be loaded on pages, see the instructions in
 * the README.txt next to this file.
 */

// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - https://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth
(function ($, Drupal, window, document, undefined) {

// Global Variables for Audio
    var audioContext;
    var audioBuffer;
    var sourceNode;
    var analyserNode;
    var javascriptNode;
    var audioData = null;
    var audioPlaying = false;
    var sampleSize = 2048; // number of samples to collect before analyzing data
    var fftSize = 512; // must be power of two // **
    var frequencyArray; // array to hold frequency data
    var gainNode;


    // This must be hosted on the same server as this page - otherwise you get a Cross Site Scripting error
    var audioUrl;
    
    // Global Variables for the Graphics
    var canvasWidth = 512;
    var canvasHeight = 256;
    var ctx;
    var gradient; // **
    
    var audio_player;
    var lang = 'en';
    // To understand behaviors, see https://drupal.org/node/756722#behaviors
Drupal.behaviors.my_custom_behavior = {
    attach: function(context, settings) {
	canvas = $("#player-sound-vis").get()[0]
	ctx = $("#player-sound-vis").get()[0].getContext("2d");
//	var audio_player = Popcorn("#intro-video");
	var nid = '';
	var sub_count = 0;
	var sub_person = '';
	window.requestAnimFrame = (function(){
	    return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function(callback, element){
		    window.setTimeout(callback, 1000 / 60);
		};
	})();
	
	window.AudioContext = (function(){
	    return window.webkitAudioContext || window.AudioContext || window.mozAudioContext;
	})();



	function print_subtitle(text) {
	    container = '#subtitle-container';
	    time = audioUrl.currentTime;
	    for( x in Drupal.settings[sub_person][lang]) {
//		key = 'key' + String(x);
		if(Drupal.settings[sub_person][lang][x].sub_in <= time && Drupal.settings[sub_person][lang][x].sub_out> time) {
		    text = Drupal.settings[sub_person][lang][x].sub_text;
		    $(container).html(text);
		}
	    }
	    
	    sub_count = sub_count + 1;
	}

	function clear_subtitles() {
	    $('#subtitle-container').text('');
	}

	function cue_player() {
	    sub_person = 'person' + nid;
	    sub_count = 0;
	    if(sub_person in Drupal.settings == true) {
		for (x in Drupal.settings[sub_person][lang]) {
		
		    sub_in = Drupal.settings[sub_person][lang][x].sub_in;
		    //		sub_text = Drupal.settings[sub_person][x].sub_text;
		    audio_player.cue(sub_in, function() {
			print_subtitle();
		    });
		
		    sub_out = Drupal.settings[sub_person][lang][x].sub_out;
		    audio_player.cue(sub_out-0.001, function() {
			clear_subtitles();
		    });
		}
	    }
	}

	var playing = false;
	$(document).ready(function() {
	    try {
		audioContext = new AudioContext();
	    } catch(e) {
		alert('Web Audio API is not supported in this browser');
	    }
	});
//    alert(Drupal.settings.person77.key5.sub_text)    
	function play() {
	//	e.preventDefault();
	    set_volume();
	    audioUrl.play();
	    audioPlaying = true;
	    $("#play-pause-btn").css("background","url('../sites/all/themes/quipu_theme_1/images/icons/pause_bt.png') center center no-repeat");
	    track_progress();
	}
	 
	function pause() {
	    audioUrl.pause()
	    audioPlaying = false;   
	    $("#play-pause-btn").css("background","url('../sites/all/themes/quipu_theme_1/images/icons/play_bt.png') center center no-repeat");
	}

	function play_pause() {
	    if (audioPlaying === false) {
		play();
	    } else {
		pause();
	    }
	}
	
	var pc_complete = 0;

	function track_progress() {
	    pc_complete = (audioUrl.currentTime/audioUrl.duration) * 100;
	    $("#progress").css("width",String(pc_complete)+"%");
	    if(audioPlaying == true) {
		requestAnimFrame(function() {
		    track_progress();
		});
	    };
	}

	$("#welcome-close-btn, #tour-btn").click(function() {
	    $("#welcome-pop-up").css("display","none");
	    $(".node-audio-story, .node-audio-feedback").css("opacity","1");
	});

	$("#video-btn").click(function() {
	    $("#welcome-pop-up").css("display","none");
	    $("#video-wrapper").css("display","block");
	});

	$("#video-close-btn").click(function() {
	    $("#video-wrapper").css("display","none");
	    $(".node-audio-story, .node-audio-feedback").css("opacity","1");
	});

	$("#progress-bar").click(function(e) {
	    var distance = e.pageX - $(this).offset().left;
	    var pc = (distance/740)*100;
	    var time = audioUrl.duration * (pc * 0.01);
	    audioUrl.currentTime = time;
	    $("#progress").css("width",String(pc)+"%");
	    print_subtitle();
	});

	$("#volume").change(function(e) {
	    set_volume();
	});

	function set_volume() {
	    var volume = $("#volume").val();
	    var fraction = parseInt($("#volume").val()) / parseInt($("#volume").attr("max"));
	    var invert = 1 - fraction;
	    gainNode.gain.value = invert * invert;
	}

	$("#volume-btn").hover(function() {
	    $("#volume-container").addClass("on");
	}, function() {
	    $("#volume-container").removeClass("on");
	});

	$("#lang-select").hover(function() {
	    $("#lang-container").addClass("on");
	}, function() {
	    $("#lang-container").removeClass("on");
	});

	$(".node-audio-story, .node-audio-feedback").click(function() {
	    $(".node-audio-story, .node-audio-feedback").css("opacity", "0.2");
	    nid = $(this).find(".play_button").attr('data-nid');
	    id = 'audio-' + nid;
	    audio_player = Popcorn("#"+id);
	    
	    cue_player();
	    audioUrl = document.getElementById(id);
	    setupAudioNodes();
	    javascriptNode.onaudioprocess = function () {
		analyserNode.getByteFrequencyData(freqData); // **
		if (audioPlaying == true) {
		    requestAnimFrame(drawFrequencyDomain); // **
		}
	    }
	    play_pause();
	    if($(this).hasClass("node-audio-story")==true) {
		$("#src-icon").css("background","url('../sites/all/themes/quipu_theme_1/images/icons/phone_icon_player.png')");
	    } else if($(this).hasClass("node-audio-feedback")==true) {
		$("#src-icon").css("background","url('../sites/all/themes/quipu_theme_1/images/icons/internet_icon_player.png')");
	    }
	    $("#player-name").text($(this).find(".audio_story_title_wrap .field-item.even").text());
	    $("#player-time").text($(this).find(".audio_story_time").text());
	    $("#player-date").text($(this).find(".audio_story_date").text());
	    $("#player-length").text($(this).find(".audio_story_length").text());
	    if ($(this).find(".node-header-bar").hasClass("audience")) {
		$("#player-header-bar").css("background-color","rgb(160,201,217)");
		$("#player-sound-vis").css("background-color","rgba(160,201,217,0.5)");
		$("#player-name").css("color","rgb(160,201,217)");
		$("#player-length").css("color","rgb(160,201,217)");
	    } else if ($(this).find(".node-header-bar").hasClass("contributor")) {
		$("#player-header-bar").css("background-color","rgb(81,166,135)");
		$("#player-sound-vis").css("background-color","rgba(81,166,135,0.5)");
		$("#player-name").css("color","rgb(81,166,135)");
		$("#player-length").css("color","rgb(81,166,135)");
	    };
	    $("#audio-player-wrapper").css("opacity","1");
	    $("#audio-player-wrapper").css("pointer-events","auto");
//	    audioUrl = "http://"+$(this).find(".story_player source").attr("src").substr(11);

	    
	});

	var current_role = '';

        $(".node-audio-story, .node-audio-feedback").hover(function() {
            if($(this).hasClass("contributor")==true) {
                $(this).removeClass("contributor");
                current_role = 'contributor';
		$(this).css("background-color","rgba(105,169,184,1)");
		$(this).find(".play_button").css("background","url('../sites/all/themes/quipu_theme_1/images/icons/play_circle.png') center center no-repeat");
		$(this).find(".play_button").css("background-color","rgba(72,115,125,0.4)");
            } else if($(this).hasClass("audience") == true) {
		$(this).removeClass("audience");
                current_role = 'audience';
		$(this).css("background-color","#FF8D5E");
		$(this).find(".play_button").css("background","url('../sites/all/themes/quipu_theme_1/images/icons/play_circle.png') center center no-repeat");
		$(this).find(".play_button").css("background-color","rgba(255,112,84,0.8)");
	    };
            
        }, function() {
//              $(this).css("background-color","#A6A8AB");                                                                                     
            $(this).addClass(current_role);
            $(this).find(".play_button").css("background-color", "transparent");
	    if($(this).hasClass("node-audio-story")==true) { 
		$(this).find(".play_button").css("background","url('../sites/all/themes/quipu_theme_1/images/icons/phone_circle.png') center center no-repeat");
	    } else if ($(this).hasClass("node-audio-feedback")==true) {
		$(this).find(".play_button").css("background","url('../sites/all/themes/quipu_theme_1/images/icons/internet_circle.png') center center no-repeat");
	    }
        });


	$("#player-close-btn").click(function() {
	    $(".node-audio-story, .node-audio-feedback").css("opacity","1");
	    $("#audio-player-wrapper").css("pointer-events","none");
	    $("#audio-player-wrapper").css("opacity","0");
	    $("#subtitle-container").text("");
	    if(audioPlaying===true) {
		pause();
	    }
	});

	$("#play-pause-btn").click(function() {
	    play_pause();
	});

	$("#es-button").click(function() {
	    lang = 'es';
	    print_subtitle();
	});

	$("#en-button").click(function() {
	    lang = 'en';
	    print_subtitle();
	});
	var keys = 'key5';
//	var person = 'person77';
//	alert(Drupal.settings[person][keys].sub_text)
    }
}

function setupAudioNodes() {
//    sourceNode = audioContext.createBufferSource();
    sourceNode = audioContext.createMediaElementSource(audioUrl);
    gainNode = audioContext.createGain();
    analyserNode = audioContext.createAnalyser();
    analyserNode.smoothingTimeConstant = 0.5; // **
    analyserNode.fftSize = fftSize; // **
    javascriptNode = audioContext.createScriptProcessor(sampleSize, 1, 1);
    
// Create the array for the data values
    freqData = new Uint8Array(analyserNode.frequencyBinCount); // **
 
    // Now connect the nodes together
//    sourceNode.connect(audioContext.destination);
    sourceNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.connect(analyserNode);
    analyserNode.connect(javascriptNode);
    javascriptNode.connect(audioContext.destination);
}

// Load the audio from the URL via Ajax and store it in global variable audioData
// Note that the audio load is asynchronous
function loadSound(url) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    
    // When loaded, decode the data and play the sound
    request.onload = function () {
	audioContext.decodeAudioData(request.response, function (buffer) {
	    audioData = buffer;
	    playSound(audioData);
	}, onError);
    }
    request.send();
}
    
    // Play the audio and loop until stopped
function playSound(buffer) {
    sourceNode.buffer = buffer;
    sourceNode.start(0); // Play the sound now
    sourceNode.loop = false;
    audioPlaying = true;
}
    
function onError(e) {
    console.log(e);
}
    
function drawFrequencyDomain() {
/*    clearCanvas();
    for (var i = 0; i < frequencyArray.length; i++) {
    ctx.fillStyle = '#000000'; // **
    var y = canvasHeight - Math.round(frequencyArray[i]); // **
    ctx.fillRect(i,0,1,y); // **
    }
    }*/

    var barWidth = (Math.ceil((canvas.width/2) / (analyserNode.frequencyBinCount * 0.5))) *2;
//    var barWidth = 10;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < analyserNode.frequencyBinCount; i++) {
        ctx.fillStyle = 'rgba(81, 166, 135, 0.1)';
        if ((canvas.width/2) + (barWidth * i) + barWidth + barWidth < canvas.width) {
	    var amp = -(Math.floor((freqData[i] / 255) * canvas.height) + 1);
	    var offset = (canvas.height + amp)/2;
	    ctx.fillRect((barWidth * i) + barWidth + (canvas.width/2), canvas.height - offset, barWidth - 1, amp);
        }
        if ((canvas.width/2) - (barWidth * i) - barWidth >= 0) {
	    var amp = -(Math.floor((freqData[i] / 255) * canvas.height) + 1);
	    var offset = (canvas.height + amp)/2;
	    ctx.fillRect((canvas.width/2) - (barWidth * i), canvas.height - offset, barWidth - 1, amp);
        }
    }
}
function clearCanvas() {
    ctx.fillStyle = 'rbg(60,60,60)'; // **
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}
    
})(jQuery, Drupal, this, this.document);
