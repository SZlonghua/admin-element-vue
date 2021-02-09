export interface TableListQueryParams {
  page: number;
  per: number;
}

export interface PaginationConfig {
  total: number;
  current: number;
  pageSize: number;
  showSizeChanger: boolean;
  showQuickJumper: boolean;
}

export interface TableListItem {
  jobId: number;
  taskName: string;
  taskGroup: string;
  description: string;
  state: string;
  cron: string;
}

export interface TableDataType {
  list: TableListItem[];
  pagination: PaginationConfig;
}
