<template>
  <div class="indexlayout-main-conent">
    <el-card shadow="never" class="cus-card" style="margin-bottom: 15px" :body-style="{ 'padding-bottom': '0' }">
      <el-form label-width="80px">
        <el-row :gutter="16" type="flex" justify="end" class="flex-wrap-wrap">
          <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
            <el-form-item label="名称：">
              <el-input placeholder="请输入"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
            <el-form-item label="链接：">
              <el-input placeholder="请输入"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
            <el-form-item label="位置：">
              <el-input placeholder="请输入"/>
            </el-form-item>
          </el-col>
          <!--          <el-col v-if='searchOpen' :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
                      <el-form-item label="备注：">
                        <el-input placeholder="请输入" />
                      </el-form-item>
                    </el-col>-->
          <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
            <div class="text-align-right" style="padding-bottom: 24px">
              <el-button type="primary">查询</el-button>
              <el-button>重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card shadow="never" class="cus-card">
      <template #header>
        <el-row>
          <el-col :span="8">
            <el-button type="primary" icon="el-icon-plus" @click="()=>setCreateFormVisible(true)">新增</el-button>
            <el-button type="success" icon="el-icon-edit" @click="() => detailUpdateData()">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" >删除</el-button>
          </el-col>
          <el-col :span="16" class="text-align-right">
            <el-radio-group v-model="tabVal">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="header">头部</el-radio-button>
              <el-radio-button label="footer">底部</el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>
      </template>

      <el-table row-key="jobId" :data="list" v-loading="loading" ref="tableRef" @selection-change="handleSelectionChange">


        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            label="序号"
            prop="jobId">
        </el-table-column>
<!--        <el-table-column
            type="index"
            label="序号"
            :index="(index) => {
                        return (pagination.current - 1) * pagination.pageSize + index + 1;
                    }"
            width="80">
        </el-table-column>-->

        <el-table-column
            label="任务名称"
            prop="taskName">
        </el-table-column>

        <el-table-column
            label="任务组"
            prop="taskGroup">
        </el-table-column>

        <el-table-column
            label="描述"
            prop="description">
        </el-table-column>

        <el-table-column
            label="状态"
            prop="state">
           <template #default="{row}">
                <el-tag v-if="row.state === '1'" type="success" >开启</el-tag>
                <el-tag v-else type="warning">关闭</el-tag>

            </template>

        </el-table-column>

        <el-table-column
            label="cron表达式"
            prop="cron">
        </el-table-column>



        <el-table-column
            label="操作"
            prop="action"
            width="150">
          <template #default="">
<!--            <el-button type="text" @click="() => detailUpdateData(row.id)"
                       :loading="detailUpdateLoading.includes(row.id)">编辑
            </el-button>
            <el-button type="text" @click="() => deleteTableData(row.id)" :loading="deleteLoading.includes(row.id)">删除
            </el-button>-->
            <el-button type="text">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="padding-t10 text-align-right">
        <el-pagination
            background
            layout="prev, pager, next"
            v-model:current-page="pagination.current"
            :page-size="pagination.pageSize"
            :total="pagination.total"
            @current-change="(p) => {
                        getList(p || 1);
                    }">
        </el-pagination>
      </div>

      <create-form
          :visible="createFormVisible"
          :onCancel="() => setCreateFormVisible(false)"
          :onSubmitLoading="createSubmitLoading"
          :onSubmit="createSubmit"
          :set-submit-loading="(v)=>setLoading(v)"
      />

      <update-form
          v-if="updateFormVisible===true"
          :visible="updateFormVisible"
          :values="updateData"
          :onCancel="() => updataFormCancel()"
          :onSubmitLoading="updateSubmitLoading"
          :onSubmit="updateSubmit"
      />



    </el-card>
  </div>
</template>

<script lang="ts">


import {PaginationConfig, TableListItem} from "@/views/sys/schedule/list/data";
import {computed, defineComponent, onMounted, ref} from "vue";
import {useStore} from "vuex";
import {StateType as ListStateType} from "@/views/sys/schedule/list/store";
import {ElForm, ElMessage, ElTable} from "element-plus";
import CreateForm from "@/views/sys/schedule/list/components/CreateForm.vue";
import UpdateForm from "@/views/sys/schedule/list/components/UpdateForm.vue";

interface ListScheduleTablePageSetupData {
  list: TableListItem[];
  pagination: PaginationConfig;
  loading: boolean;
  getList:  (current: number) => Promise<void>;
  createFormVisible: boolean;
  setCreateFormVisible:  (val: boolean) => void;
  createSubmitLoading: boolean;
  createSubmit: (values: Omit<TableListItem, 'jobId'>, resetFields: () => void) => Promise<void>;
  detailUpdateLoading: number[];
  detailUpdateData: () => Promise<void>;
  updateData: Partial<TableListItem>;
  updateFormVisible: boolean;
  updataFormCancel:  () => void;
  updateSubmitLoading: boolean;
  updateSubmit:  (values: TableListItem, resetFields: () => void) => Promise<void>;
  selectioned: number[];
  tableRef: typeof ElTable;
}

export default defineComponent({
  name: "scheduleList",
  components: {UpdateForm, CreateForm},
  methods: {
    handleSelectionChange(selection: []) {
      this.selectioned = selection.map(item=>{
        const r = item as TableListItem;
        return r.jobId;
      });
      console.log("selection:"+this.selectioned);
    },
    /*clearSelect(){
      (this.$refs.tableRef as any ).clearSelection();
    }*/
  },
  setup(prop,ctx): ListScheduleTablePageSetupData{
    const store = useStore<{ ListScheduleTable: ListStateType}>();


    // 列表数据
    const list = computed<TableListItem[]>(() => store.state.ListScheduleTable.tableData.list);

    // 列表分页
    const pagination = computed<PaginationConfig>(() => store.state.ListScheduleTable.tableData.pagination);

    // form
    const tableRef = ref<typeof ElTable>();

    // 获取数据
    const loading = ref<boolean>(false);
    /*const getList = async (current: number): Promise<void> => {
      //loading.value = true;
      await store.dispatch('ListScheduleTable/queryTableData', {
        per: pagination.value.pageSize,
        page: current,
      });
      //loading.value = false;
    }*/
    const getList = async (current: number): Promise<void> => {
      loading.value = true;
      await store.dispatch('ListScheduleTable/queryTableData', {
        per: pagination.value.pageSize,
        page: current,
      });
      loading.value = false;
    };

    // 新增弹框 - visible
    const createFormVisible = ref<boolean>(false);
    const setCreateFormVisible = (val: boolean) => {
      createFormVisible.value = val;
      //alert("fghgfhgfh");
    };

    // 新增弹框 - 提交 loading
    const createSubmitLoading = ref<boolean>(false);
    // 新增弹框 - 提交
    const createSubmit = async (values: Omit<TableListItem, 'jobId'>, resetFields: () => void) => {
      createSubmitLoading.value = true;
      const res: boolean = await store.dispatch('ListScheduleTable/createTableData',values);
      if(res === true) {
        resetFields();
        setCreateFormVisible(false);
        ElMessage.success('新增成功！');
        getList(1);
      }
      createSubmitLoading.value = false;
    };

    const selectioned = ref<number[]>([]);

    // 编辑弹框 - visible
    const updateFormVisible = ref<boolean>(false);
    const setUpdateFormVisible = (val: boolean) => {
      updateFormVisible.value = val;
    }
    const updataFormCancel = () => {
      setUpdateFormVisible(false);
      store.commit('ListScheduleTable/setUpdateData',{});
      //(tableRef.value?.methods as any).clearSelect();
    }
    // 编辑弹框 - 提交 loading
    const updateSubmitLoading = ref<boolean>(false);
    // 编辑弹框 - 提交
    const updateSubmit = async (values: TableListItem, resetFields: () => void) => {
      updateSubmitLoading.value = true;
      const res: boolean = await store.dispatch('ListScheduleTable/updateTableData',values);
      if(res === true) {
        updataFormCancel();
        ElMessage.success('编辑成功！');
        getList(pagination.value.current);
      }
      updateSubmitLoading.value = false;
    }

    const detailUpdateLoading = ref<number[]>([]);
    const detailUpdateData = async () => {
      /*detailUpdateLoading.value = [jobId];
      const res: boolean = await store.dispatch('ListSearchTable/queryUpdateData',jobId);
      if(res===true) {
        setUpdateFormVisible(true);
      }
      detailUpdateLoading.value = [];*/
      //console.log(prop.selectioned);
      const rows = selectioned.value;
      if(rows.length==0){
        ElMessage.warning('请选中其中一个！');
        return;
      }
      if(rows.length>1){
        ElMessage.warning('只能选中一个！');
        return;
      }
      const res: boolean = await store.dispatch('ListScheduleTable/queryUpdateData',rows[0]);
      if(res===true) {
        setUpdateFormVisible(true);
      }
    }

    // 编辑弹框 data
    const updateData = computed<Partial<TableListItem>>(() => store.state.ListScheduleTable.updateData);

    onMounted(()=> {
      getList(1);
    });



    return {
      list: list as unknown as TableListItem[],
      pagination: pagination as unknown as PaginationConfig,
      loading: loading as unknown as boolean,
      getList,
      createFormVisible: createFormVisible as unknown as boolean,
      setCreateFormVisible,
      createSubmitLoading: createSubmitLoading as unknown as boolean,
      createSubmit,
      detailUpdateLoading: detailUpdateLoading as unknown as number[],
      detailUpdateData,
      updateData: updateData as Partial<TableListItem>,
      updateFormVisible: updateFormVisible as unknown as boolean,
      updataFormCancel,
      updateSubmitLoading: updateSubmitLoading as unknown as boolean,
      updateSubmit,
      selectioned: selectioned as unknown as number[],
      tableRef: tableRef as unknown as typeof ElTable,
    }

  }
})
</script>

<style scoped>

</style>