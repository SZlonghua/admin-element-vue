import { Mutation, Action } from 'vuex';
import { StoreModuleType } from "@/utils/store";
import { ResponseData } from '@/utils/request';
import { TableDataType, TableListItem, TableListQueryParams } from './data.d';
import {
  queryList,
  removeData,
  createData,
  detailData,
  updateData,
} from './service';


export interface StateType {
    tableData: TableDataType;
    updateData: Partial<TableListItem>;
    infoData: Partial<TableListItem>;
}

export interface ModuleType extends StoreModuleType<StateType> {
    state: StateType;
    mutations: {
        setTableData: Mutation<StateType>;
        setUpdateData: Mutation<StateType>;
        setInfoData: Mutation<StateType>;
    };
    actions: {
        queryTableData: Action<StateType, StateType>;
        deleteTableData: Action<StateType, StateType>;
        createTableData: Action<StateType, StateType>;
        queryUpdateData: Action<StateType, StateType>;
        updateTableData: Action<StateType, StateType>;
        queryInfoData: Action<StateType, StateType>;
    };
}
const initState: StateType = {
    tableData: {
      list: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
      },
    },
    updateData: {},
    infoData: {},
};

const StoreModel: ModuleType = {
    namespaced: true,
    name: 'ListScheduleTable',
    state: {
        ...initState
    },
    mutations: {
        setTableData(state, payload) {
            state.tableData = payload;
        },
        setUpdateData(state, payload) {
            state.updateData = payload;
        },
        setInfoData(state, payload) {
            state.infoData = payload;
        },
    },
    actions: {
        async queryTableData({ commit }, payload: TableListQueryParams ) {
            try {
                const response: ResponseData = await queryList(payload);
                const { data } = response;
                commit('setTableData',{
                    ...initState.tableData,
                    list: data.list || [],
                    pagination: {
                      ...initState.tableData.pagination,
                      current: payload.page,
                      total: data.total || 0,
                    },
                });
                return true;
            } catch (error) {
                return false;
            }
        },
        async deleteTableData({ commit }, payload: number ) {
            try {
                //await removeData(payload);
                return true;
            } catch (error) {
                return false;
            }
        },
        async createTableData({ commit }, payload: Pick<TableListItem, "taskName" | "taskGroup" | "description" | "state" | "cron"> ) {
            try {
                /*await createData(payload);
                return true;*/
                /*const data = Object.assign({jobId:1232435566},payload);

                alert(JSON.stringify(initState.tableData.list.push(data)))*/
                /*commit('setTableData',{
                    ...initState.tableData,
                    list: initState.tableData.list.push(data) || [],
                });*/
                return true;
            } catch (error) {
                return false;
            }
        },
        async queryUpdateData({ commit }, payload: number ) {
            try {
                const response: ResponseData = await detailData(payload);
                const { data } = response;
                commit('setUpdateData',{
                    ...initState.updateData,
                    ...data,
                });
                return true;
            } catch (error) {
                return false;
            }
        },
        async updateTableData({ commit }, payload: TableListItem ) {
            try {
                const { jobId, ...params } = payload;
                await updateData(jobId, { ...params });
                return true;
            } catch (error) {
                return false;
            }
        },
        async queryInfoData({ commit }, payload: number ) {
            try {
                const response: ResponseData = await detailData(payload);
                const { data } = response;
                commit('setInfoData',{
                    ...initState.infoData,
                    ...data,
                });
                return true;
            } catch (error) {
                return false;
            }
        },
    }
};

export default StoreModel;
