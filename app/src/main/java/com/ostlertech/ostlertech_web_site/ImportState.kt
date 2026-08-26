package com.ostlertech.ostlertech_web_site

/**
 * SyncPass İçe Aktarma Süreci Durum Makinesi.
 */
enum class ImportState {
    IDLE,           // Boşta
    PICKING_FILE,   // Kullanıcı sistem dosya seçicisinde (onStop bypass aktif)
    IMPORTING,      // Foreground Service çalışıyor (onStop bypass aktif)
    COMPLETED,      // İşlem başarıyla tamamlandı
    ERROR           // Hata oluştu
}
