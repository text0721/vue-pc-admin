<template>
  <div>
    <Category
      @changeAttrs="getAttrs"
      @clearCategory="clearCategory"
      :isShow="isShow"
    />
    <el-card style="margin-top: 20px" v-show="isShow">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!isGetSuccess"
        @click="addAttrsList"
        >添加属性</el-button
      >
      <el-table :data="attrs" border style="width: 100%; margin-top: 20px">
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column prop="attrName" label="属性名称" width="150">
        </el-table-column>
        <el-table-column label="属性值列表">
          <template v-slot="{ row }">
            <el-tag
              style="margin-right: 5px"
              type="success"
              v-for="attrValue in row.attrValueList"
              :key="attrValue.id"
              >{{ attrValue.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template v-slot="{ row, $index }">
            <el-button
              type="warning"
              icon="el-icon-edit"
              class="trademark-handle"
              size="mini"
              @click="update(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              class="trademark-handle"
              size="mini"
              @click="delAttr(row, $index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card style="margin-top: 20px" v-show="!isShow">
      <el-form ref="form" :model="form" inline>
        <el-form-item label="属性名">
          <el-input
            v-model="form.attrName"
            placeholder="请输入属性名"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="isShow"
        @click="addAttr"
        >添加属性</el-button
      >
      <el-table
        :data="form.attrValueList"
        border
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column type="index" label="序号" width="80" align="center">
        </el-table-column>
        <el-table-column label="属性名称">
          <template v-slot="{ row }">
            <el-input
              autofocus
              ref="input"
              size="mini"
              v-model="row.valueName"
              v-if="row.edit"
              @blur="inputBlur(row)"
              @keyup.enter="row.edit = false"
            ></el-input>
            <span
              @click="edit(row)"
              v-else
              style="display: block; width: 100%"
              >{{ row.valueName }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ $index }">
            <el-button
              type="danger"
              icon="el-icon-delete"
              class="trademark-handle"
              size="mini"
              @click="delAttrValue($index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button type="primary" @click="saveAttrValue">保存</el-button>
      <el-button @click="isShow = true">取消</el-button>
    </el-card>
  </div>
</template>

<script>
import Category from "./Category";

export default {
  name: "AttrList",
  data() {
    return {
      isGetSuccess: false, //数据请求成功就高亮添加属性按钮
      isEmpty: false, //判断编辑后的输入内容是否为空
      isShow: true, //判断添加/修改还是正常显示数据
      attrs: [], //保存请求回来的属性列表
      category: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      form: {
        attrName: "",
        attrValueList: [],
      },
    };
  },
  methods: {
    //清空父级等级属性列表
    clearCategory() {
      this.isGetSuccess = false;
      this.attrs = [];
    },
    //获取具体属性列表——自动定义事件,子组件触发传递参数category
    async getAttrs(category) {
      this.isGetSuccess = false;
      this.category = category;
      const result = await this.$API.attrs.getPagesTradeMarkList(this.category);
      if (result.code === 200) {
        this.attrs = result.data;
        this.isGetSuccess = true;
      } else {
        this.$message.error(result.message);
      }
    },
    //点击直接添加属性按钮
    addAttrsList() {
      this.isShow = false;
      this.form.attrName = "";
      this.form.attrValueList = [];
      //清空id，后面是根据id判断是添加还是修改发送请求的
      this.form.attrName.id = "";
    },
    //点击编辑时"添加属性"的按钮
    addAttr() {
      this.form.attrValueList.push({ edit: true });
      this.$nextTick(() => {
        //让input获取焦点
        this.$refs.input.focus();
      });
    },
    //点击编辑按钮修改属性
    update(row) {
      console.log(row);
      this.form = JSON.parse(JSON.stringify(row));
      this.isShow = false;
    },
    //进入编辑后,编辑具体某个属性值的时候，添加edit为true,切换成input
    edit(row) {
      // console.log(row);
      this.$set(row, "edit", true);
      //让数据更新,将上行代码刷新，否则完成不了也页面的刷新
      this.$nextTick(() => {
        //让input获取焦点
        this.$refs.input.focus();
      });
    },
    //进入修改编辑后输入框失去焦点事件
    inputBlur(row) {
      //每次失去焦点之前统一改为input为空，再进入后面判断是否有值
      this.isEmpty = false;
      if (!row.valueName) {
        this.isEmpty = true;
        this.$refs.input.focus();
        // this.$message.warning("请输入正确的品牌属性值");
        return;
      }
      row.edit = false;
    },
    //点击修改后的保存按钮，发送请求
    async saveAttrValue() {
      if (this.isEmpty) {
        this.$message.warning("品牌属性值不能为空");
        return;
      }
      // console.log(this.form);
      //判断是修改还是添加,form有id就是修改，没有就是添加上上传level等级跟属性catogeryid，
      // 修改就传只attrName跟attrValueList
      const isAdd = !!this.form.id;
      let resultData;
      if (!isAdd) {
        resultData = {
          ...this.form,
          categoryId: this.category.category3Id,
          categoryLevel: 3,
        };
      } else {
        resultData = this.form;
      }
      const result = await this.$API.attrs.saveAttrInfore(resultData);
      if (result.code === 200) {
        this.$message.success("品牌属性更新成功");
        this.isShow = true;
        //刷新页面重新获取所有的属性值
        const res = await this.$API.attrs.getPagesTradeMarkList(this.category);
        if (res.code === 200) {
          this.attrs = res.data;
        } else {
          this.$message.error(res.message);
        }
      } else {
        this.$message.error("添加品牌属性失败,请重新添加");
      }
    },
    //进入编辑后点击删除
    delAttrValue($index) {
      this.form.attrValueList.splice($index, 1);
    },
    //直接删除属性
    delAttr(row) {
      this.$confirm("您确定删除该品牌属性吗", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const result = await this.$API.attrs.deleteAttr(row.id);
          if (result.code === 200) {
            this.$message.success("删除品牌数据成功");
            const res = await this.$API.attrs.getPagesTradeMarkList(
              this.category
            );
            if (res.code === 200) {
              this.attrs = res.data;
            }
          } else {
            this.$message.error("删除品牌数据失败");
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
  },
  components: {
    Category,
  },
};
</script>
<style lang="sass" scoped>
</style>
