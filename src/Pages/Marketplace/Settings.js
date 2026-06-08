import { useEffect, useState } from "react";
import { Form, InputNumber, Input, Button, Spin, message } from "antd";
import Layout from "../../components/global/layout";
import MarketplaceApi from "../../methods/api/marketplaceApi";

const MarketplaceSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [form] = Form.useForm();

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await MarketplaceApi.getMarketplaceSettings();
      if (response.success) {
        setSettings(response.data || {});
      } else {
        message.error(response.message || "Impossible de charger les paramètres marketplace.");
      }
    } catch (error) {
      message.error(error.message || "Erreur lors du chargement des paramètres marketplace.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Synchronise les champs du formulaire à chaque fois que settings est rechargé depuis la DB
  useEffect(() => {
    if (settings) {
      form.setFieldsValue({
        payoutDelayDays: settings.payoutDelayDays,
        vatPercent: settings.vatPercent,
        commissionPercentHT: settings.commissionPercentHT,
        maxServicesPerPro: settings.maxServicesPerPro,
        paymentInfo: settings.paymentInfo ?? '',
      });
      setIsDirty(false);
    }
  }, [settings, form]);

  const handleValuesChange = (_, allValues) => {
    if (!settings) return;
    const changed =
      allValues.payoutDelayDays !== settings.payoutDelayDays ||
      allValues.vatPercent !== settings.vatPercent ||
      allValues.commissionPercentHT !== settings.commissionPercentHT ||
      allValues.maxServicesPerPro !== settings.maxServicesPerPro ||
      (allValues.paymentInfo ?? '') !== (settings.paymentInfo ?? '');
    setIsDirty(changed);
  };

  const handleSubmit = async (values) => {
    const { payoutDelayDays, vatPercent, commissionPercentHT, maxServicesPerPro, paymentInfo } = values;

    setSaving(true);
    try {
      const response = await MarketplaceApi.updateMarketplaceSettings({
        payoutDelayDays,
        vatPercent,
        commissionPercentHT,
        maxServicesPerPro,
        paymentInfo,
      });
      if (response.success) {
        message.success("Paramètres marketplace mis à jour.");
        setIsDirty(false);
        fetchSettings();
      } else {
        message.error(response.message || "Impossible de mettre à jour les paramètres marketplace.");
      }
    } catch (error) {
      message.error(error.message || "Erreur lors de la sauvegarde des paramètres marketplace.");
    }
    setSaving(false);
  };

  return (
    <Layout>
      <div className="p-6 max-w-3xl">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-[#111827]">Paramètres marketplace</h3>
          <p className="text-sm text-[#6B7280] mt-2">
            Gérez le délai de paiement, la TVA, la marge sur le HT et le nombre de services maximum par pro.
          </p>
        </div>
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            onValuesChange={handleValuesChange}
          >
            <Form.Item
              label="Délai automatique de paiement (jours)"
              name="payoutDelayDays"
              rules={[{ required: true, message: "Entrez le délai de paiement." }]}
            >
              <InputNumber min={0} max={30} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Taux de TVA (%)"
              name="vatPercent"
              rules={[{ required: true, message: "Entrez le taux de TVA." }]}
            >
              <InputNumber min={0} max={100} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Marge Anyhomes sur le HT (%)"
              name="commissionPercentHT"
              rules={[{ required: true, message: "Entrez la commission HT." }]}
            >
              <InputNumber min={0} max={100} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Nombre maximum de services par pro"
              name="maxServicesPerPro"
              rules={[{ required: true, message: "Entrez le nombre maximum de services." }]}
            >
              <InputNumber min={1} max={100} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              label="Facturation et paiement : votre argent est en sécurité (texte affiché sur chaque service)"
              name="paymentInfo"
              rules={[{ required: true, message: "Entrez le texte de facturation." }]}
              extra={"Ce texte s'affiche dans la section \"Facturation et paiement\" de chaque service sur la marketplace."}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={saving} disabled={!isDirty}>
                Enregistrer les paramètres
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </div>
    </Layout>
  );
};

export default MarketplaceSettings;
