import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DashboardLayout from "../layouts/DashboardLayout";
import Button from "../components/common/Button";
import LoadingSpinner from "../components/common/LoadingSpinner";
import SearchBar from "../components/students/SearchBar";
import StudentTable from "../components/students/StudentTable";
import StudentFormModal from "../components/students/StudentFormModal";
import DeleteConfirmModal from "../components/students/DeleteConfirmModal";
import Pagination from "../components/students/Pagination";
import {
  createStudentAsync,
  deleteStudentAsync,
  getStudentsAsync,
  updateStudentAsync
} from "../services/studentService";
import { getApiErrorMessage, mapApiErrorsToFields } from "../utils/apiErrors";
import { useAuth } from "../hooks/useAuth";

const PAGE_SIZE = 8;

function sortByCreatedDate(items) {
  return [...items].sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-soft">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-heading text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}

function DashboardPage() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formServerErrors, setFormServerErrors] = useState({});
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const items = await getStudentsAsync();
      setStudents(sortByCreatedDate(items));
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to fetch students."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return students;
    }

    return students.filter((student) => {
      const fields = [student.name, student.email, student.course, String(student.age)];
      return fields.some((field) => field.toLowerCase().includes(query));
    });
  }, [students, search]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pagedStudents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredStudents.slice(start, start + PAGE_SIZE);
  }, [filteredStudents, currentPage]);

  const uniqueCourses = useMemo(
    () => new Set(students.map((student) => student.course)).size,
    [students]
  );

  const openCreateModal = () => {
    setEditingStudent(null);
    setFormServerErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setFormServerErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setFormServerErrors({});
  };

  const handleSave = async (payload) => {
    setIsSaving(true);
    setFormServerErrors({});
    try {
      if (editingStudent) {
        const updated = await updateStudentAsync(editingStudent.id, payload);
        setStudents((prev) =>
          sortByCreatedDate(prev.map((item) => (item.id === updated.id ? updated : item)))
        );
        toast.success("Student updated successfully.");
      } else {
        const created = await createStudentAsync(payload);
        setStudents((prev) => sortByCreatedDate([created, ...prev]));
        toast.success("Student created successfully.");
      }

      closeModal();
    } catch (error) {
      const fieldErrors = mapApiErrorsToFields(error);
      if (Object.keys(fieldErrors).length > 0) {
        setFormServerErrors(fieldErrors);
      }
      toast.error(getApiErrorMessage(error, "Unable to save student."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRequest = (student) => {
    setDeletingStudent(student);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStudent) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteStudentAsync(deletingStudent.id);
      setStudents((prev) => prev.filter((item) => item.id !== deletingStudent.id));
      toast.success("Student deleted successfully.");
      setDeletingStudent(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to delete student."));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("You have signed out.");
    navigate("/login", { replace: true });
  };

  return (
    <DashboardLayout
      title="Student Management Dashboard"
      subtitle={`Signed in as ${username || "Administrator"}`}
      actions={
        <>
          <Button variant="primary" onClick={openCreateModal}>
            Add Student
          </Button>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </>
      }
    >
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <StatCard label="Total Students" value={students.length} />
        <StatCard label="Matching Search" value={filteredStudents.length} />
        <StatCard label="Unique Courses" value={uniqueCourses} />
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <SearchBar
          value={search}
          onChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
        />
        <Button variant="ghost" onClick={fetchStudents} disabled={isLoading}>
          Refresh
        </Button>
      </div>

      <div className="mt-4">
        {isLoading ? (
          <LoadingSpinner label="Fetching students..." />
        ) : (
          <>
            <StudentTable
              students={pagedStudents}
              onEdit={openEditModal}
              onDelete={handleDeleteRequest}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      <StudentFormModal
        isOpen={isModalOpen}
        initialData={editingStudent}
        isSaving={isSaving}
        serverErrors={formServerErrors}
        onClose={closeModal}
        onSubmit={handleSave}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingStudent)}
        student={deletingStudent}
        isDeleting={isDeleting}
        onClose={() => !isDeleting && setDeletingStudent(null)}
        onConfirm={handleDeleteConfirm}
      />
    </DashboardLayout>
  );
}

export default DashboardPage;
