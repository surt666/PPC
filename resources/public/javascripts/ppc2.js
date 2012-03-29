
var prod = {
//  init:function() {

  NicTest:function() {
  		console.log("in function");
//			$.get('../NiCtest_simple.json', function(d){console.log()	;});
//  		console.log("in function");

			$.getJSON('../NiCtest_simple.json', function(data) {
			  console.log("in callback");
			  var items = [];
			
			  $.each(data, function(key, val) {
			    items.push('<tr><td>' + key + '">' + val + '</li>');
			  });
			
			  $('<ul/>', {
			    'class': 'my-new-list',
			    html: items.join('')
			  }).appendTo('body');
			}	
			
			
		);
	}

}