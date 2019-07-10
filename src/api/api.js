import { avinfo, get, post, Delete, put } from "./index"

//登录接口  Login
export let loginApi = data => {
  //console.log(data);
  return post('admin/login', data)
};
// 搜索功能---套课搜索
export let searchAll = (parentid, keywords, page, pagesize) => {
  return get(`/admin/search?parentid=${parentid}&keywords=${keywords}&page=${page}&pagesize=${pagesize}`)
}
// 搜索功能---小节搜索
export let searchClassAll = (parentid, keywords, page, pagesize) => {
  return get(`/admin/searchClass?parentid=${parentid}&keywords=${keywords}&page=${page}&pagesize=${pagesize}`)
}
//置顶功能----套课
export let toTop = (data_y) => {
  console.log(data_y)
  return post(`/admin/toTop`, data_y)
}
//上课
//今日真知速递-套课列表
export let getjrsdCourse = (page, pagesize) => {
  return get(`admin/jrsdCourse?page=${page}&pagesize=${pagesize}`)
}
export let postjrsdCoutse = (data) => {
  return post(`admin/jrsdCourse`, data)
}
export let putjrsdCourse = (data, id) => {
  return put(`admin/jrsdCourse/${id}`, data)
}
export let DeletejrsdCourse = (id, data) => {
  return Delete(`admin/jrsdCourse/${id}`, data)
}
export let postjrsdCoutsestr = (str) => {
  return post(`admin/jrsdCourse`, { id: str })
}
//今日真知速递-小结列表
export let getjrsdClass = (page, pagesize) => {
  return get(`admin/jrsdClass?page=${page}&pagesize=${pagesize}`)
}
export let postjrsdClass = (data) => {
  return post(`admin/jrsdClass`, data)
}
export let putjrsdClass = (data, id) => {
  return put(`admin/jrsdClass/${id}`, data)
}
export let DeletjrsdClass = (id, data) => {
  console.log("我是id" + id)
  console.log("我是data" + data)
  return Delete(`admin/jrsdClass/${id}`, data)
}
export let DeletjrsdClassAll = (str) => {
  return Delete(`admin/jrsdClass/`, { id: str })
}
//今日速递分享获取列表
export let getjrsdshare = (page, pagesize, parentid = 4) => {
  return get(`admin/getListByParentId?page=${page}&pagesize=${pagesize}&parentid=${parentid}`)
}
//上课-热门搜索
export let gethotword = (page, pagesize) => {
  return get(`admin/hotWord?page=${page}&pagesize=${pagesize}`)
}
export let posthotword = (data) => {
  return post(`admin/hotWord`, data)
}
export let puthotword = (data, id) => {
  return put(`admin/hotWord/${id}`, data)
}
export let Deletehotword = (id, data) => {
  return Delete(`admin/hotWord/${id}`, data)
}
export let DeletehotwordAll = (str) => {
  return post(`admin/hotWord`, { id: str })
}
/* 第一类:LectureContents  讲堂内容*/
//1.1  大讲堂课程分类
//获取大讲堂category列表
export let getCategories = (page, pagesize) => {
  return get(`admin/categories?page=${page}&pagesize=${pagesize}`)
};
//根据id获取大讲堂课程分类category列表
export let getCategoryOne = (id) => {
  return get(`admin/categories/${id}`)
};
//根据id删除category列表
export let deleteCategoryOne = (id) => {
  return Delete(`admin/categories/${id}`)
};
//添加category列表
export let postCategories = (data) => {
  return post('admin/djtcategoryupload', data)
};
//根据id修改课程分类category列表
export let putCategories = (data, id) => {
  console.log(data);
  return put(`admin/categories/${id}`, data)
};
//根据id集合批量删除category列表
export let postCategoriesList = (str) => {
  console.log(str);
  return post(`admin/categories/deletes`, { id: str })
};

//1.2  课程列表
//获取courses列表
export let getCourses = (page, pagesize) => {
  return get(`admin/courses?page=${page}&pagesize=${pagesize}`)
};
//获取根据id获取courses列表
export let getCoursesOne = (id) => {
  return get(`admin/courses/${id}`)
};
//获取根据id删除courses列表
export let deleteCoursesOne = (id) => {
  return Delete(`admin/courses/${id}`)
};
//添加courses列表
export let postCourses = (data) => {
  return post(`admin/djtcourseupload`, data)
};
//根据id修改courses列表
export let putCourses = (data, id) => {
  console.log('我是data' + data);
  console.log('我是id' + id);
  return put(`admin/courses/${id}`, data)
};
//根据 id 集合批量删除courses列表
export let postCoursesList = (str) => {
  return post(`admin/courses/deletes`, { id: str })
};
//灼见获取列表
export let ZhuoJian = (page, pagesize) => {
  return get(`admin/zhuojian?page=${page}&pagesize=${pagesize}`)
}
//灼见新增列表
export let ZhuoJianAdd = (data) => {
  // console.log(data);
  return post(`admin/zhuojian`, data)
}
//灼见修改接口
export let Zhuojianchange = (data, id) => {
  // console.log(id)
  return put(`admin/zhuojian/${id}`, data)
}
//灼见单条数据删除
export let ZhuojianDelete = (id) => {
  return Delete(`admin/zhuojian/${id}`);
}
//灼见批量删除数据
export let ZhuojianDeletes = (str) => {
  return post(`admin/zhuojian/deletes`, { id: str });
}
//1.3  小节列表
//获取Sections列表
export let getSections = (page, pagesize) => {
  return get(`admin/classes?page=${page}&pagesize=${pagesize}`)
};
//获取根据id获取sections列表
export let getSectionsOne = (id) => {
  return get(`admin/classes/${id}`)
};
//获取根据id删除sections列表
export let deleteSectionsOne = (id) => {
  return Delete(`admin/classes/${id}`)
};
//添加sections列表
export let postSections = (data) => {
  return post(`admin/djtclassupload`, data)
};
//根据id修改sections列表
export let putSections = (data, id) => {
  return put(`admin/classes/${id}`, data)
};

//根据 id 集合批量删除sections列表
export let postSectionsList = (str) => {
  return post(`admin/classes/deletes`, { id: str })
};



//FM列表
//获取fm课程列表
export let getFM = (page, pagesize) => {
  // return get(`api/v1/fms?page=${page}&pagesize=${pagesize}`)
  return get(`admin/getFMCourseList?page=${page}&pagesize=${pagesize}`)
};
//获取根据id获取fm课程列表
export let getFmOne = (id) => {
  return get(`admin/fmcourseupdate/${id}`)
};
//获取根据id删除fm课程列表
export let deleteFmOne = (id) => {
  // console.log('id是这个'+id);
  return get(`admin/deletefmcourse?id=${id}`)
};
//添加fm课程列表
export let postFm = (data) => {
  // console.log(data+'我是data');
  return post('admin/fmcourseupload', data)
};
//根据id修改fm课程列表
export let putFm = (data, id) => {
  // console.log('我是data'+data);
  // console.log('我是id'+id);
  return post(`admin/fmcourseupdate/${id}`, data)
};
//根据 id 集合批量删除 fm 课程列表
export let postFmList = (str) => {
  return post(`admin/fms/deletes`, { id: str })
};
//fm课程分享接口
export let getfmshare = (page, pagesize, parentid = 3) => {
  return get(`admin/getListByParentId?page=${page}&pagesize=${pagesize}&parentid=${parentid}`)
}
//大讲堂课程分享接口
export let getCourseshare = (page, pagesize, parentid = 1) => {
  return get(`admin/getListByParentId?page=${page}&pagesize=${pagesize}&parentid=${parentid}`)
}
//海报分享新增接口
export let posteradd = (data) => {
  console.log(data);
  return post('/admin/posteradd', data)
};
//海报分享修改接口
export let posterupdate = (data, id) => {
  // console.log('我是接口里的'+id)
  return post(`/admin/posterupdate?id=${id}`, data)
};
//分享删除接口
export let DeletePoster = (id) => {
  return get(`admin/posterdelete?id=${id}`)
}
//获取fm小节列表
export let getFmClass = (page, pagesize) => {
  // console.log(cur_page);
  return get(`admin/getfmclasslist?page=${page}&pagesize=${pagesize}`)
};
//添加fm小节列表
export let postFm2 = (data) => {
  return post('admin/fmclassupload', data)
};
//根据id修改fm小结列表
export let putFm2 = (data, id) => {
  // console.log("我是data"+data);
  // console.log('我是id'+id);
  return post(`admin/fmclassupdate?id=${id}`, data)
};
//根据 id 集合批量删除 fm 小结列表
export let postFm2List = (str) => {
  return post(`admin/fms/deletes`, { id: str })
};
//根据 id删除 fm 小结列表
export let DeleteFmClass = (id) => {
  return get(`admin/deletefmclass?id=${id}`)
};


//1.5 获取课程小节评论
export let getClassComment = (page, pagesize) => {
  return get(`admin/classComments?page=${page}&pagesize=${pagesize}`)
};
//根据 id 获取 classComment 列表
export let getClassCommentOne = (id) => {
  return get(`admin/classComments/${id}`)
};
//根据 id 删除 classComment 列表
export let deleteClassCommentOne = (id) => {
  return Delete(`admin/classComments/${id}`)
};
// 添加  classComment 列表
export let postClassComment = (data) => {
  return post('admin/classComments', data)
};
//根据 id 修改  classComment 列表
export let putClassComment = (data, id) => {
  return put(`admin/classComments/${id}`, data)
};
// 根据 id 集合批量删除classComment 列表
export let postClassCommentList = (str) => {
  return post(`admin/classComments/deletes`, { id: str })
}

//商学院课程  年费价格表修改
export let getUpdateyearfee = (data) => {
  return post(`/api/v1/updateyearfee`, data)
}
//商学院课程  刚开始加载时从后台获取年费价格表
export let getYearfee = () => {
  return get(`admin/getparentinfo`)
};

//商学院模块分类输入数据新增
export let postsxy = (data) => {
  return post('admin/sxycategoryupload', data)
};
//商学院模块分类展示
export let postsxylist = (page, pagesize) => {
  // console.log('data=>'+page);
  return get(`admin/getsxycatelist?page=${page}&pagesize=${pagesize}`)
};
//商学院模块分类修改
export let postcategoryu = (data, id) => {
  // console.log('id=>'+id);
  // console.log('data=>'+data);
  return post(`admin/sxycategoryupdate/${id}`, data)
};
//商学院模块分类按id删除
export let deletesxycatelog = (id) => {
  console.log(id);
  return get(`admin/deletesxycatelog?id=${id}`)
}

//商学院课程列表输入数据新增
export let postsxycourse = (data) => {
  return post('admin/sxycourseupload', data)
};
//商学院课程列表数据新增
export let postsxycour = (page, pagesize) => {
  // console.log('data=>'+page);
  return get(`admin/getsxycourselist?page=${page}&pagesize=${pagesize}`)
};
//商学院课程列表数据修改
export let postsxycourseupdate = (data, id) => {
  console.log('data=>' + data);
  console.log('id=>' + id);
  return post(`admin/sxycourseupdate/${id}`, data)
};
//商学院课程列表按id删除
export let deletesxycourse = (id) => {
  // console.log(id)
  return get(`admin/deletesxycourse?id=${id}`)
}

//商学院小节输入数据新增
export let postsxyclass = (data) => {
  console.log('我是api接口里的' + data);
  return post('admin/sxyclassupload', data)
};
//商学院小节列表数据新增
export let getsxyclass = (page, pagesize) => {
  // console.log('data=>'+page);
  return get(`admin/getsxyclasslist?page=${page}&pagesize=${pagesize}`)
};
//商学院小节列表更新
export let postsxyclassupdata = (data, id) => {
  // console.log('id=>'+id);
  // console.log('data=>'+data);
  return post(`admin/sxyclassupdate/${id}`, data)
};
//商学院小节按id删除
export let deletesxyclass = (id) => {
  console.log(id)
  return get(`admin/deletesxyclass?id=${id}`)
}
//商学院课程分享获取列表
export let getSxyshare = (page, pagesize, parentid = 2) => {
  return get(`admin/getListByParentId?page=${page}&pagesize=${pagesize}&parentid=${parentid}`)
}
//读书
//读书解读分类列表获取
export let Classification = (page, pagesize) => {
  return get(`/admin/getReadingCategoryList?page=${page}&pagesize=${pagesize}`)
};
//新增读书分类
export let createReadingCategory = (data) => {
  return post('/admin/createReadingCategory', data)
};
//获取根据id删除读书列表
export let deleteReadingClass = (id) => {
  return get(`/admin/deleteReadingClass?id=${id}`)
};
//后台管理-查询所有读书小节列表
export let getReadingClassList = (page, pagesize) => {
  return get(`/admin/getReadingClassList?page=${page}&pagesize=${pagesize}`)
};
//后台管理-新增读书小节内容
export let createReadingClass = (data) => {
  return post('/admin/createReadingClass', data)
};
//后台管理-修改读书小节
export let updateReadingClass = (data, id) => {
  return post(`/admin/updateReadingClass?id=${id}`, data)
};
/* 第二类:Event Management 活动管理 */
//2.1 获取城市列表  ActivityCity
export let getActivityCity = (page, pagesize) => {
  return get(`admin/activityCities?page=${page}&pagesize=${pagesize}`)
};
//获取根据id获取ActivityCity列表
export let getActivityCityOne = (id) => {
  return get(`admin/activityCities/${id}`)
};
//获取根据id删除ActivityCity列表
export let deleteActivityCityOne = (id) => {
  return Delete(`admin/activityCities/${id}`)
};
//添加ActivityCity列表
export let postActivityCity = (data) => {
  return post('admin/activityCities', data)
};
//根据id修改ActivityCity列表
export let putActivityCity = (data, id) => {
  return put(`admin/activityCities/${id}`, data)
};
//根据id集合批量删除ActivityCity列表
export let postActivityCityList = (str) => {
  return post(`admin/activityCities/deletes`, { id: str })
};



//2.2 获取活动列表 ActivityTicket
export let getActivityTicket = (page, pagesize) => {
  return get(`admin/activitytickets?page=${page}&pagesize=${pagesize}`)
};
//获取根据id获取ActivityTicket列表
export let getActivityTicketOne = (id) => {
  return get(`admin/activitytickets/${id}`)
};
//获取根据id删除ActivityTicket列表
export let deleteActivityTicketOne = (id) => {
  return Delete(`admin/activitytickets/${id}`)
};
//添加ActivityTicket列表
export let postActivityTicket = (data) => {
  return post('admin/activitytickets', data)
};
//根据id修改ActivityTicket列表
export let putActivityTicket = (data, id) => {
  return put(`admin/activitytickets/${id}`, data)
};
//根据id集合批量删除ActivityTicket列表
export let postActivityTicketList = (str) => {
  return post(`admin/activitytickets/deletes`, { id: str })
};

//2.3 获取报名列表 ActivityRegistrations
export let getActivityRegistrations = (page, pagesize) => {
  return get(`admin/activityRegistrations?page=${page}&pagesize=${pagesize}`)
};
//获取根据id获取ActivityActivityRegistrations列表
export let getActivityRegistrationsOne = (id) => {
  return get(`admin/activityRegistrations/${id}`)
};
//获取根据id删除ActivityRegistrations列表
export let deleteActivityRegistrationsOne = (id) => {
  return Delete(`admin/activityRegistrations/${id}`)
};
//添加ActivityRegistrations列表
export let postActivityRegistrations = (data) => {
  return post('admin/activityRegistrations', data)
};
//根据id修改ActivityRegistrations列表
export let putActivityRegistrations = (data, id) => {
  return put(`admin/activityRegistrations/${id}`, data)
};
//根据 id 集合批量删除ActivityRegistrations列表
export let postActivityRegistrationsList = (str) => {
  return post(`admin/activityRegistrations/deletes`, { id: str })
};

//2.4 获取活动信息列表 Activity
export let getActivity = (page, pagesize) => {
  return get(`admin/activities?page=${page}&pagesize=${pagesize}`)
};
//获取根据id获取ActivityEventsList列表
export let getActivityOne = (id) => {
  return get(`admin/activities/${id}`)
};
//获取根据id删除ActivityEventsList列表
export let deleteActivityOne = (id) => {
  return Delete(`admin/activities/${id}`)
};
//添加ActivityEventsList列表
export let postActivity = (data) => {
  return post('admin/activities', data)
};
//根据id修改ActivityEventsList列表
export let putActivity = (data, id) => {
  return put(`admin/activities/${id}`, data)
};
//根据id集合批量删除ActivityEventsList列表
export let postActivityList = (str) => {
  return post(`admin/activities/deletes`, { id: str })
};



/*第三类:Promotion Management 推广管理 */
//3.1  获取主页banner列表
export let getHomeBanner = (page, pagesize) => {
  return get(`admin/banners?page=${page}&pagesize=${pagesize}`)
};
//根据id获取主页banner列表
export let getHomeBannerOne = (id) => {
  return get(`admin/banners/${id}`)
};
//根据id删除主页banner
export let deleteHomeBannerOne = (id) => {
  return Delete(`admin/banners/${id}`)
};
//添加主页banner列表
export let postHomeBanner = (data) => {
  return post('admin/banners', data)
};
//根据id修改主页banner列表
export let putHomeBanner = (data, id) => {
  return put(`admin/banners/${id}`, data)
};

//根据 id 集合批量删除主页banner列表
export let postHomeBannerList = (str) => {
  return post('admin/banners/deletes', { id: str })
};

//3.2  获取推广文章
export let getNews = (page, pagesize) => {
  return get(`admin/news?page=${page}&pagesize=${pagesize}`)
};
//根据id获取news列表
export let getNewsOne = (id) => {
  return get(`admin/news/${id}`)
};
//根据id删除news
export let deleteNewsOne = (id) => {
  return Delete(`admin/news/${id}`)
};
//添加主页news列表
export let postNews = (data) => {
  return post('admin/news', data)
};
//根据id修改主页news列表
export let putNews = (data, id) => {
  return put(`admin/news/${id}`, data)
};

//根据 id 集合批量删除news列表
export let postNewsList = (str) => {
  return post('admin/news/deletes', { id: str })
};

/*第四类:Order Management 订单管理*/
//4.1  获取课程订单列表courseOrder
export let getCourseOrder = (page, pagesize) => {
  return get(`admin/courseOrders?page=${page}&pagesize=${pagesize}`)
};
//根据id获取courseOrder列表
export let getCourseOrderOne = (id) => {
  return get(`admin/courseOrders/${id}`)
};
//根据id删除courseOrder
export let deleteCourseOrderOne = (id) => {
  return Delete(`admin/courseOrders/${id}`)
};

//添加主页courseOrder列表(尚无此接口)


//根据id修改主页courseOrder列表
export let putCourseOrder = (data, id) => {
  return put(`admin/courseOrders/${id}`, data)
};

//4.2  获取活动列表activeOrder
export let getActiveOrder = (page, pagesize) => {
  return get(`admin/activityOrders?page=${page}&pagesize=${pagesize}`)
};
//根据id获取activeOrder列表
export let getActiveOrderOne = (id) => {
  return get(`admin/activityOrders/${id}`)
};
//根据id删除activeOrder
export let deleteActiveOrderOne = (id) => {
  return Delete(`admin/activityOrders/${id}`)
};
//添加主页activeOrder列表(尚无此接口)

//根据id修改主页activeOrder列表
export let putActiveOrder = (data, id) => {
  return put(`admin/activityOrders/${id}`, data)
};

//4.3  获取发票订单列表invoiceOrder
export let getInvoiceOrder = (page, pagesize) => {
  return get(`admin/invoiceOrders?page=${page}&pagesize=${pagesize}`)
};
//根据id获取invoiceOrder列表
export let getInvoiceOrderOne = (id) => {
  return get(`admin/invoiceOrders/${id}`)
};
//根据id删除invoiceOrder
export let deleteInvoiceOrderOne = (id) => {
  return Delete(`admin/invoiceOrders/${id}`)
};

//添加invoiceOrder列表(尚无此接口)


//根据id发票订单列表invoiceOrder列表
export let putInvoiceOrder = (data, id) => {
  return put(`admin/invoiceOrders/${id}`, data)
};

//4.4  获取发票信息列表invoice
export let getInvoice = (page, pagesize) => {
  return get(`admin/invoices?page=${page}&pagesize=${pagesize}`)
};
//根据id获取invoice列表
export let getInvoiceOne = (id) => {
  return get(`admin/invoices/${id}`)
};
//根据id删除invoice
export let deleteInvoiceOne = (id) => {
  return Delete(`admin/invoices/${id}`)
};

//添加invoice列表(尚无此接口)


//根据id发票信息列表invoice列表
export let putInvoice = (data, id) => {
  return put(`admin/invoices/${id}`, data)
};

//根据id发票信息列表invoice列表
export let postInvoiceList = (str) => {
  return post(`admin/invoices/deletes`, { id: str })
};

/*第五大类  用户管理*/
//合伙人列表
//获取partner列表
export let GetpartnerFindAll = (page, pagesize) => {
  return get(`admin/partnerfindall?page=${page}&pagesize=${pagesize}`)
};
//添加主页partner列表
export let PostPartner = (data) => {
  return post('admin/partneradd', data)
};
//根据id获取partner列表
export let GetPartnerFind = (id) => {
  return get(`admin/partnerfind/${id}`)
};
//根据id修改主页users列表
export let getPartner = (data, id) => {
  return post(`admin/partnerupdate/${id}`, data)
};
//根据id删除partner
export let deletepartner = (id) => {
  return get(`admin/partnerdelete/${id}`)
};
//根据 id 集合批量删除partner列表
export let partnerdelete = (str) => {
  return post('admin/partnerdeletes', { id: str })
};
// 获取users列表
export let getUsers = (page, pagesize) => {
  return get(`admin/users?page=${page}&pagesize=${pagesize}`)
};
//根据id获取users列表
export let getUsersOne = (id) => {
  return get(`admin/users/${id}`)
};
//根据id删除users
export let deleteUsersOne = (id) => {
  return Delete(`admin/users/${id}`)
};
//添加主页users列表

export let postUsers = (data) => {
  return post('admin/users', data)
};
//根据id修改主页users列表
export let putUsers = (data, id) => {
  return put(`admin/users/${id}`, data)
};

//根据 id 集合批量删除users列表

export let postUsersList = (str) => {
  return post('admin/users/deletes', { id: str })
};

//获取 微信用户列表
export let getWxUsers = (page, pagesize) => {
  return get(`admin/wxUsers?page=${page}&pagesize=${pagesize}`)
};

//5.2  获取collection 收藏列表
export let getCollection = (page, pagesize) => {
  return get(`admin/collections?page=${page}&pagesize=${pagesize}`)
};
//根据id获取collection列表
export let getCollectionOne = (id) => {
  return get(`admin/collections/${id}`)
};
//根据id删除collection
export let deleteCollectionOne = (id) => {
  return Delete(`admin/collections/${id}`)
};
//添加collection列表
export let postCollection = (data) => {
  return post('admin/collections', data)
};
//根据id修改collection列表
export let putCollection = (data, id) => {
  return put(`admin/collections/${id}`, data)
};

//根据 id集合批量删除collection列表
export let postCollectionList = (str) => {
  return post('admin/collections/deletes', { id: str })
};

/*第六大类  系统管理*/
//6.1  获取管理员administrator列表
export let getAdministrator = (page, pagesize) => {
  return get(`admin/members?page=${page}&pagesize=${pagesize}`)
};
//根据id获取administrator列表
export let getAdministratorOne = (id) => {
  return get(`admin/members/${id}`)
};
//根据id删除administrator
export let deleteAdministratorOne = (id) => {
  return Delete(`admin/members/${id}`)
};
//添加主页administrator列表

//根据id修改主页administrator列表
export let putAdministrator = (data, id) => {
  return put(`admin/members/${id}`, data)
};

// 根据 id 集合批量删除 administrator列表
export let postAdministratorList = (str) => {
  return post('admin/members/deletes', { id: str })
};

// v2.0
// 获取所有角色
export let getAllRole = () => {
  return get(`/admin/role`)
};

// 新增角色 角色名\状态
export let postRole = (data) => {
  return post('/admin/role', data)
};

// 编辑角色 角色名\状态
export let putRole = (data, id) => {
  return put(`/admin/role/${id}`, data)
};

// 删除角色 
export let deleteRole = (id) => {
  return Delete(`/admin/role/${id}`)
};

//设置角色权限
export let setRight = (data) => {
  return post('/admin/setRight', data)
};

//获取角色权限
export let getRight = (id) => {
  return get(`/admin/getRightByRole?roleid=${id}`)
};

//新增帐号
export let postAdministrator = (data) => {
  return post('admin/members', data)
};

//根据角色ID查询帐号
export let getByRoleid = (roleid) => {
  return get(`/admin/getByRoleId?roleid=${roleid}`)
};

//6.2  获取帮助help列表
export let getHelp = (page, pagesize) => {
  return get(`admin/helps?page=${page}&pagesize=${pagesize}`)
};
//根据id获取help列表
export let getHelpOne = (id) => {
  return get(`admin/helps/${id}`)
};
//根据id删除help
export let deleteHelpOne = (id) => {
  return Delete(`admin/helps/${id}`)
};
//添加help列表
export let postHelp = (data) => {
  return post('admin/helps', data)
};
//根据id修改help列表
export let putHelp = (data, id) => {
  return put(`admin/helps/${id}`, data)
};

//根据 id 集合批量删除help列表
export let postHelpList = (str) => {
  return post('admin/helps/deletes', { id: str })
};

//上传文件
export let getPicTocken = () => {
  return get(`admin/getPicToken`)
};
export let getPicURL = (key) => {
  return get(`admin/getPicUrl?key=${key}`)
};
//上传视频
export let getVideoTocken = () => {
  return get(`admin/getVidoeToken`)
};
export let getVideoURL = (key) => {
  return get(`admin/getVidoeUrl?key=${key}`)
};
//上传音频
export let getAudioTocken = () => {
  return get(`admin/getAudioToken`)
};
export let getAudioURL = (key) => {
  return get(`admin/getAudioUrl?key=${key}`)
};
export let getAudioavinfo = (key) => {
  return get(`${key}?avinfo`)
};
//上传ppt
export let getPPTTocken = () => {
  // return get(`admin/v1/pptupload`)
  return get(`admin/getPicToken`)
};
export let getPPTURL = (data) => {
  // return get(`admin/getPPTUrl?key=${key}`)
  return get(`admin/getPicUrl?key=${data}`)
};

//标签管理
//查看所有标签 
export let GetLables = () => {
  return get(`admin/lables`)
};
//新增标签
export let GetLablesadd = (data) => {
  return post(`admin/lables`, data)
}
//删除标签
export let GetLablesdelete = (id) => {
  return Delete(`admin/lables/${id}`)
}
//修改标签
export let GetLablesput = (data, id) => {
  return put(`admin/lables/${id}`, data)
}
//套课列表选择标签
export let Viewlabel = (id) => {
  return get(`/admin/lables/${id}`)
}
//推送接口
export let postpush = (data) => {
  return post(`admin/push`, data)
}
//推送 -- 搜索/admin/pushsearch
export let pushsearch = (parentid, keyword, subid) => {
  return get(`/admin/pushsearch?parentid=${parentid}&keyword=${keyword}&subid=${subid}`)
}
//分销管理
//分销数据 - 实时统计
export let promotiondata = () => {
  return get(`/admin/promotiondata/part1`)
}
//分销数据 - 总代理
export let promotiondata3 = () => {
  return get(`/admin/promotiondata/part3`)
}
//分销数据 - 总代理
export let promotiondata4 = (zongdaicode) => {
  return get(`/admin/promotiondata/part4?zongdaicode=${zongdaicode}`)
}
//合伙人列表 - 总代理展示
export let getZongdai = (page, pagesize) => {
  return get(`/admin/zongdai?page=${page}&pagesize=${pagesize}`)
}
export let postZongdai = (data) => {
  return post(`/admin/zongdai`, data)
}
export let putZongdai = (data, id) => {
  return put(`/admin/zongdai/${id}`, data)
}
//合伙人列表 - 总代理删除
export let deleteZongdai = (id) => {
  return Delete(`/admin/zongdai/${id}`)
}
//合伙人列表 - 总代理搜索
// export let getZongdai=(page,pagesize)=>{
//   return get(`/admin/zongdai?`)
// }
//合伙人列表 - 合伙人 
export let getCitypartner = (page, pagesize) => {
  return get(`/admin/citypartner?page=${page}&pagesize=${pagesize}`)
}
export let postCitypartner = (data) => {
  return post(`/admin/citypartner`, data)
}
export let putcitypartner = (data, id) => {
  return put(`/admin/citypartner/${id}`, data)
}
//合伙人列表 - 合伙人删除
export let Deletecitypartner = (id) => {
  return Delete(`/admin/citypartner/${id}`)
}
//合伙人列表 - 总代理搜索
export let zongdaiinfo = () => {
  return get(`/admin/promotiondata/zongdaiinfo`)
}

//提现管理 - 提现申请 
export let getCompanyPay = (page, pagesize) => {
  return get(`/admin/companyPay?page=${page}&pagesize=${pagesize}`)
}
//后台管理-根据用户id查询用户金币记录
export let goldCoinLog = (userid) => {
  return get(`/admin/goldCoinLog?userid=${userid}`)
}
//提现管理-审核通过后提现
export let companyPay2 = (datay) => {
  return post(`/api/v2/companyPay2`, datay)
}
//提现管理-审核驳回
export let companypayCheckBack = (id) => {
  return get(`/admin/companypayCheckBack?&id=${id}`)
}
//课程订单
export let courseOrder = (page, pagesize) => {
  return get(`/admin/courseOrder?page=${page}&pagesize=${pagesize}`)
}
//课程订单-根据订单id查询
export let promotionSearchByOrderId = (order) => {
  return get(`/admin/promotionSearchByOrderId?orderid=${order}`)
}
//后台管理-分销管理 按订单状态查询
export let promotionSearchByOrderStatus = (order, page, pagesize) => {
  return get(`/admin/promotionSearchByOrderStatus?orderstatus=${order}&page=${page}&pagesize=${pagesize}`)
}
//后台管理-分销管理 按订单来源查询
export let promotionSearchByOrderFrom = (order) => {
  return get(`/admin/promotionSearchByOrderFrom?orderfrom=${order}`)
}
//后台管理-分销管理 按订单起止日期查询
export let promotionSearchByOrderTime = (starttime, endtime, page, pagesize) => {
  return get(`/admin/promotionSearchByOrderTime?starttime=${starttime}&endtime=${endtime}&page=${page}&pagesize=${pagesize}`)
}
//后台管理-分销管理 按合伙人手机号查询
export let getByMobile = (mobile, page, pagesize) => {
  return get(`/admin/getByMobile?mobile=${mobile}&page=${page}&pagesize=${pagesize}`)
}
//后台管理-分销管理 按签约日期开始结束时间
export let getByTime = (starttime, endtime, page, pagesize) => {
  return get(`/admin/getByTime?starttime=${starttime}&endtime=${endtime}&page=${page}&pagesize=${pagesize}`)
}
//后台管理-分销管理 按签约期限查询
export let getByContractYear = (yearnum) => {
  return get(`/admin/getByContractYear?yearnum=${yearnum}`)
}
//后台管理-分销管理 总代按总代手机号查询
export let zongdaigetByMobile = (mobile, page, pagesize) => {
  return get(`/admin/zongdaigetByMobile?mobile=${mobile}&page=${page}&pagesize=${pagesize}`)
}
//后台管理-分销管理 总代按签约日期开始结束时间
export let zongdaigetByTime = (starttime, endtime, page, pagesize) => {
  return get(`/admin/zongdaigetByTime?starttime=${starttime}&endtime=${endtime}&page=${page}&pagesize=${pagesize}`)
}
//后台管理-分销管理 总代按签约期限查询
export let zongdaigetByContractYear = (yearnum) => {
  return get(`/admin/zongdaigetByContractYear?yearnum=${yearnum}`)
}
//后台管理-分销管理 总代按地区城市查询
export let zongdaigetByCity = (city, page, pagesize) => {
  return get(`/admin/zongdaigetByCity?city=${city}&page=${page}&pagesize=${pagesize}`)
}
//后台管理-分销管理 提现申请 按申请状态查询
export let getByCheckStatus = (checkstatus, page, pagesize) => {
  return get(`/admin/getByCheckStatus?checkstatus=${checkstatus}&page=${page}&pagesize=${pagesize}`)
}
//后台管理-分销管理 提现申请 按申请创建日期
export let getByCompanyPayTime = (starttime, endtime, page, pagesize) => {
  return get(`/admin/getByCompanyPayTime?starttime=${starttime}&endtime=${endtime}&page=${page}&pagesize=${pagesize}`)
}
//后台管理-选择题管理（restful接口）展示
export let getxuanzeti = (page, pagesize) => {
  return get(`/admin/xuanzeti?page=${page}&pagesize=${pagesize}`)
}
//后台管理-选择题管理（restful接口）新增
export let addxuanzeti = (data) => {
  return post(`/admin/xuanzeti`, data)
}
//后台管理-选择题管理（restful接口）修改
export let putxuanzeti = (data, id) => {
  return put(`/admin/xuanzeti/${id}`, data)
}
//后台管理-选择题管理（restful接口）删除
export let Deletexuanzeti = (id) => {
  return Delete(`/admin/xuanzeti/${id}`)
}
//后台管理-选择题管理（restful接口）根据题干搜索
export let searchxuanzeti = (content, page, pagesize) => {
  return get(`admin/xuanzetiFindByContent?content=${content}&page=${page}&pagesize=${pagesize}`)
}
//选择题按证书类型查询
export let searchxuanzeti2 = (certype, page, pagesize) => {
  return get(`/admin/xuanzetiFindByCertype?certype=${certype}&page=${page}&pagesize=${pagesize}`)
}
//选择题按课程名称查询
export let searchxuanzeti3 = (coursename, page, pagesize) => {
  return get(`/admin/xuanzetiFindByCourseName?coursename=${coursename}&page=${page}&pagesize=${pagesize}`)
}
//后台管理-判断题管理（restful接口）展示
export let getpanduanti = (page, pagesize) => {
  return get(`/admin/panduanti?page=${page}&pagesize=${pagesize}`)
}
//后台管理-判断题管理（restful接口）新增
export let addpanduanti = (data) => {
  return post(`/admin/panduanti`, data)
}
//后台管理-判断题管理（restful接口）修改
export let putpanduanti = (data, id) => {
  return put(`/admin/panduanti/${id}`, data)
}
//后台管理-判断题管理（restful接口）删除
export let Deletepanduanti = (id) => {
  return Delete(`/admin/panduanti/${id}`)
}
//后台管理-判断题管理（restful接口）根据证书类型搜索
export let searchpanduanti = (certype, page, pagesize) => {
  return get(`/admin/panduantiFindByCertype?certype=${certype}&page=${page}&pagesize=${pagesize}`)
}
//后台管理-判断题管理（restful接口）根据题干关键字搜索
export let searchpanduanti2 = (content, page, pagesize) => {
  return get(`admin/panduantiFindByContent?content=${content}&page=${page}&pagesize=${pagesize}`)
}
//后台管理-判断题管理（restful接口）根据课程名称搜索
export let searchpanduanti3 = (coursename, page, pagesize) => {
  return get(`/admin/panduantiFindByCourseName?coursename=${coursename}&page=${page}&pagesize=${pagesize}`)
}
//后台管理-简答题管理（restful接口）展示
export let getjiandati = (page, pagesize) => {
  return get(`/admin/jiandati?page=${page}&pagesize=${pagesize}`)
}
//后台管理-简答题管理（restful接口）新增
export let addjiandati = (data) => {
  return post(`/admin/jiandati`, data)
}
//后台管理-简答题管理（restful接口）修改
export let putjiandati = (data, id) => {
  return put(`/admin/jiandati/${id}`, data)
}
//后台管理-简答题管理（restful接口）删除
export let Deletejiandati = (id) => {
  return Delete(`/admin/jiandati/${id}`)
}
//后台管理-简答题管理（restful接口）根据证书类型搜索
export let searchjiandati = (certype, page, pagesize) => {
  return get(`/admin/jiandatiFindByCertype?certype=${certype}&page=${page}&pagesize=${pagesize}`)
}
//后台管理-简答题管理（restful接口）根据题干关键字搜索
export let searchjiandati2 = (content, page, pagesize) => {
  return get(`admin/jiandatiFindByContent?content=${content}&page=${page}&pagesize=${pagesize}`)
}
//后台管理-简答题管理（restful接口）根据课程名称搜索
export let searchjiandati3 = (coursename, page, pagesize) => {
  return get(`/admin/jiandatiFindByCourseName?coursename=${coursename}&page=${page}&pagesize=${pagesize}`)
}
//后台管理-综合题管理（restful接口）展示
export let getzongheti = (page, pagesize) => {
  return get(`/admin/zongheti?page=${page}&pagesize=${pagesize}`)
}
//后台管理-综合题管理（restful接口）新增
export let addzongheti = (data) => {
  return post(`/admin/zongheti`, data)
}
//后台管理-综合题管理（restful接口）修改
export let putzongheti = (data, id) => {
  return put(`/admin/zongheti/${id}`, data)
}
//后台管理-综合题管理（restful接口）删除
export let Deletezongheti = (id) => {
  return Delete(`/admin/zongheti/${id}`)
}

//后台管理-综合题管理（restful接口）根据证书类型搜索
export let searchzongheti = (certype, page, pagesize) => {
  return get(`/admin/zonghetiFindByCertype?certype=${certype}&page=${page}&pagesize=${pagesize}`)
}
//后台管理-综合题管理（restful接口）根据题干关键字搜索
export let searchzongheti2 = (content, page, pagesize) => {
  return get(`admin/zonghetiFindByContent?content=${content}&page=${page}&pagesize=${pagesize}`)
}
//后台管理-综合题管理（restful接口）根据课程名称搜索
export let searchzongheti3 = (coursename, page, pagesize) => {
  return get(`/admin/zonghetiFindByCourseName?coursename=${coursename}&page=${page}&pagesize=${pagesize}`)
}
//后台管理-试卷预览展示
export let getPaperList = (page, pagesize) => {
  return get(`/admin/getPaperList?page=${page}&pagesize=${pagesize}`)
}

//后台管理-试卷预览展示详情根据ID
export let getPaperInfo = (paperno) => {
  return get(`/admin/getPaperInfo?paperno=${paperno}`)
}

//后台管理-试卷管理==生成试卷
export let createPaper = (data) => {
  return post(`/admin/createPaper`, data)
}


//分割

//后台管理-答卷批改展示
export let paperScore = (page, pagesize) => {
  return get(`/admin/paperScore?page=${page}&pagesize=${pagesize}`)
}
//后台管理-单个答卷详细信息 阅卷展示
export let paperscoreid = (paperscoreid) => {
  return get(`/admin/showUserPaperDetail?paperscoreid=${paperscoreid}`)
}
//后台管理-阅卷完成 提交 
export let commitUserPaper = (data) => {
  return post(`/admin/commitUserPaper`, data)
}
//后台管理-学员报名信息管理
export let cerBaoMing = (page, pagesize) => {
  return get(`/admin/cerBaoMing?page=${page}&pagesize=${pagesize}`)
}
//后台管理-学员报名信息管理 新增
export let postcerBaoMing = (data) => {
  return post(`/admin/cerBaoMing`, data)
}
//后台管理-学员报名信息管理 修改
export let putcerBaoMing = (data, id) => {
  return put(`/admin/cerBaoMing/${id}`, data)
}
//后台管理-学员报名信息管理 删除
export let deletecerBaoMing = (id) => {
  return Delete(`/admin/cerBaoMing/${id}`)
}


//后台管理-学员考试结果管理（restful 接口）
export let getexamResult = (page, pagesize) => {
  return get(`/admin/examResult?page=${page}&pagesize=${pagesize}`)
}
//后台管理-学员考试结果管理（restful 接口） 新增
export let postexamResult = (data) => {
  return post(`/admin/examResult`, data)
}
//后台管理-学员考试结果管理（restful 接口） 修改
export let putexamResult = (data, id) => {
  return put(`/admin/examResult/${id}`, data)
}
//后台管理-学员考试结果管理（restful 接口） 删除
export let deleteexamResult = (id) => {
  return Delete(`/admin/examResult/${id}`)
}

// 产品模块管理
export let certificationSubject = (page, pagesize) => {
  return get(`/admin/certificationSubject?page=${page}&pagesize=${pagesize}`)
}
export let postcertificationSubject = (data) => {
  return post(`/admin/certificationSubject`, data)
}
export let putcertificationSubject = (data, id) => {
  return put(`/admin/certificationSubject/${id}`, data)
}
export let getCourseListByCerType = (certificationtype) => {
  return get(`/admin/getCourseListByCerType?certificationtype=${certificationtype}`)
}
export let deleteCourseListByCerType = (id) => {
  return Delete(`/admin/certificationSubject/${id}`)
}
//搜索全部
export let searchAllv2 = (keyword) => {
  return get(`/api/v2/searchAll?keyword=${keyword}`)
}

//搜索结果新增到列表
export let setCertificationCourse = (data) => {
  return post(`/admin/setCertificationCourse`, data)
}
// 后台管理证书下套课-删除
export let deleteCertificationCourse = (data) => {
  return post(`/admin/deleteCertificationCourse`, data)
}
//合伙人管理安总代手机号查询
export let getByZDMobile = (mobile, page, pagesize) => {
  return get(`/admin/getByZDMobile?mobile=${mobile}&page=${page}&pagesize=${pagesize}`)
}

// 用户列表查询
export let getUserInfoByMobile = (mobile) => {
  return get(`/admin/getUserInfoByMobile?mobile=${mobile}`)
}

// 用户列表查询
export let getCompanyPayByMobile = (mobile) => {
  return get(`/admin/getCompanyPayByMobile?mobile=${mobile}`)
}

// 抽题
export let getgenPaper = (page, pagesize) => {
  return get(`/admin/genPaper?page=${page}&pagesize=${pagesize}`)
}
export let postgenPaper = (data) => {
  return post(`/admin/genPaper`, data)
}
export let putgenPaper = (data, id) => {
  return put(`/admin/genPaper/${id}`, data)
}
export let deletegenPaper = (id) => {
  return Delete(`/admin/genPaper/${id}`)
}
//审阅完成提交试卷
export let shangxianshijuan = (data) => {
  return post(`/admin/checkPaper`, data)
}
//审阅删除试卷
export let shenyueDelete = (data) => {
  return get(`/admin/deleteByPaperNo?paperno=${data}`)
}
//预览试卷按照证书选择
export let selectTypeData = (val) => {
  return get(`/admin/getPaperListBySubject?subject=${val}`)
}
//预览试卷按照预览状态选择
export let selectStatusData = (val) => {
  return get(`/admin/getPaperListByCheckStatus?checkstatus=${val}`)
}
//审批试卷按证书选择
export let selectSubjectData = (subject) => {
  return get(`/admin/getExamResultBySubject?subject=${subject}`)
}
//审批试卷按审批状态选择
export let selectPaperStatusData = (paperstatus) => {
  return get(`/admin/getPaperByPaperStatus?paperstatus=${paperstatus}`)
}
//考试管理按证书类型筛选
export let selectPaperTypeData = (type) => {
  return get(`/admin/getPaperListByCertype?certype=${type}`)
}
//考试报名管理根据手机号搜索
export let selectPaperMobileData = (mobile) => {
  return get(`/admin/getBaoMingResultByMobile?mobile=${mobile}`)
}
//考试报名管理根据证书类型搜索
export let selectPaperCertypeData = (certype) => {
  return get(`/admin/getBaoMingResultByCertype?certype=${certype}`)
}
//考试报名结果手机号筛选
export let selectMobileJg = (mobile) => {
  return get(`/admin/getExamResultByMobile?mobile=${mobile}`)
}
//考试报名结果证书类型筛选
export let selectTypeJg = (subject) => {
  return get(`/admin/getExamResultBySubject?subject=${subject}`)
}
//考试报名结果是否通过筛选
export let selectPassJg = (ispass) => {
  return get(`/admin/getExamResultByResult?ispass=${ispass}`)
}

//分销数据折线图表数据
export let getDrawlineData = (item, daystr) => {
  return get(`/admin/part1Chart?item=${item}&daystr=${daystr}`)
}
//分销数据全国总代理饼状图
export let getDrawpie1Data = (starttime, endtime) => {
  return get(`/admin/part3Chart?starttime=${starttime}&endtime=${endtime}`)
}
//分销数据全国合伙人饼状图
export let getDrawpie2Data = (zongdaicode, starttime, endtime) => {
  return get(`/admin/part4Chart?zongdaicode=${zongdaicode}&starttime=${starttime}&endtime=${endtime}`)
}

//推广管理邀请海报-获取邀请海报列表
export let getPosterInvite = (page, pagesize) => {
  return get(`/admin/posterInvite?page=${page}&pagesize=${pagesize}`)
}
//推广管理邀请海报-修改海报
export let putPosterInvite = (id, datas) => {
  return put(`/admin/posterInvite/${id}`, datas)
}
//推广管理邀请海报-新增海报
export let postPosterInvite = (datas) => {
  return post(`/admin/posterInvite`, datas)
}
//推广管理邀请海报-删除海报
export let DelPosterInvite = (id) => {
  return Delete(`/admin/posterInvite/${id}`)
}
//推广管理“我的”页面图片-图片列表获取
export let getPosterMytab = (page, pagesize) => {
  return get(`/admin/myTabImg?page=${page}&pagesize=${pagesize}`)
}
//推广管理“我的”页面图片-图片列表编辑/修改
export let putPosterMytab = (id, datas) => {
  return put(`/admin/myTabImg/${id}`, datas)
}
//推广管理“我的”页面图片-图片列表新增
export let postPosterMytab = (datas) => {
  return post(`/admin/myTabImg`, datas)
}
//推广管理“我的”页面图片-图片列表删除
export let DelPosterMytab = (id) => {
  return Delete(`/admin/myTabImg/${id}`)
}
//推广管理课程促销-促销课程列表数据获取
export let getExamcuxiao = () => {
  return get(`/admin/promotionCourse`)
}
//推广管理课程促销-促销课程列表数据编辑
export let putExamcuxiao = (id, datas) => {
  return put(`/admin/promotionCourse/${id}`, datas)
}
//推广管理课程促销-促销课程列表数据新增
export let postExamcuxiao = (datas) => {
  return post(`/admin/promotionCourse`, datas)
}
//推广管理课程促销-促销课程列表数据删除
export let DelExamcuxiao = (id) => {
  return Delete(`/admin/promotionCourse/${id}`)
}
//推广管理课程促销-所有课程列表数据获取
export let getAllexam = (keyword) => {
  return get(`api/v2/searchAll?keyword=${keyword}`)
}

//媒体库-获取所有图片
export let getMediaData = () => {
  return get(`/admin/mediaImg`)
}
//媒体库-新增图片
export let postMediaData = (data) => {
  return post(`/admin/mediaImg`, data)
}
//媒体库-编辑修改图片
export let putMediaData = (id, datas) => {
  return put(`/admin/mediaImg/${id}`, datas)
}

export let DelMediaData = (id) => {
  return Delete(`/admin/mediaImg/${id}`)
}

export let getRouteTree = () => {
  return get(`/admin/getAllMenu`)
}

//路由管理---新增路由
export let postMenu = (data) => {
  return post(`/admin/menu`, data)
}

//路由管理---删除路由
export let DelMenu = (id) => {
  return Delete(`/admin/menu/${id}`)
}

//路由管理---修改路由
export let putMenu = (id, datas) => {
  return put(`/admin/menu/${id}`, datas)
}