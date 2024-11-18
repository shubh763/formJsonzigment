import React from 'react';
import DynamicForm from './DynamicForm';
import formSchema from './formSchema.json'; // Import your schema

const App = () => {
    const handleFormSubmit = (formData) => {
        console.log('Form Data:', formData);
    };

    return (
        <div className="container mt-5">
            <DynamicForm schema={formSchema} onSubmit={handleFormSubmit} />
        </div>
    );
};

export default App;