import { useEffect } from 'react';

export default function useScriptContent(iframeId) {
  useEffect(function effectHandler() {
    const iframe = document.getElementById(iframeId);
    const iframeWindow = iframe.contentWindow;
    const iframeDocument = iframeWindow.document;

    const iframeBuffer = 16; // px

    function resizeIframe() {
      const iframeInnerHeight = iframeDocument.body.scrollHeight;
      const bufferedHeight = iframeInnerHeight + (iframeBuffer * 2);
      iframe.style.height = `${bufferedHeight}px`;
      return bufferedHeight;
    }

    iframeWindow.onload = () => {
      console.log('iframeWindow is ready to load');
      const newHeight = resizeIframe();
      console.log('using new height', newHeight);
    };

    iframeWindow.onresize = () => {
      console.log('resizing window');
      const newHeight = resizeIframe();
      console.log('using resized height', newHeight);
    }
  });
};
