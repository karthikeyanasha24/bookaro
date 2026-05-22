import React from "react";
import "./style.scss";
import Select from "react-select";

const Html = ({ options, selectedValues, handleChange, displayValue, id }) => {
  let groupedMembers = [];
  let experienceLabels = {};

  options?.forEach((option) => {
    if (!groupedMembers[option.experience_level]) {
      groupedMembers[option.experience_level] = [];
    }
    groupedMembers[option.experience_level].push(option);

    if (!experienceLabels[option.experience_level])
      experienceLabels[option.experience_level] = option.experience_level;
  });

  let groupedOptions = Object.keys(experienceLabels).map((level) => ({
    label: experienceLabels[level],
    options: groupedMembers[level].map((member) => {
      return {
        value: member.id,
        label: member.name,
        email: member.email,
      };
    }),
  }));

  if (options?.length > 1 && options?.length - selectedValues?.length > 1) {
    groupedOptions = [
      {
        value: "all",
        label: "Select All",
      },
    ].concat(groupedOptions);
  }

  return (
    <>
      <div className="selectDropdown">
        <Select
          defaultValue={displayValue}
          isMulti
          value={selectedValues || []}
          options={groupedOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={(e) => handleChange(e)}
          closeMenuOnSelect={false}
          getOptionLabel={(value) =>
            value.value == "all" ? (
              value.label
            ) : (
              <div className="flex ">
                {value.label} ({value.email})
              </div>
            )
          }
        />
      </div>
    </>
  );
};

export default Html;
