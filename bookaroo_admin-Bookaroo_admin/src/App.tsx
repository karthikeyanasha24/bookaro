import { Suspense } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "react-phone-input-2/lib/style.css";
import "react-quill/dist/quill.snow.css";
import "react-datepicker/dist/react-datepicker.css";
import "./scss/main.scss";
import configureStoreProd from "./config/configureStore.prod";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
import { lazy } from "react";

const { persistor, store } = configureStoreProd();

function App() {
  const routes = [
    { url: "/", element: <Navigate to="/login" /> },
    { url: "*", path: "NotFoundPage" }, // Not Found Page
    { url: "/login", path: "Login" }, // Auth Page Routes
    { url: "/forgotpassword", path: "Forgotpassword" },
    { url: "/reset-password", path: "Resetpassword" },
    { url: "/dashboard", path: "Dashboard" }, // Dashboard Route
    { url: "/profile", path: "Profile" }, // Profile Page Routes
    { url: "/profile/:tab", path: "Settings" },
    { url: "/user", path: "Users" }, // Staff Module Routes
    { url: "/user/edit/:id", path: "Users/AddEdit" },
    { url: "/user/add", path: "Users/AddEdit" },
    { url: "/user/detail/:id", path: "Users/View" },
    { url: "/user-report", path: "UserReport" }, // Staff Module Routes
    { url: "/user-report/edit/:id", path: "UserReport/AddEdit" },
    { url: "/user-report/add", path: "UserReport/AddEdit" },
    { url: "/user-report/detail/:id", path: "UserReport/View" },

    { url: "/company", path: "Agency" }, // Staff Module Routes
    { url: "/company/edit/:id", path: "Agency/AddEdit" },
    { url: "/company/add", path: "Agency/AddEdit" },
    { url: "/company/detail/:id", path: "Agency/View" },
    { url: "/staff", path: "Staff" }, // Staff Module Routes
    { url: "/staff/edit/:id", path: "Staff/AddEdit" },
    { url: "/staff/add", path: "Staff/AddEdit" },
    { url: "/staff/detail/:id", path: "Staff/View" },
    { url: "/blog-category", path: "Category" }, // Category Module Routes
    { url: "/blog-category/edit/:id", path: "Category/AddEdit" },
    { url: "/blog-category/add", path: "Category/AddEdit" },
    { url: "/blog-category/detail/:id", path: "Category/View" },
    { url: "/blog-category-type", path: "CategoryType" }, // Staff Module Routes
    { url: "/blog-category-type/edit/:id", path: "CategoryType/AddEdit" },
    { url: "/blog-category-type/add", path: "CategoryType/AddEdit" },
    { url: "/blog-category-type/detail/:id", path: "CategoryType/View" },
    { url: "/category-form", path: "CategoryForm" }, // Category Form Module Routes
    { url: "/category-form/detail/:id", path: "CategoryForm/View" },
    { url: "/amenities", path: "Amenities" }, // Amenities Module Routes
    { url: "/amenities/edit/:id", path: "Amenities/AddEdit" },
    { url: "/amenities/add", path: "Amenities/AddEdit" },
    { url: "/amenities/detail/:id", path: "Amenities/View" },
    { url: "/venues", path: "Venues" }, // Venues Module Routes
    { url: "/venues/edit/:id", path: "Venues/AddEdit" },
    { url: "/venues/add", path: "Venues/AddEdit" },
    { url: "/venues/detail/:id", path: "Venues/View" },
    { url: "/blog", path: "Blog" }, // Blog Module Routes
    { url: "/blog/edit/:id", path: "Blog/AddEdit" },
    { url: "/blog/add", path: "Blog/AddEdit" },
    { url: "/blog/detail/:id", path: "Blog/View" },
    { url: "/contentmanagement", path: "Contentmanagement" }, // contentmanagement Module Routes
    { url: "/contentmanagement/edit/:id", path: "Contentmanagement/AddEdit" },
    { url: "/contentmanagement/add", path: "Contentmanagement/AddEdit" },
    { url: "/contentmanagement/detail/:id", path: "Contentmanagement/View" },
    { url: "/property", path: "Property" }, // Property Module Routes
    { url: "/property/edit/:id", path: "Property/AddEdit" },
    { url: "/property/add", path: "Property/AddEdit" },
    { url: "/property/add/:step", path: "Property/AddEdit" },
    { url: "/property/add/:id/:step", path: "Property/AddEdit" },
    { url: "/property/:slug", path: "Property/AddEdit" },
    { url: "/property/detail/:id", path: "Property/View" },
    { url: "/property-requests", path: "PropertyRequests" },

    { url: "/schoolproperty", path: "SchoolProperty" }, // School Property Module Routes
    { url: "/schoolproperty/edit/:id", path: "SchoolProperty/AddEdit" },
    { url: "/schoolproperty/add", path: "SchoolProperty/AddEdit" },
    { url: "/schoolproperty/detail/:id", path: "SchoolProperty/View" },

    { url: "/verification", path: "DocumentVerification" }, // User verification(Declarative rating) Module Routes
    { url: "/verification/edit/:id", path: "DocumentVerification/AddEdit" },
    { url: "/verification/add", path: "DocumentVerification/AddEdit" },
    { url: "/verification/detail/:id", path: "DocumentVerification/View" },

    { url: "/funnelvideo/add", path: "FunnelVideo/AddEdit" },
    { url: "/funnelvideo/edit/:id", path: "FunnelVideo/AddEdit" },
    { url: "/funnelvideo", path: "FunnelVideo" },
    { url: "/funnelvideo/detail/:id", path: "FunnelVideo/View" },

    { url: "/property-revenue", path: "Revenue" },
    { url: "/property-revenue/add", path: "Revenue/AddEdit" },
    { url: "/property-revenue/edit/:id", path: "Revenue/AddEdit" },
    { url: "/property-revenue/detail/:id", path: "Revenue/View" },
    { url: "/property-revenue-source", path: "RevenueSource" },
    { url: "/property-revenue-source/add", path: "RevenueSource/AddEdit" },
    { url: "/property-revenue-source/edit/:id", path: "RevenueSource/AddEdit" },
    { url: "/property-revenue-source/detail/:id", path: "RevenueSource/View" },
    { url: "/property-state", path: "PropertyState" },
    { url: "/property-state/add", path: "PropertyState/AddEdit" },
    { url: "/property-state/edit/:id", path: "PropertyState/AddEdit" },
    { url: "/property-state/detail/:id", path: "PropertyState/View" },
    { url: "/property-expense", path: "Expense" },
    { url: "/property-expense/add", path: "Expense/AddEdit" },
    { url: "/property-expense/edit/:id", path: "Expense/AddEdit" },
    { url: "/property-expense/detail/:id", path: "Expense/View" },
    { url: "/property-renovation", path: "Renovation" },
    { url: "/property-renovation/add", path: "Renovation/AddEdit" },
    { url: "/property-renovation/edit/:id", path: "Renovation/AddEdit" },
    { url: "/property-renovation/detail/:id", path: "Renovation/View" },
    { url: "/property-ratings", path: "Ratings" },
    { url: "/property-ratings/add", path: "Ratings/AddEdit" },
    { url: "/property-ratings/edit/:id", path: "Ratings/AddEdit" },
    { url: "/property-ratings/detail/:id", path: "Ratings/View" },
    { url: "/property-quick-search", path: "QuickSearch" },
    { url: "/property-quick-search/add", path: "QuickSearch/AddEdit" },
    { url: "/property-quick-search/edit/:id", path: "QuickSearch/AddEdit" },
    { url: "/property-quick-search/detail/:id", path: "QuickSearch/View" },
    { url: "/plan", path: "Plans" },
    { url: "/plan/edit/:id", path: "Plans/AddEdit" },
    { url: "/plan/add", path: "Plans/AddEdit" },
    { url: "/plan/detail/:id", path: "Plans/View" },
    { url: "/plan-feature", path: "Features" },
    { url: "/plan-feature/detail/:id", path: "Features/View" },
    { url: "/enquiry", path: "Enquiry" },
    { url: "/enquiry/detail/:id", path: "Enquiry/View" },
    { url: "/review", path: "Review" },
    { url: "/service", path: "Service" },
    { url: "/service/add", path: "Service/AddEdit" },
    { url: "/service/edit/:id", path: "Service/AddEdit" },
    { url: "/faq", path: "Faq" }, // FAQ Module Routes
    { url: "/faq/edit/:id", path: "Faq/AddEdit" },
    { url: "/faq/add", path: "Faq/AddEdit" },
    { url: "/faq/detail/:id", path: "Faq/View" },

    { url: "/presetSearch", path: "PresetSearches" }, // Staff Module Routes
    { url: "/presetSearch/edit/:id", path: "PresetSearches/AddEdit" },
    { url: "/presetSearch/add", path: "PresetSearches/AddEdit" },
    { url: "/presetSearch/detail/:id", path: "PresetSearches/View" },

    { url: "/review-company", path: "CompanyReview" }, // Staff Module Routes
    { url: "/review-company/edit/:id", path: "CompanyReview/AddEdit" },
    { url: "/review-company/add", path: "CompanyReview/AddEdit" },
    { url: "/review-company/detail/:id", path: "CompanyReview/View" },

    { url: "/admin-setting", path: "AdminSetting" },
    { url: "/admin-setting/edit/:id", path: "AdminSetting/AddEdit" },
    { url: "/admin-setting/detail/:id", path: "AdminSetting/View" },

    { url: "/property-claim-ownership", path: "ClaimOwnerShip" }, 
    { url: "/property-claim-ownership/detail/:id", path: "ClaimOwnerShip/View" },

  ];

  sessionStorage.clear();

  return (
    <>
      <Provider store={store}>
        <PersistGate loading={"loading ..."} persistor={persistor}>
          <Suspense
            fallback={
              <div id="loader" className="loaderDiv">
                <div>
                  <img
                    src="/assets/img/loader.gif"
                    alt="logo"
                    className="loaderlogo"
                  />
                </div>
              </div>
            }
          >
            <Router>
              <Routes>
                {routes.map((itm, index) => {
                  const Element = lazy(() => import(`./Pages/${itm.path}`));
                  return (
                    <Route
                      path={itm.url}
                      key={index}
                      element={itm.path ? <Element /> : itm.element}
                    />
                  );
                })}
              </Routes>
            </Router>
          </Suspense>
        </PersistGate>
      </Provider>
      <div id="loader" className="loaderDiv d-none">
        <div>
          <img src="/assets/img/loader.gif" alt="logo" className="loaderlogo" />
        </div>
      </div>
      <ToastContainer position="top-right" className="toasterDiv" />
    </>
  );
}

export default App;
