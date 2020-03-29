import React from 'react';
import { useState } from 'react';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';




import { Provider } from 'react-redux'
import store from './src/reduxFiles/store';
import Test from './src/screens/test';
import IntroSlider from './src/screens/introSliders';

export default function App(props) {

  const [isLoadingComplete, setLoadingComplete] = useState(false);

  async function loadResourcesAsync() {
    await Promise.all([
      Asset.loadAsync([
        //add images to load
        require('./assets/icon.png'),
      ]),
      Font.loadAsync({
        'pacifico':require('./assets/fonts/Pacifico.ttf'),
      }),
    ]);
  }

  function handleLoadingError(error) {
    // In this case, you might want to report the error to your error reporting
    // service, for example Sentry
    console.warn(error);
  }

  function handleFinishLoading(setLoadingComplete) {
    setLoadingComplete(true);
  }


  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    )
  }
  else {
    return (
      <Provider store={store}>
        <IntroSlider/>
      </Provider>
    );
  }
}
