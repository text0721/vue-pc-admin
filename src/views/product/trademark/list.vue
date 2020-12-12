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
        <el-form-item label="品牌名称" prop="tmName">
          <el-input v-model="ruleForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌logo" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
          >
            <img
              v-if="ruleForm.logoUrl"
              :src="ruleForm.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancelForm('ruleForm')">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >确定</el-button
          >
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
          <!--scope代表所有数据
              scope.row 代表当前行所有数据-->
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
    <!-- <el-pagination
      class="trademark-pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="size"
      :current-page.sync="current"
      layout="prev, pager, next, jumper,sizes,total"
      :total="total"
    >
    </el-pagination> -->
    <el-pagination
      class="trademark-pagination"
      @size-change="getPagesTradeMarkList(current, $event)"
      @current-change="getPagesTradeMarkList($event, size)"
      :page-sizes="[3, 6, 9]"
      :page-size.sync="size"
      :current-page.sync="current"
      layout="prev, pager, next, jumper,sizes,total"
      :total="total"
    >
    </el-pagination>
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
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "长度在 2 到 15 个字符",
            trigger: "blur",
          },
        ],
        logoUrl: [
          { required: true, message: "请上传品牌logo", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    //封装发送获取品牌列表的方法
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
    // handleCurrentChange(current) {
    //   this.getPagesTradeMarkList(current, this.size);
    // },
    // //当前页码条数发生改变时触发，自动接收当前页码的条数
    // handleSizeChange(size) {
    //   //设置每次都跳转到第一页
    //   this.getPagesTradeMarkList(1, size);
    // },

    //上传文件图片之前触发，里面进行图片校验，默认接收到传输的文件
    beforeAvatarUpload(file) {
      //支持的文件格式类型
      // const supportTypes = ["image/jpg", "image/png", "image/jpeg"];
      const supportTypes = ["image/jpg", "image/png"];
      //判断上传的类型是否支持
      const isVadilid = supportTypes.includes(file.type);
      // 校验文件的大小
      const isLt50kb = file.size / 1024 < 50;
      if (!isVadilid) {
        this.$message.error("上传图片只能是jpg/png文件!");
      }
      if (!isLt50kb) {
        this.$message.error("上传图片大小不能超过 50kb !");
      }
      return isVadilid && isLt50kb;
    },
    //文件上传之后触发(校验成功),显示图片
    handleAvatarSuccess(res, file) {
      //res是上传文件的具体信息，file是上传的整个,得到url后把url提交到后端服务器(actions)
      //将页面提交的图片url展示出来
      this.ruleForm.logoUrl = res.data;
    },
    //表单提交的时候触发
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate(async (valid) => {
        if (valid) {
          // 表示表单验证通过
          // const addResult = await this.$API.trademark.addTradeMarkList(
          //   this.ruleForm.tmName,
          //   this.ruleForm.logoUrl
          // );
          const addResult = await this.$API.trademark.addTradeMarkList(
            this.ruleForm
          );
          if (addResult.code === 200) {
            this.$message.success("添加品牌数据成功~");
            this.formVisible = false; // 隐藏对话框
            this.getPagesTradeMarkList(1, this.size); // 请求加载新数据
            // 清空原添加数据,方便后面添加
            this.ruleForm = {
              tmName: "",
              logoUrl: "",
            };
          } else {
            this.$message.error(result.message);
          }
        } else {
          //表示表单验证不通过
          this.$message.error("添加品牌失败,请重新添加");
          return false;
        }
      });
    },
    //取消提交表单的时候触发
    cancelForm(ruleForm) {
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

>>>.el-pagination__jump
  margin-left: 250px

/deep/.avatar-uploader .el-upload
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
