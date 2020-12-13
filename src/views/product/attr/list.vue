<template>
  <div>
    <Category @changeAttrs="getAttrs" />
    <el-card class="box-card" style="margin-top: 20px">
      <el-button type="primary" icon="el-icon-plus">添加属性</el-button>
      <el-table :data="attrs" border style="width: 100%; margin-top: 20px">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              style="margin-right: 5px"
              type="success"
              v-for="attrValue in row.attrValueList"
              :key="attrValue.id"
              >{{ attrValue.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <el-button
            type="warning"
            icon="el-icon-edit"
            class="trademark-handle"
            size="mini"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            class="trademark-handle"
            size="mini"
          ></el-button>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Category from "./Category";
export default {
  name: "AttrList",
  data() {
    return {
      attrs: [],
      category: {},
    };
  },
  methods: {
    async getAttrs(category) {
      this.category = category;
      // console.log(this.category);
      const result = await this.$API.attrs.getPagesTradeMarkList(this.category);
      console.log(result);
      if (result.code === 200) {
        this.attrs = result.data;
      } else {
        this.$message.error(result.message);
      }
    },
  },
  components: {
    Category,
  },
};
</script>
<style lang="sass" scoped>
</style>
