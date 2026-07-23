import Button from "../common/Button";

function StudentCard({ student, onEdit, onDelete }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-800">{student.name}</h3>
          <p className="mt-1 text-sm text-slate-600">{student.email}</p>
        </div>
        <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-medium text-ocean">
          Age {student.age}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Course</p>
          <p className="text-slate-700">{student.course}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Created</p>
          <p className="text-slate-700">{new Date(student.createdDate).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="ghost" onClick={() => onEdit(student)}>
          Edit
        </Button>
        <Button variant="danger" onClick={() => onDelete(student)}>
          Delete
        </Button>
      </div>
    </div>
  );
}

function StudentTable({ students, onEdit, onDelete }) {
  if (students.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-8 text-center text-slate-600">
        No students found. Try adjusting your search or add a student.
      </div>
    );
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-soft md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Age</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                <td className="px-4 py-3 font-medium text-slate-800">{student.name}</td>
                <td className="px-4 py-3 text-slate-700">{student.email}</td>
                <td className="px-4 py-3 text-slate-700">{student.age}</td>
                <td className="px-4 py-3 text-slate-700">{student.course}</td>
                <td className="px-4 py-3 text-slate-700">
                  {new Date(student.createdDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => onEdit(student)}>
                      Edit
                    </Button>
                    <Button variant="danger" onClick={() => onDelete(student)}>
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 md:hidden">
        {students.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  );
}

export default StudentTable;
