import { Link } from "react-router-dom";

/**
 * Section 9 — Preconfigured searches
 * Cards de recherches pré-configurées qui mènent directement à /properties
 * avec les filtres actifs.
 */
const SALE_CITIES = [
  { name: "Paris", slug: "Paris" },
  { name: "Lille", slug: "Lille" },
  { name: "Marseille", slug: "Marseille" },
  { name: "Lyon", slug: "Lyon" },
  { name: "Rennes", slug: "Rennes" },
  { name: "Nancy", slug: "Nancy" },
  { name: "Bordeaux", slug: "Bordeaux" },
  { name: "Dieppe", slug: "Dieppe" },
  { name: "Toulouse", slug: "Toulouse" },
  { name: "Annecy", slug: "Annecy" },
];

const buildUrl = (city, proposal) => {
  const params = new URLSearchParams({ search: "true", proposal });
  params.set("search", city);
  return `/properties?${params.toString()}`;
};

const PreconfiguredSearchesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-5">
        <div className="mb-8">
          <span className="inline-block text-[12px] font-medium uppercase tracking-wide text-[#976DD0] bg-[#976DD0]/10 rounded-full px-3 py-1 mb-3">
            Recherches populaires
          </span>
          <h2 className="text-2xl sm:text-3xl font-semibold">
            Trouver le bien qui correspond à 100 % de vos critères
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="font-semibold mb-4 text-[#976DD0]">House for sale</h3>
            <ul className="grid grid-cols-2 gap-y-2 text-[14px]">
              {SALE_CITIES.map((c) => (
                <li key={`sale-${c.slug}`}>
                  <Link
                    to={buildUrl(c.slug, "Buy")}
                    className="text-gray-700 hover:text-[#976DD0] underline-offset-4 hover:underline"
                  >
                    House for sale in {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-[#976DD0]">Flat for rent</h3>
            <ul className="grid grid-cols-2 gap-y-2 text-[14px]">
              {SALE_CITIES.map((c) => (
                <li key={`rent-${c.slug}`}>
                  <Link
                    to={buildUrl(c.slug, "Rent")}
                    className="text-gray-700 hover:text-[#976DD0] underline-offset-4 hover:underline"
                  >
                    Flat for rent in {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreconfiguredSearchesSection;
