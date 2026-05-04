
const GooglePlaceAutoComplete = ({ placeholder, value, id, disabled }) => {
  return (
    <input
      type="text"
      id={id}
      value={value || ""}
      placeholder={placeholder || "Google field désactivé"}
      disabled={true}
      style={{ background: '#eee', color: '#aaa', width: '100%' }}
    />
  );
};

export default GooglePlaceAutoComplete;
