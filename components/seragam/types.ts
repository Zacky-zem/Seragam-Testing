export type UserSession = {
  username: string
  fullName: string
  role: string
  isLoggedIn: boolean
}

export type UniformRecord = {
  id: string
  namaKaryawan: string
  nik: string
  departemen: string
  section: string
  jenisBaju: string
  ukuran: string
  jumlahStel: number
  noPR: string
  tglInput: string
  tglTerima: string | null
  keterangan?: string
}
