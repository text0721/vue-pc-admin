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
  //添加品牌数据列表
  // addTradeMarkList(logoUrl, tmName) {
  //   return request({
  //     url: `${api_name}/save`,
  //     method: "POST",
  //     data: {
  //       logoUrl,
  //       tmName
  //     }
  //   });
  // },
  addTradeMarkList(data) {
    return request({
      url: `${api_name}/save`,
      method: "POST",
      data
    });
  },
  //修改更新品牌数据列表
  updateTradeMarkList(data) {
    return request({
      url: `${api_name}/update`,
      method: "PUT",
      data
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
