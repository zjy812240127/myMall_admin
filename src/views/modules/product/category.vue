<!--  -->
<template>
  <div>
    <el-switch
      style="display: block"
      v-model="dragable"
      active-color="#13ce66"
      inactive-color="#ff4949"
      active-text="允许拖拽"
      inactive-text="不允许拖拽"
    >
    </el-switch
    ><el-button type="danger" @click="deleteBatch">批量删除</el-button>

    <el-tree
      :data="menus"
      show-checkbox
      node-key="catId"
      :props="defaultProps"
      :default-expanded-keys="expendedKey"
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
      draggable
      :allow-drop="allowDrop"
      ref="manuTree"
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
          <el-button type="text" size="mini" @click="() => edit(node, data)">
            Edit
          </el-button>
          <el-button type="text" size="mini" @click="() => edit(node, data)">
            Delete
          </el-button>
        </span>
      </span>
    </el-tree>

    <el-dialog
      title="收货地址"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
    >
      <el-form :model="category">
        <el-form-item label="菜单名称">
          <el-input v-model="category.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标">
          <el-input v-model="category.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="计量单位">
          <el-input
            v-model="category.productUnit"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
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
      dragable: false, // 是否可拖拽
      childCount: 0, // 当前节点的子节点的个数
      category: {
        catId: null,
        name: "",
        parentCid: 0,
        catLevel: 1,
        showStatus: 1,
        sort: 0,
        icon: "",
        productUnit: "",
      },
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

    // 批量删除
    deleteBatch() {
      let nodesList = [];
      let checkedNodes = this.$refs.manuTree.getCheckedNodes();
      console.log("当前被选中的nodes", checkedNodes);
      // 遍历所有选中的节点的id放入一个list传给后端
      for (let i = 0; i < checkedNodes.length; i++) {
        nodesList.push(checkedNodes[i].catId);
      }

      this.$confirm(
        `是否删除【${nodesList}】此操作将永久删除课程信息, 是否继续?`,
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
          .deleteByIdList(nodesList)
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
    },

    // 添加和修改对话框的表单提交按钮
    // 根据该category对象是否存在catId判断是添加还是修改
    submit() {
      if (this.category.catId == null) {
        // 第一次添加
        this.addCategory();
      } else {
        // 数据库中已经有了，本次为修改操作
        this.updateCategory();
      }
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

    edit(node, data) {
      // 及时像后端查询最新数据，防止有人并发修改
      // data代表后端数据库对象
      // node代表前端页面元素对象
      category.getById(data.catId).then((response) => {
        // 显示信息
        this.$message({
          type: "success",
          message: "查询菜单最新信息成功!",
        });
        this.category.catId = response.category.catId;
        this.category.name = response.category.name;
        this.category.icon = response.category.icon;
        this.category.productUnit = response.category.productUnit;
        this.category.parentCid = response.category.parentCid;
      });

      console.log("edit", node, data);
      this.dialogFormVisible = true;
    },

    updateCategory() {
      // 向后端发送更新请求，因为公用一个对话框，所以发送按钮需要进行判断
      // 封装需要更新的数据为一个对象，避免将数据库中不要更新的字段覆盖
      var { catId, name, icon, productUnit } = this.category;
      category
        .updateCategory({ catId, name, icon, productUnit })
        .then((response) => {
          // 显示信息
          this.$message({
            type: "success",
            message: "更新菜单成功!",
          });
          // 关闭对话框
          this.dialogFormVisible = false;
          // 刷新列表
          this.getDataList();
          // 默认展开的节点，需要在向后端查询时回显，否则取得时定义category时默认值0
          this.expendedKey = [this.category.parentCid];
        });
    },

    append(data) {
      this.category.parentCid = data.catId;
      this.category.catLevel = data.catLevel * 1 + 1;

      // 清空上次修改操作绑定的数据，添加新数据
      this.category.name = "";
      this.category.icon = "";
      this.category.productUnit = "";

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

    // 判断是否可以被拖拽放置到此处
    // draggingNode: 被拖拽的节点的信息 dropNode：放置节点的信息  type：放置的类型：inner节点内部， next节点后面  prev节点前面
    allowDrop(draggingNode, dropNode, type) {
      if (this.dragable == false) {
        return false;
      }
      console.log("draggingNode", draggingNode, dropNode, type);
      // 返回true表示可以放置在此处 否者不能放置
      /**
       * 可以放置的要求：首先节点总深度不能大于3
       * inner 时a移动到b的内部： (被拖拽的节点的 children个数 + 1) + 放置到的节点的 catLevel <= 3 就可以放置到此处
       * prev和next类型时a移动到与b平级： 被拖拽的节点的（1 + children个数） + 放置到的节点的  父节点  的 catLevel <= 3
       *  */
      this.countChildNode(draggingNode.data); // 当前节点的最大子节点个数，有些子节点没有孙子节点，有些有子节点的子节点，所以要遍历每一个当前节点的子节点求最大的子节点深度

      let maxLevel = 1 + this.childCount - draggingNode.data.catLevel;
      if (maxLevel < 1) {
        maxLevel = 1;
      }

      console.log("该节点作为头节点的最大深度", maxLevel);
      if (type == "inner") {
        return maxLevel + dropNode.level <= 3;
      } else {
        return maxLevel + dropNode.parent.level <= 3;
      }
    },

    countChildNode(node) {
      if (node.children != null && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          if (node.children[i].catLevel > this.childCount) {
            this.childCount = node.children[i].catLevel;
          }
          this.countChildNode(node.children[i]);
        }
      }
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