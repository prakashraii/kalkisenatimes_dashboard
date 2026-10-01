"use client";

import PageHeader from "@/components/PageHeader";
import { useToast } from "@/components/Toast";
import { api } from "@/lib/api";
import { readImageFile } from "@/lib/format";
import { ghostButtonClass, inputClass, primaryButtonClass } from "@/lib/ui";
import { useEffect, useState } from "react";

const GENDERS = ["Male", "Female", "Other"];

export default function ProfilePage() {
  const showToast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    gender: "",
    profileImage: "",
  });
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) throw new Error("User id not found. Log in again.");
        const data = await api(`/user/${userId}`);
        if (!active) return;
        const user = data.result || {};
        setProfile(user);
        setForm({
          name: user.name || "",
          phone: user.phone ?? "",
          address: user.address || "",
          gender: user.gender || "",
          profileImage: user.profileImage || "",
        });
      } catch (error) {
        if (active) showToast(error.message, "error");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [showToast]);

  const setField = (name, value) => setForm((current) => ({ ...current, [name]: value }));

  const onAvatar = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const dataUrl = await readImageFile(file);
      setField("profileImage", dataUrl);
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    if (!profile?._id) return;
    setSaving(true);
    try {
      const phoneText = String(form.phone).trim();
      const phoneNumber = Number(phoneText);
      const data = await api(`/user/${profile._id}`, {
        method: "PATCH",
        body: {
          name: form.name,
          address: form.address,
          gender: form.gender,
          ...(phoneText && Number.isFinite(phoneNumber) ? { phone: phoneNumber } : {}),
          ...(form.profileImage ? { profileImage: form.profileImage } : {}),
        },
      });
      setProfile(data.result || { ...profile, ...form });
      showToast("Profile updated");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (event) => {
    event.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword) {
      showToast("Current password and new password are required", "error");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }
    setChangingPassword(true);
    try {
      await api("/user/change_pwd", {
        method: "POST",
        body: {
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
      });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showToast("Password changed");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="mb-3 space-y-2">
          <span className="block h-5 w-24 animate-pulse rounded bg-neutral-200" />
          <span className="block h-4 w-56 animate-pulse rounded bg-neutral-200" />
        </div>
        <div className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <span className="h-14 w-14 animate-pulse rounded-full bg-neutral-200" />
            <span className="h-8 w-40 animate-pulse rounded bg-neutral-200" />
          </div>
          {Array.from({ length: 4 }, (_, index) => (
            <span key={index} className="block h-8 animate-pulse rounded bg-neutral-200" />
          ))}
        </div>
      </div>
    );
  }

  const genderOptions = GENDERS.includes(form.gender) || !form.gender
    ? GENDERS
    : [form.gender, ...GENDERS];

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Profile" description="Update your account details." />

      <form onSubmit={saveProfile} className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
        <div className="flex items-center gap-3">
          {form.profileImage ? (
            <img src={form.profileImage} alt="" className="h-14 w-14 rounded-full object-cover" />
          ) : (
            <span className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {(form.name || "A").slice(0, 1).toUpperCase()}
            </span>
          )}
          <label className="text-sm">
            <span className="mb-1 block text-xs font-medium text-neutral-600">Profile image</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={onAvatar}
              className="text-xs"
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-600">Name</span>
          <input value={form.name} onChange={(event) => setField("name", event.target.value)} className={inputClass} />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-600">Email</span>
          <input value={profile?.email || ""} readOnly className={`${inputClass} bg-neutral-50 text-neutral-500`} />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-neutral-600">Phone</span>
            <input value={form.phone} onChange={(event) => setField("phone", event.target.value)} className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-neutral-600">Gender</span>
            <select value={form.gender} onChange={(event) => setField("gender", event.target.value)} className={inputClass}>
              <option value="">Select</option>
              {genderOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-600">Address</span>
          <input value={form.address} onChange={(event) => setField("address", event.target.value)} className={inputClass} />
        </label>

        <p className="text-xs text-neutral-500">Role: {profile?.role || "—"}</p>

        <div className="flex justify-end">
          <button type="submit" disabled={saving} className={primaryButtonClass}>
            {saving ? "Saving…" : "Save profile"}
          </button>
        </div>
      </form>

      <form onSubmit={changePassword} className="mt-4 space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
        <h2 className="text-sm font-semibold text-neutral-900">Change password</h2>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-600">Current password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={passwords.currentPassword}
            onChange={(event) => setPasswords((current) => ({ ...current, currentPassword: event.target.value }))}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-600">New password</span>
          <input
            type="password"
            autoComplete="new-password"
            value={passwords.newPassword}
            onChange={(event) => setPasswords((current) => ({ ...current, newPassword: event.target.value }))}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-neutral-600">Confirm new password</span>
          <input
            type="password"
            autoComplete="new-password"
            value={passwords.confirmPassword}
            onChange={(event) => setPasswords((current) => ({ ...current, confirmPassword: event.target.value }))}
            className={inputClass}
          />
        </label>
        <div className="flex justify-end">
          <button type="submit" disabled={changingPassword} className={ghostButtonClass}>
            {changingPassword ? "Updating…" : "Update password"}
          </button>
        </div>
      </form>
    </div>
  );
}
