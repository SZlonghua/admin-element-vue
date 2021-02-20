<template>
  <div class="indexlayout-main-conent" v-if="infoVisible===false">
    <el-card shadow="never" class="cus-card" style="margin-bottom: 15px" :body-style="{ 'padding-bottom': '0' }">
      <el-form :model="searchModelRef" ref="searchFormRef" label-width="80px">
        <el-row :gutter="16" type="flex" justify="end" class="flex-wrap-wrap">
          <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
            <el-form-item label="名称：">
              <el-input placeholder="请输入" v-model="searchModelRef.taskName"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
            <el-form-item label="任务组：">
              <el-input placeholder="请输入" v-model="searchModelRef.taskGroup"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
            <el-form-item label="cron：">
              <el-input placeholder="请输入" v-model="searchModelRef.cron"/>
            </el-form-item>
          </el-col>
          <!--          <el-col v-if='searchOpen' :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
                      <el-form-item label="备注：">
                        <el-input placeholder="请输入" />
                      </el-form-item>
                    </el-col>-->
          <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
            <div class="text-align-right" style="padding-bottom: 24px">
              <el-button type="primary" @click="searchFormSubmit">查询</el-button>
              <el-button @click="searchResetFields">重置</el-button>
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
            <el-button type="danger" icon="el-icon-delete" @click="() => deleteTableData()"  :loading="deleteLoading">删除</el-button>
          </el-col>
<!--          <el-col :span="16" class="text-align-right">
            <el-radio-group v-model="tabVal">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="header">头部</el-radio-button>
              <el-radio-button label="footer">底部</el-radio-button>
            </el-radio-group>
          </el-col>-->
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
          <template #default="{row}">
<!--            <el-button type="text" @click="() => detailUpdateData(row.id)"
                       :loading="detailUpdateLoading.includes(row.id)">编辑
            </el-button>
            <el-button type="text" @click="() => deleteTableData(row.id)" :loading="deleteLoading.includes(row.id)">删除
            </el-button>-->
            <el-button type="text" @click="infoTableData(row.jobId)">查看</el-button>
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

  <div class="indexlayout-main-conent" v-else>
    <info-form :values="infoData" :on-return="refresh"></info-form>
  </div>
</template>

<script lang="ts">


import {PaginationConfig, SearchListItem, TableListItem} from "@/views/sys/schedule/list/data";
import {computed, defineComponent, onMounted, reactive, ref} from "vue";
import {useStore} from "vuex";
import {StateType as ListStateType} from "@/views/sys/schedule/list/store";
import {ElForm, ElMessage, ElMessageBox, ElTable} from "element-plus";
import CreateForm from "@/views/sys/schedule/list/components/CreateForm.vue";
import UpdateForm from "@/views/sys/schedule/list/components/UpdateForm.vue";
import InfoForm from "@/views/sys/schedule/list/components/InfoForm.vue";

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
  infoVisible: boolean;
  infoTableData: (jobId: number) => void;
  infoData: Partial<TableListItem>;
  refresh: () => Promise<void>;
  deleteLoading: boolean;
  deleteTableData:  () => void;
  searchModelRef: Omit<SearchListItem, 'jobId'>;
  searchFormRef: typeof ElForm;
  searchResetFields: () => void;
  searchFormSubmit: () => Promise<void>;
}

export default defineComponent({
  name: "scheduleList",
  components: {InfoForm, UpdateForm, CreateForm},
  methods: {
    handleSelectionChange(selection: []) {
      this.selectioned = selection.map(item=>{
        const r = item as TableListItem;
        return r.jobId;
      });
      //console.log("selection:"+this.selectioned);
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

    const infoVisible = ref<boolean>(false);

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
      tableRef.value?.clearSelection();
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

    const infoTableData = async (jobId: number)=>{
      //alert("sssssssssss");
      const res: boolean = await store.dispatch('ListScheduleTable/queryInfoData',jobId)
      if(res===true) {
        infoVisible.value = true;
      }

    };
    // 详情 data
    const infoData = computed<Partial<TableListItem>>(() => store.state.ListScheduleTable.infoData);

    const refresh = async () => {
      //取消详情页
      infoVisible.value = false;
      store.commit('ListScheduleTable/setInfoData',{});
      //取消更新页
      updataFormCancel();
      setCreateFormVisible(false);
      getList(pagination.value.current);
    };
    // 删除 loading
    const deleteLoading = ref<boolean>(false);
    // 删除
    const deleteTableData = () => {
      const rows = selectioned.value;
      if(rows.length==0){
        ElMessage.warning('请选中其中一个！');
        return;
      }
      if(rows.length>1){
        ElMessage.warning('只能选中一个！');
        return;
      }
      ElMessageBox.confirm('确定删除吗？', '删除',{
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {

        deleteLoading.value = true;
        const res: boolean = await store.dispatch('ListScheduleTable/deleteTableData',rows[0]);
        if (res === true) {
          ElMessage.success('删除成功！');
          getList(pagination.value.current);
        }
        deleteLoading.value = false;
      },async () => {
        tableRef.value?.clearSelection();
      }).catch((error: any) =>{
        console.log(error)
      });

    };

    // 表单值
    const searchModelRef = reactive<Omit<SearchListItem, 'jobId'>>({
      taskName: '',
      taskGroup: '',
      cron: '',
    });
    // search form
    const searchFormRef = ref<typeof ElForm>();
    // 重置
    const searchResetFields = () => {
      searchFormRef.value?.resetFields();
      searchModelRef.taskName = '';
      searchModelRef.taskGroup = '';
      searchModelRef.cron = '';
    }
    // 搜索
    const searchFormSubmit = async () => {
      try {
        console.log('search', searchModelRef);
        ElMessage.warning('进行了搜索!');
      } catch (error) {
        ElMessage.warning(error);
      }
    }

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
      infoVisible: infoVisible as unknown as boolean,
      infoTableData,
      infoData: infoData as Partial<TableListItem>,
      refresh,
      deleteLoading: deleteLoading as unknown as boolean,
      deleteTableData,
      searchModelRef,
      searchFormRef: searchFormRef as unknown as typeof ElForm,
      searchResetFields,
      searchFormSubmit,
    }

  }
})
</script>

<style lang="scss" scoped>

</style>