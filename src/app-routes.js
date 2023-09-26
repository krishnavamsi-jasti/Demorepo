import { TasksPage, ProfilePage, CreateNewOrder, PendingApproval, PrevPurchases, Dashboard } from './pages';
import { withNavigationWatcher } from './contexts/navigation';
import { LoginForm } from './components';
import { SingleCard } from './layouts';

const routes = [
    // {
    //     path: '/login',
    //     element: LoginForm
    //         // <SingleCard title="Sign In">
    //         //   <LoginForm />
    //         // </SingleCard>
          
    // },
    {
        path: '/dashboard',
        element: Dashboard
    },
    {
        path: '/tasks',
        element: TasksPage
    },
    {
        path: '/profile',
        element: ProfilePage
    },
    {
        path: '/create-new-order',
        element: CreateNewOrder
    },
    {
        path: '/pending-approval',
        element: PendingApproval
    },
    {
        path: '/previous-purchases',
        element: PrevPurchases
    }
];

export default routes.map(route => {
    return {
        ...route,
        element: withNavigationWatcher(route.element, route.path)
    };
});
