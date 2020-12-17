<template>
  <el-card style="margin-top: 20px">
    <el-button
      type="primary"
      icon="el-icon-plus"
      @click="$emit('changeIsShow', { category3Id })"
      >添加SPU</el-button
    >
    <el-table
      :data="spuList"
      border
      v-loading="loading"
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column label="SPU名称" prop="spuName"> </el-table-column>
      <el-table-column label="SPU描述" prop="description"> </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row, $index }">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="$emit('changeSkuIsShow', { ...row, ...category })"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="checkedShow(row)"
          ></el-button>
          <el-button type="info" icon="el-icon-info" size="mini"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="delSpu(row, $index)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

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
  </el-card>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "SpuShowList",
  // props: {
  //   changeIsShow: Function,
  // },
  data() {
    return {
      current: 1, // 代表当前页码
      size: 3, // 代表每页显示的条数
      total: 0,
      loading: false, //设置loading
      isGetSuccess: false, //设置添加spu属性的高亮
      spuList: [], //所有的Spu列表
      // category: {
      //   category1Id: "",
      //   category2Id: "",
      //   category3Id: "",
      // },
    };
  },
  watch: {
    "category.category3Id": {
      handler(category3Id) {
        //不可以直接在mounted中调用，因为一上来该组件是展示的，category3Id是空，自然不会渲染数据
        if (!category3Id) return;
        this.getPagesTradeMarkList();
      },
      immediate: true, // 一上来触发一次
    },
  },
  computed: {
    ...mapState({
      category: (state) => state.category.category,
    }),
  },
  methods: {
    //删除当前的某个spu
    delSpu(row, index) {
      this.$confirm(`您确定删除${row.spuName}吗?`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const result = await this.$API.spu.deleteSpu(row.id);
          if (result.code === 200) {
            this.spuList = this.spuList.splice(index, 1);
            this.$message.success(`删除${row.spuName}成功`);
            //重新刷新列表
            this.getPagesTradeMarkList();
          } else {
            this.$message.error(`删除${row.spuName}失败`);
          }
        })
        .catch(() => {
          this.$message.info(`您已取消删除${row.spuName}`);
        });
    },
    //当等级属性更改的时候,该组件子显示的内容要清空
    //清空等级属性列表
    clearCategory() {
      this.isGetSuccess = false;
      this.spuList = [];
    },
    // Category组件三级分类选择好后，触发获取具体spu列表，使用全局事件总线,
    getSpuLists(category) {
      this.isGetSuccess = false;
      this.category = category;
      this.getPagesTradeMarkList();
    },
    //请求spu列表
    async getPagesTradeMarkList() {
      this.loading = true;
      const result = await this.$API.spu.getSpuList({
        current: this.current,
        size: this.size,
        category3Id: this.category.category3Id,
      });
      if (result.code === 200) {
        this.$message.success("SPU数据请求成功");
        this.spuList = result.data.records;
        this.current = result.data.current;
        this.size = result.data.size;
        this.total = result.data.total;
      } else {
        this.$message.error("请求失败");
      }
      this.loading = false;
    },
    //切换显示spu的具体操作,把该行的数据传给父组件，然后父组件传递给update组件展示
    checkedShow(row) {
      this.$emit("changeIsShow", row);
    },
  },
  mounted() {
    //category组件触发发送给过来属性id数据，同时本组件请求属性3的spu数据列表
    // this.$bus.$on("changeAttrs", this.getSpuLists);
    // this.$bus.$on("clearCategory", this.clearCategory);
  },
  beforeDestroy() {
    //不清理会累计请求，当真正请求时，本组件会累计触发
    // this.$bus.$off("changeAttrs", this.getAttrs);
    // this.$bus.$off("clearCategory", this.clearCategory);
  },
};
</script>
<style lang="sass" scoped>
.trademark-handle
  width: 80px

>>>.trademark-pagination
  text-align: right

>>>.el-pagination__jump
  margin-left: 250px
</style>
