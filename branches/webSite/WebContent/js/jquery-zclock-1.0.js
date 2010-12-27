/*
 * JQuery zClock 1.0
 *
 * Copyright (c) 2010 Hunter.z
 *
 * Date: 2010-08-01
 *
 */
(function(e){function g(b){f(b);setInterval(function(){f(b)},1E3)}function f(b){var a=new Date;a.getFullYear();a.getMonth();a.getDay();var c=a.getHours(),d=a.getMinutes(),h=a.getSeconds();b.secondDiv.attr("title",i(a,"yyyy-MM-dd hh:mm:ss"));a=b.hourDiv.children();try{a.rotate(j(b,c,d));a.show()}catch(n){a.hide()}a=b.hourDiv.children().get(0);dx=(a.parentNode.parentNode.offsetWidth-a.offsetWidth)/2;dy=(a.parentNode.parentNode.offsetHeight-a.offsetHeight)/2;a.parentNode.style.top=dy+"px";a.parentNode.style.left=
dx+"px";c=b.minuteDiv.children();try{c.rotate(k(b,d));c.show()}catch(o){c.hide()}c=b.minuteDiv.children().get(0);dx=(c.parentNode.parentNode.offsetWidth-c.offsetWidth)/2;dy=(c.parentNode.parentNode.offsetHeight-c.offsetHeight)/2;c.parentNode.style.top=dy+"px";c.parentNode.style.left=dx+"px";d=b.secondDiv.children();try{d.rotate(l(b,h));d.show()}catch(p){d.hide()}d=b.secondDiv.children().get(0);dx=(d.parentNode.parentNode.offsetWidth-d.offsetWidth)/2;dy=(d.parentNode.parentNode.offsetHeight-d.offsetHeight)/
2;d.parentNode.style.top=dy+"px";d.parentNode.style.left=dx+"px"}function j(b,a,c){if(a>=12)a-=12;c=360*a/12+c/60*30;a=b.hourRotate>c?c+360-b.hourRotate:c-b.hourRotate;b.hourRotate=c;return a}function k(b,a){var c,d=360*a/60;c=b.minuteRotate>d?d+360-b.minuteRotate:d-b.minuteRotate;b.minuteRotate=d;return c}function l(b,a){var c,d=360*a/60;c=b.secondRotate>d?d+360-b.secondRotate:d-b.secondRotate;b.secondRotate=d;return c}function i(b,a){var c={"M+":b.getMonth()+1,"d+":b.getDate(),"h+":b.getHours(),
"m+":b.getMinutes(),"s+":b.getSeconds(),"q+":Math.floor((b.getMonth()+3)/3),S:b.getMilliseconds()};if(/(y+)/.test(a))a=a.replace(RegExp.$1,(b.getFullYear()+"").substr(4-RegExp.$1.length));for(var d in c)if(RegExp("("+d+")").test(a))a=a.replace(RegExp.$1,RegExp.$1.length==1?c[d]:("00"+c[d]).substr((""+c[d]).length));return a}function m(){return{container:null,init:function(b){this.container=b;return this}}}e.fn.zClock=function(b){var a={container:null,hourRotate:0,minuteRotate:0,secondRotate:0};b&&
e.extend(a,b);a.container=this;a.hourDiv=e("#zclock_hour");a.minuteDiv=e("#zclock_minute");a.secondDiv=e("#zclock_second");g(a);(new m).init(this)}})(jQuery);