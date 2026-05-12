import { lazy, Suspense, useEffect, useMemo } from "react";
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
import { active_plan_success, clear_plan_success } from "./actions/activePlan";

const { persistor, store } = configureStoreProd();

const PageRouter = ({ children }: any) => {
  // useEffect supprimé pour éviter toute boucle infinie en mode mock
  return <>{children}</>;
};

function App() {
  // Add `is-mounted` to body as soon as App mounts to enable guarded transitions
  useEffect(() => {
    try {
      document.body.classList.add('is-mounted');
    } catch (e) {}
    return () => {
      try {
        document.body.classList.remove('is-mounted');
      } catch (e) {}
    };
  }, []);
  // const { t } = useTranslation();
  const routes = [
    { url: "*", path: "NotFoundPage" }, // Not Found Page
    { url: "/", path: "HomeMarketing" }, // Nouvelle vitrine publique
    { url: "/home-legacy", path: "Home" }, // Ancienne home (sauvegarde, à retirer plus tard)
    { url: "/signup", path: "Signup" }, // Auth Page Routes
    { url: "/signup/pro", path: "Signup/prologin" }, // Auth Page Routes
    { url: "/change-password", path: "ChangePassword" }, // Auth Page Routes
    { url: "/login", path: "Login" },
    { url: "/onboarding", path: "Onboarding" },
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
    // QR Code management page
    { url: "/property/qr-code", path: "QRCodeManagement" },
    { url: "/", element: <Navigate to="/login" /> },
    { url: "/project", path: "Project" },
    { url: "/dashboard", path: "Dashboard" },
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
    { url: "/marketplace", path: "Marketplace" },
    { url: "/marketplace/favorites", path: "Marketplace/Favorites" },
    { url: "/marketplace/:id", path: "Marketplace/ServiceDetail" },
    { url: "/marketplace/orders", path: "MarketplaceOrders" },
    { url: "/pro/marketplace", path: "ProMarketplace" },
    { url: "/pro/marketplace/sold-services", path: "ProMarketplace/SoldServices" },
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

  // Cache stable des composants lazy : évite que chaque navigation
  // recrée un nouveau composant et fasse apparaître le fallback Suspense
  // (effet "toute l'app se recharge").
  const routesWithElements = useMemo(
    () => routes.map((itm: any) => ({
      ...itm,
      Element: itm.path ? lazy(() => import(`./Pages/${itm.path}`)) : null,
    })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <>
      <Provider store={store}>
        {process.env.REACT_APP_DEBUG_MOCK_USER === 'true' ? (
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
                {routesWithElements.map((itm: any, index) => {
                  const Element = itm.Element;
                  return (
                    <Route
                      path={itm.url}
                      key={index}
                      element={
                        itm.path ? (
                          <Suspense fallback={null}>
                            <PageRouter
                              url={itm.url}
                              auth={itm.auth ? true : false}
                            >
                              <Element />
                            </PageRouter>
                          </Suspense>
                        ) : (
                          itm.element
                        )
                      }
                    />
                  );
                })}
              </Routes>
            </Router>
          </Suspense>
        ) : (
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
                  {routesWithElements.map((itm: any, index) => {
                    const Element = itm.Element;
                    return (
                      <Route
                        path={itm.url}
                        key={index}
                        element={
                          itm.path ? (
                            <Suspense fallback={null}>
                              <PageRouter
                                url={itm.url}
                                auth={itm.auth ? true : false}
                              >
                                <Element />
                              </PageRouter>
                            </Suspense>
                          ) : (
                            itm.element
                          )
                        }
                      />
                    );
                  })}
                </Routes>
              </Router>
            </Suspense>
          </PersistGate>
        )}
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
