$(document).ready(function () {
 
  var classArea;
  var class_is;
  var study_area;
  var time_start;
  var time_end;
  var notes_took;
  var which_side;
  var split_add_five = "12:00pm";
  var final_end_duration = "12:00pm";
  $("#sub_me").attr("disabled", "disabled");
  //$("#sub_me_lf").attr("disabled", "disabled");


  $(".header").click(function () {

    $header = $(this);
    //getting the next element
    $content = $header.next();
    //open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
    $content.slideToggle(500, function () {
        //execute this after slideToggle is done
        //change text of header based on visibility of content div
        $header.text(function () {
            //change text based on condition
            return $content.is(":visible") ? "Collapse" : "Expand for more info about the group!";
        });
    });

});


	$("#in_group").click( function(){
		$("#init_choice").fadeOut(); //fades out buttons
		$("#what_class").delay(500).fadeIn();
		$('.footer').fadeOut();
	});

	$("#lf_group").click( function(){
		$("#init_choice").fadeOut();
		$("#what_class2").delay(500).fadeIn();
		$('.footer').fadeOut();

	})

	//sets up what class you're in
	classArea = $('#class_selected option:selected').text();
	$("#class_selected").one("change",function(){
			$("#section_chose").fadeIn();
		
	});

	$("#class_selected").change(function(){
		classArea = $('#what_class option:selected').text();

	});

	classArea = $('#class_selected2 option:selected').text();
	$("#class_selected2").one("change",function(){
			$("#section_chose2").fadeIn();
		
	});

	$("#class_selected").change(function(){
		classArea = $('#what_class option:selected').text();

	});

	//section
	class_is = $('#section').val();
	$("#section").on("input",function(){
		$("#sub_me").removeAttr("disabled");
		$("#sub_me_lf").removeAttr("disabled");


	});
	$("#section").on('input',function(){
			class_is = $('#section').val();
	});

	$("#sub_me").click( function() {
		if ($('#section').val() == "") 
			alert("You need to put in a section for your class!");
		else 
		{
			$('#lib_in').fadeIn();
		}
	});


	//library located in
	$("#library_study").one("change",function(){
		study_area = $('#library_study option:selected').text();
		if($('#library_study option:selected').text() == "" || $("input[type=radio][name=how_many]:checked").val() == "" )
			alert("You need to choose how many people are in your group and what library you're in!");
		else{
			$("#lib_text").html('How long will your group be studying in ' + study_area + '?')
			$('#time_chose').fadeIn();
		}
	});
	$("#library_study").change(function(){
		if($('#library_study option:selected').text() == "" || $("input[type=radio][name=how_many]:checked").val() == "" )
			alert("You need to choose how many people are in your group and what library you're in!");
		study_area = $('#library_study option:selected').text();
	});

	time_start = $('.timepicker').val();
	time_end = $('.timepicker2').val();

	$("#time_chose").on('change', function() {
		time_start =$('.timepicker').val();
		time_end = $('.timepicker2').val();
	    split_add_five =  $('.timepicker').val().split(":");
	    
	    var int_plus_five = parseInt(split_add_five) + 5;
	    var change_to_regular_times = 0;
	    if(int_plus_five >= 12)
	    {
	    	change_to_regular_times = int_plus_five - 12;
	    	split_add_five[1] = split_add_five[1].replace("pm","am");
	    }
	    if(int_plus_five < 12)
	    	change_to_regular_times = int_plus_five;
	    final_end_duration = change_to_regular_times + ':' + split_add_five[1];
	});
	$("#sub_me2").click( function() {
		if($('#time_start').val() == "" || $('#time_end').val() == "")
			alert("You need to put in times!")

		else
		{	
			check_for_entry(classArea, class_is, time_end );
			$('#notes').fadeIn();
			$('#check_in_button').fadeIn();
		}
	});

	notes_took = $('#notes_section').val();
	$("#section").on('input',function(){
		notes_took = $('#notes_section').val();
	});

$(function(){ //timepicker. John Thornton is a god among men. http://jonthornton.github.io/jquery-timepicker/
	$('.timepicker').timepicker({ 'scrollDefaultNow': true });
});
$(function(){
	$('.timepicker2').timepicker({ 'scrollDefaultNow': true  });
});/*,'minTime': time_start, 'maxTime': final_end_duration, 'showDuration': true*/

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

	function check_for_entry(classArea, class_is, end)
	{
		alert(classArea);
		alert(class_is);
		alert(end);
		classArea = classArea.split(" ");
		//$('#loading').show();
		$.post('/check_for_entry', {
			classArea: classArea[0], 
			class_is: class_is,
			end: end
		}).done(function(count){
			//$('#loading').hide();
			alert(count);
		}).fail(function(){
	     	$('#loading').hide();
			alert('idk');
		});

	}

});

