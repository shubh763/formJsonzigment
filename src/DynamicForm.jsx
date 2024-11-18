import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

const DynamicForm = ({ schema, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false); 

  // Toggle dark mode functionality
  const toggleDarkMode = () => {
    setIsDarkMode((prevState) => !prevState); 
  };


  useEffect(() => {
    if (isDarkMode) {
     
      document.body.style.backgroundColor = '#333'; 
      document.body.style.color = '#fff'; 
      document.body.style.transition = 'all 0.3s ease'; 
    } else {
      // Revert to light mode
      document.body.style.backgroundColor = '#fff'; 
      document.body.style.color = '#333'; 
    }
  }, [isDarkMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleValidation = () => {
    let errors = {};
    let formIsValid = true;

    schema.forEach((section) => {
      if (section.fields) {
        section.fields.forEach((field) => {
          if (field.required && !formData[field.name]) {
            formIsValid = false;
            errors[field.name] = "This field is required";
          }
        });
      }
    });

    setFormErrors(errors);
    return formIsValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (handleValidation()) {
      onSubmit(formData);
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case "select":
        return (
          <Form.Select
            name={field.name}
            onChange={handleChange}
            required={field.required}
          >
            <option value="">Select...</option>
            {field.options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        );
      case "radio":
        return field.options.map((option, index) => (
          <Form.Check
            key={index}
            type="radio"
            name={field.name}
            value={option.value}
            label={option.label}
            onChange={handleChange}
            required={field.required}
            checked={formData[field.name] === option.value}
          />
        ));
      case "checkbox":
        return (
          <Form.Check
            type="checkbox"
            name={field.name}
            label={field.label}
            onChange={handleChange}
            required={field.required}
            checked={formData[field.name]}
          />
        );
      case "textarea":
        return (
          <Form.Control
            as="textarea"
            rows={3}
            name={field.name}
            placeholder={field.placeholder}
            onChange={handleChange}
            required={field.required}
            value={formData[field.name] || ""}
          />
        );
      default:
        return (
          <Form.Control
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            onChange={handleChange}
            required={field.required}
            value={formData[field.name] || ""}
          />
        );
    }
  };

  return (
    <div className="dynamic-form-container">
      {/* Dark Mode Toggle Button */}
      <button
        className="dark-mode-btn"
        onClick={toggleDarkMode} 
        title="Toggle Dark Mode"
      >
        {isDarkMode ? "🌙" : "☀️"} 
      </button>

      <Form onSubmit={handleSubmit}>
        {schema.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3>{section.sectionTitle}</h3>
            <Row>
              {section.fields &&
                section.fields.map((field, fieldIndex) => (
                  <Col md={6} sm={12} key={fieldIndex}>
                    <Form.Group className="mb-3">
                      <Form.Label>{field.label}</Form.Label>
                      {renderField(field)}
                      {formErrors[field.name] && (
                        <div className="text-danger">
                          {formErrors[field.name]}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                ))}
            </Row>
          </div>
        ))}
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default DynamicForm;
