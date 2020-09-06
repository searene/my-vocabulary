export type BaseQuery = {
  id?: number;

  /**
   * Start from
   */
  skip?: number;

  /**
   * Limit
   */
  take?: number;

  pageNo?: number;

  pageSize?: number;
};
