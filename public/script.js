const API_BASE = "";

let allStudents = [];
let courses = [];

document.addEventListener("DOMContentLoaded", () => {
  loadData();

  // Setup generic form handlers
  setupForm("addStudentForm", "/students", "POST", loadStudents);
  setupForm("addCourseForm", "/courses", "POST", loadCourses);
  setupForm("editStudentForm", "/students", "PUT", loadStudents, true);
  setupForm("editCourseForm", "/courses", "PUT", loadCourses, true);
  setupForm("enrollForm", "/enrollments", "POST", null);

  // Search Listener
  const searchInput = document.getElementById("studentSearch");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const term = e.target.value.toLowerCase();
      const filtered = allStudents.filter(
        (s) =>
          s.fullname.toLowerCase().includes(term) ||
          s.email.toLowerCase().includes(term) ||
          s.major.toLowerCase().includes(term)
      );
      renderStudents(filtered);
    });
  }
});

async function loadData() {
  await Promise.all([loadStudents(), loadCourses()]);
}

// --- 1. Load Students (With Loading & Nice Error) ---
async function loadStudents() {
  const container = document.getElementById("studentsList");
  const select = document.getElementById("studentId");

  // ✅ ใส่ Loading Spinner ก่อนเริ่มดึงข้อมูล
  if (container) {
    container.innerHTML = `
        <div class="col-12 text-center py-5 fade-in-up">
            <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;"></div>
            <h6 class="text-muted fw-bold">Loading students...</h6>
        </div>`;
  }

  try {
    // หน่วงเวลาเทียม 0.5 วิ (ถ้าอยากให้เห็น loading ชัดๆ ลบออกได้ถ้าใช้งานจริง)
    // await new Promise(r => setTimeout(r, 500));

    const res = await fetch(API_BASE + "/students");
    if (!res.ok) throw new Error("API Error"); // ดัก Error ถ้า API พัง

    allStudents = await res.json();

    const totalEl = document.getElementById("totalStudents");
    if (totalEl) totalEl.innerText = allStudents.length || 0;

    renderStudents(allStudents);

    if (select) {
      select.innerHTML =
        '<option value="" selected disabled>Select a student...</option>' +
        allStudents
          .map(
            (s) => `<option value="${s.id}">${escapeHtml(s.fullname)}</option>`
          )
          .join("");
    }
  } catch (err) {
    console.error(err);
    // ❌ Error สวยๆ เป็น Card แทนตัวหนังสือแดงๆ
    if (container) {
      container.innerHTML = `
            <div class="col-12">
                <div class="card border-0 shadow-sm rounded-4 p-5 text-center bg-light bg-opacity-50">
                    <div class="mb-3 text-danger opacity-75"><i class="fas fa-exclamation-triangle fa-3x"></i></div>
                    <h5 class="text-danger fw-bold">Failed to load students</h5>
                    <p class="text-muted small mb-0">Please check your API connection or try again later.</p>
                </div>
            </div>`;
    }
  }
}

// --- 2. Load Courses (With Loading & Nice Error) ---
async function loadCourses() {
  const container = document.getElementById("coursesList");
  const select = document.getElementById("courseId");

  // ✅ ใส่ Loading Spinner ก่อนเริ่มดึงข้อมูล
  if (container) {
    container.innerHTML = `
        <div class="col-12 text-center py-5 fade-in-up">
            <div class="spinner-border text-success mb-3" role="status" style="width: 3rem; height: 3rem;"></div>
            <h6 class="text-muted fw-bold">Loading courses...</h6>
        </div>`;
  }

  try {
    const res = await fetch(API_BASE + "/courses");
    if (!res.ok) throw new Error("API Error");

    courses = await res.json();

    const totalEl = document.getElementById("totalCourses");
    if (totalEl) totalEl.innerText = courses.length || 0;

    renderCourses(courses);

    if (select) {
      select.innerHTML =
        '<option value="" selected disabled>Select a course...</option>' +
        courses
          .map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`)
          .join("");
    }
  } catch (err) {
    console.error(err);
    // ❌ Error สวยๆ เป็น Card
    if (container) {
      container.innerHTML = `
            <div class="col-12">
                <div class="card border-0 shadow-sm rounded-4 p-5 text-center bg-light bg-opacity-50">
                    <div class="mb-3 text-danger opacity-75"><i class="fas fa-exclamation-triangle fa-3x"></i></div>
                    <h5 class="text-danger fw-bold">Failed to load courses</h5>
                    <p class="text-muted small mb-0">Please check your API connection or try again later.</p>
                </div>
            </div>`;
    }
  }
}

// --- Render Students (Card Style) ---
function renderStudents(students) {
  const container = document.getElementById("studentsList");
  if (!container) return;

  if (!students || students.length === 0) {
    container.innerHTML = `
        <div class="col-12">
            <div class="card border-0 shadow-sm rounded-4 p-5 text-center bg-light bg-opacity-50">
                <div class="mb-3 text-secondary opacity-50"><i class="fas fa-user-slash fa-3x"></i></div>
                <h5 class="text-secondary fw-bold">No Students Found</h5>
            </div>
        </div>`;
    return;
  }

  container.innerHTML = students
    .map(
      (s) => `
        <div class="col-md-4 mb-4">
            <div class="card">
                <div class="card-body p-4 d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-4">
                        <div class="icon-box primary">
                            <i class="fas fa-user-graduate"></i>
                        </div>
                        <span class="badge-soft badge-soft-primary rounded-pill">
                            ID: ${s.id}
                        </span>
                    </div>

                    <h5 class="fw-bold mb-1">${escapeHtml(s.fullname)}</h5>
                    <p class="text-muted small mb-0">
                        <i class="fas fa-envelope me-2 opacity-50"></i>${escapeHtml(
                          s.email
                        )}
                    </p>

                    <div class="card-divider mt-auto d-flex justify-content-between align-items-center">
                         <span class="badge-major">${escapeHtml(s.major)}</span>
                                            <div class="d-flex align-items-center">
                                               <button class="btn-icon-soft" 
                                                  onclick="openEditStudentModal('${
                                                    s.id
                                                  }', '${escapeHtml(
        s.fullname
      )}', '${escapeHtml(s.email)}', '${escapeHtml(s.major)}')">
                                                  <i class="fas fa-pen fa-sm"></i>
                                              </button>
                                              <button class="btn-delete ms-2" onclick="showDeleteModal('student','${
                                                s.id
                                              }','${escapeHtml(
        s.fullname
      )}')" title="Delete student">
                                                <i class="fas fa-trash"></i>
                                              </button>
                                             </div>
                    </div>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

// --- Render Courses (Card Style) ---
function renderCourses(courseList) {
  const container = document.getElementById("coursesList");
  if (!container) return;

  if (!courseList || courseList.length === 0) {
    container.innerHTML = `<div class="col-12 text-center p-5"><h5 class="text-secondary">No Courses Available</h5></div>`;
  } else {
    container.innerHTML = courseList
      .map(
        (c) => `
            <div class="col-md-4 mb-4">
                <div class="card">
                    <div class="card-body p-4 d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <div class="icon-box success">
                                <i class="fas fa-book-open"></i>
                            </div>
                            <span class="badge-soft badge-soft-success rounded-pill">
                                ID: ${c.id}
                            </span>
                        </div>

                        <h5 class="fw-bold mb-2">${escapeHtml(c.name)}</h5>
                        <p class="card-text flex-grow-1 text-muted small mb-0">
                            ${escapeHtml(
                              c.description || "No description provided."
                            )}
                        </p>
                        
                        <div class="card-divider mt-auto d-flex justify-content-between align-items-center">
                            <span class="fw-bold text-dark">${
                              c.credit || 0
                            } Credits</span>
                            <div class="d-flex gap-2">
                                <button class="btn-icon-soft" onclick="viewCourseStudents('${
                                  c.id
                                }', '${escapeHtml(c.name)}')">
                                    <i class="fas fa-users text-primary"></i>
                                </button>
                                <button class="btn-icon-soft" 
                                    onclick="openEditCourseModal('${
                                      c.id
                                    }', '${escapeHtml(c.name)}', '${escapeHtml(
          c.description || ""
        )}', '${c.credit}')">
                                    <i class="fas fa-pen fa-sm"></i>
                                </button>
                                <button class="btn-delete ms-2" onclick="showDeleteModal('course','${
                                  c.id
                                }','${escapeHtml(
          c.name
        )}')" title="Delete course">
                                  <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          `
      )
      .join("");
  }
}

// --- View Enrolled ---
window.viewCourseStudents = async function (courseId, courseName) {
  const tbody = document.getElementById("enrolledStudentsList");
  const title = document.getElementById("selectedCourseName");
  title.innerText = courseName;
  tbody.innerHTML =
    '<tr><td colspan="4" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>';
  new bootstrap.Modal(document.getElementById("enrollmentModal")).show();
  try {
    const res = await fetch(`${API_BASE}/courses/${courseId}/students`);
    const enrollments = await res.json();
    if (!enrollments || enrollments.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="4" class="text-center py-4 text-muted">No students enrolled yet.</td></tr>';
    } else {
      tbody.innerHTML = enrollments
        .map((e) => {
          const s = e.students;
          if (!s) return "";
          return `<tr>
                    <td>${escapeHtml(s.fullname)}</td>
                    <td>${escapeHtml(s.email)}</td>
                    <td>${escapeHtml(s.major)}</td>
                    <td>${new Date(e.enrollment_date).toLocaleDateString()}</td>
                </tr>`;
        })
        .join("");
    }
  } catch (err) {
    console.error(err);
    tbody.innerHTML =
      '<tr><td colspan="4" class="text-center py-4 text-danger">Failed to load enrollments.</td></tr>';
  }
};

// --- Form Handler ---
function setupForm(formId, endpoint, method, callback, useIdInUrl = false) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {};
    if (formId === "addStudentForm") {
      data.fullname = document.getElementById("studentName").value;
      data.email = document.getElementById("studentEmail").value;
      data.major = document.getElementById("studentMajor").value;
    } else if (formId === "editStudentForm") {
      data.id = document.getElementById("editStudentId").value;
      data.fullname = document.getElementById("editStudentName").value;
      data.email = document.getElementById("editStudentEmail").value;
      data.major = document.getElementById("editStudentMajor").value;
    } else if (formId === "addCourseForm") {
      data.name = document.getElementById("courseName").value;
      data.description = document.getElementById("courseDesc").value;
      data.credit = document.getElementById("courseCredit").value;
    } else if (formId === "editCourseForm") {
      data.id = document.getElementById("editCourseId").value;
      data.name = document.getElementById("editCourseName").value;
      data.description = document.getElementById("editCourseDesc").value;
      data.credit = document.getElementById("editCourseCredit").value;
    } else if (formId === "enrollForm") {
      data.student_id = document.getElementById("studentId").value;
      data.course_id = document.getElementById("courseId").value;
    }
    let url = API_BASE + endpoint;
    if (useIdInUrl && data.id) url += `/${data.id}`;
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = "Saving...";
    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        if (formId === "enrollForm") {
          const resultDiv = document.getElementById("enrollResult");
          if (resultDiv) {
            resultDiv.innerHTML =
              '<div class="alert alert-success mt-3">Enrollment successful — the student has been added to the course.</div>';
            setTimeout(() => {
              resultDiv.innerHTML = "";
            }, 10000);
          }
        } else {
          const modalEl = form.closest(".modal");
          if (modalEl) bootstrap.Modal.getInstance(modalEl).hide();
          if (callback) callback();
        }
        form.reset();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Error occurred");
      }
    } catch (err) {
      console.error(err);
      alert("Network Error");
    } finally {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  });
}

// --- Modals ---
window.openEditStudentModal = function (id, name, email, major) {
  document.getElementById("editStudentId").value = id;
  document.getElementById("editStudentName").value = name;
  document.getElementById("editStudentEmail").value = email;
  document.getElementById("editStudentMajor").value = major;
  new bootstrap.Modal(document.getElementById("editStudentModal")).show();
};
window.openEditCourseModal = function (id, name, desc, credit) {
  document.getElementById("editCourseId").value = id;
  document.getElementById("editCourseName").value = name;
  document.getElementById("editCourseDesc").value = desc;
  document.getElementById("editCourseCredit").value = credit;
  new bootstrap.Modal(document.getElementById("editCourseModal")).show();
};
// Delete student
// Delete flow using confirmation modal
let pendingDelete = null; // { type: 'student'|'course', id, name }

window.showDeleteModal = function (type, id, name) {
  pendingDelete = { type, id, name };
  const titleEl = document.getElementById("confirmDeleteTitle");
  const bodyEl = document.getElementById("confirmDeleteBody");
  if (titleEl)
    titleEl.innerText = `Delete ${type === "student" ? "student" : "course"}`;
  if (bodyEl)
    bodyEl.innerText = `Are you sure you want to delete "${name}"? This action cannot be undone.`;
  const modalEl = document.getElementById("confirmDeleteModal");
  if (modalEl) new bootstrap.Modal(modalEl).show();
};

async function performDelete() {
  if (!pendingDelete) return;
  const { type, id, name } = pendingDelete;
  const url = `${API_BASE}/${
    type === "student" ? "students" : "courses"
  }/${id}`;
  try {
    const res = await fetch(url, { method: "DELETE" });
    if (res.ok) {
      // hide modal
      const modalEl = document.getElementById("confirmDeleteModal");
      if (modalEl) bootstrap.Modal.getInstance(modalEl)?.hide();
      // refresh lists
      if (type === "student") await loadStudents();
      else await loadCourses();
      showGlobalAlert(
        `${type === "student" ? "Student" : "Course"} "${name}" deleted`,
        "success"
      );
    } else {
      const e = await res.json();
      showGlobalAlert(e.error || "Failed to delete item", "danger");
    }
  } catch (err) {
    console.error(err);
    showGlobalAlert("Network error", "danger");
  } finally {
    pendingDelete = null;
  }
}

// Confirm button wiring
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("confirmDeleteBtn");
  if (btn) btn.addEventListener("click", performDelete);
});

// Global alert helper (top-right)
function showGlobalAlert(message, type = "success", timeout = 4000) {
  const container = document.getElementById("globalAlerts");
  if (!container) return;
  const id = `ga-${Date.now()}`;
  const div = document.createElement("div");
  div.id = id;
  div.className = `alert alert-${type} shadow-sm mb-2`;
  div.role = "alert";
  div.innerText = message;
  container.appendChild(div);
  setTimeout(() => {
    div.classList.add("fade");
    try {
      container.removeChild(div);
    } catch (e) {}
  }, timeout);
}
function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
