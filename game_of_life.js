var initial_size 			= 40;
var live_dots 				= new HashTable();
var dying_dots 				= new HashTable();
var emerging_dots 			= new HashTable();
var checked_emerging_dots 	= new HashTable();
var top_most				= initial_size;
var bottom_most  			= 0;
var left_most   			= initial_size;
var right_most   			= 0;
var show_number				= true;

$( document ).ready(function() {
    init();
});

function init(){
	// create the initial board for seed dots
    var table = "";
    for (var i = 0; i <= initial_size; i++) {
    	table += '<tr>';
    	for (var j = 0; j <= initial_size; j++) {
    		if (i==0)
    			table += '<td class="cell_not_clickable">'+j+'</td>';
    		else if (j==0)
    			table += '<td class="cell_not_clickable">'+i+'</td>';
    		else
    			table += '<td id="'+j+'_'+i+'" class="cell_clickable cell_dead"></td>';
    	};
    	table += '</tr>';
    };
    $("#board").html(table);

    // register click events
    $(".cell_clickable").click( function(){
    	if ($(this).hasClass('cell_dead'))
    		$(this).attr('class', 'cell_clickable cell_live');
    	else 
    		$(this).attr('class', 'cell_clickable cell_dead');
    });
}

function draw_fitting_board(){
	// create the fitting board for current live dots with some margin
    var table = "";
    for (var i = top_most-1; i <= bottom_most + 1; i++) {
    	table += '<tr>';
    	for (var j = left_most-1; j <= right_most + 1; j++) {
    		if (i==top_most-1){ // top most line for number
    			if (show_number)
    				table += '<td class="cell_small">'+j+'</td>';
    		}
    		else if (j==left_most-1){ // left most line for number
    			if (show_number)
    				table += '<td class="cell_small">'+i+'</td>';
    		}
    		else {
    			table += '<td id="'+j+'_'+i+'" class="cell_small cell_dead"></td>';
    		}
    	};
    	table += '</tr>';
    };
    $("#board").html(table);

}

function colliborate_board(x, y){
	if (x > right_most) right_most = x;
	if (x < left_most) left_most = x;
	if (y > bottom_most) bottom_most = y;
	if (y < top_most) top_most = y;
}

function start(){
	$(".cell_live").each(function(index, value) {
		var x_y = $(this).attr('id');
	    live_dots.setItem(x_y, 1);
	    var arr = x_y.split("_");
		var x = parseInt(arr[0]);
		var y = parseInt(arr[1]);
		colliborate_board(x, y)
	});
}

function next(){
	dying_dots.clear();
    emerging_dots.clear();
    checked_emerging_dots.clear();
    top_most	= Number.MAX_VALUE;
	bottom_most = Number.MIN_VALUE;
	left_most   = Number.MAX_VALUE;
	right_most  = Number.MIN_VALUE;

    // go through current dots and find emerging and dying dots
	live_dots.each(function(k,v){
		var arr = k.split("_");
		var x = parseInt(arr[0]);
		var y = parseInt(arr[1]);
		
		colliborate_board(x, y);

		var live_neighbours = count_live_neighbours(x,y);
		if (live_neighbours<2 || live_neighbours>3){ //condition to die
			dying_dots.setItem(k, 1);
		}
		find_emerging_neighbours(x, y);
	});

	// add emergine dots 
	emerging_dots.each(function(k,v){
		live_dots.setItem(k);
	});

	// remove dying dots
	dying_dots.each(function(k,v){
		live_dots.removeItem(k);
	});
	

	draw_fitting_board();

	// mark live dots
	live_dots.each(function(k,v){
		$("#"+k).attr('class', 'cell_small cell_live');
	});
}

function auto(){
	setInterval(function(){next()},200);
}

function show_number_toggle(){
	show_number = !show_number;
}

function count_live_neighbours(x, y){
	var live_neighbour_count = 0;

	if (live_dots.hasItem((x-1)+'_'+(y-1))) //left top
		live_neighbour_count++;
	if (live_dots.hasItem((x)+'_'+(y-1))) //center top
		live_neighbour_count++;
	if (live_dots.hasItem((x+1)+'_'+(y-1))) //right top
		live_neighbour_count++;
	if (live_dots.hasItem((x-1)+'_'+(y))) //left center
		live_neighbour_count++;
	if (live_dots.hasItem((x+1)+'_'+(y))) //right center
		live_neighbour_count++;
	if (live_dots.hasItem((x-1)+'_'+(y+1))) //left bottom
		live_neighbour_count++;
	if (live_dots.hasItem((x)+'_'+(y+1))) //center bottom
		live_neighbour_count++;
	if (live_dots.hasItem((x+1)+'_'+(y+1))) // right bottom
		live_neighbour_count++;
	
	return live_neighbour_count;
}

function find_emerging_neighbours(x, y){
	if (!checked_emerging_dots.hasItem((x-1)+'_'+(y-1))) { //left top
		checked_emerging_dots.setItem((x-1)+'_'+(y-1), 1);
		if (count_live_neighbours(x-1, y-1) == 3){
			emerging_dots.setItem((x-1)+'_'+(y-1), 1);
		}
	}
	if (!checked_emerging_dots.hasItem((x)+'_'+(y-1))) { //center top
		checked_emerging_dots.setItem((x)+'_'+(y-1), 1);
		if (count_live_neighbours(x, y-1) == 3){
			emerging_dots.setItem((x)+'_'+(y-1), 1);
		}
	}
	if (!checked_emerging_dots.hasItem((x+1)+'_'+(y-1))) { //right top
		checked_emerging_dots.setItem((x+1)+'_'+(y-1), 1);
		if (count_live_neighbours(x+1, y-1) == 3){
			emerging_dots.setItem((x+1)+'_'+(y-1), 1);
		}
	}
	if (!checked_emerging_dots.hasItem((x-1)+'_'+(y))) { //left center
		checked_emerging_dots.setItem((x-1)+'_'+(y), 1);
		if (count_live_neighbours(x-1, y) == 3){
			emerging_dots.setItem((x-1)+'_'+(y), 1);
		}
	}
	if (!checked_emerging_dots.hasItem((x+1)+'_'+(y))) { //right center
		checked_emerging_dots.setItem((x+1)+'_'+(y), 1);
		if (count_live_neighbours(x+1, y) == 3){
			emerging_dots.setItem((x+1)+'_'+(y), 1);
		}
	}
	if (!checked_emerging_dots.hasItem((x-1)+'_'+(y+1))) { //left bottom
		checked_emerging_dots.setItem((x-1)+'_'+(y+1), 1);
		if (count_live_neighbours(x-1, y+1) == 3){
			emerging_dots.setItem((x-1)+'_'+(y+1), 1);
		}
	}
	if (!checked_emerging_dots.hasItem((x)+'_'+(y+1))) { //center bottom
		checked_emerging_dots.setItem((x)+'_'+(y+1), 1);
		if (count_live_neighbours(x, y+1) == 3){
			emerging_dots.setItem((x)+'_'+(y+1), 1);
		}
	}
	if (!checked_emerging_dots.hasItem((x+1)+'_'+(y+1))) { // right bottom
		checked_emerging_dots.setItem((x+1)+'_'+(y+1), 1);
		if (count_live_neighbours(x+1, y+1) == 3){
			emerging_dots.setItem((x+1)+'_'+(y+1), 1);
		}
	}
}