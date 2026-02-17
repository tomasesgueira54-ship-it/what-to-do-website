"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubscribeSchema, type SubscribeInput } from "@/lib/schemas/subscribe";
import { FaEnvelope, FaCheck, FaTimes } from "react-icons/fa";

interface SubscribeFormProps {
  locale?: "pt" | "en";
  variant?: "default" | "compact" | "footer";
  onSuccess?: () => void;
}

const translations = {
  pt: {
    namePlaceholder: "Seu nome...",
    placeholder: "Seu email...",
    consentLabel: "Concordo em receber comunicações por email.",
    button: "Subscrever",
    success: "Obrigado! Verifica o teu email.",
    error: "Erro ao subscrever. Tenta novamente.",
    already: "Este email já está subscrito.",
  },
  en: {
    namePlaceholder: "Your name...",
    placeholder: "Your email...",
    consentLabel: "I agree to receive communications by email.",
    button: "Subscribe",
    success: "Thank you! Check your email.",
    error: "Error subscribing. Try again.",
    already: "This email is already subscribed.",
  },
};

export default function SubscribeForm({
  locale = "pt",
  variant = "default",
  onSuccess,
}: SubscribeFormProps) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubscribeInput>({
    resolver: zodResolver(SubscribeSchema),
    defaultValues: {
      name: "",
      gdprConsent: false,
      subject: "newsletter",
      locale,
    },
  });

  const onSubmit = async (data: SubscribeInput) => {
    setStatus("loading");
    setErrorMsg("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("success");
        reset();
        onSuccess?.();
        // Reset success message after 5s
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        if (result.error === "ALREADY_SUBSCRIBED") {
          setErrorMsg(translations[locale].already);
        } else {
          setErrorMsg(result.message || translations[locale].error);
        }
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg(translations[locale].error);
      console.error("Subscribe error:", err);
    }
  };

  const isCompact = variant === "compact";
  const isFooter = variant === "footer";

  if (variant === "footer") {
    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-2"
      >
        <input
          type="text"
          placeholder={translations[locale].namePlaceholder}
          disabled={status === "loading" || status === "success"}
          {...register("name")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "subscribe-name-error" : undefined}
          className="px-4 py-2 rounded bg-brand-black text-white border border-brand-grey focus:border-brand-red focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {errors.name && (
          <p id="subscribe-name-error" className="text-red-500 text-xs">{errors.name.message}</p>
        )}

        <input
          type="email"
          placeholder={translations[locale].placeholder}
          disabled={status === "loading" || status === "success"}
          {...register("email")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "subscribe-email-error" : undefined}
          className="px-4 py-2 rounded bg-brand-black text-white border border-brand-grey focus:border-brand-red focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {errors.email && (
          <p id="subscribe-email-error" className="text-red-500 text-xs">{errors.email.message}</p>
        )}

        <label className="text-xs text-brand-grey flex items-start gap-2">
          <input
            type="checkbox"
            disabled={status === "loading" || status === "success"}
            {...register("gdprConsent")}
            aria-invalid={!!errors.gdprConsent}
            aria-describedby={errors.gdprConsent ? "subscribe-consent-error" : undefined}
            className="mt-0.5"
          />
          <span>{translations[locale].consentLabel}</span>
        </label>
        {errors.gdprConsent && (
          <p id="subscribe-consent-error" className="text-red-500 text-xs">{errors.gdprConsent.message}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" && <span className="animate-spin">⏳</span>}
          {status === "success" && <FaCheck />}
          {status === "error" && <FaTimes />}
          {status !== "success"
            ? translations[locale].button
            : "✓ " + translations[locale].success}
        </button>

        {status === "error" && (
          <p role="alert" aria-live="assertive" className="text-red-500 text-xs">{errorMsg}</p>
        )}

        <div className="sr-only" aria-live="polite">
          {status === "success" ? translations[locale].success : ""}
        </div>
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={isCompact ? "flex gap-2" : "flex flex-col gap-4"}
    >
      <div className={isCompact ? "flex flex-1" : ""}>
        <div className={isCompact ? "flex-1" : ""}>
          <input
            type="text"
            placeholder={translations[locale].namePlaceholder}
            disabled={status === "loading" || status === "success"}
            {...register("name")}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "subscribe-name-error-main" : undefined}
            className={`
              w-full px-4 py-3 rounded-lg bg-brand-black text-white 
              border border-brand-grey focus:border-brand-red focus:outline-none 
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors mb-2
            `}
          />
          {errors.name && (
            <p id="subscribe-name-error-main" className="text-red-500 text-sm mt-1 mb-2">
              {errors.name.message}
            </p>
          )}

          <input
            type="email"
            placeholder={translations[locale].placeholder}
            disabled={status === "loading" || status === "success"}
            {...register("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "subscribe-email-error-main" : undefined}
            className={`
              w-full px-4 py-3 rounded-lg bg-brand-black text-white 
              border border-brand-grey focus:border-brand-red focus:outline-none 
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            `}
          />
          {errors.email && (
            <p id="subscribe-email-error-main" className="text-red-500 text-sm mt-2">{errors.email.message}</p>
          )}

          <label className="text-sm text-brand-grey flex items-start gap-2 mt-3">
            <input
              type="checkbox"
              disabled={status === "loading" || status === "success"}
              {...register("gdprConsent")}
              aria-invalid={!!errors.gdprConsent}
              aria-describedby={errors.gdprConsent ? "subscribe-consent-error-main" : undefined}
              className="mt-1"
            />
            <span>{translations[locale].consentLabel}</span>
          </label>
          {errors.gdprConsent && (
            <p id="subscribe-consent-error-main" className="text-red-500 text-sm mt-2">
              {errors.gdprConsent.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className={`
            ${isCompact ? "px-6 ml-2" : "w-full mt-3"}
            btn-primary flex items-center justify-center gap-2 
            disabled:opacity-50 disabled:cursor-not-allowed transition-all
          `}
        >
          {status === "loading" && <span className="animate-spin">⏳</span>}
          {status === "success" && <FaCheck />}
          {status === "error" && <FaTimes />}
          {status === "success" ? "✓" : translations[locale].button}
        </button>
      </div>

      {status === "success" && (
        <div role="status" aria-live="polite" className="p-3 bg-green-900/20 border border-green-600 rounded text-green-300 text-sm">
          ✓ {translations[locale].success}
        </div>
      )}

      {status === "error" && (
        <div role="alert" aria-live="assertive" className="p-3 bg-red-900/20 border border-red-600 rounded text-red-300 text-sm">
          ✗ {errorMsg}
        </div>
      )}
    </form>
  );
}
