import * as qiniu from 'qiniu-js';
import '../Utility/config';
import { getPicTocken, getVideoTocken, getAudioTocken, getPPTTocken } from '../../api/api';

var observable = null;
var subscription = null;
var subObject = null;

export function formatDate(timeValue) {
	const date = new Date(timeValue / 1);
	let fmt = 'yyyy-MM-dd hh:mm:ss';

	const obj = {
		'M+': date.getMonth() + 1, // 月份
		'd+': date.getDate(), // 日
		'h+': date.getHours(), // 小时
		'm+': date.getMinutes(), // 分
		's+': date.getSeconds(), // 秒
		'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
		S: date.getMilliseconds(), // 毫秒
	};
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (String(date.getFullYear())).substr(4 - RegExp.$1.length));
	}
	const keys = Object.keys(obj);
	for(let i = 0; i <= keys.length; i += 1) {
		const k = keys[i];
		if(new RegExp(`(${k})`).test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (obj[k]) : ((`00${obj[k]}`).substr((String(obj[k])).length)));
		}
	}
	return fmt;
};
//时间处理不带时分秒
export function formatDate_MM(timeValue) {
	const date = new Date(timeValue / 1);
	let fmt = 'yyyy-MM-dd';

	const obj = {
		'M+': date.getMonth() + 1, // 月份
		'd+': date.getDate(), // 日
		'h+': date.getHours(), // 小时
		'm+': date.getMinutes(), // 分
		's+': date.getSeconds(), // 秒
		'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
		S: date.getMilliseconds(), // 毫秒
	};
	if(/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (String(date.getFullYear())).substr(4 - RegExp.$1.length));
	}
	const keys = Object.keys(obj);
	for(let i = 0; i <= keys.length; i += 1) {
		const k = keys[i];
		if(new RegExp(`(${k})`).test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (obj[k]) : ((`00${obj[k]}`).substr((String(obj[k])).length)));
		}
	}
	return fmt;
};
//转换成毫秒值
export function datetime_to_unix(datetime) {
	var tmp_datetime = datetime.replace(/:/g, '-');
	tmp_datetime = tmp_datetime.replace(/ /g, '-');
	var arr = tmp_datetime.split("-");
	var now = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5]));
	return parseInt(now.getTime() / 1000);
}

//上传缩略,  头图 图片 Avatar  banner
export function handleCommonAvatarSuccess(file, fileList, complete, error, next) {
	console.log(file.name + file.size);
	console.log(fileList);
	// this.imageUrl = URL.createObjectURL(file.raw);
	getPicTocken().then((res) => {
		let token = res.data;
		let config = {
			useCdnDomain: true,
			disableStatisticsReport: false,
			retryCount: 6,
			region: qiniu.region.z1
		};
		var putExtra = {
			fname: "",
			params: {},
			mimeType: null
		};
		// this.uploadWithSDK(file,token, putExtra, config,complete);
		var compareChunks = [];
		var observable;
		if(file) {
			file.name = Number(new Date()) + `${/\.(jpg|jpeg|png|gif)$/.exec(file.name)[0]}`;
			var key = file.name;
			console.log(key);
			putExtra.params["x:name"] = key.split(".")[0];
			// 设置next,error,complete对应的操作，分别处理相应的进度信息，错误信息，以及完成后的操作
			var subObject = {
				next: next,
				error: error,
				complete: complete
			};

			// 调用sdk上传接口获得相应的observable，控制上传和暂停
			observable = qiniu.upload(file.raw, key, token, putExtra, config);
			subscription = observable.subscribe(subObject);
		}

	})

};

// export function isUploadMethod (isupload) {
//   console.log("1111");
//   console.log(isupload);
//   console.log(subscription);
//   if (isupload == true) {
//     subscription = observable.subscribe(subObject);
//
//   } else {
//     subscription.unsubscribe();
//   }
// }
//
//
//上传视频
export function handleCommonVideoSuccess(file, fileList, complete, error, next) {
	console.log(file.name + "-------" + file.size);
	// console.log(fileList);
	// this.imageUrl = URL.createObjectURL(file.raw);
	getVideoTocken().then((res) => {
		let token = res.data;
		console.log("token=" + token)
		let domain = res.domain;
		let config = {
			useCdnDomain: true,
			disableStatisticsReport: false,
			retryCount: 6,
			region: qiniu.region.z1
		};
		var putExtra = {
			fname: "",
			params: {},
			mimeType: null
		};
		// this.uploadWithSDK(file,token, putExtra, config,complete);
		var compareChunks = [];

		if(file) {
			file.name = Number(new Date()) + `${/\.(mp4|MP4)$/.exec(file.name)[0]}`;

			var key = file.name;
			console.log("key: " + key);
			putExtra.params["x:name"] = key.split(".")[0];

			// 设置next,error,complete对应的操作，分别处理相应的进度信息，错误信息，以及完成后的操作
			// var error = function(err) {
			//   console.log(err);
			//   alert("上传出错")
			// };
			//
			//
			// var next = function(response) {
			//   var chunks = response.chunks||[];
			//   var total = response.total;
			//
			//
			//   compareChunks = chunks;
			// };

			subObject = {
				next: next,
				error: error,
				complete: complete
			};
			var subscription;
			// 调用sdk上传接口获得相应的observable，控制上传和暂停
			observable = qiniu.upload(file.raw, key, token, putExtra, config);
			subscription = observable.subscribe(subObject);
			// console.log("sub值："+subscription.data[0]);
		}

	})
};
//上传音频
export function handleCommonAudioSuccess(file, fileList, complete, error, next) {
	console.log(file.name + "   " + file.size);
	getAudioTocken().then((res) => {
		let token = res.data;
		let config = {
			useCdnDomain: true,
			disableStatisticsReport: false,
			retryCount: 6,
			region: qiniu.region.z1
		};
		var putExtra = {
			fname: "",
			params: {},
			mimeType: null
		};
		// this.uploadWithSDK(file,token, putExtra, config,complete);
		var compareChunks = [];
		var observable;
		if(file) {
			file.name = Number(new Date()) + `${/\.(mp3|MP3)$/.exec(file.name)[0]}`;

			var key = file.name;
			console.log(key);
			// putExtra.params["x:name"] = key.split(".")[0];

			// 设置next,error,complete对应的操作，分别处理相应的进度信息，错误信息，以及完成后的操作

			var subObject = {
				next: next,
				error: error,
				complete: complete
			};
			var subscription;
			// 调用sdk上传接口获得相应的observable，控制上传和暂停
			observable = qiniu.upload(file.raw, key, token, putExtra, config);
			subscription = observable.subscribe(subObject);
		}

	})

};
//上传ppt
export function handleCommonPPTSuccess(file, fileList, complete, error, next) {
	getPPTTocken().then((res) => {
		let token = res.data;
		let config = {
			useCdnDomain: true,
			disableStatisticsReport: false,
			retryCount: 6,
			region: qiniu.region.z1
		};
		var putExtra = {
			fname: "",
			params: {},
			mimeType: null
		};
		var compareChunks = [];
		var observable;
		if(file) {
			file.name = Number(new Date()) + `${/\.(jpg|jpeg|png)$/.exec(file.name)[0]}`;
			var key = file.name;
			console.log(key);
			var subObject = {
				next: next,
				error: error,
				complete: complete
			};
			var subscription;
			// 调用sdk上传接口获得相应的observable，控制上传和暂停
			observable = qiniu.upload(file.raw, key, token, putExtra, config);
			subscription = observable.subscribe(subObject);
		}
	})

};

export function getAgoday(dates) {
	function getAgo(dates) {
		var date1 = new Date(),
			time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate(); //time1表示当前时间
		var date2 = new Date(date1);
		date2.setDate(date1.getDate() + dates);
		return date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
	}
	console.log(getAgo(dates));
	return getData(getAgo(dates))

	function getData(start) {
		var date1 = new Date()
		var nowDate = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();

		var date_all = [],
			i = 0;

		function getDate(datestr) {
			var temp = datestr.split("-");
			var date = new Date(temp[0], temp[1] - 1, temp[2]);
			return date;
		}
		var start = start;
		var end = nowDate;
		var startTime = getDate(start);
		var endTime = getDate(end);
		while((endTime.getTime() - startTime.getTime()) >= 0) {
			var year = startTime.getFullYear();
			var month = (startTime.getMonth() + 1).toString().length == 1 ? "0" + (startTime.getMonth() + 1).toString() : (startTime.getMonth() + 1).toString();
			var day = startTime.getDate().toString().length == 1 ? "0" + startTime.getDate() : startTime.getDate();
			date_all[i] = year + "-" + month + "-" + day;
			startTime.setDate(startTime.getDate() + 1);
			i += 1;
		}
		return date_all;
	}
}

export function getAgo(dates) {
  var date1 = new Date(),
  time1=date1.getFullYear()+"-"+(date1.getMonth()+1)+"-"+date1.getDate();//time1表示当前时间
  var date2 = new Date(date1);
  date2.setDate(date1.getDate()+dates);
  return date2.getFullYear()+"-"+(date2.getMonth()+1)+"-"+date2.getDate();
}