import { useRoutes } from "react-router-dom";
import Menu from "../layouts/SideMenu";
import DashboardOverview1 from "../pages/DashboardOverview1";
import DashboardOverview2 from "../pages/DashboardOverview2";
import Calendar from "../pages/Calendar";
import Chat from "../pages/Chat";
import Inbox from "../pages/Inbox";
import EmailDetail from "../pages/EmailDetail";
import Compose from "../pages/Compose";
import Products from "../pages/Products";
import ProductDetail from "../pages/ProductDetail";
import Orders from "../pages/Orders";
import OrderDetail from "../pages/OrderDetail";
import FileManager from "../pages/FileManager";
import Profile from "../pages/Profile";
import Pricing from "../pages/Pricing";
import Invoice from "../pages/Invoice";
import Faq from "../pages/Faq";
import Timeline from "../pages/Timeline";

import CrudDataList from "../pages/CrudDataList";

// Riders
import Riders from "../pages/Riders";
import SearchRider from "../pages/SearchRider";
import ViewRider from "../pages/ViewRider";
import ViewRide from "../pages/ViewRide";

// Drivers
import Drivers from "../pages/Drivers";
import DriversApplications from "../pages/DriversApplications";
import SearchDriver from "../pages/SearchDriver";
import ViewDriver from "../pages/ViewDriver";

// Rewards
import AddCoupon from "../pages/AddCoupon";
import Coupons from "../pages/Coupons";

// Reports
import Reports from "../pages/Reports";
import ReportsSolved from "../pages/ReportsSolved";
import ViewReport from "../pages/ViewReport";

// Corporate
import RegisteredCompanies from "../pages/RegisteredCompanies";
import AddCompany from "../pages/AddCompany";
import ViewCompany from "../pages/ViewCompany";
import ViewRiderActivity from "../pages/ViewRiderActivity";

import CrudForm from "../pages/CrudForm";
import WizardLayout1 from "../pages/WizardLayout1";
import WizardLayout2 from "../pages/WizardLayout2";
import WizardLayout3 from "../pages/WizardLayout3";

import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";

import ErrorPage from "../pages/ErrorPage";
import RegularTable from "../pages/RegularTable";
import Tabulator from "../pages/Tabulator";
import Modal from "../pages/Modal";
import Slideover from "../pages/Slideover";
import Notification from "../pages/Notification";
import Tab from "../pages/Tab";
import Accordion from "../pages/Accordion";
import Button from "../pages/Button";
import Alert from "../pages/Alert";
import ProgressBar from "../pages/ProgressBar";
import Tooltip from "../pages/Tooltip";
import Dropdown from "../pages/Dropdown";
import Typography from "../pages/Typography";
import Icon from "../pages/Icon";
import LoadingIcon from "../pages/LoadingIcon";
import RegularForm from "../pages/RegularForm";
import Datepicker from "../pages/Datepicker";
import TomSelect from "../pages/TomSelect";
import FileUpload from "../pages/FileUpload";
import WysiwygEditor from "../pages/WysiwygEditor";
import Validation from "../pages/Validation";
import Chart from "../pages/Chart";
import Slider from "../pages/Slider";
import ImageZoom from "../pages/ImageZoom";

function Router() {
  const routes = [
    {
      path: "/",
      element: <Menu />,
      children: [
        {
          path: "/",
          element: <DashboardOverview1 />,
        },
        {
          path: "/dashboard-overview-2",
          element: <DashboardOverview2 />,
        },
        {
          path: "/calendar",
          element: <Calendar />,
        },
        {
          path: "/chat",
          element: <Chat />,
        },
        {
          path: "/inbox",
          element: <Inbox />,
        },
        {
          path: "/email-detail",
          element: <EmailDetail />,
        },
        {
          path: "/compose",
          element: <Compose />,
        },
        {
          path: "/products",
          element: <Products />,
        },
        {
          path: "/product-detail",
          element: <ProductDetail />,
        },
        {
          path: "/orders",
          element: <Orders />,
        },
        {
          path: "/order-detail",
          element: <OrderDetail />,
        },
        {
          path: "/file-manager",
          element: <FileManager />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/pricing",
          element: <Pricing />,
        },
        {
          path: "/invoice",
          element: <Invoice />,
        },
        {
          path: "/faq",
          element: <Faq />,
        },
        {
          path: "/timeline",
          element: <Timeline />,
        },
        {
          path: "/crud-data-list",
          element: <CrudDataList />,
        },

        // Riders
        {
          path: "/riders-data-list",
          element: <Riders />,
        },
        {
          path: "/view-rider/:id",
          element: <ViewRider />,
        },
        {
          path: "/search-rider",
          element: <SearchRider />,
        },
        // End of Riders

        // Start Drivers
        {
          path: "/drivers-data-list",
          element: <Drivers />,
        },
        {
          path: "/drivers-applications",
          element: <DriversApplications />,
        },
        {
          path: "/search-driver",
          element: <SearchDriver />,
        },
        {
          path: "/view-driver/:id",
          element: <ViewDriver />,
        },
        // End Drivers

        // Start Rides
        {
          path: "/view-ride/:id",
          element: <ViewRide />,
        },
        // End Rides

        // Start Rewards
        {
          path: "/add-coupon",
          element: <AddCoupon />,
        },
        {
          path: "/coupons",
          element: <Coupons />,
        },
        // End Rewards

        // Start Reports
        {
          path: "/reports",
          element: <Reports />,
        },
        {
          path: "/reports-solved",
          element: <ReportsSolved />,
        },
        {
          path: "/view-report/:id",
          element: <ViewReport />,
        },
        // End Reports

        // Start Corporate
        {
          path: "/companies-list",
          element: <RegisteredCompanies />,
        },
        {
          path: "/add-company",
          element: <AddCompany />,
        },
        {
          path: "/view-company/:id",
          element: <ViewCompany />,
        },
        {
          path: "/view-rider-activity/:id",
          element: <ViewRiderActivity />,
        },
        // End Corporate

        {
          path: "/crud-form",
          element: <CrudForm />,
        },
        {
          path: "/wizard-layout-1",
          element: <WizardLayout1 />,
        },
        {
          path: "/wizard-layout-2",
          element: <WizardLayout2 />,
        },
        {
          path: "/wizard-layout-3",
          element: <WizardLayout3 />,
        },
        {
          path: "regular-table",
          element: <RegularTable />,
        },
        {
          path: "tabulator",
          element: <Tabulator />,
        },
        {
          path: "modal",
          element: <Modal />,
        },
        {
          path: "slideover",
          element: <Slideover />,
        },
        {
          path: "notification",
          element: <Notification />,
        },
        {
          path: "tab",
          element: <Tab />,
        },
        {
          path: "accordion",
          element: <Accordion />,
        },
        {
          path: "button",
          element: <Button />,
        },
        {
          path: "alert",
          element: <Alert />,
        },
        {
          path: "progress-bar",
          element: <ProgressBar />,
        },
        {
          path: "tooltip",
          element: <Tooltip />,
        },
        {
          path: "dropdown",
          element: <Dropdown />,
        },
        {
          path: "typography",
          element: <Typography />,
        },
        {
          path: "icon",
          element: <Icon />,
        },
        {
          path: "loading-icon",
          element: <LoadingIcon />,
        },
        {
          path: "regular-form",
          element: <RegularForm />,
        },
        {
          path: "datepicker",
          element: <Datepicker />,
        },
        {
          path: "tom-select",
          element: <TomSelect />,
        },
        {
          path: "file-upload",
          element: <FileUpload />,
        },
        {
          path: "wysiwyg-editor",
          element: <WysiwygEditor />,
        },
        {
          path: "validation",
          element: <Validation />,
        },
        {
          path: "chart",
          element: <Chart />,
        },
        {
          path: "slider",
          element: <Slider />,
        },
        {
          path: "image-zoom",
          element: <ImageZoom />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/error-page",
      element: <ErrorPage />,
    },
  ];

  return useRoutes(routes);
}

export default Router;
