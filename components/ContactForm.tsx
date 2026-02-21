"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContactSchema, type ContactInput } from "@/lib/schemas/contact";
import { useTranslations } from "@/lib/use-translations";
import {
  FaPaperPlane,
  FaCheck,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaTag,
  FaCommentDots,
} from "react-icons/fa";

interface ContactFormProps {
  locale?: "pt" | "en";
}

export default function ContactForm({ locale = "pt" }: ContactFormProps) {
  const t = useTranslations(locale);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      locale,
    },
  });

  const labels = {
    name: locale === "pt" ? "Nome" : "Name",
    email: "Email",
    subject: locale === "pt" ? "Assunto" : "Subject",
    message: locale === "pt" ? "Mensagem" : "Message",
    namePlaceholder: locale === "pt" ? "O teu nome..." : "Your name...",
    emailPlaceholder: locale === "pt" ? "O teu email..." : "Your email...",
    subjectPlaceholder:
      locale === "pt"
        ? "Ex: Parceria, Sugestão, Feedback..."
        : "E.g.: Partnership, Suggestion, Feedback...",
    messagePlaceholder:
      locale === "pt"
        ? "Escreve a tua mensagem aqui..."
        : "Write your message here...",
    submit: locale === "pt" ? "Enviar Mensagem" : "Send Message",
    sending: locale === "pt" ? "A enviar..." : "Sending...",
    success:
      locale === "pt"
        ? "Mensagem enviada com sucesso! Respondemos em breve."
        : "Message sent successfully! We'll get back to you soon.",
    error:
      locale === "pt"
        ? "Erro ao enviar. Tenta novamente."
        : "Error sending. Please try again.",
    rateLimited:
      locale === "pt"
        ? "Muitos pedidos. Espera um momento."
        : "Too many requests. Please wait.",
  };

  const onSubmit = async (data: ContactInput) => {
    setStatus("loading");
    setErrorMsg("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("success");
        reset();
        setTimeout(() => setStatus("idle"), 8000);
      } else {
        setStatus("error");
        if (result.error === "RATE_LIMITED") {
          setErrorMsg(labels.rateLimited);
        } else {
          setErrorMsg(result.message || labels.error);
        }
      }
    } catch {
      setStatus("error");
      setErrorMsg(labels.error);
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-green-900/20 border border-green-600/40 rounded-2xl p-8 text-center animate-fade-in-up"
      >
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCheck className="text-green-400 text-2xl" />
        </div>
        <h3 className="text-xl font-bold text-green-300 mb-2">
          {locale === "pt" ? "Mensagem Enviada!" : "Message Sent!"}
        </h3>
        <p className="text-green-300/80 text-sm">{labels.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Name */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-brand-grey-light mb-2">
          <FaUser className="text-brand-red" size={12} />
          {labels.name}
        </label>
        <input
          type="text"
          placeholder={labels.namePlaceholder}
          disabled={status === "loading"}
          {...register("name")}
          aria-invalid={!!errors.name}
          className="w-full px-4 py-3 rounded-xl bg-brand-black text-white border border-brand-grey-dark/60 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20 disabled:opacity-50 transition-all placeholder:text-brand-grey/50"
        />
        {errors.name && (
          <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-brand-grey-light mb-2">
          <FaEnvelope className="text-brand-red" size={12} />
          {labels.email}
        </label>
        <input
          type="email"
          placeholder={labels.emailPlaceholder}
          disabled={status === "loading"}
          {...register("email")}
          aria-invalid={!!errors.email}
          className="w-full px-4 py-3 rounded-xl bg-brand-black text-white border border-brand-grey-dark/60 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20 disabled:opacity-50 transition-all placeholder:text-brand-grey/50"
        />
        {errors.email && (
          <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>
        )}
      </div>

      {/* Subject */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-brand-grey-light mb-2">
          <FaTag className="text-brand-red" size={12} />
          {labels.subject}
        </label>
        <input
          type="text"
          placeholder={labels.subjectPlaceholder}
          disabled={status === "loading"}
          {...register("subject")}
          aria-invalid={!!errors.subject}
          className="w-full px-4 py-3 rounded-xl bg-brand-black text-white border border-brand-grey-dark/60 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20 disabled:opacity-50 transition-all placeholder:text-brand-grey/50"
        />
        {errors.subject && (
          <p className="text-red-400 text-xs mt-1.5">
            {errors.subject.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-brand-grey-light mb-2">
          <FaCommentDots className="text-brand-red" size={12} />
          {labels.message}
        </label>
        <textarea
          placeholder={labels.messagePlaceholder}
          disabled={status === "loading"}
          rows={5}
          {...register("message")}
          aria-invalid={!!errors.message}
          className="w-full px-4 py-3 rounded-xl bg-brand-black text-white border border-brand-grey-dark/60 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20 disabled:opacity-50 transition-all resize-y min-h-[120px] placeholder:text-brand-grey/50"
        />
        {errors.message && (
          <p className="text-red-400 text-xs mt-1.5">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-base py-4"
      >
        {status === "loading" ? (
          <>
            <span className="animate-spin">⏳</span> {labels.sending}
          </>
        ) : (
          <>
            <FaPaperPlane /> {labels.submit}
          </>
        )}
      </button>

      {/* Error State */}
      {status === "error" && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-4 bg-red-900/20 border border-red-600/40 rounded-xl text-red-300 text-sm flex items-center gap-2"
        >
          <FaTimes className="flex-shrink-0" />
          {errorMsg}
        </div>
      )}
    </form>
  );
}
