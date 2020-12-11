<template>
  <div>
    <el-button type="primary" icon="el-icon-plus">添加</el-button>
    <el-table :data="trademark" border style="width: 100%; margin-top: 20px">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <!-- 使用作用域插槽，把子的数据传递到父元素上 -->
        <template slot-scope="scope">
          <!--
            scope代表所有数据
              scope.row 代表当前行所有数据
          -->
          <img class="trademark-img" :src="scope.row.logoUrl" alt="logo" />
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
      :page-size.sync="size"
      :current-page.sync="current"
      layout="prev, pager, next, jumper,sizes,total"
      :total="total"
    >
    </el-pagination>
    <!-- <el-pagination
      class="trademark-pagination"
      @size-change="getPagesTradeMarkList(current, $event)"
      @current-change="getPagesTradeMarkList($event, size)"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="size"
      :current-page.sync="current"
      layout="prev, pager, next, jumper,sizes,total"
      :total="total"
    >
    </el-pagination> -->
  </div>
</template>

<script>
export default {
  name: "TrademarkList",
  data() {
    return {
      trademark: [],
      current: 1, // 代表当前页码
      size: 3, // 代表每页显示的条数
      total: 0,
    };
  },
  methods: {
    async getPagesTradeMarkList(current, size) {
      const TradeMarkList = await this.$API.trademark.getPagesTradeMarkList(
        current,
        size
      );
      // console.log(TradeMarkList);
      if (TradeMarkList.code === 200) {
        this.$message.success("数据请求成功");
        this.trademark = TradeMarkList.data.records;
        this.current = TradeMarkList.data.current;
        this.size = TradeMarkList.data.size;
        this.total = TradeMarkList.data.total;
      } else {
        this.$message.error("请求失败");
      }
    },
    // 方法1：当前页码发生改变时触发，自动接受当前点击的页码
    handleCurrentChange(current) {
      this.getPagesTradeMarkList(current, this.size);
    },
    //当前页码条数发生改变时触发，自动接收当前页码的条数
    handleSizeChange(size) {
      this.current = 1;
      this.getPagesTradeMarkList(this.current, size);
    },
  },
  mounted() {
    this.getPagesTradeMarkList(this.current, this.size);
  },
};
</script>
<style lang="sass" scoped>
.trademark-img
  width: 150px

.trademark-handle
  width: 80px

>>>.trademark-pagination
  text-align: right

/deep/.el-pagination__jump
  margin-left: 250px
</style>
