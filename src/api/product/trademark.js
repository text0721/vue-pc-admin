import request from "@/utils/request";

const api_name = "/admin/product/baseTrademark/";

export default {
  //获取品牌数据列表
  getPagesTradeMarkList(page, limit) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: "GET"
    });
  },
  //获取品牌数据列表
  getTradeMarkList() {
    return request({
      url: `${api_name}/getTrademarkList`,
      method: "GET"
    });
  },
  //获取具体某个品牌数据id
  getTradeMark(id) {
    return request({
      url: `${api_name}/get/${id}`,
      method: "GET"
    });
  },
  //添加品牌数据列表
  addTradeMarkList(logoUrl, tmName) {
    return request({
      url: `${api_name}/save`,
      method: "POST",
      data: {
        logoUrl,
        tmName
      }
    });
  },
  //修改更新品牌数据列表
  updateTradeMarkList(logurl, tmName) {
    return request({
      url: `${api_name}/update`,
      method: "PUT",
      data: {
        logurl,
        tmName
      }
    });
  },
  //删除品牌数据列表
  delTradeMarkList(id) {
    return request({
      url: `${api_name}/remove/${id}`,
      method: "DELETE"
    });
  }
};
