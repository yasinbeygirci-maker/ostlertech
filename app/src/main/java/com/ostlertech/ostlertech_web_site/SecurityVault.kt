package com.ostlertech.ostlertech_web_site

import javax.crypto.SecretKey

/**
 * SyncPass Zero-Knowledge Güvenlik Katmanı.
 * Bellekteki hassas verilerin yönetiminden ve yaşam döngüsü politikalarından sorumludur.
 */
object SecurityVault {
    private var masterKey: SecretKey? = null
    
    // Uygulama genelindeki kritik süreç durumunu tutar
    var currentState: ImportState = ImportState.IDLE

    /**
     * Anahtarı güvenli bir şekilde belleğe alır.
     */
    fun setMasterKey(key: SecretKey) {
        this.masterKey = key
    }

    /**
     * Anahtarı döndürür (Sadece yetkili süreçler tarafından çağrılmalıdır).
     */
    fun getMasterKey(): SecretKey? = masterKey

    /**
     * Güvenlik Politikası: Uygulama arka plana geçtiğinde anahtarları temizler.
     * ANCAK: Eğer kritik bir işlem (Import vb.) devam ediyorsa temizleme işlemini erteler.
     */
    fun clearKeysOnAppBackground() {
        if (currentState == ImportState.PICKING_FILE || currentState == ImportState.IMPORTING) {
            // Kritik işlem devam ediyor, temizleme işlemini bypass et.
            return
        }
        
        // Zero-Knowledge: Anahtarı bellekten sil
        masterKey = null
    }

    /**
     * İşlem bittiğinde manuel olarak anahtarı temizler.
     */
    fun forceWipe() {
        masterKey = null
        currentState = ImportState.IDLE
    }
}
