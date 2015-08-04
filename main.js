app = {
	init : function () {
		app.insertDefault();
		app.prepareSort();

		/* Attach Listeners */
		$('#provider_form').submit(function(e) {
			e.preventDefault();

			/* Convert form to javascript array */
			var values = {};
			$.each($(this).serializeArray(), function(i, field) {
			    values[field.name] = field.value;
			});

			/* Convert array to JSON for app.newTask to interpret */
			jsonString = JSON.stringify(values);
			app.newProvider('['+jsonString+']');
			$(this).find('input[type="text"]').val('');
		});

		$('.provider_list').on('click','.provider', function() {
			$(this).toggleClass('checked');
			$('.remove_provider .count').text($('.provider.checked').length == 0 ? '' : ' '+$('.provider.checked').length + ' provider'+($('.provider.checked').length>1 ? 's' : ''));
		});

		$('.remove_provider').click(function() {
			$('.provider.checked').remove();
			$(this).find('.count').text('');
		});
	},
	insertDefault : function () {
		var dummyJSON = '[{"last_name": "Harris", "first_name": "Mike", "email_address": "mharris@updox.com", "specialty": "Pediatrics", "practice_name": "Harris Pediatrics"}, {"last_name": "Wijoyo", "first_name": "Bimo", "email_address": "bwijoyo@updox.com", "specialty": "Podiatry", "practice_name": "Wijoyo Podiatry"}, {"last_name": "Rose", "first_name": "Nate", "email_address": "nrose@updox.com", "specialty": "Surgery", "practice_name": "Rose Cutters"}, {"last_name": "Carlson", "first_name": "Mike", "email_address": "mcarlson@updox.com", "specialty": "Orthopedics", "practice_name": "Carlson Orthopedics"}, {"last_name": "Witting", "first_name": "Mike", "email_address": "mwitting@updox.com", "specialty": "Pediatrics", "practice_name": "Witting’s Well Kids Pediatrics"}, {"last_name": "Juday", "first_name": "Tobin", "email_address": "tjuday@updox.com", "specialty": "General Medicine", "practice_name": "Juday Family Practice"} ]';
		app.newProvider(dummyJSON);
	},
	prepareSort : function () {
		/* Popupulate sort */
		$('#sort_by').append('<option disabled selected>Sort By</option>');
		$('#provider_form label').each(function() {
			n = $(this).attr('for');
			t = $(this).text();
			$('#sort_by').append('<option value="'+n+'">'+t+'</option>');
		});

		/* Add event listener to sort */
		$('#sort_by').change(function() {
			sort_by = $(this).val();
			$('.provider').sort(function(a, b) {
				console.log(sort_by);
	            if ($(a).find('.'+sort_by).text() < $(b).find('.'+sort_by).text()) {
	                return -1;
	            } else if ($(a).find('.'+sort_by).text() > $(b).find('.'+sort_by).text()) {
	                return 1;
	            } else {
	                return 0;
	            }
	        }).detach().appendTo('.provider_list');
		});
	},
	newProvider : function (jsonString) {
		/* Convert JSON to array */
		var jsonArr = $.parseJSON(jsonString);
		/* Call the insert function for each item */
		for (i=0;i<jsonArr.length;i++) {
			app.insertProvider(jsonArr[i]);
		}
	},
	insertProvider : function (item) {
		/* By creating a separate insert function, we can do more error checking before it actually hits the DOM */
		for (key in item) {
			if ($('#'+key).length == 0 || item[key].trim() == '') { /* Simple error check by checking if the input exists (no one has altered the dom) and that SOMETHING was entered for each value */
				alert('Invalid data. Please make sure the data you\'ve entered is correct');
				return false;
			}
		}

		/* Everything looks ok. Let's insert it */
		$('.provider_list').prepend('<li class="provider"><span class="fl"><div class="name"><span class="last_name">'+item['last_name']+'</span>, <span class="first_name">'+item['first_name']+'</span></div><div class="email_address">'+item['email_address']+'</div></span><span class="fr tr"><div class="specialty">'+item['specialty']+'</div><div class="practice_name">'+item['practice_name']+'</div></span><div class="cb"></div></li>');
	}
}

$(document).ready(function() {
	app.init();
});