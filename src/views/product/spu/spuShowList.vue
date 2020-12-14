<template>
  <el-card style="margin-top: 20px">
    <el-button type="primary" icon="el-icon-plus">添加SPU</el-button>
    <el-table :data="spu" border style="width: 100%; margin-top: 20px">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column label="SPU名称"> </el-table-column>
      <el-table-column label="SPU描述"> </el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" icon="el-icon-plus" size="mini"></el-button>
        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
        <el-button type="info" icon="el-icon-info" size="mini"></el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  name: "SpuShowList",
  data() {
    return {
      spu: [],
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  methods: {},
};
</script>
<style lang="sass" scoped>
</style>
