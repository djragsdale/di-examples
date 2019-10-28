import { useEffect } from 'react';

export default function useScriptContent(content) {
  useEffect(function effectHandler() {
    const script = document.createElement('script');

    script.async = true;
    script.innerHTML = content;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [content]);
};
