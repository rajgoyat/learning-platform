# Course Publishing - Frontend Integration Guide

## 🎯 Overview

The backend now supports course publishing workflows. Teachers can:
1. Create courses in Draft status
2. Edit course details
3. Publish courses to make them visible to students

---

## 📝 Implementation Examples

### 1. Create Course as Draft

**Current Implementation (Still Works):**
```javascript
const handleCreateCourse = async (formData) => {
  const response = await fetch(`${API_URL}/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: formData.title,
      description: formData.description,
      concept: formData.concept,
      contentType: formData.contentType,
      modules: formData.modules,
      videoUrl: formData.videoUrl,
      status: 'Draft'  // Create as Draft instead of Active
    }),
  });
  
  const data = await parseApiResponse(response);
  if (!response.ok) throw new Error(data.message);
  
  return data.course;
};
```

### 2. Edit Course Details (NEW)

```javascript
const handleUpdateCourse = async (courseId, updatedFields) => {
  const response = await fetch(`${API_URL}/courses/${courseId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedFields),
  });
  
  const data = await parseApiResponse(response);
  if (!response.ok) throw new Error(data.message);
  
  return data.course;
};

// Usage: Update any fields
await handleUpdateCourse(courseId, {
  title: 'New Title',
  modules: 10,
  videoUrl: 'https://...'
});
```

### 3. Publish Course (NEW)

```javascript
const handlePublishCourse = async (courseId) => {
  const response = await fetch(`${API_URL}/courses/${courseId}/publish`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  const data = await parseApiResponse(response);
  if (!response.ok) throw new Error(data.message);
  
  return data.course;
};

// Usage: Publish a draft course
const publishedCourse = await handlePublishCourse(courseId);
// Status will now be 'Active'
```

### 4. Revert to Draft

```javascript
const handleRevertToDraft = async (courseId) => {
  const response = await fetch(`${API_URL}/courses/${courseId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status: 'Draft' }),
  });
  
  const data = await parseApiResponse(response);
  if (!response.ok) throw new Error(data.message);
  
  return data.course;
};
```

---

## 🔄 Updated Course Creation Flow

### Modified `TeacherDashboard.js` Form Submission

Update the form submission to use Draft status by default:

```javascript
const handleSubmit = async (event) => {
  event.preventDefault();
  setSubmitting(true);
  setFormError('');
  setCourseError('');
  setCourseMessage('');

  try {
    const response = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: formData.title.trim(),
        description: formData.description.trim(),
        concept: formData.concept.trim(),
        contentType: formData.contentType,
        modules: Number(formData.modules) || 1,
        videoUrl: formData.videoUrl.trim(),
        status: formData.status || 'Draft',  // DEFAULT TO DRAFT
      }),
    });
    
    const data = await parseApiResponse(response);
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create course');
    }

    const createdCourse = normalizeCourse(data.course);
    setCourses((currentCourses) => [createdCourse, ...currentCourses]);
    setSelectedCourseId(createdCourse.id);
    setIsCreating(false);
    setActiveTab('courses');
    setCourseMessage('Course saved as Draft. You can edit it and publish when ready.');
  } catch (err) {
    setFormError(err.message);
  } finally {
    setSubmitting(false);
  }
};
```

---

## ✨ New Features to Add

### Feature 1: Publish Button in Course Details

```javascript
// Add to course detail view
const handlePublish = async () => {
  try {
    setCourseError('');
    setCourseMessage('');
    
    const response = await fetch(`${API_URL}/courses/${selectedCourse.id}/publish`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const data = await parseApiResponse(response);
    if (!response.ok) throw new Error(data.message);
    
    // Update local state
    setCourses((currentCourses) =>
      currentCourses.map((course) =>
        course.id === selectedCourse.id
          ? { ...course, status: 'Active' }
          : course
      )
    );
    
    setSelectedCourseId(data.course.id);
    setCourseMessage('Course published successfully!');
  } catch (err) {
    setCourseError(err.message);
  }
};

// In JSX:
{selectedCourse?.status === 'Draft' && (
  <Button 
    variant="success" 
    onClick={handlePublish}
    className="me-2"
  >
    <FaCheckCircle className="me-2" /> Publish Course
  </Button>
)}
```

### Feature 2: Edit Course Modal

```javascript
const [editMode, setEditMode] = useState(false);
const [editFormData, setEditFormData] = useState({
  title: selectedCourse?.title || '',
  description: selectedCourse?.description || '',
  concept: selectedCourse?.concept || '',
  modules: selectedCourse?.modules || 1,
});

const handleEditSubmit = async () => {
  try {
    setCourseError('');
    setCourseMessage('');
    
    const response = await fetch(`${API_URL}/courses/${selectedCourse.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editFormData),
    });
    
    const data = await parseApiResponse(response);
    if (!response.ok) throw new Error(data.message);
    
    // Update local state
    setCourses((currentCourses) =>
      currentCourses.map((course) =>
        course.id === selectedCourse.id
          ? normalizeCourse(data.course)
          : course
      )
    );
    
    setSelectedCourseId(data.course.id);
    setEditMode(false);
    setCourseMessage('Course updated successfully');
  } catch (err) {
    setCourseError(err.message);
  }
};

// In JSX:
{editMode ? (
  <Form>
    <Form.Group>
      <Form.Label>Title</Form.Label>
      <Form.Control
        value={editFormData.title}
        onChange={(e) => setEditFormData({
          ...editFormData,
          title: e.target.value
        })}
      />
    </Form.Group>
    {/* More Form.Group for other fields */}
    <Button onClick={handleEditSubmit}>Save Changes</Button>
    <Button onClick={() => setEditMode(false)}>Cancel</Button>
  </Form>
) : (
  <Button onClick={() => setEditMode(true)}>Edit Course</Button>
)}
```

### Feature 3: Status Badge

```javascript
const StatusBadge = ({ status }) => {
  const variant = {
    'Active': 'success',
    'Published': 'success',
    'Draft': 'warning',
  }[status] || 'secondary';
  
  return <Badge bg={variant}>{status}</Badge>;
};

// Usage in course list
<StatusBadge status={course.status} />
```

---

## 🔄 Course Lifecycle UI

Suggested UI flow for course management:

```
┌──────────────────────────────────────┐
│  CREATE COURSE                       │
│  Status: Draft (default)             │
│                                      │
│  [Create]  ─────────────────┐        │
└──────────────────────────────┼───────┘
                               │
                               ▼
┌──────────────────────────────────────┐
│  COURSE IN DRAFT                     │
│  Status: Draft                       │
│  (Visible only to teacher)           │
│                                      │
│  [Edit] [Preview] [Delete]           │
│  [Publish]                           │
│           │                          │
│           └──────────────┐           │
└────────────────────────────┼────────┘
                             │
                             ▼
┌──────────────────────────────────────┐
│  COURSE PUBLISHED                    │
│  Status: Active                      │
│  (Visible to all students)           │
│                                      │
│  [Edit] [Preview] [Unpublish]        │
│  [Delete]                            │
└──────────────────────────────────────┘
```

---

## 🧪 Testing Checklist

- [ ] Create course - defaults to Draft status
- [ ] View draft courses - visible in teacher's 'My Courses'
- [ ] Update draft course details
- [ ] Publish draft course - status changes to Active
- [ ] Verify published course appears in student's course list
- [ ] Edit published course - should still be possible
- [ ] Revert published to draft - status changes back
- [ ] Delete course at any status
- [ ] Error handling - try updating non-existent course
- [ ] Authorization - try updating another teacher's course

---

## 📊 API Calls Summary

| Action | Method | Endpoint | Status |
|--------|--------|----------|--------|
| Create Course | POST | `/api/courses` | Works |
| Get All Courses | GET | `/api/courses` | Works |
| Get My Courses | GET | `/api/courses/mine` | Works |
| Get Course Details | GET | `/api/courses/:id` | Works |
| **Update Course** | **PATCH** | **/api/courses/:id** | **NEW ⭐** |
| **Publish Course** | **PUT** | **/api/courses/:id/publish** | **NEW ⭐** |
| Delete Course | DELETE | `/api/courses/:id` | Works |

---

## 💡 Best Practices

1. **Always Set Draft Status on Creation**
   ```javascript
   status: 'Draft'  // Don't rely on defaults
   ```

2. **Validate Before Publishing**
   - Ensure title, description, concept are filled
   - Check videoUrl is valid if contentType is Video
   - Verify modules ≥ 1

3. **Handle Network Errors**
   ```javascript
   try {
     // API call
   } catch (error) {
     setError(error.message);
     // Show user-friendly message
   }
   ```

4. **Optimistic UI Updates**
   ```javascript
   // Update UI immediately
   setCourses(updatedList);
   // Then verify with server
   ```

5. **Disable Buttons During Submission**
   ```javascript
   disabled={submitting || !isFormValid}
   ```

---

## 🚀 Next Steps

1. Update `TeacherDashboard.js` form submission
2. Add Publish button to course details view
3. Add Edit course functionality
4. Add status badge display
5. Test all workflows
6. Deploy to production

---

Last Updated: April 2, 2026
