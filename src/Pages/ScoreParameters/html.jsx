import { FiChevronRight } from "react-icons/fi";
import { FiSave, FiRotateCcw } from "react-icons/fi";

const Html = ({ loading, saving, params, setParams, handleSave, handleResetDefaults }) => {
  const updateField = (key, value) => {
    setParams({ ...params, [key]: value });
  };

  const updateFee = (key, value) => {
    setParams({
      ...params,
      feesRate: { ...params.feesRate, [key]: value },
    });
  };

  const updateBucket = (index, key, value) => {
    const next = [...params.scoreBuckets];
    next[index] = { ...next[index], [key]: value };
    setParams({ ...params, scoreBuckets: next });
  };

  const addBucket = () => {
    setParams({
      ...params,
      scoreBuckets: [...params.scoreBuckets, { min: "", score: "" }],
    });
  };

  const removeBucket = (index) => {
    const next = params.scoreBuckets.filter((_, idx) => idx !== index);
    setParams({ ...params, scoreBuckets: next });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-[#111827]">Parameters</h3>
          <p className="text-sm text-gray-600 mt-2">
            Modify the financial credibility score assumptions and buckets directly from the admin interface.
          </p>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            disabled={loading || saving}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-60"
          >
            <FiRotateCcw />
            Reset defaults
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || saving}
            className="inline-flex items-center gap-2 rounded-md bg-[#976DD0] px-4 py-2 text-white hover:bg-[#8352c2] disabled:opacity-60"
          >
            <FiSave />
            {saving ? "Saving..." : "Save parameters"}
          </button>
        </div>

        <div className="shadow-box bg-white rounded-lg p-5">
          <h4 className="text-lg font-semibold mb-4">Scoring assumptions</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium">Debt ratio</span>
              <input
                type="number"
                step="0.01"
                value={params.debtRatio}
                onChange={(e) => updateField("debtRatio", e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Loan duration (years)</span>
              <input
                type="number"
                step="1"
                value={params.loanDurationYears}
                onChange={(e) => updateField("loanDurationYears", e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Nominal annual rate</span>
              <input
                type="number"
                step="0.001"
                value={params.nominalAnnualRate}
                onChange={(e) => updateField("nominalAnnualRate", e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Insurance annual rate</span>
              <input
                type="number"
                step="0.001"
                value={params.insuranceAnnualRate}
                onChange={(e) => updateField("insuranceAnnualRate", e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Gross-to-net coefficient</span>
              <input
                type="number"
                step="0.01"
                value={params.grossToNetCoefficient}
                onChange={(e) => updateField("grossToNetCoefficient", e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Variable income retention</span>
              <input
                type="number"
                step="0.01"
                value={params.variableIncomeRetention}
                onChange={(e) => updateField("variableIncomeRetention", e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Additional income retention</span>
              <input
                type="number"
                step="0.01"
                value={params.additionalIncomeRetention}
                onChange={(e) => updateField("additionalIncomeRetention", e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
            </label>
          </div>
        </div>

        <div className="shadow-box bg-white rounded-lg p-5">
          <h4 className="text-lg font-semibold mb-4">Project fees</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium">Ancien</span>
              <input
                type="number"
                step="0.01"
                value={params.feesRate.ancien}
                onChange={(e) => updateFee("ancien", e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Neuf</span>
              <input
                type="number"
                step="0.01"
                value={params.feesRate.neuf}
                onChange={(e) => updateFee("neuf", e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Vente sur plan</span>
              <input
                type="number"
                step="0.01"
                value={params.feesRate["vente sur plan"]}
                onChange={(e) => updateFee("vente sur plan", e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Construction</span>
              <input
                type="number"
                step="0.01"
                value={params.feesRate.construction}
                onChange={(e) => updateFee("construction", e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Terrain + construction</span>
              <input
                type="number"
                step="0.01"
                value={params.feesRate["terrain + construction"]}
                onChange={(e) => updateFee("terrain + construction", e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
            </label>
          </div>
        </div>

        <div className="shadow-box bg-white rounded-lg p-5">
          <h4 className="text-lg font-semibold mb-4">Pre-acceptance scoring</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium">Préacceptation récente (jours)</span>
              <input
                type="number"
                step="1"
                value={params.preAcceptanceRecencyDays}
                onChange={(e) => updateField("preAcceptanceRecencyDays", e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Bonus banque montant >= besoin</span>
              <input
                type="number"
                step="1"
                value={params.preAcceptanceBankFullBonus}
                onChange={(e) => updateField("preAcceptanceBankFullBonus", e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Bonus courtier montant >= besoin</span>
              <input
                type="number"
                step="1"
                value={params.preAcceptanceCourtierFullBonus}
                onChange={(e) => updateField("preAcceptanceCourtierFullBonus", e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Bonus banque montant inférieur au besoin</span>
              <input
                type="number"
                step="1"
                value={params.preAcceptanceBankPartialBonus}
                onChange={(e) => updateField("preAcceptanceBankPartialBonus", e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Bonus courtier montant inférieur au besoin</span>
              <input
                type="number"
                step="1"
                value={params.preAcceptanceCourtierPartialBonus}
                onChange={(e) => updateField("preAcceptanceCourtierPartialBonus", e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Bonus banque sans montant explicite</span>
              <input
                type="number"
                step="1"
                value={params.preAcceptanceBankNoAmountBonus}
                onChange={(e) => updateField("preAcceptanceBankNoAmountBonus", e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Bonus courtier sans montant explicite</span>
              <input
                type="number"
                step="1"
                value={params.preAcceptanceCourtierNoAmountBonus}
                onChange={(e) => updateField("preAcceptanceCourtierNoAmountBonus", e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium">Bonus préacceptation non spécifiée</span>
              <input
                type="number"
                step="1"
                value={params.preAcceptanceUnknownEmitterBonus}
                onChange={(e) => updateField("preAcceptanceUnknownEmitterBonus", e.target.value)}
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
            </label>
          </div>
        </div>

        <div className="shadow-box bg-white rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">Score buckets</h4>
            <button
              type="button"
              onClick={addBucket}
              className="rounded-md border border-[#976DD0] px-3 py-2 text-[#976DD0]"
            >
              Add row
            </button>
          </div>
          <div className="grid gap-4">
            {params.scoreBuckets.map((bucket, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-end border p-4 rounded-lg">
                <div className="col-span-5">
                  <label className="block text-sm font-medium">Minimum ratio</label>
                  <input
                    type="number"
                    step="0.01"
                    value={bucket.min}
                    onChange={(e) => updateBucket(index, "min", e.target.value)}
                    className="mt-1 block w-full rounded-md border px-3 py-2"
                  />
                </div>
                <div className="col-span-5">
                  <label className="block text-sm font-medium">Score</label>
                  <input
                    type="number"
                    step="1"
                    value={bucket.score}
                    onChange={(e) => updateBucket(index, "score", e.target.value)}
                    className="mt-1 block w-full rounded-md border px-3 py-2"
                  />
                </div>
                <div className="col-span-2 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => removeBucket(index)}
                    className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="shadow-box bg-white rounded-lg p-5">
          <h4 className="text-lg font-semibold mb-4">Implementation note</h4>
          <p className="text-sm text-gray-600 leading-6">
            The financial scoring logic is implemented in <code>app/services/financialScore.service.js</code>.
            Use the fields above to update the parameters in the backend-managed score settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Html;
