package com.ostlertech.ostlertech_web_site

import android.app.*
import android.content.Intent
import android.content.pm.ServiceInfo
import android.net.Uri
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import kotlinx.coroutines.*
import java.io.BufferedReader
import java.io.InputStreamReader

/**
 * Büyük boyutlu KPM dosyalarını güvenli ve izole bir şekilde işleyen Foreground Service.
 */
class KpmImportService : Service() {
    private val serviceJob = Job()
    private val serviceScope = CoroutineScope(Dispatchers.IO + serviceJob)

    companion object {
        private const val CHANNEL_ID = "kpm_import_channel"
        private const val NOTIFICATION_ID = 1001
        const val EXTRA_FILE_URI = "extra_file_uri"
        const val TAG = "KpmImportService"
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val uri: Uri? = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            intent?.getParcelableExtra(EXTRA_FILE_URI, Uri::class.java)
        } else {
            @Suppress("DEPRECATION")
            intent?.getParcelableExtra(EXTRA_FILE_URI)
        }

        if (uri == null) {
            stopSelf()
            return START_NOT_STICKY
        }

        // Android 14+ için Foreground Service başlatma
        val notification = createNotification("KPM Verileri İçe Aktarılıyor...")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC)
        } else {
            startForeground(NOTIFICATION_ID, notification)
        }

        startImportTask(uri)

        return START_NOT_STICKY
    }

    private fun startImportTask(uri: Uri) {
        serviceScope.launch {
            try {
                SecurityVault.currentState = ImportState.IMPORTING
                
                // SAF Persistable URI İzni Al
                try {
                    contentResolver.takePersistableUriPermission(
                        uri, Intent.FLAG_GRANT_READ_URI_PERMISSION
                    )
                } catch (e: Exception) {
                    Log.e(TAG, "URI izni alınamadı: ${e.message}")
                }

                // Line-by-line streaming (OOM Koruması)
                contentResolver.openInputStream(uri)?.use { inputStream ->
                    val reader = BufferedReader(InputStreamReader(inputStream))
                    var lineCount = 0
                    
                    reader.forEachLine { line ->
                        // Her satırı işle (Örn: Decrypt ve DB'ye yaz)
                        // Mock işlem süresi simülasyonu
                        processKpmLine(line)
                        lineCount++
                        
                        if (lineCount % 10 == 0) {
                            updateNotification("İşlenen satır: $lineCount")
                        }
                    }
                }
                
                Log.d(TAG, "İçe aktarma başarıyla tamamlandı.")
                SecurityVault.currentState = ImportState.COMPLETED
            } catch (e: Exception) {
                Log.e(TAG, "İçe aktarma hatası: ${e.message}")
                SecurityVault.currentState = ImportState.ERROR
            } finally {
                // Temizlik ve Kapanış
                withContext(Dispatchers.Main) {
                    // İşlem bittikten sonra anahtarları temizle (Zero-Knowledge)
                    SecurityVault.clearKeysOnAppBackground() 
                    stopForeground(STOP_FOREGROUND_REMOVE)
                    stopSelf()
                }
            }
        }
    }

    private fun processKpmLine(line: String) {
        // Burada Master Key ile şifre çözme ve veritabanına kayıt işlemleri yapılır.
        // Mock veri işleme (Gelen satırı logla):
        Log.v(TAG, "İşlenen veri uzunluğu: ${line.length}")
        Thread.sleep(50) 
    }

    private fun createNotification(content: String): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("SyncPass Güvenli Aktarım")
            .setContentText(content)
            .setSmallIcon(android.R.drawable.stat_sys_download)
            .setOngoing(true)
            .setCategory(Notification.CATEGORY_SERVICE)
            .build()
    }

    private fun updateNotification(content: String) {
        val notificationManager = getSystemService(NotificationManager::class.java)
        try {
            notificationManager.notify(NOTIFICATION_ID, createNotification(content))
        } catch (e: SecurityException) {
            Log.e(TAG, "Bildirim gönderme izni yok: ${e.message}")
        }
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "KPM Veri Aktarımı",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Büyük boyutlu verilerin güvenli içe aktarımı için kullanılır."
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(channel)
        }
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        serviceJob.cancel()
        super.onDestroy()
    }
}
