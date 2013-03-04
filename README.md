# FishBox #
FishBox is a jQuery plugin use for display iframe and html content.

Example: [http://www.ifishblog.com/fishbox/](http://www.ifishblog.com/fishbox/)

## How to use ##

----------
`<head>
	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min.js"></script>
    <link rel="stylesheet" href="/fishbox/jquery.fishbox.css" type="text/css" media="screen" />
    <script type="text/javascript" src="/fishbox/jquery.fish.js"></script>
</head>
`

use script like this:

`
$(function(){
	$('a').fishbox({
		type:'iframe',
		href:'http://www.xinli001.com/',
		width:700,
		height:550,
		showmask:true
	}).click();
});
`