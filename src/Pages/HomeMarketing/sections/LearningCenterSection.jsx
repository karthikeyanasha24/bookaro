import { Link } from "react-router-dom";

/**
 * Section 8 — Learning center
 * Mock 4 articles. Phase 4 : brancher API blogs / backend content.
 */
const ARTICLES_MOCK = [
  {
    id: "1",
    title: "Bien sûr le toit ? Ce qu'il faut savoir avant d'acheter",
    image: "/assets/img/blog-one.jpg",
    href: "/blog-detail",
  },
  {
    id: "2",
    title: "Comment améliorer son bien à la revente ?",
    image: "/assets/img/blog-two.jpg",
    href: "/blog-detail",
  },
  {
    id: "3",
    title: "Pourquoi devriez-vous vendre Off-Market ?",
    image: "/assets/img/blog-three.jpg",
    href: "/blog-detail",
  },
  {
    id: "4",
    title: "Acheter ou louer ? Les bons critères de décision",
    image: "/assets/img/blog-four.jpg",
    href: "/blog-detail",
  },
];

const LearningCenterSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-[#976DD0]/5 to-white">
      <div className="container mx-auto px-5">
        <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
          <div>
            <span className="inline-block text-[12px] font-medium uppercase tracking-wide text-[#976DD0] bg-[#976DD0]/10 rounded-full px-3 py-1 mb-3">
              Learning center
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold">
              Nos conseils pour mener à bien votre projet
            </h2>
          </div>
          <Link
            to="/blogs"
            className="text-[14px] font-medium text-[#976DD0] hover:underline"
          >
            Voir tous les articles →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ARTICLES_MOCK.map((a) => (
            <Link
              key={a.id}
              to={a.href}
              className="group rounded-2xl overflow-hidden border border-gray-100 hover:border-[#976DD0]/40 transition bg-white"
            >
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={a.image}
                  alt={a.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </div>
              <div className="p-4">
                <p className="font-medium text-[14px] group-hover:text-[#976DD0] transition">
                  {a.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningCenterSection;
