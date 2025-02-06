package com.pamreactnative

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.ReadableMap

class PamReactNativeModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  fun displayPopup(banner: ReadableMap, btnColor: String, btnLabel: String, btnLabelColor: String, promise: Promise) {
    val bannerMap: Map<String, Any?> = banner.toHashMap()

    val activity = reactApplicationContext.currentActivity
    if (activity != null) {
      activity.runOnUiThread {
        PopupDialog(activity, bannerMap,btnColor, btnLabel, btnLabelColor, promise).show()
      }
    }
  }

  companion object {
    const val NAME = "PamReactNative"
  }
}
