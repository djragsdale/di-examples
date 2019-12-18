import { useEffect } from 'react';

export default function useScriptContent(content, iframeId) {
  useEffect(function effectHandler() {
    const script = document.createElement('script');

    script.async = true;
    script.innerHTML = content;

    // document.body.appendChild(script);

    const iframeDocument = document.getElementById(iframeId).contentWindow.document;
    // doc.open();
    // doc.write(content);
    // doc.close();
    iframeDocument.body.appendChild(script);

    return () => {
      iframeDocument.body.removeChild(script);
    };
  }, [content]);
};
