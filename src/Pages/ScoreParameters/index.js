import { useEffect, useState } from "react";
import ApiClient from "../../methods/api/apiClient";
import Layout from "../../components/global/layout";
import Html from "./html";
import shared from "./shared";

const defaultParams = {
  debtRatio: 0.35,
  loanDurationYears: 25,
  nominalAnnualRate: 0.035,
  insuranceAnnualRate: 0.01,
  grossToNetCoefficient: 0.75,
  variableIncomeRetention: 0.7,
  additionalIncomeRetention: 0.7,
  preAcceptanceRecencyDays: 180,
  preAcceptanceBankFullBonus: 15,
  preAcceptanceCourtierFullBonus: 10,
  preAcceptanceBankPartialBonus: 8,
  preAcceptanceCourtierPartialBonus: 5,
  preAcceptanceBankNoAmountBonus: 6,
  preAcceptanceCourtierNoAmountBonus: 4,
  preAcceptanceUnknownEmitterBonus: 3,
  feesRate: {
    ancien: 0.08,
    neuf: 0.03,
    "vente sur plan": 0.03,
    construction: 0.1,
    "terrain + construction": 0.1,
  },
  scoreBuckets: [
    { min: 1.1, score: 70 },
    { min: 1.0, score: 60 },
    { min: 0.9, score: 48 },
    { min: 0.8, score: 35 },
    { min: 0.7, score: 22 },
    { min: 0.6, score: 12 },
    { min: 0.0, score: 0 },
  ],
};

const ScoreParameters = () => {
  const [params, setParams] = useState(defaultParams);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const normalizeSettings = (settings) => {
    return {
      debtRatio: settings.debtRatio ?? defaultParams.debtRatio,
      loanDurationYears: settings.loanDurationYears ?? defaultParams.loanDurationYears,
      nominalAnnualRate: settings.nominalAnnualRate ?? defaultParams.nominalAnnualRate,
      insuranceAnnualRate: settings.insuranceAnnualRate ?? defaultParams.insuranceAnnualRate,
      grossToNetCoefficient: settings.grossToNetCoefficient ?? defaultParams.grossToNetCoefficient,
      variableIncomeRetention: settings.variableIncomeRetention ?? defaultParams.variableIncomeRetention,
      additionalIncomeRetention: settings.additionalIncomeRetention ?? defaultParams.additionalIncomeRetention,
      preAcceptanceRecencyDays: settings.preAcceptanceRecencyDays ?? defaultParams.preAcceptanceRecencyDays,
      preAcceptanceBankFullBonus: settings.preAcceptanceBankFullBonus ?? defaultParams.preAcceptanceBankFullBonus,
      preAcceptanceCourtierFullBonus: settings.preAcceptanceCourtierFullBonus ?? defaultParams.preAcceptanceCourtierFullBonus,
      preAcceptanceBankPartialBonus: settings.preAcceptanceBankPartialBonus ?? defaultParams.preAcceptanceBankPartialBonus,
      preAcceptanceCourtierPartialBonus: settings.preAcceptanceCourtierPartialBonus ?? defaultParams.preAcceptanceCourtierPartialBonus,
      preAcceptanceBankNoAmountBonus: settings.preAcceptanceBankNoAmountBonus ?? defaultParams.preAcceptanceBankNoAmountBonus,
      preAcceptanceCourtierNoAmountBonus: settings.preAcceptanceCourtierNoAmountBonus ?? defaultParams.preAcceptanceCourtierNoAmountBonus,
      preAcceptanceUnknownEmitterBonus: settings.preAcceptanceUnknownEmitterBonus ?? defaultParams.preAcceptanceUnknownEmitterBonus,
      feesRate: {
        ancien: settings.feesRate?.ancien ?? defaultParams.feesRate.ancien,
        neuf: settings.feesRate?.neuf ?? defaultParams.feesRate.neuf,
        "vente sur plan": settings.feesRate?.["vente sur plan"] ?? defaultParams.feesRate["vente sur plan"],
        construction: settings.feesRate?.construction ?? defaultParams.feesRate.construction,
        "terrain + construction": settings.feesRate?.["terrain + construction"] ?? defaultParams.feesRate["terrain + construction"],
      },
      scoreBuckets: Array.isArray(settings.scoreBuckets) && settings.scoreBuckets.length
        ? settings.scoreBuckets.map((bucket) => ({
            min: bucket.min ?? "",
            score: bucket.score ?? "",
          }))
        : defaultParams.scoreBuckets,
    };
  };

  const loadSettings = () => {
    setLoading(true);
    ApiClient.get(shared.detailApi).then((res) => {
      if (res.success && res.settings) {
        setParams(normalizeSettings(res.settings));
      }
      setLoading(false);
    });
  };

  const handleSave = () => {
    setSaving(true);
    const payload = {
      debtRatio: Number(params.debtRatio) || 0,
      loanDurationYears: Number(params.loanDurationYears) || 0,
      nominalAnnualRate: Number(params.nominalAnnualRate) || 0,
      insuranceAnnualRate: Number(params.insuranceAnnualRate) || 0,
      grossToNetCoefficient: Number(params.grossToNetCoefficient) || 0,
      variableIncomeRetention: Number(params.variableIncomeRetention) || 0,
      additionalIncomeRetention: Number(params.additionalIncomeRetention) || 0,
      preAcceptanceRecencyDays: Number(params.preAcceptanceRecencyDays) || 0,
      preAcceptanceBankFullBonus: Number(params.preAcceptanceBankFullBonus) || 0,
      preAcceptanceCourtierFullBonus: Number(params.preAcceptanceCourtierFullBonus) || 0,
      preAcceptanceBankPartialBonus: Number(params.preAcceptanceBankPartialBonus) || 0,
      preAcceptanceCourtierPartialBonus: Number(params.preAcceptanceCourtierPartialBonus) || 0,
      preAcceptanceBankNoAmountBonus: Number(params.preAcceptanceBankNoAmountBonus) || 0,
      preAcceptanceCourtierNoAmountBonus: Number(params.preAcceptanceCourtierNoAmountBonus) || 0,
      preAcceptanceUnknownEmitterBonus: Number(params.preAcceptanceUnknownEmitterBonus) || 0,
      feesRate: {
        ancien: Number(params.feesRate.ancien) || 0,
        neuf: Number(params.feesRate.neuf) || 0,
        "vente sur plan": Number(params.feesRate["vente sur plan"]) || 0,
        construction: Number(params.feesRate.construction) || 0,
        "terrain + construction": Number(params.feesRate["terrain + construction"]) || 0,
      },
      scoreBuckets: params.scoreBuckets.map((bucket) => ({
        min: Number(bucket.min) || 0,
        score: Number(bucket.score) || 0,
      })),
    };

    ApiClient.put(shared.updateApi, payload).then((res) => {
      setSaving(false);
      if (res.success) {
        setParams(normalizeSettings(res.settings || payload));
      }
    });
  };

  const handleResetDefaults = () => {
    setParams(defaultParams);
  };

  return (
    <Layout>
      <Html
        loading={loading}
        saving={saving}
        params={params}
        setParams={setParams}
        handleSave={handleSave}
        handleResetDefaults={handleResetDefaults}
      />
    </Layout>
  );
};

export default ScoreParameters;
