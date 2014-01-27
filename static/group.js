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

  //turns span into input field and appends it to the parent element (<p> in this case)
  $('.size_change_class').click(function(){
  	var input = $('<input />', {
  		'type': 'text',
  		'name': 'how_many',
  		'id': this.id,
  		'class': 'size_change_class',
  		'value': $(this).html()
  	});
  	 $(this).parent().append(input);
     $(this).remove();
     input.focus();
     if($(this).html == "0")
     {
     	alert("You can't have zero people in your group!");
     }

     $(".size_change_class").keydown(function(event) {
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

     /*turns input back into span. deciding if i need/want this functionality, since posting form becomes more difficult
     $('.size_change_class').blur( function () {
     	
        $(this).parent().append($('<span />').html($(this).val()));
        $(this).remove();
    });
*/
  });
	

	$("#author_of").change(function(){
		if($("#author_of").val() == "")
		{
			alert("You need to put in a name!");
			$("#sub_me").attr("disabled", "disabled");
		}
		else if($("#author_of").val() == "CETL_Library_UR")
		{

		}
		else
		{
			$("#sub_me").attr("disabled", "");
		}
	});		
	$('.post_table').on("change",function(){
		var just_id = this.id;
		just_id = just_id.split("_");
		$('#send_id').val(just_id[1]);
	})


	//same as above for start time field
  $('.start_time').click(function(){
  	var input = $('<input />', {
  		'type': 'text',
  		'name': 'time_start',
  		'id': this.id,
  		'class': 'time start ui-timepicker-input timepicker',
  		'autocomplete': 'off',
  		'value': $(this).html()
  	});
  	 $(this).parent().append(input);
     $(this).remove();
     input.focus();

 });
	//same as above for end time field
   $('.end_time').click(function(){
  	var input = $('<input />', {
  		'type': 'text',
  		'name': 'time_end',
  		'id': this.id,
  		'class': 'time end ui-timepicker-input timepicker',
  		'autocomplete': 'off',
  		'value': $(this).html()
  	});
  	 $(this).parent().append(input);
     $(this).remove();
     input.focus();


 });

	$('.change_notes').click(function(){
  	var input = $('<textarea />', {
  		'name': 'notes_section',
  		'id': this.id,
  		'class': 'change_notes',
  		//'value': $('notes_area').html()
  		'placeholder': $.trim($(this).text().replace("Click your text to change info about your group",""))
  	});
  	 $(this).parent().append(input);
     $(this).remove();
     input.focus();

    });


	//expanding function -- expands extra info about a group
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
            return $content.is(":visible") ? "Collapse" : "Click  me to expand for more info about the group!";
        });
    });

});

  //for cancel button in edit posts page
  $('.cancel_section_button').click(function(){
  		
  		var answer = confirm("Are you sure you want to cancel this study group session?");
  		if(answer)
  		{
  			var retrieve_id = this.id.replace("button","");
  			$('#' + retrieve_id).val("true"); //looking at button -- change to input
  			var get_numerical_id = this.id.replace("cancel_section_button", "");
  			$('#send_id').val(get_numerical_id);
  			$($(this).parent().parent()).remove();

  				var elements_left = document.getElementsByTagName('tr');
  				if(elements_left[0] == undefined)//if zero tr elements submits form automatically
  					$('#edit_submit_form').trigger("submit");
  					
  			//.html("<p class='lead'> Removed. Click Submit Edits to finalize. <a href=''>Undo</a> </p>" );
  		}	
  		else
  		{
  			//Do nothing
  		}
  });

  //first two buttons on site -- everything below saves variables and changes html
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
			$("#lib_text").html('When will your group be studying in ' + study_area + '?')
			$('#time_chose').fadeIn();
		}
	});
	$("#library_study").change(function(){
		study_area = $('#library_study option:selected').text();
	});

	time_start = $('.timepicker').val();
	time_end = $('.timepicker2').val();

	//before datepair tried a hack implementation -- saving for potential future use
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
	if($("#author_of").val() == "")
	{
		alert("You need to put in a name!");
		$("#check_in").attr("disabled", "disabled");
		
		$("#author_of").change(function(){
			$("#check_in").prop("disabled", false);
		});
	}
	else if($('#library_study option:selected').text() == "" || $("input[type=radio][name=how_many]:checked").val() == "" )
	{
		alert("You need to choose how many people are in your group and what library you're in!");
		$("#check_in").attr("disabled", "disabled");

		$("#library_study").change(function(){
			$("#check_in").prop("disabled", false);
		});
	}
	else if($('#what_class option:selected').text() == "" )
	{
		alert("You need to choose a course!");
		$("#check_in").attr("disabled", "disabled");
		
		$("#class_selected").change(function(){
			$("#check_in").prop("disabled", false);
		});
	} 
	else
	{
		$("#check_in").prop("disabled", false);
	}
});
	//checks for current entries in DB for similar entries
	function check_for_entry(classArea, class_is, end)
	{
		classArea = classArea.split(" ");
		//$('#other_groups').html('Checking if there are any groups for' + classArea[0] + ' ' + class_is + 'already...' + $('#loading').show());
		$.post('/check_for_entry', {
			classArea: classArea[0], 
			class_is: class_is,
			end: end
		}).done(function(count){
			$('#loading').hide();
			count = parseInt(count);
			if( count > 0)
			{
				$('#other_groups').show();
				$('#other_groups').html('There are  group(s) studying ' + classArea[0] + ' ' + class_is + ' already. Would you like to look at these groups? ');
				$('#other_groups').append("<br><button id='sure' type='button' class='btn btn-success btn-small pagination-centered'>Sure!</button> <button id='no_thanks' type='button' class='btn btn-danger btn-small pagination-centered'>No thanks -- I'll make my own</button>");
				$('#sure').click(function(){
					window.location.replace('http://127.0.0.1:5000/checkin?what_class2=' + classArea[0] + '&section_chose2=' + class_is)
				});
				$('#no_thanks').click(function(){
					$('#other_groups').hide()
				});	
			}

		}).fail(function(){
	     	$('#loading').hide();
			alert('Cannot connect to server');
		});

	}

});

