import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  //保存sku
  saveSpu(data) {
    return request({
      url: `${api_name}/saveSkuInfo`,
      method: "POST",
      data
    });
  }
};
