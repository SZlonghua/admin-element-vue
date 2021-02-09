import request from '@/utils/request';
import { TableListQueryParams, TableListItem } from './data.d';

export async function queryList(params?: TableListQueryParams): Promise<any> {
  return request({
    url: '/schedule/list',
    method: 'get',
    params,
  });
}

export async function createData(params: Omit<TableListItem, 'jobId'>): Promise<any> {
  return request({
    url: '/schedule/list',
    method: 'POST',
    data: params,
  });
}

export async function updateData(jobId: number, params: Omit<TableListItem, 'jobId'>): Promise<any> {
  return request({
    url: `/pages/list/${jobId}`,
    method: 'PUT',
    data: params,
  });
}

export async function removeData(jobId: number): Promise<any> {
  return request({
    url: `/pages/list/${jobId}`,
    method: 'delete',
  });
}

export async function detailData(id: number): Promise<any> {
  return request({url: `/pages/list/${id}`});
}
