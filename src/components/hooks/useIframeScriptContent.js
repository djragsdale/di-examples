import { useLayoutEffect } from 'react';

export default function useIframeScriptContent(content, iframeId) {
  useLayoutEffect(function layoutEffectHandler() {
    if (iframeId && document.getElementById(iframeId)) {
      const script = document.createElement('script');

      script.async = true;
      script.innerHTML = content;

      const iframeDocument = document.getElementById(iframeId).contentWindow.document;
      iframeDocument.body.appendChild(script);

      // Whatever destructor I return here throws an error in HMR development
      // return () => {
      //   iframeDocument && iframeDocument.body.removeChild(script);
      // };
    }
  }, [content, iframeId]);
};
