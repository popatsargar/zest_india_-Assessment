import { useEffect, useState } from "react";
import Button from "../common/Button";
import Input from "../common/Input";

const initialState = {
  name: "",
  email: "",
  age: "",
  course: ""
};

function StudentFormModal({ isOpen, isSaving, initialData, serverErrors = {}, onClose, onSubmit }) {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (initialData) {
      setFormData({
        name: initialData.name ?? "",
        email: initialData.email ?? "",
        age: String(initialData.age ?? ""),
        course: initialData.course ?? ""
      });
      setErrors({});
      return;
    }

    setFormData(initialState);
    setErrors({});
  }, [isOpen, initialData]);

  useEffect(() => {
    if (Object.keys(serverErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...serverErrors }));
    }
  }, [serverErrors]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isSaving) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSaving, onClose]);

  if (!isOpen) {
    return null;
  }

  const validate = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Name is required.";
    } else if (formData.name.trim().length > 100) {
      nextErrors.name = "Name must be 100 characters or fewer.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      nextErrors.email = "Email format is invalid.";
    } else if (formData.email.trim().length > 150) {
      nextErrors.email = "Email must be 150 characters or fewer.";
    }

    if (!formData.age || Number(formData.age) < 1 || Number(formData.age) > 120) {
      nextErrors.age = "Age must be between 1 and 120.";
    }

    if (!formData.course.trim()) {
      nextErrors.course = "Course is required.";
    } else if (formData.course.trim().length > 100) {
      nextErrors.course = "Course must be 100 characters or fewer.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    await onSubmit({
      name: formData.name.trim(),
      email: formData.email.trim(),
      age: Number(formData.age),
      course: formData.course.trim()
    });
  };

  const handleBackdropClick = () => {
    if (!isSaving) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-form-title"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-soft"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="student-form-title" className="font-heading text-xl font-bold text-ink">
          {initialData ? "Edit Student" : "Add Student"}
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          {initialData
            ? "Update the student information and save changes."
            : "Fill in details to create a new student record."}
        </p>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <Input
            id="studentName"
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            error={errors.name}
            maxLength={100}
          />
          <Input
            id="studentEmail"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            error={errors.email}
            maxLength={150}
          />
          <Input
            id="studentAge"
            label="Age"
            type="number"
            min="1"
            max="120"
            value={formData.age}
            onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
            error={errors.age}
          />
          <Input
            id="studentCourse"
            label="Course"
            value={formData.course}
            onChange={(e) => setFormData((prev) => ({ ...prev, course: e.target.value }))}
            error={errors.course}
            maxLength={100}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={isSaving}>
              {initialData ? "Save Changes" : "Create Student"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentFormModal;
