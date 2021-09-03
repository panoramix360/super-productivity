package com.superproductivity.superproductivity;

import android.app.Application;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.os.Build;
import android.webkit.WebView;
import android.widget.Toast;

import androidx.lifecycle.Lifecycle;
import androidx.lifecycle.LifecycleObserver;
import androidx.lifecycle.OnLifecycleEvent;
import androidx.lifecycle.ProcessLifecycleOwner;

public class App extends Application implements LifecycleObserver {
    WebView wv;

    @Override
    public void onCreate() {
        super.onCreate();
//        ProcessLifecycleOwner.get().getLifecycle().addObserver(this);

        WebHelper.instanceView(getApplicationContext());

        boolean IS_DEBUG = 0 != (getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE);

        // if your build is in debug mode, enable inspecting of web views
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            if (IS_DEBUG) {
                WebView.setWebContentsDebuggingEnabled(true);
            }
        }

        wv = WebHelper.getWebView();
        if (wv != null) {
            // needs to come last for some settings to take effect
            if (IS_DEBUG) {
                // String url = "https://test-app.super-productivity.com";
                String url = "http://10.0.2.2:4200/";
                // String url = "https://app.super-productivity.com";
                wv.loadUrl(url);
                Toast.makeText(this, "DEBUG: " + url, Toast.LENGTH_SHORT).show();
            } else {
                wv.loadUrl("https://app.super-productivity.com");
                // wv.loadUrl("https://test-app.super-productivity.com");
            }
        }
    }
}
