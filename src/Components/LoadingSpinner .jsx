const LoadingSpinner = ({ size = 6, strokeWidth = 2 }) => {
  const sizeInRem = `${size * 0.3}rem`;
  const strokeInRem = `${strokeWidth * 0.1}rem`;

  return (
    <div 
      className="inline-block animate-spin rounded-full border-solid border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      style={{
        width: sizeInRem,
        height: sizeInRem,
        borderWidth: strokeInRem,
        borderColor: 'white', 
        borderRightColor: 'transparent'
      }}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};

export default LoadingSpinner;