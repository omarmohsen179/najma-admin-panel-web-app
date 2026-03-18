import { Suspense } from "react";
import { MatxLoading } from "app/components";

const MatxSuspense = ({ children }) => {
  return (
    <Suspense fallback={<MatxLoading loading={true} />}>{children}</Suspense>
  );
};

export default MatxSuspense;
