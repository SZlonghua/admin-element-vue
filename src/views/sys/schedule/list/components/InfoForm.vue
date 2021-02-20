<template>
  <el-card shadow="never" class="cus-card" v-loading="loading">
    <el-row :gutter="24">
      <el-col :offset="23">
        <el-button type="primary" @click="returnOperate">返回</el-button>
      </el-col>
    </el-row>

    <div class="main-conent-detail">
      <div class="main-conent-detail-title">调度详情</div>
      <el-row :gutter="24">
        <el-col :sm="24" :md="12" :lg="8">
          <span class="main-conent-detail-lable">序号：</span>
          <span class="main-conent-detail-content">{{ modelRef.jobId }}</span>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <span class="main-conent-detail-lable">任务名称：</span>
          <span class="main-conent-detail-content">{{ modelRef.taskName }}</span>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <span class="main-conent-detail-lable">任务组：</span>
          <span class="main-conent-detail-content">{{ modelRef.taskGroup }}</span>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <span class="main-conent-detail-lable">描述：</span>
          <span class="main-conent-detail-content">{{ modelRef.description }}</span>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <span class="main-conent-detail-lable">状态：</span>
          <span class="main-conent-detail-content">{{ modelRef.state }}</span>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8">
          <span class="main-conent-detail-lable">cron表达式：</span>
          <span class="main-conent-detail-content">{{ modelRef.cron }}</span>
        </el-col>

      </el-row>
    </div>
    <el-divider></el-divider>



  </el-card>
</template>
<script lang="ts">
import {defineComponent, PropType, reactive, ref} from "vue";
import {TableListItem} from "@/views/sys/schedule/list/data.d";
import {useI18n} from "vue-i18n";
import {ElForm, ElMessage} from "element-plus";

interface InfoFormSetupData {
  modelRef: TableListItem;
  returnOperate: () => void;
}


export default defineComponent({
  name: 'InfoForm',
  props: {
    values: {
      type: Object as PropType<Partial<TableListItem>>,
      required: true
    },
    onReturn: {
      type: Function,
      required: true
    },
  },
  setup(props): InfoFormSetupData {
    //const { t } = useI18n();
    // 表单值
    const modelRef = reactive<TableListItem>({
      jobId: props.values.jobId || 0,
      taskName: props.values.taskName || '',
      taskGroup: props.values.taskGroup || '',
      description: props.values.description || '',
      state: props.values.state || '',
      cron: props.values.cron || '',
    });

    const returnOperate = () => {
      props.onReturn();
    }
    return {
      modelRef,
      returnOperate,
    }
  }
})
</script>

<style lang="scss" scoped>
.main-conent-detail {
  box-sizing: border-box;
  .main-conent-detail-title {
    margin-bottom: 16px;
    color: #303133;
    font-size: 16px;
    font-weight: 700;
  }
  .main-conent-detail-lable,
  .main-conent-detail-content {
    display: table-cell;
    padding-bottom: 16px;
    line-height: 20px;
    font-size: 14px;

  }
  .main-conent-detail-lable {
    white-space: nowrap;
  }
  .main-conent-detail-content {
    width: 100%;
    word-wrap:break-word;
    word-break: break-all;
  }
}
.status {
  padding-left: 20px;
  ::v-deep(.el-badge__content.is-fixed.is-dot) {
    top: 12px;
    left: -8px;
  }
}
</style>