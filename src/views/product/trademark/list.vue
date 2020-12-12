<template>
  <div>
    <!-- 点击添加展示的对话框 -->
    <el-dialog
      :title="`${ruleForm.id ? '修改' : '添加'}品牌`"
      :visible.sync="formVisible"
    >
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
    <el-button type="primary" icon="el-icon-plus" @click="addClear"
      >添加</el-button
    >
    <el-table
      v-loading="loading"
      :data="trademark"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <!-- 使用作用域插槽,把子的数据scope.row.logoUrl展示在父元素table上 -->
        <template slot-scope="scope">
          <!--scope代表所有数据
              scope.row 代表当前行所有数据-->
          <img
            class="trademark-img"
            :src="scope.row.logoUrl"
            alt="logo"
            style="height: 60px"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <!-- 解构scope获取里面row -->
        <template v-slot="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            class="trademark-handle"
            @click="update(row)"
            size="mini"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            class="trademark-handle"
            size="mini"
            @click="deltrademark(row)"
            >删除</el-button
          >
        </template>
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
      loading: false, //设置loading
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
            max: 10,
            message: "长度在 2 到 10 个字符",
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
      this.loading = true;
      const TradeMarkList = await this.$API.trademark.getPagesTradeMarkList(
        current,
        size
      );
      if (TradeMarkList.code === 200) {
        this.$message.success("数据请求成功");
        this.trademark = TradeMarkList.data.records;
        this.current = TradeMarkList.data.current;
        this.size = TradeMarkList.data.size;
        this.total = TradeMarkList.data.total;
      } else {
        this.$message.error("请求失败");
      }
      this.loading = false;
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
    //表单提交的时候触发,发送请求添加品牌
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate(async (valid) => {
        if (valid) {
          // 表示表单验证通过
          let addResult; //声明保存添加/修改后的返回值
          //判断是修改表单时提交的数据有无更改，无更改就不发送请求
          // const isUpdate = !!this.ruleForm.id;  //强制改成布尔值
          if (this.ruleForm.id) {
            //如果有id就代表是修改
            const nowtrademark = this.trademark.find(
              (item) => item.id === this.ruleForm.id
            );
            if (
              nowtrademark.tmName === this.ruleForm.tmName &&
              nowtrademark.tmName === this.ruleForm.tmName
            ) {
              this.$message.warning("不能提交与之前相同的数据");
              return;
            }
            // const addResult = await this.$API.trademark.addTradeMarkList({
            //   logoUrl: this.ruleForm.logoUrl,
            //   tmName: this.ruleForm.tmName,
            // });
            //如果是修改，调用修改的接口
            addResult = await this.$API.trademark.updateTradeMarkList(
              this.ruleForm
            );
          } else {
            // 如果是添加，调用添加的接口
            addResult = await this.$API.trademark.addTradeMarkList(
              this.ruleForm
            );
          }
          if (addResult.code === 200) {
            this.$message.success(
              `${this.ruleForm.id ? "修改" : "添加"}品牌数据成功~`
            );
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
    //点击添加按钮清除表单校验的内容
    addClear() {
      //先清空表单校验
      this.$refs.ruleForm && this.$refs.ruleForm.clearValidate();
      this.ruleForm.id = "";
      this.ruleForm.tmName = "";
      this.ruleForm.logoUrl = "";
      this.formVisible = true;
    },
    // 修改品牌数据
    update(row) {
      //先清空表单校验
      this.$refs.ruleForm && this.$refs.ruleForm.clearValidate();
      //属性多的时候合并,
      // this.ruleForm = Object.assign(this.ruleForm, row);
      this.ruleForm = { ...row };
      this.formVisible = true; //显示对话框
    },
    //删除品牌数据
    deltrademark(row) {
      this.$confirm(`确定删除 ${this.ruleForm.tmName} 吗?`, "提示", {
        type: "warning",
      })
        .then(async () => {
          const result = await this.$API.trademark.delTradeMarkList(row.id);
          if (result.code === 200) {
            this.$message.success("删除品牌数据成功");
            //删除后刷新列表
            this.getPagesTradeMarkList(1, this.size);
          }
        })
        .catch((error) => {
          if (error === "cancel") {
            // this.$message({
            //   type: "info",
            //   message: "已取消删除",
            // });
            this.$message.info("已取消删除");
          }
        });
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
