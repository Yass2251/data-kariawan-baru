// Data awal pegawai baru - 5 contoh
const dataAwal = [
  {
    id: 1,
    nama: "Andi Saputra",
    nik: "3201011234560001",
    jenisKelamin: "Laki-laki",
    tempatLahir: "Bandung",
    tanggalLahir: "1998-05-12",
    alamat: "Jl. Coklat No. 10, Bandung",
    hp: "081234567801",
    email: "andi.saputra@coklatnusantara.id",
    jabatan: "Staff Produksi",
    departemen: "Produksi",
    tanggal: "2024-03-15",
    status: "Baru"
  },
  {
    id: 2,
    nama: "Siti Aisyah",
    nik: "3201011234560002",
    jenisKelamin: "Perempuan",
    tempatLahir: "Jakarta",
    tanggalLahir: "1999-08-20",
    alamat: "Jl. Kakao No. 5, Jakarta",
    hp: "081234567802",
    email: "siti.aisyah@coklatnusantara.id",
    jabatan: "Staff Administrasi",
    departemen: "HRD",
    tanggal: "2024-02-10",
    status: "Aktif"
  },
  {
    id: 3,
    nama: "Rizky Maulana",
    nik: "3201011234560003",
    jenisKelamin: "Laki-laki",
    tempatLahir: "Surabaya",
    tanggalLahir: "2000-01-18",
    alamat: "Jl. Mawar No. 12, Surabaya",
    hp: "081234567803",
    email: "rizky.maulana@coklatnusantara.id",
    jabatan: "Quality Control",
    departemen: "Produksi",
    tanggal: "2024-04-01",
    status: "Kontrak"
  },
  {
    id: 4,
    nama: "Dinda Permata",
    nik: "3201011234560004",
    jenisKelamin: "Perempuan",
    tempatLahir: "Yogyakarta",
    tanggalLahir: "1997-11-05",
    alamat: "Jl. Kenanga No. 8, Yogyakarta",
    hp: "081234567804",
    email: "dinda.permata@coklatnusantara.id",
    jabatan: "Staff Keuangan",
    departemen: "Finance",
    tanggal: "2023-12-01",
    status: "Aktif"
  },
  {
    id: 5,
    nama: "Fajar Ramadhan",
    nik: "3201011234560005",
    jenisKelamin: "Laki-laki",
    tempatLahir: "Medan",
    tanggalLahir: "2001-06-22",
    alamat: "Jl. Melati No. 3, Medan",
    hp: "081234567805",
    email: "fajar.ramadhan@coklatnusantara.id",
    jabatan: "Marketing",
    departemen: "Marketing",
    tanggal: "2024-05-20",
    status: "Magang"
  }
];

const STORAGE_KEY = "pegawai_coklat_nusantara";

let pegawai = [];
let editId = null;
let hapusId = null;

const tableBody = document.getElementById("tableBody");
const emptyState = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const filterStatus = document.getElementById("filterStatus");
const modal = document.getElementById("modal");
const modalHapus = document.getElementById("modalHapus");
const modalDetail = document.getElementById("modalDetail");
const form = document.getElementById("formPegawai");
const modalTitle = document.getElementById("modalTitle");

// Load data dari LocalStorage, kalau kosong pakai data awal
// Jika data lama tidak punya field baru, tambahkan default agar tetap kompatibel
function loadData() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      pegawai = JSON.parse(data);
      // migrasi data lama yang belum punya field baru
      pegawai = pegawai.map(p => ({
        jenisKelamin: p.jenisKelamin || "Laki-laki",
        tempatLahir: p.tempatLahir || "-",
        tanggalLahir: p.tanggalLahir || p.tanggal || "2000-01-01",
        alamat: p.alamat || "-",
        ...p
      }));
      // jika status lama tidak ada "Baru", biarkan tetap
    } catch (e) {
      pegawai = dataAwal;
      saveData();
    }
    // jika kosong setelah migrasi
    if (!Array.isArray(pegawai) || pegawai.length === 0) {
      pegawai = dataAwal;
      saveData();
    }
  } else {
    pegawai = dataAwal;
    saveData();
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pegawai));
}

function formatTanggal(tgl) {
  if (!tgl) return "-";
  const d = new Date(tgl);
  if (isNaN(d)) return tgl;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

// Update ringkasan dashboard
function updateSummary() {
  const totalBaru = pegawai.filter(p => p.status === "Baru").length;
  const totalAktif = pegawai.filter(p => p.status === "Aktif").length;
  const totalKontrak = pegawai.filter(p => p.status === "Kontrak").length;

  document.getElementById("totalBaru").textContent = totalBaru;
  document.getElementById("totalAktif").textContent = totalAktif;
  document.getElementById("totalKontrak").textContent = totalKontrak;
}

// Tampilkan data ke tabel
function renderTabel(dataList) {
  tableBody.innerHTML = "";

  if (dataList.length === 0) {
    emptyState.style.display = "block";
    return;
  }
  emptyState.style.display = "none";

  dataList.forEach((p, index) => {
    let badgeClass = "badge-baru";
    if (p.status === "Aktif") badgeClass = "badge-aktif";
    if (p.status === "Kontrak") badgeClass = "badge-kontrak";
    if (p.status === "Magang") badgeClass = "badge-magang";
    if (p.status === "Baru") badgeClass = "badge-baru";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${p.nama}</td>
      <td>${p.nik}</td>
      <td>${p.jabatan}</td>
      <td>${p.departemen}</td>
      <td>${formatTanggal(p.tanggal)}</td>
      <td><span class="badge ${badgeClass}">${p.status}</span></td>
      <td>
        <div class="aksi-group">
          <button class="btn-aksi btn-detail" onclick="detailPegawai(${p.id})">Detail</button>
          <button class="btn-aksi btn-edit" onclick="editPegawai(${p.id})">Edit</button>
          <button class="btn-aksi btn-hapus" onclick="hapusPegawai(${p.id})">Hapus</button>
        </div>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// Gabungan filter search + status
function getFilteredData() {
  const keyword = searchInput.value.toLowerCase().trim();
  const status = filterStatus.value;

  let hasil = pegawai;

  if (keyword !== "") {
    hasil = hasil.filter(p => p.nama.toLowerCase().includes(keyword));
  }
  if (status !== "") {
    hasil = hasil.filter(p => p.status === status);
  }
  return hasil;
}

function applyFilter() {
  const hasil = getFilteredData();
  renderTabel(hasil);
}

// Buka modal tambah
function bukaModalTambah() {
  editId = null;
  modalTitle.textContent = "Tambah Pegawai Baru";
  form.reset();
  modal.style.display = "flex";
}

// Buka modal edit
function editPegawai(id) {
  const data = pegawai.find(p => p.id === id);
  if (!data) return;

  editId = id;
  modalTitle.textContent = "Edit Pegawai Baru";

  document.getElementById("nama").value = data.nama;
  document.getElementById("nik").value = data.nik;
  document.getElementById("jenisKelamin").value = data.jenisKelamin;
  document.getElementById("tempatLahir").value = data.tempatLahir;
  document.getElementById("tanggalLahir").value = data.tanggalLahir;
  document.getElementById("alamat").value = data.alamat;
  document.getElementById("hp").value = data.hp;
  document.getElementById("email").value = data.email;
  document.getElementById("jabatan").value = data.jabatan;
  document.getElementById("departemen").value = data.departemen;
  document.getElementById("tanggal").value = data.tanggal;
  document.getElementById("status").value = data.status;

  modal.style.display = "flex";
}

function tutupModal() {
  modal.style.display = "none";
  form.reset();
  editId = null;
}

// Detail pegawai
function detailPegawai(id) {
  const p = pegawai.find(x => x.id === id);
  if (!p) return;

  let badgeClass = "badge-baru";
  if (p.status === "Aktif") badgeClass = "badge-aktif";
  if (p.status === "Kontrak") badgeClass = "badge-kontrak";
  if (p.status === "Magang") badgeClass = "badge-magang";

  document.getElementById("detailContent").innerHTML = `
    <div class="detail-grid">
      <div class="detail-item"><span class="detail-label">Nama Lengkap</span><span class="detail-value">${p.nama}</span></div>
      <div class="detail-item"><span class="detail-label">NIK</span><span class="detail-value">${p.nik}</span></div>
      <div class="detail-item"><span class="detail-label">Jenis Kelamin</span><span class="detail-value">${p.jenisKelamin}</span></div>
      <div class="detail-item"><span class="detail-label">Tempat, Tgl Lahir</span><span class="detail-value">${p.tempatLahir}, ${formatTanggal(p.tanggalLahir)}</span></div>
      <div class="detail-item full"><span class="detail-label">Alamat</span><span class="detail-value">${p.alamat}</span></div>
      <div class="detail-item"><span class="detail-label">No HP</span><span class="detail-value">${p.hp}</span></div>
      <div class="detail-item"><span class="detail-label">Email</span><span class="detail-value">${p.email}</span></div>
      <div class="detail-item"><span class="detail-label">Jabatan</span><span class="detail-value">${p.jabatan}</span></div>
      <div class="detail-item"><span class="detail-label">Departemen</span><span class="detail-value">${p.departemen}</span></div>
      <div class="detail-item"><span class="detail-label">Tanggal Masuk</span><span class="detail-value">${formatTanggal(p.tanggal)}</span></div>
      <div class="detail-item"><span class="detail-label">Status</span><span class="detail-value"><span class="badge ${badgeClass}">${p.status}</span></span></div>
    </div>
  `;
  modalDetail.style.display = "flex";
}

function tutupDetail() {
  modalDetail.style.display = "none";
}

// Hapus
function hapusPegawai(id) {
  hapusId = id;
  const data = pegawai.find(p => p.id === id);
  document.getElementById("hapusText").textContent = `Apakah Anda yakin ingin menghapus data "${data.nama}"?`;
  modalHapus.style.display = "flex";
}

function tutupModalHapus() {
  modalHapus.style.display = "none";
  hapusId = null;
}

// Submit form
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const dataBaru = {
    nama: document.getElementById("nama").value.trim(),
    nik: document.getElementById("nik").value.trim(),
    jenisKelamin: document.getElementById("jenisKelamin").value,
    tempatLahir: document.getElementById("tempatLahir").value.trim(),
    tanggalLahir: document.getElementById("tanggalLahir").value,
    alamat: document.getElementById("alamat").value.trim(),
    hp: document.getElementById("hp").value.trim(),
    email: document.getElementById("email").value.trim(),
    jabatan: document.getElementById("jabatan").value.trim(),
    departemen: document.getElementById("departemen").value,
    tanggal: document.getElementById("tanggal").value,
    status: document.getElementById("status").value
  };

  if (editId === null) {
    const idBaru = pegawai.length > 0 ? Math.max(...pegawai.map(p => p.id)) + 1 : 1;
    pegawai.push({ id: idBaru, ...dataBaru });
  } else {
    const index = pegawai.findIndex(p => p.id === editId);
    if (index !== -1) {
      pegawai[index] = { id: editId, ...dataBaru };
    }
  }

  saveData();
  updateSummary();
  applyFilter();
  tutupModal();
});

// Event search dan filter
searchInput.addEventListener("input", applyFilter);
filterStatus.addEventListener("change", applyFilter);

// Tombol
document.getElementById("btnTambah").addEventListener("click", bukaModalTambah);
document.getElementById("btnCloseModal").addEventListener("click", tutupModal);
document.getElementById("btnBatal").addEventListener("click", tutupModal);
document.getElementById("btnCloseDetail").addEventListener("click", tutupDetail);
document.getElementById("btnTutupDetail").addEventListener("click", tutupDetail);

modal.addEventListener("click", function(e) {
  if (e.target === modal) tutupModal();
});
modalHapus.addEventListener("click", function(e) {
  if (e.target === modalHapus) tutupModalHapus();
});
modalDetail.addEventListener("click", function(e) {
  if (e.target === modalDetail) tutupDetail();
});

document.getElementById("btnBatalHapus").addEventListener("click", tutupModalHapus);
document.getElementById("btnKonfirmasiHapus").addEventListener("click", function() {
  if (hapusId !== null) {
    pegawai = pegawai.filter(p => p.id !== hapusId);
    saveData();
    updateSummary();
    applyFilter();
  }
  tutupModalHapus();
});

// Init
loadData();
updateSummary();
renderTabel(pegawai);
