// component
import Iconify from '../../components/Iconify';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  // {
  //   title: 'dashboard',
  //   path: '/dashboard/app',
  //   icon: getIcon('eva:pie-chart-2-fill'),
  // },
  {
    title: 'orders',
    path: '/dashboard/orders',
    icon: getIcon('bxs:box'),
  },
  {
    title: 'Users',
    path: '/dashboard/users',
    icon: getIcon('eva:people-fill'),
  },
  // {
  //   title: 'vendors',
  //   path: '/dashboard/vendor',
  //   icon: getIcon('entypo:shop'),
  // },
 
  {
    title: 'brands',
    path: '/dashboard/brands',
    icon: getIcon('material-symbols:category-rounded'),
  },
  {
    title: 'products',
    path: '/dashboard/products',
    icon: getIcon('eva:shopping-bag-fill'),
  },
  {
    title: 'banners',
    path: '/dashboard/banners',
    icon: getIcon('eva:image-fill'),
  },
  {
    title: 'Enquiries',
    path: '/dashboard/enquiries',
    icon: getIcon('mdi:message-bookmark'),
  },
  {
    title: "B2B account approval",
    path: '/dashboard/b2b-approval-list',
    icon: <BookmarkAddedIcon />
  }
  
  
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: getIcon('eva:file-text-fill'),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: getIcon('eva:lock-fill'),
  // },
  // {
  //   title: 'register',
  //   path: '/register',
  //   icon: getIcon('eva:person-add-fill'),
  // },
  

  
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: getIcon('eva:alert-triangle-fill'),
  // },
];

export default navConfig;
