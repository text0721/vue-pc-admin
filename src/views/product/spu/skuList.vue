<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form
        label-width="100px"
        :model="skuform"
        :rules="skuformRules"
        ref="skuformRules"
      >
        <el-form-item label="SPU名称">
          <span>{{ spu.spuName }}</span>
        </el-form-item>
        <el-form-item label="SkU名称" prop="skuName">
          <el-input
            type="text"
            placeholder="SkU名称"
            v-model="skuform.skuName"
          ></el-input>
        </el-form-item>
        <el-form-item label="价格(元)" prop="price">
          <el-input-number
            type="text"
            placeholder="SkU价格"
            v-model="skuform.price"
            controls-position="right"
            :min="0"
            align="left"
            style="width: 300px"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          label="重量(千克)"
          prop="kg"
          style="display: inline,width:150px"
        >
          <el-input-number
            type="text"
            placeholder="SkU重量"
            v-model="skuform.kg"
            controls-position="right"
            :min="0"
            align="left"
            style="width: 300px"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="规格描述" prop="description">
          <el-input
            type="textarea"
            placeholder="SkU规格描述"
            v-model="skuform.description"
          ></el-input>
        </el-form-item>

        <el-form-item label="平台属性" prop="skueAttr">
          <div
            class="skulist-select-container"
            v-for="attr in attrsList"
            :key="attr.id"
          >
            <span>{{ attr.attrName }}</span>
            <el-select placeholder="请选择">
              <el-option
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
                :value="attrValue.id"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>

        <el-form-item label="销售属性" prop="skuSaleAttr">
          <div
            class="skulist-select-container"
            v-for="spuSaleAttr in spuSaleAttrList"
            :key="spuSaleAttr.id"
          >
            <span>{{ spuSaleAttr.saleAttrName }}</span>
            <el-select placeholder="请选择">
              <el-option
                v-for="value in spuSaleAttr.spuSaleAttrValueList"
                :key="value.id"
                :label="value.saleAttrValueName"
                :value="value.id"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="图片列表" props="skuImgList">
          <el-table
            border
            :data="spuImageList"
            tooltip-effect="dark"
            style="width: 100%; margin: 20px 0"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="图片">
              <template v-slot="{ row }"
                ><img :src="row.imgUrl" :alt="row.imgName" style="width: 100px"
              /></template>
            </el-table-column>
            <el-table-column prop="imgName" label="名称"> </el-table-column>
            <el-table-column label="操作" show-overflow-tooltip>
              <template>
                <el-button type="primary" size="mini">设为默认</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">保存</el-button>
          <!-- <el-button @click="$emit('updateIsShow', skuform.category3Id)"
            >取消</el-button
          > -->
          <el-button @click="aaa">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "SkuList",
  props: {
    skuItem: Object,
  },
  data() {
    return {
      spu: this.skuItem, //包含spu和等级id
      skuform: {},
      spuSaleAttrList: [],
      spuImageList: [],
      attrsList: [], //平台属性
      skuformRules: {
        skuName: [{ required: true, message: "请输入sku名称" }],
        price: [{ required: true, message: "请输入sku价格" }],
        kg: [{ required: true, message: "请输入spu重量" }],
        description: [{ required: true, message: "请输入spu描述" }],
        skueAttr: [{ required: true, message: "请输入spu属性" }],
        skuSaleAttr: [{ required: true, message: "请输入spu销售属性" }],
        skuImgList: [{ required: true, validator: this.ImgsValidator }],
      },
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  methods: {
    aaa() {
      this.$emit("updateIsShow", this.skuform.category3Id);
      console.log("sku");
    },
    handleSelectionChange() {},
    //校验sku是否有图片
    ImgsValidator(rule, value, callback) {
      if (this.spuImageList.length > 0) {
        //校验通过直接调用回调函数即可，校验失败回调函数内提示即可
        callback();
        return;
      }
      callback("请至少上传一张图片");
    },
    //获取当前spu属性列表
    async getSpuSaleAttrsList() {
      const result = await this.$API.spu.getSpuSaleAttrList(this.spu.id);
      if (result.code === 200) {
        this.spuSaleAttrList = result.data;
        // console.log(this.spuSaleAttrList);
        this.$message.success("获取当前spu属性列表成功");
      } else {
        this.$message.error("获取当前spu属性列表失败");
      }
    },
    //获取spu的所有图片列表
    async getSpuImagesList() {
      const result = await this.$API.spu.getSpuImageList(this.spu.id);
      if (result.code === 200) {
        // 文档只能显示的格式:fileList:[{ name: "", url: "xxx" }],获取的数据需要格式化才能展示
        this.spuImageList = result.data;
        this.$message.success("获取spu所有图片列表成功");
      } else {
        this.$message.error("获取spu所有图片列表失败");
      }
    },
    //获取平台属性列表
    async pagesTradeMarkList() {
      const { category1Id, category2Id, category3Id } = this.category;
      const result = await this.$API.attrs.getPagesTradeMarkList({
        category1Id,
        category2Id,
        category3Id,
      });
      if (result.code === 200) {
        // console.log(result);
        this.attrsList = result.data;
        this.$message.success("获取spu平台属性成功");
      } else {
        this.$message.error("获取当前spu平台属性失败");
      }
    },
  },
  mounted() {
    this.getSpuSaleAttrsList();
    this.getSpuImagesList();
    this.pagesTradeMarkList();
  },
};
</script>
<style lang="sass" scoped>
>>>.el-input-number .el-input__inner
  text-align: left

.skulist-select-container
  margin-right: 20px
  display: inline-block
</style>
