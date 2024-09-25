// Dropdown.js
import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import "./Dropdown.scss";

const Dropdown = ({ label, value, options, onChange }) => {
  return (
    <FormControl fullWidth margin="normal" className="dropdown">
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label={label}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Dropdown;
