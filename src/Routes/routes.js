import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import ErrorPage from '../Pages/Shared/ErrorPage'
import Home from '../Pages/Home'
import Login from '../Pages/Login/Login'
import Signup from '../Pages/Login/Signup'
import Main from '../Layout/Main'
import ComingSoon from '../Pages/Shared/ComingSoon'
import Details from '../Pages/Details'
import PrivateRoute from './PrivateRoute'
import DashboardLayout from '../Layout/DashboardLayout'
import MyBookings from '../Pages/Dashboard/MyBookings'
import Welcome from '../Pages/Dashboard/Welcome'
import ManageHomes from '../Pages/Dashboard/ManageHomes'
import AllHome from '../Pages/AllHome'
import AdminRoute from './AdminRoute'
import HostRoute from './HostRoute'
import HomeAll from '../Pages/HomeAll'
import CreateWorkspace from '../Pages/Dashboard/CreateWorkspace'
import WorkspaceDetails from '../Pages/Dashboard/WorkspaceDetails'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <HomeAll></HomeAll>,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
      {
        path: '/all-homes',
        element: <AllHome />,
      },
      {
        path: '/coming-soon',
        element: <ComingSoon />,
      },
     
    
      
    ],
  },
  {
    path: '/dashboard',
    errorElement: <ErrorPage />,
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: '',
        element: (
          <PrivateRoute>
            <Welcome />
          </PrivateRoute>
        ),
      },
      {
        path: 'my-bookings',
        element: (
          <PrivateRoute>
            <MyBookings />
          </PrivateRoute>
        ),
      },
    
      {
        path: 'create-workspace',
        element: (
          <PrivateRoute>
            <CreateWorkspace />
          </PrivateRoute>
        ),
      },
      {
        path: 'workspace-details/:id',
        element: <WorkspaceDetails />,
        loader: ({ params }) =>
          fetch(`https://server-tawny-tau.vercel.app/home/${params.id}`),
      },
       {
        path: 'manage-homes',
        element: (
          <HostRoute>
            <ManageHomes />
          </HostRoute>
        ),
      },
    ],
  },
])

export default router
