<template>
  <div>
    <el-card style="margin-top: 20px">
      <el-form
        label-width="100px"
        :model="skuform"
        :rules="rules"
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
          prop="weight"
          style="display: inline,width:150px"
        >
          <el-input-number
            type="text"
            placeholder="SkU重量"
            v-model="skuform.weight"
            controls-position="right"
            :min="0"
            align="left"
            style="width: 300px"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="规格描述" prop="skuDesc">
          <el-input
            type="textarea"
            placeholder="SkU规格描述"
            v-model="skuform.skuDesc"
          ></el-input>
        </el-form-item>

        <el-form-item label="平台属性" prop="skuAttrValueList">
          <div
            class="skulist-select-container"
            v-for="(attr, index) in attrsList"
            :key="attr.id"
            style="margin-bottom: 10px"
          >
            <el-form-item :label="attr.attrName" style="display: inline-block">
              <el-select
                placeholder="请选择"
                v-model="skuform.skuAttrValueList[index]"
                @change="clearValidate('skuAttrValueList')"
              >
                <el-option
                  v-for="attrValue in attr.attrValueList"
                  :key="attrValue.id"
                  :label="attrValue.valueName"
                  :value="`${attr.id}-${attrValue.id}`"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>

        <el-form-item label="销售属性" prop="skuSaleAttrValueList">
          <div
            class="skulist-select-container"
            v-for="(spuSaleAttr, index) in spuSaleAttrList"
            :key="spuSaleAttr.id"
            style="margin-bottom: 10px"
          >
            <el-form-item
              style="display: inline-block"
              :label="spuSaleAttr.saleAttrName"
            >
              <el-select
                placeholder="请选择"
                v-model="skuform.skuSaleAttrValueList[index]"
                @change="clearValidate('skuSaleAttrValueList')"
              >
                <el-option
                  v-for="value in spuSaleAttr.spuSaleAttrValueList"
                  :key="value.id"
                  :label="value.saleAttrValueName"
                  :value="value.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form-item>
        <el-form-item label="图片列表" prop="skuImageList">
          <el-form-item>
            <el-table
              border
              :data="spuImageList"
              tooltip-effect="dark"
              style="width: 100%; margin: 20px 0"
              @selection-change="handleSelectionChange"
              row-key="id"
            >
              <el-table-column type="selection" width="55" reserve-selection>
              </el-table-column>
              <el-table-column label="图片">
                <template v-slot="{ row }"
                  ><img
                    :src="row.imgUrl"
                    :alt="row.imgName"
                    style="width: 100px"
                /></template>
              </el-table-column>
              <el-table-column prop="imgName" label="名称"> </el-table-column>
              <el-table-column label="操作" show-overflow-tooltip>
                <template v-slot="{ row }">
                  <el-button
                    type="primary"
                    size="mini"
                    v-if="!row.isDefault"
                    @click="setDfaultImg(row.id)"
                    >设为默认</el-button
                  >
                  <el-tag v-else type="success">默认</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="$emit(`updateIsShow`, skuform.category3Id)"
            >取消</el-button
          >
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
      skuform: {
        skuAttrValueList: [],
        skuSaleAttrValueList: [],
        skuImageList: [],
      },
      spuSaleAttrList: [], //销售属性
      spuImageList: [],
      attrsList: [], //平台属性
      rules: {
        skuName: [
          { required: true, message: "请输入sku名称", trigger: "change" },
        ],
        price: [{ required: true, message: "请输入sku价格", trigger: "blur" }],
        weight: [{ required: true, message: "请输入sku重量", trigger: "blur" }],
        skuDesc: [
          { required: true, message: "请输入sku描述", trigger: "change" },
        ],
        skuAttrValueList: [
          {
            required: true,
            validator: this.skuAttrValueListValidator,
          },
        ],
        skuSaleAttrValueList: [
          {
            required: true,
            // validator: this.skuSaleAttrValueListValidator,
          },
        ],
        skuImageList: [
          {
            required: true,
            validator: this.skuImageListValidator,
          },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  methods: {
    //当复选框发生更改时候触发,收集sku图片,清除校验
    handleSelectionChange(row) {
      this.clearValidate("skuImageList");
      //默认接收到当前行的所有信息,即当前的某图片，赋值给当前sku图片列表
      this.skuform.skuImageList = row;
    },
    //设置默认图片
    setDfaultImg(id) {
      this.clearValidate("skuImageList");
      //给本页面展示数据设置默认
      this.spuImageList = this.spuImageList.map((img) => {
        // 判断给当前点击的img设置与返回数据一致的isDefault判断是否是默认图片
        return {
          ...img,
          isDefault: img.id === id ? true : false,
        };
      });
      //给传递的sku数据设置默认
      this.skuform.skuImageList = this.skuform.skuImageList.map((img) => {
        // 判断给当前点击的img设置与返回数据一致的isDefault判断是否是默认图片
        return {
          ...img,
          isDefault: img.id === id ? true : false,
        };
      });
    },
    //清除校验,当selected选中一个的时候先清除，save的时候统一校验
    clearValidate(prop) {
      this.$refs.skuformRules.clearValidate(prop);
    },
    //校验sku图片必须要有一张默认的，而且skulist必须有一张
    skuImageListValidator(rule, value, callback) {
      const {
        skuform: { skuImageList },
      } = this;

      if (skuImageList.length < 1) {
        callback(new Error("请选择至少一张图片~"));
        return;
      }
      //some符合一个就返回true，全部是false就返回false
      if (!skuImageList.some((img) => img.isDefault)) {
        callback(new Error("请设置一张默认图片~"));
        return;
      }
      callback();
    },
    //校验平台属性,全部都要选择
    skuAttrValueListValidator(rule, value, callback) {
      const {
        attrsList,
        skuform: { skuAttrValueList },
      } = this;
      //当选中最后一个属性,由于值是根据下标push进去的，所以此时两面的都是undefined，取反就是true
      if (
        skuAttrValueList.length !== attrsList.length ||
        skuAttrValueList.some((attr) => !attr)
      ) {
        callback("请选好每项平台属性");
        return;
      }
      callback();
    },
    //校验销售属性,全部都要选择
    skuSaleAttrValueListValidator(rule, value, callback) {
      const {
        spuSaleAttrList,
        skuform: { skuSaleAttrValueList },
      } = this;
      if (
        skuSaleAttrValueList.length !== spuSaleAttrList.length ||
        skuSaleAttrValueList.some((sale) => !sale)
      ) {
        callback("请选好每项平台属性");
        return;
      }
      callback();
    },
    //点击保存按钮，表单校验，整理数据，发送请求，切换界面
    save() {
      this.$refs.skuformRules.validate(async (valid) => {
        if (valid) {
          console.log(22);
          //表示校验通过
          //切割整理平台数据
          const skuAttrValueList = this.skuform.skuAttrValueList.map((attr) => {
            const [attrId, valueId] = attr.split("-");
            return {
              attrId,
              valueId,
            };
          });
          //整理销售数据
          const skuSaleAttrValueList = this.skuform.skuSaleAttrValueList.map(
            (saleAttrValueId) => {
              return {
                saleAttrValueId,
                spuId,
              };
            }
          );
          //整理默认图片的url
          const skuDefaultImg = this.skuform.skuImageList.find(
            (img) => img.isDefault
          ).imgUrl;
          const { category3Id, id: spuId, tmId } = this.spu;

          const result = await this.$API.sku.saveSpu({
            ...this.skuform,
            category3Id,
            tmId,
            skuAttrValueList,
            skuSaleAttrValueList,
            skuDefaultImg,
          });
          if (result.code === 200) {
            this.$message.success("保存sku成功");
            this.$emit("updateIsShow");
          }
        } else {
          this.$message.error("保存sku失败");
        }
      });
    },
    //获取当前spu属性列表
    async getSpuSaleAttrsList() {
      const result = await this.$API.spu.getSpuSaleAttrList(this.spu.id);
      if (result.code === 200) {
        this.spuSaleAttrList = result.data;
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
