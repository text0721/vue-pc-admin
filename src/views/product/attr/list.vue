<template>
  <div>
    <el-card class="box-card">
      <el-form :inline="true" :model="AttrList" class="demo-form-inline">
        <el-form-item label="一级分类">
          <el-select v-model="AttrList" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类">
          <el-select v-model="AttrList" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类">
          <el-select v-model="AttrList" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <el-button type="primary" icon="el-icon-plus">添加属性</el-button>
      <el-table :data="attr" border style="width: 100%; margin-top: 20px">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="attr.name" label="属性名称" width="150">
        </el-table-column>
        <el-table-column label="属性值列表"> </el-table-column>
        <el-table-column label="操作" width="150">
          <el-button type="warning" icon="el-icon-edit" class="trademark-handle"
            >编辑</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            class="trademark-handle"
            >删除</el-button
          >
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "AttrList",
  data() {
    return {
      AttrList: {},
      attr: [],
    };
  },
};
</script>
<style lang="sass" scoped>
</style>
