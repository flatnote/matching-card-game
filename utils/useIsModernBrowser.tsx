import { useEffect, useState } from "react";

const useIsModernBrowser = (): boolean => {
  const [isModernBrowser, setIsModernBrowser] = useState(false);

  useEffect(() => {
    const supportsSVH = window.CSS?.supports?.("(height: 100svh)");
    setIsModernBrowser(!!supportsSVH);
  }, []);

  return isModernBrowser;
};

export default useIsModernBrowser;
