package com.ostlertech.ostlertech_web_site

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.Button
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat

import androidx.core.content.ContextCompat

class MainActivity : AppCompatActivity() {

    // SAF Dosya Seçici Tanımlaması
    private val kpmFilePickerLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val uri: Uri? = result.data?.data
            if (uri != null) {
                startImportService(uri)
            }
        } else {
            // Seçim iptal edildi, durumu normale döndür
            SecurityVault.currentState = ImportState.IDLE
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        // Mock Button: KPM İçe Aktar
        findViewById<Button>(R.id.btnImportKpm)?.setOnClickListener {
            triggerKpmImport()
        }
    }

    private fun triggerKpmImport() {
        // 1. Durumu PICKING_FILE olarak işaretle (Bypass başlar)
        SecurityVault.currentState = ImportState.PICKING_FILE
        
        // 2. SAF Picker Başlat
        val intent = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "*/*" // KPM formatına göre daraltılabilir
        }
        kpmFilePickerLauncher.launch(intent)
    }

    private fun startImportService(uri: Uri) {
        // 3. Durumu IMPORTING olarak güncelle (Bypass devam eder)
        SecurityVault.currentState = ImportState.IMPORTING
        
        val serviceIntent = Intent(this, KpmImportService::class.java).apply {
            putExtra(KpmImportService.EXTRA_FILE_URI, uri)
        }
        ContextCompat.startForegroundService(this, serviceIntent)
        
        Toast.makeText(this, "İçe aktarma başlatıldı...", Toast.LENGTH_SHORT).show()
    }

    override fun onStop() {
        super.onStop()
        // 4. Zero-Knowledge Politikası Uygula
        // Eğer kritik bir işlem yoksa anahtarlar temizlenecektir.
        SecurityVault.clearKeysOnAppBackground()
    }
}
