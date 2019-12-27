import { useLayoutEffect } from 'react';

export default function useIframeResizer(iframeId) {
  useLayoutEffect(function effectHandler() {
    // For more info: https://css-tricks.com/snippets/jquery/fit-iframe-to-content/

    function resizeIframe() {
      const iframe = document.getElementById(iframeId);
      const iframeWindow = iframe.contentWindow;
      const iframeDocument = iframeWindow.document;

      const iframeBuffer = 16; // px

      const iframeInnerHeight = iframeDocument.body.scrollHeight;
      const bufferedHeight = iframeInnerHeight + (iframeBuffer * 2);
      iframe.style.height = `${bufferedHeight}px`;
      return bufferedHeight;
    }

    window.addEventListener('message', (event) => {
      if (event.data === `resizeTrigger=${iframeId}`) {
        resizeIframe();
      }
    }, false);
  }, [iframeId]);
};
