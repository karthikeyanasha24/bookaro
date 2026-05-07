import MarketingHeader from "../MarketingHeader";
import MarketingFooter from "../MarketingFooter";

/**
 * MarketingLayout — vitrine publique AnyHomes.
 * Utilisé pour la home `/` et les pages "Fonctionnalités".
 * Pas de sidebar : header marketing + contenu + footer.
 */
const MarketingLayout = ({ children }) => {
  return (
    <div className="marketing-layout min-h-screen flex flex-col bg-white">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
};

export default MarketingLayout;
