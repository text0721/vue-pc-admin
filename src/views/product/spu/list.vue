<template>
  <div>
    <Category />
    <SpuShowList v-show="isShow" />
    <SpuUpdateList v-show="!isShow" />
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
    };
  },
  components: {
    Category,
    SpuShowList,
    SpuUpdateList,
  },
};
</script>
