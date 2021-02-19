<template>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="编辑"
      width="500px"
      :model-value="visible"
      @close="onCancel"
    >
        <template #footer>
            <el-button key="back" @click="() => onCancel()">取消</el-button>
            <el-button key="submit" type="primary" :loading="onSubmitLoading" @click="onFinish">提交</el-button>
        </template>

        <el-form :model="modelRef" :rules="rulesRef" ref="formRef" label-width="80px">

<!--            <el-form-item label="名称" prop="name" >
                <el-input v-model="modelRef.name" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="网址" prop="href" >
                <el-input v-model="modelRef.href" placeholder="请输入网址" />
            </el-form-item>

            <el-form-item label="备注" prop="desc" >
                <el-input v-model="modelRef.desc" placeholder="请输入备注" />
            </el-form-item>-->
            <el-form-item label="任务名称" prop="taskName" >
              <el-input v-model="modelRef.taskName" placeholder="请输入名称" />
            </el-form-item>
            <el-form-item label="任务组" prop="taskGroup" >
              <el-input v-model="modelRef.taskGroup" placeholder="请输入任务组" />
            </el-form-item>
            <el-form-item label="描述" prop="description" >
              <el-input v-model="modelRef.desc" placeholder="描述" />
            </el-form-item>
            <el-form-item label="状态" prop="state" >
              <el-input v-model="modelRef.state" placeholder="请输入状态" />
            </el-form-item>
            <el-form-item label="cron表达式" prop="cron" >
              <el-input v-model="modelRef.cron" placeholder="请输入cron" />
            </el-form-item>
        </el-form>


    </el-dialog>
</template>
<script lang="ts">
import { defineComponent, PropType, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";
import { ElForm, ElMessage } from "element-plus";
import TypeSelect from './TypeSelect.vue';
import { TableListItem } from "../data.d";


interface UpdateFormSetupData {
    modelRef: TableListItem;
    rulesRef: any;
    formRef: typeof ElForm;
    resetFields: () => void;
    onFinish: () => Promise<void>;
}

export default defineComponent({
    name: 'UpdateForm',
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        values: {
            type: Object as PropType<Partial<TableListItem>>,
            required: true
        },
        onCancel: {
            type: Function,
            required: true
        },
        onSubmitLoading: {
            type: Boolean,
            required: true
        },
        onSubmit: {
            type: Function as PropType<(values: TableListItem, resetFields: () => void) => void>,
            required: true
        }
    },
    /*components: {
        TypeSelect
    },*/
    setup(props): UpdateFormSetupData {

        const { t } = useI18n();

        // 表单值
        const modelRef = reactive<TableListItem>({
          jobId: props.values.jobId || 0,
          taskName: props.values.taskName || '',
          taskGroup: props.values.taskGroup || '',
          description: props.values.description || '',
          state: props.values.state || '',
          cron: props.values.cron || '',
        });

        // 表单验证
        const rulesRef = reactive({
          taskName: [
            {
              required: true,
              validator: async (rule: any, value: string) => {
                if (value === '' || !value) {
                  throw new Error('请输入任务名称');
                } else if (value.length > 15) {
                  throw new Error('长度不能大于15个字');
                }
              }
            },
          ],
          taskGroup: [],
          description: [],
          state: [
            {
              required: true,
              message: '状态不能为空'
            }
          ],
          cron: [
            {
              required: true,
              message: 'cron不能为空'
            }
          ]
        });
        // form
        const formRef = ref<typeof ElForm>();
        // 重置
        const resetFields = () => {
            formRef.value?.resetFields();
        }
        // 提交
        const onFinish = async () => {           
            try {
                const valid: boolean | undefined =  await formRef.value?.validate();
                if(valid === true) {
                    props.onSubmit(modelRef, resetFields);
                }
            } catch (error) {
                // console.log('error', error);
                ElMessage.warning(t('app.global.form.validatefields.catch'));
            }
        };
        
        return {
            modelRef,
            rulesRef,
            formRef: formRef as unknown as typeof ElForm,
            resetFields,
            onFinish,
        }

    }
})
</script>