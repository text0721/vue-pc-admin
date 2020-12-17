<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form
        label-width="80px"
        :model="spuform"
        :rules="rules"
        ref="formRules"
      >
        <el-form-item label="SPU名称" prop="spuName">
          <el-input
            placeholder="请输入SPU名称"
            v-model="spuform.spuName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌" prop="tmId">
          <el-select placeholder="请选择品牌" v-model="spuform.tmId">
            <el-option
              v-for="tm in TrademarkList"
              :key="tm.id"
              :label="tm.tmName"
              :value="tm.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="SPU描述" prop="description">
          <el-input
            type="textarea"
            placeholder="请输入SPU描述"
            v-model="spuform.description"
          ></el-input>
        </el-form-item>
        <el-form-item label="SPU图片" prop="spuImageList">
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

        <el-form-item label="销售属性" prop="spuSaleAttrList">
          <el-select
            :placeholder="`还剩${filterSaleAttrList.length}个未选择`"
            v-model="spuform.spuSaleAttrId"
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
            :disabled="!spuform.spuSaleAttrId"
            @click="clickAddSaleAttr"
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
                  v-for="(saleAttr, index) in row.spuSaleAttrValueList"
                  :key="saleAttr.id"
                  closable
                  @close="delTag(row, index)"
                  >{{ saleAttr.saleAttrValueName }}</el-tag
                >
                <el-input
                  v-if="row.edit"
                  v-model="saleAttrValueText"
                  ref="input"
                  size="mini"
                  style="width: 100px"
                  autofocus
                  @keyup.enter.native="addSaleAttr(row)"
                  @blur="addSaleAttr(row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="edit(row)"
                  >+ 添加</el-button
                >
              </template>
            </el-table-column>

            <el-table-column label="操作" width="150">
              <template v-slot="{ row, $index }">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="delSpuAttrValue(row, $index)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="$emit('updateIsShow', spuform.category3Id)"
            >取消</el-button
          >
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
      saleAttrValueText: "", //添加编辑的销售属性值
      rules: {
        spuName: [{ required: true, message: "请输入spu名称" }],
        tmId: [{ required: true, message: "请输入spu品牌" }],
        description: [{ required: true, message: "请输入spu描述" }],
        spuImageList: [{ required: true, validator: this.ImgsValidator }],
        spuSaleAttrList: [
          { required: true, validator: this.saleAttrValidator },
        ],
      },
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
    //点击添加销售属性列表
    clickAddSaleAttr() {
      //从当前spuform中解构出将来肯定有的spuSaleAttrId和本商品id
      const { spuSaleAttrId, id } = this.spuform;
      //从所有销售属性id中找到当前的spu的id相同的销售属性对象
      const saleresult = this.saleAttrList.find(
        (sale) => sale.id === spuSaleAttrId
      );
      /*{spuSaleAttrList的结构
          "baseSaleAttrId": 0, // 所有销售属性id
          "id": 0, // 由后台生成
          "saleAttrName": "string",  // 所有销售属性名称
          "spuId": 0, // SPU id
          "spuSaleAttrValueList": [
               {
                 "baseSaleAttrId": 0,
                 "id": 0,
                 "isChecked": "string",
                 "saleAttrName": "string",
                 "saleAttrValueName": "string",
                 "spuId": 0
               }
          ]
      }*/
      // 将销售属性添加到商品中
      this.spuSaleAttrList.push({
        baseSaleAttrId: saleresult.id, //上行找到的销售属性id
        // id: spuform.id,
        saleAttrName: saleresult.name, //上行找到的销售属性name
        spuId: id, //当前spu商品的id
        spuSaleAttrValueList: [],
      });
      //清空spuSaleAttrId,
      this.spuform.spuSaleAttrId = "";
    },
    //点击添加按钮,给当前row添加edit为true,以此显示input框
    edit(row) {
      this.$set(row, "edit", true);
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
    //添加销售属性值
    addSaleAttr(row) {
      if (this.saleAttrValueText) {
        row.spuSaleAttrValueList.push({
          baseSaleAttrId: row.baseSaleAttrId,
          // id: 0,
          saleAttrName: row.saleAttrName,
          saleAttrValueName: this.saleAttrValueText,
          spuId: row.spuId,
        });
        //添加完后清空输入的内容
        this.saleAttrValueText = "";
      }
      row.edit = false;
    },
    //删除spu单个销售属性值
    delTag(row, index) {
      // console.log(row, index);
      row.spuSaleAttrValueList.splice(index, 1);
    },
    //删除当前spu整个销售属性
    delSpuAttrValue(row, index) {
      const { saleAttrName } = row;
      this.$confirm(`您确定删除${saleAttrName}属性吗?`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.spuSaleAttrList.splice(index, 1);
        })
        .catch(() => {
          this.$message.info(`已取消删除${row.saleAttrName}属性`);
        });
    },
    //校验spu图片是否添加
    ImgsValidator(rule, value, callback) {
      if (this.spuImageList.length > 0) {
        //校验通过直接调用回调函数即可，校验失败回调函数内提示即可
        callback();
        return;
      }
      callback("请至少上传一张图片");
    },
    //校验销售属性及属性值是否添加
    saleAttrValidator(rule, value, callback) {
      //至少有一个销售属性
      if (this.spuSaleAttrList.length === 0) {
        callback("请至少选择一个销售属性");
        return;
      }
      //至少要有一个属性值
      const includAttr = this.spuSaleAttrList.some(
        (attr) => attr.spuSaleAttrValueList.length > 0
      );
      if (!includAttr) {
        callback("请至少选择一个销售属性值");
        return;
      }
      //校验成功走下一步
      callback();
    },
    //校验成功后,点击保存发送请求更新spu数据
    save() {
      /*   
        "category3Id": 0,
        "description": "string",
        "id": 0,
        "spuImageList": [],
        "spuName": "string",
        "spuSaleAttrList": [],
        "tmId": 0
      */
      this.$refs.formRules.validate(async (valid) => {
        if (valid) {
          // console.log("校验成功");
          // 表单验证通过之后发送请求，更新spu数据
          const data = {
            ...this.spuform,
            spuImageList: this.spuImageList,
            spuSaleAttrList: this.spuSaleAttrList,
          };

          //判断是更新还是添加,如果spu有自己的id就是更新
          let result;
          if (this.spuform.id) {
            result = await this.$API.spu.getUpdateSpu(data);
          } else {
            result = await this.$API.spu.getSaveSpu(data);
          }

          if (result.code === 200) {
            this.$message.success(
              `${this.spuform.id ? "更新" : "添加"}spu数据成功`
            );
            //通知父组件切换到正常的show页面
            this.$emit("updateIsShow", this.spuform.category3Id);
          } else {
            this.$message.error(
              `${this.spuform.id ? "更新" : "添加"}spu数据失败，请重新操作`
            );
          }
        } else {
          this.$message.error(
            `${this.spuform.id ? "更新" : "添加"}spu数据失败，请重新操作`
          );
        }
      });
    },
    //获取所有销售属性列表
    async getSaleAttrsList() {
      const result = await this.$API.spu.getSaleAttrList();
      if (result.code === 200) {
        this.saleAttrList = result.data;
        // console.log(result);
        this.$message.success("获取所有销售属性成功");
      } else {
        this.$message.error("获取所有销售属性失败");
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
        this.$message.success("获取所有品牌列表成功");
      } else {
        this.$message.error("获取所有品牌列表失败");
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
      //accept="image/png, image/jpeg"可以直接设置可以选择接受的文件的属性,"image/*"即支持所有img格式筛选
      //该函数是对accept类型的进一步规范校验
      //支持的文件格式类型,jpeg,跟jep一起写，两者格式可能出现判断失误
      const supportTypes = ["image/jpg", "image/png", "image/jpeg"];
      //判断上传的类型是否支持
      const isVadilid = supportTypes.includes(file.type);
      // const isVadilid = supportTypes.indexOf(file.type) > -1;
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
  },
  mounted() {
    this.getSaleAttrsList();
    this.getAllTrademarkList();
    //判断spu自己有没有id，有就是更新，没有就是添加，就只发送前两个请求
    if (this.spuform.id) {
      this.getSpuSaleAttrsList();
      this.getSpuImagesList();
    }
  },
};
</script>
<style lang="sass" scoped>
</style>
