package com.quenice.reactnative;

import android.graphics.Color;
import android.support.v7.widget.CardView;
import android.view.View;

import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.view.ReactViewGroup;

public class RNCloudwiseReactNativePluginManager extends ViewGroupManager<CardView> {
    @Override
    public String getName() {
        return "RNCloudwiseReactNativePluginManager";
    }

    @Override
    protected CardView createViewInstance(ThemedReactContext reactContext) {
        CardView cardView = new CardView(reactContext);
        cardView.setUseCompatPadding(true);
        cardView.setContentPadding(0, 0, 0, 0);
        ReactViewGroup reactViewGroup = new ReactViewGroup(reactContext);
        cardView.addView(reactViewGroup);
        return cardView;
    }

    @ReactProp(name = "cardElevation", defaultFloat = 0f)
    public void setCardElevation(CardView view, float cardElevation) {
        view.setCardElevation(PixelUtil.toPixelFromDIP(cardElevation));
    }
...
}

