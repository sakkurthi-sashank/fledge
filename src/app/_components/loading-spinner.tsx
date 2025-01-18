export const LoadingSpinner = () => {
  return (
    <div
      className={`flex h-[calc(100dvh-6rem)] w-full flex-col items-center justify-center`}
    >
      <div className="h-8 w-8 animate-spin rounded-full border border-solid border-primary border-t-transparent"></div>
    </div>
  );
};
