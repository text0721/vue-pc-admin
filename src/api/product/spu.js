import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  //获取spu列表
  getSpuList({ current, size, category3Id }) {
    return request({
      url: `${api_name}/${current}/${size}`,
      method: "GET",
      params: {
        category3Id
      }
    });
  },
  //获取某个spu
  getSpu(spuId) {
    return request({
      url: `${api_name}/getSpuById/${spuId}`,
      method: "GET"
    });
  },
  //保存spu
  getSaveSpu(data) {
    return request({
      url: `${api_name}/saveSpuInfo`,
      method: "POST",
      data
    });
  },
  //更新spu
  getUpdateSpu(data) {
    return request({
      url: `${api_name}/updateSpuInfo`,
      method: "POST",
      data
    });
  },
  //删除spu
  deleteSpu(spuId) {
    return request({
      url: `${api_name}/deleteSpu/${spuId}`,
      method: "DELETE"
    });
  },
  //获取销售所有的商品属性
  getSaleAttrsList() {
    return request({
      url: `${api_name}/baseSaleAttrList`,
      method: "GET"
    });
  },
  //获取所有的品牌列表
  getTrademarkList() {
    return request({
      url: `${api_name}/baseTrademark/getTrademarkList`,
      method: "GET"
    });
  },
  //获取spu的所有图片列表
  getSpuImageList(spuId) {
    return request({
      url: `${api_name}/spuImageList/${spuId}`,
      method: "GET"
    });
  },
  //获取所有销售属性列表
  getSpuImageList(spuId) {
    return request({
      url: `${api_name}/spuImageList/${spuId}`,
      method: "GET"
    });
  }
};
