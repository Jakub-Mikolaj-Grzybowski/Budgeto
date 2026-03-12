import { DashboardPage } from "./pages/DashboardPage";
import { TransactionsPage } from "./pages/TransactionsPage";
import { BudgetsPage } from "./pages/BudgetsPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { NetWorthPage } from "./pages/NetWorthPage";

const AppRoutes = [
  {
    index: true,
    element: <DashboardPage />
  },
  {
    path: '/transactions',
    element: <TransactionsPage />
  },
  {
    path: '/budgets',
    element: <BudgetsPage />
  },
  {
    path: '/net-worth',
    element: <NetWorthPage />
  },
  {
    path: '/categories',
    element: <CategoriesPage />
  }
];

export default AppRoutes;
