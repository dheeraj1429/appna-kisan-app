import { Navigate, Route, Routes } from "react-router-dom";

import { UseContextState } from "./global/GlobalContext/GlobalContext";
import LogoOnlyLayout from "./layouts/LogoOnlyLayout";
import DashboardLayout from "./layouts/dashboard";

import B2bApproval from "./pages/B2bApproval";
import B2bApprovalList from "./pages/B2bApprovalList";
import Banners from "./pages/Banners";
import Category from "./pages/Category";
import Enquiry from "./pages/Enquiry";
import CreateGiftCategories from "./pages/Gifts/CreateGiftCategories/CreateGiftCategories";
import GiftsCategory from "./pages/Gifts/GiftsCategory/GiftsCategory";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import User from "./pages/User";
import ProtectedRoute from "./utils/ProtectedRoute";
import GiftProducts from "./pages/Gifts/GiftProducts/GiftProducts";
import CreateGiftProduct from "./pages/Gifts/CreateGiftProduct/CreateGiftProduct";

// ----------------------------------------------------------------------

export default function Router() {
  const { authState } = UseContextState();

  console.log("AUTHSTATE", authState);
  const userState = authState.isAuthenticated;

  // return useRoutes([
  //   {
  //     path: '/dashboard',

  //     element: <DashboardLayout />,
  //     children:[
  //       { path: 'app', element: <ProtectedRoute Component={DashboardApp} />    },
  //       { path: 'customer', element:<ProtectedRoute Component={User} /> },
  //       { path: 'products', element:<ProtectedRoute Component={Products} /> },
  //       { path: 'blog', element:<ProtectedRoute Component={Blog} /> },
  //       { path: 'orders', element:<ProtectedRoute Component={Orders} />},
  //       { path: 'vendor', element:<ProtectedRoute Component={Vendor} />},
  //       { path: 'category', element:<ProtectedRoute Component={Category} />}
  //     ],
  //   },
  //   {
  //     path: '/',
  //     element: <LogoOnlyLayout />,
  //     children: [
  //       { path: '/', element:  <ProtectedRoute Component={DashboardApp} />  },
  //       // { path: '/', element:  <Navigate to="/dashboard/app" />  },
  //       // { path: '/', element: <Navigate to="/login" /> },
  //       { path: 'login', element: <Login /> },
  //       { path: 'register', element: <Register /> },
  //       { path: '404', element: <NotFound /> },
  //       { path: '*', element: <Navigate to="/404" /> },
  //     ],
  //   },
  //   { path: '*', element: <Navigate to="/404" replace /> },
  // ]);
  // if(authState.isAuthenticated){
  return (
    <Routes>
      {/* <Route exact path="/" element={ <DashboardLayout Component={<DashboardApp />} />}/>
     <Route exact path="/dashboard/app" element={<DashboardLayout Component={<DashboardApp/>} />}/>
     <Route path="/dashboard/customer" element={<DashboardLayout Component={<User/>} />}/>
     <Route path="/dashboard/products" element={<DashboardLayout Component={<Products/>} />}/>
     <Route path="/dashboard/blog" element={<DashboardLayout Component={<Blog/>} />}/>
     <Route path="/dashboard/orders" element={<DashboardLayout Component={<Orders/>} />}/>
     <Route path="/dashboard/vendor" element={<DashboardLayout Component={<Vendor/>} />}/>
     <Route path="/dashboard/category" element={<DashboardLayout Component={<Category/>} />}/>
     <Route path="/dashboard/payments-vendor" element={<DashboardLayout Component={<PaymentForVendors/>} />}/>
     <Route path="/dashboard/products/add_product/:product_id" element={<DashboardLayout Component={<AddProduct/>} />}/>
     <Route path="*" element={<Navigate to="/dashboard/app" />} />  */}
      {/* <Route path="/login" element={<LogoOnlyLayout Component={Login} />}/>
     <Route path="/register" element={<LogoOnlyLayout Component={Register} />}/>
     <Route path="/404" element={<LogoOnlyLayout Component={NotFound} />}/>
     <Route path="*" element={<Navigate to="/404" />} /> */}

      <Route element={<ProtectedRoute />}>
        <Route exact path="/" element={<Navigate to="/dashboard/orders" />} />
        <Route
          exact
          path="/dashboard/b2b-approval-list"
          element={<DashboardLayout Component={<B2bApprovalList />} />}
        />
        <Route
          exact
          path="/dashboard/b2b-approval/:id"
          element={<DashboardLayout Component={<B2bApproval />} />}
        />
        {/* <Route exact path="/dashboard/app" element={ <DashboardLayout Component={<DashboardApp/>} /> } /> */}

        <Route
          path="/dashboard/users"
          element={<DashboardLayout Component={<User />} />}
        />
        <Route
          path="/dashboard/products"
          element={<DashboardLayout Component={<Products />} />}
        />
        {/* <Route path="/dashboard/blog" element={ <DashboardLayout Component={<Blog/>} />} /> */}
        <Route
          path="/dashboard/orders"
          element={<DashboardLayout Component={<Orders />} />}
        />
        {/* <Route path="/dashboard/vendor" element={ <DashboardLayout Component={<Vendor/>} />}/> */}
        <Route
          path="/dashboard/brands"
          element={<DashboardLayout Component={<Category />} />}
        />
        <Route
          path="/dashboard/banners"
          element={<DashboardLayout Component={<Banners />} />}
        />
        <Route
          path="/dashboard/enquiries"
          element={<DashboardLayout Component={<Enquiry />} />}
        />
        <Route
          path="/dashboard/gifts-categories"
          element={<DashboardLayout Component={<GiftsCategory />} />}
        />
        <Route
          path="/dashboard/create-gift-categories/:id"
          element={<DashboardLayout Component={<CreateGiftCategories />} />}
        />
        <Route
          path="/dashboard/gift-products"
          element={<DashboardLayout Component={<GiftProducts />} />}
        />
        <Route
          path="/dashboard/create-gift-products/:id"
          element={<DashboardLayout Component={<CreateGiftProduct />} />}
        />
      </Route>
      <Route
        exact
        path="/login"
        element={<LogoOnlyLayout Component={<Login />} />}
      />
      <Route exact path="*" element={<Navigate to="/login" />} />

      {/* <Route exact path="/"  element={ <DashboardLayout Component={<DashboardApp />} />   }  />
     <Route exact path="/dashboard/app" element={ <DashboardLayout Component={<DashboardApp/>} /> } />
    
     <Route path="/dashboard/users" element={ <DashboardLayout Component={<User/>} />} />
     <Route path="/dashboard/products" element={ <DashboardLayout Component={<Products/>} />} />
     <Route path="/dashboard/blog" element={ <DashboardLayout Component={<Blog/>} />} />
     <Route path="/dashboard/orders" element={ <DashboardLayout Component={<Orders/>} />} />
     <Route path="/dashboard/vendor" element={ <DashboardLayout Component={<Vendor/>} />}/>
     <Route path="/dashboard/category" element={ <DashboardLayout Component={<Category/>} />} />
     <Route path="/dashboard/payments-vendor" element={ <DashboardLayout Component={<PaymentForVendors/>} />} />
     <Route path="/dashboard/products/add_product/:product_id" element={ <DashboardLayout Component={<AddProduct/>} />}/> */}

      {/* <Route path="/404" element={ <LogoOnlyLayout Component={<NotFound/>} />}/> */}

      {/* <Route path="*" element={<Navigate to={userState ? "/dashboard/app":"/login"} />} />    */}
    </Routes>
  );
  //  }
  // if(!authState.isAuthenticated){
  //   return (

  //    <Routes>
  //    <Route exact path="/" element={<LogoOnlyLayout Component={<Login/>} />}/>
  //    <Route exact path="/login" element={<LogoOnlyLayout Component={<Login/>} />}/>
  //    {/* <Route path="/register" element={<LogoOnlyLayout Component={Register} />}/> */}
  //    {/* <Route path="/404" element={<LogoOnlyLayout Component={NotFound} />}/> */}
  //    <Route path="*" element={<Navigate to="/login" />} />

  //  </Routes>

  //  )
  // }
}
