<template>
  <el-card class="box-card">
    <el-form :inline="true" :model="category" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select
          v-model="category.category1Id"
          placeholder="请选择"
          @change="getCategory2"
          :disabled="!isShow"
        >
          <el-option
            v-for="c1 in category1List"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="category.category2Id"
          placeholder="请选择"
          @change="getCategory3"
          :disabled="!isShow"
        >
          <el-option
            v-for="c2 in category2List"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="category.category3Id"
          placeholder="请选择"
          @change="getAttr"
          :disabled="!isShow"
        >
          <el-option
            v-for="c3 in category3List"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: "Category",
  data() {
    return {
      isDisabled: false, //设置下拉框是否禁用
      category1List: [],
      category2List: [],
      category3List: [],
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  props: ["isShow"],
  methods: {
    //请求二级分类列表
    async getCategory2() {
      const result = await this.$API.attrs.getCategory2(
        this.category.category1Id
      );
      if (result.code === 200) {
        this.category2List = result.data;
        this.category.category2Id = "";
        this.category.category3Id = "";
      } else {
        this.$message.error(result.message);
      }
      //清空父组件的等级列表
      this.$emit("clearCategory");
    },
    //请求三级分类列表
    async getCategory3() {
      const result = await this.$API.attrs.getCategory3(
        this.category.category2Id
      );
      if (result.code === 200) {
        this.category3List = result.data;
        this.category.category3Id = "";
      } else {
        this.$message.error(result.message);
      }
      //清空父组件的等级列表
      this.$emit("clearCategory");
    },
    //给父组件传递三级列表的各个id(自定义事件触发)
    getAttr() {
      const category = { ...this.category };
      this.$emit("changeAttrs", category);
      this.isDisabled = true;
    },
  },
  async mounted() {
    //获取一级分类列表
    const result = await this.$API.attrs.getCategory1();
    // this.$nextTick(() => {
    //   this.category1List = result.data;
    // });
    if (result.code === 200) {
      this.category1List = result.data;
      this.category.category2Id = "";
      this.category.category3Id = "";
    } else {
      this.$message.error(result.message);
    }
  },
};
</script>

<style lang='sass' scoped>
</style>
