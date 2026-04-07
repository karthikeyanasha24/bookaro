import { lazy, Suspense, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-input-2/lib/style.css";
import "react-quill/dist/quill.snow.css";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";
import "./App.css";
import configureStoreProd from "./config/configureStore.prod";
import "./scss/main.scss";
import "react-datepicker/dist/react-datepicker.css";
import ApiClient from "./methods/api/apiClient";
import { active_plan_success } from "./actions/activePlan";

const { persistor, store } = configureStoreProd();

const PageRouter = ({ children }: any) => {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.loggedIn) {
      ApiClient.get(
        "user/activeplan",
        { userId: user._id || user.id },
        "",
        true
      ).then((res) => {
        if (res.success) {
          dispatch(active_plan_success(res.data));
        }
      });
    }
  }, [user]);

  return <>{children}</>;
};

function App() {
  // const { t } = useTranslation();
  const routes = [
    { url: "*", path: "NotFoundPage" }, // Not Found Page
    { url: "/", path: "Home" },
    { url: "/signup", path: "Signup" }, // Auth Page Routes
    { url: "/signup/pro", path: "Signup/prologin" }, // Auth Page Routes
    { url: "/change-password", path: "ChangePassword" }, // Auth Page Routes
    { url: "/login", path: "Login" },
    { url: "/otpverify", path: "Otpverify" },
    { url: "/reset-email", path: "ResetEmail" },
    { url: "/reset-new-email", path: "ResetNewEmail" },
    { url: "/forgotpassword", path: "Forgotpassword" },
    { url: "/reset-password", path: "Resetpassword" },
    { url: "/phone-number", path: "PhoneNumber" },
    { url: "/help", path: "Help" },
    { url: "/profile", path: "Settings" },
    { url: "/profile/company-logo", path: "Settings/CompanyLogo" },
    { url: "/profile/company-details", path: "Settings/CompanyDetails" },
    { url: "/profile/contact-details", path: "Settings/ContactDetails" },
    { url: "/profile/about", path: "Settings/About" },
    { url: "/profile/team", path: "Settings/Team" },
    { url: "/profile/services", path: "Settings/Services" },
    { url: "/settings/work-hour", path: "Settings/WorkingHour" },
    {
      url: "/profile/manage-notifications",
      path: "Profile/ManageNotifications",
    },
    { url: "/profile/:tab", path: "Profile" },
    { url: "/properties", path: "Property" },
    { url: "/property1", path: "propertySteps/property1" },
    { url: "/property2", path: "propertySteps/property2" },
    { url: "/property3", path: "propertySteps/property3" },
    { url: "/property/add", path: "propertySteps/AddEdit" },
    { url: "/property/edit/:id", path: "propertySteps/Edit" },
    { url: "/property/edit/:id/:step", path: "propertySteps/Edit" },
    { url: "/property/add/:step", path: "propertySteps/AddEdit" },
    { url: "/", element: <Navigate to="/login" /> },
    { url: "/project", path: "Project" },
    { url: "/property-details", path: "PropertyDetails" },
    { url: "/property-timeline", path: "PropertyTimeline" },
    { url: "/serach-alert", path: "SearchAlert" },
    { url: "/buyer-file", path: "BuyerFile" },
    { url: "/renter-file", path: "RenterFile" },
    { url: "/seller-file", path: "SellerFile" },
    { url: "/followed-properties", path: "FollowedProperty" },
    { url: "/followed-properties-list", path: "FollowedPropertyList" },
    { url: "/notifications", path: "Notifications" },
    { url: "/chat", path: "Chat" },
    { url: "/building-permit", path: "BuildingPermit" },
    { url: "/building-permit-list", path: "BuildingPermitlist" },
    { url: "/past-transactions", path: "PastTransactions" },
    { url: "/past-transation-list", path: "PastTransectionList" },
    { url: "/real-estate-pros", path: "RealEstatePros" },
    { url: "/prolist", path: "Prolist" },
    { url: "/company-details", path: "CompanyDetails" },
    { url: "/blogs", path: "Blogs" },
    { url: "/blog-detail", path: "BlogDetail" },
    { url: "/blog-owning", path: "Blogs/blogOwning" },
    { url: "/blog-own-detail", path: "Blogs/blogOwnDetail" },
    { url: "/my-properties", path: "Property/MyProperties" },
    { url: "/contact-us", path: "ContactUs" },
    { url: "/plan", path: "Plan" },
    {
      url: "/real-estate-transaction-owner",
      path: "RealEstateTransactionOwner",
    },
    {
      url: "/real-estate-transaction-searcher",
      path: "RealEstateTransactionSearcher",
    },
    { url: "/card-detail", path: "CardDetail" },
    { url: "/billing-history", path: "BillingHistory" },
    { url: "/transaction1", path: "Transaction" },
    { url: "/transaction2", path: "Transaction/Transaction2" },
    { url: "/transaction3", path: "Transaction/Transaction3" },
    { url: "/transaction4", path: "Transaction/Transaction4" },
    { url: "/training", path: "training" },
    { url: "/peertopeer", path: "PeertopeerEstimation/peertopeer" },
    { url: "/estimation", path: "PeertopeerEstimation/estimation" },
    { url: "/experience", path: "PeertopeerEstimation/experience" },
    { url: "/alert", path: "PeertopeerEstimation/alert" },
    { url: "/wallet", path: "PeertopeerEstimation/wallet" },
    { url: "/social-estimation", path: "PeertopeerEstimation/socialEstimation" },
    { url: "/hunter-form", path: "Blogs/forms/hunterForm" },
    { url: "/selling-form", path: "Blogs/forms/sellingForm" },
    { url: "/interest-form", path: "Blogs/forms/interestForm" },
    { url: "/getquote-form", path: "Blogs/forms/getQuoteForm" },
    { url: "/getmove-form", path: "Blogs/forms/moveForm" },
    { url: "/directory", path: "LandingPage/directory" },
    { url: "/offmarket", path: "LandingPage/offmarket" },
    { url: "/transaction-tool", path: "LandingPage/transactionTool" },
    { url: "/support-page", path: "Support" },
    { url: "/privacy-policy", path: "PrivacyPolicy" },
    { url: "/delete-user", path: "DeleteUser" },
  ];

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
              {/* <div className="language-switcher-container">
                  <LanguageSwitcher />
                </div> */}
              {/* <PageLayout> */}
              <Routes>
                {routes.map((itm: any, index) => {
                  const Element = lazy(() => import(`./Pages/${itm.path}`));

                  return (
                    <Route
                      path={itm.url}
                      key={index}
                      element={
                        itm.path ? (
                          <PageRouter
                            url={itm.url}
                            auth={itm.auth ? true : false}
                          >
                            <Element />
                          </PageRouter>
                        ) : (
                          itm.element
                        )
                      }
                    />
                  );
                })}
              </Routes>
              {/* </PageLayout> */}
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
