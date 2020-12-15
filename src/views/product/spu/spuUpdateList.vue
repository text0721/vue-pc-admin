<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form label-width="80px" :model="spuform">
        <el-form-item label="SPU名称">
          <el-input
            placeholder="请输入SPU名称"
            v-model="spuform.spuName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌">
          <el-select placeholder="请选择品牌" v-model="spuform.tmId">
            <el-option
              v-for="tm in TrademarkList"
              :key="tm.id"
              :label="tm.tmName"
              :value="tm.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
          <el-input
            type="textarea"
            placeholder="请输入SPU描述"
            v-model="spuform.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
          <el-upload
            class="avatar-uploader"
            list-type="picture-card"
            accept="image/*"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="formatSpuImageList"
            :action="`${$BASE_API}/admin/product/fileUpload`"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
          >
            <img v-if="false" src="xxxx" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>

        <el-form-item label="销售属性" prop="validateSpuFrom">
          <el-select
            :placeholder="`还剩${filterSaleAttrList.length}个未选择`"
            v-model="validateSpuFrom.saleAttrId"
          >
            <el-option
              v-for="sale in filterSaleAttrList"
              :key="sale.id"
              :label="sale.name"
              :value="sale.id"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            icon="el-icon-plus"
            :disabled="!validateSpuFrom.saleAttrId"
            >添加销售属性</el-button
          >
          <el-table
            :data="spuSaleAttrList"
            border
            style="width: 100%; margin: 20px 0"
          >
            <el-table-column
              type="index"
              label="序号"
              width="80"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="saleAttrName" label="属性名称" width="150">
            </el-table-column>
            <el-table-column label="属性值列表">
              <template v-slot="{ row }">
                <el-tag
                  style="margin-right: 5px"
                  v-for="saleAttr in row.spuSaleAttrValueList"
                  :key="saleAttr.id"
                  closable
                  >{{ saleAttr.saleAttrValueName }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="mini"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">保存</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>

      <!-- 隐藏放大的图片 -->
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { resetRouter } from "@/router";
export default {
  name: "SpuUpdateList",
  props: {
    spuItem: Object,
  },
  data() {
    return {
      spuform: this.spuItem,
      TrademarkList: [], //所有品牌清单,id,tmName,logoUrl
      spuImageList: [], //获取的spu图片列表格式:id,spuId,imgName,imgUrl
      dialogImageUrl: "", // 图片地址
      dialogVisible: false, // 图片对话框显示&隐藏
      saleAttrList: [], //所有销售属性
      spuSaleAttrList: [], //当前spu销售属性
      validateSpuFrom: {
        //当前的更新界面商品表单校验
        spuName: "", //商品名字
        description: "", //商品描述
        tmId: "", //品牌id
        saleAttrId: "", //销售属性id
      },
      inputVisible: false, //设置标签
      inputValue: "",
    };
  },
  computed: {
    //格式化请求返回的图片
    formatSpuImageList() {
      return this.spuImageList.map((img) => {
        return {
          uid: img.id || img.uid,
          name: img.imgName,
          url: img.imgUrl,
        };
      });
    },
    //过滤掉总销售属性和当前销售属性重复的部分
    filterSaleAttrList() {
      return this.saleAttrList.filter((sale) => {
        //找到id的表示是重复的，筛选出没有重复部分，即过滤返回没有重复部分
        return !this.spuSaleAttrList.find(
          (spuSale) => spuSale.baseSaleAttrId === sale.id
        );
      });
    },
  },
  methods: {
    //获取所有销售属性列表
    async getSaleAttrsList() {
      const result = await this.$API.spu.getSaleAttrList();
      if (result.code === 200) {
        this.saleAttrList = result.data;
        // console.log(result);
        this.$message.success("获取所有的销售属性成功");
      } else {
        this.$message.error("获取所有的销售属性失败");
      }
    },
    //获取当前spu属性列表
    async getSpuSaleAttrsList() {
      const result = await this.$API.spu.getSpuSaleAttrList(this.spuform.id);
      if (result.code === 200) {
        this.spuSaleAttrList = result.data;
        // console.log(this.spuSaleAttrList);
        this.$message.success("获取当前spu列表成功");
      } else {
        this.$message.error("获取当前spu列表失败");
      }
    },
    //获取所有的品牌列表
    async getAllTrademarkList() {
      const result = await this.$API.spu.getTrademarkList();
      if (result.code === 200) {
        this.TrademarkList = result.data;
        this.$message.success("获取所有的品牌列表成功");
      } else {
        this.$message.error("获取所有的品牌列表失败");
      }
    },
    //获取spu的所有图片列表
    async getSpuImagesList() {
      const result = await this.$API.spu.getSpuImageList(this.spuform.id);
      if (result.code === 200) {
        // 文档只能显示的格式:fileList:[{ name: "", url: "xxx" }],获取的数据需要格式化才能展示
        this.spuImageList = result.data;
        // .map((img) => {
        //   return {
        //     id: img.id,
        //     name: img.imgName,
        //     url: img.imgUrl,
        //   };
        // });
        // console.log(result.data)
        this.$message.success("获取spu所有图片列表成功");
      } else {
        this.$message.error("获取spu所有图片列表失败");
      }
    },
    //放大预览上传图片
    handlePreview(file) {
      // console.log(file);
      //默认接收到该图片的信息
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //移除上传图片
    handleRemove(file, fileList) {
      // 点击移出的时候将该图片移出spuImageList
      // console.log(file, fileList);
      this.spuImageList = this.spuImageList.filter(
        (spuImg) => spuImg.imgUrl != file.url
      );
    },
    //上传文件图片之前触发，里面进行图片校验，默认接收到传输的文件
    beforeAvatarUpload(file) {
      //  accept="image/png, image/jpeg"可以直接设置接受的文件的属性"image/*"即支持所有img格式
      //该函数是对accept类型的进一步规范校验
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
      // this.ruleForm.logoUrl = res.data;
      this.spuImageList.push({
        uid: file.uid,
        imgName: file.name,
        imgUrl: res.data,
      });
    },
    //点击小标签
    showInput() {
      this.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //小标签的添加文字处理
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
  },
  mounted() {
    this.getSaleAttrsList();
    this.getSpuSaleAttrsList();
    this.getAllTrademarkList();
    this.getSpuImagesList();
  },
};
</script>
<style lang="sass" scoped>
</style>
