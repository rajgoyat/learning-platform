# Course Publishing API - Complete Guide

## 📋 Overview

Teachers can now create, edit, and publish courses with proper status management. The system supports three course states:

- **Draft** - Course is being created/edited, not visible to students
- **Active** - Course is published and visible to all students  
- **Published** - Alias for Active status (same functionality)

---

## 🔄 Course Publishing Workflow

### Step 1: Create Course as Draft
Teacher creates a course with **Draft status** as default

```
POST /api/courses
Content-Type: application/json
Authorization: Bearer {token}

{
  "title": "Machine Learning Basics",
  "description": "A comprehensive course on ML fundamentals",
  "concept": "Understanding ML algorithms",
  "contentType": "Video",
  "videoUrl": "https://youtube.com/watch?v=...",
  "modules": 5,
  "status": "Draft"
}
```

**Response:**
```json
{
  "success": true,
  "course": {
    "id": "641a2b3c4d5e6f7g8h9i",
    "title": "Machine Learning Basics",
    "status": "Draft",
    "...": "other fields"
  }
}
```

### Step 2: Edit Course Before Publishing
Teacher can update any course details

```
PATCH /api/courses/:id
Content-Type: application/json
Authorization: Bearer {token}

{
  "description": "Updated description",
  "modules": 6,
  "videoUrl": "https://youtube.com/watch?v=updated"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Course updated successfully",
  "course": {
    "id": "641a2b3c4d5e6f7g8h9i",
    "description": "Updated description",
    "modules": 6,
    "status": "Draft"
  }
}
```

### Step 3: Publish Course
When ready, teacher publishes the course to make it visible to students

```
PUT /api/courses/:id/publish
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Course published successfully",
  "course": {
    "id": "641a2b3c4d5e6f7g8h9i",
    "status": "Active",
    "...": "other fields"
  }
}
```

---

## 📡 API Endpoints

### 1. Create Course
Creates a new course in Draft status by default

```
POST /api/courses
```

**Request Body:**
```json
{
  "title": "string (required, min 3 chars)",
  "description": "string (required)",
  "concept": "string (required)",
  "contentType": "string (Video|PDF|Notes, default: Video)",
  "videoUrl": "string (optional)",
  "modules": "number (optional, min: 1, default: 1)",
  "status": "string (Active|Draft|Published, default: Draft)"
}
```

**Response Codes:**
- `201` - Course created successfully
- `400` - Missing required fields
- `403` - Only teachers can create courses
- `500` - Server error

---

### 2. Get All Courses
Returns all published courses visible to students

```
GET /api/courses
```

**Response:**
```json
{
  "success": true,
  "count": 15,
  "courses": [
    {
      "id": "...",
      "title": "...",
      "status": "Active",
      "...": "more fields"
    }
  ]
}
```

**Response Codes:**
- `200` - Success
- `401` - Unauthorized
- `500` - Server error

---

### 3. Get Teacher's Courses
Returns all courses created by logged-in teacher (including drafts)

```
GET /api/courses/mine
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "courses": [
    {
      "id": "...",
      "title": "...",
      "status": "Draft",
      "teacher": "teacher_id"
    }
  ]
}
```

**Note:** This includes both Draft and Published courses

---

### 4. Get Course by ID
Get specific course details

```
GET /api/courses/:id
```

**Response Codes:**
- `200` - Success
- `404` - Course not found

---

### 5. Update Course ⭐ NEW
Update course details (only by course creator)

```
PATCH /api/courses/:id
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body (all fields optional):**
```json
{
  "title": "string",
  "description": "string",
  "concept": "string",
  "contentType": "Video|PDF|Notes",
  "videoUrl": "string",
  "modules": "number",
  "status": "Active|Draft|Published"
}
```

**Response Codes:**
- `200` - Successfully updated
- `400` - Invalid data
- `403` - Not authorized (not course creator)
- `404` - Course not found
- `500` - Server error

**Validation Rules:**
- Title, description, concept cannot be empty
- Status must be one of: Active, Draft, Published
- Modules must be ≥ 1
- Only course creator can update

---

### 6. Publish Course ⭐ NEW
Change course status from Draft to Active (publicly visible)

```
PUT /api/courses/:id/publish
Authorization: Bearer {token}
```

**Request Body:** (empty)

**Response:**
```json
{
  "success": true,
  "message": "Course published successfully",
  "course": {
    "id": "...",
    "status": "Active",
    "...": "other fields"
  }
}
```

**Response Codes:**
- `200` - Successfully published
- `400` - Course missing required fields
- `403` - Not authorized
- `404` - Course not found
- `500` - Server error

**Validation:**
- Course must have title, description, and concept
- Only course creator can publish
- Automatically sets status to Active

---

### 7. Delete Course
Delete a course (only by course creator)

```
DELETE /api/courses/:id
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

**Response Codes:**
- `200` - Successfully deleted
- `403` - Not authorized
- `404` - Course not found

---

## 💡 Common Use Cases

### Use Case 1: Create and Publish Immediately
```javascript
// Create course with Active status
const response = await fetch('/api/courses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'React Basics',
    description: 'Learn React fundamentals',
    concept: 'Understanding JSX and Components',
    status: 'Active'  // Publishes immediately
  })
});
```

### Use Case 2: Create Draft, Edit, Then Publish
```javascript
// Step 1: Create as Draft
const createRes = await fetch('/api/courses', {
  method: 'POST',
  body: JSON.stringify({
    title: 'Python Advanced',
    description: '...',
    concept: '...',
    status: 'Draft'  // Not visible to students yet
  })
});
const courseId = (await createRes.json()).course.id;

// Step 2: Update course details
await fetch(`/api/courses/${courseId}`, {
  method: 'PATCH',
  body: JSON.stringify({
    modules: 10,
    videoUrl: 'https://...'
  })
});

// Step 3: Publish when ready
await fetch(`/api/courses/${courseId}/publish`, {
  method: 'PUT'
});
```

### Use Case 3: Change Status to Draft from Active
```javascript
// Revert published course back to draft
await fetch(`/api/courses/${courseId}`, {
  method: 'PATCH',
  body: JSON.stringify({
    status: 'Draft'  // Makes it invisible to students
  })
});
```

---

## 🔐 Authorization & Permissions

### Course Access Rules
| Action | Student | Teacher (Owner) | Teacher (Other) | Admin |
|--------|---------|-----------------|-----------------|-------|
| View Published Courses | ✅ | ✅ | ✅ | ✅ |
| View Draft Courses | ❌ | ✅ (own) | ❌ | ❌ |
| Create Course | ❌ | ✅ | ✅ | ✅ |
| Edit Course | ❌ | ✅ (own) | ❌ | ❌ |
| Publish Course | ❌ | ✅ (own) | ❌ | ❌ |
| Delete Course | ❌ | ✅ (own) | ❌ | ❌ |

---

## ⚠️ Error Handling

### Common Error Responses

**400 - Bad Request**
```json
{
  "message": "Title, description, and concept are required"
}
```

**403 - Forbidden**
```json
{
  "message": "You can only update your own courses"
}
```

**404 - Not Found**
```json
{
  "message": "Course not found"
}
```

**500 - Server Error**
```json
{
  "message": "Error message from database"
}
```

---

## 📊 Course Status Flow

```
┌─────────────────────────────────────┐
│   CREATE COURSE (POST /courses)     │
│   Default Status: Draft             │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   EDIT COURSE (PATCH /courses/:id)  │
│   Update fields, can change status  │
└────────────┬────────────────────────┘
             │
         ┌───┴───┐
         │       │
         ▼       ▼
    [Draft]   [Active]
    Hidden    Published
   to        to all
  students   students
         │       │
         ▼       ▼
    ┌──────────────────────┐
    │  DELETE COURSE       │
    │  (DELETE /courses)   │
    └──────────────────────┘
```

---

## 🚀 Migration Notes

### Changes from Previous Version
1. ✅ Added `updateCourse` function for PATCH requests
2. ✅ Added `publishCourse` function for PUT requests
3. ✅ Added 'Published' to status enum
4. ✅ Changed default status from 'Active' to 'Draft'
5. ✅ Added route for `/courses/:id` PATCH
6. ✅ Added route for `/courses/:id/publish` PUT

### Backward Compatibility
- Existing courses can still be created with status: 'Active'
- All querystrings, response formats remain same
- New endpoints are additions, not breaking changes

---

## 🧪 Testing the API

### Using cURL

**Create Draft Course:**
```bash
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Course",
    "description": "Test Description",
    "concept": "Test Concept",
    "status": "Draft"
  }'
```

**Update Course:**
```bash
curl -X PATCH http://localhost:5000/api/courses/COURSE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "modules": 8,
    "videoUrl": "https://youtube.com/watch?v=test"
  }'
```

**Publish Course:**
```bash
curl -X PUT http://localhost:5000/api/courses/COURSE_ID/publish \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📝 Notes

- All timestamps (createdAt, updatedAt) are automatically managed by MongoDB
- Token must be valid JWT from authentication
- Response always includes success flag
- All string fields are trimmed before storage
- Modules cannot be less than 1

---

Last Updated: April 2, 2026  
API Version: 2.0
