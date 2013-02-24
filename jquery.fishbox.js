;(function($) {
	var wrap_div, box_div, header_div, body_div, close_a, skin_div, iframe, 
		current_options = {}, mask_div,
		inline_node, inline_html, ajaxLoader, loading_div, loading_img, loading_msg, 
		default_loading_msg = '加载中，请稍后...', isIE6 = $.browser.msie && $.browser.version < 7, 
		isIE7 = !isIE6 && $.browser.msie && $.browser.version < 8;
	
	var _initWrapDiv = function() {
		mask_div = $('<div class="fb-mask"></div>');
		$('body').append(mask_div);
		wrap_div = $('<div class="fb-wrap"></div>');
		$('body').append(wrap_div);
		box_div = $('<div class="fb-box"></div>');
		wrap_div.append(box_div);
		header_div = $('<div class="fb-header"></div>');
		box_div.append(header_div);
		body_div = $('<div class="fb-body"></div>');
		box_div.append(body_div);
		close_a = $('<a id="fb-close" href="#">X</a>');
		box_div.append(close_a);
		skin_div = $('<div class="fb-skin"></div>');
		wrap_div.append(skin_div);
		loading_div = $('<div class="fb-loading"></div>');
		$('body').append(loading_div);
		loading_img = $('<a href="#" class="fb-loading-img"></a>');
		loading_div.append(loading_img);
		loading_msg = $('<div class="fb-loading-msg"></div>');
		loading_div.append(loading_msg);
		
		close_a.click($.fishbox.close);
		loading_img.click($.fishbox.cancel);
	};
	
	var _abort = function() {
		loading_div.hide();
		if (ajaxLoader) {
			ajaxLoader.abort();
		}
	}
	
	var _close = function() {
		mask_div.hide();
		wrap_div.hide();
		body_div.html('');
		if(inline_node) {
			inline_node.html(inline_html);
			inline_node = null;
			inline_html = '';
		}
		if(current_options && current_options.onClose) {
			current_options.onClose();
		}
		return false;
	}
	
	_error = function() {
		body_div.html( '<p class="fb-error">加载失败，请稍后重试。</p>' );
		_process_inline();
		// if (false === current_options.onError()) {
			// return;
		// }
	}
	
	var _start = function(el) {
		current_options = $(el).data('fishbox');
		var type, href = current_options.href || $(el).attr('href') || null;
		var title = current_options.title || $(el).attr('title') || '';
		header_div.html(title);
		if(current_options.type) {
			type = current_options.type;
			if(!href) {
				href = current_options.content;
			}
		} else if(current_options.content) {
			type = 'html';
		} else if(href)  {
			if(href.indexOf('#') === 0) {
				type = 'inline';
			} else {
				type = 'ajax';
			}
		}
		switch (type) {
			case 'html':
				body_div.html(current_options.content);
				_show();
			break;
			case 'inline':
				inline_node = $(href);
				inline_html = $(href).html();
				body_div.html(inline_html);
				_show();
			break;
			case 'ajax':
				ajaxLoader = $.ajax($.extend({}, current_options.ajax, {
					url: href,
					data: current_options.ajax.data || {},
					error : function() {
						_error();
					},
					success : function(data) {
						body_div.html(data);
						_show();
					}
				}));
			break;
			case 'iframe':
				var scrolling = current_options.scrolling ? current_options.scrolling : 'no';
				iframe = $('<iframe frameborder="0" hspace="0" style="height:100%;width:100%" scrolling="' + scrolling + '" src="' + href + '"></iframe>');
				body_div.append(iframe);
				_show();
			break;
		}
	}
	
	var _show = function() {
		wrap_div.show();
		var left, top, width, height;
		if(current_options.width) {
			width = current_options.width;
		} else {
			width = body_div.width();
		}
		if(current_options.height) {
			height = current_options.height;
		} else {
			height = body_div.height();
		}
		if(current_options.left) {
			left = current_options.left;
		} else {
			left = ($('body').scrollLeft() + $(window).width() - width) / 2;
		}
		if(current_options.top) {
			top = current_options.top;
		} else {
			top = ($('body').scrollTop() + $(window).height() - height) / 2;
			top = Math.abs(top);
		}
		if($.isNumeric(width)) {
			body_div.width(width);
		} else {
			body_div.css('width', width);
		}
		if($.isNumeric(height)) {
			body_div.height(height);
		} else {
			body_div.css('height', height);
		}		
		wrap_div.css('left', left + 'px');
		wrap_div.css('top', top + 'px');
		box_div.width(body_div.width());
		header_div.width(body_div.width());
		if(isIE6) {
			wrap_div.width(body_div.width() + 20);
			wrap_div.height(body_div.height() + 36);
		}
		if(current_options.showmask) {
			mask_div.height($('body').height());
			mask_div.show();
		}
	}
	
	$.fishbox = {};
	
	$.fishbox.showActivity = function(msg) {
		if(msg) {
			loading_msg.html(msg);
		} else {
			loading_msg.html(default_loading_msg);
		}
		var left = ($('body').scrollLeft() + $(window).width() - 180) / 2;
		var top = ($('body').scrollTop() + $(window).height() - 200) / 2;
		loading_div.css('left', left + 'px');
		loading_div.css('top', top + 'px');
		loading_div.show();
	}
	
	$.fishbox.hideActivity = function() {
		loading_div.hide();
		if(ajaxLoader) {
			ajaxLoader.abort();
		}
		if(current_options && current_options.onCancel) {
			current_options.onCancel();
		}
	}
	
	$.fishbox.cancel = function() {
		_abort();
		try {
			current_options.onCancel();
		} catch(e) {
		
		}
		return false;
	}
	
	$.fishbox.close = function() {
		return _close();
	}
	
	$.fishbox.setOnCancel = function(fun) {
		current_options.onCancel = fun;
	}
	
	$.fishbox.setOptions = function(options) {
		current_options = $.extend({}, current_options, options)
	}
	
	$.fishbox.setAjaxLoader = function(loader) {
		ajaxLoader = loader;
	}
	
	var default_options = {
		ajax:{}
	}
	
	$.fn.fishbox = function(options) {
		if (!$(this).length) {
			return this;
		}
		options = $.extend(default_options, options);
		$(this).data('fishbox', options)
			.unbind('click.fb')
			.bind('click.fb', function(e) {
				_start(this);
				return false;
			});
		return $(this);
	};
	
	$(function(){
		_initWrapDiv();
	});
})(jQuery);
