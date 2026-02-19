"use client";

import { FormEvent, useMemo, useState } from "react";
import { useTranslations } from "@/lib/use-translations";

type FormState = {
  name: string;
  email: string;
  company: string;
  website: string;
  category: "events" | "guides" | "transfers" | "brand";
  budget: "under_500" | "500_2000" | "2000_plus" | "unknown";
  message: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  company: "",
  website: "",
  category: "events",
  budget: "unknown",
  message: "",
};

interface PromoterLeadFormProps {
  locale?: "pt" | "en";
}

export default function PromoterLeadForm({
  locale = "pt",
}: PromoterLeadFormProps) {
  const t = useTranslations(locale);
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [feedback, setFeedback] = useState<string>("");

  const categoryOptions = useMemo(
    () => [
      { value: "events", label: t("partners.form.category_events", "Eventos") },
      {
        value: "guides",
        label: t("partners.form.category_guides", "Guias Privados"),
      },
      {
        value: "transfers",
        label: t("partners.form.category_transfers", "Transfers"),
      },
      { value: "brand", label: t("partners.form.category_brand", "Marca") },
    ],
    [t],
  );

  const budgetOptions = useMemo(
    () => [
      {
        value: "under_500",
        label: t("partners.form.budget_under_500", "Até 500€"),
      },
      {
        value: "500_2000",
        label: t("partners.form.budget_500_2000", "500€ - 2000€"),
      },
      {
        value: "2000_plus",
        label: t("partners.form.budget_2000_plus", "Mais de 2000€"),
      },
      {
        value: "unknown",
        label: t("partners.form.budget_unknown", "A definir"),
      },
    ],
    [t],
  );

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");

    try {
      const response = await fetch("/api/promoters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setFeedback(
          data?.message || t("partners.form.error", "Erro ao enviar."),
        );
        return;
      }

      setStatus("success");
      setFeedback(
        data?.message ||
          t(
            "partners.form.success",
            "Pedido enviado com sucesso. Vamos contactar-te em breve.",
          ),
      );
      setForm(initialForm);
    } catch {
      setStatus("error");
      setFeedback(t("partners.form.error", "Erro ao enviar."));
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-brand-black-light border border-brand-grey-dark/40 rounded-2xl p-6 md:p-8 space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          required
          placeholder={t("partners.form.name", "Nome")}
          value={form.name}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, name: e.target.value }))
          }
          disabled={status === "loading"}
          className="w-full px-4 py-3 rounded-lg bg-brand-black text-white border border-brand-grey focus:border-brand-red focus:outline-none"
        />

        <input
          type="email"
          required
          placeholder={t("partners.form.email", "Email")}
          value={form.email}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, email: e.target.value }))
          }
          disabled={status === "loading"}
          className="w-full px-4 py-3 rounded-lg bg-brand-black text-white border border-brand-grey focus:border-brand-red focus:outline-none"
        />

        <input
          type="text"
          required
          placeholder={t("partners.form.company", "Empresa / Marca")}
          value={form.company}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, company: e.target.value }))
          }
          disabled={status === "loading"}
          className="w-full px-4 py-3 rounded-lg bg-brand-black text-white border border-brand-grey focus:border-brand-red focus:outline-none"
        />

        <input
          type="url"
          placeholder={t("partners.form.website", "Website (opcional)")}
          value={form.website}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, website: e.target.value }))
          }
          disabled={status === "loading"}
          className="w-full px-4 py-3 rounded-lg bg-brand-black text-white border border-brand-grey focus:border-brand-red focus:outline-none"
        />

        <select
          value={form.category}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              category: e.target.value as FormState["category"],
            }))
          }
          disabled={status === "loading"}
          className="w-full px-4 py-3 rounded-lg bg-brand-black text-white border border-brand-grey focus:border-brand-red focus:outline-none"
        >
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={form.budget}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              budget: e.target.value as FormState["budget"],
            }))
          }
          disabled={status === "loading"}
          className="w-full px-4 py-3 rounded-lg bg-brand-black text-white border border-brand-grey focus:border-brand-red focus:outline-none"
        >
          {budgetOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <textarea
        required
        rows={5}
        placeholder={t(
          "partners.form.message",
          "Descreve o teu evento/serviço e objetivo de parceria.",
        )}
        value={form.message}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, message: e.target.value }))
        }
        disabled={status === "loading"}
        className="w-full px-4 py-3 rounded-lg bg-brand-black text-white border border-brand-grey focus:border-brand-red focus:outline-none"
      />

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "loading"
          ? t("partners.form.sending", "A enviar...")
          : t("partners.form.submit", "Enviar pedido de parceria")}
      </button>

      {feedback && (
        <p
          role={status === "error" ? "alert" : "status"}
          className={
            status === "error"
              ? "text-red-400 text-sm"
              : "text-green-400 text-sm"
          }
        >
          {feedback}
        </p>
      )}
    </form>
  );
}
