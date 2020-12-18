// 引入@/api下面的所有接口，并重命名为API
import * as API from "@/api";
import { Message } from "element-ui";

export default {
  namespaced: true, //使用命名空间，后期使用该vuex前面都要加命名的路径
  state: {
    category: {
      category1Id: "",
      category2Id: "",
      category3Id: ""
    },
    category1List: [],
    category2List: [],
    category3List: []
  },
  getters: {},
  actions: {
    //获取一级分类列表
    async getCategory1List({ commit }) {
      const result = await API.attrs.getCategory1();
      if (result.code === 200) {
        commit("GET_CATEGORY1_LIST", result.data);
      } else {
        Message.error(result.message);
      }
    },
    async getCategory2List({ commit }, category1Id) {
      const result = await API.attrs.getCategory2(category1Id);
      if (result.code === 200) {
        commit("GET_CATEGORY2_LIST_SUCCESS", {
          category2List: result.data,
          category1Id
        });
      } else {
        commit("GET_CATEGORY2_LIST_ERROR", {
          category1Id
        });
        Message.error(result.message);
      }
    },
    async getCategory3List({ commit }, category2Id) {
      const result = await API.attrs.getCategory3(category2Id);
      if (result.code === 200) {
        commit("GET_CATEGORY3_LIST_SUCCESS", {
          category3List: result.data,
          category2Id
        });
      } else {
        commit("GET_CATEGORY3_LIST_ERROR", {
          category2Id
        });
        Message.error(result.message);
      }
    }
  },
  mutations: {
    GET_CATEGORY1_LIST(state, category1List) {
      // 获取1级分类列表（此时还未选择1级分类,不用清空2、3级分类）
      state.category1List = category1List;
    },
    GET_CATEGORY2_LIST_SUCCESS(state, { category2List, category1Id }) {
      //获取2级分类列表成功（此时已选择1级分类,清空2、3级分类相关）
      state.category2List = category2List;
      state.category.category1Id = category1Id;
      state.category3List = [];
      state.category.category2Id = "";
      state.category.category3Id = "";
    },
    GET_CATEGORY2_LIST_ERROR(state, category1Id) {
      state.category.category1Id = category1Id;
      state.category2List = [];
      state.category3List = [];
      state.category.category2Id = "";
      state.category.category3Id = "";
    },
    GET_CATEGORY3_LIST_SUCCESS(state, { category3List, category2Id }) {
      //获取3级分类列表成功
      state.category3List = category3List;
      state.category.category2Id = category2Id;
      state.category.category3Id = "";
    },
    GET_CATEGORY3_LIST_ERROR(state, category2Id) {
      state.category.category2Id = category2Id;
      state.category3List = [];
      state.category.category3Id = "";
    },
    GET_CATEGORY3_ID(state, category3Id) {
      state.category.category3Id = category3Id;
    },
    CLEAR_CAGEGORY_ID(state) {
      // 清空数据
      state.category.category1Id = "";
      state.category.category2Id = "";
      state.category.category3Id = "";
      state.category1List = [];
      state.category2List = [];
      state.category3List = [];
    }
  }
};
