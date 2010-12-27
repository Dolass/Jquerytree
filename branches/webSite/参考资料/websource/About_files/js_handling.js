/*addLoadEvent(hide_js_note);*/

function addLoadEvent(func)	{
var oldonload = window.onload;
if (typeof window.onload != 'function')	{
	window.onload = func;
	}
	else	{
	window.onload = function()	{
		oldonload();
		func();
		}
	}
}

/*function hide_js_note()	{
var display_style = "display: none;";
var js_note = document.getElementById("js_note");
js_note.setAttribute("style", display_style);
}*/