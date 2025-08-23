const HalfInput  = ({ label, type = "text", placeholder, value, onChange, name, id }) => {
  const inputId = id || name || label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex md:flex-row flex-col gap-3 w-full md:pl-3  px-4">
      <label htmlFor={inputId} className="text-gray-700 font-medium md:w-[50%] w-full">{label}:</label>
      <input
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="md:w-[66%]  w-full px-1 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};
export default HalfInput
