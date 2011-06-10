/*
 * JQuery zTree core 3.0
 * http://code.google.com/p/jquerytree/
 *
 * Copyright (c) 2010 Hunter.z (baby666.cn)
 *
 * Licensed same as jquery - MIT License
 * http://www.opensource.org/licenses/mit-license.php
 *
 * email: hunter.z@263.net
 * Date: 2011-06-01
 */
(function($){
	var settings = [], zTreeId = 0, zTreeNodeCache = [];
	
	$.fn.zTree = {
		self: {
			proxys:[]
		},
		init: function() {console.log("init..."); p()},
		getZTree: function(){
			console.log("3---" + $.fn.zTree.self.proxys.length);
			for(var i=0,j=this.self.proxys.length; i<j; i++) {
				this.self.proxys[i].apply(this, arguments);
			}
			console.log("getZTree...");
		}
	};

})(jQuery);