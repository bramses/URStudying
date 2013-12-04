$(document).ready(function () {
 
  var classArea;
  var class_is;
  var study_area;
  var time_start;
  var time_end;
  var notes_took;
  var which_side;
  $("#sub_me").attr("disabled", "disabled");



	$("#in_group").click( function(){
		$("#init_choice").fadeOut(); //fades out buttons
		$("#what_class").delay(500).fadeIn();
		which_side = 0;
	});

	$("#lf_group").click( function(){
		$("#init_choice").fadeOut();
		$("#what_class").delay(500).fadeIn();
		which_side = 1;
	})

	//sets up what class you're in
	classArea = $('#class_selected option:selected').text();
	$("#class_selected").one("change",function(){
		$("#section_chose").fadeIn();
	});

	$("#class_selected").change(function(){
		classArea = $('#what_class option:selected').text();

	});

	//section
	class_is = $('#section').val();
	$("#section").on("input",function(){
		$("#sub_me").removeAttr("disabled");

	});
	$("#section").on('input',function(){
			class_is = $('#section').val();
	});

	$("#sub_me").click( function() {
		if ($('#section').val() == "") 
			alert("You need to put in a section for your class!");
		else if (which_side == 1)
		{
			alert('snarf ');
			$("#check_in_button").fadeIn();
		}
		else 
			$('#lib_in').fadeIn();
	});

	$("#library_study").one("change",function(){
		study_area = $('#library_study option:selected').text();
		$("#lib_text").html('How long will your group be studying in ' + study_area + '?')
		$('#time_chose').fadeIn();
	});
	$("#library_study").change(function(){
		study_area = $('#library_study option:selected').text();
	});

	time_start = $('#time_start').val();
	time_end = $('#time_end').val();

	$("#time_chose").on('input', function() {
		time_start = $('#time_start').val();
		time_end = $('#time_end').val();
	});
	$("#sub_me2").click( function() {
		if($('#time_start').val() == "" || $('#time_end').val() == "")
			alert("You need to put in times!")
		else
		{	
			$('#notes').fadeIn();
			$('#check_in_button').fadeIn();
		}
	});

	notes_took = $('#notes_section').val();
	$("#section").on('input',function(){
		notes_took = $('#notes_section').val();
	});

$(function(){
	$('.timepicker').timepicker({ 'scrollDefaultNow': true });
});
$(function(){
	$('.timepicker2').timepicker({ 'scrollDefaultNow': true });
});

$("#section").keydown(function(event) {
		// Allow only backspace and delete and "h" for honors courses
		if ( event.keyCode == 46 || event.keyCode == 8 || event.keycode == 72 || event.keycode == 104) {
			// let it happen, don't do anything
		}
		else {
			// Ensure that it is a number and stop the keypress
			if (event.keyCode < 48 || event.keyCode > 57) {
				event.preventDefault();	
			}	
		}
	});

	$("#check_in").click( function()
	{
		
	});

});

