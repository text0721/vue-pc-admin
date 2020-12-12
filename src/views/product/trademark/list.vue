<template>
  <div>
    <!-- 点击添加展示的对话框 -->
    <el-dialog title="添加品牌" :visible.sync="formVisible">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="ruleForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" prop="region">
          <!-- <el-input v-model="ruleForm.logoUrl"></el-input> -->
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button @click="formVisible = false">取消</el-button>
          <el-button type="primary" @click="addTradeMark">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-button type="primary" icon="el-icon-plus" @click="formVisible = true"
      >添加</el-button
    >
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
      formVisible: false, //定义对话框默认不显示
      ruleForm: {
        tmName: "",
        logoUrl: "",
      },
      imageUrl: "",
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change",
          },
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" },
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
      },
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
    //定义添加品牌的方法
    addTradeMark() {
      this.formVisible = false;
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

>>>.avatar-uploader .el-upload
  border: 1px dashed #d9d9d9
  border-radius: 6px
  cursor: pointer
  position: relative
  overflow: hidden

  >>>.avatar-uploader .el-upload:hover
    border-color: #409EFF

  >>>.avatar-uploader-icon
    font-size: 28px
    color: #8c939d
    width: 178px
    height: 178px
    line-height: 178px
    text-align: center

  >>>.avatar
    width: 178px
    height: 178px
    display: block
</style>
