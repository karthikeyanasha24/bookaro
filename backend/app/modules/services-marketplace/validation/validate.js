/**
 * Moteur de validation léger (sans dépendance externe)
 * Usage : validate(schema)(req, res, next)
 *
 * Chaque schema est un objet { body, query, params } dont les valeurs
 * sont des fonctions (value) => string|null  (null = OK, string = message d'erreur)
 */

/**
 * Middleware factory
 * @param {Object} schema - { body?: {}, query?: {}, params?: {} }
 */
function validate(schema) {
  return (req, res, next) => {
    const errors = [];

    for (const location of ['body', 'query', 'params']) {
      if (!schema[location]) continue;
      for (const [field, validator] of Object.entries(schema[location])) {
        const value = req[location] && req[location][field];
        const error = validator(value, req[location]);
        if (error) errors.push({ field: `${location}.${field}`, message: error });
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, message: 'Données invalides', errors });
    }
    next();
  };
}

// ─── Validateurs primitifs réutilisables ──────────────────────────────────────

const v = {
  required: (label) => (val) =>
    val === undefined || val === null || val === '' ? `${label} est requis` : null,

  requiredString: (label, max = 500) => (val) => {
    if (!val || typeof val !== 'string' || val.trim() === '') return `${label} est requis`;
    if (val.length > max) return `${label} ne doit pas dépasser ${max} caractères`;
    return null;
  },

  optionalString: (label, max = 2000) => (val) => {
    if (val === undefined || val === null) return null;
    if (typeof val !== 'string') return `${label} doit être une chaîne de caractères`;
    if (val.length > max) return `${label} ne doit pas dépasser ${max} caractères`;
    return null;
  },

  positiveNumber: (label) => (val) => {
    if (val === undefined || val === null || val === '') return `${label} est requis`;
    const n = Number(val);
    if (isNaN(n) || n <= 0) return `${label} doit être un nombre positif`;
    return null;
  },

  positiveInt: (label) => (val) => {
    if (val === undefined || val === null || val === '') return `${label} est requis`;
    const n = Number(val);
    if (!Number.isInteger(n) || n <= 0) return `${label} doit être un entier positif`;
    return null;
  },

  inEnum: (label, allowed) => (val) => {
    if (val === undefined || val === null || val === '') return `${label} est requis`;
    if (!allowed.includes(val)) return `${label} doit être l'une des valeurs : ${allowed.join(', ')}`;
    return null;
  },

  optionalEnum: (label, allowed) => (val) => {
    if (val === undefined || val === null) return null;
    if (!allowed.includes(val)) return `${label} doit être l'une des valeurs : ${allowed.join(', ')}`;
    return null;
  },

  mongoId: (label) => (val) => {
    if (!val) return `${label} est requis`;
    if (!/^[a-f\d]{24}$/i.test(val)) return `${label} n'est pas un identifiant valide`;
    return null;
  },

  rating: () => (val) => {
    if (val === undefined || val === null || val === '') return 'La note est requise';
    const n = Number(val);
    if (isNaN(n) || n < 1 || n > 5) return 'La note doit être entre 1 et 5';
    return null;
  },

  boolean: (label) => (val) => {
    if (val === undefined || val === null) return null;
    if (typeof val !== 'boolean') return `${label} doit être un booléen`;
    return null;
  },

  optionalPositiveInt: (label) => (val) => {
    if (val === undefined || val === null || val === '') return null;
    const n = Number(val);
    if (!Number.isInteger(n) || n <= 0) return `${label} doit être un entier positif`;
    return null;
  },
};

module.exports = { validate, v };
