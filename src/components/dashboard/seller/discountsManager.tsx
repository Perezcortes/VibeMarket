/**
 * SISTEMA PARA TIENDA EN LÍNEA
 * Módulo: Vista — Gestión de Cupones del Vendedor
 * Historias: US004-A | US004-B | US004-C
 * RUTA: /dashboard/seller/discounts/page.tsx
 * AUTOR (Responsable): Leonides Lopez Robles
 * COPILOTO (XP Pair): Ariadna Ramirez
 * FECHA: 2025-03-11
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { DiscountType } from "@prisma/client";
import type { CouponViewModel } from "@/presentation/seller/discounts/discounts.presenter";

// ─── Tipos locales ─────────────────────────────────────────────────
interface FormState {
  code: string;
  type: DiscountType;
  value: string;
  expires_at: string;
}

const EMPTY_FORM: FormState = {
  code: "",
  type: DiscountType.porcentaje,
  value: "",
  expires_at: "",
};

// ════════════════════════════════════════════════════════════════════
//  Page Component
// ════════════════════════════════════════════════════════════════════
export default function DiscountsPage() {
  const [coupons, setCoupons] = useState<CouponViewModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ─── Cargar cupones ──────────────────────────────────────────────
  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/seller/coupons");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setCoupons(json.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al cargar cupones.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  // ─── Crear cupón ─────────────────────────────────────────────────
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/seller/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          value: Number(form.value),
          expires_at: form.expires_at || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      setCoupons((prev) => [json.data, ...prev]);
      setForm(EMPTY_FORM);
      setSuccess("¡Cupón creado exitosamente!");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al crear el cupón.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Toggle estado (US004-C) ─────────────────────────────────────
  const handleToggle = async (coupon: CouponViewModel) => {
    try {
      const res = await fetch(`/api/seller/coupons/${coupon.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle", currentState: coupon.isActive }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? json.data : c))
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al cambiar estado.");
    }
  };

  // ════════════════════════════════════════════════════════════════
  //  Render
  // ════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* ── Encabezado ─────────────────────────────────────────────── */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          Gestión de Cupones
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Crea, activa y desactiva los cupones de tu tienda.
        </p>
      </div>

      {/* ── Alertas ────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-medium">
          <span className="material-symbols-outlined text-lg">error</span>
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl text-sm font-medium">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          {success}
        </div>
      )}

      {/* ── Formulario de creación ──────────────────────────────────── */}
      <div className="bg-white dark:bg-[#1a1010] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
        <h3 className="text-base font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">add_circle</span>
          Nuevo Cupón
        </h3>

        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Código */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Código
            </label>
            <input
              type="text"
              placeholder="Ej: VERANO20"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/30"
              required
            />
          </div>

          {/* Tipo de descuento (US004-B) */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Tipo de descuento
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as DiscountType })}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value={DiscountType.porcentaje}>Porcentaje (%)</option>
              <option value={DiscountType.monto_fijo}>Monto fijo ($)</option>
            </select>
          </div>

          {/* Valor (US004-B) */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Valor{" "}
              <span className="normal-case text-gray-400 font-normal">
                {form.type === DiscountType.porcentaje ? "(máx. 100%)" : "(monto fijo)"}
              </span>
            </label>
            <input
              type="number"
              min={1}
              max={form.type === DiscountType.porcentaje ? 100 : undefined}
              step="0.01"
              placeholder={form.type === DiscountType.porcentaje ? "15" : "50.00"}
              value={form.value}
              onChange={(e) => setForm({ ...form, value: e.target.value })}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/30"
              required
            />
          </div>

          {/* Fecha de expiración (US004-A) */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Vence el{" "}
              <span className="normal-case text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="datetime-local"
              value={form.expires_at}
              onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Botón */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl transition-all text-sm shadow-md shadow-primary/20"
            >
              <span className="material-symbols-outlined text-lg">
                {submitting ? "hourglass_empty" : "add"}
              </span>
              {submitting ? "Creando..." : "Crear Cupón"}
            </button>
          </div>
        </form>
      </div>

      {/* ── Tabla de cupones ────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#1a1010] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">confirmation_number</span>
            Mis Cupones
          </h3>
          <span className="text-xs font-bold text-gray-400">
            {coupons.length} total
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
            <span className="material-symbols-outlined animate-spin">progress_activity</span>
            <span className="text-sm font-medium">Cargando cupones...</span>
          </div>
        ) : coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-400">
            <span className="material-symbols-outlined text-4xl">confirmation_number</span>
            <p className="text-sm font-medium">Aún no tienes cupones creados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  {["Código", "Tipo", "Valor", "Vencimiento", "Creado", "Estado", "Acción"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {coupons.map((coupon) => (
                  <tr
                    key={coupon.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-black text-gray-800 dark:text-white tracking-widest">
                      {coupon.code}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{coupon.typeLabel}</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-300">
                      {coupon.valueDisplay}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      <span
                        className={
                          coupon.isExpired ? "text-red-400 font-semibold" : ""
                        }
                      >
                        {coupon.expiresLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{coupon.createdAt}</td>

                    {/* Badge de estado (US004-C) */}
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${coupon.statusColor}`}
                      >
                        {coupon.statusLabel}
                      </span>
                    </td>

                    {/* Toggle (US004-C) */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle(coupon)}
                        disabled={coupon.isExpired}
                        title={
                          coupon.isExpired
                            ? "El cupón ya venció"
                            : coupon.isActive
                            ? "Desactivar"
                            : "Activar"
                        }
                        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                          coupon.isExpired
                            ? "opacity-40 cursor-not-allowed bg-gray-100 text-gray-400"
                            : coupon.isActive
                            ? "bg-red-50 text-red-500 hover:bg-red-100"
                            : "bg-green-50 text-green-600 hover:bg-green-100"
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">
                          {coupon.isActive ? "toggle_on" : "toggle_off"}
                        </span>
                        {coupon.isActive ? "Desactivar" : "Activar"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}