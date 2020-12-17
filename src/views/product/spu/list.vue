<template>
  <div>
    <SkuList v-if="isShowSkuList" :skuItem="skuItem" />
    <div v-else>
      <Category :isShow="isShow" />
      <SpuShowList
        v-if="isShow"
        @changeIsShow="changeIsShow"
        @changeSkuIsShow="changeSkuIsShow"
      />
      <!-- 只能使用v-if:v-show只是隐藏样式，DOM是存在的，此时本组件的spuItem是空，已经传给子组件了，
    所以后面触发事件，子组件已经不能接受父组件最新的数据了-->
      <SpuUpdateList v-else :spuItem="spuItem" @updateIsShow="updateIsShow" />
    </div>
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";
import SkuList from "./skuList";

export default {
  name: "SpuList",
  data() {
    return {
      isShow: true, //设置SpuShowList组件与更新组件的切换
      isShowSkuList: false, //切换sku组件跟spu组件的切换缓存
      spuItem: {},
      skuItem: {},
    };
  },
  methods: {
    //SpuShowList组件遍历状态切换显示更新组件
    changeIsShow(row) {
      // this.spuItem = JSON.parse(JSON.stringify(row));
      this.spuItem = { ...row };
      this.isShow = false;
    },

    //update组件数据更新，父组件通知SpuShowList组件重新发送请求更新列表
    updateIsShow(category3Id) {
      this.isShow = true;
      //当父组件数据接受到，子组件SpuShowList的请求是异步更新，同步触发事件不能获取到数据
      this.$nextTick(() => {
        this.$bus.$emit("changeAttrs", { category3Id });
      });
    },

    //切换到spu组件
    changeSkuIsShow(row) {
      //其中row包含当前行数据以及传递等级id
      //row都是基本类型值，不用深度克隆
      this.skuItem = { ...row };
      this.isShowSkuList = true;
    },
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
    SkuList,
  },
};
</script>
