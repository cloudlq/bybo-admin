var _FUN = {};

(function($) {

	/**
	 * 判断是否为空
	 * @param v
	 * @returns {boolean}
	 */
	_FUN.isNull = function(v) {
		var tag = false;
		if (v == null || v == undefined || v == "" || v.length == 0) {
			tag = true;
		}
		return tag;
	}

	/**
	 * 获取url中值
	 * @param key
	 * 参数
	 * @returns {null}
	 */
	_FUN.getUrlParam = function(key) {　　
		var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");　　
		var r = window.location.search.substr(1).match(reg);　　
		if (r != null)　　 return unescape(r[2]);　　
		return null;
	}


	/**
	 * 校验身份证
	 * @param code 身份证号
	 * @returns {{code: boolean, msg: string}}
	 */
	_FUN.cardIdValid = function(code) {
		var city = {
			11: "北京",
			12: "天津",
			13: "河北",
			14: "山西",
			15: "内蒙古",
			21: "辽宁",
			22: "吉林",
			23: "黑龙江 ",
			31: "上海",
			32: "江苏",
			33: "浙江",
			34: "安徽",
			35: "福建",
			36: "江西",
			37: "山东",
			41: "河南",
			42: "湖北 ",
			43: "湖南",
			44: "广东",
			45: "广西",
			46: "海南",
			50: "重庆",
			51: "四川",
			52: "贵州",
			53: "云南",
			54: "西藏 ",
			61: "陕西",
			62: "甘肃",
			63: "青海",
			64: "宁夏",
			65: "新疆",
			71: "台湾",
			81: "香港",
			82: "澳门",
			91: "国外 "
		};
		var tip = "";
		var pass = true;

		if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
			tip = "身份证号格式错误";
			pass = false;
		} else if (!city[code.substr(0, 2)]) {
			tip = "身份证地址编码错误";
			pass = false;
		} else {
			//18位身份证需要验证最后一位校验位
			if (code.length == 18) {
				code = code.split('');
				//∑(ai×Wi)(mod 11)
				//加权因子
				var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
				//校验位
				var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
				var sum = 0;
				var ai = 0;
				var wi = 0;
				for (var i = 0; i < 17; i++) {
					ai = code[i];
					wi = factor[i];
					sum += ai * wi;
				}
				var last = parity[sum % 11];
				if (parity[sum % 11] != code[17]) {
					tip = "身份证校验位错误";
					pass = false;
				}
			}
		}
		return {
			code: pass,
			msg: tip
		};
	}


	/**
	 * 校验手机号
	 * @param phone
	 * @returns {{code: boolean, msg: string}}
	 */
	_FUN.phoneValid = function(phone) {
		var tag = true;
		var tip = ""
		if (!(/^1[3|4|5|7|8]\d{9}$/.test(phone))) {
			tip = "手机号码有误，请重填";
			tag = false;
		}
		return {
			code: tag,
			msg: tip
		};
	}
	
	 /**
     * 设置本地存储
     */
    _FUN.setSS = function(k, v) {
        sessionStorage.setItem(k, JSON.stringify(v));
    },
    /**
     * 获取本地存储
     */
    _FUN.getSS = function(k) {
        return JSON.parse(sessionStorage.getItem(k));
    }


	

}(jQuery));


/*根据数据下标删除元素*/
Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

/**
 * 格式化日期
 * @param {Object} fmt
 * 用法： new Date().Format("yyyy-MM-dd hh:mm:ss")
 */
Date.prototype.Format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}