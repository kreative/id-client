export default function ProgressBarComponent({
  widthName,
  progressClass,
  textClass,
  message,
}) {
  return (
    <>
      <div className="h-2.5 w-full rounded-full bg-gray-200">
        <div className={progressClass}></div>
      </div>
      <div className="mb-1 flex justify-between">
        <p className={textClass}>{message}</p>
        <p className={"text-xs text-gray-500"}>{widthName}</p>
      </div>
    </>
  );
}
