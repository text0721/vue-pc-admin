<template>
  <div>
    <Category :isShow="isShow" />
    <SpuShowList v-if="isShow" @changeIsShow="changeIsShow" />
    <!-- 只能使用v-if:v-show只是隐藏样式，DOM是存在的，此时本组件的spuItem是空，已经传给子组件了，
    所以后面触发事件，子组件已经不能接受父组件最新的数据了-->
    <SpuUpdateList v-else :spuItem="spuItem" @updateIsShow="updateIsShow" />
  </div>
</template>

<script>
import Category from "@/components/Category";
import SpuShowList from "./spuShowList";
import SpuUpdateList from "./spuUpdateList";

export default {
  name: "SpuList",
  data() {
    return {
      isShow: true,
      spuItem: {},
    };
  },
  methods: {
    //SpuShowList组件遍历状态切换显示更新组件
    changeIsShow(row) {
      this.isShow = false;
      // this.spuItem = JSON.parse(JSON.stringify(row));
      this.spuItem = { ...row };
      // console.log(this.spuItem);
    },
    //update组件数据更新，父组件通知SpuShowList组件重新发送请求更新列表
    updateIsShow() {
      this.isShow = true;
      // this.$next(() => {
      //   this.$bus.$emit("changeAttrs");
      // });
    },
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
  },
};
</script>
