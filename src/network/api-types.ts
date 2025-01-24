export interface APIResponseData<T = null> {
  success: false;
  data: T;
  message: string;
}

type PaginatedData<Key extends string, T> = {
  [items in Key]: T[];
} & {
  pagination: {
    currentPage: number;
    limit: number;
    totalCount: number;
  };
};

interface User {
  id: string;
  fullName: string;
  email: string;
  isEmailVerified: boolean;
}

interface Category {
  name: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface CategoryWithStat {
  id: string;
  name: string;
  totalTransactions: number;
}

interface Transaction {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  amount: number;
  categoryId: string;
  description: string | null;
}

interface TransactionWithCategory extends Transaction {
  category: Category;
}

interface OverviewData {
  totalInflowAmount: number;
  totalOutflowAmount: number;
  netTotal: number;
  latestInflows: TransactionWithCategory[];
  latestOutflows: TransactionWithCategory[];
  period: string;
}

export interface APIResponses {
  user: APIResponseData<User>;

  login: APIResponseData<
    User & {
      accessToken: string;
    }
  >;

  register: APIResponseData<
    User & {
      accessToken: string;
    }
  >;

  refresh: APIResponseData<{
    userId: string;
    accessToken: string;
  }>;

  overview: APIResponseData<OverviewData>;

  inflowCategories: APIResponseData<
    PaginatedData<"inflowCategories", Category>
  >;

  outflowCategories: APIResponseData<
    PaginatedData<"outflowCategories", Category>
  >;

  summary: APIResponseData<{
    summary: string;
  }>;

  transactions: APIResponseData<
    PaginatedData<"transactions", TransactionWithCategory>
  >;

  categoryWithStat: APIResponseData<
    PaginatedData<"categories", CategoryWithStat>
  >;
}
