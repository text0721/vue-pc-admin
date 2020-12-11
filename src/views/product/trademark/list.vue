<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <el-table :data="trademark" border style="width: 100%; margin-top: 20px">
      <el-table-column
        prop="num"
        label="序号"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column prop="name" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <!-- 使用作用域插槽，把子的数据传递到父元素上 -->
        <template slot-scope="scope">
          <!--
            scope代表所有数据
              scope.row 代表当前行所有数据
          -->
          <img class="trademark-img" :src="scope.row.logo" alt="logo" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button type="warning" icon="el-icon-edit" class="trademark-handle"
          >修改</el-button
        >
        <el-button type="danger" icon="el-icon-delete" class="trademark-handle"
          >删除</el-button
        >
      </el-table-column>
    </el-table>
    <el-pagination
      class="trademark-pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[3, 6, 9]"
      :page-size="3"
      layout="prev, pager, next, jumper,sizes,total"
      :total="20"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "TrademarkList",
  data() {
    return {
      trademark: [
        {
          num: "1",
          name: "大哈",
          logo:
            "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1607673477808&di=42d11c67672225dc1edc52d8d658d4da&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Ffront%2F600%2Fw360h240%2F20181026%2F2W8k-hmxrkzx3269112.jpg",
        },
      ],
    };
  },
};
</script>
<style lang="sass">
.trademark-img
  width: 150px

.trademark-handle
  width: 80px

.trademark-pagination
  text-align: right

.el-pagination__jump
  margin-left: 250px
</style>
