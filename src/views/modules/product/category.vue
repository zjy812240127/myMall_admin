<!--  -->
<template>
  <div>
    <el-tree
      :data="menus"
      show-checkbox
      node-key="catId"
      :props="defaultProps"
      :default-expanded-keys="expendedKey"
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="node.level <= 2"
            type="text"
            size="mini"
            @click="() => append(data)"
          >
            Append
          </el-button>
          <el-button
            v-if="node.childNodes.length == 0"
            type="text"
            size="mini"
            @click="() => remove(node, data)"
          >
            Delete
          </el-button>
        </span>
      </span>
    </el-tree>

    <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
      <el-form :model="category">
        <el-form-item label="菜单名称">
          <el-input v-model="category.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import category from "@/api/product/category";

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    return {
      category: { name: "", parentCid: 0, catLevel: 1, showStatus: 1, sort: 0 },
      dialogFormVisible: false,
      menus: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      expendedKey: [],
    };
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    handleNodeClick(data) {
      console.log(data);
    },

    getDataList() {
      this.dataListLoading = true;
      this.$http({
        url: this.$http.adornUrl("/product/category/getListWithTree"),
        method: "get",
      }).then((response) => {
        console.log(response);
        this.menus = response.data.list;
      });
    },

    append(data) {
      this.category.parentCid = data.catId;
      this.category.catLevel = data.catLevel * 1 + 1;

      console.log("append", data);

      this.dialogFormVisible = true;
    },

    addCategory() {
      category.insertCategory(this.category).then((response) => {
        // 显示信息
        this.$message({
          type: "success",
          message: "添加菜单成功!",
        });
        // 刷新列表
        this.getDataList();
        // 默认展开的节点
        this.expendedKey = [this.category.parentCid];
      });

      this.dialogFormVisible = false;
    },

    remove(node, data) {
      // 删除按钮，这里的id不能少，不然以下程序找不到id
      // 弹框确认是否删除
      var ids = [data.catId];
      this.$confirm(
        `是否删除【${data.name}】此操作将永久删除课程信息, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        // 若确认删除，走后台  刷新列表
        // id由按钮中的scope.row.id传递
        category
          .deleteByIdList(ids)
          .then((response) => {
            // 显示信息
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 刷新列表
            this.getDataList();
            // 默认展开的节点 -- 删除节点的父节点
            this.expendedKey = [node.parent.data.catId];
          })
          .catch((err) => {
            consolo.log("返回数据报错");
          });
      });
      // 统一不写.catch（）方法，因为有可能会报错
      console.log("remove", data, node);
    },
  },

  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getDataList();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style scoped>
</style>