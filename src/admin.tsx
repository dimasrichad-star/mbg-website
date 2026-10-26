
import { useEffect, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";

type Schedule = {
  id: string;
  event_name: string;
  event_date: string;
  start_time: string;
  venue: string;
  city: string;
  tag: string;
  description: string;
};

type Photo = {
  id: string;
  title: string;
  image_path: string;
  alt_text: string;
  sort_order: number;
};

const emptySchedule = {
  event_name: "",
  event_date: "",
  start_time: "19:00",
  venue: "",
  city: "Bogor",
  tag: "EVENT",
  description: "",
};

const inputClass =
  "w-full rounded border border-white/20 bg-[#080d60] p-3 text-white outline-none focus:border-[#d4ff00]";

const buttonClass =
  "rounded border border-[#d4ff00]/50 px-4 py-2 text-sm font-semibold text-[#d4ff00] hover:bg-[#d4ff00] hover:text-[#080d60] disabled:opacity-50";

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [scheduleForm, setScheduleForm] = useState(emptySchedule);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [photoTitle, setPhotoTitle] = useState("");
  const [photoAlt, setPhotoAlt] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setAuthChecked(true);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let active = true;

    async function verifyAdmin() {
      setIsAdmin(false);
      if (!user) return;

      const { data, error } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!active) return;

      if (error) {
        setMessage("Gagal memeriksa hak admin: " + error.message);
        return;
      }

      if (!data) {
        setMessage("Akun ini tidak memiliki izin admin.");
        return;
      }

      setIsAdmin(true);
      setMessage("");
    }

    void verifyAdmin();
    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    if (isAdmin) void loadContent();
  }, [isAdmin]);

  async function loadContent() {
    const [scheduleResult, photoResult] = await Promise.all([
      supabase
        .from("schedules")
        .select("*")
        .order("event_date", { ascending: true }),
      supabase
        .from("gallery")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false }),
    ]);

    if (scheduleResult.error || photoResult.error) {
      setMessage(
        scheduleResult.error?.message ??
          photoResult.error?.message ??
          "Gagal memuat data."
      );
      return;
    }

    setSchedules((scheduleResult.data ?? []) as Schedule[]);
    setPhotos((photoResult.data ?? []) as Photo[]);
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setBusy(false);
    if (error) setMessage(error.message);
  }

  async function logout() {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setMessage("");
  }

  function editSchedule(item: Schedule) {
    setEditingId(item.id);
    setScheduleForm({
      event_name: item.event_name,
      event_date: item.event_date,
      start_time: item.start_time,
      venue: item.venue,
      city: item.city,
      tag: item.tag,
      description: item.description,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function saveSchedule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    const result = editingId
      ? await supabase
          .from("schedules")
          .update({ ...scheduleForm, updated_at: new Date().toISOString() })
          .eq("id", editingId)
      : await supabase.from("schedules").insert(scheduleForm);

    setBusy(false);

    if (result.error) {
      setMessage("Gagal menyimpan jadwal: " + result.error.message);
      return;
    }

    setScheduleForm(emptySchedule);
    setEditingId(null);
    setMessage("Jadwal berhasil disimpan.");
    await loadContent();
  }

  async function deleteSchedule(id: string) {
    if (!window.confirm("Hapus jadwal ini?")) return;

    const { error } = await supabase.from("schedules").delete().eq("id", id);

    if (error) {
      setMessage("Gagal menghapus jadwal: " + error.message);
      return;
    }

    setMessage("Jadwal berhasil dihapus.");
    await loadContent();
  }

  async function uploadPhoto(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!photoFile) {
      setMessage("Pilih foto terlebih dahulu.");
      return;
    }

    if (!photoFile.type.startsWith("image/")) {
      setMessage("File harus berupa gambar.");
      return;
    }

    if (photoFile.size > 5 * 1024 * 1024) {
      setMessage("Ukuran foto maksimal 5 MB.");
      return;
    }

    
setBusy(true);
setMessage("");

const extension = photoFile.name.split(".").pop()?.toLowerCase() || "jpg";
const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

const { error: uploadError } = await supabase.storage
  .from("mbg-gallery")
  .upload(path, photoFile, {
    cacheControl: "3600",
    contentType: photoFile.type,
    upsert: false,
  });

if (uploadError) {
  setBusy(false);
  setMessage("Upload gagal: " + uploadError.message);
  return;
}


    const { error: insertError } = await supabase.from("gallery").insert({
      title: photoTitle.trim(),
      image_path: path,
      alt_text: photoAlt.trim(),
      sort_order: photos.length,
    });

    if (insertError) {
      // Bersihkan file jika penyimpanan metadata gagal.
      await supabase.storage.from("mbg-gallery").remove([path]);
      setBusy(false);
      setMessage("Gagal menyimpan data foto: " + insertError.message);
      return;
    }

    setPhotoFile(null);
    setPhotoTitle("");
    setPhotoAlt("");
    const fileInput = document.getElementById("photo-file") as HTMLInputElement;
    if (fileInput) fileInput.value = "";

    setBusy(false);
    setMessage("Foto berhasil diunggah.");
    await loadContent();
  }

  async function savePhoto(item: Photo) {
    const title = window.prompt("Judul foto:", item.title);
    if (title === null) return;

    const alt = window.prompt("Deskripsi alt foto:", item.alt_text);
    if (alt === null) return;

    const { error } = await supabase
      .from("gallery")
      .update({ title: title.trim(), alt_text: alt.trim() })
      .eq("id", item.id);

    if (error) {
      setMessage("Gagal mengedit foto: " + error.message);
      return;
    }

    setMessage("Keterangan foto berhasil diperbarui.");
    await loadContent();
  }

  async function deletePhoto(item: Photo) {
    if (!window.confirm("Hapus foto ini dari galeri?")) return;

    // Hapus file lebih dahulu. Jika gagal, metadata tidak dihapus.
    const { error: fileError } = await supabase.storage
      .from("mbg-gallery")
      .remove([item.image_path]);

    if (fileError) {
      setMessage("Gagal menghapus file: " + fileError.message);
      return;
    }

    const { error } = await supabase
      .from("gallery")
      .delete()
      .eq("id", item.id);

    if (error) {
      setMessage("File terhapus, tetapi data foto gagal dihapus: " + error.message);
      return;
    }

    setMessage("Foto berhasil dihapus.");
    await loadContent();
  }

  function photoUrl(path: string) {
    return supabase.storage.from("mbg-gallery").getPublicUrl(path).data.publicUrl;
  }

  if (!authChecked) {
    return <main className="min-h-screen bg-[#0f1480] p-8 text-white">Memuat...</main>;
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0f1480] p-6 text-white">
        <form onSubmit={login} className="w-full max-w-md space-y-4 rounded-xl border border-[#d4ff00]/30 bg-[#080d60] p-8">
          <p className="text-sm tracking-[0.3em] text-[#d4ff00]">MBG CONTROL PANEL</p>
          <h1 className="text-3xl font-bold">Admin Login</h1>
          <label className="block space-y-2">
            <span>Email</span>
            <input className={inputClass} type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="block space-y-2">
            <span>Password</span>
            <input className={inputClass} type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {message && <p role="alert" className="text-sm text-red-300">{message}</p>}
          <button className={buttonClass} disabled={busy} type="submit">
            {busy ? "Memproses..." : "Login"}
          </button>
        </form>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-[#0f1480] p-8 text-white">
        <p>{message || "Memeriksa hak akses admin..."}</p>
        <button className={buttonClass} onClick={logout}>Keluar</button>
      </main>
    );
  }

  return (
    <main className="min-h-screen space-y-10 bg-[#0f1480] p-5 text-white md:p-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm tracking-[0.3em] text-[#d4ff00]">MBG CONTROL PANEL</p>
          <h1 className="text-3xl font-bold">Dashboard Admin</h1>
          <p className="text-sm text-white/60">{user.email}</p>
        </div>
        <button className={buttonClass} onClick={logout}>Logout</button>
      </header>

      {message && <p role="status" className="rounded border border-white/20 p-3">{message}</p>}

      <section className="space-y-4 rounded-xl border border-[#d4ff00]/25 bg-[#080d60]/70 p-5">
        <h2 className="text-2xl font-bold text-[#d4ff00]">
          {editingId ? "Edit Jadwal" : "Tambah Jadwal"}
        </h2>

        <form onSubmit={saveSchedule} className="grid gap-4 md:grid-cols-2">
          <input className={inputClass} placeholder="Nama acara" required value={scheduleForm.event_name} onChange={(e) => setScheduleForm({ ...scheduleForm, event_name: e.target.value })} />
          <label className="space-y-1">
            <span className="text-sm">Tanggal acara</span>
            <input className={inputClass} type="date" required value={scheduleForm.event_date} onChange={(e) => setScheduleForm({ ...scheduleForm, event_date: e.target.value })} />
          </label>
          <input className={inputClass} placeholder="Jam, contoh 19:00 – selesai" required value={scheduleForm.start_time} onChange={(e) => setScheduleForm({ ...scheduleForm, start_time: e.target.value })} />
          <input className={inputClass} placeholder="Lokasi / venue" required value={scheduleForm.venue} onChange={(e) => setScheduleForm({ ...scheduleForm, venue: e.target.value })} />
          <input className={inputClass} placeholder="Kota" required value={scheduleForm.city} onChange={(e) => setScheduleForm({ ...scheduleForm, city: e.target.value })} />
          <select className={inputClass} value={scheduleForm.tag} onChange={(e) => setScheduleForm({ ...scheduleForm, tag: e.target.value })}>
            <option value="EVENT">EVENT</option>
            <option value="FESTIVAL">FESTIVAL</option>
            <option value="PRIVATE">PRIVATE</option>
          </select>
          <textarea className={`${inputClass} md:col-span-2`} placeholder="Deskripsi acara (opsional)" rows={3} value={scheduleForm.description} onChange={(e) => setScheduleForm({ ...scheduleForm, description: e.target.value })} />
          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button className={buttonClass} disabled={busy} type="submit">{busy ? "Menyimpan..." : "Simpan Jadwal"}</button>
            {editingId && <button className={buttonClass} type="button" onClick={() => { setEditingId(null); setScheduleForm(emptySchedule); }}>Batal Edit</button>}
          </div>
        </form>

        <div className="space-y-3">
          {schedules.map((item) => (
            <article key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded border border-white/10 p-4">
              <div>
                <h3 className="font-bold">{item.event_name}</h3>
                <p className="text-sm text-white/60">{item.event_date} · {item.start_time} · {item.venue}, {item.city}</p>
              </div>
              <div className="flex gap-2">
                <button className={buttonClass} onClick={() => editSchedule(item)}>Edit</button>
                <button className={buttonClass} onClick={() => void deleteSchedule(item.id)}>Hapus</button>
              </div>
            </article>
          ))}
          {schedules.length === 0 && <p className="text-white/60">Belum ada jadwal.</p>}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-[#d4ff00]/25 bg-[#080d60]/70 p-5">
        <h2 className="text-2xl font-bold text-[#d4ff00]">Kelola Galeri</h2>

        <form onSubmit={uploadPhoto} className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm">File foto (maks. 5 MB)</span>
            <input id="photo-file" className={inputClass} type="file" accept="image/*" required onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)} />
          </label>
          <input className={inputClass} placeholder="Judul foto" value={photoTitle} onChange={(e) => setPhotoTitle(e.target.value)} />
          <input className={`${inputClass} md:col-span-2`} placeholder="Alt text / deskripsi gambar" value={photoAlt} onChange={(e) => setPhotoAlt(e.target.value)} />
          <button className={buttonClass} disabled={busy} type="submit">{busy ? "Mengunggah..." : "Upload Foto"}</button>
        </form>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map((item) => (
            <article key={item.id} className="overflow-hidden rounded border border-white/10">
              <img src={photoUrl(item.image_path)} alt={item.alt_text} className="h-48 w-full object-cover" loading="lazy" />
              <div className="space-y-3 p-3">
                <p className="font-semibold">{item.title || "Tanpa judul"}</p>
                <p className="text-xs text-white/60">{item.alt_text}</p>
                <div className="flex flex-wrap gap-2">
                  <button className={buttonClass} onClick={() => void savePhoto(item)}>Edit Keterangan</button>
                  <button className={buttonClass} onClick={() => void deletePhoto(item)}>Hapus Foto</button>
                </div>
              </div>
            </article>
          ))}
          {photos.length === 0 && <p className="text-white/60">Belum ada foto.</p>}
        </div>
      </section>
    </main>
  );
}
