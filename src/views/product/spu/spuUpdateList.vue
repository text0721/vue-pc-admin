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
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="spuImageList"
            :action="`${$BASE_API}/admin/product/fileUpload`"
          >
            <img v-if="false" src="xxxx" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span>只能上传jpg/png文件，且不超过50kb</span>
        </el-form-item>

        <el-form-item label="销售属性" :model="spuform">
          <el-select placeholder="还剩3个未选择">
            <el-option>11</el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-plus">添加销售属性</el-button>
          <el-table :data="[]" border style="width: 100%; margin: 20px 0">
            <el-table-column
              type="index"
              label="序号"
              width="80"
              align="center"
            >
            </el-table-column>
            <el-table-column prop="attrName" label="属性名称" width="150">
            </el-table-column>

            <el-table-column label="属性值列表">
              <template>
                <el-tag style="margin-right: 5px">xxxx</el-tag>
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
export default {
  name: "SpuUpdateList",
  props: {
    spuItem: Object,
  },
  data() {
    return {
      spuform: this.spuItem,
      TrademarkList: [], //所有品牌清单,id,tmName,logoUrl
      spuImageList: [], //所有spu图片列表,id,spuId,imgName,imgUrl
      dialogImageUrl: "", // 图片地址
      dialogVisible: false, // 图片对话框显示&隐藏
    };
  },
  methods: {
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
        // 文档显示格式：fileList: [{ name: "", url: "xxx" }],
        this.spuImageList = result.data.map((img) => {
          return {
            id: img.id,
            name: img.imgName,
            url: img.imgUrl,
          };
        });
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
        (spuImg) => spuImg.id != file.id
      );
    },
  },
  mounted() {
    this.getAllTrademarkList();
    this.getSpuImagesList();
  },
};
</script>
<style lang="sass" scoped>
</style>
