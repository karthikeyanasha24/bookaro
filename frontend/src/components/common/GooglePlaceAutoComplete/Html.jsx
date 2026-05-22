import React from "react";
// import GooglePlacesAutocomplete, {
//   geocodeByAddress,
// } from "react-google-places-autocomplete";
import environment from "../../../environment";

class PlacesErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const Html = ({ searchText, search, placeholder, id, value, placeChange, disabled = false }) => {
  const fallbackInput = (
    <input
      component="GooglePlaceAutoCompleteFallback"
      autoComplete="off"
      type="text"
      id={"pac_input_" + id}
      value={searchText || value || ""}
      placeholder={searchText || placeholder || "Google field désactivé"}
      onChange={(e) => {
        if (typeof search === "function") search(e.target.value);
      }}
      disabled={true}
      className="mt-2 shadow-box bg-white w-full text-sm placeholder:text-gray-500 rounded-lg h-10 flex items-center gap-2 overflow-hidden px-2 !ring-primary !outline-primary disabled:!bg-gray-200"
    />
  );

  // Désactivation du composant GooglePlacesAutocomplete
  return fallbackInput;
};

export default Html;
