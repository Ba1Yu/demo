$(function() {
	var hgt = ($('.wrapper').height() - $('.content').height()) / 2;
	$('.inner').css({
		'padding-top': hgt + 'px'
	});
});